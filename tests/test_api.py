import json
import os
import sqlite3
import tempfile
import unittest
from io import BytesIO

import app as app_module
from app import app as flask_app
from database.db import init_db


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = os.path.join(self.temp_dir.name, 'test-hospital.db')
        flask_app.config['SQLITE_DB_PATH'] = self.db_path
        init_db(self.db_path)
        self.client = flask_app.test_client()

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_appointment_route_uses_configured_db_path(self):
        response = self.client.post(
            '/api/appointments',
            json={
                'name': 'Jane Doe',
                'phone': '1234567890',
                'department': 'Cardiology',
                'message': 'Need an appointment',
            },
        )

        self.assertEqual(response.status_code, 201)

        conn = sqlite3.connect(self.db_path)
        try:
            count = conn.execute('SELECT COUNT(*) FROM appointments').fetchone()[0]
        finally:
            conn.close()

        self.assertEqual(count, 1)

    def test_init_db_seeds_doctor_catalog(self):
        conn = sqlite3.connect(self.db_path)
        try:
            count = conn.execute('SELECT COUNT(*) FROM doctors').fetchone()[0]
        finally:
            conn.close()

        self.assertGreater(count, 0)
        self.assertGreaterEqual(count, 18)

    def test_portal_add_doctors_lists_db_doctors(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-doctors')
        self.assertEqual(response.status_code, 200)
        self.assertIn('USHA SHRESTHA', response.get_data(as_text=True))

    def test_portal_add_doctors_does_not_show_duplicate_names(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO doctors (name, specialty, experience, bio) VALUES (?, ?, ?, ?)',
            ('USHA SHRESTHA', 'Duplicate Specialty', 'Duplicate Experience', 'Duplicate Bio')
        )
        conn.execute(
            'INSERT INTO doctors (name, specialty, experience, bio) VALUES (?, ?, ?, ?)',
            ('USHA SHRESTHA', 'Duplicate Specialty 2', 'Duplicate Experience 2', 'Duplicate Bio 2')
        )
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-doctors')
        text = response.get_data(as_text=True)
        self.assertEqual(text.count('USHA SHRESTHA'), 1)

    def test_portal_departments_does_not_show_duplicate_names(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO departments (name, description) VALUES (?, ?)',
            ('Cardiology', 'Duplicate entry 1')
        )
        conn.execute(
            'INSERT INTO departments (name, description) VALUES (?, ?)',
            ('cardiology', 'Duplicate entry 2')
        )
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-departments')
        text = response.get_data(as_text=True)
        self.assertEqual(text.count('Cardiology'), 1)

    def test_portal_dashboard_shows_rich_summary_cards(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute('INSERT INTO departments (name, description) VALUES (?, ?)', ('Neurology', 'Added department'))
        conn.execute('INSERT INTO services (name, description, sort_order) VALUES (?, ?, ?)', ('New Service', 'New service desc', 101))
        conn.execute('INSERT INTO health_packages (name, price, description, tests) VALUES (?, ?, ?, ?)', ('Premium Care', 'Rs. 2,000/-', 'Premium care plan', '[]'))
        conn.execute('INSERT INTO suggestions (name, phone, email, message, category) VALUES (?, ?, ?, ?, ?)', ('Visitor', '9800000000', 'visitor@example.com', 'Good service', 'General'))
        conn.execute('INSERT INTO news_events (title, description, event_type, event_date, event_time, location) VALUES (?, ?, ?, ?, ?, ?)', ('Anniversary', 'Launch', 'Event', '2026-09-01', '10:00 AM', 'Main Hall'))
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Total Doctors', html)
        self.assertIn('Total Departments', html)
        self.assertIn('Total Services', html)
        self.assertIn('Health Packages', html)
        self.assertIn('Suggestions', html)
        self.assertIn('News & Events', html)

    def test_portal_doctors_page_has_add_and_list_tabs(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-doctors')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Add Doctor', html)
        self.assertIn('Doctor List', html)
        self.assertIn('id="tab-add"', html)
        self.assertIn('id="tab-list"', html)

    def test_portal_departments_page_has_add_and_list_tabs(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-departments')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Add Department', html)
        self.assertIn('Department List', html)
        self.assertIn('id="tab-add"', html)
        self.assertIn('id="tab-list"', html)

    def test_api_services_returns_ordered_service_list(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO services (name, description, sort_order) VALUES (?, ?, ?)',
            ('Priority Service', 'Priority service description', 1)
        )
        conn.execute(
            'INSERT INTO services (name, description, sort_order) VALUES (?, ?, ?)',
            ('Later Service', 'Later service description', 2)
        )
        conn.execute(
            'INSERT INTO services (name, description, sort_order) VALUES (?, ?, ?)',
            ('First Service', 'First service description', 0)
        )
        conn.commit()
        conn.close()

        response = self.client.get('/api/services')
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        custom_names = [
            item['name'] for item in payload['services']
            if item['name'] in {'First Service', 'Priority Service', 'Later Service'}
        ]
        self.assertEqual(custom_names, ['First Service', 'Priority Service', 'Later Service'])

    def test_portal_services_page_uses_department_style_and_sidebar_state(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/services')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Our Services', html)
        self.assertIn('nav-item active', html)
        self.assertIn('background: rgba(20, 30, 92, 0.06);', html)
        self.assertIn('Service List', html)

    def test_portal_settings_page_persists_contact_details(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            '/portal/settings',
            data={
                'phone': '+977-9812345678',
                'email': 'info@vinayakhospital.com',
                'location': 'Bharatpur, Chitwan',
            },
            follow_redirects=True,
        )
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('+977-9812345678', html)
        self.assertIn('info@vinayakhospital.com', html)
        self.assertIn('Bharatpur, Chitwan', html)

        conn = sqlite3.connect(self.db_path)
        try:
            row = conn.execute('SELECT phone, email, location FROM site_settings WHERE id = 1').fetchone()
        finally:
            conn.close()

        self.assertIsNotNone(row)
        self.assertEqual(row[0], '+977-9812345678')
        self.assertEqual(row[1], 'info@vinayakhospital.com')
        self.assertEqual(row[2], 'Bharatpur, Chitwan')

    def test_portal_account_update_redirects_with_success_flag(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'favtechsolutions'

        response = self.client.post(
            '/portal/settings',
            data={
                'settings_form_type': 'account',
                'current_username': 'favtechsolutions',
                'new_username': 'admin_updated',
            },
            follow_redirects=False,
        )

        self.assertEqual(response.status_code, 302)
        self.assertIn('account_updated=1', response.location)

    def test_flask_secret_is_not_hardcoded_default(self):
        self.assertNotEqual(flask_app.config.get('SECRET_KEY'), 'vinayak-hospital-portal-secret')
        self.assertTrue(flask_app.config.get('SECRET_KEY'))

    def test_cors_does_not_allow_wildcard_in_production_defaults(self):
        cors_resources = flask_app.config.get('CORS_RESOURCES', {})
        self.assertIsInstance(cors_resources, dict)
        self.assertNotIn('*', str(cors_resources))

    def test_health_package_delete_page_uses_sweetalert_confirmation(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-health-packages')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Swal.fire', html)
        self.assertIn('Are you sure?', html)
        self.assertIn('This health package will be deleted permanently.', html)

    def test_portal_add_doctor_accepts_uploaded_image_file(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            '/portal/add-doctors',
            data={
                'name': 'Dr. Upload Test',
                'specialty': 'General Medicine',
                'experience': '7 years',
                'bio': 'Test doctor bio',
                'doctor_image': (BytesIO(b'fake-image-bytes'), 'doctor-upload.png'),
            },
            content_type='multipart/form-data',
            follow_redirects=False,
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, '/portal/add-doctors')
        self.assertTrue(app_module.DOCTOR_IMAGE_BY_NAME.get('dr. upload test', '').startswith('/image/doctors/'))

    def test_portal_can_create_new_doctor_department_and_health_package_entries(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        doctor_response = self.client.post(
            '/portal/add-doctors',
            data={
                'name': 'New Doctor Example',
                'specialty': 'General Medicine',
                'experience': '6 years',
                'bio': 'New doctor bio',
                'image_url': '/image/dr_test.png',
            },
            follow_redirects=False,
        )
        self.assertEqual(doctor_response.status_code, 302)
        self.assertEqual(doctor_response.location, '/portal/add-doctors')

        department_response = self.client.post(
            '/portal/add-departments',
            data={
                'name': 'Neurology',
                'description': 'Neurology department entry',
            },
            follow_redirects=False,
        )
        self.assertEqual(department_response.status_code, 302)
        self.assertEqual(department_response.location, '/portal/add-departments')

        package_response = self.client.post(
            '/portal/add-health-packages',
            data={
                'name': 'Family Care Plan',
                'price': 'Rs. 4,500/-',
                'description': 'Family plan description',
                'tests': 'CBC\nX-Ray\nECG',
            },
            follow_redirects=False,
        )
        self.assertEqual(package_response.status_code, 302)
        self.assertEqual(package_response.location, '/portal/add-health-packages')

        conn = sqlite3.connect(self.db_path)
        try:
            doctor_count = conn.execute('SELECT COUNT(*) FROM doctors WHERE name = ?', ('New Doctor Example',)).fetchone()[0]
            department_count = conn.execute('SELECT COUNT(*) FROM departments WHERE name = ?', ('Neurology',)).fetchone()[0]
            package_count = conn.execute('SELECT COUNT(*) FROM health_packages WHERE name = ?', ('Family Care Plan',)).fetchone()[0]
        finally:
            conn.close()

        self.assertEqual(doctor_count, 1)
        self.assertEqual(department_count, 1)
        self.assertEqual(package_count, 1)

    def test_portal_health_packages_show_edit_and_delete_actions(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-health-packages')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Edit', html)
        self.assertIn('Delete', html)

    def test_portal_health_packages_page_has_add_and_list_tabs(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-health-packages')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Add Health Package', html)
        self.assertIn('Health Package List', html)
        self.assertIn('id="tab-add"', html)
        self.assertIn('id="tab-list"', html)

    def test_portal_bod_edit_uses_change_image_button(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        edit_response = self.client.get('/portal/add-bod/1/edit')
        self.assertEqual(edit_response.status_code, 200)
        html = edit_response.get_data(as_text=True)
        self.assertIn('Change Image', html)
        self.assertNotIn('Image URL', html)
        self.assertIn('type="file"', html)
        self.assertNotIn('input id="image" name="image" value=', html)

    def test_portal_bod_actions_are_working(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        edit_response = self.client.get('/portal/add-bod/1/edit')
        self.assertEqual(edit_response.status_code, 200)
        self.assertIn('Edit Board Member', edit_response.get_data(as_text=True))

        update_response = self.client.post(
            '/portal/add-bod/1/edit',
            data={
                'name': 'Rajesh Sharma Updated',
                'role': 'Chairperson',
                'description': 'Updated leadership summary',
                'image': '/image/bod2.webp',
            },
            follow_redirects=False,
        )
        self.assertEqual(update_response.status_code, 302)
        self.assertEqual(update_response.location, '/portal/add-bod')
        self.assertEqual(app_module.BOARD_MEMBERS[0]['name'], 'Rajesh Sharma Updated')

        delete_response = self.client.post('/portal/add-bod/1/delete', follow_redirects=False)
        self.assertEqual(delete_response.status_code, 302)
        self.assertEqual(delete_response.location, '/portal/add-bod')
        self.assertTrue(all(member['name'] != 'Rajesh Sharma Updated' for member in app_module.BOARD_MEMBERS))

    def test_portal_news_event_edit_page_does_not_render_video_url_field(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ('Community Webinar', 'Live webinar for mothers', '', 'https://example.com/video.mp4', 'Event', '2083-05-28', 'Main Hall')
        )
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/news-and-events/1/edit')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertNotIn('name="video_url"', html)
        self.assertNotIn('<label for="video_url">Video URL</label>', html)

    def test_portal_add_notes_route_displays_notes_tabs(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-notes')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Add Notes', html)
        self.assertIn('Notes List', html)
        self.assertIn('site_note_image', html)

    def test_portal_add_notes_submit_redirects_to_add_notes_page(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            '/portal/news-and-events/note',
            data={'site_note_image': (BytesIO(b'fake-image-data'), 'note.png')},
            content_type='multipart/form-data',
            follow_redirects=False,
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, '/portal/add-notes')

    def test_portal_sidebars_use_exact_page_links_without_stale_note_redirects(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-doctors')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('href="/portal/news-and-event"', html)
        self.assertIn('href="/portal/add-notes"', html)
        self.assertNotIn("window.location.href = '/portal/add-notes'", html)

    def test_portal_sidebar_has_news_events_dropdown_on_non_news_pages(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-doctors')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('class="nav-item-wrap news-events-wrap"', html)
        self.assertIn('class="news-events-dropdown"', html)
        self.assertIn('class="news-events-menu-link"', html)

    def test_news_events_page_keeps_real_sidebar_links_and_no_stale_redirects(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/news-and-event')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('href="/portal/news-and-event"', html)
        self.assertIn('href="/portal/add-notes"', html)
        self.assertNotIn("window.location.href = '/portal/add-notes'", html)
        self.assertNotIn("window.location.href = \"/portal/add-notes\"", html)

    def test_portal_bod_sidebar_uses_canonical_news_events_dropdown(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/add-bod')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('class="nav-item-wrap news-events-wrap"', html)
        self.assertIn('button type="button" class="news-events-menu-link active"', html)
        self.assertNotIn('class="news-events-menu-link" href="/portal/news-and-event"', html)

    def test_news_events_upload_creates_database_row_and_api_entry(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            '/portal/news-and-event',
            data={
                'title': 'Hospital Open House',
                'description': 'Community open house event',
                'image': (BytesIO(b'fake-image-data'), 'sample.png'),
            },
            content_type='multipart/form-data',
            follow_redirects=True,
        )

        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        row = conn.execute('SELECT COUNT(*) FROM news_events WHERE title = ?', ('Hospital Open House',)).fetchone()[0]
        conn.close()
        self.assertEqual(row, 1)

        api_response = self.client.get('/api/news-events')
        self.assertEqual(api_response.status_code, 200)
        payload = api_response.get_json()
        self.assertGreater(len(payload['news_events']), 0)
        self.assertEqual(payload['news_events'][0]['title'], 'Hospital Open House')

    def test_portal_news_events_video_upload_route_accepts_multiple_files_and_links(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            '/portal/news-and-event/video',
            data={
                'video_title': 'Community Video',
                'video_uploads': [
                    (BytesIO(b'fake-video-data-1'), 'sample-1.mp4'),
                    (BytesIO(b'fake-video-data-2'), 'sample-2.mp4'),
                ],
                'facebook_video_links': ['https://facebook.com/reel/1', 'https://facebook.com/reel/2'],
            },
            content_type='multipart/form-data',
            follow_redirects=True,
        )

        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        count = conn.execute('SELECT COUNT(*) FROM news_events WHERE video_url IS NOT NULL').fetchone()[0]
        conn.close()
        self.assertGreaterEqual(count, 2)

    def test_portal_news_events_status_toggle_updates_active_state(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO news_events (title, description, image_url, is_active) VALUES (?, ?, ?, ?)',
            ('Status Test Event', 'This item can be toggled', '/image/test.jpg', 1)
        )
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post('/portal/news-and-event/1/status', data={'is_active': '0'}, follow_redirects=True)
        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        row = conn.execute('SELECT is_active FROM news_events WHERE id = 1').fetchone()
        conn.close()
        self.assertEqual(row[0], 0)

    def test_portal_news_events_renders_saved_facebook_links_in_form(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ('Saved Facebook Link', 'Facebook item', '', 'https://facebook.com/reel/abc123', 'Video', None, None, None, None, 1)
        )
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/news-and-event')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('value="https://facebook.com/reel/abc123"', html)

    def test_deduplicate_video_entries_keeps_unique_default_facebook_links(self):
        from app import _deduplicate_video_entries

        items = [
            {'href': 'https://www.facebook.com/reel/1395354859357441/?s=fb_shorts_profile&stack_idx=0'},
            {'href': 'https://www.facebook.com/reel/1395354859357441/?s=fb_shorts_profile&stack_idx=0'},
            {'href': 'https://www.facebook.com/reel/694074612985442/?s=fb_shorts_profile&stack_idx=0'},
        ]

        deduped = _deduplicate_video_entries(items)
        self.assertEqual(len(deduped), 2)
        self.assertEqual(
            {item['href'] for item in deduped},
            {
                'https://www.facebook.com/reel/1395354859357441/?s=fb_shorts_profile&stack_idx=0',
                'https://www.facebook.com/reel/694074612985442/?s=fb_shorts_profile&stack_idx=0',
            },
        )

    def test_news_event_videos_can_be_reordered_and_api_returns_in_order(self):
        conn = sqlite3.connect(self.db_path)
        inserted = []
        for title in ['Video 1', 'Video 2', 'Video 3']:
            cursor = conn.execute(
                'INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                (title, title, '', f'/image/news_events/{title.lower().replace(" ", "-")}.mp4', 'Video', None, None, None, None, 1, 1)
            )
            inserted.append(cursor.lastrowid)
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        reorder_response = self.client.post(
            '/portal/news-and-event/videos/reorder',
            json={'video_ids': [inserted[2], inserted[0], inserted[1]]},
            content_type='application/json',
        )
        self.assertEqual(reorder_response.status_code, 200)

        api_response = self.client.get('/api/news-events')
        self.assertEqual(api_response.status_code, 200)
        order = [item['id'] for item in api_response.get_json()['news_events'] if item['video_url'] and '/image/news_events/' in item['video_url']]
        self.assertEqual(order[:3], [inserted[2], inserted[0], inserted[1]])

    def test_portal_news_events_video_list_separates_uploaded_and_facebook_videos(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ('Uploaded Video', 'Uploaded item', '', '/image/news_events/sample.mp4', 'Video', None, None, None, None, 1)
        )
        conn.execute(
            'INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ('Facebook Reel', 'Facebook item', '', 'https://www.facebook.com/reel/1395354859357441/?s=fb_shorts_profile&stack_idx=0', 'Video', None, None, None, None, 1)
        )
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/news-and-event')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Uploaded Videos', html)
        self.assertIn('Facebook Videos', html)

    def test_portal_site_note_upload_creates_database_row_and_api_returns_it(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            '/portal/news-and-event/note',
            data={'site_note_image': (BytesIO(b'fake-note-image-data'), 'note.png')},
            content_type='multipart/form-data',
            follow_redirects=True,
        )

        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        count = conn.execute('SELECT COUNT(*) FROM site_notes').fetchone()[0]
        row = conn.execute('SELECT image_url FROM site_notes ORDER BY created_at DESC LIMIT 1').fetchone()
        conn.close()

        self.assertEqual(count, 1)
        self.assertTrue(row[0].startswith('/image/'))

        api_response = self.client.get('/api/site-notes')
        self.assertEqual(api_response.status_code, 200)
        payload = api_response.get_json()
        self.assertGreaterEqual(len(payload['notes']), 1)
        self.assertTrue(payload['notes'][0]['image_url'].startswith('/image/'))

    def test_portal_site_note_delete_route_removes_note_record(self):
        conn = sqlite3.connect(self.db_path)
        note_id = conn.execute(
            'INSERT INTO site_notes (image_url) VALUES (?)',
            ('/image/notes/delete-check.png',)
        ).lastrowid
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(f'/portal/news-and-event/note/{note_id}/delete', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        remaining = conn.execute('SELECT COUNT(*) FROM site_notes WHERE id = ?', (note_id,)).fetchone()[0]
        conn.close()
        self.assertEqual(remaining, 0)

    def test_portal_note_upload_accepts_display_duration_days(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            '/portal/news-and-event/note',
            data={
                'site_note_image': (BytesIO(b'fake-note-image-data'), 'duration-note.png'),
                'display_days': '12',
            },
            content_type='multipart/form-data',
            follow_redirects=False,
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, '/portal/add-notes')

        conn = sqlite3.connect(self.db_path)
        row = conn.execute('SELECT display_days FROM site_notes ORDER BY created_at DESC LIMIT 1').fetchone()
        conn.close()

        self.assertIsNotNone(row)
        self.assertEqual(row[0], 12)

    def test_portal_news_events_page_displays_add_card_form_fields(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/news-and-event')
        self.assertEqual(response.status_code, 200)

        html = response.get_data(as_text=True)
        self.assertIn('<div class="add-card-title">Add Card</div>', html)
        self.assertIn('<section class="add-card">', html)
        self.assertIn('<div class="table-wrap">', html)
        self.assertIn('name="title"', html)
        self.assertIn('name="description"', html)
        self.assertIn('name="event_type"', html)
        self.assertIn('name="event_date"', html)
        self.assertIn('name="location"', html)
        self.assertIn('name="image"', html)
        self.assertNotIn('name="event_time"', html)
        self.assertNotIn('name="video_url"', html)
        self.assertIn('data-panel="add">', html)
        self.assertIn('data-panel="list">', html)
        self.assertLess(
            html.find('data-panel="add">Add Card</button>'),
            html.find('data-panel="list">Card List</button>')
        )
        self.assertLess(
            html.find('<div class="tab-panel active" id="tab-add">'),
            html.find('<div class="tab-panel" id="tab-list">')
        )
        self.assertIn('class="news-events-dropdown"', html)
        dropdown_start = html.index('class="news-events-dropdown"')
        dropdown_html = html[dropdown_start:dropdown_start + 800]
        self.assertIn('data-panel="add"', dropdown_html)
        self.assertIn('Add Card', dropdown_html)
        self.assertIn('data-panel="image"', dropdown_html)
        self.assertIn('Image Gallery', dropdown_html)
        self.assertIn('data-panel="video"', dropdown_html)
        self.assertIn('Video Gallery', dropdown_html)
        self.assertNotIn('Card List', dropdown_html)
        self.assertNotIn('Gallery Photo', html)
        self.assertNotIn('Gallery Video', html)

    def test_portal_news_events_keeps_gallery_header_in_api_response(self):
        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            '/portal/news-and-event',
            data={
                'title': 'Gallery image title',
                'description': 'Gallery image description',
                'gallery_header': 'Annual Blood Donation',
                'image': (BytesIO(b'fake-image-data'), 'gallery.png'),
            },
            content_type='multipart/form-data',
            follow_redirects=True,
        )
        self.assertEqual(response.status_code, 200)

        api_response = self.client.get('/api/news-events')
        self.assertEqual(api_response.status_code, 200)
        payload = api_response.get_json()['news_events']
        self.assertTrue(any(item.get('gallery_header') == 'Annual Blood Donation' for item in payload))

    def test_portal_news_events_lists_stored_video_links(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO news_events (title, description, image_url, video_url) VALUES (?, ?, ?, ?)',
            ('Community Webinar', 'Live webinar for mothers', '/image/news_events/example.jpg', 'https://example.com/video.mp4')
        )
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/news-and-event')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('Community Webinar', html)
        self.assertIn('https://example.com/video.mp4', html)
        self.assertIn('View video', html)

    def test_portal_news_events_lists_bs_date_from_nepali_json_and_hides_time_column(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            'INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            ('Community Webinar', 'Live webinar for mothers', '/image/news_events/example.jpg', 'https://example.com/video.mp4', 'Event', '2026-08-12', '10:00 AM', 'Main Hall')
        )
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.get('/portal/news-and-event')
        self.assertEqual(response.status_code, 200)

        html = response.get_data(as_text=True)
        self.assertNotIn('<th>Time</th>', html)
        self.assertIn('2083-05-28', html)

    def test_news_events_edit_route_updates_database_row(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute(
            'INSERT INTO news_events (title, description, event_type, event_date, event_time, location, video_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ('Old Event', 'Old description', 'News', '01 Jan 2025', '10:00 AM', 'Hall A', 'https://example.com/old-video.mp4')
        )
        event_id = cursor.lastrowid
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            f'/portal/news-and-event/{event_id}/edit',
            data={
                'title': 'Updated Event',
                'description': 'Updated information',
                'event_type': 'Event',
                'event_date': '02 Feb 2025',
                'event_time': '02:30 PM',
                'location': 'Conference Hall',
                'video_url': 'https://example.com/new-video.mp4',
            },
            follow_redirects=True,
        )

        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        row = conn.execute(
            'SELECT title, description, event_type, event_date, event_time, location, video_url FROM news_events WHERE id = ?',
            (event_id,)
        ).fetchone()
        conn.close()

        self.assertEqual(row[0], 'Updated Event')
        self.assertEqual(row[1], 'Updated information')
        self.assertEqual(row[2], 'Event')
        self.assertEqual(row[3], '02 Feb 2025')
        self.assertEqual(row[4], '02:30 PM')
        self.assertEqual(row[5], 'Conference Hall')
        self.assertEqual(row[6], 'https://example.com/new-video.mp4')

    def test_health_packages_can_be_reordered_and_api_returns_in_order(self):
        conn = sqlite3.connect(self.db_path)
        inserted = []
        for name in ['Plan A', 'Plan B', 'Plan C']:
            cursor = conn.execute(
                'INSERT INTO health_packages (name, price, description, tests, sort_order) VALUES (?, ?, ?, ?, ?)',
                (name, 'Rs. 100/-', f'Description for {name}', json.dumps([name]), 1)
            )
            inserted.append(cursor.lastrowid)
        conn.commit()
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        reorder_response = self.client.post(
            '/portal/add-health-packages/reorder',
            json={'package_ids': [inserted[2], inserted[0], inserted[1]]},
            content_type='application/json',
        )
        self.assertEqual(reorder_response.status_code, 200)

        response = self.client.get('/portal/add-health-packages')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertLess(html.find('Plan C'), html.find('Plan A'))

        api_response = self.client.get('/api/health-packages')
        self.assertEqual(api_response.status_code, 200)
        order = [item['name'] for item in api_response.get_json()['packages'] if item['name'] in {'Plan A', 'Plan B', 'Plan C'}]
        self.assertEqual(order[:3], ['Plan C', 'Plan A', 'Plan B'])

    def test_health_package_edit_route_updates_database_row(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute(
            'INSERT INTO health_packages (name, price, description, tests) VALUES (?, ?, ?, ?)',
            ('Custom Plan', 'Rs. 1,000/-', 'Custom health plan', json.dumps(['Test A', 'Test B']))
        )
        package_id = cursor.lastrowid
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            f'/portal/add-health-packages/{package_id}/edit',
            data={
                'name': 'Updated Plan',
                'price': 'Rs. 2,000/-',
                'description': 'Updated description',
                'tests': 'Test X\nTest Y\nTest Z',
            },
            follow_redirects=True,
        )

        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        row = conn.execute(
            'SELECT name, price, description, tests FROM health_packages WHERE id = ?',
            (package_id,)
        ).fetchone()
        conn.close()

        self.assertEqual(row[0], 'Updated Plan')
        self.assertEqual(row[1], 'Rs. 2,000/-')
        self.assertEqual(row[2], 'Updated description')
        self.assertEqual(json.loads(row[3]), ['Test X', 'Test Y', 'Test Z'])

    def test_health_package_delete_route_removes_database_row(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute(
            'INSERT INTO health_packages (name, price, description, tests) VALUES (?, ?, ?, ?)',
            ('Delete Plan', 'Rs. 500/-', 'Delete me', json.dumps(['Delete A']))
        )
        package_id = cursor.lastrowid
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            f'/portal/add-health-packages/{package_id}/delete',
            follow_redirects=True,
        )

        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        row = conn.execute('SELECT COUNT(*) FROM health_packages WHERE id = ?', (package_id,)).fetchone()[0]
        conn.close()

        self.assertEqual(row, 0)

    def test_doctor_edit_route_updates_database_row(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute(
            'INSERT INTO doctors (name, specialty, experience, bio) VALUES (?, ?, ?, ?)',
            ('Test Doctor', 'Old Specialty', '5 years', 'Old bio')
        )
        doctor_id = cursor.lastrowid
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            f'/portal/add-doctors/{doctor_id}/edit',
            data={
                'name': 'Updated Test Doctor',
                'specialty': 'New Specialty',
                'experience': '8 years',
                'bio': 'Updated bio',
            },
            follow_redirects=True,
        )

        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        row = conn.execute(
            'SELECT name, specialty, experience, bio FROM doctors WHERE id = ?',
            (doctor_id,)
        ).fetchone()
        conn.close()

        self.assertEqual(row[0], 'Updated Test Doctor')
        self.assertEqual(row[1], 'New Specialty')
        self.assertEqual(row[2], '8 years')
        self.assertEqual(row[3], 'Updated bio')

    def test_doctor_delete_route_removes_database_row(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute(
            'INSERT INTO doctors (name, specialty, experience, bio) VALUES (?, ?, ?, ?)',
            ('Delete Test Doctor', 'Specialty', '3 years', 'Bio')
        )
        doctor_id = cursor.lastrowid
        conn.close()

        with self.client.session_transaction() as session:
            session['logged_in'] = True
            session['username'] = 'vinayak'

        response = self.client.post(
            f'/portal/add-doctors/{doctor_id}/delete',
            follow_redirects=True,
        )

        self.assertEqual(response.status_code, 200)

        conn = sqlite3.connect(self.db_path)
        row = conn.execute('SELECT COUNT(*) FROM doctors WHERE id = ?', (doctor_id,)).fetchone()[0]
        conn.close()

        self.assertEqual(row, 0)


if __name__ == '__main__':
    unittest.main()

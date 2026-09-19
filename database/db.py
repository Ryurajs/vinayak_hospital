import json
import os
import sqlite3
from werkzeug.security import generate_password_hash


def get_connection(db_path):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def deduplicate_doctors(conn):
    conn.execute(
        '''
        DELETE FROM doctors
        WHERE id NOT IN (
            SELECT MIN(id)
            FROM doctors
            GROUP BY LOWER(TRIM(name))
        )
        '''
    )
    conn.commit()


def deduplicate_departments(conn):
    conn.execute(
        '''
        DELETE FROM departments
        WHERE id NOT IN (
            SELECT MIN(id)
            FROM departments
            GROUP BY LOWER(TRIM(name))
        )
        '''
    )
    conn.commit()


def deduplicate_health_packages(conn):
    conn.execute(
        '''
        DELETE FROM health_packages
        WHERE id NOT IN (
            SELECT id
            FROM (
                SELECT id,
                       ROW_NUMBER() OVER (
                           PARTITION BY LOWER(TRIM(name))
                           ORDER BY LENGTH(COALESCE(tests, '')) DESC, id ASC
                       ) AS rn
                FROM health_packages
            )
            WHERE rn = 1
        )
        '''
    )
    conn.commit()


def init_db(db_path='database/hospital.db'):
    os.makedirs(os.path.dirname(db_path) or '.', exist_ok=True)
    conn = get_connection(db_path)
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            department TEXT NOT NULL,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    appointment_columns = conn.execute('PRAGMA table_info(appointments)').fetchall()
    if not any(column['name'] == 'phone' for column in appointment_columns):
        conn.execute('ALTER TABLE appointments ADD COLUMN phone TEXT')
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS contact_inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    existing_columns = conn.execute('PRAGMA table_info(contact_inquiries)').fetchall()
    if not any(column['name'] == 'source_url' for column in existing_columns):
        conn.execute(
            '''
            ALTER TABLE contact_inquiries ADD COLUMN source_url TEXT
            '''
        )

    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS suggestions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            message TEXT NOT NULL,
            category TEXT,
            source_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    suggestion_columns = conn.execute('PRAGMA table_info(suggestions)').fetchall()
    if not any(column['name'] == 'category' for column in suggestion_columns):
        conn.execute('ALTER TABLE suggestions ADD COLUMN category TEXT')
    if not any(column['name'] == 'source_url' for column in suggestion_columns):
        conn.execute('ALTER TABLE suggestions ADD COLUMN source_url TEXT')
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL,
            experience TEXT,
            bio TEXT
        )
        '''
    )
    doctor_seed = [
        ('USHA SHRESTHA', 'Obstetrics & Gynaecology', 'Obstetrics & Gynaecology', "Women's reproductive health and maternity care."),
        ('Heempali Dutta', 'Ear, Nose & Throat Disorders and Surgery', 'ENT Surgery', 'Comprehensive ENT care and surgery.'),
        ('Shiva Kumar Shrestha', 'Child & Adolescent Healthcare', 'Pediatrics', 'Child and adolescent healthcare specialist.'),
        ('Rajesh Chaudhary', 'Bone, Joint & Muscle Disorders', 'Orthopaedic Surgery', 'Bone, joint, and musculoskeletal specialist.'),
        ('Yam PSD. Dwa', "Women's Reproductive Health, Pregnancy & Childbirth", 'Obstetrics & Gynaecology', 'Maternity and reproductive health expert.'),
        ('Manoj Kumar Sah', 'Emergency & Acute Care', 'Emergency', 'Emergency and acute care physician.'),
        ('Prof. Dr. Bidhan Nidhi Poudel', 'Gastrointestinal & Liver Disorders', 'Gastro Medicine', 'Gastrointestinal and liver specialist.'),
        ('Darshan Kumar Gurung', 'Senior Cardiology & Internal Medicine', 'Cardiology', 'Cardiology and internal medicine specialist.'),
        ('Ram Krishna Rajbhandari', 'Skin, Hair, Nail & Related Disorders', 'Dermatology & Venereology', 'Dermatology and venereology specialist.'),
        ('Shuvash Acharya', 'Ear, Nose & Throat Disorders and Surgery', 'ENT Surgery', 'ENT surgery and related care.'),
        ('Prabha Gyawali', 'Oral Health & Dental Care', 'Dental', 'Dental care and oral health services.'),
        ('Pralhad Chalise', 'Bone, Joint & Muscle Disorders', 'Orthopaedic Surgery', 'Orthopaedic surgical care and rehabilitation support.'),
        ('Shamrant B. Baniya', 'Emergency & Trauma Care', 'Emergency', 'Trauma and emergency medicine specialist.'),
        ('Parmeshwar Sah.', 'Urinary Tract & Male Reproductive Disorders', 'Uro Surgery', 'Urological surgery and male reproductive health care.'),
        ('Manoranjan Dwa', 'General Surgical Conditions & Procedures', 'General Surgery', 'General surgery specialist.'),
        ('MANOJ KHATRI', 'Physiotherapy', 'Physiotherapist', 'Physiotherapy and rehabilitation care.'),
        ('NARAYAN BIKRAM THAPA', 'Radiology', 'Radiologist', 'Radiology and imaging services.'),
        ('DEEPAK SHARMA', 'Gastro Surgery', 'Gastro Surgery', 'Gastro surgery and digestive disease care.'),
    ]
    conn.executemany(
        '''
        INSERT OR IGNORE INTO doctors (name, specialty, experience, bio)
        VALUES (?, ?, ?, ?)
        ''',
        doctor_seed
    )
    deduplicate_doctors(conn)
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        )
        '''
    )
    deduplicate_departments(conn)
    conn.execute(
        '''
        CREATE UNIQUE INDEX IF NOT EXISTS idx_departments_name_unique
        ON departments (LOWER(TRIM(name)))
        '''
    )
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            sort_order INTEGER DEFAULT 0
        )
        '''
    )
    service_columns = conn.execute('PRAGMA table_info(services)').fetchall()
    if not any(column['name'] == 'sort_order' for column in service_columns):
        conn.execute('ALTER TABLE services ADD COLUMN sort_order INTEGER DEFAULT 0')
    conn.execute(
        '''
        CREATE UNIQUE INDEX IF NOT EXISTS idx_services_name_unique
        ON services (LOWER(TRIM(name)))
        '''
    )
    department_seed = [
        ('Emergency Department', 'Round-the-clock emergency medical services for acute illness, trauma, and urgent stabilization.'),
        ('Obstetrics & Gynaecology', "Women's health and maternity care."),
        ('Burn & Plastic Surgery', 'Burn care, reconstruction, and scar management.'),
        ('Cardiology', 'Heart and cardiovascular care.'),
        ('Chest Physician', 'Respiratory and chest care.'),
        ('Dental Department', 'Dental and oral care services.'),
        ('Dermatology & Venereology', 'Skin, hair, and venereology care.'),
        ('Dietitian', 'Nutrition and wellness guidance.'),
        ('Cardiovascular Surgery', 'Heart and vascular surgical care.'),
        ('Emergency', 'Immediate urgent response care.'),
        ('Endocrinology', 'Hormonal and metabolic care.'),
        ('ENT Surgery', 'Ear, nose, and throat surgical and clinical care.'),
        ('Gastro Medicine', 'Digestive and gastrointestinal medical care.'),
        ('Gastro Surgery', 'Surgical digestive care and recovery support.'),
        ('General Medicine', 'Primary care and preventive health services.'),
        ('Maxillofacial Surgery', 'Jaw, face, and oral surgical services.'),
        ('Nephrology', 'Kidney and renal care.'),
        ('Neuropsychiatry', 'Neurological and psychiatric integrated care.'),
        ('Neurosurgery', 'Brain and spine surgical care.'),
        ('Ophthalmology', 'Eye and vision care services.'),
        ('Orthopaedic Surgery', 'Bones, joints, and musculoskeletal care.'),
        ('Pain Physician', 'Pain management and recovery planning.'),
        ('Pediatrics', 'Child and adolescent healthcare.'),
        ('Physician Gastroenterology', 'Digestive and liver disease management.'),
        ('Physician Department', 'Comprehensive physician-led clinical care.'),
        ('Psychiatry', 'Mental health and behavioral care.'),
        ('Radiology', 'Imaging and diagnostic radiology.'),
        ('General Surgery', 'General surgical care and procedures.'),
        ('Urosurgery', 'Urological surgical care and treatment.'),
        ('Critical Care', 'Intensive medical monitoring and life support.'),
        ('Maternity Care', 'Pregnancy, delivery, and postnatal support.'),
        ('Diagnostic Services', 'Laboratory and diagnostic support services.'),
        ('Respiratory Medicine', 'Lung and breathing support services.'),
        ('Plastic Surgery', 'Cosmetic and reconstructive surgical care.'),
    ]
    conn.executemany(
        '''
        INSERT OR IGNORE INTO departments (name, description)
        VALUES (?, ?)
        ''',
        department_seed
    )
    service_seed = [
        ('Emergency Services', 'Round-the-clock emergency care and trauma support.', 1),
        ('Maternity Services', 'Antenatal, delivery, and postnatal care for mothers and babies.', 2),
        ('Diagnostic Services', 'Laboratory, imaging, and testing support for accurate care.', 3),
        ('OPD Services', 'Outpatient consultations, routine checkups, and follow-ups.', 4),
        ('Dental Services', 'General and specialized dental care for oral health.', 5),
        ('Pharmacy Services', 'Medication guidance, prescriptions, and supportive care.', 6),
    ]
    conn.executemany(
        '''
        INSERT OR IGNORE INTO services (name, description, sort_order)
        VALUES (?, ?, ?)
        ''',
        service_seed
    )
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS portal_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    conn.execute(
        '''
        INSERT OR IGNORE INTO portal_users (username, password_hash, full_name)
        VALUES (?, ?, ?)
        ''',
        ('favtechsolutions', generate_password_hash('nuttertools@123'), 'Master Admin')
    )

    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS news_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            video_url TEXT,
            event_type TEXT,
            event_date TEXT,
            event_time TEXT,
            location TEXT,
            gallery_header TEXT,
            is_active INTEGER DEFAULT 1,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS site_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT NOT NULL,
            display_days INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS hidden_gallery_images (
            image_url TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS gallery_image_order (
            image_url TEXT PRIMARY KEY,
            sort_order INTEGER NOT NULL DEFAULT 0
        )
        '''
    )
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS hidden_gallery_videos (
            video_url TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    site_note_columns = conn.execute('PRAGMA table_info(site_notes)').fetchall()
    if not any(column['name'] == 'display_days' for column in site_note_columns):
        conn.execute('ALTER TABLE site_notes ADD COLUMN display_days INTEGER DEFAULT 0')
    if not any(column['name'] == 'created_at' for column in site_note_columns):
        conn.execute('ALTER TABLE site_notes ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS site_settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            phone TEXT,
            email TEXT,
            location TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    conn.execute(
        '''
        INSERT OR IGNORE INTO site_settings (id, phone, email, location)
        VALUES (1, '977-14983152, 01-4981071, 9851013439', 'vinayakhospital052@gmail.com', 'Gongabu, Kathmandu, Nepal')
        '''
    )
    news_event_columns = conn.execute('PRAGMA table_info(news_events)').fetchall()
    if not any(column['name'] == 'video_url' for column in news_event_columns):
        conn.execute('ALTER TABLE news_events ADD COLUMN video_url TEXT')
    if not any(column['name'] == 'event_type' for column in news_event_columns):
        conn.execute('ALTER TABLE news_events ADD COLUMN event_type TEXT')
    if not any(column['name'] == 'event_date' for column in news_event_columns):
        conn.execute('ALTER TABLE news_events ADD COLUMN event_date TEXT')
    if not any(column['name'] == 'event_time' for column in news_event_columns):
        conn.execute('ALTER TABLE news_events ADD COLUMN event_time TEXT')
    if not any(column['name'] == 'location' for column in news_event_columns):
        conn.execute('ALTER TABLE news_events ADD COLUMN location TEXT')
    if not any(column['name'] == 'gallery_header' for column in news_event_columns):
        conn.execute('ALTER TABLE news_events ADD COLUMN gallery_header TEXT')
    if not any(column['name'] == 'is_active' for column in news_event_columns):
        conn.execute('ALTER TABLE news_events ADD COLUMN is_active INTEGER DEFAULT 1')
    if not any(column['name'] == 'sort_order' for column in news_event_columns):
        conn.execute('ALTER TABLE news_events ADD COLUMN sort_order INTEGER DEFAULT 0')

    seed_news_events = [
        {
            'title': 'Vinayak Hospital launches free maternal health awareness camp',
            'description': 'A community-focused health camp was organized to support pregnant mothers with screening, consultations, and awareness on safe delivery practices.',
            'image_url': None,
            'video_url': None,
            'event_type': 'News',
            'event_date': '2026-08-12',
            'event_time': '10:00 AM',
            'location': 'Main Hospital Hall',
        },
        {
            'title': 'Annual blood donation drive for emergency preparedness',
            'description': 'Our team is organizing a city-wide blood donation campaign to strengthen emergency medical support and strengthen community care.',
            'image_url': None,
            'video_url': None,
            'event_type': 'Event',
            'event_date': '2026-08-24',
            'event_time': '9:00 AM',
            'location': 'Hospital Campus',
        },
        {
            'title': 'New pediatric consultation services now available',
            'description': 'Parents can now access extended pediatric consultation hours for routine checkups, immunization guidance, and newborn care counselling.',
            'image_url': None,
            'video_url': None,
            'event_type': 'News',
            'event_date': '2026-09-05',
            'event_time': '1:30 PM',
            'location': 'Pediatrics Wing',
        },
    ]
    for event in seed_news_events:
        existing = conn.execute('SELECT id FROM news_events WHERE title = ?', (event['title'],)).fetchone()
        if existing is None:
            conn.execute(
                '''
                INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                (event['title'], event['description'], event['image_url'], event['video_url'], event['event_type'], event['event_date'], event['event_time'], event['location'])
            )

    default_facebook_video_links = [
        {
            'title': 'Hospital overview',
            'video_url': 'https://www.facebook.com/reel/694074612985442/?s=fb_shorts_profile&stack_idx=0',
            'event_type': 'Video',
        },
        {
            'title': 'Patient care',
            'video_url': 'https://www.facebook.com/reel/2658723724543366/?s=fb_shorts_profile&stack_idx=0',
            'event_type': 'Video',
        },
        {
            'title': 'Maternity care',
            'video_url': 'https://www.facebook.com/reel/855728020513358/?s=fb_shorts_profile&stack_idx=0',
            'event_type': 'Video',
        },
        {
            'title': 'Modern facilities',
            'video_url': 'https://www.facebook.com/reel/1395354859357441/?s=fb_shorts_profile&stack_idx=0',
            'event_type': 'Video',
        },
    ]
    for video in default_facebook_video_links:
        existing = conn.execute('SELECT id FROM news_events WHERE video_url = ?', (video['video_url'],)).fetchone()
        if existing is None:
            conn.execute(
                '''
                INSERT INTO news_events (title, description, image_url, video_url, event_type, event_date, event_time, location, gallery_header, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                (video['title'], '', None, video['video_url'], video['event_type'], None, None, None, None, 1)
            )

    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS health_packages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price TEXT NOT NULL,
            description TEXT,
            tests TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0
        )
        '''
    )
    health_package_columns = conn.execute('PRAGMA table_info(health_packages)').fetchall()
    if not any(column['name'] == 'sort_order' for column in health_package_columns):
        conn.execute('ALTER TABLE health_packages ADD COLUMN sort_order INTEGER DEFAULT 0')
    deduplicate_health_packages(conn)
    conn.execute('DROP INDEX IF EXISTS idx_health_packages_name_unique')
    conn.execute(
        '''
        CREATE UNIQUE INDEX idx_health_packages_name_unique
        ON health_packages (LOWER(TRIM(name)))
        '''
    )

    package_seed = [
        (
            'Basic Plan',
            'Rs. 3,800/-',
            'WHOLE BODY CHECKUP PLAN (A)',
            json.dumps([
                'WHOLE BODY CHECKUP PLAN (A)',
                'CXR-PA',
                'USG ABDOMEN AND PELVIS',
                'BLOOD GROUP',
                'CBC',
                'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
                'RBS',
                'RFT (UREA, CRET, NA, K)',
                'URIC ACID',
                'STOOL RE/ME',
                'URINE RE/ME',
            ])
        ),
        (
            'Standard Plan',
            'Rs. 7,100/-',
            'WHOLE BODY CHECKUP PLAN (B)',
            json.dumps([
                'WHOLE BODY CHECKUP PLAN (B)',
                'USG ABDOMEN AND PELVIS',
                'ECG',
                'CXR-PA',
                'BLOOD GROUP',
                'CBC',
                'FASTING (SUGAR)',
                'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
                'LIPID PROFILE',
                'RFT (UREA, CRET, NA, K)',
                'TFT',
                'URIC ACID',
                'ANTI HCV (IMMUNOCHROMATOGRAPHY)',
                'HBSAG IMMUNOCHROMATOGRAPHY',
                'HIV (IMMUNOCHROMATOGRAPHY)',
                'VDRL',
                'STOOL RE/ME',
                'URINE RE/ME',
                'TPHA',
            ])
        ),
        (
            'Premium Plan',
            'Rs. 9,700/-',
            'WHOLE BODY CHECKUP PLAN (C)',
            json.dumps([
                'WHOLE BODY CHECKUP PLAN (C)',
                'USG ABDOMEN AND PELVIS',
                'CXR-PA',
                'ECG',
                'ECHO',
                'BLOOD GROUP',
                'CBC',
                'FASTING (SUGAR)',
                'HbA1c',
                'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
                'LIPID PROFILE',
                'RFT (UREA, CRET, NA, K)',
                'TFT',
                'URIC ACID',
                'ANTI HCV (IMMUNOCHROMATOGRAPHY)',
                'HBSAG IMMUNOCHROMATOGRAPHY',
                'HIV (IMMUNOCHROMATOGRAPHY)',
                'TPHA',
                'VDRL',
                'STOOL RE/ME',
                'URINE RE/ME',
            ])
        ),
    ]
    conn.executemany(
        '''
        INSERT OR IGNORE INTO health_packages (name, price, description, tests, sort_order)
        VALUES (?, ?, ?, ?, ?)
        ''',
        [(name, price, description, tests, index) for index, (name, price, description, tests) in enumerate(package_seed, start=1)]
    )
    conn.commit()
    conn.close()


def get_portal_user(username, db_path='database/hospital.db'):
    conn = get_connection(db_path)
    user = conn.execute(
        'SELECT * FROM portal_users WHERE username = ?',
        (username,)
    ).fetchone()
    conn.close()
    return dict(user) if user else None


def get_departments(db_path='database/hospital.db'):
    conn = get_connection(db_path)
    rows = conn.execute(
        'SELECT id, name, description FROM departments ORDER BY name COLLATE NOCASE ASC'
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_health_packages(db_path='database/hospital.db'):
    conn = get_connection(db_path)
    deduplicate_health_packages(conn)
    rows = conn.execute(
        'SELECT id, name, price, description, tests FROM health_packages ORDER BY COALESCE(sort_order, 999999), id ASC'
    ).fetchall()
    conn.close()

    packages = []
    for row in rows:
        package = dict(row)
        package['tests'] = json.loads(package['tests']) if isinstance(package['tests'], str) else package['tests']
        packages.append(package)
    return packages

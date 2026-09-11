from flask import Blueprint, current_app, jsonify, request
from database.db import get_connection

contacts_bp = Blueprint('contacts', __name__)


@contacts_bp.post('/contact')
def create_contact():
    payload = request.get_json(silent=True) or {}
    name = (payload.get('name') or '').strip()
    phone = (payload.get('phone') or '').strip()
    email = (payload.get('email') or '').strip()
    message = (payload.get('message') or '').strip()
    category = (payload.get('category') or '').strip()
    source_url = (payload.get('source_url') or payload.get('sourceUrl') or '').strip()

    if not name or not phone or not message:
        return jsonify({"error": "name, phone, and message are required"}), 400

    db_path = current_app.config.get('SQLITE_DB_PATH', 'database/hospital.db')
    conn = get_connection(db_path)
    cursor = conn.execute(
        'INSERT INTO suggestions (name, phone, email, message, category, source_url) VALUES (?, ?, ?, ?, ?, ?)',
        (name, phone, email, message, category or None, source_url or None),
    )
    conn.execute(
        'INSERT INTO contact_inquiries (name, phone, email, message, source_url) VALUES (?, ?, ?, ?, ?)',
        (name, phone, email, message, source_url or None),
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "inquiry_id": cursor.lastrowid}), 201


@contacts_bp.get('/contact')
def list_contacts():
    db_path = current_app.config.get('SQLITE_DB_PATH', 'database/hospital.db')
    conn = get_connection(db_path)
    rows = conn.execute(
        'SELECT id, name, phone, email, message, category, source_url, created_at FROM suggestions ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

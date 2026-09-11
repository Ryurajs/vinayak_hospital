from flask import Blueprint, current_app, jsonify, request
from database.db import get_connection

appointments_bp = Blueprint('appointments', __name__)


@appointments_bp.post('/appointments')
def create_appointment():
    payload = request.get_json(silent=True) or {}
    name = (payload.get('name') or '').strip()
    phone = (payload.get('phone') or '').strip()
    department = (payload.get('department') or '').strip()
    message = (payload.get('message') or '').strip()

    if not name or not phone or not department:
        return jsonify({"error": "name, phone, and department are required"}), 400

    db_path = current_app.config.get('SQLITE_DB_PATH', 'database/hospital.db')
    conn = get_connection(db_path)
    cursor = conn.execute(
        'INSERT INTO appointments (name, phone, department, message) VALUES (?, ?, ?, ?)',
        (name, phone, department, message),
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "appointment_id": cursor.lastrowid}), 201


@appointments_bp.get('/appointments')
def list_appointments():
    db_path = current_app.config.get('SQLITE_DB_PATH', 'database/hospital.db')
    conn = get_connection(db_path)
    rows = conn.execute(
        'SELECT id, name, phone, department, message, created_at FROM appointments ORDER BY created_at DESC'
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

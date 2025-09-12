"""Rotas da API para envio de notificações"""
from flask import Blueprint, request, jsonify
from src.services.notification_service import notification_service

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@notifications_bp.route('/register', methods=['POST'])
def register_token():
    data = request.get_json() or {}
    token = data.get('token')
    if not token:
        return jsonify({'error': 'Token é obrigatório'}), 400
    notification_service.register_token(token)
    return jsonify({'success': True}), 201

@notifications_bp.route('/send', methods=['POST'])
def send_notification():
    data = request.get_json() or {}
    title = data.get('title', 'JustDive')
    message = data.get('message', '')
    notification_service.send_notification(title, message)
    return jsonify({'success': True})

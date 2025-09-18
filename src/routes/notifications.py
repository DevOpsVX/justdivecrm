"""
Routes for managing push notifications.

This module exposes endpoints to register Expo push tokens and to send
notifications from the server.  It also retains the existing mock
notification endpoint for testing.
"""

from flask import Blueprint, jsonify, request

from ..services.notification_service import notification_service

notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('/notifications/mock', methods=['GET'])
def mock_notification():
    """Return a sample notification payload for testing."""
    return jsonify({
        'title': 'JustDive Notification',
        'body': 'This is a test notification from the API.'
    })


@notifications_bp.route('/notifications/register', methods=['POST'])
def register_token():
    """
    Register a device push token so the server can send notifications to it later.

    The frontend should call this endpoint and send a JSON body containing
    the Expo push token, e.g. {"token": "ExponentPushToken[...]"}.
    """
    data = request.get_json() or {}
    token = data.get('token')
    if not token:
        return jsonify({'error': 'token required'}), 400
    notification_service.register_token(token)
    return jsonify({'message': 'token registered'}), 200


@notifications_bp.route('/notifications/send', methods=['POST'])
def send_notification():
    """
    Send a push notification to all registered devices.

    Accepts a JSON body with optional "title" and "body" fields. If not
    provided, defaults are used. The notification_service will iterate over
    all registered tokens and send the message via Expo's push API.
    """
    data = request.get_json() or {}
    title = data.get('title', 'JustDive Notification')
    body = data.get('body', '')
    notification_service.send_notification(title, body)
    return jsonify({'message': 'notifications sent'}), 200

from flask import Blueprint, jsonify

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/notifications/mock', methods=['GET'])
def mock_notification():
    """Return a sample notification payload for testing."""
    return jsonify({
        'title': 'JustDive Notification',
        'body': 'This is a test notification from the API.'
    })

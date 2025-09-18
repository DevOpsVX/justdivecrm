from flask import Blueprint, jsonify, request
from src.models.user import User, db

user_bp = Blueprint('user', __name__)

DEMO_USERS = {
    'student@justdive.com': {
        'password': 'student',
        'profile': 'student'
    },
    'admin@justdive.com': {
        'password': 'admin',
        'profile': 'admin'
    }
}


@user_bp.route('/users/login', methods=['POST'])
def login_user():
    data = request.get_json(silent=True) or {}

    email = data.get('email', '').strip().lower()
    password = data.get('password')
    requested_profile = data.get('userType')

    if not email or not password:
        return jsonify({'message': 'Missing credentials'}), 400

    demo_user = DEMO_USERS.get(email)

    if not demo_user or demo_user['password'] != password:
        return jsonify({'message': 'Invalid credentials'}), 401

    profile = demo_user['profile']

    if requested_profile and requested_profile != profile:
        return jsonify({'message': 'Invalid credentials'}), 401

    token = f"{profile}-demo-token"

    return jsonify({'token': token, 'profile': profile}), 200


@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users', methods=['POST'])
def create_user():
    
    data = request.json
    user = User(username=data['username'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

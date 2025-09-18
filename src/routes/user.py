import secrets

from flask import Blueprint, jsonify, request

from src.models.user import User, db

user_bp = Blueprint('user', __name__)


DEMO_USERS = {
    'student': {
        'email': 'student@justdive.com',
        'password': 'student',
    },
    'admin': {
        'email': 'admin@justdive.com',
        'password': 'admin',
    },
}

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


@user_bp.route('/users/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    requested_profile = (data.get('userType') or '').strip().lower()

    if not email or not password:
        return jsonify({'message': 'Email e palavra-passe são obrigatórios.'}), 400

    for profile, credentials in DEMO_USERS.items():
        if requested_profile and profile != requested_profile:
            continue

        if email == credentials['email'] and password == credentials['password']:
            token = secrets.token_urlsafe(32)
            return jsonify({'token': token, 'profile': profile})

    return jsonify({'message': 'Credenciais inválidas.'}), 401

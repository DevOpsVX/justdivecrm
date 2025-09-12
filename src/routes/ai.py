"""Rotas para interação com a IA"""
from flask import Blueprint, request, jsonify
from src.services.openai_service import openai_service

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    messages = data.get('messages')
    if not messages:
        return jsonify({'error': 'messages é obrigatório'}), 400

    try:
        response = openai_service.generate_chat_response(messages)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': 'Erro ao gerar resposta', 'details': str(e)}), 500

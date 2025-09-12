"""Rotas da API para interações com IA"""
from flask import Blueprint, request, jsonify
from src.services.openai_service import openai_service

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Endpoint de chat simples com o serviço OpenAI"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Mensagem é obrigatória'}), 400

        message = data['message']
        response_text = openai_service.chat(message)
        return jsonify({'success': True, 'response': response_text})
    except Exception as e:
        return jsonify({'error': 'Erro ao processar mensagem', 'details': str(e)}), 500

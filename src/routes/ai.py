"""Rotas da API para interações com IA"""
from flask import Blueprint, request, jsonify
from src.services.openai_service import openai_service

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Endpoint de chat simples com o serviço OpenAI"""
    try:
        data = request.get_json() or {}
        message = data.get('message')

        if message is None:
            messages = data.get('messages')
            if isinstance(messages, list) and messages:
                # Tenta obter o conteúdo da última mensagem do histórico
                for item in reversed(messages):
                    if isinstance(item, dict) and item.get('content'):
                        message = item['content']
                        break

        if not message:
            return jsonify({'error': 'Mensagem é obrigatória'}), 400

        response_text = openai_service.chat(message)
        return jsonify({'success': True, 'response': response_text})
    except Exception as e:
        return jsonify({'error': 'Erro ao processar mensagem', 'details': str(e)}), 500

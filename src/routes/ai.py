"""Rotas da API para interações com IA."""
from __future__ import annotations

import json
from typing import Any, Iterable

from flask import Blueprint, jsonify, request

from src.services.openai_service import openai_service


ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')


def _normalize_message(message: Any, messages: Any) -> str | None:
    """Normaliza diferentes estruturas de payload em texto simples."""

    if message is not None and message != "":
        return str(message)

    if messages is None:
        return None

    parsed_messages: Any = messages

    if isinstance(messages, str):
        try:
            parsed_messages = json.loads(messages)
        except json.JSONDecodeError:
            return messages

    if isinstance(parsed_messages, Iterable) and not isinstance(parsed_messages, (str, bytes, dict)):
        normalized_chunks: list[str] = []
        for item in parsed_messages:
            if isinstance(item, dict):
                role = item.get('role', 'user')
                content = item.get('content', '')
                chunk = f"{role}: {content}".strip()
            else:
                chunk = str(item).strip()

            if chunk:
                normalized_chunks.append(chunk)

        if normalized_chunks:
            return "\n".join(normalized_chunks)
        return None

    return str(parsed_messages)


@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Endpoint de chat simples com o serviço OpenAI."""

    try:
        data = request.get_json(silent=True) or {}
        normalized_message = _normalize_message(data.get('message'), data.get('messages'))

        if not normalized_message:
            return jsonify({'error': 'Mensagem é obrigatória'}), 400

        response_text = openai_service.chat(normalized_message)
        return jsonify({'success': True, 'response': response_text})
    except Exception as exc:  # pragma: no cover - tratamento genérico
        return jsonify({'error': 'Erro ao processar mensagem', 'details': str(exc)}), 500


"""
Rotas da API para funcionalidades meteorológicas
"""
from flask import Blueprint, request, jsonify
from src.services.weather_service import weather_service
from src.services.supabase_service import supabase_service
from src.services.openai_service import openai_service
from src.services.notification_service import notification_service
from src.utils.weather import normalize_conditions
from datetime import datetime

weather_bp = Blueprint('weather', __name__, url_prefix='/api/weather')

@weather_bp.route('/current/<location>', methods=['GET'])
def get_current_weather(location):
    """
    Obtém condições meteorológicas atuais para um local
    """
    try:
        weather_data = weather_service.get_weather_data(location)
        
        if not weather_data:
            return jsonify({
                'error': 'Local não encontrado',
                'available_locations': list(weather_service.locations.keys())
            }), 404
        
        # Salvar dados no histórico (opcional)
        try:
            supabase_service.save_weather_data(weather_data)
        except Exception as e:
            print(f"Erro ao salvar no Supabase: {e}")
        
        return jsonify({
            'success': True,
            'data': weather_data
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@weather_bp.route('/all', methods=['GET'])
def get_all_locations_weather():
    """
    Obtém condições meteorológicas para todos os locais
    """
    try:
        all_weather = weather_service.get_all_locations_weather()
        
        return jsonify({
            'success': True,
            'data': all_weather,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@weather_bp.route('/force-status', methods=['POST'])
def force_weather_status():
    """
    Força um status específico para demonstração
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados JSON necessários'}), 400
        
        location = data.get('location')
        status = data.get('status')
        note = data.get('note', 'Status forçado para demonstração')
        
        if not location or not status:
            return jsonify({'error': 'Location e status são obrigatórios'}), 400
        
        if status not in ['GREEN', 'YELLOW', 'RED']:
            return jsonify({'error': 'Status deve ser GREEN, YELLOW ou RED'}), 400
        
        forced_data = weather_service.force_status(location, status, note)

        # Salvar no histórico
        try:
            supabase_service.save_weather_data(forced_data)
        except Exception as e:
            print(f"Erro ao salvar no Supabase: {e}")

        notification_service.send_notification(
            'Atualização meteorológica',
            f"{location} agora {status}"
        )

        return jsonify({
            'success': True,
            'data': forced_data
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@weather_bp.route('/analysis/<location>', methods=['GET'])
def get_weather_analysis(location):
    """
    Obtém análise IA das condições meteorológicas
    """
    try:
        # Obter dados meteorológicos atuais
        weather_data = weather_service.get_weather_data(location)
        
        if not weather_data:
            return jsonify({
                'error': 'Local não encontrado',
                'available_locations': list(weather_service.locations.keys())
            }), 404
        
        # Gerar análise com IA
        analysis = openai_service.analyze_weather_conditions(weather_data)
        
        return jsonify({
            'success': True,
            'weather_data': weather_data,
            'ai_analysis': analysis
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@weather_bp.route('/history/<location>', methods=['GET'])
def get_weather_history(location):
    """
    Obtém histórico meteorológico de um local
    """
    try:
        hours = request.args.get('hours', 24, type=int)
        
        history = supabase_service.get_weather_history(location, hours)
        
        return jsonify({
            'success': True,
            'location': location,
            'hours': hours,
            'data': history
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@weather_bp.route('/locations', methods=['GET'])
def get_available_locations():
    """
    Lista locais disponíveis para consulta meteorológica
    """
    try:
        locations = []
        for key, coords in weather_service.locations.items():
            locations.append({
                'key': key,
                'name': key.title(),
                'coordinates': coords
            })
        
        return jsonify({
            'success': True,
            'locations': locations
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@weather_bp.route('/widget/<location>', methods=['GET'])
def get_weather_widget_data(location):
    """
    Dados otimizados para widget PWA
    """
    try:
        weather_data = weather_service.get_weather_data(location)
        
        if not weather_data:
            return jsonify({'error': 'Local não encontrado'}), 404
        
        # Dados simplificados para widget
        conditions = normalize_conditions(weather_data)

        widget_data = {
            'location': weather_data['location'],
            'status': weather_data['status'],
            'status_text': {
                'GREEN': 'Condições Excelentes',
                'YELLOW': 'Atenção Necessária',
                'RED': 'Mergulho Cancelado'
            }.get(weather_data['status'], 'Status Desconhecido'),
            'wave_height': conditions.get('wave_height'),
            'wind_speed': conditions.get('wind_speed'),
            'next_update': weather_data['next_update'],
            'timestamp': weather_data['timestamp']
        }
        
        return jsonify({
            'success': True,
            'widget': widget_data
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500


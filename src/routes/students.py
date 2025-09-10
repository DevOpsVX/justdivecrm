"""
Rotas da API para gestão de estudantes
"""
from flask import Blueprint, request, jsonify
from src.services.supabase_service import supabase_service
from src.services.openai_service import openai_service
from src.utils.encryption import encrypt_sensitive_data, decrypt_sensitive_data
from datetime import datetime

students_bp = Blueprint('students', __name__, url_prefix='/api/students')

@students_bp.route('/', methods=['GET'])
def get_all_students():
    """
    Lista todos os estudantes com filtros opcionais
    """
    try:
        # Obter parâmetros de filtro
        status = request.args.get('status')
        certification = request.args.get('certification')
        search = request.args.get('search')
        
        filters = {}
        if status:
            filters['status'] = status
        if certification:
            filters['certification_level'] = certification
        
        students = supabase_service.get_all_students(filters)
        
        # Aplicar filtro de pesquisa se fornecido
        if search:
            search_lower = search.lower()
            students = [
                student for student in students
                if (search_lower in student.get('name', '').lower() or
                    search_lower in student.get('email', '').lower() or
                    search_lower in student.get('certification_level', '').lower())
            ]
        
        return jsonify({
            'success': True,
            'data': students,
            'total': len(students)
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@students_bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """
    Obtém dados de um estudante específico
    """
    try:
        student = supabase_service.get_student(student_id)
        
        if not student:
            return jsonify({'error': 'Estudante não encontrado'}), 404
        
        return jsonify({
            'success': True,
            'data': student
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@students_bp.route('/', methods=['POST'])
def create_student():
    """
    Cria novo estudante
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados JSON necessários'}), 400
        
        # Validar campos obrigatórios
        required_fields = ['name', 'email', 'phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Definir valores padrão
        student_data = {
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'birth_date': data.get('birth_date'),
            'certification_level': data.get('certification_level', 'Discover Scuba Diving'),
            'total_dives': data.get('total_dives', 0),
            'last_dive': data.get('last_dive'),
            'medical_form': data.get('medical_form', 'pending'),
            'waiver': data.get('waiver', 'pending'),
            'emergency_contact': data.get('emergency_contact'),
            'notes': data.get('notes', ''),
            'status': data.get('status', 'active')
        }
        
        result = supabase_service.create_student(student_data)
        
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify({
            'success': True,
            'data': result
        }), 201
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@students_bp.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """
    Atualiza dados de um estudante
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados JSON necessários'}), 400
        
        result = supabase_service.update_student(student_id, data)
        
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@students_bp.route('/<int:student_id>/recommendations', methods=['GET'])
def get_student_recommendations(student_id):
    """
    Obtém recomendações IA personalizadas para um estudante
    """
    try:
        student = supabase_service.get_student(student_id)
        
        if not student:
            return jsonify({'error': 'Estudante não encontrado'}), 404
        
        recommendations = openai_service.generate_student_recommendations(student)
        
        return jsonify({
            'success': True,
            'student': {
                'id': student_id,
                'name': student.get('name'),
                'certification_level': student.get('certification_level')
            },
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@students_bp.route('/<int:student_id>/progress', methods=['GET'])
def get_student_progress(student_id):
    """
    Analisa progresso do estudante baseado no histórico
    """
    try:
        student = supabase_service.get_student(student_id)
        
        if not student:
            return jsonify({'error': 'Estudante não encontrado'}), 404
        
        # Obter histórico de mergulhos (mock data por enquanto)
        dive_history = [
            {
                'date': '2025-09-01',
                'location': 'Berlengas',
                'max_depth': 18,
                'duration': 45,
                'notes': 'Boa flutuabilidade, precisa melhorar navegação'
            },
            {
                'date': '2025-08-25',
                'location': 'Peniche',
                'max_depth': 15,
                'duration': 40,
                'notes': 'Excelente controlo, confiante na água'
            }
        ]
        
        progress_analysis = openai_service.analyze_student_progress(dive_history)
        
        return jsonify({
            'success': True,
            'student': {
                'id': student_id,
                'name': student.get('name'),
                'total_dives': student.get('total_dives', 0)
            },
            'dive_history': dive_history,
            'progress_analysis': progress_analysis
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@students_bp.route('/stats', methods=['GET'])
def get_students_stats():
    """
    Obtém estatísticas gerais dos estudantes
    """
    try:
        all_students = supabase_service.get_all_students()
        
        stats = {
            'total': len(all_students),
            'active': len([s for s in all_students if s.get('status') == 'active']),
            'inactive': len([s for s in all_students if s.get('status') == 'inactive']),
            'pending_docs': len([s for s in all_students if 
                               s.get('medical_form') == 'pending' or s.get('waiver') == 'pending']),
            'total_dives': sum(s.get('total_dives', 0) for s in all_students),
            'certifications': {}
        }
        
        # Contar certificações
        for student in all_students:
            cert = student.get('certification_level', 'Unknown')
            stats['certifications'][cert] = stats['certifications'].get(cert, 0) + 1
        
        return jsonify({
            'success': True,
            'stats': stats
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@students_bp.route('/export', methods=['GET'])
def export_students():
    """
    Exporta dados dos estudantes (formato simplificado)
    """
    try:
        students = supabase_service.get_all_students()
        
        # Remover dados sensíveis para exportação
        export_data = []
        for student in students:
            export_student = {
                'id': student.get('id'),
                'name': student.get('name'),
                'email': student.get('email'),
                'certification_level': student.get('certification_level'),
                'total_dives': student.get('total_dives', 0),
                'status': student.get('status'),
                'join_date': student.get('created_at', '').split('T')[0] if student.get('created_at') else ''
            }
            export_data.append(export_student)
        
        return jsonify({
            'success': True,
            'data': export_data,
            'exported_at': datetime.utcnow().isoformat(),
            'total_records': len(export_data)
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500


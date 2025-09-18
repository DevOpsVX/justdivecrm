import os
import sys
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from datetime import datetime, timezone

from flask import Flask, jsonify, send_file, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.weather import weather_bp
from src.routes.students import students_bp
from src.routes.notifications import notifications_bp
from src.routes.ai import ai_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

APK_FILENAME = os.getenv('APK_FILENAME', 'justdive-app.apk')
APK_VERSION = os.getenv('APK_VERSION', '1.0.0')

# Configurações
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'justdive-crm-secret-key-2025')

# Habilitar CORS para todas as rotas
CORS(app, origins="*")

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(weather_bp)
app.register_blueprint(students_bp)
app.register_blueprint(notifications_bp, url_prefix='/api')
app.register_blueprint(ai_bp)

# Configuração da base de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

# Rota de saúde da API
@app.route('/api/health')
def health_check():
    return {
        'status': 'healthy',
        'service': 'JUSTDIVE CRM API',
        'version': '1.0.0'
    }


def _format_file_size(num_bytes: int) -> str:
    size = float(num_bytes)
    for unit in ['bytes', 'KB', 'MB', 'GB', 'TB']:
        if size < 1024 or unit == 'TB':
            if unit == 'bytes':
                return f"{int(size)} {unit}"
            return f"{size:.2f} {unit}"
        size /= 1024
    return f"{num_bytes} bytes"


def _locate_apk_file() -> str | None:
    potential_paths = []

    if app.static_folder:
        potential_paths.append(os.path.join(app.static_folder, APK_FILENAME))

    project_root = os.path.dirname(os.path.dirname(__file__))
    potential_paths.append(
        os.path.join(project_root, 'pwa-corrected', 'public', APK_FILENAME)
    )

    for path in potential_paths:
        if os.path.exists(path):
            return path

    return None


@app.route('/api/apk/metadata', methods=['GET'])
def apk_metadata():
    apk_path = _locate_apk_file()

    if not apk_path:
        return (
            jsonify(
                {
                    'available': False,
                    'message': 'APK ainda não está disponível para download.',
                }
            ),
            404,
        )

    stats = os.stat(apk_path)

    return jsonify(
        {
            'available': True,
            'fileName': APK_FILENAME,
            'version': APK_VERSION,
            'sizeBytes': stats.st_size,
            'sizeFormatted': _format_file_size(stats.st_size),
            'downloadUrl': '/api/apk/download',
            'downloadFileName': f'JUSTDIVE-Academy-v{APK_VERSION}.apk',
            'lastModified': datetime.fromtimestamp(stats.st_mtime, tz=timezone.utc).isoformat(),
        }
    )


@app.route('/api/apk/download', methods=['GET'])
def download_apk():
    apk_path = _locate_apk_file()

    if not apk_path:
        return (
            jsonify(
                {
                    'message': 'APK não encontrado. Verifique se o build foi sincronizado.',
                }
            ),
            404,
        )

    return send_file(
        apk_path,
        mimetype='application/vnd.android.package-archive',
        as_attachment=True,
        download_name=f'JUSTDIVE-Academy-v{APK_VERSION}.apk',
        conditional=True,
    )

# Servir ficheiros estáticos e SPA
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)


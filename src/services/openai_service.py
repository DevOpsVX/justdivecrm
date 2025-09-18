"""
Serviço de integração com OpenAI para suporte IA e análise de dados
"""
import os
import openai
from typing import Dict, List, Optional
import json
from datetime import datetime

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        self.api_url = os.getenv('OPENAI_API_URL', 'https://api.openai.com/v1')
        
        # Configurar cliente OpenAI
        openai.api_key = self.api_key
        openai.api_base = self.api_url

        self.model = "gpt-3.5-turbo"

    def chat(self, message: str) -> str:
        """Realiza uma interação simples de chat com o modelo da OpenAI."""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "És um assistente da JUSTDIVE Academy."},
                    {"role": "user", "content": message}
                ],
                max_tokens=300,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Erro no chat OpenAI: {e}")
            return "Desculpe, não foi possível obter resposta da IA no momento."
        
    def analyze_weather_conditions(self, weather_data: Dict) -> Dict:
        """
        Analisa condições meteorológicas e fornece recomendações para mergulho
        """
        try:
            location = weather_data.get('location', 'Local')
            conditions = self._extract_weather_metrics(weather_data)
            
            prompt = f"""
            Como especialista em mergulho marítimo, analise as seguintes condições meteorológicas para {location}:
            
            - Altura das ondas: {conditions.get('wave_height', 0)}m
            - Velocidade do vento: {conditions.get('wind_speed', 0)} kn
            - Rajadas: {conditions.get('gust', 0)} kn
            - Precipitação: {conditions.get('precipitation', 0)}%
            - Visibilidade: {conditions.get('visibility', 10)} km
            - Temperatura da água: {conditions.get('water_temperature', 18)}°C
            
            Forneça uma análise em português de Portugal com:
            1. Avaliação geral das condições (2-3 frases)
            2. Recomendações específicas para mergulhadores (2-3 frases)
            3. Precauções necessárias (se aplicável)
            
            Mantenha o tom profissional mas acessível.
            """
            
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "És um instrutor de mergulho experiente da JUSTDIVE Academy em Portugal."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            analysis = response.choices[0].message.content.strip()
            
            return {
                'analysis': analysis,
                'timestamp': datetime.utcnow().isoformat(),
                'location': location,
                'conditions_analyzed': conditions
            }

        except Exception as e:
            print(f"Erro na análise OpenAI: {e}")
            return self._get_mock_analysis(weather_data)

    def _extract_weather_metrics(self, weather_data: Dict) -> Dict:
        """
        Normaliza as métricas meteorológicas para um formato consistente.

        Prioriza as chaves achatadas fornecidas pelo WeatherService, mantendo
        compatibilidade com payloads mais antigos que utilizavam o campo
        "conditions" com notação snake_case.
        """

        weather_data = weather_data or {}
        nested_conditions = weather_data.get('conditions') or {}

        metric_keys = {
            'wave_height': ('waveHeight', 'wave_height'),
            'wind_speed': ('windSpeed', 'wind_speed'),
            'gust': ('gust', 'wind_gust'),
            'precipitation': ('precipitation',),
            'visibility': ('visibility',),
            'water_temperature': ('waterTemperature', 'water_temperature'),
            'air_temperature': ('airTemperature', 'temperature', 'air_temperature'),
            'wave_period': ('wavePeriod', 'wave_period'),
        }

        defaults = {
            'wave_height': 0.0,
            'wind_speed': 0.0,
            'gust': 0.0,
            'precipitation': 0.0,
            'visibility': 10.0,
            'water_temperature': 18.0,
            'air_temperature': 20.0,
            'wave_period': 0.0,
        }

        def _get_value(keys, default=None):
            for key in keys:
                if key in weather_data and weather_data[key] is not None:
                    return weather_data[key]
                if key in nested_conditions and nested_conditions[key] is not None:
                    return nested_conditions[key]
            return default

        def _round_if_number(value):
            try:
                number = float(value)
                return round(number, 1)
            except (TypeError, ValueError):
                return value

        normalized = {}
        for metric, keys in metric_keys.items():
            value = _get_value(keys, defaults.get(metric))
            normalized[metric] = _round_if_number(value)

        return normalized
    
    def generate_student_recommendations(self, student_data: Dict) -> Dict:
        """
        Gera recomendações personalizadas para estudantes baseado no seu perfil
        """
        try:
            certification = student_data.get('certification_level', 'Open Water Diver')
            total_dives = student_data.get('total_dives', 0)
            last_dive = student_data.get('last_dive', 'Nunca')
            
            prompt = f"""
            Como instrutor da JUSTDIVE Academy, crie recomendações personalizadas para um estudante com:
            
            - Certificação: {certification}
            - Total de mergulhos: {total_dives}
            - Último mergulho: {last_dive}
            
            Forneça em português de Portugal:
            1. Próximos passos na progressão (1-2 frases)
            2. Cursos recomendados (1-2 sugestões específicas)
            3. Dicas de melhoria (2-3 dicas práticas)
            
            Seja encorajador e específico para o nível do estudante.
            """
            
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "És um instrutor experiente da JUSTDIVE Academy que conhece bem a progressão de certificações PADI."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=250,
                temperature=0.8
            )
            
            recommendations = response.choices[0].message.content.strip()
            
            return {
                'recommendations': recommendations,
                'timestamp': datetime.utcnow().isoformat(),
                'student_level': certification,
                'total_dives': total_dives
            }
            
        except Exception as e:
            print(f"Erro nas recomendações OpenAI: {e}")
            return self._get_mock_recommendations(student_data)
    
    def create_personalized_message(self, template: str, student_data: Dict, context: Dict = None) -> str:
        """
        Personaliza mensagens usando IA baseado no perfil do estudante
        """
        try:
            name = student_data.get('name', 'Estudante')
            certification = student_data.get('certification_level', 'Open Water Diver')
            
            prompt = f"""
            Personalize esta mensagem para {name}, que tem certificação {certification}:
            
            Template: "{template}"
            
            Contexto adicional: {json.dumps(context or {}, ensure_ascii=False)}
            
            Torne a mensagem mais pessoal e relevante, mantendo o tom profissional da JUSTDIVE Academy.
            Responda apenas com a mensagem personalizada em português de Portugal.
            """
            
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "És um assistente da JUSTDIVE Academy que personaliza comunicações para estudantes de mergulho."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.6
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Erro na personalização OpenAI: {e}")
            return template  # Retorna template original em caso de erro
    
    def analyze_student_progress(self, student_history: List[Dict]) -> Dict:
        """
        Analisa o progresso do estudante e sugere melhorias
        """
        try:
            if not student_history:
                return {'analysis': 'Histórico insuficiente para análise.'}
            
            # Preparar dados do histórico
            history_summary = []
            for dive in student_history[-5:]:  # Últimos 5 mergulhos
                history_summary.append({
                    'date': dive.get('date'),
                    'location': dive.get('location'),
                    'depth': dive.get('max_depth'),
                    'duration': dive.get('duration'),
                    'notes': dive.get('notes', '')
                })
            
            prompt = f"""
            Analise o progresso deste estudante de mergulho baseado nos últimos mergulhos:
            
            {json.dumps(history_summary, ensure_ascii=False, indent=2)}
            
            Forneça em português de Portugal:
            1. Análise do progresso (2-3 frases)
            2. Pontos fortes identificados (1-2 pontos)
            3. Áreas para melhoria (1-2 sugestões)
            4. Próximos objetivos recomendados (1-2 objetivos)
            
            Seja construtivo e motivador.
            """
            
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "És um instrutor experiente da JUSTDIVE Academy que acompanha o progresso dos estudantes."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            analysis = response.choices[0].message.content.strip()
            
            return {
                'analysis': analysis,
                'timestamp': datetime.utcnow().isoformat(),
                'dives_analyzed': len(history_summary)
            }
            
        except Exception as e:
            print(f"Erro na análise de progresso OpenAI: {e}")
            return {
                'analysis': 'Não foi possível analisar o progresso no momento. Tente novamente mais tarde.',
                'error': str(e)
            }

    def generate_chat_response(self, messages: List[Dict[str, str]]) -> str:
        """Gera uma resposta de chat genérica usando OpenAI"""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=messages,
                max_tokens=200,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Erro no chat OpenAI: {e}")
            return "Desculpe, ocorreu um erro ao gerar a resposta."
    
    def _get_mock_analysis(self, weather_data: Dict) -> Dict:
        """
        Retorna análise fictícia quando OpenAI não está disponível
        """
        status = weather_data.get('status', 'GREEN')
        location = weather_data.get('location', 'Local')
        conditions = self._extract_weather_metrics(weather_data)

        mock_analyses = {
            'GREEN': (
                f"As condições em {location} estão excelentes para mergulho. Ondas calmas e boa visibilidade "
                "proporcionam um ambiente ideal para todas as atividades subaquáticas. Recomendamos aproveitar "
                "estas condições favoráveis para mergulhos de exploração e treino de técnicas."
            ),
            'YELLOW': (
                f"As condições em {location} requerem atenção especial. Ondas moderadas e vento podem afetar a "
                "experiência de mergulho. Recomendamos que apenas mergulhadores experientes participem, com "
                "equipamento adequado e supervisão próxima."
            ),
            'RED': (
                f"As condições em {location} não são seguras para mergulho. Ondas altas e vento forte criam riscos "
                "significativos. Todas as atividades de mergulho devem ser suspensas até que as condições melhorem."
            ),
        }

        return {
            'analysis': mock_analyses.get(status, mock_analyses['GREEN']),
            'timestamp': datetime.utcnow().isoformat(),
            'location': location,
            'conditions_analyzed': conditions,
            'mock_data': True
        }
    
    def _get_mock_recommendations(self, student_data: Dict) -> Dict:
        """
        Retorna recomendações fictícias quando OpenAI não está disponível
        """
        certification = student_data.get('certification_level', 'Open Water Diver')
        total_dives = student_data.get('total_dives', 0)
        
        if total_dives < 10:
            recommendations = "Continue a praticar as técnicas básicas de flutuabilidade e navegação subaquática. Recomendamos o curso Peak Performance Buoyancy para melhorar o controlo na água. Foque-se em mergulhos em águas calmas para ganhar confiança."
        elif total_dives < 25:
            recommendations = "Está pronto para expandir as suas competências com o curso Advanced Open Water. Explore especialidades como mergulho nocturno ou navegação subaquática. Continue a registar os seus mergulhos para acompanhar o progresso."
        else:
            recommendations = "Com a sua experiência, considere o curso Rescue Diver para desenvolver competências de segurança. Explore mergulhos mais desafiantes e considere tornar-se um líder na comunidade de mergulho da JUSTDIVE."
        
        return {
            'recommendations': recommendations,
            'timestamp': datetime.utcnow().isoformat(),
            'student_level': certification,
            'total_dives': total_dives,
            'mock_data': True
        }

# Instância global do serviço OpenAI
openai_service = OpenAIService()


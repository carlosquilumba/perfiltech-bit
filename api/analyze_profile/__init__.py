import json
import os

import azure.functions as func
from dotenv import load_dotenv
from openai import AzureOpenAI


# Cargar variables desde archivos .env (solo local). Si no existen, no pasa nada.
# 1) api/.env
# 2) api/analyze_profile/.env
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ENV_PATHS = [
    os.path.join(BASE_DIR, ".env"),
    os.path.join(os.path.dirname(__file__), ".env"),
]
for env_path in ENV_PATHS:
    load_dotenv(dotenv_path=env_path, override=False)

# Configuración de Azure OpenAI (lee de variables de entorno).
AZURE_OPENAI_ENDPOINT = os.environ.get("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.environ.get("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_DEPLOYMENT = os.environ.get("AZURE_OPENAI_DEPLOYMENT_GPT", "gpt-4.1")
AZURE_OPENAI_API_VERSION = os.environ.get("AZURE_OPENAI_API_VERSION", "2025-01-01-preview")


def get_client() -> AzureOpenAI | None:
    """Crea el cliente de Azure OpenAI si hay configuración válida."""
    if not AZURE_OPENAI_ENDPOINT or not AZURE_OPENAI_API_KEY:
        return None

    return AzureOpenAI(
        api_key=AZURE_OPENAI_API_KEY,
        api_version=AZURE_OPENAI_API_VERSION,
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
    )


def create_response(body: str, status_code: int = 200) -> func.HttpResponse:
    """Crea una respuesta HTTP con headers CORS."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    return func.HttpResponse(
        body,
        status_code=status_code,
        mimetype="application/json",
        headers=headers,
    )


def main(req: func.HttpRequest) -> func.HttpResponse:
    # Manejar preflight OPTIONS request
    if req.method == "OPTIONS":
        return create_response("", 200)
    
    client = get_client()
    if client is None:
        return create_response(
            json.dumps(
                {
                    "error": "Azure OpenAI no está configurado. Falta AZURE_OPENAI_ENDPOINT o AZURE_OPENAI_API_KEY."
                }
            ),
            status_code=500,
        )
    try:
        data = req.get_json()
    except ValueError:
        return create_response(
            json.dumps({"error": "Body JSON inválido"}),
            status_code=400,
        )

    respuestas = data.get("respuestas")

    if not isinstance(respuestas, list):
        return create_response(
            json.dumps(
                {
                    "error": "Debes enviar 'respuestas' como lista, por ejemplo: {\"respuestas\": [1,2,3,4,5]}"
                }
            ),
            status_code=400,
        )

    # Prompt: lista final de perfiles disponibles
    prompt = (
        "Eres un orientador vocacional tecnológico. Debes analizar las respuestas de un test (valores de 1 a 5)\n"
        "y asignar el perfil tecnológico que mejor encaje entre esta lista de PERFILES DISPONIBLES (pensados para salida de universidad):\n\n"
        "- BACKEND: Backend Developer – se enfoca en la lógica del servidor, APIs y bases de datos.\n"
        "- FRONTEND: Frontend Developer – crea interfaces web atractivas y usables con HTML, CSS y JavaScript.\n"
        "- FULLSTACK: Full Stack Developer – trabaja tanto en frontend como en backend.\n"
        "- DATA_SCIENTIST: Data Scientist – analiza datos para encontrar patrones e insights.\n"
        "- DATA_ENGINEER: Data Engineer – construye y mantiene pipelines y sistemas de datos.\n"
        "- AI_ML: AI / Machine Learning Engineer – diseña, entrena y despliega modelos de IA/ML.\n"
        "- DEVOPS: DevOps / SRE Developer – automatiza despliegues, monitoreo y confiabilidad.\n"
        "- AUTOMATION: RPA / Automation Developer – automatiza procesos de negocio con bots.\n"
        "- QA: QA / Test Automation Engineer – diseña y automatiza pruebas de software.\n"
        "- UX_UI: UX/UI Designer – diseña experiencias de usuario y prototipos visuales (por ejemplo en Figma).\n\n"
        "RESPUESTAS DEL TEST (valores 1-4 por pregunta, guardadas como números): "
        f"{respuestas}\n\n"
        "Interpreta de forma aproximada así: respuestas relacionadas con diseño/experiencia de usuario favorecen FRONTEND o UX_UI;\n"
        "respuestas sobre pruebas y asegurar que todo funciona favorecen QA; sobre automatizar tareas de negocio favorecen AUTOMATION;\n"
        "sobre datos y patrones favorecen DATA_SCIENTIST o DATA_ENGINEER; sobre inteligencia artificial favorecen AI_ML;\n"
        "sobre lógica, rendimiento y sistemas favorecen BACKEND o DEVOPS; si hay mezcla equilibrada entre frontend y backend favorece FULLSTACK.\n"
        "Con esto en mente, analiza el patrón general y elige SOLO UN perfil de la lista anterior, el que mejor encaje.\n\n"
        "Devuelve SOLO un JSON válido con esta forma (sin texto extra):\n"
        "{\n"
        '  \"codigo\": \"BACKEND | FRONTEND | FULLSTACK | DATA_SCIENTIST | DATA_ENGINEER | AI_ML | DEVOPS | AUTOMATION | QA | UX_UI\",\n'
        '  \"nombre\": \"Nombre legible del perfil (por ejemplo: Backend Developer)\",\n'
        '  \"descripcion\": \"Frase corta (máx 2 líneas) explicando el perfil para un estudiante universitario\",\n'
        '  \"tecnologias\": [\"Tech1\", \"Tech2\", \"Tech3\"]\n'
        "}\n"
    )

    try:
        completion = client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            messages=[
                {
                    "role": "system",
                    "content": "Responde siempre SOLO con JSON válido, sin markdown y sin texto extra.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=300,
        )
    except Exception as e:
        # Error llamando a Azure OpenAI
        return create_response(
            json.dumps({"error": f"Error llamando a Azure OpenAI: {str(e)}"}),
            status_code=500,
        )

    content = completion.choices[0].message.content.strip()

    # Devolvemos lo que diga el modelo tal cual; el frontend espera JSON.
    return create_response(content, status_code=200)



import json
import os

import azure.functions as func
from openai import AzureOpenAI


# Configuración de Azure OpenAI (lee de variables de entorno).
# En local, estas variables vienen de local.settings.json.
# En Azure, vienen de Application Settings del Function App.
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


def main(req: func.HttpRequest) -> func.HttpResponse:
    client = get_client()
    if client is None:
        return func.HttpResponse(
            json.dumps(
                {
                    "error": "Azure OpenAI no está configurado. Falta AZURE_OPENAI_ENDPOINT o AZURE_OPENAI_API_KEY."
                }
            ),
            status_code=500,
            mimetype="application/json",
        )
    try:
        data = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Body JSON inválido"}),
            status_code=400,
            mimetype="application/json",
        )

    respuestas = data.get("respuestas")

    if not isinstance(respuestas, list):
        return func.HttpResponse(
            json.dumps(
                {
                    "error": "Debes enviar 'respuestas' como lista, por ejemplo: {\"respuestas\": [1,2,3,4,5]}"
                }
            ),
            status_code=400,
            mimetype="application/json",
        )

    # Prompt muy simple y directo
    prompt = (
        "Analiza esta lista de respuestas del test y devuelve un perfil tecnológico.\n\n"
        f"RESPUESTAS: {respuestas}\n\n"
        "Devuelve SOLO un JSON válido con esta forma:\n"
        "{\n"
        '  "codigo": "BACKEND",\n'
        '  "nombre": "Backend Developer",\n'
        '  "descripcion": "Frase corta (máx 2 líneas) explicando el perfil",\n'
        '  "tecnologias": ["Tech1", "Tech2", "Tech3"]\n'
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
        return func.HttpResponse(
            json.dumps({"error": f"Error llamando a Azure OpenAI: {str(e)}"}),
            status_code=500,
            mimetype="application/json",
        )

    content = completion.choices[0].message.content.strip()

    # Devolvemos lo que diga el modelo tal cual; el frontend espera JSON.
    return func.HttpResponse(
        content,
        status_code=200,
        mimetype="application/json",
    )



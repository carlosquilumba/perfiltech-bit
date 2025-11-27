import json
import os
import secrets
import azure.functions as func
from datetime import datetime, timedelta

# Credenciales de admin (en producción, usar Azure Key Vault o App Settings)
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")  # Cambiar en producción


def create_response(body: str, status_code: int = 200) -> func.HttpResponse:
    """Crea una respuesta HTTP con headers CORS."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

    if req.method != "POST":
        return create_response(
            json.dumps({"error": "Método no permitido"}),
            status_code=405,
        )

    try:
        data = req.get_json()
    except ValueError:
        return create_response(
            json.dumps({"error": "Body JSON inválido"}),
            status_code=400,
        )

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return create_response(
            json.dumps({"error": "Usuario y contraseña requeridos"}),
            status_code=400,
        )

    # Validar credenciales
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        # Generar token simple (en producción usar JWT)
        token = secrets.token_urlsafe(32)
        expires_at = (datetime.utcnow() + timedelta(hours=24)).isoformat()

        return create_response(
            json.dumps({
                "token": token,
                "expires_at": expires_at,
                "message": "Login exitoso"
            }),
            status_code=200,
        )
    else:
        return create_response(
            json.dumps({"error": "Credenciales inválidas"}),
            status_code=401,
        )

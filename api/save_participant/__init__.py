import json
import os
from datetime import datetime
from uuid import uuid4

import azure.functions as func
from azure.cosmos import CosmosClient
from dotenv import load_dotenv


# Cargar variables desde archivo .env LOCAL de esta función (solo desarrollo)
# Ruta esperada: api/save_participant/.env
LOCAL_ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=LOCAL_ENV_PATH, override=False)


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


# Configuración Cosmos DB desde variables de entorno
COSMOS_DB_ENDPOINT = os.environ.get("COSMOS_DB_ENDPOINT")
COSMOS_DB_KEY = os.environ.get("COSMOS_DB_KEY")
COSMOS_DB_DATABASE = os.environ.get("COSMOS_DB_DATABASE", "bit-profile-db")
COSMOS_DB_CONTAINER = os.environ.get("COSMOS_DB_CONTAINER", "participants")

cosmos_client: CosmosClient | None = None
cosmos_container = None


def get_container():
    """Inicializa (una sola vez) el cliente de Cosmos y devuelve el contenedor."""
    global cosmos_client, cosmos_container

    if cosmos_container is not None:
        return cosmos_container

    if not COSMOS_DB_ENDPOINT or not COSMOS_DB_KEY:
        raise RuntimeError(
            "Cosmos DB no está configurado. "
            "Faltan COSMOS_DB_ENDPOINT o COSMOS_DB_KEY en las variables de entorno."
        )

    cosmos_client = CosmosClient(COSMOS_DB_ENDPOINT, credential=COSMOS_DB_KEY)
    db_client = cosmos_client.get_database_client(COSMOS_DB_DATABASE)
    cosmos_container = db_client.get_container_client(COSMOS_DB_CONTAINER)
    return cosmos_container


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

    # Campos mínimos requeridos
    evento = data.get("evento")
    nombre = data.get("nombre")
    email = data.get("email")
    perfil = data.get("perfil") or {}

    if not evento or not nombre or not email or not perfil:
        return create_response(
            json.dumps(
                {
                    "error": "Faltan campos requeridos. "
                    "Debes enviar al menos: evento, nombre, email y perfil."
                }
            ),
            status_code=400,
        )

    respuestas = data.get("respuestas") or []
    carrera = data.get("carrera") or ""
    rating = data.get("rating")
    comentario = data.get("comentario") or ""
    avatar_url = data.get("avatar_url") or ""

    # Aplanar datos de perfil
    perfil_codigo = perfil.get("codigo")
    perfil_nombre = perfil.get("nombre")
    perfil_descripcion = perfil.get("descripcion")
    perfil_tecnologias = perfil.get("tecnologias") or []

    item = {
        "id": str(uuid4()),
        "evento": evento,
        "nombre": nombre,
        "email": email,
        "carrera": carrera,
        "respuestas": respuestas,
        "perfil_codigo": perfil_codigo,
        "perfil_nombre": perfil_nombre,
        "perfil_descripcion": perfil_descripcion,
        "perfil_tecnologias": perfil_tecnologias,
        "rating": rating,
        "comentario": comentario,
        "avatar_url": avatar_url,
        "origen": data.get("origen", "web"),
        "fecha_registro": datetime.utcnow().isoformat() + "Z",
    }

    try:
        container = get_container()
        container.create_item(item)
    except Exception as e:
        return create_response(
            json.dumps({"error": f"Error guardando en Cosmos DB: {str(e)}"}),
            status_code=500,
        )

    return create_response(
        json.dumps(
            {
                "ok": True,
                "id": item["id"],
            }
        ),
        status_code=201,
    )



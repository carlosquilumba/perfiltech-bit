import json
import os

import azure.functions as func
from azure.cosmos import CosmosClient
from dotenv import load_dotenv


# Cargar variables desde archivo .env LOCAL de esta función (solo desarrollo)
# Ruta esperada: api/participants/.env
LOCAL_ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=LOCAL_ENV_PATH, override=False)


def create_response(body: str, status_code: int = 200, is_options: bool = False) -> func.HttpResponse:
    """Crea una respuesta HTTP con headers CORS."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
    if is_options:
        # Para preflight OPTIONS, agregar headers adicionales
        headers["Access-Control-Max-Age"] = "3600"
        headers["Access-Control-Allow-Credentials"] = "false"
    return func.HttpResponse(body, status_code=status_code, mimetype="application/json", headers=headers)


def verify_token(req: func.HttpRequest) -> bool:
    """Verifica el token de autenticación (no usado en desarrollo)."""
    auth_header = req.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return False

    token = auth_header.replace("Bearer ", "")
    return len(token) > 0


# Configuración Cosmos DB desde variables de entorno
COSMOS_DB_ENDPOINT = os.environ.get("COSMOS_DB_ENDPOINT")
COSMOS_DB_KEY = os.environ.get("COSMOS_DB_KEY")
COSMOS_DB_DATABASE = os.environ.get("COSMOS_DB_DATABASE", "participants")
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
        return create_response("", 200, is_options=True)

    if req.method == "GET":
        evento = req.params.get("evento", "ESPOCH_2025")
        perfil = req.params.get("perfil", "").strip()

        try:
            container = get_container()

            # Consulta básica por evento
            query = "SELECT * FROM c WHERE c.evento = @evento"
            params = [{"name": "@evento", "value": evento}]

            items_iterable = container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True,
            )

            items = list(items_iterable)

            # Filtro opcional por perfil (por código o nombre)
            if perfil:
                perfil_lower = perfil.lower()
                items = [
                    item
                    for item in items
                    if str(item.get("perfil_codigo", "")).lower() == perfil_lower
                    or str(item.get("perfil_nombre", "")).lower() == perfil_lower
                ]

            participants_data = {
                "participants": items,
                "total": len(items),
                "page": 1,
                "limit": len(items),
            }

            return create_response(json.dumps(participants_data), status_code=200)

        except Exception as e:
            return create_response(
                json.dumps({"error": f"Error consultando Cosmos DB: {str(e)}"}),
                status_code=500,
            )

    if req.method == "DELETE":
        evento = req.params.get("evento")
        participant_id = req.params.get("id")

        if not evento or not participant_id:
            return create_response(
                json.dumps({"error": "Debes enviar 'id' y 'evento' para eliminar"}),
                status_code=400,
            )

        try:
            container = get_container()
            container.delete_item(item=participant_id, partition_key=evento)

            return create_response(json.dumps({"ok": True}), status_code=200)

        except Exception as e:
            return create_response(
                json.dumps({"error": f"Error eliminando en Cosmos DB: {str(e)}"}),
                status_code=500,
            )

    return create_response(
        json.dumps({"error": "Método no permitido"}),
        status_code=405,
    )

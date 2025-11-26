## Business IT – Perfil Tech (Demo evento)

Aplicación sencilla para que asistentes a un evento descubran su **perfil tecnológico** y obtengan una tarjeta descargable, usando una web React y una API en Azure Functions con Azure OpenAI.

---

## Estructura del proyecto

```text
frontend/          # Aplicación React (Vite + Tailwind)
  src/
    components/    # Layout, botones, inputs, cámara, etc.
    pages/         # Pantallas: Home, Test, Identify, Loading, Result, Feedback, Thanks
    services/      # Llamadas HTTP a la API (`api.js`)
  public/
    logo-business-it.png  # Logo corporativo y favicon

api/               # Azure Functions en Python
  analyze_profile/ # Function HTTP /api/analyze_profile
  host.json        # Configuración global Functions
  local.settings.json  # Config local (no se sube a git)
  requirements.txt # Dependencias Python
```

---

## Tecnologías usadas

- **Frontend**: React 18, Vite, React Router, Tailwind CSS, react-icons, html2canvas.
- **Backend**: Azure Functions (Python 3.12).
- **IA**: Azure OpenAI (deployment `gpt-4.x`).

---

## Cómo levantar el frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Por defecto se abre en `http://localhost:3000`.

---

## Cómo levantar la API (Azure Functions Python)

### 1. Configuración local (.env)

Para desarrollo local usamos un archivo `.env` dentro de la carpeta `api` (este archivo **no se sube a git**, está en `.gitignore`).

Crear `api/.env` con este contenido de ejemplo:

```env
AZURE_OPENAI_ENDPOINT=https://bit-profile-prod-openai-eastus.openai.azure.com/
AZURE_OPENAI_API_KEY=TU_API_KEY_AQUI
AZURE_OPENAI_DEPLOYMENT_GPT=gpt-4.1
AZURE_OPENAI_API_VERSION=2025-01-01-preview
```

El código de la Function carga estas variables con `python-dotenv` (`load_dotenv()`).

> Opcional: si prefieres el formato estándar de Azure Functions, también puedes usar `api/local.settings.json`.

### 2. Instalar dependencias y arrancar Functions:

```bash
cd api
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt
func start
```

La función queda disponible en:

- `POST http://localhost:7071/api/analyze_profile`

Body esperado:

```json
{ "respuestas": [1, 2, 3, 4, 5] }
```

---

## Conexión frontend → API

El frontend usa `frontend/src/services/api.js` con esta base por defecto:

```js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:7071/api'
```

En local no hace falta configurar nada extra:  
solo asegúrate de tener **frontend** en el puerto 3000 y **API** en el 7071.

En producción (Azure), se recomienda definir `VITE_API_BASE_URL` en las variables de entorno del build del frontend apuntando a la URL del Function App.

---

## Flujo funcional (resumen)

1. **Test**: el usuario responde 5 preguntas.
2. **Identificación**: ingresa nombre, email y (opcional) foto.
3. **Loading**: el frontend llama a `/api/analyze_profile` con el array de respuestas.
4. **Resultado**: se muestra el perfil devuelto por Azure OpenAI y se genera una tarjeta descargable.
5. **Feedback**: el usuario califica la experiencia.
6. **Gracias**: se muestra mensaje final y redes de Business IT.


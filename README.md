
# Test App

Aplicación full-stack de gestión de tareas. 

## Requisitos Previos
- Python 3.9+
- Node.js 18+

## Instrucciones para levantar el entorno de desarrollo local

Este proyecto está dividido en un monorepo con dos directorios principales: `/backend` y `/frontend`. Es necesario levantar ambos servidores para que la aplicación funcione correctamente.

### 1. Levantar el Backend (FastAPI)

Abre una terminal, navega a la carpeta del backend y sigue estos pasos:

```bash
cd backend

```

**a. Iniciar el entorno virtual de Python:**

```bash
# En Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# En Linux/macOS
python3 -m venv venv
source venv/bin/activate

```

**b. Instalar dependencias:**
Asegúrate de que el entorno virtual esté activo e instala los paquetes desde el archivo requirements:

```bash
pip install -r requirements.txt

```

**c. Correr el servidor uvicorn:**
Ejecuta la API en modo desarrollo (se reiniciará automáticamente ante cambios):

```bash
uvicorn main:app --reload

```

*La API estará disponible en `http://127.0.0.1:8000` y la documentación interactiva en `http://127.0.0.1:8000/docs`.*

### 2. Levantar el Frontend (React + TypeScript)

Abre una nueva ventana o pestaña en tu terminal, navega a la carpeta del frontend y ejecuta:

```bash
cd frontend

```

**a. Instalar las dependencias de Node:**

```bash
npm install

```

**b. Correr el servidor de desarrollo de Vite:**

```bash
npm run dev

```

*La aplicación web estará disponible y visible en tu navegador en `http://localhost:5173`.*

```

```
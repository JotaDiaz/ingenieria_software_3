
# Tiempo

- **Configuración del repositorio en GitHub:** ~20 minutos.
- **Configuración del stack y dependencias (backend + base de datos + CORS):** ~30 minutos.
- **Desarrollo de las historias de usuario con opencode:** ~1 hora 30 minutos. A la hora de armar el backend se tomaron decisiones sobre cómo estructurar los modelos, priorizando la modularización del código para que cada pieza quede separada y sea más fácil de mantener y escalar. Primero se definió el modelo de datos y después el resto (routers, servicios, etc.). Recién cuando el backend quedó definido se pasó al frontend, donde se priorizó la simplicidad.
- **Testing manual para verificar que el código cumpla los requerimientos:** ~30 minutos.

**Total aproximado:** ~2 horas 50 minutos.



# Proyecto: Clientes, Productos y Ventas

Aplicación full-stack con **backend** en FastAPI (SQLite + SQLAlchemy) y **frontend** en React (Vite + TypeScript).

## Requisitos

- Python 3.x
- Node.js y npm

## Cómo correr el proyecto

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv              
source venv/bin/activate        
pip install -r requirements.txt 
uvicorn main:app --reload
```

La API queda disponible en `http://localhost:8000` y su documentación interactiva en `http://localhost:8000/docs`.

### 2. Frontend (React + Vite)

En otra terminal:

```bash
cd frontend
npm install        
npm run dev
```

La app queda disponible en `http://localhost:5173` (puerto ya habilitado por CORS en `backend/main.py`).

## Script de datos (seed)

Recrea la base `test.db` desde cero y carga datos de ejemplo de clientes (5), productos (6) y ventas (4 con sus detalles), mostrando al final el conteo de filas por tabla.

```bash
cd backend
source venv/bin/activate
python init_db.py
```

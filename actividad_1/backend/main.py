from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models  # noqa: F401  (registra los modelos en Base.metadata)
from database.base import Base
from database.connection import engine
from routers import cliente, producto, venta

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Clientes, Productos y Ventas",
    description="Módulos web para clientes, productos y ventas",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cliente.router)
app.include_router(producto.router)
app.include_router(venta.router)


@app.get("/")
def read_root():
    return {"message": "API activa y funcionando"}

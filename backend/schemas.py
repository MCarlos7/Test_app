from pydantic import BaseModel, ConfigDict
from typing import Optional

# Propiedades compartidas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

# Esquema para crear una tarea (hereda de TaskBase)
class TaskCreate(TaskBase):
    pass

# Esquema para actualizar una tarea (todos los campos son opcionales)
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

# Esquema de respuesta (incluye el ID generado por la base de datos)
class TaskResponse(TaskBase):
    id: int
    
    # Configuración de Pydantic v2 para leer datos del ORM (SQLAlchemy)
    model_config = ConfigDict(from_attributes=True)
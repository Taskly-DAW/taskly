# app/usecases/dtos.py
from pydantic import BaseModel
from typing import List

class RegisterDTO(BaseModel):
    username: str
    password: str
    tenant_id: str
    roles: List[str] = ["user"]

class LoginDTO(BaseModel):
    username: str
    password: str
    tenant_id: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

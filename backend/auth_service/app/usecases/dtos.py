# app/usecases/dtos.py
from pydantic import BaseModel
from typing import List

class RegisterDTO(BaseModel):
    username: str
    email: str
    password: str
    tenant_id: str
    roles: List[str] = ["user"]

class LoginDTO(BaseModel):
    email: str
    password: str
    tenant_id: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserInfoDTO(BaseModel):
    id: str
    username: str
    email: str
    tenant_id: str
    roles: List[str]

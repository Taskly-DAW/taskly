# app/domain/models.py
from typing import List, Optional
from dataclasses import dataclass

@dataclass
class Tenant:
    id: str
    name: Optional[str] = None

@dataclass
class Role:
    name: str  # ex: "admin", "user", "billing"

@dataclass
class User:
    id: str
    username: str
    password_hash: str
    tenant_id: str
    roles: List[Role]

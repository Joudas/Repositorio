from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1)
    lastname: str = Field(min_length=1)
    rol: str | None = None
    email: str = Field(min_length=5)
    country: str = "Colombia"
    phone: str | None = None
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterResponse(BaseModel):
    id: int
    name: str
    lastname: str
    rol: str | None
    email: str
    country: str
    phone: str | None

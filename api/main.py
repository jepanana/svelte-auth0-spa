# This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
# For client work, contact us at hello@jepanana.com.

import os
import time
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

DOMAIN = os.getenv("PUBLIC_AUTH0_DOMAIN", "")
ISSUER = f"https://{DOMAIN}/"
AUDIENCE = os.getenv("PUBLIC_AUTH0_AUDIENCE", "api")

app = FastAPI(title="svelte-auth0-spa API")
jwks = jwt.PyJWKClient(f"{ISSUER}.well-known/jwks.json")
bearer = HTTPBearer()
denylist: dict[str, int] = {}


class Me(BaseModel):
    sub: str
    iss: str
    aud: str | list[str]
    exp: int
    scope: str | None = None


class LogoutResult(BaseModel):
    logged_out: bool


class Session(BaseModel):
    token: str
    claims: Me


def session(credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer)]) -> Session:
    token = credentials.credentials
    now = int(time.time())
    for revoked, exp in list(denylist.items()):
        if exp <= now:
            del denylist[revoked]
    if token in denylist:
        raise HTTPException(status_code=401, detail="Token revoked")
    try:
        key = jwks.get_signing_key_from_jwt(token).key
        claims = jwt.decode(token, key, algorithms=["RS256"], audience=AUDIENCE, issuer=ISSUER)
    except jwt.PyJWTError as error:
        raise HTTPException(status_code=401, detail=str(error)) from error
    return Session(token=token, claims=Me.model_validate(claims))


@app.get("/api/me", operation_id="me")
def me(current: Annotated[Session, Depends(session)]) -> Me:
    return current.claims


@app.post("/api/logout", operation_id="logout")
def logout(current: Annotated[Session, Depends(session)]) -> LogoutResult:
    denylist[current.token] = current.claims.exp
    return LogoutResult(logged_out=True)

from fastapi import FastAPI, HTTPException, status, Request
from fastapi.responses import RedirectResponse
# from fastapi.middleware.cors import CORSMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.middleware.sessions import SessionMiddleware

# initialize the API
app = FastAPI()

## Configure Session handler
SESSION_SECRET = 'fdqsjlkmfjqsdmliejqfmk'
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET)

def is_safe_url(url: str, allowed_hosts: list[str]) -> bool:
    try:
        parsed_url = urlparse(url)
        return parsed_url.netloc in allowed_hosts
    except Exception:
        return False
SAFE_HOSTS = [
    "127.0.0.1",
    "localhost"
]
### Configure CORS
# origins = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "localhost:3000",
#     "127.0.0.1:3000"
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

### configure OAuth client
CLIENT_ID = '6'
CLIENT_SECRET = 'COj8BUGXiLifoaHibqtmjZ8leW6QXqk8YuV6Ff7p'
oauth = OAuth()
oauth.register(  # this allows us to call oauth.firefly later on
    'firefly',
    authorize_url='https://firefly.local/oauth/authorize',
    access_token_url='https://firefly.local/oauth/token',
    scope='',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET
)

# define the endpoints for the OAuth2 flow
@app.get('/api/auth/login')
async def get_authorization_code(request: Request):
    """OAuth2 flow, step 1: have the user log into firefly III to obtain an authorization code grant
    """

    redirect_uri = request.url_for('auth')
    redirect_uri = redirect_uri.replace(port=3000)
    return await oauth.firefly.authorize_redirect(request, redirect_uri)


@app.get('/api/auth/callback')
async def auth(request: Request):
    """OAuth2 flow, step 2: exchange the authorization code for access token
    """
    # exchange auth code for token
    try:
        token = await oauth.firefly.authorize_access_token(request)
    except OAuthError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error.error
        )

    # Créer une réponse de redirection vers l'application d'origine
    response = RedirectResponse(url='/')
    # Récupérer la durée de vie du token depuis la réponse OAuth
    expires_in = token.get("expires_in", 3600)  # Utiliser 3600 secondes (1 heure) par défaut si non spécifié

    # Ajouter le token sous forme de cookie sécurisé
    response.set_cookie(
        key="access_token",            # Nom du cookie
        value=token["access_token"],   # Valeur du token d'accès
        httponly=False,                # Empêche l'accès au cookie par le JavaScript côté client
        secure=False,                  # Utilise une transmission sécurisée HTTPS
        samesite="Strict",             # Stratégie SameSite pour renforcer la sécurité CSRF
        max_age=expires_in             # Durée de vie du cookie en secondes (1 heure ici)
    )
    return response

@app.get("/api/ready", tags=["healthcheck"])
async def read_status() -> dict:
    return {"status": "OK"}

@app.get("/api/status", tags=["healthcheck"])
async def read_status() -> dict:
    return {"status": "OK"}

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request

app = FastAPI()

# in a productive app, DO NOT leave any of the following in your code
# ACTION ITEM: replace these placeholders with your own values
CLIENT_ID = '6'
CLIENT_SECRET = 'COj8BUGXiLifoaHibqtmjZ8leW6QXqk8YuV6Ff7p'
SESSION_SECRET = 'fdqsjlkmfjqsdmliejqfmk'


# initialize the API
app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET)

# configure OAuth client
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
    return await oauth.firefly.authorize_redirect(request, 'http://127.0.0.1:3000/api/auth/callback')


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

    # you now have a firefly token. Do whatever you need with it
    return token

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "localhost:3000",
    "127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

todos = [
    {
        "id": "1",
        "item": "Read a book."
    },
    {
        "id": "2",
        "item": "Cycle around town."
    }
]
@app.get("/api/todo", tags=["todos"])
async def get_todos() -> dict:
    return { "data": todos }
@app.post("/api/todo", tags=["todos"])
async def add_todo(todo: dict) -> dict:
    todos.append(todo)
    return {
        "data": { "Todo added." }
    }
@app.put("/api/todo/{id}", tags=["todos"])
async def update_todo(id: int, body: dict) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todo["item"] = body["item"]
            return {
                "data": f"Todo with id {id} has been updated."
            }

    return {
        "data": f"Todo with id {id} not found."
    }


@app.get("/api/ready", tags=["healthcheck"])
async def read_status() -> dict:
    return {"status": "OK"}

@app.get("/api/status", tags=["healthcheck"])
async def read_status() -> dict:
    return {"status": "OK"}

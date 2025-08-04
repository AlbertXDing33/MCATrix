from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware #makes sure front end can send request to backend(when front end on different port than backend)
from .routes import question_endpoints

app = FastAPI()

#adds CORS middleware to enable requests from front-end to back-end
app.add_middleware(CORSMiddleware, allow_origins = ["*"], allow_credentials = True, allow_methods = ["*"], allow_headers = ["*"])

#mounts router from question_endpoints file, adds /api prefix to all routes from question_endpoints
app.include_router(question_endpoints.router, prefix = '/api')
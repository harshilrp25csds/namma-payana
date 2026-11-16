
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import FRONTEND_URL
from app.services.supabase_client import get_supabase_client
from app.routers.gtfs import router as gtfs_router
from app.routers.analytics import router as analytics_router
from app.routers.journeys import router as journeys_router

app = FastAPI(
    title="Namma Payana API",
    description="Bengaluru Public Transport Intelligence System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register BMTC GTFS API routes
app.include_router(gtfs_router)
app.include_router(analytics_router)
app.include_router(journeys_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to Namma Payana API",
        "project": "Bengaluru Public Transport Intelligence System",
        "status": "running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "backend": "FastAPI",
        "project": "Namma Payana"
    }


@app.get("/api/database-status")
def database_status():
    supabase = get_supabase_client()

    if supabase is None:
        return {
            "status": "not_configured",
            "message": "Supabase credentials have not been added yet."
        }

    return {
        "status": "configured",
        "message": "Supabase client initialized."
    }

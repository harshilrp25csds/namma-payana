
from fastapi import APIRouter, HTTPException

from app.services.analytics_service import get_dashboard_overview


router = APIRouter(
    prefix="/api/analytics",
    tags=["Transport Analytics"]
)


@router.get("/overview")
def analytics_overview():

    try:
        return {
            "status": "success",
            "analytics": get_dashboard_overview()
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Analytics processing failed: {str(error)}"
        )

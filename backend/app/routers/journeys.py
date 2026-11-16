
from fastapi import APIRouter, HTTPException, Query

from app.services.journey_service import find_direct_journeys


router = APIRouter(
    prefix="/api/journeys",
    tags=["Passenger Journey Planner"]
)


@router.get("/direct")
def direct_journeys(
    origin_stop_id: str = Query(min_length=1),
    destination_stop_id: str = Query(min_length=1)
):

    try:
        journeys = find_direct_journeys(
            origin_stop_id.strip(),
            destination_stop_id.strip()
        )

        return {
            "status": "success",
            "journey_type": "direct_scheduled_services",
            "total": len(journeys),
            "data": journeys
        }

    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Journey search failed: {str(error)}"
        )


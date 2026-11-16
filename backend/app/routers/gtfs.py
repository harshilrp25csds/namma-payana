
from fastapi import APIRouter, HTTPException, Query

from app.services.gtfs_service import (
    get_routes,
    get_stops,
    get_trips,
    get_fares,
    get_dataset_stats
)


router = APIRouter(
    prefix="/api/gtfs",
    tags=["BMTC GTFS Data"]
)


@router.get("/stats")
def dataset_stats():
    return {
        "status": "success",
        "dataset": "BMTC GTFS",
        "statistics": get_dataset_stats()
    }


@router.get("/routes")
def list_routes(
    search: str = "",
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0)
):
    df = get_routes()

    if search.strip():
        search_text = search.strip()

        mask = (
            df["route_short_name"].str.contains(
                search_text, case=False, na=False
            )
            |
            df["route_long_name"].str.contains(
                search_text, case=False, na=False
            )
        )

        df = df[mask]

    total = len(df)

    records = df.iloc[offset:offset + limit].to_dict(
        orient="records"
    )

    return {
        "status": "success",
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": records
    }


@router.get("/routes/{route_id}")
def route_details(route_id: str):
    df = get_routes()

    result = df[df["route_id"] == route_id]

    if result.empty:
        raise HTTPException(
            status_code=404,
            detail="Route not found"
        )

    return {
        "status": "success",
        "data": result.iloc[0].to_dict()
    }


@router.get("/stops")
def list_stops(
    search: str = "",
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0)
):
    df = get_stops()

    if search.strip():
        df = df[
            df["stop_name"].str.contains(
                search.strip(),
                case=False,
                na=False
            )
        ]

    total = len(df)

    records = df.iloc[offset:offset + limit].to_dict(
        orient="records"
    )

    return {
        "status": "success",
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": records
    }


@router.get("/trips")
def list_trips(
    route_id: str = "",
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0)
):
    df = get_trips()

    if route_id.strip():
        df = df[df["route_id"] == route_id.strip()]

    total = len(df)

    records = df.iloc[offset:offset + limit].to_dict(
        orient="records"
    )

    return {
        "status": "success",
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": records
    }


@router.get("/fares")
def list_fares():
    df = get_fares()

    return {
        "status": "success",
        "total": len(df),
        "data": df.to_dict(orient="records")
    }

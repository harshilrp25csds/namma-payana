
from functools import lru_cache
from pathlib import Path

import pandas as pd

from app.services.gtfs_service import get_trips, get_routes, get_stops


DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "bmtc"


@lru_cache(maxsize=1)
def calculate_schedule_analytics():

    file_path = DATA_DIR / "stop_times.txt"

    if not file_path.exists():
        raise FileNotFoundError("BMTC stop_times.txt not found")

    trip_data = get_trips()[["trip_id", "route_id"]].drop_duplicates()

    trip_route_map = dict(
        zip(trip_data["trip_id"], trip_data["route_id"])
    )

    hourly_counts = {}
    trip_event_counts = {}

    # Process the large GTFS file in chunks to control memory usage.
    for chunk in pd.read_csv(
        file_path,
        usecols=["trip_id", "departure_time"],
        dtype=str,
        chunksize=250000,
        encoding="utf-8-sig",
        keep_default_na=False
    ):

        chunk = chunk[chunk["departure_time"].str.contains(":")]

        hours = pd.to_numeric(
            chunk["departure_time"].str.split(":").str[0],
            errors="coerce"
        )

        valid = hours.notna()

        hour_counts_chunk = hours[valid].astype(int).value_counts()

        for hour, count in hour_counts_chunk.items():
            hourly_counts[int(hour)] = (
                hourly_counts.get(int(hour), 0) + int(count)
            )

        trip_counts_chunk = chunk["trip_id"].value_counts()

        for trip_id, count in trip_counts_chunk.items():
            trip_event_counts[trip_id] = (
                trip_event_counts.get(trip_id, 0) + int(count)
            )

    # Aggregate scheduled stop events by route.
    route_event_counts = {}

    for trip_id, count in trip_event_counts.items():
        route_id = trip_route_map.get(trip_id)

        if route_id:
            route_event_counts[route_id] = (
                route_event_counts.get(route_id, 0) + count
            )

    route_names = get_routes().set_index("route_id")

    top_routes = []

    for route_id, count in sorted(
        route_event_counts.items(),
        key=lambda item: item[1],
        reverse=True
    )[:10]:

        if route_id in route_names.index:
            route = route_names.loc[route_id]

            top_routes.append({
                "route_id": route_id,
                "route_number": route["route_short_name"],
                "route_name": route["route_long_name"],
                "scheduled_stop_events": count
            })

    hourly_data = [
        {
            "hour": hour,
            "label": f"{hour:02d}:00",
            "scheduled_departures": count
        }
        for hour, count in sorted(hourly_counts.items())
    ]

    peak_hour = None

    if hourly_data:
        peak_hour = max(
            hourly_data,
            key=lambda item: item["scheduled_departures"]
        )

    return {
        "hourly_departures": hourly_data,
        "peak_hour": peak_hour,
        "top_routes": top_routes,
        "total_scheduled_stop_events": sum(trip_event_counts.values()),
        "routes_analyzed": len(route_event_counts)
    }


def get_dashboard_overview():

    analytics = calculate_schedule_analytics()

    return {
        "dataset": "BMTC GTFS",
        "data_type": "Scheduled transport data",
        "total_routes": len(get_routes()),
        "total_stops": len(get_stops()),
        "total_trips": len(get_trips()),
        "peak_hour": analytics["peak_hour"],
        "routes_analyzed": analytics["routes_analyzed"],
        "total_scheduled_stop_events": analytics[
            "total_scheduled_stop_events"
        ],
        "hourly_departures": analytics["hourly_departures"],
        "top_routes": analytics["top_routes"]
    }

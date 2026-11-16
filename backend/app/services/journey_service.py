
from functools import lru_cache
from pathlib import Path

import pandas as pd

from app.services.gtfs_service import get_trips, get_routes


DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "bmtc"


def time_to_seconds(value):
    """Convert GTFS HH:MM:SS to seconds, including times after midnight."""

    try:
        hours, minutes, seconds = map(int, value.split(":"))
        return hours * 3600 + minutes * 60 + seconds
    except (ValueError, AttributeError):
        return None


@lru_cache(maxsize=30)
def find_direct_journeys(origin_stop_id, destination_stop_id):

    file_path = DATA_DIR / "stop_times.txt"

    if not file_path.exists():
        raise FileNotFoundError("BMTC stop_times.txt not found")

    if origin_stop_id == destination_stop_id:
        return []

    # Store only the two requested stops for each trip.
    origin_events = {}
    destination_events = {}

    for chunk in pd.read_csv(
        file_path,
        usecols=[
            "trip_id",
            "arrival_time",
            "departure_time",
            "stop_id",
            "stop_sequence"
        ],
        dtype=str,
        chunksize=250000,
        encoding="utf-8-sig",
        keep_default_na=False
    ):

        relevant = chunk[
            chunk["stop_id"].isin([
                origin_stop_id,
                destination_stop_id
            ])
        ]

        for row in relevant.itertuples(index=False):

            event = {
                "sequence": int(row.stop_sequence),
                "arrival": row.arrival_time,
                "departure": row.departure_time
            }

            if row.stop_id == origin_stop_id:
                origin_events[row.trip_id] = event

            elif row.stop_id == destination_stop_id:
                destination_events[row.trip_id] = event

    trips = get_trips().drop_duplicates("trip_id")
    trip_routes = dict(zip(trips["trip_id"], trips["route_id"]))

    routes = get_routes().drop_duplicates("route_id")
    route_details = routes.set_index("route_id").to_dict("index")

    journeys = []

    matching_trip_ids = (
        set(origin_events.keys())
        & set(destination_events.keys())
    )

    for trip_id in matching_trip_ids:

        origin = origin_events[trip_id]
        destination = destination_events[trip_id]

        if origin["sequence"] >= destination["sequence"]:
            continue

        departure = time_to_seconds(
            origin["departure"] or origin["arrival"]
        )

        arrival = time_to_seconds(
            destination["arrival"] or destination["departure"]
        )

        if departure is None or arrival is None:
            continue

        duration = arrival - departure

        if duration < 0:
            continue

        route_id = trip_routes.get(trip_id)
        route = route_details.get(route_id)

        if not route:
            continue

        journeys.append({
            "trip_id": trip_id,
            "route_id": route_id,
            "route_number": route.get("route_short_name", ""),
            "route_name": route.get("route_long_name", ""),
            "departure_time": origin["departure"] or origin["arrival"],
            "arrival_time": destination["arrival"] or destination["departure"],
            "duration_minutes": round(duration / 60),
        })

    journeys.sort(
        key=lambda item: (
            item["duration_minutes"],
            time_to_seconds(item["departure_time"]) or 0
        )
    )

    return journeys[:50]

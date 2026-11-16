
from functools import lru_cache
from pathlib import Path

import pandas as pd


# Location of the extracted BMTC GTFS dataset
DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "bmtc"


def load_gtfs_file(filename, columns=None):
    """Read a GTFS CSV-style text file."""

    file_path = DATA_DIR / filename

    if not file_path.exists():
        raise FileNotFoundError(
            f"GTFS file not found: {file_path}"
        )

    return pd.read_csv(
        file_path,
        usecols=columns,
        dtype=str,
        encoding="utf-8-sig",
        keep_default_na=False
    )


@lru_cache(maxsize=1)
def get_routes():
    return load_gtfs_file(
        "routes.txt",
        [
            "route_id",
            "agency_id",
            "route_short_name",
            "route_long_name",
            "route_desc",
            "route_type"
        ]
    )


@lru_cache(maxsize=1)
def get_stops():
    return load_gtfs_file(
        "stops.txt",
        [
            "stop_id",
            "stop_code",
            "stop_name",
            "stop_lat",
            "stop_lon"
        ]
    )


@lru_cache(maxsize=1)
def get_trips():
    return load_gtfs_file(
        "trips.txt",
        [
            "route_id",
            "service_id",
            "trip_id",
            "trip_headsign",
            "direction_id"
        ]
    )


@lru_cache(maxsize=1)
def get_fares():
    return load_gtfs_file(
        "fare_attributes.txt",
        [
            "fare_id",
            "price",
            "currency_type",
            "payment_method",
            "transfers"
        ]
    )


def get_dataset_stats():
    routes = get_routes()
    stops = get_stops()
    trips = get_trips()
    fares = get_fares()

    return {
        "total_routes": len(routes),
        "total_stops": len(stops),
        "total_trips": len(trips),
        "total_fare_types": len(fares)
    }


import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import { Search, MapPin, RefreshCw } from "lucide-react";

import "leaflet/dist/leaflet.css";

function StopExplorer() {
  const [stops, setStops] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStops = async (searchValue = "") => {
    setLoading(true);
    setError("");

    try {
      const url = new URL("http://127.0.0.1:8000/api/gtfs/stops");
      url.searchParams.set("search", searchValue);
      url.searchParams.set("limit", "200");
      url.searchParams.set("offset", "0");

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const result = await response.json();

      setStops(result.data || []);
    } catch (err) {
      console.error("Bus stop API error:", err);
      setError(
        "Could not load bus stops. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchStops(search.trim());
  };

  const validStops = stops.filter((stop) => {
    const lat = Number(stop.stop_lat);
    const lon = Number(stop.stop_lon);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180 &&
      lat !== 0 &&
      lon !== 0
    );
  });

  return (
    <section className="w-full">

      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4">
          <Search size={20} className="text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bus stop name..."
            className="w-full py-4 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-green-700 px-7 py-3 font-bold text-white hover:bg-green-800 disabled:opacity-60"
        >
          Search Stops
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setSearch("");
            fetchStops("");
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-100 disabled:opacity-60"
        >
          <RefreshCw size={18} />
          Reset
        </button>
      </form>

      {/* STATUS */}
      {loading && (
        <div className="mb-5 rounded-xl bg-green-50 p-5 text-center font-semibold text-green-800">
          Loading BMTC bus stops...
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                BMTC Bus Stops
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Bus stops returned by the GTFS dataset search
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
              {stops.length} stops found
            </span>
          </div>

          {stops.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No bus stops found. Try a different name.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">

              {/* BUS STOP LIST */}
              <div className="max-h-[520px] space-y-3 overflow-y-auto pr-2">

                {stops.map((stop) => (
                  <div
                    key={stop.stop_id}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-green-400 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">

                      <div className="rounded-xl bg-green-100 p-3 text-green-800">
                        <MapPin size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900">
                          {stop.stop_name || "Unnamed bus stop"}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          Stop ID: {stop.stop_id}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          Latitude: {stop.stop_lat || "Unavailable"}
                        </p>

                        <p className="text-sm text-slate-600">
                          Longitude: {stop.stop_lon || "Unavailable"}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}

              </div>

              {/* INTERACTIVE MAP */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                <div className="bg-green-800 px-5 py-4 text-white">
                  <h3 className="font-bold">Bengaluru Bus Stop Map</h3>
                  <p className="mt-1 text-sm text-green-100">
                    Showing locations with valid coordinates
                  </p>
                </div>

                <div className="h-[460px] w-full">
                  <MapContainer
                    center={[12.9716, 77.5946]}
                    zoom={11}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {validStops.map((stop) => (
                      <CircleMarker
                        key={stop.stop_id}
                        center={[
                          Number(stop.stop_lat),
                          Number(stop.stop_lon),
                        ]}
                        radius={6}
                        pathOptions={{
                          color: "#166534",
                          fillColor: "#22c55e",
                          fillOpacity: 0.8,
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>
                              {stop.stop_name || "Unnamed bus stop"}
                            </strong>
                            <br />
                            Stop ID: {stop.stop_id}
                            <br />
                            Latitude: {stop.stop_lat}
                            <br />
                            Longitude: {stop.stop_lon}
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>

                <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {validStops.length} stops plotted on the map
                </div>
              </div>

            </div>
          )}
        </>
      )}
    </section>
  );
}

export default StopExplorer;

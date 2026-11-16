
import { useState } from "react";
import {
  Search,
  MapPin,
  BusFront,
  Clock3,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function JourneyPlanner() {
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");

  const [originResults, setOriginResults] = useState([]);
  const [destinationResults, setDestinationResults] = useState([]);

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const [journeys, setJourneys] = useState([]);
  const [loadingStops, setLoadingStops] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function searchStops(text, type) {
    if (type === "origin") {
      setOriginText(text);
      setOrigin(null);
      setOriginResults([]);
    } else {
      setDestinationText(text);
      setDestination(null);
      setDestinationResults([]);
    }

    if (text.trim().length < 2) return;

    try {
      setLoadingStops(type);

      const response = await fetch(
        `${API_URL}/api/gtfs/stops?search=${encodeURIComponent(text)}&limit=15`
      );

      if (!response.ok) {
        throw new Error("Could not search bus stops.");
      }

      const result = await response.json();

      if (type === "origin") {
        setOriginResults(result.data || []);
      } else {
        setDestinationResults(result.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStops("");
    }
  }

  function chooseStop(stop, type) {
    if (type === "origin") {
      setOrigin(stop);
      setOriginText(stop.stop_name);
      setOriginResults([]);
    } else {
      setDestination(stop);
      setDestinationText(stop.stop_name);
      setDestinationResults([]);
    }

    setJourneys([]);
    setSearched(false);
    setError("");
  }

  async function findJourneys(event) {
    event.preventDefault();

    if (!origin || !destination) {
      setError("Please select both starting and destination stops from the suggestions.");
      return;
    }

    if (origin.stop_id === destination.stop_id) {
      setError("Starting stop and destination must be different.");
      return;
    }

    try {
      setSearching(true);
      setError("");
      setSearched(false);
      setJourneys([]);

      const params = new URLSearchParams({
        origin_stop_id: origin.stop_id,
        destination_stop_id: destination.stop_id
      });

      const response = await fetch(
        `${API_URL}/api/journeys/direct?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Journey search failed.");
      }

      setJourneys(result.data || []);
      setSearched(true);

    } catch (err) {
      setError(err.message || "Unable to find journeys.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-7">

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">
              Passenger Services
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              Plan Your Journey
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Search BMTC scheduled direct bus services between two stops.
            </p>
          </div>

          <form onSubmit={findJourneys} className="space-y-5">

            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Starting point
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-green-600">
                <MapPin className="shrink-0 text-green-700" size={20} />

                <input
                  value={originText}
                  onChange={(event) =>
                    searchStops(event.target.value, "origin")
                  }
                  placeholder="Search starting bus stop"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              {loadingStops === "origin" && (
                <p className="mt-2 text-xs text-slate-500">
                  Searching stops...
                </p>
              )}

              {originResults.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                  {originResults.map((stop) => (
                    <button
                      type="button"
                      key={stop.stop_id}
                      onClick={() => chooseStop(stop, "origin")}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-green-50"
                    >
                      <span className="block text-sm font-semibold text-slate-800">
                        {stop.stop_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        Stop ID: {stop.stop_id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Destination
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-green-600">
                <MapPin className="shrink-0 text-red-500" size={20} />

                <input
                  value={destinationText}
                  onChange={(event) =>
                    searchStops(event.target.value, "destination")
                  }
                  placeholder="Search destination bus stop"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              {loadingStops === "destination" && (
                <p className="mt-2 text-xs text-slate-500">
                  Searching stops...
                </p>
              )}

              {destinationResults.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                  {destinationResults.map((stop) => (
                    <button
                      type="button"
                      key={stop.stop_id}
                      onClick={() => chooseStop(stop, "destination")}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-green-50"
                    >
                      <span className="block text-sm font-semibold text-slate-800">
                        {stop.stop_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        Stop ID: {stop.stop_id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={searching}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-700 px-5 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? (
                <>
                  <RefreshCw size={19} className="animate-spin" />
                  Finding scheduled buses...
                </>
              ) : (
                <>
                  <Search size={19} />
                  Find Buses
                  <ArrowRight size={19} />
                </>
              )}
            </button>

          </form>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-green-900 to-emerald-700 p-8 text-white shadow-sm">
          <BusFront size={45} className="mb-5 text-green-200" />

          <h3 className="text-2xl font-extrabold">
            Travel Smarter with Namma Payana
          </h3>

          <p className="mt-4 leading-7 text-green-100">
            Explore scheduled BMTC services, compare direct journeys
            and plan your trip using the available transport dataset.
          </p>

          <div className="mt-7 rounded-xl border border-white/20 bg-white/10 p-4">
            <p className="text-sm font-semibold text-green-100">
              Journey search coverage
            </p>
            <p className="mt-2 text-sm leading-6 text-white">
              Direct scheduled services between selected stops.
              Transfer suggestions and live bus tracking are not included
              in this version.
            </p>
          </div>
        </div>

      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {searched && (
        <div>
          <div className="mb-5">
            <h3 className="text-xl font-extrabold text-slate-900">
              Available Direct Journeys
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {origin?.stop_name} to {destination?.stop_name}
            </p>
          </div>

          {journeys.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <BusFront size={35} className="mx-auto mb-3 text-slate-400" />
              <p className="font-semibold text-slate-800">
                No direct scheduled service found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try different nearby stops. This search does not yet include transfers.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {journeys.map((journey) => (
                <div
                  key={journey.trip_id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-green-100 px-3 py-2 text-sm font-extrabold text-green-800">
                      Route {journey.route_number || "N/A"}
                    </span>

                    <BusFront className="text-green-700" size={23} />
                  </div>

                  <p className="mt-4 font-bold text-slate-900">
                    {journey.route_name}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xl font-extrabold text-slate-900">
                        {journey.departure_time}
                      </p>
                      <p className="text-xs text-slate-500">Departure</p>
                    </div>

                    <ArrowRight className="text-green-700" />

                    <div className="text-right">
                      <p className="text-xl font-extrabold text-slate-900">
                        {journey.arrival_time}
                      </p>
                      <p className="text-xs text-slate-500">Arrival</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-600">
                    <Clock3 size={17} className="text-green-700" />
                    {journey.duration_minutes} minutes scheduled duration
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Times and durations are taken from the GTFS schedule. They are
            not live arrival predictions and may not reflect current operations.
          </p>
        </div>
      )}

    </div>
  );
}


import { useEffect, useState } from "react";
import { Search, BusFront, RefreshCw, AlertCircle } from "lucide-react";

function RouteExplorer() {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRoutes = async (searchValue = "") => {
    setLoading(true);
    setError("");

    try {
      const url = new URL("http://127.0.0.1:8000/api/gtfs/routes");
      url.searchParams.set("search", searchValue);
      url.searchParams.set("limit", "50");
      url.searchParams.set("offset", "0");

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();

      setRoutes(result.data || []);
    } catch (err) {
      setError(
        "Unable to load BMTC routes. Please check whether the FastAPI backend is running."
      );
      console.error("Route API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchRoutes(search);
  };

  return (
    <section className="w-full">

      <div className="mb-6 flex flex-col gap-4 md:flex-row">

        <form
          onSubmit={handleSearch}
          className="flex flex-1 gap-2"
        >
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4">
            <Search size={20} className="text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search BMTC route number or destination..."
              className="w-full py-4 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-green-700 px-6 font-bold text-white hover:bg-green-800 disabled:opacity-60"
          >
            Search
          </button>
        </form>

        <button
          onClick={() => {
            setSearch("");
            fetchRoutes("");
          }}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-100 disabled:opacity-60"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {loading && (
        <div className="rounded-xl bg-green-50 p-6 text-center font-semibold text-green-800">
          Loading BMTC routes...
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle size={22} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold">
              Available BMTC Routes
            </h3>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
              {routes.length} routes shown
            </span>
          </div>

          {routes.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No routes found. Try another route number or destination.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {routes.map((route) => (
                <div
                  key={route.route_id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
                      <BusFront size={25} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        BMTC Route
                      </p>

                      <h4 className="text-xl font-extrabold text-green-800">
                        {route.route_short_name || "Route"}
                      </h4>
                    </div>

                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Route Destination
                    </p>

                    <p className="mt-1 leading-6 text-slate-800">
                      {route.route_long_name || "Destination unavailable"}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-500">
                      Route ID
                    </p>

                    <p className="mt-1 break-all text-xs font-medium text-slate-700">
                      {route.route_id}
                    </p>
                  </div>

                </div>
              ))}

            </div>
          )}
        </>
      )}

    </section>
  );
}

export default RouteExplorer;

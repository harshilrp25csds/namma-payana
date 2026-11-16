
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
  RefreshCw,
  BusFront,
  MapPin,
  Clock3,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/analytics/overview`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status !== "success") {
        throw new Error("Could not load analytics.");
      }

      setData(result.analytics);
    } catch (err) {
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  const cards = data
    ? [
        {
          title: "Total Routes",
          value: data.total_routes,
          icon: BusFront
        },
        {
          title: "Bus Stops",
          value: data.total_stops,
          icon: MapPin
        },
        {
          title: "Scheduled Trips",
          value: data.total_trips,
          icon: Clock3
        },
        {
          title: "Routes Analyzed",
          value: data.routes_analyzed,
          icon: TrendingUp
        }
      ]
    : [];

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <RefreshCw className="mx-auto mb-3 animate-spin text-green-700" />
        <p className="font-semibold text-slate-700">
          Processing BMTC transport data...
        </p>
        <p className="mt-2 text-sm text-slate-500">
          The first analytics request may take a little time.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8">
        <AlertCircle className="mb-3 text-red-600" size={30} />
        <h3 className="text-lg font-bold text-slate-800">
          Analytics unavailable
        </h3>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <button
          onClick={loadAnalytics}
          className="mt-5 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          Retry
        </button>
      </div>
    );
  }

  const hourly = data.hourly_departures || [];
  const topRoutes = data.top_routes || [];

const recommendations = [];

if (data.peak_hour) {
  recommendations.push({
    title: "Review peak-hour scheduling",
    description: `The highest scheduled stop-event activity occurs around ${data.peak_hour.label}. Review whether the planned service frequency adequately covers this period.`,
    priority: "High"
  });
}

if (topRoutes.length > 0) {
  recommendations.push({
    title: "Review high-activity routes",
    description: `Route ${topRoutes[0].route_number} has the most scheduled stop events in the analyzed data. Review its timetable and service coverage.`,
    priority: "Medium"
  });
}

recommendations.push({
  title: "Collect actual ridership data",
  description: "Connect verified passenger-count data in the future to identify genuinely overcrowded and underutilized services.",
  priority: "Future improvement"
});


  return (
    <div className="space-y-8">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-green-700">
            Admin Control Centre
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
            Transport Analytics
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Insights generated from the BMTC GTFS schedule dataset.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 rounded-xl border border-green-200 px-4 py-3 font-semibold text-green-800 hover:bg-green-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>
                <div className="rounded-xl bg-green-50 p-3 text-green-700">
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-5 text-3xl font-extrabold text-slate-900">
                {Number(card.value || 0).toLocaleString("en-IN")}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Scheduled Departures by Hour
          </h3>
          <p className="mb-4 mt-1 text-sm text-slate-500">
            Number of scheduled stop departures recorded for each hour.
          </p>

          {hourly.length > 0 ? (
            <Plot
              data={[
                {
                  x: hourly.map((item) => item.label),
                  y: hourly.map((item) => item.scheduled_departures),
                  type: "bar",
                  marker: { color: "#16834b" },
                  hovertemplate: "%{x}<br>Scheduled events: %{y}<extra></extra>"
                }
              ]}
              layout={{
                autosize: true,
                height: 330,
                margin: { l: 55, r: 15, t: 20, b: 55 },
                xaxis: { title: "Hour of day" },
                yaxis: { title: "Scheduled stop events" },
                paper_bgcolor: "white",
                plot_bgcolor: "white"
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%" }}
              useResizeHandler
            />
          ) : (
            <p className="py-12 text-center text-slate-500">
              No hourly schedule information available.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Top Routes by Scheduled Stop Events
          </h3>
          <p className="mb-4 mt-1 text-sm text-slate-500">
            Routes with the highest number of scheduled stop-time records.
          </p>

          {topRoutes.length > 0 ? (
            <Plot
              data={[
                {
                  x: topRoutes.map((item) => item.scheduled_stop_events),
                  y: topRoutes.map(
                    (item) =>
                      `${item.route_number} – ${item.route_name}`
                  ),
                  type: "bar",
                  orientation: "h",
                  marker: { color: "#287bca" },
                  hovertemplate: "%{y}<br>Scheduled events: %{x}<extra></extra>"
                }
              ]}
              layout={{
                autosize: true,
                height: 330,
                margin: { l: 170, r: 20, t: 20, b: 50 },
                xaxis: { title: "Scheduled stop events" },
                yaxis: { automargin: true, autorange: "reversed" },
                paper_bgcolor: "white",
                plot_bgcolor: "white"
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%" }}
              useResizeHandler
            />
          ) : (
            <p className="py-12 text-center text-slate-500">
              No route analytics available.
            </p>
          )}
        </div>

      </div>

      <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
        <h3 className="font-bold text-green-900">
          Schedule Insight
        </h3>

{/* SERVICE RECOMMENDATIONS */}
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <div className="mb-6">
    <p className="text-sm font-bold uppercase tracking-widest text-green-700">
      Decision Support
    </p>

    <h3 className="mt-2 text-xl font-extrabold text-slate-900">
      Service Recommendations
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      Rule-based suggestions generated from the available BMTC schedule data.
    </p>
  </div>

  <div className="space-y-4">
    {recommendations.map((item, index) => (
      <div
        key={index}
        className="rounded-xl border border-slate-100 bg-slate-50 p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-bold text-slate-900">
            {item.title}
          </h4>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
            {item.priority}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {item.description}
        </p>
      </div>
    ))}
  </div>

  <p className="mt-5 text-xs leading-5 text-slate-500">
    Recommendations are decision-support suggestions, not automated
    operational instructions. Actual ridership and fleet data are
    required before making service changes.
  </p>

</div>

        {data.peak_hour ? (
          <p className="mt-2 leading-7 text-green-900">
            The highest number of scheduled stop-time events occurs around{" "}
            <strong>{data.peak_hour.label}</strong>, with{" "}
            <strong>
              {Number(
                data.peak_hour.scheduled_departures
              ).toLocaleString("en-IN")}
            </strong>{" "}
            scheduled events in that hour.
          </p>
        ) : (
          <p className="mt-2 text-green-900">
            Peak-hour information is not available.
          </p>
        )}

        <p className="mt-3 text-xs leading-5 text-green-800">
          This is a schedule-based indicator, not a measurement of actual
          passenger demand, congestion or live bus operations.
        </p>
      </div>

    </div>
  );
}

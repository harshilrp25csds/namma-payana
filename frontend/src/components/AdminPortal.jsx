
import { useState } from "react";
import {
  BusFront,
  LayoutDashboard,
  ChartNoAxesCombined,
  MessageSquare,
  Megaphone,
  LogOut,
  Menu,
  X,
  Route,
  Clock3,
  Lightbulb,
  Users,
  Send,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import AdminDashboard from "./AdminDashboard";

export default function AdminPortal({ onBack }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const [announcement, setAnnouncement] = useState({
    title: "",
    message: "",
    audience: "All Passengers",
  });

  const [announcementMessage, setAnnouncementMessage] = useState("");

  const navigation = [
    { id: "overview", label: "Admin Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Transport Analytics", icon: ChartNoAxesCombined },
    { id: "routes", label: "Route Performance", icon: Route },
    { id: "peak", label: "Peak-Hour Insights", icon: Clock3 },
    { id: "recommendations", label: "Service Recommendations", icon: Lightbulb },
    { id: "feedback", label: "Passenger Feedback", icon: MessageSquare },
    { id: "announcements", label: "Announcements", icon: Megaphone },
  ];

  const selectSection = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
    setAnnouncementMessage("");
  };

  const handleAnnouncementSubmit = (event) => {
    event.preventDefault();

    if (!announcement.title.trim() || !announcement.message.trim()) {
      setAnnouncementMessage("Please enter both an announcement title and message.");
      return;
    }

    setAnnouncementMessage(
      "Announcement preview created. It has not been published or sent to passengers."
    );

    setAnnouncement({
      title: "",
      message: "",
      audience: "All Passengers",
    });
  };

  const quickLinks = [
    {
      title: "Transport Analytics",
      description: "Review schedule-based transport patterns and charts.",
      icon: ChartNoAxesCombined,
      section: "analytics",
    },
    {
      title: "Route Performance",
      description: "Review routes with higher scheduled service activity.",
      icon: Route,
      section: "routes",
    },
    {
      title: "Peak-Hour Insights",
      description: "Explore the busiest scheduled departure periods.",
      icon: Clock3,
      section: "peak",
    },
    {
      title: "Service Recommendations",
      description: "Review data-informed planning suggestions.",
      icon: Lightbulb,
      section: "recommendations",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle admin menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <div className="rounded-xl bg-slate-900 p-2.5 text-white">
            <BusFront size={25} />
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              Namma Payana
            </h1>
            <p className="text-xs text-slate-500">Administration Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 sm:inline-flex">
            DEMO PREVIEW
          </span>

          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={17} />
            Back to Home
          </button>
        </div>
      </header>

      <div className="flex">
        {/* MOBILE SIDEBAR OVERLAY */}
        {menuOpen && (
          <button
            className="fixed inset-0 z-20 bg-black/30 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-label="Close admin menu overlay"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`fixed bottom-0 left-0 top-[73px] z-30 w-72 overflow-y-auto border-r bg-white p-4 transition-transform lg:sticky lg:top-[73px] lg:block lg:h-[calc(100vh-73px)] ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="mb-6 rounded-2xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2 text-green-300">
              <ShieldCheck size={19} />
              <p className="text-xs font-bold uppercase tracking-wider">
                Administration
              </p>
            </div>

            <h2 className="mt-3 text-lg font-bold">
              Transport Control Centre
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Monitor transport data and service patterns.
            </p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => selectSection(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeSection === item.id
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs leading-5 text-amber-900">
              Demo preview only. Admin access control and data management
              require verified admin authentication.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 p-5 md:p-8">
          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <>
              <div className="mb-8">
                <p className="font-semibold text-green-700">
                  ADMINISTRATION PORTAL
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  Transport Management Dashboard
                </h2>

                <p className="mt-2 text-slate-500">
                  Monitor BMTC schedule data and explore transport
                  performance insights.
                </p>
              </div>

              <div className="mb-8 rounded-2xl bg-slate-900 p-7 text-white">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold text-green-300">
                      NAMMA PAYANA ADMIN
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">
                      Welcome to the Control Centre
                    </h3>
                    <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                      Explore scheduled service patterns, identify peak
                      departure periods and review route-level insights
                      from the connected BMTC dataset.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">
                    <ChartNoAxesCombined
                      size={42}
                      className="text-green-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {quickLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      onClick={() => selectSection(item.section)}
                      className="rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <Icon size={24} />
                      </div>

                      <h3 className="font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-green-700">
                        Open section →
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border bg-white p-6">
                  <Users className="text-green-700" size={28} />
                  <h3 className="mt-3 font-bold">Passenger Feedback</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Open the feedback management area. Real passenger
                    submissions will appear after database integration.
                  </p>
                  <button
                    onClick={() => selectSection("feedback")}
                    className="mt-4 text-sm font-bold text-green-700"
                  >
                    Open feedback →
                  </button>
                </div>

                <div className="rounded-2xl border bg-white p-6">
                  <Megaphone className="text-green-700" size={28} />
                  <h3 className="mt-3 font-bold">Passenger Announcements</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Prepare service updates and announcements for a future
                    publishing workflow.
                  </p>
                  <button
                    onClick={() => selectSection("announcements")}
                    className="mt-4 text-sm font-bold text-green-700"
                  >
                    Create announcement →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TRANSPORT ANALYTICS */}
          {activeSection === "analytics" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold">
                  Transport Analytics
                </h2>
                <p className="mt-2 text-slate-500">
                  Overview of routes, stops, trips and scheduled service
                  patterns.
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 md:p-7">
                <AdminDashboard />
              </div>
            </section>
          )}

          {/* ROUTE PERFORMANCE */}
          {activeSection === "routes" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold">
                  Route Performance
                </h2>
                <p className="mt-2 text-slate-500">
                  Explore route-level scheduled service activity.
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 md:p-7">
                <AdminDashboard />
              </div>

              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                Route activity in this dashboard is derived from scheduled
                GTFS trips and stop-time records. It is not measured
                passenger ridership or actual bus occupancy.
              </div>
            </section>
          )}

          {/* PEAK-HOUR INSIGHTS */}
          {activeSection === "peak" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold">
                  Peak-Hour Insights
                </h2>
                <p className="mt-2 text-slate-500">
                  Review scheduled departure patterns by hour.
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 md:p-7">
                <AdminDashboard />
              </div>

              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                Peak periods are calculated from timetable departure data.
                They should not be interpreted as measured traffic
                congestion or passenger demand.
              </div>
            </section>
          )}

          {/* SERVICE RECOMMENDATIONS */}
          {activeSection === "recommendations" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold">
                  Service Recommendations
                </h2>
                <p className="mt-2 text-slate-500">
                  Planning considerations based on available schedule
                  information.
                </p>
              </div>

              <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-blue-700" />
                <p className="text-sm leading-6 text-blue-900">
                  These are planning suggestions, not automatic operational
                  instructions. Actual service changes require verified
                  ridership, fleet availability and transport authority review.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border bg-white p-6">
                  <Clock3 className="text-green-700" size={28} />
                  <h3 className="mt-4 font-bold">
                    Review Peak Departure Periods
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Examine scheduled departure patterns during busy
                    timetable periods when planning service frequency.
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-6">
                  <Route className="text-green-700" size={28} />
                  <h3 className="mt-4 font-bold">
                    Review Route Coverage
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Compare route schedules and stop coverage to identify
                    areas that may need further transport analysis.
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-6">
                  <ChartNoAxesCombined className="text-green-700" size={28} />
                  <h3 className="mt-4 font-bold">
                    Compare Service Patterns
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Compare scheduled trip frequency across routes and
                    time periods before considering service changes.
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-6">
                  <Users className="text-green-700" size={28} />
                  <h3 className="mt-4 font-bold">
                    Include Passenger Feedback
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Combine passenger reports with verified operational
                    data to understand service issues.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* PASSENGER FEEDBACK */}
          {activeSection === "feedback" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold">
                  Passenger Feedback Management
                </h2>
                <p className="mt-2 text-slate-500">
                  Review and manage feedback submitted through the passenger
                  portal.
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-8 text-center">
                <MessageSquare
                  className="mx-auto text-slate-300"
                  size={45}
                />

                <h3 className="mt-4 text-lg font-bold">
                  No feedback records available
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-500">
                  Passenger feedback will appear here after the feedback
                  form is connected to the backend database. You can then
                  review submissions and update their status.
                </p>

                <span className="mt-5 inline-flex rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800">
                  Database integration pending
                </span>
              </div>
            </section>
          )}

          {/* ANNOUNCEMENTS */}
          {activeSection === "announcements" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold">
                  Passenger Announcements
                </h2>
                <p className="mt-2 text-slate-500">
                  Prepare a transport service announcement preview.
                </p>
              </div>

              <div className="max-w-2xl rounded-2xl border bg-white p-7">
                <Megaphone className="text-green-700" size={34} />

                <h3 className="mt-4 text-xl font-bold">
                  Create Announcement
                </h3>

                <form
                  onSubmit={handleAnnouncementSubmit}
                  className="mt-6 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Announcement title
                    </label>
                    <input
                      type="text"
                      value={announcement.title}
                      onChange={(event) =>
                        setAnnouncement({
                          ...announcement,
                          title: event.target.value,
                        })
                      }
                      placeholder="Enter announcement title"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Target audience
                    </label>
                    <select
                      value={announcement.audience}
                      onChange={(event) =>
                        setAnnouncement({
                          ...announcement,
                          audience: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
                    >
                      <option>All Passengers</option>
                      <option>Route-specific Passengers</option>
                      <option>Staff</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Announcement message
                    </label>
                    <textarea
                      rows={5}
                      value={announcement.message}
                      onChange={(event) =>
                        setAnnouncement({
                          ...announcement,
                          message: event.target.value,
                        })
                      }
                      placeholder="Write your announcement..."
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800"
                  >
                    <Send size={17} />
                    Preview Announcement
                  </button>

                  {announcementMessage && (
                    <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                      {announcementMessage}
                    </p>
                  )}
                </form>

                <p className="mt-5 text-xs leading-5 text-slate-500">
                  Demo only: this creates a local preview message. It does
                  not publish an announcement or notify passengers.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

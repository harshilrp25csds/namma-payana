
import { useState } from "react";
import {
  BusFront,
  Home,
  MapPin,
  Route,
  Clock3,
  Bell,
  User,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Ticket,
  ShieldCheck,
  Send,
  CheckCircle,
} from "lucide-react";

import JourneyPlanner from "./JourneyPlanner";
import StopExplorer from "./StopExplorer";
import RouteExplorer from "./RouteExplorer";

export default function PassengerDashboard({ onBack }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [feedback, setFeedback] = useState({
    category: "General Feedback",
    message: "",
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const navigation = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "journey", label: "Plan a Journey", icon: Route },
    { id: "routes", label: "Explore Routes", icon: BusFront },
    { id: "stops", label: "Bus Stops Map", icon: MapPin },
    { id: "schedule", label: "Schedule Information", icon: Clock3 },
    { id: "tickets", label: "Tickets & Passes", icon: Ticket },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "feedback", label: "Feedback & Support", icon: MessageSquare },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const selectSection = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
    setProfileMessage("");
    setFeedbackMessage("");
  };

  const handleProfileSave = (event) => {
    event.preventDefault();

    if (!profile.name.trim() || !profile.phone.trim()) {
      setProfileMessage("Please enter your name and phone number.");
      return;
    }

    setProfileMessage(
      "Demo profile updated in this browser session. It has not been saved to a database."
    );
  };

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();

    if (!feedback.message.trim()) {
      setFeedbackMessage("Please enter your feedback before submitting.");
      return;
    }

    setFeedbackMessage(
      "Demo submission complete. Feedback is not stored or sent to the transport team yet."
    );

    setFeedback({
      category: "General Feedback",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle dashboard menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <div className="rounded-xl bg-green-700 p-2.5 text-white">
            <BusFront size={25} />
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-green-800">
              Namma Payana
            </h1>
            <p className="text-xs text-slate-500">Passenger Dashboard</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <LogOut size={17} />
          Back to Home
        </button>
      </header>

      <div className="flex">
        {menuOpen && (
          <button
            className="fixed inset-0 z-20 bg-black/30 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu overlay"
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
          <div className="mb-6 rounded-2xl bg-green-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-green-700">
              Passenger Portal
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              Welcome!
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Explore Bengaluru public transport.
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
                      ? "bg-green-700 text-white"
                      : "text-slate-600 hover:bg-green-50 hover:text-green-800"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs leading-5 text-amber-800">
              Demo dashboard. Account authentication and database storage
              will be connected in a later phase.
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
                  PASSENGER PORTAL
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  Your Travel Dashboard
                </h2>
                <p className="mt-2 text-slate-500">
                  Plan journeys and explore BMTC transport information.
                </p>
              </div>

              <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    title: "Journey Planner",
                    description: "Find scheduled direct bus journeys.",
                    icon: Route,
                    section: "journey",
                  },
                  {
                    title: "Explore Routes",
                    description: "Search routes in the BMTC dataset.",
                    icon: BusFront,
                    section: "routes",
                  },
                  {
                    title: "Find Bus Stops",
                    description: "Explore bus stop locations on a map.",
                    icon: MapPin,
                    section: "stops",
                  },
                  {
                    title: "Tickets & Passes",
                    description: "Passenger ticketing features planned.",
                    icon: Ticket,
                    section: "tickets",
                  },
                ].map((item) => {
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
                        Open section <ArrowRight size={15} />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-slate-900 p-7 text-white">
                <p className="text-sm font-semibold text-green-300">
                  TRAVEL SMARTER
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Explore Bengaluru with Namma Payana
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                  Use the journey planner, route explorer and bus stop map
                  to explore information from the available BMTC schedule
                  dataset.
                </p>
                <button
                  onClick={() => selectSection("journey")}
                  className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-500"
                >
                  Plan My Journey
                </button>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border bg-white p-6">
                  <Clock3 className="text-green-700" size={27} />
                  <h3 className="mt-3 font-bold">Scheduled Services</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Explore scheduled departures through the journey planner.
                    Live bus positions are not currently connected.
                  </p>
                  <button
                    onClick={() => selectSection("schedule")}
                    className="mt-4 text-sm font-bold text-green-700"
                  >
                    View schedules →
                  </button>
                </div>

                <div className="rounded-2xl border bg-white p-6">
                  <ShieldCheck className="text-green-700" size={27} />
                  <h3 className="mt-3 font-bold">Passenger Support</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Share feedback and explore the passenger support section.
                  </p>
                  <button
                    onClick={() => selectSection("feedback")}
                    className="mt-4 text-sm font-bold text-green-700"
                  >
                    Open support →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* JOURNEY PLANNER */}
          {activeSection === "journey" && (
            <div>
              <h2 className="mb-6 text-2xl font-extrabold">
                Plan Your Journey
              </h2>
              <JourneyPlanner />
            </div>
          )}

          {/* ROUTES */}
          {activeSection === "routes" && (
            <div>
              <h2 className="mb-6 text-2xl font-extrabold">
                Explore BMTC Routes
              </h2>
              <RouteExplorer />
            </div>
          )}

          {/* STOPS */}
          {activeSection === "stops" && (
            <div>
              <h2 className="mb-6 text-2xl font-extrabold">
                Bus Stops Map
              </h2>
              <StopExplorer />
            </div>
          )}

          {/* SCHEDULES */}
          {activeSection === "schedule" && (
            <div className="rounded-2xl border bg-white p-7">
              <Clock3 className="text-green-700" size={32} />
              <h2 className="mt-4 text-xl font-bold">
                Schedule Information
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                Explore scheduled trips through the journey planner and
                available route information. These are timetable-based
                schedules, not live bus arrival updates.
              </p>
              <button
                onClick={() => selectSection("journey")}
                className="mt-5 rounded-lg bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800"
              >
                Open Journey Planner
              </button>
            </div>
          )}

          {/* TICKETS */}
          {activeSection === "tickets" && (
            <div className="rounded-2xl border bg-white p-7">
              <Ticket className="text-green-700" size={34} />
              <h2 className="mt-4 text-xl font-bold">Tickets & Passes</h2>
              <p className="mt-2 max-w-2xl leading-7 text-slate-600">
                This section is reserved for passenger ticket history,
                active passes, digital tickets and QR-based ticket features.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-dashed p-5">
                  <Ticket className="text-slate-400" size={25} />
                  <h3 className="mt-3 font-bold">My Tickets</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    No ticket records are available in this demo.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed p-5">
                  <ShieldCheck className="text-slate-400" size={25} />
                  <h3 className="mt-3 font-bold">My Passes</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Pass purchase and validation are not connected yet.
                  </p>
                </div>
              </div>

              <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                Ticket purchases and payments are not enabled in this demo.
              </p>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div className="rounded-2xl border bg-white p-7">
              <Bell className="text-green-700" size={34} />
              <h2 className="mt-4 text-xl font-bold">Notifications</h2>
              <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
                <Bell className="mx-auto text-slate-300" size={40} />
                <h3 className="mt-3 font-bold text-slate-700">
                  No notifications yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Service alerts and passenger updates will appear here
                  when the notification service is connected.
                </p>
              </div>
            </div>
          )}

          {/* FEEDBACK */}
          {activeSection === "feedback" && (
            <div className="max-w-2xl rounded-2xl border bg-white p-7">
              <MessageSquare className="text-green-700" size={34} />
              <h2 className="mt-4 text-xl font-bold">
                Feedback & Support
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Share your suggestions or report an issue with the transport
                information shown on this platform.
              </p>

              <form onSubmit={handleFeedbackSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Feedback category
                  </label>
                  <select
                    value={feedback.category}
                    onChange={(event) =>
                      setFeedback({
                        ...feedback,
                        category: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
                  >
                    <option>General Feedback</option>
                    <option>Route Information</option>
                    <option>Schedule Information</option>
                    <option>Bus Stop Information</option>
                    <option>Website Issue</option>
                    <option>Suggestion</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Your message
                  </label>
                  <textarea
                    value={feedback.message}
                    onChange={(event) =>
                      setFeedback({
                        ...feedback,
                        message: event.target.value,
                      })
                    }
                    rows={5}
                    placeholder="Write your feedback here..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800"
                >
                  <Send size={17} />
                  Submit Feedback
                </button>

                {feedbackMessage && (
                  <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                    {feedbackMessage}
                  </p>
                )}
              </form>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                Demo only: this form does not send or save feedback. We will
                connect it to the backend later.
              </p>
            </div>
          )}

          {/* PROFILE */}
          {activeSection === "profile" && (
            <div className="max-w-2xl rounded-2xl border bg-white p-7">
              <User className="text-green-700" size={34} />
              <h2 className="mt-4 text-xl font-bold">My Profile</h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter demo details to preview the passenger profile screen.
              </p>

              <form onSubmit={handleProfileSave} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(event) =>
                      setProfile({ ...profile, name: event.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(event) =>
                      setProfile({ ...profile, phone: event.target.value })
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      setProfile({ ...profile, email: event.target.value })
                    }
                    placeholder="Enter email address"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800"
                >
                  Preview Profile Update
                </button>

                {profileMessage && (
                  <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                    {profileMessage}
                  </p>
                )}
              </form>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                Your real passenger ID and verified account details will
                be loaded after Supabase authentication is implemented.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

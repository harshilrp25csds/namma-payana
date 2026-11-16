
import { useState } from "react";
import {
  BusFront,
  Users,
  ShieldCheck,
  ArrowRight,
  Route,
  MapPin,
  ChartNoAxesCombined,
} from "lucide-react";

import PassengerDashboard from "./components/PassengerDashboard";
import AdminPortal from "./components/AdminPortal";

function App() {
  const [activePortal, setActivePortal] = useState("home");

  // Open Passenger Portal
  if (activePortal === "passenger") {
    return (
      <PassengerDashboard
        onBack={() => setActivePortal("home")}
      />
    );
  }

  // Open Admin Portal
  if (activePortal === "admin") {
    return (
      <AdminPortal
        onBack={() => setActivePortal("home")}
      />
    );
  }

  // Main Landing Page
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="bg-green-600 p-3 rounded-xl">
            <BusFront size={27} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Namma Payana
            </h1>
            <p className="text-xs text-slate-400">
              Bengaluru Public Transport Intelligence
            </p>
          </div>
        </div>
      </header>

      {/* MAIN HERO */}
      <section className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-5xl w-full text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 text-sm text-green-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Smart Mobility for Bengaluru
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Smarter Journeys.
            <span className="block text-green-400">
              Better Bengaluru.
            </span>
          </h2>

          <p className="mt-6 text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-8">
            Explore public transport routes, plan journeys and
            discover data-driven insights through one unified
            mobility platform.
          </p>

          {/* PORTAL OPTIONS */}
          <div className="grid md:grid-cols-2 gap-7 mt-14 max-w-3xl mx-auto">

            {/* PASSENGER */}
            <button
              onClick={() => setActivePortal("passenger")}
              className="group text-left bg-white text-slate-900 rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-green-500 hover:-translate-y-2 transition duration-300"
            >
              <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
                <Users size={30} />
              </div>

              <h3 className="text-2xl font-extrabold mt-6">
                Passenger Portal
              </h3>

              <p className="text-slate-500 mt-3 leading-7">
                Plan journeys, explore bus routes, locate stops
                and access passenger services.
              </p>

              <div className="mt-8 flex items-center justify-between text-green-700 font-bold">
                Enter Passenger Portal
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-2 transition"
                />
              </div>
            </button>

            {/* ADMIN */}
            <button
              onClick={() => setActivePortal("admin")}
              className="group text-left bg-slate-900 border border-white/15 rounded-3xl p-8 shadow-xl hover:border-green-500 hover:-translate-y-2 transition duration-300"
            >
              <div className="w-14 h-14 bg-green-500/15 text-green-400 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={30} />
              </div>

              <h3 className="text-2xl font-extrabold mt-6">
                Admin Portal
              </h3>

              <p className="text-slate-400 mt-3 leading-7">
                Analyze transport schedules, understand route
                patterns and explore service recommendations.
              </p>

              <div className="mt-8 flex items-center justify-between text-green-400 font-bold">
                Enter Admin Portal
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-2 transition"
                />
              </div>
            </button>

          </div>

          {/* SMALL PROJECT HIGHLIGHTS */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 text-slate-400 text-sm">

            <div className="flex items-center gap-2">
              <Route size={18} className="text-green-400" />
              Route Exploration
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-green-400" />
              Bus Stop Mapping
            </div>

            <div className="flex items-center gap-2">
              <ChartNoAxesCombined size={18} className="text-green-400" />
              Transport Analytics
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-5 py-6 text-center">
        <p className="text-sm text-slate-400">
          Namma Payana © {new Date().getFullYear()}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Public Transport Intelligence Platform | Bengaluru
        </p>
      </footer>

    </main>
  );
}

export default App;

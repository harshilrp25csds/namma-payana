
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthScreen({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendOTP(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
          data: {
            full_name: "",
          },
        },
      });

      if (error) throw error;

      setStep("otp");
      setMessage("Verification code sent. Check your email.");
    } catch (err) {
      setError(err.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the six-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: "email",
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Authentication was unsuccessful.");
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, public_id, full_name, phone, role")
          .eq("id", data.user.id)
          .single();

      if (profileError) {
        throw new Error(
          "Login succeeded, but your profile could not be loaded: " +
          profileError.message
        );
      }

      if (!["passenger", "admin"].includes(profile.role)) {
        throw new Error("Your account does not have an authorized role.");
      }

      onAuthenticated({
        user: data.user,
        profile,
      });

    } catch (err) {
      setError(err.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🚌</div>

          <h1 className="text-3xl font-bold text-green-800">
            Namma Payana
          </h1>

          <p className="text-gray-500 mt-2">
            Smart Bengaluru Public Transport
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={sendOTP} className="space-y-5">
            <h2 className="text-xl font-semibold">
              Welcome!
            </h2>

            <p className="text-gray-500 text-sm">
              Enter your email to receive a verification code.
            </p>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white p-3 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-5">
            <h2 className="text-xl font-semibold">
              Verify your email
            </h2>

            <p className="text-gray-500 text-sm">
              Enter the six-digit code sent to {email}.
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="000000"
              className="w-full border rounded-xl p-3 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white p-3 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-green-700 text-sm"
            >
              Change email address
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-green-700 text-sm text-center">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-sm text-center">
            {error}
          </p>
        )}

        <p className="text-xs text-gray-400 text-center mt-8">
          Secure authentication powered by Supabase
        </p>

      </div>
    </div>
  );
}

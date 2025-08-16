"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useUserStore } from "@/store/userStore";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const toggleMode = () =>
    setMode((prev) => (prev === "signIn" ? "signUp" : "signIn"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "signIn" ? "/auth/signin" : "/auth/signup";
      const response = await apiClient.post(endpoint, form);
      if (mode === "signIn") {
        useUserStore.getState().setToken(response.data);
        router.push("/dashboard");
      } else {
        setMode("signIn");
        setMessage("Signup successful, please sign in");
      }
    } catch (err: any) {
      console.log("err", err);
      setError(err.message);
    } finally {
      setForm({ email: "", password: "" });
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-background shadow-xl p-8 border border-secondary">
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
          {mode === "signIn" ? "Welcome Back" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {message && (
            <p className="text-sm text-center text-muted-foreground">
              {message}
            </p>
          )}

          {error && (
            <p className="text-sm text-center text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 hover:cursor-pointer transition"
          >
            {loading ? "Loading..." : mode === "signIn" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          {mode === "signIn"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-white hover:underline hover:cursor-pointer font-medium"
          >
            {mode === "signIn" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </main>
  );
}

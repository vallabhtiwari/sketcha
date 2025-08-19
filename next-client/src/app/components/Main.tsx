// app/components/Main.tsx
"use client";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { Moon, PenTool, Zap } from "lucide-react";

export function Main() {
  const loggedIn = useUserStore((state) => state.token !== null);
  const checkToken = async () => {
    try {
      const token = useUserStore.getState().token;
      if (!token) {
        const response = await apiClient.post("/auth/refresh");
        if (response.status === 200) {
          useUserStore.getState().setToken(response.data);
        }
      }
    } catch (err) {
      console.error("Error checking token:", err);
      useUserStore.getState().clearAuth();
    }
  };
  useEffect(() => {
    checkToken();
  }, [loggedIn]);
  return (
    <div className="mt-32 px-4 sm:px-8">
      <section className="max-w-5xl mx-auto py-10 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          Welcome to <span className="text-primary">Sketcha</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
          Collaborate in real-time. Sketch, brainstorm, and create together —
          wherever you are.
        </p>
        <div className="flex justify-center gap-4">
          <Link href={loggedIn ? "/dashboard" : "/auth"}>
            <button className="bg-primary text-white rounded-md px-6 py-3 font-medium shadow hover:cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-10 grid gap-8 sm:grid-cols-3 text-center">
        <Feature
          icon={<PenTool className="w-10 h-10" />}
          title="Collaborative Canvas"
          description="Draw in real-time with your team using powerful Fabric.js-powered tools."
        />
        <Feature
          icon={<Moon className="w-10 h-10" />}
          title="Dark Mode"
          description="Enjoy a beautiful soft peach theme in light or dark mode."
        />
        <Feature
          icon={<Zap className="w-10 h-10" />}
          title="Fast & Fluid"
          description="WebSocket-based real-time sync ensures no lag collaboration."
        />
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-primary">{icon}</div>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

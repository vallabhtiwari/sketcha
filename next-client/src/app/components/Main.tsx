// app/components/Main.tsx
import Link from "next/link";

export function Main() {
  return (
    <main className="flex-1 mt-32 px-4 sm:px-8">
      <section className="max-w-5xl mx-auto py-10 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          Welcome to <span className="text-primary">Sketcha</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
          Collaborate in real-time. Sketch, brainstorm, and create together —
          wherever you are.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/app">
            <button className="bg-primary text-white rounded-xl px-6 py-3 font-medium shadow hover:cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-10 grid gap-8 sm:grid-cols-3 text-center">
        <Feature
          icon="🖊️"
          title="Collaborative Canvas"
          description="Draw in real-time with your team using powerful Fabric.js-powered tools."
        />
        <Feature
          icon="🌙"
          title="Dark Mode"
          description="Enjoy a beautiful soft peach theme in light or dark mode."
        />
        <Feature
          icon="⚡"
          title="Fast & Fluid"
          description="WebSocket-based real-time sync ensures no lag collaboration."
        />
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

import Link from "next/link";

// app/components/Header.tsx
export function Header() {
  return (
    <header className="py-6 text-center">
      <div className="flex items-center justify-center gap-2">
        <Link href="/" className="text-3xl font-bold text-primary no-underline">
          <h1>Sketcha</h1>
        </Link>
      </div>
    </header>
  );
}

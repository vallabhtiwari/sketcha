import Link from "next/link";

// app/components/Header.tsx
export function Header() {
  return (
    <header className="py-6 text-center">
      <Link href="/" className="text-3xl font-bold text-primary no-underline">
        <h1>Sketcha</h1>
      </Link>
    </header>
  );
}

import { Copyright, Heart } from "lucide-react";

// app/components/Footer.tsx
export function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
      <div>
        <Copyright className="w-4 h-4 inline-block text-primary" />{" "}
        {new Date().getFullYear()} Sketcha. Made with{" "}
        <Heart className="w-4 h-4 inline-block text-primary" /> by{" "}
        <a
          href="https://github.com/vallabhtiwari"
          className="text-primary no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vallabh Tiwari
        </a>
      </div>
    </footer>
  );
}

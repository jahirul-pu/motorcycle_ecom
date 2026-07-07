import { Bike, Shield, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Bike className="h-8 w-8 text-amber-500" />
            <span className="text-xl font-bold tracking-tight text-white">
              MOTO<span className="text-amber-500">HUB</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
            <span className="hover:text-white transition-colors cursor-pointer">Parts</span>
            <span className="hover:text-white transition-colors cursor-pointer">Gear</span>
            <span className="hover:text-white transition-colors cursor-pointer">Accessories</span>
            <span className="hover:text-white transition-colors cursor-pointer">Compatibility</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Premium Motorcycle Parts & Accessories
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Engineered for performance, designed for riders. The best selection of genuine spares and riding gear in Bangladesh.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-300">
              <Shield className="h-4 w-4 text-amber-500" />
              100% Genuine Products
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-300">
              <Settings className="h-4 w-4 text-amber-500" />
              Bike Compatibility Engine
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-center text-sm text-zinc-500">
        <p>© 2026 MotoHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

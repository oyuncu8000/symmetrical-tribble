import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg" : "bg-gradient-to-b from-background/80 to-transparent"
        }`}
      >
        <div className="flex items-center gap-12">
          <Link href="/">
            <h1 className="text-3xl font-['Bebas_Neue'] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent cursor-pointer">
              WoxStream
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/" className="hover:text-white transition-colors">Movies</Link>
            <div className="flex items-center gap-2 text-secondary hover:text-secondary/80 cursor-pointer transition-colors group">
              <span>Wox AI</span>
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-6 text-foreground/80">
          <Search className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

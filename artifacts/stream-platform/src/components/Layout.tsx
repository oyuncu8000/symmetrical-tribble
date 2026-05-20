import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, X } from "lucide-react";
import { searchTmdb, TmdbSearchResult } from "@/lib/tmdb";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return; }
    setSearching(true);
    searchTmdb(debouncedQuery).then(r => { setResults(r); setSearching(false); });
  }, [debouncedQuery]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleResultClick = (r: TmdbSearchResult) => {
    closeSearch();
    const params = new URLSearchParams({
      videoId: "dQw4w9WgXcQ",
      title: r.title,
      image: r.poster,
      backdrop: r.backdrop,
      genre: r.genres || "Drama",
      rating: r.rating,
      year: r.year,
      description: r.overview,
      playlistId: "PLJuI8TslmruDEkt4JMw9oZ3ZeDB0j932T",
    });
    setLocation(`/search-detail?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-lg"
            : "bg-gradient-to-b from-background/80 to-transparent"
        }`}
      >
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-['Bebas_Neue'] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent cursor-pointer select-none">
              WoxStream
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-foreground/70">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <Link href="/" className="hover:text-white transition-colors">Diziler</Link>
            <Link href="/" className="hover:text-white transition-colors">Filmler</Link>
            <div className="flex items-center gap-2 text-secondary hover:text-secondary/80 cursor-pointer transition-colors">
              <span>Wox AI</span>
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-5 text-foreground/70">
          {/* Search bar */}
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-open"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "clamp(180px, 28vw, 380px)", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="relative"
              >
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Search size={14} className="text-white/50 flex-none" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Film veya dizi ara..."
                    data-testid="search-input"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 outline-none min-w-0"
                  />
                  {query && (
                    <button onClick={() => { setQuery(""); setResults([]); }} className="text-white/40 hover:text-white/70 transition-colors flex-none">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Results dropdown */}
                <AnimatePresence>
                  {(results.length > 0 || searching) && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl"
                      style={{
                        background: "rgba(10,10,20,0.98)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(24px)",
                      }}
                    >
                      {searching && (
                        <div className="px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-3 h-3 border border-secondary/50 border-t-secondary rounded-full animate-spin flex-none" />
                          Aranıyor...
                        </div>
                      )}
                      {results.map(r => (
                        <button
                          key={r.id}
                          onClick={() => handleResultClick(r)}
                          data-testid={`search-result-${r.id}`}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        >
                          <div className="w-9 h-13 rounded-md overflow-hidden flex-none bg-white/5" style={{ minWidth: 36, height: 52 }}>
                            {r.poster && <img src={r.poster} alt={r.title} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{r.title}</p>
                            <p className="text-muted-foreground text-xs mt-0.5 truncate">
                              {[r.year, r.genres || r.mediaType, r.rating].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSearchOpen(true)}
                data-testid="button-open-search"
                className="hover:text-white transition-colors"
              >
                <Search size={19} />
              </motion.button>
            )}
          </AnimatePresence>

          {searchOpen && (
            <button
              onClick={closeSearch}
              className="text-white/55 hover:text-white/80 transition-colors text-xs font-medium whitespace-nowrap"
            >
              Kapat
            </button>
          )}

          {!searchOpen && (
            <>
              <Bell size={19} className="cursor-pointer hover:text-white transition-colors" />
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(245,166,35,0.25)]">
                <User size={17} className="text-white" />
              </div>
            </>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

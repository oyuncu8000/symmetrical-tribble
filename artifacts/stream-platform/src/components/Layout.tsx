import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, X, Key } from "lucide-react";
import { searchTmdb, getTmdbKey, setTmdbKey, TmdbSearchResult } from "@/lib/tmdb";

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
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [tmdbKey, setTmdbKeyState] = useState(getTmdbKey());
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
    if (!getTmdbKey()) { setResults([]); return; }
    setSearching(true);
    searchTmdb(debouncedQuery).then(r => { setResults(r); setSearching(false); });
  }, [debouncedQuery]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleResultClick = (r: TmdbSearchResult) => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
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

  const saveKey = () => {
    setTmdbKey(apiKeyInput.trim());
    setTmdbKeyState(apiKeyInput.trim());
    setKeyModalOpen(false);
    setApiKeyInput("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-lg" : "bg-gradient-to-b from-background/80 to-transparent"
        }`}
      >
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-['Bebas_Neue'] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent cursor-pointer">
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
          {/* Search */}
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-open"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "clamp(200px, 30vw, 400px)", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative"
              >
                <div className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-lg px-3 py-1.5">
                  <Search size={14} className="text-white/50 flex-none" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Film veya dizi ara..."
                    data-testid="search-input"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none min-w-0"
                  />
                  {query && (
                    <button onClick={() => { setQuery(""); setResults([]); }} className="text-white/40 hover:text-white transition-colors">
                      <X size={13} />
                    </button>
                  )}
                  {!tmdbKey && (
                    <button
                      onClick={() => setKeyModalOpen(true)}
                      className="text-amber-400/80 hover:text-amber-400 transition-colors flex-none"
                      title="TMDB API Anahtarı Ekle"
                    >
                      <Key size={13} />
                    </button>
                  )}
                </div>

                {/* Search results dropdown */}
                <AnimatePresence>
                  {(results.length > 0 || searching) && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 overflow-hidden shadow-2xl"
                      style={{ background: "rgba(13,13,26,0.98)", backdropFilter: "blur(20px)" }}
                    >
                      {searching && (
                        <div className="px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-3 h-3 border border-secondary/50 border-t-secondary rounded-full animate-spin" />
                          Aranıyor...
                        </div>
                      )}
                      {results.map(r => (
                        <button
                          key={r.id}
                          onClick={() => handleResultClick(r)}
                          data-testid={`search-result-${r.id}`}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/6 transition-colors text-left border-b border-white/5 last:border-0"
                        >
                          <div className="w-10 h-14 rounded-md overflow-hidden flex-none bg-white/5">
                            {r.poster && (
                              <img src={r.poster} alt={r.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{r.title}</p>
                            <p className="text-muted-foreground text-xs mt-0.5">{r.year} · {r.genres || r.mediaType} · {r.rating}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                  {!searching && query.length > 1 && results.length === 0 && !getTmdbKey() && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-amber-500/20 overflow-hidden shadow-2xl"
                      style={{ background: "rgba(13,13,26,0.98)" }}
                    >
                      <button
                        onClick={() => setKeyModalOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                      >
                        <Key size={16} className="text-amber-400 flex-none" />
                        <div>
                          <p className="text-amber-400 text-sm font-semibold">TMDB API Anahtarı Gerekli</p>
                          <p className="text-muted-foreground text-xs">Arama için buraya tıklayın ve anahtarınızı girin</p>
                        </div>
                      </button>
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
            <button onClick={() => { setSearchOpen(false); setQuery(""); setResults([]); }} className="text-white/60 hover:text-white transition-colors text-sm">
              Kapat
            </button>
          )}

          {!searchOpen && (
            <>
              <button
                onClick={() => setKeyModalOpen(true)}
                title="TMDB API Anahtarı"
                data-testid="button-tmdb-key"
                className={`transition-colors ${tmdbKey ? "text-green-400/70 hover:text-green-400" : "text-amber-400/70 hover:text-amber-400"}`}
              >
                <Key size={17} />
              </button>
              <Bell size={19} className="cursor-pointer hover:text-white transition-colors" />
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(245,166,35,0.3)]">
                <User size={17} className="text-white" />
              </div>
            </>
          )}
        </div>
      </header>

      {/* TMDB Key Modal */}
      <AnimatePresence>
        {keyModalOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setKeyModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-2xl border border-amber-500/20 p-6 shadow-2xl"
              style={{ background: "rgba(13,13,26,0.98)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Key size={18} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">TMDB API Anahtarı</h3>
                  <p className="text-muted-foreground text-xs">Film arama özelliği için gerekli</p>
                </div>
              </div>
              {tmdbKey && (
                <div className="mb-3 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Mevcut anahtar aktif — güncellemek için yenisini girin
                </div>
              )}
              <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
                <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">themoviedb.org/settings/api</a> adresinden ücretsiz API anahtarı alabilirsiniz.
              </p>
              <input
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && apiKeyInput.trim() && saveKey()}
                placeholder="TMDB API v3 anahtarınızı yapıştırın..."
                data-testid="tmdb-key-input"
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500/50 mb-4 font-mono"
              />
              <div className="flex gap-3">
                <button
                  onClick={saveKey}
                  disabled={!apiKeyInput.trim()}
                  data-testid="tmdb-key-save"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => setKeyModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 hover:text-white text-sm transition-colors"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>{children}</main>
    </div>
  );
}

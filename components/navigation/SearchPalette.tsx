"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { NAV_ITEMS } from "@/config/site";

// Home isn't in NAV_ITEMS (it's the logo link, not a menu item), but it
// should still be reachable from search.
const SEARCH_ITEMS = [{ href: "/", label: "Home" }, ...NAV_ITEMS];

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = SEARCH_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  function close() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function navigateTo(href: string) {
    close();
    router.push(href);
  }

  // Global Cmd+K / Ctrl+K shortcut, plus Escape-to-close regardless of
  // focus location. One listener handles both rather than splitting
  // across effects, since they share the same lifecycle.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        close();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus the input and lock body scroll whenever the palette opens,
  // same body-scroll-lock precedent as MobileMenu (P1-T10).
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      navigateTo(results[activeIndex].href);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search (Cmd+K)"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-modal flex items-start justify-center bg-background/80 backdrop-blur pt-[15vh]"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search pages..."
              className="w-full border-b border-border bg-transparent px-4 py-3 text-body text-foreground outline-none placeholder:text-muted-foreground"
            />
            <ul className="max-h-72 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-body-sm text-muted-foreground">
                  No pages match &quot;{query}&quot;.
                </li>
              )}
              {results.map((item, i) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => navigateTo(item.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`block w-full rounded-md px-3 py-2 text-left text-body-sm transition-colors ${
                      i === activeIndex
                        ? "bg-border/40 text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

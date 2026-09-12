"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/layout/BrandLogo";
import { mainNavItems, type NavItem } from "@/lib/nav-config";
import { contactInfo } from "@/lib/contact";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 40;

function NavDropdown({
  item,
  scrolled,
}: {
  item: NavItem;
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 160);
  };

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        className={cn(
          "relative inline-flex min-h-11 items-center text-sm font-medium uppercase tracking-widest transition-colors duration-300",
          "text-white/90 hover:text-gold-400",
          "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold-400 after:transition-all hover:after:w-full",
          !scrolled && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={item.href}
        className={cn(
          "relative inline-flex min-h-11 items-center gap-1.5 text-sm font-medium uppercase tracking-widest transition-colors duration-300",
          "text-white/90 hover:text-gold-400",
          open && "text-gold-400",
          "after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-gold-400 after:transition-all",
          open ? "after:w-full" : "after:w-0 hover:after:w-full",
          !scrolled && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-300",
            open && "rotate-180",
          )}
          strokeWidth={2}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-gold-500/15 bg-brand-navy-950/95 shadow-xl shadow-brand-navy-950/40 backdrop-blur-md"
          >
            <ul className="py-2">
              {item.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-white/5"
                  >
                    <span className="text-sm text-white/90">{child.label}</span>
                    {child.hint && (
                      <span className="shrink-0 text-[0.65rem] uppercase tracking-wider text-gold-400/70">
                        {child.hint}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-gold-500/10 px-4 py-2.5">
              <Link
                href={item.href}
                className="text-xs font-medium uppercase tracking-wider text-gold-400 transition-colors hover:text-gold-300"
              >
                Tümünü gör →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavGroup({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="flex min-h-11 items-center rounded-xl px-4 text-base font-medium uppercase tracking-widest text-white/90 transition-colors hover:bg-white/5 hover:text-gold-400"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex min-h-11 w-full items-center justify-between px-4 text-base font-medium uppercase tracking-widest text-white/90"
      >
        {item.label}
        <ChevronDown
          className={cn(
            "size-4 text-gold-400/80 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 border-t border-white/5 px-2 pb-2 pt-1">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-gold-400"
                >
                  {child.label}
                  {child.hint && (
                    <span className="text-[0.6rem] uppercase tracking-wider text-white/35">
                      {child.hint}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href={item.href}
                onClick={onNavigate}
                className="mt-1 flex min-h-10 items-center px-3 text-xs font-medium uppercase tracking-wider text-gold-400"
              >
                Tümünü gör →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-[calc(2.25rem+env(safe-area-inset-top,0px))] z-50 transition-[background-color,backdrop-filter,box-shadow,border-color] duration-500 ease-out",
          scrolled || menuOpen
            ? "border-b border-gold-500/10 bg-brand-navy-950/90 shadow-lg shadow-brand-navy-950/30 backdrop-blur-md"
            : "border-b border-transparent bg-transparent backdrop-blur-none",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 md:px-10">
          <BrandLogo priority />

          <ul className="hidden items-center gap-8 lg:gap-10 md:flex">
            {mainNavItems.map((item) => (
              <li key={item.id}>
                <NavDropdown item={item} scrolled={scrolled} />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={contactInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition-all duration-300 md:flex",
                "shadow-md shadow-[#25D366]/25 hover:bg-[#20BD5A] hover:shadow-lg hover:shadow-[#25D366]/35",
                !scrolled && "shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
              )}
            >
              <MessageCircle className="size-4" strokeWidth={2} />
              WhatsApp ile Sor
            </a>

            <button
              type="button"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors md:hidden",
                "hover:border-gold-400/40 hover:bg-white/5 active:bg-white/10",
                !scrolled && !menuOpen && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
              )}
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.75} />
              ) : (
                <Menu className="size-5" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Menüyü kapat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[65] bg-brand-navy-950/60 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(320px,88vw)] flex-col border-l border-gold-500/15 bg-brand-navy-950 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-gold-500/10 px-5 py-4">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold-400/80">
                  Menü
                </span>
                <button
                  type="button"
                  aria-label="Menüyü kapat"
                  onClick={closeMenu}
                  className="inline-flex size-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="size-5" strokeWidth={1.75} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4">
                {mainNavItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.05 }}
                  >
                    <MobileNavGroup item={item} onNavigate={closeMenu} />
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-gold-500/10 p-5 pb-safe">
                <a
                  href={contactInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white shadow-md shadow-[#25D366]/25 transition-colors hover:bg-[#20BD5A] active:bg-[#1DA851]"
                >
                  <MessageCircle className="size-4" strokeWidth={2} />
                  WhatsApp ile Sor
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

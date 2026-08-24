"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

// useSyncExternalStore-over-useEffect+setState: a hydration-safe "false" on
// the server/first paint without a setState-in-effect render cascade.
function subscribe() {
  return () => {};
}
function getMountedSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function MobileMenuTrigger({
  label,
  closeLabel,
  children,
}: {
  label: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // The overlay is portaled to <body> (see below) — the navbar's own
  // backdrop-blur-sm establishes a CSS containing block for any
  // position:fixed descendant, which silently repositions "fixed" elements
  // relative to the (short) header box instead of the viewport. Portaling
  // out from under it is the standard fix, not a size/z-index tweak.
  const mounted = useSyncExternalStore(subscribe, getMountedSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables?.[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const overlay = (
    <>
      {/* Scrim: closes on outside click, opaque enough that nothing behind it bleeds through. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ease-editorial",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* end-0 anchors to the trailing edge in both directions; the actual
          open/closed slide direction is handled in globals.css via [dir]
          (Tailwind's rtl:/ltr: variants did not compile in this build — see
          the .mobile-nav-panel rule there for the full explanation). */}
      <div
        ref={panelRef}
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        inert={open ? undefined : true}
        data-open={open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a, button")) setOpen(false);
        }}
        className="mobile-nav-panel fixed inset-y-0 end-0 z-40 flex w-[min(84vw,360px)] flex-col gap-6 border-s border-border bg-canvas px-page-x-sm py-24 shadow-[0_0_48px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-editorial"
      >
        {children}
      </div>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? closeLabel : label}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}

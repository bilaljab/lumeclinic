"use client";

import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

/** Structural only — panel open/close state, no motion yet (Phase 04). */
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

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? closeLabel : label}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
      </button>
      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full border-t border-border bg-canvas px-page-x-sm py-6"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

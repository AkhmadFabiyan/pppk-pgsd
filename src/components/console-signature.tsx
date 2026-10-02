"use client";

import { useEffect } from "react";

const SESSION_KEY = "pppk-pgsd.console-signature.v1";
let printedInRuntime = false;

export function ConsoleSignature() {
  useEffect(() => {
    if (printedInRuntime) return;

    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) {
        printedInRuntime = true;
        return;
      }
      window.sessionStorage.setItem(SESSION_KEY, "shown");
    } catch {
      // Browser storage can be unavailable in private or restricted contexts.
    }

    printedInRuntime = true;
    console.info("%cAKHMAD FABiYAN", "color: #0B2417; background: #DCEBCF; font-size: 16px; font-weight: 800; letter-spacing: 0.12em; padding: 8px 12px; border-radius: 4px;");
    console.info("%cBuilt with care for PPPK PGSD 2026", "color: #B9382F; font-size: 12px; font-weight: 700;");
    console.info("%cLinkedIn  https://www.linkedin.com/in/akhmadfabiyan\nWebsite   https://akhmadfabiyan.com", "color: #172018; font-size: 12px; line-height: 1.6;");
  }, []);

  return null;
}

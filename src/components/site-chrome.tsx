"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollProgress } from "@/components/scroll-progress";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLiveDisplay = pathname === "/live";

  if (isLiveDisplay) return <main id="main-content">{children}</main>;

  return (
    <>
      <a className="skip-link" href="#main-content">Langsung ke isi</a>
      <ScrollProgress />
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}

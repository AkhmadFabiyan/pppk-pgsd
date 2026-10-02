"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollProgress } from "@/components/scroll-progress";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLiveDisplay = pathname === "/live";
  const isAdminWorkspace = pathname.startsWith("/panitia");
  const isLandingPage = pathname === "/";

  if (isLiveDisplay) return <main id="main-content">{children}</main>;

  if (isAdminWorkspace) {
    return <>
      <a className="skip-link" href="#main-content">Langsung ke isi</a>
      <main id="main-content">{children}</main>
    </>;
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Langsung ke isi</a>
      {isLandingPage && <ScrollProgress />}
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}

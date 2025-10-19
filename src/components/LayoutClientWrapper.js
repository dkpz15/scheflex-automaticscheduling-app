"use client";

import AOS from "aos";
import GLightbox from "glightbox";
import { useEffect } from "react";

export default function LayoutClientWrapper({ children }) {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
    });
  }, []);

  return <>{children}</>;
}

import { useEffect } from "react";

export function useDocumentMeta(
  title,
  iconUrl = "/assets/img/logo/logo-ico.ico"
) {
  useEffect(() => {
    // Set title
    const prevTitle = document.title;
    document.title = title;

    // Set favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    const prevIcon = link.href;
    link.href = iconUrl;

    // Cleanup: kembalikan ke semula saat component unmount
    return () => {
      document.title = prevTitle;
      link.href = prevIcon;
    };
  }, [title, iconUrl]);
}

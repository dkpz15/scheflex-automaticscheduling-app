import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "glightbox/dist/css/glightbox.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Poppins } from "next/font/google";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ClientBootstrap from "@/components/ClientBootstrap";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={poppins.className}>
        <SessionProviderWrapper>
          {children}
          <ClientBootstrap />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

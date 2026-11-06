import AOS from "aos";
import GLightbox from "glightbox";
import Isotope from "isotope-layout";
import imagesLoaded from "imagesloaded";
import Swiper from "swiper";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function InitLandingPage() {
  if (typeof window === "undefined") return;

  // Scroll header
  const toggleScrolled = () => {
    const body = document.body;
    const header = document.querySelector("#header");
    if (!header) return;
    if (
      !header.classList.contains("scroll-up-sticky") &&
      !header.classList.contains("sticky-top") &&
      !header.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? body.classList.add("scrolled")
      : body.classList.remove("scrolled");
  };
  window.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  // Mobile nav toggle
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  const toggleMobileNav = () => {
    document.body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  };
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", toggleMobileNav);
  }

  // Close mobile nav on nav link click
  document.querySelectorAll("#navmenu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (document.body.classList.contains("mobile-nav-active")) {
        toggleMobileNav();
      }
    });
  });

  // Dropdowns
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.parentNode.classList.toggle("active");
      dropdown.parentNode.nextElementSibling.classList.toggle(
        "dropdown-active"
      );
      e.stopImmediatePropagation();
    });
  });

  // Preloader
  setTimeout(() => {
    const preloader = document.querySelector("#preloader");
    if (preloader) preloader.remove();
  }, 500); // atau 1000 ms untuk aman

  // Scroll top button
  const scrollTop = document.querySelector(".scroll-top");
  const toggleScrollTop = () => {
    if (!scrollTop) return;
    window.scrollY > 100
      ? scrollTop.classList.add("active")
      : scrollTop.classList.remove("active");
  };
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  window.addEventListener("scroll", toggleScrollTop);
  window.addEventListener("load", toggleScrollTop);

  // AOS
  AOS.init({
    duration: 600,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });

  // GLightbox
  GLightbox({ selector: ".glightbox" });

  // Isotope
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    const layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    const filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    const sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      const iso = new Isotope(isotopeItem.querySelector(".isotope-container"), {
        itemSelector: ".isotope-item",
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
      });

      isotopeItem
        .querySelectorAll(".isotope-filters li")
        .forEach((filterBtn) => {
          filterBtn.addEventListener("click", function () {
            isotopeItem
              .querySelector(".filter-active")
              ?.classList.remove("filter-active");
            this.classList.add("filter-active");
            iso.arrange({ filter: this.getAttribute("data-filter") });
            AOS.refresh(); // re-init AOS after filter
          });
        });
    });
  });

  // FAQ Toggle
  document
    .querySelectorAll(
      ".faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header"
    )
    .forEach((faq) => {
      faq.addEventListener("click", () => {
        faq.parentNode.classList.toggle("faq-active");
      });
    });

  // Swiper init
  document.querySelectorAll(".init-swiper").forEach((swiperEl) => {
    const configEl = swiperEl.querySelector(".swiper-config");
    if (!configEl) return;
    const config = JSON.parse(configEl.innerHTML.trim());
    new Swiper(swiperEl, config);
  });

  // Hash scroll fix
  if (window.location.hash && document.querySelector(window.location.hash)) {
    setTimeout(() => {
      const section = document.querySelector(window.location.hash);
      const marginTop =
        parseInt(getComputedStyle(section).scrollMarginTop) || 0;
      window.scrollTo({
        top: section.offsetTop - marginTop,
        behavior: "smooth",
      });
    }, 100);
  }

  // Nav scrollspy
  const navLinks = document.querySelectorAll(".navmenu a");
  const navSpy = () => {
    const position = window.scrollY + 200;
    navLinks.forEach((link) => {
      if (!link.hash || !document.querySelector(link.hash)) return;
      const section = document.querySelector(link.hash);
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };
  window.addEventListener("scroll", navSpy);
  window.addEventListener("load", navSpy);
}

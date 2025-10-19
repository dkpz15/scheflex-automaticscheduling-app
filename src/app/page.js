"use client";
import Link from "next/link";
import { useEffect } from "react";
import "@/styles/style.css";
import { InitLandingPage } from "@/utils/main";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function LandingPage() {
  useEffect(() => {
    InitLandingPage();
  }, []);

  useDocumentMeta("Scheflex - Landing Page", "/assets/img/logo/logo-ico.ico");

  return (
    <>
      <div>
        <header
          id="header"
          className="header d-flex align-items-center fixed-top"
        >
          <div className="container position-relative d-flex align-items-center justify-content-between">
            <a
              href="#"
              className="logo d-flex align-items-center me-auto me-xl-0"
            >
              <img src="/assets/img/logo/logo.png" />
              <h1 className="sitename">Scheflex</h1>
            </a>

            <nav id="navmenu" className="navmenu">
              <ul>
                <li>
                  <a href="#hero" className="active">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#portfolio">Portfolio</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#team">Team</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
              <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>

            <a
              className="btn-getstarted"
              href="#about"
              style={{ padding: "10px 17px" }}
            >
              Discover More
            </a>
          </div>
        </header>

        <main className="main">
          <section id="hero" className="hero section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row align-items-center mb-5">
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <div className="badge-wrapper mb-3">
                    <div className="d-inline-flex align-items-center rounded-pill border border-accent-light">
                      <div className="icon-circle me-2">
                        <i className="bi bi-bell"></i>
                      </div>
                      <span className="badge-text me-3">
                        Innovative Solutions
                      </span>
                    </div>
                  </div>

                  <h1 className="hero-title mb-4">
                    Smart Automatic Scheduling for Seamless Productivity
                  </h1>

                  <p className="hero-description mb-4">
                    Experience the power of intelligent automatic scheduling
                    that saves time, eliminates conflicts, and streamlines your
                    workflow — giving you more freedom to focus on what matters.
                  </p>

                  <div className="cta-wrapper">
                    <Link href="/auth/auth-option" className="btn btn-primary">
                      Get Started
                    </Link>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="hero-image">
                    <img
                      src="/assets/img/illustration/illustration-16.webp"
                      alt="Business Growth"
                      className="img-fluid"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="row feature-boxes">
                <div
                  className="col-lg-4 mb-4 mb-lg-0"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="feature-box">
                    <div className="feature-icon me-sm-4 mb-3 mb-sm-0">
                      <i className="bi bi-kanban"></i>
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">Entity Control</h3>
                      <p className="feature-text">
                        Flexibly manage entities, entity data, and relationships
                        to create adaptable and organized schedules.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-4 mb-4 mb-lg-0"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="feature-box">
                    <div className="feature-icon me-sm-4 mb-3 mb-sm-0">
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">Conflict-Free</h3>
                      <p className="feature-text">
                        Automatically detect and prevent schedule conflicts in
                        time, place, and day for smooth operations.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div className="feature-box">
                    <div className="feature-icon me-sm-4 mb-3 mb-sm-0">
                      <i className="bi bi-file-earmark-arrow-down"></i>
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">Instant Export</h3>
                      <p className="feature-text">
                        Easily generate and export schedules as PDF for quick
                        sharing and professional presentation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="about section">
            <div className="container">
              <div className="row gy-4">
                <div
                  className="col-lg-6 content"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <p className="who-we-are">Who We Are</p>
                  <h3>Empowering Workflows with Intelligent Scheduling</h3>
                  <p className="fst-italic">
                    Discover how intelligent scheduling empowers workflows by
                    automating tasks, reducing conflicts, and creating seamless
                    time management for maximum efficiency.
                  </p>
                  <ul>
                    <li>
                      <i className="bi bi-check-circle"></i>{" "}
                      <span>
                        Manage entities, data, and relationships with
                        flexibility.
                      </span>
                    </li>
                    <li>
                      <i className="bi bi-check-circle"></i>{" "}
                      <span>
                        Optimize schedules with conflict-free intelligent
                        automation.
                      </span>
                    </li>
                    <li>
                      <i className="bi bi-check-circle"></i>{" "}
                      <span>
                        Export professional schedules instantly for easy
                        sharing.
                      </span>
                    </li>
                  </ul>
                  <a href="#" className="read-more">
                    <span>Read More</span>
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>

                <div
                  className="col-lg-6 about-images"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="row gy-4">
                    <div className="col-lg-6">
                      <img
                        src="/assets/img/about/about-portrait-1.webp"
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    <div className="col-lg-6">
                      <div className="row gy-4">
                        <div className="col-lg-12">
                          <img
                            src="/assets/img/about/about-8.webp"
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                        <div className="col-lg-12">
                          <img
                            src="/assets/img/about/about-12.webp"
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="how-we-work" className="how-we-work section">
            <div className="container section-title" data-aos="fade-up">
              <h2>How We Work</h2>
              <p>
                We streamline scheduling by automating processes and eliminating
                conflicts.
              </p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="steps-5">
                <div className="process-container">
                  <div
                    className="process-item"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <div className="content">
                      <span className="step-number">01</span>
                      <div className="card-body">
                        <div className="step-icon">
                          <i className="bi bi-pencil-square"></i>
                        </div>
                        <div className="step-content">
                          <h3>Create Schedule</h3>
                          <p>
                            Start by creating a new schedule to organize and
                            prepare the foundation for all upcoming
                            arrangements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="process-item"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="content">
                      <span className="step-number">02</span>
                      <div className="card-body">
                        <div className="step-icon">
                          <i className="bi bi-gear"></i>
                        </div>
                        <div className="step-content">
                          <h3>Manage Entities</h3>
                          <p>
                            Build and manage entities, entity data, and flexible
                            relationships to structure your scheduling
                            requirements effectively.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="process-item"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <div className="content">
                      <span className="step-number">03</span>
                      <div className="card-body">
                        <div className="step-icon">
                          <i className="bi bi-arrow-repeat"></i>
                        </div>
                        <div className="step-content">
                          <h3>Generate Schedule</h3>
                          <p>
                            System intelligently generates optimized schedules
                            by analyzing entities and relations while avoiding
                            conflicts automatically.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="process-item"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="content">
                      <span className="step-number">04</span>
                      <div className="card-body">
                        <div className="step-icon">
                          <i className="bi bi-box-arrow-up"></i>
                        </div>
                        <div className="step-content">
                          <h3>Export Result</h3>
                          <p>
                            Export finalized schedules instantly into
                            professional PDF format for easy sharing, printing,
                            and future reference.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="services section">
            <div className="container section-title" data-aos="fade-up">
              <h2>Services</h2>
              <p>
                Comprehensive scheduling features designed to simplify and
                optimize your workflow.
              </p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row justify-content-center g-5">
                <div
                  className="col-md-6"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <div className="service-item">
                    <div className="service-icon">
                      <i className="bi bi-calendar-plus"></i>
                    </div>
                    <div className="service-content">
                      <h3>Schedule Creation</h3>
                      <p>
                        Effortlessly create, organize, and customize multiple
                        schedules to match your exact needs, ensuring every plan
                        is well-structured, efficient, and seamlessly integrated
                        into an intelligent automation workflow.
                      </p>
                      <a href="#" className="service-link">
                        <span>Learn More</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-6"
                  data-aos="fade-left"
                  data-aos-delay="100"
                >
                  <div className="service-item">
                    <div className="service-icon">
                      <i className="bi bi-diagram-3"></i>
                    </div>
                    <div className="service-content">
                      <h3>Entity Management</h3>
                      <p>
                        Easily manage entities, entity data, and their
                        relationships through a flexible system that allows you
                        to design complex, dynamic schedules adaptable to any
                        scenario or operational change.
                      </p>
                      <a href="#" className="service-link">
                        <span>Learn More</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-6"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <div className="service-item">
                    <div className="service-icon">
                      <i className="bi bi-exclamation-triangle"></i>
                    </div>
                    <div className="service-content">
                      <h3>Smart Conflict Detection</h3>
                      <p>
                        Automatically identify and prevent overlapping schedules
                        across time, day, and place, ensuring smooth
                        coordination, consistent accuracy, and completely
                        conflict-free results for every generated plan.
                      </p>
                      <a href="#" className="service-link">
                        <span>Learn More</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-6"
                  data-aos="fade-left"
                  data-aos-delay="200"
                >
                  <div className="service-item">
                    <div className="service-icon">
                      <i className="bi bi-cpu"></i>
                    </div>
                    <div className="service-content">
                      <h3>Intelligent Generation</h3>
                      <p>
                        Generate optimized schedules automatically using
                        advanced algorithms that analyze entity relationships
                        intelligently, delivering accurate, efficient, and
                        realistic scheduling results within just a few seconds.
                      </p>
                      <a href="#" className="service-link">
                        <span>Learn More</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-6"
                  data-aos="fade-right"
                  data-aos-delay="300"
                >
                  <div className="service-item">
                    <div className="service-icon">
                      <i className="bi bi-cloud-check"></i>
                    </div>
                    <div className="service-content">
                      <h3>Real-Time Editing</h3>
                      <p>
                        Modify, update, and refine schedules instantly without
                        disrupting existing data, maintaining flexibility and
                        efficiency while adapting effortlessly to real-time
                        changes and new requirements.
                      </p>
                      <a href="#" className="service-link">
                        <span>Learn More</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-6"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  <div className="service-item">
                    <div className="service-icon">
                      <i className="bi bi-rocket-takeoff"></i>
                    </div>
                    <div className="service-content">
                      <h3>Quick Export</h3>
                      <p>
                        Instantly export finalized schedules into professional
                        PDF files, ready for sharing, presentation, or
                        record-keeping, ensuring your work remains organized,
                        accessible, and visually polished at all times.
                      </p>
                      <a href="#" className="service-link">
                        <span>Learn More</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="services-alt" className="services-alt section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row">
                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="content-block">
                    <h6 className="subtitle">Our innovative services</h6>
                    <h2 className="title">
                      Revolutionizing Workflows with Automatic Scheduling
                      Services
                    </h2>
                    <p className="description">
                      Experience a new era of productivity through intelligent
                      automatic scheduling services designed to streamline
                      workflows, eliminate conflicts, and enhance efficiency —
                      empowering you to manage complex schedules effortlessly
                      with precision and flexibility.
                    </p>
                    <div className="button-wrapper">
                      <a className="btn" href="#">
                        <span>Explore All Services</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="services-list">
                    <div
                      className="service-item d-flex align-items-center"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      <div className="service-icon">
                        <i className="bi bi-lightbulb"></i>
                      </div>
                      <div className="service-content">
                        <h4>
                          <a href="#">Smart Planning</a>
                        </h4>
                        <p>
                          Automate and optimize scheduling with intelligence.
                        </p>
                      </div>
                    </div>

                    <div
                      className="service-item d-flex align-items-center"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="service-icon">
                        <i className="bi bi-sliders"></i>
                      </div>
                      <div className="service-content">
                        <h4>
                          <a href="#">Flexible Control</a>
                        </h4>
                        <p>Manage entities and data with ease.</p>
                      </div>
                    </div>

                    <div
                      className="service-item d-flex align-items-center"
                      data-aos="fade-up"
                      data-aos-delay="400"
                    >
                      <div className="service-icon">
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <div className="service-content">
                        <h4>
                          <a href="#">Conflict Prevention</a>
                        </h4>
                        <p>Detect and avoid overlapping schedule conflicts.</p>
                      </div>
                    </div>

                    <div
                      className="service-item d-flex align-items-center"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="service-icon">
                        <i className="bi bi-share"></i>
                      </div>
                      <div className="service-content">
                        <h4>
                          <a href="#">Quick Sharing</a>
                        </h4>
                        <p>
                          Quickly generate and share professional schedules.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="call-to-action-2"
            className="call-to-action-2 section light-background"
          >
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row g-5 align-items-center">
                <div
                  className="col-lg-6"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <div className="cta-image-wrapper">
                    <img
                      src="/assets/img/cta/cta-4.webp"
                      alt="Call to Action"
                      className="img-fluid rounded-4"
                    />
                    <div className="cta-pattern"></div>
                  </div>
                </div>

                <div
                  className="col-lg-6"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  <div className="cta-content">
                    <h2>Transform Your Vision Into Reality Today</h2>
                    <p className="lead">
                      Bring your ideas to life with intelligent automatic
                      scheduling that simplifies planning, eliminates conflicts,
                      and enhances productivity effortlessly.
                    </p>

                    <div className="cta-features">
                      <div
                        className="feature-item"
                        data-aos="zoom-in"
                        data-aos-delay="400"
                      >
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Plan smarter, work more efficiently.</span>
                      </div>
                      <div
                        className="feature-item"
                        data-aos="zoom-in"
                        data-aos-delay="450"
                      >
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Automate tasks with intelligent scheduling.</span>
                      </div>
                      <div
                        className="feature-item"
                        data-aos="zoom-in"
                        data-aos-delay="500"
                      >
                        <i className="bi bi-check-circle-fill"></i>
                        <span>
                          Achieve productivity without time conflicts.
                        </span>
                      </div>
                    </div>

                    <div className="cta-action mt-5">
                      <a href="#" className="btn btn-primary btn-lg me-3">
                        Get Started
                      </a>
                      <a href="#" className="btn btn-outline-primary btn-lg">
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="portfolio" className="portfolio section">
            <div className="container section-title" data-aos="fade-up">
              <h2>Portfolio</h2>
              <p>
                Explore our innovative automatic scheduling projects and
                solutions.
              </p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div
                className="isotope-layout"
                data-default-filter="*"
                data-layout="masonry"
                data-sort="original-order"
              >
                <div
                  className="portfolio-filters-container"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <ul className="portfolio-filters isotope-filters">
                    <li data-filter="*" className="filter-active">
                      All Work
                    </li>
                    <li data-filter=".filter-education">Education</li>
                    <li data-filter=".filter-work">Work</li>
                    <li data-filter=".filter-transportation">Transportation</li>
                    <li data-filter=".filter-others">Others</li>
                  </ul>
                </div>

                <div
                  className="row g-4 isotope-container"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="col-lg-6 col-md-6 portfolio-item isotope-item filter-education">
                    <div className="portfolio-card">
                      <div className="portfolio-image">
                        <img
                          src="/assets/img/portfolio/portfolio-1.png"
                          className="img-fluid"
                          alt=""
                          loading="lazy"
                        />
                        <div className="portfolio-overlay">
                          <div className="portfolio-actions">
                            <a
                              href="/assets/img/portfolio/portfolio-1.png"
                              className="glightbox preview-link"
                              data-gallery="portfolio-gallery-web"
                            >
                              <i className="bi bi-eye"></i>
                            </a>
                            <a
                              href="/assets/img/portfolio/portfolio-1.png"
                              className="details-link"
                            >
                              <i className="bi bi-arrow-right"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="portfolio-content">
                        <span className="category">Education</span>
                        <h3>College Schedule</h3>
                        <p>
                          Organize lecturers’ teaching schedules efficiently and
                          accurately.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 portfolio-item isotope-item filter-work">
                    <div className="portfolio-card">
                      <div className="portfolio-image">
                        <img
                          src="/assets/img/portfolio/portfolio-2.png"
                          className="img-fluid"
                          alt=""
                          loading="lazy"
                        />
                        <div className="portfolio-overlay">
                          <div className="portfolio-actions">
                            <a
                              href="/assets/img/portfolio/portfolio-2.png"
                              className="glightbox preview-link"
                              data-gallery="portfolio-gallery-graphics"
                            >
                              <i className="bi bi-eye"></i>
                            </a>
                            <a
                              href="/assets/img/portfolio/portfolio-2.png"
                              className="details-link"
                            >
                              <i className="bi bi-arrow-right"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="portfolio-content">
                        <span className="category">Work</span>
                        <h3>Work Shift Schedule</h3>
                        <p>
                          Manage employee shifts efficiently with automated
                          scheduling.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 portfolio-item isotope-item filter-transportation">
                    <div className="portfolio-card">
                      <div className="portfolio-image">
                        <img
                          src="/assets/img/portfolio/portfolio-3.png"
                          className="img-fluid"
                          alt=""
                          loading="lazy"
                        />
                        <div className="portfolio-overlay">
                          <div className="portfolio-actions">
                            <a
                              href="/assets/img/portfolio/portfolio-3.png"
                              className="glightbox preview-link"
                              data-gallery="portfolio-gallery-motion"
                            >
                              <i className="bi bi-eye"></i>
                            </a>
                            <a
                              href="/assets/img/portfolio/portfolio-3.png"
                              className="details-link"
                            >
                              <i className="bi bi-arrow-right"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="portfolio-content">
                        <span className="category">Transportation</span>
                        <h3>Overseas Event Schedule</h3>
                        <p>
                          Coordinate international events efficiently with
                          automated scheduling.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 portfolio-item isotope-item filter-education">
                    <div className="portfolio-card">
                      <div className="portfolio-image">
                        <img
                          src="/assets/img/portfolio/portfolio-4.png"
                          className="img-fluid"
                          alt=""
                          loading="lazy"
                        />
                        <div className="portfolio-overlay">
                          <div className="portfolio-actions">
                            <a
                              href="/assets/img/portfolio/portfolio-4.png"
                              className="glightbox preview-link"
                              data-gallery="portfolio-gallery-brand"
                            >
                              <i className="bi bi-eye"></i>
                            </a>
                            <a
                              href="/assets/img/portfolio/portfolio-4.png"
                              className="details-link"
                            >
                              <i className="bi bi-arrow-right"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="portfolio-content">
                        <span className="category">Education</span>
                        <h3>Exam Schedule</h3>
                        <p>
                          Organize exam invigilator schedules efficiently and
                          accurately.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 portfolio-item isotope-item filter-education">
                    <div className="portfolio-card">
                      <div className="portfolio-image">
                        <img
                          src="/assets/img/portfolio/portfolio-5.png"
                          className="img-fluid"
                          alt=""
                          loading="lazy"
                        />
                        <div className="portfolio-overlay">
                          <div className="portfolio-actions">
                            <a
                              href="/assets/img/portfolio/portfolio-5.png"
                              className="glightbox preview-link"
                              data-gallery="portfolio-gallery-web"
                            >
                              <i className="bi bi-eye"></i>
                            </a>
                            <a
                              href="/assets/img/portfolio/portfolio-5.png"
                              className="details-link"
                            >
                              <i className="bi bi-arrow-right"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="portfolio-content">
                        <span className="category">Education</span>
                        <h3>Group Assignment Schedule</h3>
                        <p>
                          Manage collaborative assignments easily through
                          automatic scheduling.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="pricing" className="pricing section light-background">
            <div className="container section-title" data-aos="fade-up">
              <h2>Pricing</h2>
              <p>Choose the perfect plan that fits your scheduling needs.</p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row g-4 justify-content-center">
                <div
                  className="col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="pricing-card">
                    <h3>Basic Plan</h3>
                    <div className="price">
                      <span className="currency">$</span>
                      <span className="amount">9.9</span>
                      <span className="period">/ month</span>
                    </div>
                    <p className="description">
                      Perfect for individuals who need essential scheduling
                      tools to manage simple tasks and small-scale automation
                      efficiently.
                    </p>

                    <h4>Featured Included:</h4>
                    <ul className="features-list">
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Schedule Creation
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Entity Management
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        PDF Export
                      </li>
                    </ul>

                    <a href="#" className="btn btn-primary">
                      Buy Now
                      <i className="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </div>

                <div
                  className="col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="pricing-card popular">
                    <div className="popular-badge">Most Popular</div>
                    <h3>Standard Plan</h3>
                    <div className="price">
                      <span className="currency">$</span>
                      <span className="amount">19.9</span>
                      <span className="period">/ month</span>
                    </div>
                    <p className="description">
                      Ideal for teams or educators seeking flexible entity
                      control, smarter automation, and enhanced schedule
                      optimization for daily use.
                    </p>

                    <h4>Featured Included:</h4>
                    <ul className="features-list">
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Smart Conflict Detection
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Entity Relationships
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Real-Time Editing
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Quick Export
                      </li>
                    </ul>

                    <a href="#" className="btn btn-light">
                      Buy Now
                      <i className="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </div>

                <div
                  className="col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="pricing-card">
                    <h3>Premium Plan</h3>
                    <div className="price">
                      <span className="currency">$</span>
                      <span className="amount">39.9</span>
                      <span className="period">/ month</span>
                    </div>
                    <p className="description">
                      Designed for professionals and organizations needing full
                      automation, advanced control, and seamless performance for
                      complex scheduling environments.
                    </p>

                    <h4>Featured Included:</h4>
                    <ul className="features-list">
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Intelligent Schedule Generation
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Advanced Conflict Resolution
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Multi-Schedule Management
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Collaboration Tools
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i>
                        Priority Support
                      </li>
                    </ul>

                    <a href="#" className="btn btn-primary">
                      Buy Now
                      <i className="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="faq section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row gy-5">
                <div
                  className="col-lg-6"
                  data-aos="zoom-out"
                  data-aos-delay="200"
                >
                  <div className="faq-contact-card">
                    <div className="card-icon">
                      <i className="bi bi-question-circle"></i>
                    </div>
                    <div className="card-content">
                      <h3>Still Have Questions?</h3>
                      <p>
                        Need more clarity about our automatic scheduling system?
                        Our team is ready to help you understand how intelligent
                        scheduling can simplify tasks, improve productivity, and
                        transform the way you manage time.
                      </p>
                      <div className="contact-options">
                        <a href="#" className="contact-option">
                          <i className="bi bi-envelope"></i>
                          <span>Email Support</span>
                        </a>
                        <a href="#" className="contact-option">
                          <i className="bi bi-chat-dots"></i>
                          <span>Live Chat</span>
                        </a>
                        <a href="#" className="contact-option">
                          <i className="bi bi-telephone"></i>
                          <span>Call Us</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="faq-accordion">
                    <div className="faq-item faq-active">
                      <div className="faq-header">
                        <h3>How does the automatic scheduling system work?</h3>
                        <i className="bi bi-chevron-down faq-toggle"></i>
                      </div>
                      <div className="faq-content">
                        <p>
                          Our system analyzes entities, relationships, and
                          available time slots intelligently to generate
                          optimized, conflict-free schedules. It adapts
                          dynamically to your data, ensuring accuracy and
                          efficiency across all scheduling needs.
                        </p>
                      </div>
                    </div>

                    <div
                      className="faq-item"
                      data-aos="zoom-in"
                      data-aos-delay="200"
                    >
                      <div className="faq-header">
                        <h3>Can I customize entities and schedule data?</h3>
                        <i className="bi bi-chevron-down faq-toggle"></i>
                      </div>
                      <div className="faq-content">
                        <p>
                          Yes! You can freely create, edit, and manage entities,
                          entity data, and relationships. The platform gives you
                          complete flexibility to design schedules that fit your
                          unique structure and workflow.
                        </p>
                      </div>
                    </div>

                    <div className="faq-item">
                      <div className="faq-header">
                        <h3>What happens if scheduling conflicts occur?</h3>
                        <i className="bi bi-chevron-down faq-toggle"></i>
                      </div>
                      <div className="faq-content">
                        <p>
                          The system automatically detects overlapping schedules
                          and resolves them instantly using smart logic. You’ll
                          receive clear notifications about potential issues,
                          ensuring every generated schedule remains accurate and
                          conflict-free.
                        </p>
                      </div>
                    </div>

                    <div className="faq-item">
                      <div className="faq-header">
                        <h3>How can I export or share schedules?</h3>
                        <i className="bi bi-chevron-down faq-toggle"></i>
                      </div>
                      <div className="faq-content">
                        <p>
                          You can easily export generated schedules as
                          professional PDF documents. Share them instantly with
                          teams, students, or clients for seamless collaboration
                          and organized time management anywhere, anytime.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="team" className="team section light-background">
            <div className="container section-title" data-aos="fade-up">
              <h2>Team</h2>
              <p>
                Meet the experts behind our intelligent scheduling innovation.
              </p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row g-5">
                <div
                  className="col-md-6 col-lg-3"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                >
                  <div className="team-card">
                    <div className="team-image">
                      <img
                        src="/assets/img/person/person-m-1.webp"
                        className="img-fluid"
                        alt=""
                      />
                      <div className="team-overlay">
                        <p>
                          Leads the development of core scheduling features,
                          ensuring high performance, clean code, and seamless
                          integration across all modules.
                        </p>
                        <div className="team-social">
                          <a href="#">
                            <i className="bi bi-twitter-x"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-facebook"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-instagram"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-linkedin"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="team-content">
                      <h4>Alexander Müller</h4>
                      <span className="position">Lead Developer</span>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-6 col-lg-3"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                >
                  <div className="team-card">
                    <div className="team-image">
                      <img
                        src="/assets/img/person/person-f-6.webp"
                        className="img-fluid"
                        alt=""
                      />
                      <div className="team-overlay">
                        <p>
                          Creates intuitive, modern, and accessible interfaces
                          that make automatic scheduling easy, engaging, and
                          visually appealing for every user.
                        </p>
                        <div className="team-social">
                          <a href="#">
                            <i className="bi bi-twitter-x"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-facebook"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-instagram"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-linkedin"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="team-content">
                      <h4>Sofia Laurent</h4>
                      <span className="position">UI/UX Designer</span>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-6 col-lg-3"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  <div className="team-card">
                    <div className="team-image">
                      <img
                        src="/assets/img/person/person-m-6.webp"
                        className="img-fluid"
                        alt=""
                      />
                      <div className="team-overlay">
                        <p>
                          Builds and maintains robust server-side logic,
                          ensuring smooth automation, efficient data processing,
                          and secure system performance.
                        </p>
                        <div className="team-social">
                          <a href="#">
                            <i className="bi bi-twitter-x"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-facebook"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-instagram"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-linkedin"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="team-content">
                      <h4>Marco Rossi</h4>
                      <span className="position">Back End Developer</span>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-6 col-lg-3"
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  <div className="team-card">
                    <div className="team-image">
                      <img
                        src="/assets/img/person/person-f-3.webp"
                        className="img-fluid"
                        alt=""
                      />
                      <div className="team-overlay">
                        <p>
                          Implements responsive layouts and interactive
                          elements, connecting users seamlessly with the
                          intelligent scheduling system’s core functionality.
                        </p>
                        <div className="team-social">
                          <a href="#">
                            <i className="bi bi-twitter-x"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-facebook"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-instagram"></i>
                          </a>
                          <a href="#">
                            <i className="bi bi-linkedin"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="team-content">
                      <h4>Emma Novak</h4>
                      <span className="position">Front End Developer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="testimonials section">
            <div className="container section-title" data-aos="fade-up">
              <h2>Testimonials</h2>
              <p>
                Real feedback from users who experienced effortless scheduling
                automation.
              </p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="testimonials-slider swiper init-swiper">
                <script
                  type="application/json"
                  className="swiper-config"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      loop: true,
                      speed: 800,
                      autoplay: { delay: 5000 },
                      slidesPerView: 1,
                      spaceBetween: 30,
                      pagination: {
                        el: ".swiper-pagination",
                        type: "bullets",
                        clickable: true,
                      },
                      breakpoints: {
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 },
                      },
                    }),
                  }}
                />

                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="testimonial-card">
                      <div className="testimonial-content">
                        <p>
                          <i className="bi bi-quote quote-icon"></i>
                          This scheduling system completely transformed our
                          workflow — no more conflicts, no wasted time.
                          Everything runs smoothly and automatically. Truly a
                          game changer!
                        </p>
                      </div>
                      <div className="testimonial-profile">
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="profile-info">
                          <img
                            src="/assets/img/person/person-m-5.webp"
                            alt="Profile Image"
                          />
                          <div>
                            <h3>Daniel Weber</h3>
                            <h4>Operations Manager at FlexTime Solutions</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-card">
                      <div className="testimonial-content">
                        <p>
                          <i className="bi bi-quote quote-icon"></i>
                          Managing classes and meetings used to be chaotic. Now,
                          with automatic scheduling, everything is organized,
                          efficient, and stress-free every single day for
                          everyone involved.
                        </p>
                      </div>
                      <div className="testimonial-profile">
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="profile-info">
                          <img
                            src="/assets/img/person/person-f-5.webp"
                            alt="Profile Image"
                          />
                          <div>
                            <h3>Clara Jensen</h3>
                            <h4>Lecturer at Nordheim University</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-card">
                      <div className="testimonial-content">
                        <p>
                          <i className="bi bi-quote quote-icon"></i>I love how
                          flexible and intelligent the system is. It adapts
                          perfectly to my team’s schedule and keeps everything
                          perfectly aligned across multiple projects and
                          timelines.
                        </p>
                      </div>
                      <div className="testimonial-profile">
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="profile-info">
                          <img
                            src="/assets/img/person/person-f-10.webp"
                            alt="Profile Image"
                          />
                          <div>
                            <h3>Luna Moretti</h3>
                            <h4>Software Team Lead at SyncWorks Tech</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-card">
                      <div className="testimonial-content">
                        <p>
                          <i className="bi bi-quote quote-icon"></i>
                          Automatic scheduling has saved our team countless
                          hours. It’s reliable, precise, and adapts instantly
                          when changes occur, keeping every project running
                          smoothly and efficiently.
                        </p>
                      </div>
                      <div className="testimonial-profile">
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="profile-info">
                          <img
                            src="/assets/img/person/person-m-8.webp"
                            alt="Profile Image"
                          />
                          <div>
                            <h3>Adrian Fischer</h3>
                            <h4>Project Coordinator at NovaTime Systems</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-card">
                      <div className="testimonial-content">
                        <p>
                          <i className="bi bi-quote quote-icon"></i>
                          The interface is so intuitive and easy to use. Our
                          workflow became faster, and the automated conflict
                          detection feature works flawlessly every single time,
                          improving overall productivity significantly.
                        </p>
                      </div>
                      <div className="testimonial-profile">
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="profile-info">
                          <img
                            src="/assets/img/person/person-m-2.webp"
                            alt="Profile Image"
                          />
                          <div>
                            <h3>Matteo Klein</h3>
                            <h4>Operations Supervisor at SmartFlow Tech</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-card">
                      <div className="testimonial-content">
                        <p>
                          <i className="bi bi-quote quote-icon"></i>
                          This system simplifies complex scheduling tasks
                          beautifully. It’s efficient, smart, and perfect for
                          managing multiple teams across different time zones
                          with accuracy and consistency every day.
                        </p>
                      </div>
                      <div className="testimonial-profile">
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="profile-info">
                          <img
                            src="/assets/img/person/person-f-7.webp"
                            alt="Profile Image"
                          />
                          <div>
                            <h3>Isabelle Dubois</h3>
                            <h4>HR Manager at GlobalSync Solutions</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-pagination"></div>
              </div>
            </div>
          </section>

          <section id="contact" className="contact section">
            <div className="container section-title" data-aos="fade-up">
              <h2>Contact</h2>
              <p>
                Contact us for support, inquiries, or personalized scheduling
                assistance.
              </p>
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row gy-4 mb-5">
                <div
                  className="col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="info-card">
                    <div className="icon-box">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <h3>Our Address</h3>
                    <p>89 Pandanaran Avenue, Jakarta 60241, Indonesia</p>
                  </div>
                </div>

                <div
                  className="col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="info-card">
                    <div className="icon-box">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <h3>Contact Number</h3>
                    <p>
                      Phone: +62 819-6916-7092
                      <br />
                      Email: info@scheflex.com
                    </p>
                  </div>
                </div>

                <div
                  className="col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="info-card">
                    <div className="icon-box">
                      <i className="bi bi-clock"></i>
                    </div>
                    <h3>Opening Hour</h3>
                    <p>
                      Monday - Saturday: 08:00 - 18:00
                      <br />
                      Sunday: 10:00 - 16:30
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div
                    className="form-wrapper"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <form
                      action="#"
                      method="post"
                      role="form"
                      className="php-email-form"
                    >
                      <div className="row">
                        <div className="col-md-6 form-group">
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-person"></i>
                            </span>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              placeholder="Your name*"
                              required=""
                            />
                          </div>
                        </div>
                        <div className="col-md-6 form-group">
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-envelope"></i>
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Email address*"
                              required=""
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-6 form-group">
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-phone"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              placeholder="Phone number*"
                              required=""
                            />
                          </div>
                        </div>
                        <div className="col-md-6 form-group">
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-list"></i>
                            </span>
                            <select
                              name="subject"
                              className="form-control"
                              required=""
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Select service*
                              </option>
                              <option value="Service 1">
                                Schedule Consultation
                              </option>
                              <option value="Service 2">
                                System Development
                              </option>
                              <option value="Service 3">
                                Feature Integration
                              </option>
                              <option value="Service 4">
                                Technical Support
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group mt-3">
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-chat-dots"></i>
                            </span>
                            <textarea
                              className="form-control"
                              name="message"
                              rows="6"
                              placeholder="Write a message*"
                              required=""
                            ></textarea>
                          </div>
                        </div>
                        <div className="my-3">
                          <div className="loading">Loading</div>
                          <div className="error-message"></div>
                          <div className="sent-message">
                            Your message has been sent. Thank you!
                          </div>
                        </div>
                        <div className="text-center">
                          <button type="submit">Submit Message</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer id="footer" className="footer light-background">
          <div className="container footer-top">
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6 footer-about">
                <a href="index.html" className="logo d-flex align-items-center">
                  <span className="sitename">Scheflex</span>
                </a>
                <div className="footer-contact pt-3">
                  <p>89 Pandanaran Avenue,</p>
                  <p>Jakarta 60241, Indonesia</p>
                  <p className="mt-3">
                    <strong>Phone:</strong> <span>+62 819-6916-7092</span>
                  </p>
                  <p>
                    <strong>Email:</strong> <span>info@scheflex.com</span>
                  </p>
                </div>
                <div className="social-links d-flex mt-4">
                  <a href="#">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="#">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li>
                    <a href="#hero">Home</a>
                  </li>
                  <li>
                    <a href="#about">About</a>
                  </li>
                  <li>
                    <a href="#services">Services</a>
                  </li>
                  <li>
                    <a href="#portfolio">Portfolio</a>
                  </li>
                  <li>
                    <a href="#pricing">Pricing</a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li>
                    <a href="#services">Smart Scheduling</a>
                  </li>
                  <li>
                    <a href="#services">System Integration</a>
                  </li>
                  <li>
                    <a href="#services">Workflow Automation</a>
                  </li>
                  <li>
                    <a href="#services">Schedule Optimization</a>
                  </li>
                  <li>
                    <a href="#services">Data Management</a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Company</h4>
                <ul>
                  <li>
                    <a href="#about">About Us</a>
                  </li>
                  <li>
                    <a href="#team">Our Team</a>
                  </li>
                  <li>
                    <a href="#team">Careers</a>
                  </li>
                  <li>
                    <a href="#testimonials">Testimonials</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Support</h4>
                <ul>
                  <li>
                    <a href="#contact">Help Center</a>
                  </li>
                  <li>
                    <a href="#">Documentation</a>
                  </li>
                  <li>
                    <a href="#faq">FAQs</a>
                  </li>
                  <li>
                    <a href="#">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="#contact">Contact Support</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="container copyright text-center mt-4">
            <p>
              <span>
                © {new Date().getFullYear()} | All Rights Reserved by Darren
                Marcellino Setiawan
              </span>
            </p>
          </div>
        </footer>

        <a
          href="#"
          id="scroll-top"
          className="scroll-top d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short"></i>
        </a>

        <div id="preloader"></div>
      </div>
    </>
  );
}

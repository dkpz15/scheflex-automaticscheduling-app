"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import "@/styles/dashboard.css";
import "@/styles/style.css";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function SelectScheduleRelationListPage() {
  useDocumentMeta("Scheflex - Relation List", "/assets/img/logo/logo-ico.ico");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const { data: session, status } = useSession();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchSchedules = async (userId) => {
    try {
      const res = await fetch("/api/schedules", {
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSchedules(data);
      } else {
        console.error("Expected array, got:", data);
        setSchedules([]);
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSchedules([]);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchSchedules(session.user.id);
    }

    const handleResize = () => {
      // XXL breakpoint in Bootstrap is typically 1400px
      if (window.innerWidth >= 1400) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [session]);

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div id="preloader"></div>
      </div>
    );
  }

  const accountName = session?.user?.name || "User";

  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out!",
      cancelButtonText: "No, stay signed in.",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: "User signed out successfully.",
          icon: "success",
        }).then(() => signOut({ callbackUrl: "/" }));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled!",
          text: "You are still signed in.",
          icon: "info",
          showConfirmButton: true,
        });
      }
    });
  };

  const isLargeScreen =
    typeof window !== "undefined" && window.innerWidth >= 1400;
  const mainContentMarginLeft = sidebarOpen && isLargeScreen ? "250px" : "0";
  const mainContentWidth =
    sidebarOpen && isLargeScreen ? "calc(100% - 250px)" : "100%";

  return (
    <div
      className={`layout-fixed sidebar-expand-lg bg-body-tertiary ${
        sidebarOpen ? "sidebar-open" : "sidebar-collapse"
      }`}
      style={{ overflowX: "hidden" }}
    >
      <div
        className="app-wrapper d-flex flex-grow-1"
        style={{ minHeight: "100vh", position: "relative" }}
      >
        {sidebarOpen && !isLargeScreen && (
          <div
            onClick={toggleSidebar}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)", // Added backdrop for clarity
              zIndex: 1040,
            }}
          />
        )}
        <div
          className={`${sidebarOpen ? "" : "d-none"}`}
          style={{
            position: "fixed",
            zIndex: 1050,
            height: "100vh",
            left: 0,
            top: 0,
            width: "250px", // Tetapkan lebar sidebar
            backgroundColor: "#F8F9FA",
            transition: "transform 0.3s ease", // Smooth transition
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", // Ensure it slides out of view on smaller screens if closed
          }}
        >
          <aside
            className="app-sidebar shadow"
            data-bs-theme="white"
            style={{ height: "100%", width: "100%" }}
          >
            <div className="sidebar-brand" style={{ position: "relative" }}>
              <div className="logo d-flex align-items-center px-3">
                <a href="#" className="logo d-flex align-items-center gap-2">
                  <Image
                    src="/assets/img/logo/logo.png"
                    alt="Logo"
                    width={21}
                    height={27}
                  />
                  <h4 className="sitename mt-2 fw-semibold">Scheflex</h4>
                </a>
                <button
                  className="btn btn-link border-0 p-0 d-xxl-none"
                  onClick={toggleSidebar}
                  style={{
                    position: "absolute", // Menggunakan absolute positioning
                    top: "0",
                    right: "7px",
                    fontSize: "24px",
                    color: "#000",
                    textDecoration: "none",
                    zIndex: 1060, // Pastikan di atas elemen lain di sidebar
                  }}
                >
                  <i className="bi bi-x fs-5"></i>
                </button>
              </div>
            </div>
            <div
              className="sidebar-wrapper"
              style={{ height: "calc(100% - 65px)", overflowY: "auto" }}
            >
              <nav className="mt-2">
                <ul className="nav sidebar-menu flex-column">
                  <li className="nav-item sidebar-item">
                    <Link
                      href="/user/dashboard"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-home nav-icon"></i>
                      <p>Dashboard</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item">
                    <Link
                      href="/user/schedules"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-calendar-alt nav-icon"></i>
                      <p>My Schedules</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item">
                    <Link
                      href="/user/entities"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-layer-group nav-icon"></i>
                      <p>Manage Entities</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item">
                    <Link
                      href="/user/entity-data"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-database nav-icon"></i>
                      <p>Entity Data</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item">
                    <Link
                      href="/user/entity-relations"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-link nav-icon"></i>
                      <p>Entity Relations</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item active">
                    <Link
                      href="/user/relation-list"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-list nav-icon"></i>
                      <p>Relation List</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item">
                    <Link
                      href="/user/generate"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-magic nav-icon"></i>
                      <p>Generate Schedule</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item">
                    <button
                      onClick={handleSignOut}
                      className="nav-link sidebar-link w-100"
                    >
                      <i className="fa fa-sign-out-alt nav-icon"></i>
                      <p style={{ color: "#32363bff" }}>Sign Out</p>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </div>

        <div
          className="content-wrapper flex-grow-1" // Menggunakan flex-grow-1 untuk mengisi ruang yang tersisa
          style={{
            // PENTING: Mendorong konten ke kanan sebesar 250px saat sidebar terbuka di layar besar
            marginLeft: mainContentMarginLeft,
            width: mainContentWidth, // Menggunakan calculated width
            transition: "all 0.3s ease",
            minHeight: "100vh", // Ensure it covers the full viewport height
          }}
        >
          <nav className="app-header navbar navbar-expand bg-body">
            <div className="container-fluid">
              <ul className="navbar-nav">
                <li className="nav-item nav-button-sidebar">
                  <button
                    className="nav-link btn btn-link border-0"
                    onClick={toggleSidebar}
                  >
                    <i className="bi bi-list"></i>
                  </button>
                </li>
                <li className="nav-item d-none d-md-block">
                  <Link href="#" className="nav-link">
                    Relation List
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown user-menu">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <Image
                      src="/assets/img/profile/picture-profile.jpg"
                      className="user-image rounded-circle shadow"
                      alt="User Image"
                      width={35}
                      height={35}
                    />
                    <span
                      className="d-md-inline"
                      style={{ textTransform: "capitalize", fontWeight: 500 }}
                    >
                      {accountName}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* CONTENT */}
          <div className="app-main">
            <div className="app-content">
              <div className="container-fluid py-4">
                <h4 className="mb-4">Select Schedule to View Relation List</h4>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "10%" }}>No</th>
                        <th>Name</th>
                        <th style={{ width: "20%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((s, i) => (
                        <tr key={s.id}>
                          <td>{i + 1}</td>
                          <td>{s.name}</td>
                          <td>
                            <Link
                              href={`/user/relation-list/view-relation-list?scheduleId=${s.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              Select
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {schedules.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No schedules found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="p-copyright mt-1">
                  © {new Date().getFullYear()} | All Rights Reserved by Darren
                  Marcellino Setiawan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

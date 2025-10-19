"use client";

import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import "@/styles/dashboard.css";
import "@/styles/style.css";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function DashboardPageAdmin() {
  useDocumentMeta(
    "Scheflex - Admin Dashboard",
    "/assets/img/logo/logo-ico.ico"
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  // Check screen size and set initial sidebar state
  useEffect(() => {
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
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div id="preloader"></div>
      </div>
    );
  }

  const accountName = session?.user?.name || "Admin";

  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to sign out?",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out!",
      cancelButtonText: "No, stay signed in.",
      showCancelButton: true,
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

  // Logic to determine the main content offset and width
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
      style={{ overflowX: "hidden" }} // Prevent horizontal scrollbar during transition
    >
      {/* MENGHILANGKAN DIV ROW LUAR 
        Sidebar dan Main Content harus menjadi elemen yang berdampingan 
      */}
      <div
        className="app-wrapper d-flex flex-grow-1"
        style={{ minHeight: "100vh", position: "relative" }}
      >
        {/* Overlay untuk mobile */}
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

        {/* SIDEBAR - Tetap fixed */}
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
                    className="logo-application"
                    alt="Logo Application"
                    width={21}
                    height={27}
                  />
                  <h4 className="sitename mt-2 fw-semibold">Scheflex</h4>
                </a>

                {/* Tombol tutup X diposisikan di pojok kanan atas sidebar (hanya untuk mobile/tablet) */}
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
                  {/* Dashboard */}
                  <li className="nav-item sidebar-item active">
                    <Link
                      href="/admin/dashboard"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-home nav-icon"></i>
                      <p>Dashboard</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item ">
                    <Link
                      href="/admin/manage-users"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-users nav-icon"></i>
                      <p>Manage Users</p>
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

        {/* MAIN CONTENT - Diatur margin/width-nya untuk memberi ruang pada sidebar fixed */}
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
          {/* Navbar */}
          <nav className="app-header navbar navbar-expand bg-body">
            <div className="container-fluid">
              <ul className="navbar-nav">
                {/* Tombol toggle di navbar (hanya muncul di XXL ke atas) */}
                <li className="nav-item nav-button-sidebar d-none d-xxl-block">
                  <button
                    className="nav-link btn btn-link border-0"
                    onClick={toggleSidebar}
                  >
                    <i className="bi bi-list"></i>
                  </button>
                </li>
                {/* Tombol toggle di navbar (untuk mobile, di kiri) */}
                <li className="nav-item nav-button-sidebar d-xxl-none">
                  <button
                    className="nav-link btn btn-link border-0"
                    onClick={toggleSidebar}
                  >
                    <i className="bi bi-list"></i>
                  </button>
                </li>
                <li className="nav-item d-none d-md-block">
                  <Link href="#" className="nav-link">
                    Admin Dashboard
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
          {/* Hapus div col-lg-12 yang tidak perlu di sini */}
          <div className="container-fluid pe-5 w-100">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <main className="app-main">
                  <div className="app-content-header">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-sm-6">
                          <h3 className="mb-0">Welcome, {accountName}!</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="app-content">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-lg-6 col-6">
                          <div className="small-box text-bg-primary">
                            <div className="inner">
                              <h3 className="text-white">Dashboard</h3>
                              <p className="text-white">Admin Dashboard</p>
                            </div>
                            <Link
                              href="/admin/dashboard"
                              className="small-box-footer link-light"
                            >
                              More info <i className="bi bi-link-45deg"></i>
                            </Link>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6">
                          <div className="small-box text-bg-success">
                            <div className="inner">
                              <h3 className="text-white">Manage</h3>
                              <p className="text-white">Manage Users</p>
                            </div>
                            <Link
                              href="/admin/manage-users"
                              className="small-box-footer link-light"
                            >
                              More info <i className="bi bi-link-45deg"></i>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <p className="p-copyright pb-3">
                        © {new Date().getFullYear()} | All Rights Reserved by
                        Darren Marcellino Setiawan
                      </p>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

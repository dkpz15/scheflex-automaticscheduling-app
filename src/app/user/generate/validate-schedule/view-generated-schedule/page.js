"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "@/styles/dashboard.css";
import "@/styles/style.css";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function ViewGeneratedSchedulePage() {
  useDocumentMeta(
    "Scheflex - Generated Schedule",
    "/assets/img/logo/logo-ico.ico"
  );

  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [failed, setFailed] = useState([]);
  const [columns, setColumns] = useState([]); // <-- dynamic columns from backend
  const [loading, setLoading] = useState(true);
  const [scheduleName, setScheduleName] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user?.id && scheduleId) {
      fetchScheduleName(session.user.id);
      fetchSchedule();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, scheduleId]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchSchedule = async () => {
    setLoading(true);
    setFailed([]);
    setSchedule([]);
    setColumns([]);
    try {
      const res = await fetch(
        `/api/schedules/generate?schedule_id=${scheduleId}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Generate endpoint error:", err);
        setSchedule([]);
        setFailed([{ message: err?.error || "Failed to generate schedule" }]);
      } else {
        const data = await res.json();
        setSchedule(Array.isArray(data.schedule) ? data.schedule : []);
        setFailed(Array.isArray(data.failed) ? data.failed : []);
        // columns: expect array of { id, type, name }
        setColumns(
          Array.isArray(data.columns) ? data.columns : fallbackColumns()
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setSchedule([]);
      setFailed([
        { message: "Network or server error while generating schedule." },
      ]);
      setColumns(fallbackColumns());
    }
    setLoading(false);
  };

  // fallback columns in case backend doesn't return columns
  function fallbackColumns() {
    return [
      { id: "role", type: "Role", name: "Role" },
      { id: "object", type: "Object", name: "Object" },
      { id: "place", type: "Place", name: "Place" },
      { id: "day", type: "Day", name: "Day" },
      { id: "time", type: "Time", name: "Time" },
    ];
  }

  const fetchScheduleName = async (userId) => {
    try {
      const res = await fetch("/api/schedules", {
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const current = data.find((s) => s.id === parseInt(scheduleId));
        if (current) setScheduleName(current.name);
        else setScheduleName("");
      } else {
        console.error("Expected schedules array, got:", data);
        setScheduleName("");
      }
    } catch (err) {
      console.error("Failed to fetch schedule name:", err);
      setScheduleName("");
    }
  };

  // Export to PDF function
  const exportToPDF = async () => {
    const doc = new jsPDF();

    // Add title (scheduleName) as heading 1, centered
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(scheduleName || "Generated Schedule", 105, 30, {
      align: "center",
    });

    // Prepare table data
    const tableColumns = columns.map((col) => col.name || col.type);
    const tableRows = schedule.map((item, i) => [
      (i + 1).toString(),
      ...columns.map((col) => renderCell(item, col)),
    ]);

    // Add table to PDF
    autoTable(doc, {
      startY: 45,
      head: [["No", ...tableColumns]],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: "#544EDC", textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    const userName = session?.user?.name || "User";
    const now = new Date().toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const finalY = doc.lastAutoTable.finalY + 7; // posisi setelah tabel
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(128, 128, 128);
    doc.text(`This schedule was exported by ${userName} on ${now}`, 14, finalY);

    const pageHeight = doc.internal.pageSize.getHeight();
    const currentYear = new Date().getFullYear();

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Scheflex - © ${currentYear} | All Rights Reserved by Darren Marcellino Setiawan`,
      doc.internal.pageSize.getWidth() / 2, // posisi x tengah
      pageHeight - 10, // posisi y 10mm dari bawah
      { align: "center" }
    );

    // Save the PDF
    doc.save(`Scheflex - ${scheduleName || "Generated Schedule"}.pdf`);
  };

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

  // helper to get cell value by column type
  const renderCell = (item, col) => {
    let key = col.type.toLowerCase();
    let value;
    if (col.type === "Other") {
      const otherKey = "other_" + col.id;
      value = item.others?.[otherKey];
    } else {
      value = item[key];
    }

    if (!value) return "-";

    if (col.type === "Time") {
      if (value.start_time && value.end_time) {
        return `${value.start_time} - ${value.end_time}`;
      }
      return value.name || "-";
    }

    // common case: object with .name
    return value.name || value.start_time || "-";
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
                  <li className="nav-item sidebar-item">
                    <Link
                      href="/user/relation-list"
                      className="nav-link sidebar-link"
                    >
                      <i className="fa fa-list nav-icon"></i>
                      <p>Relation List</p>
                    </Link>
                  </li>
                  <li className="nav-item sidebar-item active">
                    <Link
                      href={`/user/generate/validate-schedule/view-generated-schedule?scheduleId=${scheduleId}`}
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
                    Generated Schedule
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

          <div className="app-main">
            <div className="app-content">
              <div className="container-fluid py-4">
                <h4 className="mb-4">
                  View Generated Schedule for Schedule:{" "}
                  <strong>{scheduleName}</strong>
                </h4>

                {loading ? (
                  <p>Generating schedule...</p>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>No</th>
                            {columns.map((col) => (
                              <th key={col.type || col.id}>
                                {col.name || col.type}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.map((item, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              {columns.map((col, ci) => (
                                <td key={ci}>{renderCell(item, col)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <button className="btn btn-success" onClick={exportToPDF}>
                        Export PDF
                      </button>
                    </div>
                  </>
                )}

                {/* Failed items block */}
                {!loading && Array.isArray(failed) && failed.length > 0 && (
                  <div className="mt-3">
                    <div className="alert alert-danger">
                      <strong>Some entities cannot be generated:</strong>
                      <ul className="mb-0 mt-2">
                        {failed.map((f, idx) => (
                          <li key={idx}>{f.message} ❌</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <p className="p-copyright mt-4">
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

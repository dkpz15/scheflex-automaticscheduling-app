"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import "@/styles/dashboard.css";
import "@/styles/style.css";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function FillEntitiesNamePage() {
  useDocumentMeta(
    "Scheflex - Manage Entities",
    "/assets/img/logo/logo-ico.ico"
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scheduleName, setScheduleName] = useState("");
  const [entities, setEntities] = useState([]);

  // form tambah
  const [name, setName] = useState("");
  const [type, setType] = useState("Role");

  // edit modal
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("Role");

  const { data: session, status } = useSession();
  const accountName = session?.user?.name || "User";

  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (status === "authenticated") {
      fetchEntities();
      fetchScheduleName();
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
  }, [status, session]);

  // ambil semua entity untuk schedule
  const fetchEntities = async () => {
    if (!scheduleId) return;
    try {
      const res = await fetch(`/api/entities?schedule_id=${scheduleId}`);
      if (!res.ok) throw new Error("Failed to fetch entities");
      const data = await res.json();
      setEntities(data);
    } catch (error) {
      console.error("Failed to fetch entities:", error);
      setEntities([]);
    }
  };

  // ambil nama schedule berdasarkan id
  const fetchScheduleName = async () => {
    try {
      if (!session?.user?.id) return;
      const res = await fetch("/api/schedules", {
        headers: { "x-user-id": session.user.id },
      });
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      if (Array.isArray(data)) {
        const current = data.find((s) => s.id === parseInt(scheduleId));
        if (current) setScheduleName(current.name);
      } else {
        setScheduleName("");
      }
    } catch (err) {
      console.error("Failed to fetch schedule name:", err);
      setScheduleName("");
    }
  };

  // Tambah entity
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim())
      return Swal.fire("Error!", "Please enter entity name.", "error");

    try {
      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: parseInt(scheduleId),
          name: name.trim(),
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add entity");
      }

      setName("");
      setType("Role");
      fetchEntities();
      Swal.fire("Success!", "Entity added successfully.", "success");
    } catch (error) {
      console.error("Failed to add entity:", error);
      Swal.fire("Error!", error.message || "Failed to add entity.", "error");
    }
  };

  // Edit (buka modal)
  const handleEdit = (entity) => {
    setEditId(entity.id);
    setEditName(entity.name ?? "");

    // normalisasi type (biar cocok dengan opsi select)
    const TYPE_OPTIONS = ["Role", "Object", "Day", "Time", "Place", "Other"];
    const normalized =
      TYPE_OPTIONS.find(
        (opt) =>
          (entity.type ?? "").toString().toLowerCase() === opt.toLowerCase()
      ) ||
      (entity.type ?? "Role");

    setEditType(normalized);

    const modalEl = document.getElementById("editModal");
    const modal = Modal.getOrCreateInstance(modalEl);
    modal.show();
  };

  // Update entity
  const handleUpdate = async () => {
    if (!editName.trim()) {
      return Swal.fire("Error!", "Please enter entity name.", "error");
    }

    try {
      const res = await fetch("/api/entities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          name: editName.trim(),
          type: editType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update entity");
      }

      const modalEl = document.getElementById("editModal");
      const modal = Modal.getInstance(modalEl);
      if (modal) modal.hide();

      Swal.fire("Updated!", "Entity updated successfully.", "success");

      setEditId(null);
      setEditName("");
      setEditType("Role");
      fetchEntities();
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", err.message || "Failed to update entity", "error");
    }
  };

  // Delete entity
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the entity permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`/api/entities?id=${id}`, { method: "DELETE" });
          fetchEntities();
          Swal.fire("Deleted!", "Entity has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete entity:", error);
          Swal.fire("Error", "Failed to delete entity.", "error");
        }
      }
    });
  };

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
        });
      }
    });
  };

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div id="preloader"></div>
      </div>
    );
  }

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
        {/* SIDEBAR */}
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
                <Link
                  href="/user/dashboard"
                  className="logo d-flex align-items-center gap-2"
                >
                  <Image
                    src="/assets/img/logo/logo.png"
                    alt="Logo"
                    width={21}
                    height={27}
                  />
                  <h4 className="sitename mt-2 fw-semibold">Scheflex</h4>
                </Link>
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
                  <li className="nav-item sidebar-item active">
                    <Link
                      href={`/user/entities/fill-entities?scheduleId=${scheduleId}`}
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

        {/* MAIN CONTENT */}
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
                  <span className="nav-link">Manage Entities</span>
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
                  Manage Entities for Schedule: <strong>{scheduleName}</strong>
                </h4>

                {/* FORM ADD ENTITY */}
                <form
                  onSubmit={handleSubmit}
                  className="mb-4 row g-2 align-items-center"
                >
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entity name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="Role">Role</option>
                      <option value="Object">Object</option>
                      <option value="Day">Day</option>
                      <option value="Time">Time</option>
                      <option value="Place">Place</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-3 d-flex gap-2">
                    <button className="btn btn-primary" type="submit">
                      Add
                    </button>
                  </div>
                </form>

                {/* TABLE ENTITY */}
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "10%" }}>No</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th style={{ width: "25%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entities.map((entity, i) => (
                        <tr key={entity.id}>
                          <td>{i + 1}</td>
                          <td>{entity.name}</td>
                          <td>{entity.type}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEdit(entity)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(entity.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {entities.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No entities found.
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

      {/* MODAL EDIT */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Entity</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label>Entity Name: </label>
              <input
                type="text"
                className="form-control mb-3 mt-1"
                placeholder="Entity name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <label>Select Entity Type: </label>
              <select
                className="form-select mt-1 mb-3"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
              >
                <option value="Role">Role</option>
                <option value="Object">Object</option>
                <option value="Day">Day</option>
                <option value="Time">Time</option>
                <option value="Place">Place</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

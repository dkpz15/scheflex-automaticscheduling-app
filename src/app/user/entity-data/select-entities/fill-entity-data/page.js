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

export default function FillEntityDataPage() {
  useDocumentMeta("Scheflex - Entity Data", "/assets/img/logo/logo-ico.ico");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [scheduleName, setScheduleName] = useState("");
  const [entityName, setEntityName] = useState("");
  const [entityType, setEntityType] = useState("");
  const { data: session, status } = useSession();

  // add form state
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // edit modal state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editType, setEditType] = useState("");

  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");
  const entityId = searchParams.get("entityId");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Helper function to convert time string to minutes
  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  // Helper function to check time overlap
  const hasTimeOverlap = (data, newStart, newEnd, excludeId = null) => {
    if (!newStart || !newEnd) return false;
    let newStartMin = timeToMinutes(newStart);
    let newEndMin = timeToMinutes(newEnd);
    if (newStartMin > newEndMin) newEndMin += 1440; // Handle cross midnight

    for (let item of data) {
      if (excludeId && item.id === excludeId) continue; // Skip the one being edited
      let startMin = timeToMinutes(item.start_time);
      let endMin = timeToMinutes(item.end_time);
      if (startMin > endMin) endMin += 1440;

      const latestStart = Math.max(newStartMin, startMin);
      const earliestEnd = Math.min(newEndMin, endMin);
      if (latestStart < earliestEnd) return true;
    }
    return false;
  };

  // Helper function to check day duplicate
  const hasDayDuplicate = (data, dayName, excludeId = null) => {
    return data.some(
      (item) =>
        (excludeId ? item.id !== excludeId : true) && item.name === dayName
    );
  };

  // --- Fetch helpers ---
  const fetchScheduleName = async (userId) => {
    try {
      const res = await fetch("/api/schedules", {
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const current = data.find((s) => s.id === parseInt(scheduleId));
        if (current) setScheduleName(current.name);
      } else {
        console.error("Expected schedules array, got:", data);
        setScheduleName("");
      }
    } catch (err) {
      console.error("Failed to fetch schedule name:", err);
      setScheduleName("");
    }
  };

  const fetchEntityDetails = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/entities?id=${id}`);
      const data = await res.json();
      if (data && typeof data === "object") {
        setEntityType(data.type || "");
        setEntityName(data.name || "");
      } else {
        setEntityType("");
        setEntityName("");
      }
    } catch (err) {
      console.error("Failed to fetch entity details:", err);
      setEntityType("");
      setEntityName("");
    }
  };

  const fetchData = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/entity-data?entity_id=${id}`);
      const data = await res.json();
      if (Array.isArray(data)) setDataList(data);
      else {
        console.error("Expected array, got:", data);
        setDataList([]);
      }
    } catch (err) {
      console.error("Failed to fetch entity data:", err);
      setDataList([]);
    }
  };

  // initial fetch when entityId or session changes
  useEffect(() => {
    // 1. Logika Sidebar Resize
    const handleResize = () => {
      // XXL breakpoint in Bootstrap is typically 1400px
      if (window.innerWidth >= 1400) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state for sidebar
    handleResize();

    // Tambahkan resize event listener
    window.addEventListener("resize", handleResize);

    // 2. Logika Fetching Data (dari kode Anda)
    if (session?.user?.id && scheduleId) {
      fetchScheduleName(session.user.id);
    }
    if (entityId) {
      fetchEntityDetails(entityId);
      fetchData(entityId);
    }

    // 3. Logika Event Modal (dari kode Anda)
    const modalEl = document.getElementById("editDataModal");

    const onHidden = () => {
      setEditId(null);
      setEditName("");
      setEditStartTime("");
      setEditEndTime("");
      setEditType("");
    };

    // Tambahkan event listener modal (hanya jika elemen ditemukan)
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", onHidden);
    }

    // 4. Combined Cleanup: Menghapus kedua listener saat cleanup
    return () => {
      // Cleanup untuk Resize Listener
      window.removeEventListener("resize", handleResize);

      // Cleanup untuk Modal Listener
      if (modalEl) {
        modalEl.removeEventListener("hidden.bs.modal", onHidden);
      }
    };
  }, [entityId, session, scheduleId]); // Dependency array tetap sama

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div id="preloader"></div>
      </div>
    );
  }

  const accountName = session?.user?.name || "User";

  // INLINE ADD
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for Day type
    if (entityType === "Day") {
      if (hasDayDuplicate(dataList, name)) {
        return Swal.fire(
          "Error!",
          "Day already exists. Cannot add duplicate days.",
          "error"
        );
      }
    }

    // Validation for Time type
    if (entityType === "Time") {
      if (hasTimeOverlap(dataList, startTime, endTime)) {
        return Swal.fire(
          "Error!",
          "Time overlaps with existing time slot.",
          "error"
        );
      }
      if (!startTime || !endTime) {
        return Swal.fire("Error!", "Please fill start and end time.", "error");
      }
    } else if (!name.trim()) {
      return Swal.fire("Error!", "Please enter a name.", "error");
    }

    const payload =
      entityType === "Time"
        ? {
            entity_id: parseInt(entityId),
            start_time: startTime,
            end_time: endTime,
          }
        : { entity_id: parseInt(entityId), name: name.trim() };

    try {
      const res = await fetch("/api/entity-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add");

      // reset form
      setName("");
      setStartTime("");
      setEndTime("");
      await fetchData(entityId);

      Swal.fire("Success!", "Data added successfully.", "success");
    } catch (err) {
      console.error("Add failed:", err);
      Swal.fire("Error!", "Failed to add data.", "error");
    }
  };

  // --- Edit: open modal and set state ---
  const handleEdit = (d) => {
    setEditId(d.id);
    if (entityType === "Time") {
      setEditStartTime(d.start_time ?? "");
      setEditEndTime(d.end_time ?? "");
      setEditType("Time");
      setEditName(""); // not used for Time
    } else {
      setEditName(d.name ?? "");
      setEditType(entityType || "Role");
      setEditStartTime("");
      setEditEndTime("");
    }

    const modalEl = document.getElementById("editDataModal");
    const modal = Modal.getOrCreateInstance(modalEl);
    modal.show();
  };

  // --- Update via modal ---
  const handleUpdate = async () => {
    // Validation for Day type
    if (editType === "Day") {
      if (hasDayDuplicate(dataList, editName, editId)) {
        return Swal.fire(
          "Error!",
          "Day already exists. Cannot update to duplicate day.",
          "error"
        );
      }
    }

    // Validation for Time type
    if (editType === "Time") {
      if (hasTimeOverlap(dataList, editStartTime, editEndTime, editId)) {
        return Swal.fire(
          "Error!",
          "Time overlaps with existing time slot.",
          "error"
        );
      }
      if (!editStartTime || !editEndTime) {
        return Swal.fire("Error!", "Please fill start and end time.", "error");
      }
    } else if (!editName.trim()) {
      return Swal.fire("Error!", "Please enter a name.", "error");
    }

    try {
      let payload;
      if (editType === "Time") {
        payload = {
          id: editId,
          start_time: editStartTime,
          end_time: editEndTime,
        };
      } else {
        payload = { id: editId, name: editName.trim() };
      }

      const res = await fetch("/api/entity-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");

      // tutup modal
      const modalEl = document.getElementById("editDataModal");
      const modal = Modal.getInstance(modalEl);
      if (modal) modal.hide();

      Swal.fire("Updated!", "Data updated successfully.", "success");

      // reset edit states & reload
      setEditId(null);
      setEditName("");
      setEditStartTime("");
      setEditEndTime("");
      await fetchData(entityId);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error!", "Failed to update data.", "error");
    }
  };

  // --- Delete with Swal confirm ---
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the data permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/entity-data?id=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Delete failed");
          await fetchData(entityId);
          Swal.fire("Deleted!", "Data has been deleted.", "success");
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error!", "Failed to delete.", "error");
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

            <div className="sidebar-wrapper">
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
                  <li className="nav-item sidebar-item active">
                    <Link
                      href={`/user/entity-data/select-entities/fill-entity-data?scheduleId=${scheduleId}&entityId=${entityId}`}
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

        {/* MAIN */}
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
                  <span className="nav-link">Entity Data</span>
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
                  Fill Data for Schedule: <strong>{scheduleName}</strong> |{" "}
                  {entityName ? (
                    <>
                      Entity: <strong>{entityName}</strong>
                    </>
                  ) : null}
                </h4>

                {/* FORM ADD */}
                <form onSubmit={handleSubmit} className="row g-2 mb-4">
                  <div className="col-md-6">
                    {entityType === "Day" ? (
                      <select
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          -- Select Day --
                        </option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                    ) : entityType === "Time" ? (
                      <div className="d-flex gap-2">
                        <input
                          type="time"
                          className="form-control"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                        />
                        <input
                          type="time"
                          className="form-control"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        placeholder="Data name"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    )}
                  </div>

                  <div className="col-md-2">
                    <button className="btn btn-primary w-100" type="submit">
                      Add
                    </button>
                  </div>
                </form>

                {/* TABLE */}
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "10%" }}>No</th>
                        <th>Name</th>
                        <th style={{ width: "25%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataList.map((d, i) => (
                        <tr key={d.id}>
                          <td>{i + 1}</td>
                          <td>
                            {entityType === "Time"
                              ? `${d.start_time?.slice(
                                  0,
                                  5
                                )} - ${d.end_time?.slice(0, 5)}`
                              : d.name}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEdit(d)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(d.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {dataList.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No entity data found.
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

      {/* EDIT MODAL */}
      <div
        className="modal fade"
        id="editDataModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Entity Data</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label className="form-label">Entity Data Name:</label>
              {editType === "Time" ? (
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="time"
                      className="form-control mb-3"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="time"
                      className="form-control mb-3"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                    />
                  </div>
                </div>
              ) : editType === "Day" ? (
                <select
                  className="form-select mb-3"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                >
                  <option value="" disabled>
                    -- Select Day --
                  </option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control mb-3"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Data name"
                  required
                />
              )}
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

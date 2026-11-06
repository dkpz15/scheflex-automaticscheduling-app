"use client";
import Link from "next/link";
import { InitLandingPage } from "@/utils/main";
import { useEffect } from "react";
import "@/styles/style.css";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function AuthOption() {
  useEffect(() => {
    InitLandingPage();
  }, []);

  useDocumentMeta("Scheflex - Role Option", "/assets/img/logo/logo-ico.ico");

  const primaryColor = "#544EDC";

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center px-4"
      style={{ minHeight: "90vh" }}
    >
      <h2 className="text-center fw-bold mb-5">Role Option</h2>

      <div
        className="row g-4 justify-content-center w-100"
        style={{ maxWidth: "900px" }}
      >
        {/* Admin Card */}
        <div className="col-md-6">
          <div
            className="card h-100 text-center shadow border-0 card-lift"
            style={{
              borderTop: `4px solid ${primaryColor}`,
              borderRadius: "12px",
            }}
          >
            <div className="card-body py-5 px-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: primaryColor,
                }}
              >
                <i className="fas fa-user-shield fa-2x text-white"></i>
              </div>
              <h5 className="fw-bold mb-2" style={{ color: primaryColor }}>
                Sign In Admin
              </h5>
              <p className="mb-4" style={{ color: "#444" }}>
                Sign in as an admin to manage schedules, users, and settings.
              </p>
              <Link
                href="/auth/sign-in-admin"
                className="btn btn-outline-primary"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="col-md-6">
          <div
            className="card h-100 text-center shadow border-0 card-lift"
            style={{
              borderTop: `4px solid ${primaryColor}`,
              borderRadius: "12px",
            }}
          >
            <div className="card-body py-5 px-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: primaryColor,
                }}
              >
                <i className="fas fa-user-plus fa-2x text-white"></i>
              </div>
              <h5 className="fw-bold mb-2" style={{ color: primaryColor }}>
                Register User
              </h5>
              <p className="mb-4" style={{ color: "#444" }}>
                Create a user account and start managing your own flexible
                schedules.
              </p>
              <Link
                href="/auth/register-user"
                className="btn btn-outline-primary"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div id="preloader"></div>
    </div>
  );
}

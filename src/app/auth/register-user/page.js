"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import "@/styles/style.css";
import { InitLandingPage } from "@/utils/main";
import Swal from "sweetalert2";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function RegisterUser() {
  useEffect(() => {
    InitLandingPage();
  }, []);

  useDocumentMeta("Scheflex - Register User", "/assets/img/logo/logo-ico.ico");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Warning!",
        text: "Password doesn't match.",
        icon: "warning",
      });
      return;
    }

    const res = await fetch("/api/auth/register-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      Swal.fire({
        title: "Success!",
        text: "User registered successfully.",
        icon: "success",
      }).then(() => router.push("/auth/sign-in-user"));
    } else {
      Swal.fire({
        title: "Error!",
        text: "User registration failed.",
        icon: "error",
      });
    }
  };

  return (
    <section className="vh-100" style={{ overflowY: "auto" }}>
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 col-xxl-6 mb-4 mb-md-0 div-image-auth">
            <img
              src="/assets/img/illustration/illustration-3.webp"
              className="img-fluid"
              alt="Illustration"
            />
          </div>

          {/* Form Login */}
          <div className="col-sm-10 col-md-7 col-lg-6 col-xl-4 col-xxl-4 div-form-auth">
            <form onSubmit={handleSubmit}>
              <h3 className="fw-bold mb-4 text-center">Register User</h3>

              {/* Username */}
              <div className="form-outline mb-3">
                <input
                  style={{ fontSize: "17px" }}
                  type="text"
                  id="userUsername"
                  className="form-control form-control-lg"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-outline mb-3">
                <input
                  style={{ fontSize: "17px" }}
                  className="form-control form-control-lg"
                  id="userEmail"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-outline mb-3">
                <input
                  style={{ fontSize: "17px" }}
                  type="password"
                  id="userPassword"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-outline mb-4">
                <input
                  style={{ fontSize: "17px" }}
                  type="password"
                  id="userConfirmPassword"
                  className="form-control form-control-lg"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Button */}
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn-submit-auth btn btn-lg w-100"
                  style={{
                    backgroundColor: "#544EDC",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "18px",
                  }}
                >
                  Register
                </button>
              </div>
            </form>
            <div className="text-center mt-3">
              <span className="">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in-user"
                  className="link-sign-in-user text-decoration-none"
                  style={{ color: "#544EDC" }}
                >
                  Sign In here
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div id="preloader"></div>
    </section>
  );
}

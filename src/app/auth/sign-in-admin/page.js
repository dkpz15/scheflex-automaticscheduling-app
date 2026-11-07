"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";
import "@/styles/style.css";
import { InitLandingPage } from "@/utils/main";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function SignInAdmin() {
  useEffect(() => {
    InitLandingPage();
  }, []);

  useDocumentMeta("Scheflex - Sign In Admin", "/assets/img/logo/logo-ico.ico");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("admin-credentials", {
      redirect: false,
      username,
      password,
    });
    if (result.error) {
      Swal.fire({
        title: "Error!",
        text: "Invalid admin credentials.",
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Success!",
        text: "Admin signed in successfully.",
        icon: "success",
      }).then(() => router.push("/admin/dashboard"));
    }
  };
  return (
    <section className="vh-100" style={{ overflowY: "auto" }}>
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 col-xxl-6 mb-4 mb-md-0 div-image-auth">
            <Image
              src="/assets/img/illustration/illustration-4.avif"
              className="img-fluid"
              alt="Illustration"
              width={600}
              height={400}
            />
          </div>
          <div
            className="col-sm-10 col-md-7 col-lg-6 col-xl-4 col-xxl-4 div-form-auth"
            style={{ marginTop: "-20px" }}
          >
            <form onSubmit={handleSubmit}>
              <h3 className="fw-bold mb-4 text-center">Sign In Admin</h3>
              <div className="form-outline mb-3">
                <input
                  style={{ fontSize: "17px" }}
                  type="text"
                  placeholder="Username"
                  className="form-control form-control-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-outline mb-4">
                <input
                  style={{ fontSize: "17px" }}
                  type="password"
                  placeholder="Password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
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
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="preloader"></div>
    </section>
  );
}

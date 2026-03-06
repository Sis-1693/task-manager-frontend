import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/login", {
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login Response:", res.data); // DEBUG

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login Successful 🎉",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#1e1e2f",
        color: "#fff",
        iconColor: "#00ff88",
      });

      setTimeout(() => {
        navigate("/projects", { replace: true });
      }, 1500);

    } catch (err) {

      console.error("Login Error:", err);

      Swal.fire({
        title: "Login Failed 🚫",
        text: err.response?.data?.message || "Server error",
        icon: "error",
        confirmButtonColor: "#ff4d4d",
        background: "#1e1e2f",
        color: "#fff",
        iconColor: "#ff4d4d",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🚀 Project Manager</h1>
        <p style={styles.subtitle}>Admin Login Panel</p>

        <form onSubmit={handleLogin} style={styles.form}>

          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}
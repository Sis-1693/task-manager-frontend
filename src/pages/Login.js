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

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 Premium Success Toast
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
        navigate("/projects");
      }, 2000);

    } catch (err) {
      Swal.fire({
        title: "Access Denied 🚫",
        text: "Invalid Email or Password",
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

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(-45deg, #6C63FF, #3F3DFF, #5A54FF, #8F94FB)",
  },

  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    color: "#fff",
    textAlign: "center",
  },

  logo: {
    marginBottom: "10px",
    fontWeight: "600",
  },

  subtitle: {
    marginBottom: "30px",
    fontSize: "14px",
    opacity: "0.8",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
  },

  button: {
    padding: "12px",
    borderRadius: "30px",
    border: "none",
    background: "#fff",
    color: "#6C63FF",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Login;
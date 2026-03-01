import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        setProjects(res.data.data || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "Unauthorized or Server Error",
          icon: "error",
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p style={{ color: "#fff" }}>Loading Projects...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📁 Project Manager</h1>
        <p style={styles.subtitle}>Select a project to manage tasks</p>

        {projects.length === 0 ? (
          <p style={{ color: "#fff" }}>No Projects Found</p>
        ) : (
          <div style={styles.projectList}>
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                style={styles.projectCard}
              >
                <h3 style={styles.projectTitle}>{p.title}</h3>
                <p style={styles.projectDesc}>
                  {p.description?.substring(0, 80)}...
                </p>
                <span style={styles.viewBtn}>Open →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(-45deg, #6C63FF, #3F3DFF, #5A54FF, #8F94FB)",
  },

  card: {
    width: "850px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    color: "#fff",
    textAlign: "center",
  },

  title: {
    marginBottom: "10px",
  },

  subtitle: {
    marginBottom: "30px",
    fontSize: "14px",
    opacity: "0.9",
  },

  projectList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },

  projectCard: {
    background: "rgba(255,255,255,0.2)",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.3s",
  },

  projectTitle: {
    marginBottom: "8px",
  },

  projectDesc: {
    fontSize: "13px",
    opacity: "0.9",
    marginBottom: "10px",
  },

  viewBtn: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#fff",
  },

  loaderContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(-45deg, #6C63FF, #3F3DFF, #5A54FF, #8F94FB)",
  },

  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
};

export default Projects;
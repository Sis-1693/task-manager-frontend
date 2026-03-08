import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

function Projects() {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    API.get("/projects")
      .then((res) => {
        setProjects(res.data.data || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Unauthorized or Server Error", "error");
        setLoading(false);
      });
  };

  const createProject = async () => {

    if (!title) {
      Swal.fire("Error", "Title Required", "error");
      return;
    }

    try {

      const res = await API.post("/projects", {
        title,
        description,
      });

      Swal.fire("Success", "Project Created", "success");

      setProjects([...projects, res.data.data]);

      setTitle("");
      setDescription("");

    } catch (err) {

      Swal.fire("Error", "Only Admin Can Create Project", "error");

    }
  };

  const editProject = async (id) => {

    const { value: newTitle } = await Swal.fire({
      title: "Edit Project",
      input: "text",
      inputLabel: "Project Title",
    });

    if (!newTitle) return;

    try {

      await API.put(`/projects/${id}`, {
        title: newTitle,
      });

      Swal.fire("Updated!", "Project Updated", "success");

      setProjects(
        projects.map((p) =>
          p.id === id ? { ...p, title: newTitle } : p
        )
      );

    } catch {

      Swal.fire("Error", "Update Failed", "error");

    }
  };

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

        {/* CREATE PROJECT */}

        <div style={styles.form}>

          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />

          <button onClick={createProject} style={styles.button}>
            Create Project
          </button>

        </div>

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

                <span style={styles.viewBtn}>
                  Open →
                </span>

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    editProject(p.id);
                  }}
                  style={styles.editBtn}
                >
                  Edit ✏
                </span>

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
    background: "linear-gradient(-45deg,#6C63FF,#3F3DFF,#5A54FF,#8F94FB)",
  },

  card: {
    width: "900px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    color: "#fff",
    textAlign: "center",
  },

  title: {
    marginBottom: "10px",
  },

  subtitle: {
    marginBottom: "25px",
  },

  form: {
    marginBottom: "30px",
  },

  input: {
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#fff",
    cursor: "pointer",
  },

  projectList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: "20px",
  },

  projectCard: {
    background: "rgba(255,255,255,0.2)",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
  },

  projectTitle: {
    marginBottom: "8px",
  },

  projectDesc: {
    fontSize: "13px",
    marginBottom: "10px",
  },

  viewBtn: {
    fontSize: "12px",
    fontWeight: "600",
  },

  editBtn: {
    display: "block",
    marginTop: "10px",
    fontSize: "12px",
    cursor: "pointer",
  },

  loaderContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(-45deg,#6C63FF,#3F3DFF,#5A54FF,#8F94FB)",
  },

  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    marginBottom: "15px",
  },

};

export default Projects;
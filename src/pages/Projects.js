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

  const fetchProjects = async () => {

    try {

      const res = await API.get("/projects");

      setProjects(res.data.data);
      setLoading(false);

    } catch (err) {

      Swal.fire("Error", "Unauthorized or Server Error", "error");
      setLoading(false);

    }

  };

  // CREATE PROJECT
  const createProject = async () => {

    if (!title) {
      Swal.fire("Error", "Title Required", "error");
      return;
    }

    try {

      const res = await API.post("/projects", {
        title,
        description
      });

      Swal.fire("Success", "Project Created", "success");

      setProjects([...projects, res.data.data]);

      setTitle("");
      setDescription("");

    } catch {

      Swal.fire("Error", "Only Admin Can Create Project", "error");

    }

  };

  // EDIT PROJECT
  const editProject = async (project) => {

    const { value: formValues } = await Swal.fire({

      title: "Edit Project",

      html: `
        <input id="swal-title" class="swal2-input" placeholder="Title" value="${project.title}">
        <input id="swal-desc" class="swal2-input" placeholder="Description" value="${project.description || ""}">
      `,

      focusConfirm: false,

      preConfirm: () => {
        return {
          title: document.getElementById("swal-title").value,
          description: document.getElementById("swal-desc").value
        };
      }

    });

    if (!formValues) return;

    try {

      const res = await API.put(`/projects/${project.id}`, formValues);

      Swal.fire("Updated!", "Project Updated", "success");

      setProjects(
        projects.map((p) =>
          p.id === project.id ? res.data.data : p
        )
      );

    } catch {

      Swal.fire("Error", "Update Failed", "error");

    }

  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Loading Projects...
      </div>
    );
  }

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1>📁 Project Manager</h1>
        <p>Select a project to manage tasks</p>

        {/* CREATE PROJECT */}

        <div style={styles.form}>

          <input
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />

          <button onClick={createProject} style={styles.button}>
            Create Project
          </button>

        </div>

        {/* PROJECT LIST */}

        {projects.length === 0 ? (

          <p>No Projects Found</p>

        ) : (

          <div style={styles.grid}>

            {projects.map((p) => (

              <div
                key={p.id}
                style={styles.cardProject}
                onClick={() => navigate(`/projects/${p.id}`)}
              >

                <h3>{p.title}</h3>

                <p>
                  {p.description ? p.description : "No description"}
                </p>

                <span style={{ fontSize: "12px" }}>
                  Open →
                </span>

                <div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editProject(p);
                    }}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>

                </div>

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
    background: "linear-gradient(-45deg,#6C63FF,#3F3DFF,#5A54FF,#8F94FB)"
  },

  card: {
    width: "900px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(15px)",
    color: "#fff",
    textAlign: "center"
  },

  form: {
    marginBottom: "30px"
  },

  input: {
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    border: "none"
  },

  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: "20px"
  },

  cardProject: {
    background: "rgba(255,255,255,0.2)",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer"
  },

  editBtn: {
    marginTop: "10px",
    padding: "5px 10px",
    cursor: "pointer"
  }

};

export default Projects;
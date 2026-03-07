import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

function ProjectDetails() {

  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");

  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState("");

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = useCallback(() => {
    API.get(`/projects/${id}/tasks`)
      .then((res) => {
        setTasks(res.data.data || res.data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Error loading tasks", "error");
        setLoading(false);
      });
  }, [id]);



  useEffect(() => {

    fetchTasks();

    if (user?.role === "admin") {
      API.get("/users")
        .then((res) => setUsers(res.data.data))
        .catch(() => Swal.fire("Error", "Error loading users", "error"));
    }

  }, [fetchTasks, user?.role]);   // ✅ FIXED



  const createTask = async (e) => {

    e.preventDefault();

    if (!assignedUser) {
      Swal.fire("Warning", "Please select a user", "warning");
      return;
    }

    try {

      await API.post("/tasks", {
        project_id: id,
        user_id: assignedUser,
        title,
        priority,
        due_date: dueDate,
      });

      Swal.fire({
        icon: "success",
        title: "Task Created",
        timer: 1500,
        showConfirmButton: false
      });

      setTitle("");
      setDueDate("");
      setAssignedUser("");

      fetchTasks();

    } catch {
      Swal.fire("Error", "Error creating task", "error");
    }

  };



  const updateStatus = async (taskId, newStatus) => {

    try {

      await API.put(`/tasks/${taskId}/status`, {
        status: newStatus,
      });

      fetchTasks();

    } catch {

      Swal.fire("Error", "Rule Violation", "error");

    }

  };



  const updateTask = async (taskId) => {

    try {

      await API.put(`/tasks/${taskId}`, {
        title: editTitle,
        priority: editPriority,
        due_date: editDueDate
      });

      Swal.fire("Success", "Task Updated", "success");

      setEditTaskId(null);

      fetchTasks();

    } catch {

      Swal.fire("Error", "Update failed", "error");

    }

  };



  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

  };



  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p style={{ color: "#fff" }}>Loading Tasks...</p>
      </div>
    );
  }



  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

          <h1 style={styles.title}>📋 Project Tasks</h1>

          <button onClick={logout} style={styles.button}>
            Logout
          </button>

        </div>

        <p style={styles.subtitle}>Manage and track project progress</p>



        {user?.role === "admin" && (

          <form onSubmit={createTask} style={styles.form}>

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />

            <select
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select User</option>

              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}

            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={styles.select}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button}>
              ➕ Create Task
            </button>

          </form>

        )}



        <div style={styles.taskGrid}>

          {tasks.length === 0 ? (

            <p style={{ color: "#fff" }}>No Tasks Found</p>

          ) : (

            tasks.map((task) => (

              <div key={task.id} style={styles.taskCard}>

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

                  {editTaskId === task.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={styles.input}
                    />
                  ) : (
                    <h3>{task.title}</h3>
                  )}

                  {user?.role === "admin" && (
                    <button
                      onClick={() => {
                        setEditTaskId(task.id);
                        setEditTitle(task.title);
                        setEditPriority(task.priority);
                        setEditDueDate(task.due_date);
                      }}
                      style={styles.button}
                    >
                      Edit
                    </button>
                  )}

                </div>


                <p>
                  <b>Priority:</b>

                  {editTaskId === task.id ? (
                    <select
                      value={editPriority}
                      onChange={(e)=>setEditPriority(e.target.value)}
                      style={styles.select}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  ) : task.priority}

                </p>


                <p>
                  <b>Due:</b>

                  {editTaskId === task.id ? (
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e)=>setEditDueDate(e.target.value)}
                      style={styles.input}
                    />
                  ) : task.due_date}

                </p>



                <select
                  value={task.status}
                  onChange={(e)=>updateStatus(task.id,e.target.value)}
                  style={styles.select}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>

                  {user?.role === "admin" && (
                    <option value="OVERDUE">OVERDUE</option>
                  )}

                </select>



                {editTaskId === task.id && (
                  <button
                    onClick={() => updateTask(task.id)}
                    style={styles.button}
                  >
                    Save
                  </button>
                )}

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );

}



const styles = {
  container:{
    minHeight:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"linear-gradient(-45deg,#6C63FF,#3F3DFF,#5A54FF,#8F94FB)",
    padding:"40px"
  },

  card:{
    width:"1000px",
    padding:"40px",
    borderRadius:"20px",
    background:"rgba(255,255,255,0.15)",
    backdropFilter:"blur(15px)",
    boxShadow:"0 8px 32px rgba(0,0,0,0.2)",
    color:"#fff"
  },

  form:{
    display:"flex",
    gap:"15px",
    flexWrap:"wrap",
    marginBottom:"30px"
  },

  input:{
    padding:"10px",
    borderRadius:"8px",
    border:"none"
  },

  select:{
    padding:"10px",
    borderRadius:"8px",
    border:"none"
  },

  button:{
    padding:"10px 20px",
    borderRadius:"20px",
    border:"none",
    background:"#fff",
    color:"#6C63FF",
    cursor:"pointer"
  },

  taskGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
    gap:"20px"
  },

  taskCard:{
    background:"rgba(255,255,255,0.2)",
    padding:"20px",
    borderRadius:"12px"
  },

  loaderContainer:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"linear-gradient(-45deg,#6C63FF,#3F3DFF,#5A54FF,#8F94FB)"
  },

  loader:{
    width:"40px",
    height:"40px",
    border:"4px solid rgba(255,255,255,0.3)",
    borderTop:"4px solid #fff",
    borderRadius:"50%"
  }
};

export default ProjectDetails;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
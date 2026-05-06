import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CourseProvider } from "./context/CourseContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import DashboardPage from "./pages/DashboardPage";
import LessonPage from "./pages/LessonPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./styles/global.css";

export default function App() {
  return (
    // BrowserRouter must wrap everything so hooks like useLocation work in Navbar
    <BrowserRouter>
      {/* CourseProvider lives inside the router so context consumers can also use router hooks */}
      <CourseProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CourseDetailPage />} />
          {/* moduleId scopes the lesson within the course curriculum */}
          <Route path="/course/:courseId/lesson/:moduleId/:lessonId" element={<LessonPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CourseProvider>
    </BrowserRouter>
  );
}

import { Link, NavLink, useLocation } from "react-router-dom"
import { useCourses } from "../context/CourseContext"
import "./Navbar.css"

export default function Navbar() {
  const { enrolledCourseList } = useCourses()
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-mark">L</span>
          <span className="logo-text">LearnHub</span>
        </Link>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive && pathname === "/" ? "active" : ""}`}
          >
            Browse
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            My Learning
            {enrolledCourseList.length > 0 && (
              <span className="nav-badge">{enrolledCourseList.length}</span>
            )}
          </NavLink>
        </div>

        <div className="navbar-user">
          <div className="user-avatar"><span>CE</span></div>
          <div className="user-info">
            <span className="user-name">Christopher Edafe</span>
            <span className="user-role">Student</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

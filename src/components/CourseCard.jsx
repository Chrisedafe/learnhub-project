import { Link } from "react-router-dom"
import { useCourses } from "../context/CourseContext"
import ProgressBar from "./ProgressBar"
import "./CourseCard.css"

export default function CourseCard({ course, showProgress = false, style }) {
  const { isEnrolled, getCourseProgress } = useCourses()
  const enrolled = isEnrolled(course.id)
  const progress = showProgress ? getCourseProgress(course.id) : null

  const catClass = `cat-${course.category.toLowerCase().replace(/\s+/g, "-")}`
  const diffClass = `badge-${course.difficulty.toLowerCase()}`

  return (
    <Link to={`/course/${course.id}`} className="course-card" style={style}>
      <div className="card-thumb" style={{ background: course.thumbnail }}>
        <span className="card-thumb-emoji">{course.thumbnailEmoji}</span>
        {enrolled && <span className="card-enrolled-pill">Enrolled</span>}
      </div>

      <div className="card-body">
        <div className="card-tags">
          <span className={`tag ${catClass}`}>{course.category}</span>
          <span className={`tag difficulty ${diffClass}`}>{course.difficulty}</span>
        </div>

        <h3 className="card-title">{course.title}</h3>
        <p className="card-instructor">by {course.instructor}</p>

        <div className="card-meta">
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
            </svg>
            {course.duration}
          </span>
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {course.enrolledCount.toLocaleString()}
          </span>
        </div>

        <div className="card-footer">
          <div className="card-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" stroke="none">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span className="rating-value">{course.rating}</span>
          </div>
          {showProgress && progress && (
            <span className="progress-label">{progress.completed}/{progress.total} lessons</span>
          )}
        </div>

        {showProgress && progress && (
          <ProgressBar percent={progress.percent} size="sm" style={{ marginTop: "10px" }} />
        )}
      </div>
    </Link>
  )
}

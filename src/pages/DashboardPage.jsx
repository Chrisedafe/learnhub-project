import { Link } from "react-router-dom"
import { useCourses } from "../context/CourseContext"
import ProgressBar from "../components/ProgressBar"
import "./DashboardPage.css"

export default function DashboardPage() {
  const { enrolledCourseList, getCourseProgress, getContinueLesson } = useCourses()

  // Empty state — user hasn't enrolled in anything yet
  if (!enrolledCourseList.length) {
    return (
      <div className="page-wrapper dashboard-page">
        <div className="dash-banner">
          <div className="container">
            <div className="dash-header">
              <h1>My Learning</h1>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="empty-dashboard">
            <div className="empty-illustration">
              <div className="empty-orb" />
              <span className="empty-emoji">📚</span>
            </div>
            <h2>Nothing enrolled yet</h2>
            <p>Pick a course and get started. You can always add more later.</p>
            <Link to="/" className="btn btn-primary btn-lg">Browse Courses</Link>
          </div>
        </div>
      </div>
    )
  }

  // Aggregate stats across all enrolled courses for the summary bar
  let totalDone = 0
  let totalLessons = 0
  let pctSum = 0

  for (const c of enrolledCourseList) {
    const p = getCourseProgress(c.id)
    totalDone += p.completed
    totalLessons += p.total
    pctSum += p.percent
  }

  const avgPct = Math.round(pctSum / enrolledCourseList.length)

  return (
    <div className="page-wrapper dashboard-page">

      {/* Dark header banner */}
      <div className="dash-banner">
        <div className="container">
          <div className="dash-header">
            <div>
              <h1>My Learning</h1>
              <p className="dash-sub">
                {enrolledCourseList.length} course{enrolledCourseList.length !== 1 ? "s" : ""} in progress
              </p>
            </div>
            <Link to="/" className="btn btn-secondary btn-sm">Browse more</Link>
          </div>
        </div>
      </div>

      <div className="container">

        {/* Summary stats */}
        <div className="dash-stats">
          <div className="dash-stat">
            <span className="dash-stat-num">{enrolledCourseList.length}</span>
            <span className="dash-stat-label">Enrolled</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-num">{totalDone}</span>
            <span className="dash-stat-label">Lessons Done</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-num">{avgPct}%</span>
            <span className="dash-stat-label">Avg Progress</span>
          </div>
        </div>

        {/* Enrolled course list */}
        <div className="enrolled-list">
          {enrolledCourseList.map((course, i) => {
            const progress = getCourseProgress(course.id)
            const next = getContinueLesson(course.id)

            return (
              <div
                key={course.id}
                className="enrolled-card"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Thumbnail */}
                <div className="enrolled-thumb" style={{ background: course.thumbnail }}>
                  <span>{course.thumbnailEmoji}</span>
                </div>

                <div className="enrolled-info">
                  <div className="enrolled-top">
                    <div>
                      <h3 className="enrolled-title">{course.title}</h3>
                      <p className="enrolled-instructor">by {course.instructor}</p>
                    </div>
                    <span className={`tag badge-${course.difficulty.toLowerCase()}`}>
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="enrolled-progress">
                    <div className="progress-meta">
                      <span className="progress-text">
                        {progress.completed} of {progress.total} lessons complete
                      </span>
                      <span className="progress-pct">{progress.percent}%</span>
                    </div>
                    <ProgressBar percent={progress.percent} size="md" />
                  </div>

                  <div className="enrolled-footer">
                    <div className="enrolled-meta">
                      <span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                        </svg>
                        {course.duration}
                      </span>
                      <span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2"/>
                          <line x1="8" y1="21" x2="16" y2="21"/>
                          <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        {course.modules.length} modules
                      </span>
                    </div>
                    <div className="enrolled-actions">
                      <Link to={`/course/${course.id}`} className="btn btn-ghost btn-sm">
                        Course Info
                      </Link>
                      {next && (
                        <Link
                          to={`/course/${course.id}/lesson/${next.moduleId}/${next.lessonId}`}
                          className="btn btn-primary btn-sm"
                        >
                          {/* Label changes based on whether the user has started */}
                          {progress.completed > 0 ? "Continue →" : "Start →"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

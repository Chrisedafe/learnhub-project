import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useCourses } from "../context/CourseContext"
import ProgressBar from "../components/ProgressBar"
import "./CourseDetailPage.css"

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { courses, isEnrolled, enroll, getCourseProgress, getContinueLesson } = useCourses()
  const [openModules, setOpenModules] = useState({ m1: true })

  const course = courses.find(c => c.id === courseId)

  if (!course) return (
    <div className="page-wrapper not-found-inline">
      <div className="container">
        <h2>Course not found</h2>
        <Link to="/" className="btn btn-primary">Back to Browse</Link>
      </div>
    </div>
  )

  const enrolled = isEnrolled(courseId)
  const progress = enrolled ? getCourseProgress(courseId) : null
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0)

  function handleGo() {
    const loc = getContinueLesson(courseId)
    if (loc) navigate(`/course/${courseId}/lesson/${loc.moduleId}/${loc.lessonId}`)
  }

  function toggleModule(id) {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const catClass = `cat-${course.category.toLowerCase().replace(/\s+/g, "-")}`
  const diffClass = `badge-${course.difficulty.toLowerCase()}`

  return (
    <div className="page-wrapper course-detail-page">
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link to="/" className="breadcrumb-link">Browse</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{course.title}</span>
        </div>
      </div>

      <div className="course-hero" style={{ "--thumb-color": course.thumbnail }}>
        <div className="course-hero-bg" />
        <div className="container course-hero-inner">
          <div className="course-hero-content">
            <div className="hero-tags">
              <span className={`tag ${catClass}`}>{course.category}</span>
              <span className={`tag difficulty ${diffClass}`}>{course.difficulty}</span>
            </div>
            <h1 className="course-hero-title">{course.title}</h1>
            <p className="course-hero-desc">{course.description.split("\n\n")[0]}</p>
            <div className="course-hero-meta">
              <span className="meta-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                {course.rating} rating
              </span>
              <span className="meta-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {course.enrolledCount.toLocaleString()} students
              </span>
              <span className="meta-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                {course.duration}
              </span>
              <span className="meta-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                {totalLessons} lessons
              </span>
            </div>
            <p className="course-instructor-line">Taught by <strong>{course.instructor}</strong></p>
          </div>
        </div>
      </div>

      <div className="container course-body">
        <div className="course-main">
          <section className="detail-section">
            <h2 className="detail-section-title">About this course</h2>
            {course.description.split("\n\n").map((para, i) => (
              <p key={i} className="detail-para">{para}</p>
            ))}
          </section>

          <section className="detail-section">
            <h2 className="detail-section-title">Course Curriculum</h2>
            <p className="curriculum-summary">
              {course.modules.length} modules · {totalLessons} lessons · {course.duration} total
            </p>
            <div className="accordion">
              {course.modules.map((mod, mi) => (
                <div key={mod.id} className={`accordion-item ${openModules[mod.id] ? "open" : ""}`}>
                  <button
                    className="accordion-header"
                    onClick={() => toggleModule(mod.id)}
                    aria-expanded={!!openModules[mod.id]}
                  >
                    <div className="accordion-header-left">
                      <span className="module-num">Module {mi + 1}</span>
                      <span className="module-title">{mod.title}</span>
                    </div>
                    <div className="accordion-header-right">
                      <span className="lesson-count">{mod.lessons.length} lessons</span>
                      <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </div>
                  </button>
                  {openModules[mod.id] && (
                    <div className="accordion-body">
                      {mod.lessons.map((lesson, li) => (
                        <div key={lesson.id} className="lesson-row">
                          <div className="lesson-row-left">
                            <span className="lesson-num">{li + 1}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="5,3 19,12 5,21"/>
                            </svg>
                            <span className="lesson-name">{lesson.title}</span>
                          </div>
                          <span className="lesson-dur">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h2 className="detail-section-title">Your Instructor</h2>
            <div className="instructor-card">
              <div className="instructor-avatar">
                {course.instructor.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="instructor-info">
                <h3 className="instructor-name">{course.instructor}</h3>
                <p className="instructor-bio">
                  Practitioner turned instructor. Teaches from experience, not just documentation.
                </p>
                <div className="instructor-stats">
                  <span>⭐ {course.rating} instructor rating</span>
                  <span>👥 {course.enrolledCount.toLocaleString()} students</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="course-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-thumb" style={{ background: course.thumbnail }}>
              <span className="sidebar-thumb-emoji">{course.thumbnailEmoji}</span>
            </div>
            <div className="sidebar-body">
              <div className="sidebar-price-area">
                <span className="sidebar-free">Free</span>
              </div>

              {enrolled ? (
                <>
                  <button className="btn btn-primary btn-lg sidebar-cta" onClick={handleGo}>
                    Continue →
                  </button>
                  <div className="sidebar-progress">
                    <div className="sidebar-progress-header">
                      <span>Your progress</span>
                      <span className="prog-pct">{progress?.percent}%</span>
                    </div>
                    <ProgressBar percent={progress?.percent || 0} size="md" />
                    <span className="prog-sub">{progress?.completed} of {progress?.total} lessons complete</span>
                  </div>
                </>
              ) : (
                <button className="btn btn-primary btn-lg sidebar-cta" onClick={() => enroll(courseId)}>
                  Enroll for free
                </button>
              )}

              <ul className="sidebar-features">
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {totalLessons} lessons · {course.duration}
                </li>
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {course.modules.length} structured modules
                </li>
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  Certificate on completion
                </li>
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  Lifetime access
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

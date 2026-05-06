import { useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useCourses } from "../context/CourseContext"
import "./LessonPage.css"

export default function LessonPage() {
  const { courseId, moduleId, lessonId } = useParams()
  const navigate = useNavigate()
  const { courses, isEnrolled, isLessonComplete, completeLesson, setLastLesson } = useCourses()

  const course = courses.find(c => c.id === courseId)

  // Track resume position whenever the active lesson changes
  useEffect(() => {
    if (course && lessonId) {
      setLastLesson(courseId, lessonId)
    }
    // courseId and setLastLesson included — setLastLesson is stable via useCallback
  }, [courseId, lessonId, setLastLesson])

  // Guard: course not found
  if (!course) return (
    <div className="page-wrapper lesson-page">
      <div className="container">
        <p>Course not found. <Link to="/">Go home</Link></p>
      </div>
    </div>
  )

  // Guard: enrollment check — unenrolled users can't access lesson content
  if (!isEnrolled(courseId)) return (
    <div className="page-wrapper lesson-page">
      <div className="container lesson-gate">
        <div className="gate-content">
          <span className="gate-emoji">🔒</span>
          <h2>You need to enroll first</h2>
          <p>Enroll in the course to access lessons.</p>
          <Link to={`/course/${courseId}`} className="btn btn-primary btn-lg">
            View Course
          </Link>
        </div>
      </div>
    </div>
  )

  // Flatten all lessons across modules, preserving their module reference for navigation
  const allLessons = course.modules.flatMap(mod =>
    mod.lessons.map(l => ({ ...l, moduleId: mod.id, moduleTitle: mod.title }))
  )

  const idx = allLessons.findIndex(l => l.id === lessonId && l.moduleId === moduleId)
  const lesson = allLessons[idx]
  const mod = course.modules.find(m => m.id === moduleId)
  const prev = allLessons[idx - 1] ?? null
  const next = allLessons[idx + 1] ?? null

  // Guard: lesson params don't match course data
  if (!lesson) return (
    <div className="page-wrapper lesson-page">
      <div className="container">
        <p>Lesson not found. <Link to={`/course/${courseId}`}>Back to course</Link></p>
      </div>
    </div>
  )

  const done = isLessonComplete(courseId, lessonId)

  // Mark lesson complete then auto-advance to next lesson
  function markDone() {
    completeLesson(courseId, lessonId)
    if (next) navigate(`/course/${courseId}/lesson/${next.moduleId}/${next.id}`)
  }

  function goTo(l) {
    navigate(`/course/${courseId}/lesson/${l.moduleId}/${l.id}`)
  }

  return (
    <div className="page-wrapper lesson-page">

      {/* Breadcrumb navigation */}
      <div className="lesson-breadcrumb">
        <div className="container lesson-breadcrumb-inner">
          <Link to="/" className="breadcrumb-link">Browse</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/course/${courseId}`} className="breadcrumb-link">{course.title}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-link muted">{mod?.title}</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{lesson.title}</span>
        </div>
      </div>

      <div className="lesson-layout">

        {/* Main lesson content column */}
        <div className="lesson-main">

          {/* Video placeholder — would be replaced with a real video player */}
          <div className="video-player">
            <div className="video-placeholder">
              <div className="video-play-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="none">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </div>
              <div className="video-lesson-label">
                <span className="vl-module">{mod?.title}</span>
                <span className="vl-title">{lesson.title}</span>
              </div>
              <span className="video-duration-badge">{lesson.duration}</span>
            </div>
          </div>

          {/* Lesson header + completion action */}
          <div className="lesson-content-area">
            <div className="lesson-header">
              <div>
                <p className="lesson-module-label">{mod?.title}</p>
                <h1 className="lesson-title">{lesson.title}</h1>
              </div>
              <div className="lesson-header-actions">
                {done ? (
                  <span className="complete-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    Completed
                  </span>
                ) : (
                  <button className="btn btn-primary" onClick={markDone}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    Mark done
                  </button>
                )}
              </div>
            </div>

            {/* Prev / Next navigation */}
            <div className="lesson-nav-bar">
              <button
                className="btn btn-ghost"
                onClick={() => prev && goTo(prev)}
                disabled={!prev}
              >
                ← Previous
              </button>
              <span className="lesson-nav-count">
                Lesson {idx + 1} of {allLessons.length}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => next && goTo(next)}
                disabled={!next}
              >
                Next →
              </button>
            </div>

            <div className="lesson-description">
              <h3>About this lesson</h3>
              <p>
                <strong>{lesson.title}</strong> — part of the <strong>{mod?.title}</strong> module.
                Follow along at your own pace. Duration: <strong>{lesson.duration}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Course content sidebar — mirrors Udemy's lesson outline panel */}
        <aside className="lesson-sidebar">
          <div className="lesson-sidebar-header">
            <h3>Course Content</h3>
            <Link to={`/course/${courseId}`} className="back-to-course">← Overview</Link>
          </div>

          <div className="lesson-sidebar-body">
            {course.modules.map(m => (
              <div key={m.id} className={`sidebar-module ${m.id === moduleId ? "active-module" : ""}`}>
                <div className="sidebar-module-title">{m.title}</div>
                <div className="sidebar-lessons">
                  {m.lessons.map(l => {
                    const isDone = isLessonComplete(courseId, l.id)
                    const isActive = l.id === lessonId && m.id === moduleId
                    return (
                      <button
                        key={l.id}
                        className={`sidebar-lesson ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
                        onClick={() => goTo({ ...l, moduleId: m.id })}
                      >
                        {/* Indicator: checkmark if done, filled dot if current, empty dot otherwise */}
                        <div className="sl-indicator">
                          {isDone ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20,6 9,17 4,12"/>
                            </svg>
                          ) : isActive ? (
                            <div className="sl-dot active-dot" />
                          ) : (
                            <div className="sl-dot" />
                          )}
                        </div>
                        <span className="sl-title">{l.title}</span>
                        <span className="sl-dur">{l.duration}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { courses } from "../data/courses"

const CourseContext = createContext(null)

// Initial state — courses are static data, user state comes from localStorage on mount
const initial = {
  courses,
  enrolledCourses: {},   // { [courseId]: true }
  completedLessons: {},  // { [courseId]: { [lessonId]: true } }
  lastLesson: {},        // { [courseId]: lessonId } — resume position
}

function reducer(state, action) {
  switch (action.type) {
    // Rehydrate user state from localStorage on app mount
    case "HYDRATE":
      return {
        ...state,
        enrolledCourses: action.payload.enrolledCourses || {},
        completedLessons: action.payload.completedLessons || {},
        lastLesson: action.payload.lastLesson || {},
      }

    case "ENROLL":
      return {
        ...state,
        enrolledCourses: { ...state.enrolledCourses, [action.courseId]: true },
      }

    case "COMPLETE_LESSON": {
      const prev = state.completedLessons[action.courseId] || {}
      return {
        ...state,
        completedLessons: {
          ...state.completedLessons,
          [action.courseId]: { ...prev, [action.lessonId]: true },
        },
        // Also update resume position when a lesson is marked done
        lastLesson: { ...state.lastLesson, [action.courseId]: action.lessonId },
      }
    }

    // Track which lesson the user last visited (for "Continue" button)
    case "SET_LAST_LESSON":
      return {
        ...state,
        lastLesson: { ...state.lastLesson, [action.courseId]: action.lessonId },
      }

    default:
      return state
  }
}

export function CourseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)

  // On mount: load persisted user state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("learnhub")
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) })
    } catch {
      // localStorage may be unavailable (private browsing, storage quota) — fail silently
    }
  }, []) // empty deps: run once on mount only

  // Persist user state whenever enrollment, progress, or resume position changes
  useEffect(() => {
    const { enrolledCourses, completedLessons, lastLesson } = state
    try {
      localStorage.setItem("learnhub", JSON.stringify({ enrolledCourses, completedLessons, lastLesson }))
    } catch {
      // Ignore write failures
    }
  }, [state.enrolledCourses, state.completedLessons, state.lastLesson])

  // useCallback keeps these stable across renders so child effects don't re-fire unnecessarily
  const enroll = useCallback((courseId) => {
    dispatch({ type: "ENROLL", courseId })
  }, [])

  const completeLesson = useCallback((courseId, lessonId) => {
    dispatch({ type: "COMPLETE_LESSON", courseId, lessonId })
  }, [])

  const setLastLesson = useCallback((courseId, lessonId) => {
    dispatch({ type: "SET_LAST_LESSON", courseId, lessonId })
  }, [])

  // --- Selector helpers (derived from state, no side effects) ---

  const isEnrolled = useCallback((courseId) => {
    return !!state.enrolledCourses[courseId]
  }, [state.enrolledCourses])

  const isLessonComplete = useCallback((courseId, lessonId) => {
    return !!(state.completedLessons[courseId] || {})[lessonId]
  }, [state.completedLessons])

  // Returns { completed, total, percent } for progress bar display
  const getCourseProgress = useCallback((courseId) => {
    const course = state.courses.find(c => c.id === courseId)
    if (!course) return { completed: 0, total: 0, percent: 0 }

    const allLessons = course.modules.flatMap(m => m.lessons)
    const done = state.completedLessons[courseId] || {}
    const completed = allLessons.filter(l => done[l.id]).length
    const total = allLessons.length

    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }, [state.courses, state.completedLessons])

  // Returns lesson location object for navigation: { courseId, moduleId, lessonId }
  function getFirstLesson(courseId) {
    const course = state.courses.find(c => c.id === courseId)
    if (!course?.modules[0]?.lessons[0]) return null
    const m = course.modules[0]
    return { courseId, moduleId: m.id, lessonId: m.lessons[0].id }
  }

  // Returns last visited lesson, or first lesson if never visited
  const getContinueLesson = useCallback((courseId) => {
    const course = state.courses.find(c => c.id === courseId)
    if (!course) return null

    const lastId = state.lastLesson[courseId]
    if (!lastId) return getFirstLesson(courseId)

    for (const m of course.modules) {
      for (const l of m.lessons) {
        if (l.id === lastId) return { courseId, moduleId: m.id, lessonId: l.id }
      }
    }

    return getFirstLesson(courseId)
  }, [state.courses, state.lastLesson])

  // Derived list — only courses the user has enrolled in
  const enrolledCourseList = state.courses.filter(c => state.enrolledCourses[c.id])

  return (
    <CourseContext.Provider value={{
      courses: state.courses,
      enrolledCourseList,
      enroll,
      completeLesson,
      setLastLesson,
      isEnrolled,
      isLessonComplete,
      getCourseProgress,
      getContinueLesson,
    }}>
      {children}
    </CourseContext.Provider>
  )
}

// Custom hook — throws if used outside CourseProvider (catches wiring mistakes early)
export function useCourses() {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error("useCourses must be used inside <CourseProvider>")
  return ctx
}

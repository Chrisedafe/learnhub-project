import { useState, useMemo } from "react"
import { useCourses } from "../context/CourseContext"
import CourseCard from "../components/CourseCard"
import { categories } from "../data/courses"
import "./HomePage.css"

const sortOpts = [
  { value: "popular", label: "Most Popular" },
  { value: "rated", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
]

export default function HomePage() {
  const { courses } = useCourses()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("popular")

  const filtered = useMemo(() => {
    let list = [...courses]

    if (category !== "All")
      list = list.filter(c => c.category === category)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      if (sort === "popular") return b.popularity - a.popularity
      if (sort === "rated") return b.rating - a.rating
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
      return 0
    })

    return list
  }, [courses, category, search, sort])

  return (
    <div className="page-wrapper home-page">
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">New courses added weekly</span>
            <h1 className="hero-title">
              Learn something
              <br />
              <span className="hero-title-accent">worth knowing</span>
            </h1>
            <p className="hero-sub">
              Courses in design, dev, data, and business. No fluff —
              just stuff that actually helps you get better at what you do.
            </p>
            <div className="hero-search">
              <div className="search-input-wrap">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search courses, topics, or instructors..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input"
                />
                {search && (
                  <button className="search-clear" onClick={() => setSearch("")}>✕</button>
                )}
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-num">180+</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">42k</span>
              <span className="stat-label">Learners</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">4.7★</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      <section className="filter-section">
        <div className="container filter-inner">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sort-wrap">
            <label className="sort-label">Sort by</label>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              {sortOpts.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="courses-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {category === "All" ? "All Courses" : category}
            </h2>
            <span className="result-count">{filtered.length} course{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Nothing came up</h3>
              <p>Try tweaking your search or pick a different category.</p>
              <button
                className="btn btn-secondary"
                onClick={() => { setSearch(""); setCategory("All") }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="course-grid">
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

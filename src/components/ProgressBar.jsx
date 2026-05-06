import "./ProgressBar.css";

/**
 * ProgressBar — reusable progress indicator
 * @param {number} percent - 0 to 100
 * @param {"sm"|"md"|"lg"} size - controls bar height
 * @param {boolean} showLabel - renders the percentage as text
 * @param {object} style - passthrough for layout overrides
 */
export default function ProgressBar({ percent = 0, size = "md", showLabel = false, style }) {
  // Clamp between 0–100 so bad data can't break the layout
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div className={`progress-bar-wrap ${size}`} style={style}>
      <div
        className="progress-bar-fill"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      {showLabel && <span className="progress-bar-label">{clamped}%</span>}
    </div>
  )
}

import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="page-wrapper not-found-page">
      <div className="nf-content">
        <div className="nf-glow" />
        <div className="nf-code">404</div>
        <h1>Page not found</h1>
        <p>This page doesn't exist.</p>
        <div className="nf-actions">
          <Link to="/" className="btn btn-primary btn-lg">
            ← Back to Browse
          </Link>
          <Link to="/dashboard" className="btn btn-ghost btn-lg">
            My Learning
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import SEO from "./SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Not Found"
        description="That page doesn't exist on MDR Tech."
        url="/404"
      />
      <section className="section" style={{ textAlign: "center" }}>
        <h1 className="sectionTitle">404</h1>
        <p className="subtle" style={{ marginBottom: "1.5rem" }}>
          That page isn't here. Could be a typo, could be something I moved.
        </p>
        <p>
          <Link to="/">← Back home</Link>
        </p>
      </section>
    </>
  );
}

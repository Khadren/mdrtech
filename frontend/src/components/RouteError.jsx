import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import SEO from "./SEO";

export default function RouteError() {
  const error = useRouteError();

  // Render a clean 404 when the router signals a missing route.
  if (isRouteErrorResponse(error) && error.status === 404) {
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

  // Generic fallback for unexpected runtime errors.
  const message =
    isRouteErrorResponse(error)
      ? `${error.status} ${error.statusText}`
      : error?.message || "Unknown error";

  return (
    <>
      <SEO
        title="Something broke"
        description="An unexpected error occurred on MDR Tech."
        url="/error"
      />
      <section className="section" style={{ textAlign: "center" }}>
        <h1 className="sectionTitle">Something broke</h1>
        <p className="subtle" style={{ marginBottom: "1rem" }}>
          The page hit an error rendering. The console has more detail.
        </p>
        <p className="subtle" style={{ marginBottom: "1.5rem", fontFamily: "monospace" }}>
          {message}
        </p>
        <p>
          <Link to="/">← Back home</Link>
        </p>
      </section>
    </>
  );
}

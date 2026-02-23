import { useEffect, useState } from "react";

function getVisitorId() {
  const key = "mdrtech_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const visitorId = getVisitorId();

        const r = await fetch("/api/visit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ visitorId }),
        });

        if (!r.ok) {
          throw new Error(`API error ${r.status}`);
        }

        const d = await r.json();

        // Guard against undefined
        if (typeof d.count !== "number") {
          throw new Error("Invalid API response");
        }

        setCount(d.count);
      } catch (e) {
        console.error(e);
        setError("Couldn’t load visitor count.");
      }
    };

    run();
  }, []);

  if (error) {
    return <span className="muted">{error}</span>;
  }

  return (
    <span className="muted">
      {count === null ? "Checking traffic..." : `Total Visitors: ${count}`}
    </span>
  );
}
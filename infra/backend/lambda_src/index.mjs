import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});

const TOPIC_ARN = process.env.VISIT_TOPIC_ARN;

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

// API Gateway v2 lowercases header names. CloudFront stamps these viewer
// headers onto the origin request when the origin request policy forwards
// CloudFront-* headers (Managed-AllViewerAndCloudFrontHeaders-2022-06).
function pickGeo(headers = {}) {
  const country = headers["cloudfront-viewer-country"] || null;
  const countryName = headers["cloudfront-viewer-country-name"] || null;
  const region = headers["cloudfront-viewer-country-region"] || null;
  const regionName = headers["cloudfront-viewer-country-region-name"] || null;
  const city = headers["cloudfront-viewer-city"] || null;
  const timeZone = headers["cloudfront-viewer-time-zone"] || null;

  return { country, countryName, region, regionName, city, timeZone };
}

function formatLocation({ city, regionName, region, countryName, country }) {
  const parts = [
    city,
    regionName || region,
    countryName || country,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "Unknown location";
}

export const handler = async (event) => {
  const method =
    event?.requestContext?.http?.method ||
    event?.requestContext?.httpMethod ||
    "GET";

  // Lightweight liveness response for accidental GETs (browsers, monitors).
  if (method === "GET") {
    return json(200, { ok: true });
  }

  if (method !== "POST") {
    return json(405, { message: "Method Not Allowed" });
  }

  // Best-effort notification. Never block the response on SNS errors.
  try {
    const geo = pickGeo(event?.headers);
    const location = formatLocation(geo);
    const when = new Date().toISOString();

    const subject = `mdrtech.ca visit: ${location}`.slice(0, 100);

    const message = [
      `New visit to mdrtech.ca`,
      ``,
      `Location: ${location}`,
      `Time:     ${when}`,
      ``,
      `(Approximate location derived from CloudFront viewer headers.`,
      ` No IP, no identifiers, no per-visitor records stored.)`,
    ].join("\n");

    if (!TOPIC_ARN) {
      console.warn("VISIT_TOPIC_ARN not set — skipping notification");
    } else {
      await sns.send(
        new PublishCommand({
          TopicArn: TOPIC_ARN,
          Subject: subject,
          Message: message,
        })
      );
    }
  } catch (err) {
    // Visit notifications are best-effort. Log only the error name so the
    // failure mode is observable without leaking any header or message data.
    console.warn("visit-notify publish failed:", err?.name || "unknown");
  }

  return json(200, { ok: true });
};

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  const visitsTable = process.env.VISITS_TABLE;
  const seenTable = process.env.SEEN_TABLE;
  const pk = process.env.COUNTER_KEY || "site";
  const ttlSeconds = Number(process.env.TTL_SECONDS || "86400");

  const method =
    event?.requestContext?.http?.method ||
    event?.requestContext?.httpMethod ||
    "GET";

  if (method === "GET") {
    const resp = await ddb.send(
      new GetCommand({
        TableName: visitsTable,
        Key: { pk },
      })
    );
    const count = resp?.Item?.count ?? 0;
    return json(200, { count });
  }

  if (method === "POST") {
    let visitorId = null;
    try {
      visitorId = event?.body ? JSON.parse(event.body)?.visitorId : null;
    } catch {
      visitorId = null;
    }

    if (!visitorId || typeof visitorId !== "string" || visitorId.length > 200) {
      return json(400, { message: "Missing or invalid visitorId" });
    }

    const now = Math.floor(Date.now() / 1000);
    const seenPk = "VISITOR#" + visitorId;

    let isNew = false;

    try {
      await ddb.send(
        new PutCommand({
          TableName: seenTable,
          Item: {
            pk: seenPk,
            expiresAt: now + ttlSeconds,
          },
          ConditionExpression: "attribute_not_exists(pk)",
        })
      );
      isNew = true;
    } catch (err) {
      if (err?.name !== "ConditionalCheckFailedException") {
        console.error("Seen PutItem failed:", err);
        return json(500, { message: "Server error" });
      }
    }

    if (isNew) {
      const upd = await ddb.send(
        new UpdateCommand({
          TableName: visitsTable,
          Key: { pk },
          UpdateExpression: "SET #c = if_not_exists(#c, :zero) + :one",
          ExpressionAttributeNames: { "#c": "count" },
          ExpressionAttributeValues: { ":one": 1, ":zero": 0 },
          ReturnValues: "UPDATED_NEW",
        })
      );

      const count = upd?.Attributes?.count ?? 0;
      return json(200, { count, unique: true });
    }

    const resp = await ddb.send(
      new GetCommand({
        TableName: visitsTable,
        Key: { pk },
      })
    );
    const count = resp?.Item?.count ?? 0;
    return json(200, { count, unique: false });
  }

  return json(405, { message: "Method Not Allowed" });
};

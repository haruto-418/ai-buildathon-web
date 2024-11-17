import { generateHandoverTablePrompt } from "@/utils/interfaces/generate-handover-table-prompt";
import { NextResponse } from "next/server";

function formatRequestBody(prompt: string) {
  const format = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1,
      maxOutputTokens: 8192,
      topP: 0.95,
      seed: 0,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          Table: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                columnname: { type: "STRING" },
                value: { type: "STRING" },
              },
              required: ["columnname", "value"],
            },
          },
        },
        required: ["Table"],
      },
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" },
    ],
  };

  return format;
}

export async function POST(request: Request) {
  const { PROJECT_ID, LOCATION_ID, API_ENDPOINT, MODEL_ID } = {
    PROJECT_ID: "ai-buildathon-2024-actual",
    LOCATION_ID: "us-central1",
    API_ENDPOINT: "us-central1-aiplatform.googleapis.com",
    MODEL_ID: "gemini-1.5-flash-002",
  };

  const token = await getAccessToken();

  const requestBody = await request.json();
  const { customersJson, document } = requestBody;

  const prompt = generateHandoverTablePrompt({
    customersJson,
    document,
  });

  const formattedRequestBody = formatRequestBody(prompt);

  const apiResponse = await fetch(
    `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/google/models/${MODEL_ID}:streamGenerateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedRequestBody),
    },
  );

  const responseData = await apiResponse.json();

  return NextResponse.json(responseData);
}

async function getAccessToken() {
  const response = await fetch(
    "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
    {
      method: "GET",
      headers: { "Metadata-Flavor": "Google" },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch access token");
  }

  const data = await response.json();
  return data.access_token;
}

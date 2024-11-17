import { GenerateContentResult, VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";

import { outputSchema } from "@/lib/schemas";
import type { Output } from "@/lib/types";
import { generateHandoverTablePrompt } from "@/utils/interfaces/generate-handover-table-prompt";
import { createOutput } from "@/utils/interfaces/outputs/create";

const vertexAi = new VertexAI({
  project: "ai-buildathon-2024-actual",
  location: "us-central1",
  googleAuthOptions: {
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"), // 明示的に渡す
  },
});

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ handoverId: string }> },
) {
  const { handoverId } = await params;

  const model = "gemini-1.5-pro-002";

  // Instantiate the models
  const generativeModel = vertexAi.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HATE_SPEECH" as any,
        threshold: "OFF" as any,
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT" as any,
        threshold: "OFF" as any,
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT" as any,
        threshold: "OFF" as any,
      },
      {
        category: "HARM_CATEGORY_HARASSMENT" as any,
        threshold: "OFF" as any,
      },
    ],
  });

  const requestBody = await request.json();
  const { customersJson, document } = requestBody;

  const prompt = generateHandoverTablePrompt({
    customersJson,
    document,
  });

  const formattedRequestBody = formatRequestBody(prompt);

  const req = {
    ...formattedRequestBody,
  };

  try {
    console.log("Generating content...");
    const response: GenerateContentResult =
      await generativeModel.generateContent(req as any);
    console.log(response);
    const data = response.response.candidates;
    const content = data?.map((part) => part.content);
    const parts = content?.map((part) => part.parts);
    const text = parts?.map((part) => part[0].text);

    if (!text) {
      console.error("Failed to generate content");
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 500 },
      );
    }

    const _output: Partial<Output> = {
      id: "",
      handoverId,
      handoverTableString: text[0],
      createdAt: new Date(),
    };
    const output = outputSchema.parse(_output);
    await createOutput({
      output,
    });

    console.log("Content generated successfully");

    return NextResponse.json({ data: text[0] });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    );
  }
}

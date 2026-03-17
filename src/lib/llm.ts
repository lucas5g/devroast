import { z } from "zod";

const RoastResponseSchema = z.object({
	score: z.number(),
	verdict: z.enum(["excellent", "good", "needs_help", "critical"]),
	roastTitle: z.string(),
	issues: z.array(
		z.object({
			type: z.enum(["error", "warning", "good"]),
			title: z.string(),
			description: z.string(),
		}),
	),
	fix: z.string(),
});

type RoastResponse = z.infer<typeof RoastResponseSchema>;

function extractTextContent(content: unknown): string {
	if (typeof content === "string") {
		return content;
	}

	if (Array.isArray(content)) {
		return content
			.map((item) => {
				if (
					typeof item === "object" &&
					item !== null &&
					"type" in item &&
					item.type === "text" &&
					"text" in item &&
					typeof item.text === "string"
				) {
					return item.text;
				}

				return "";
			})
			.join("\n");
	}

	return "";
}

function sanitizeJsonString(json: string): string {
	let result = "";
	let inString = false;
	let escaping = false;

	for (const char of json) {
		if (escaping) {
			result += char;
			escaping = false;
			continue;
		}

		if (char === "\\") {
			result += char;
			escaping = true;
			continue;
		}

		if (char === '"') {
			result += char;
			inString = !inString;
			continue;
		}

		if (inString) {
			switch (char) {
				case "\n":
					result += "\\n";
					continue;
				case "\r":
					result += "\\r";
					continue;
				case "\t":
					result += "\\t";
					continue;
				default:
					if (char < " ") {
						result += `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
						continue;
					}
			}
		}

		result += char;
	}

	return result;
}

function parseResponseJson(responseText: string): RoastResponse {
	const jsonMatch = responseText.match(/\{[\s\S]*\}/);
	if (!jsonMatch) {
		throw new Error("Invalid LLM response");
	}

	const sanitizedJson = sanitizeJsonString(jsonMatch[0]);
	const parsed = JSON.parse(sanitizedJson);

	return RoastResponseSchema.parse(parsed);
}

function buildPrompt(
	code: string,
	language: string,
	mode: "normal" | "spicy",
): string {
	const tone =
		mode === "spicy"
			? "muito sarcástico, implacável e feroz"
			: "sarcástico mas construtivo";
	const maxScore = mode === "spicy" ? 10 : 5;

	return `
E você é um code reviewer sarcástico e implacável. Seu trabalho é avaliar código e dar um "roast" (crítica humorous mas informativa).

Analise o seguinte código em \`${language}\`:

\`\`\`${language}
${code}
\`\`\`

Seja ${tone}. Dê uma nota de 0 a ${maxScore} e um veredicto.

Retorne APENAS JSON válido com este formato exato:
{
  "score": número,
  "verdict": "excellent" | "good" | "needs_help" | "critical",
  "roastTitle": "título sarcástico do roast",
  "issues": [
    {
      "type": "error" | "warning" | "good",
      "title": "título curto do issue",
      "description": "descrição do problema ou positivo"
    }
  ],
  "fix": "diff unificado mostrando sugestões de melhoria (use + para adicionar, - para remover)"
}

Não incluya nenhum texto além do JSON.
`;
}

export async function generateRoast(
	code: string,
	language: string,
	mode: "normal" | "spicy",
): Promise<RoastResponse> {
	const prompt = buildPrompt(code, language, mode);

	const response = await fetch(
		"https://openrouter.ai/api/v1/chat/completions",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
				"HTTP-Referer": "https://devroast.dev",
				"X-Title": "DevRoast",
			},
			body: JSON.stringify({
				// model: "google/gemma-3-4b-it:free",
				model: "google/gemini-2.5-flash-lite",
				messages: [{ role: "user", content: prompt }],
				response_format: {
					type: "json_schema",
					json_schema: {
						name: "devroast_response",
						strict: true,
						schema: {
							type: "object",
							properties: {
								score: { type: "number" },
								verdict: {
									type: "string",
									enum: ["excellent", "good", "needs_help", "critical"],
								},
								roastTitle: { type: "string" },
								issues: {
									type: "array",
									items: {
										type: "object",
										properties: {
											type: {
												type: "string",
												enum: ["error", "warning", "good"],
											},
											title: { type: "string" },
											description: { type: "string" },
										},
										required: ["type", "title", "description"],
										additionalProperties: false,
									},
								},
								fix: { type: "string" },
							},
							required: ["score", "verdict", "roastTitle", "issues", "fix"],
							additionalProperties: false,
						},
					},
				},
			}),
		},
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenRouter error: ${error}`);
	}

	const data = await response.json();
	const responseText = extractTextContent(data.choices?.[0]?.message?.content);

	return parseResponseJson(responseText);
}

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
				model: 'google/gemini-2.5-flash-lite',
				messages: [{ role: "user", content: prompt }],
			}),
		},
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenRouter error: ${error}`);
	}

	const data = await response.json();
	const responseText = data.choices[0].message.content;

	const jsonMatch = responseText.match(/\{[\s\S]*\}/);
	if (!jsonMatch) {
		throw new Error("Invalid LLM response");
	}

	const parsed = JSON.parse(jsonMatch[0]);
	return RoastResponseSchema.parse(parsed);
}

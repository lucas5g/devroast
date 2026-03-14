"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Metrics } from "@/components/metrics";
import { MetricsSkeleton } from "@/components/metrics-skeleton";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";
import { useTRPC } from "@/trpc/client";

type RoastResult = {
	id: string;
	code: string;
	language: string;
	roastMode: "normal" | "spicy";
	score: number;
	verdict: string;
	roastTitle: string;
	issues: Array<{
		type: string;
		title: string;
		description: string;
	}>;
	fix: string;
};

export function HomeContent() {
	const trpc = useTRPC();
	const [isOverLimit, setIsOverLimit] = useState(false);
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("plaintext");
	const [roastMode, setRoastMode] = useState<"normal" | "spicy">("normal");
	const [result, setResult] = useState<RoastResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const mutationOptions = trpc.createRoast.mutationOptions();
	const createRoastMutation = useMutation(mutationOptions);

	const handleCodeChange = (newCode: string, newLanguage: string) => {
		setCode(newCode);
		setLanguage(newLanguage);
	};

	const handleSubmit = async () => {
		if (!code.trim()) {
			setError("Por favor, insira algum código para analizar.");
			return;
		}

		setError(null);
		setResult(null);

		try {
			const roastResult = await createRoastMutation.mutateAsync({
				code,
				language: language || undefined,
				roastMode,
			});
			router.push(`/roast/${roastResult.id}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao processar");
		}
	};

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 pt-20">
			<div className="flex w-full max-w-[960px] flex-col gap-8">
				<section className="flex flex-col gap-3">
					<div className="flex items-center gap-3">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold text-accent-green">
							&gt;_
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold text-text-primary">
							code review
						</span>
					</div>
					<p className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-text-secondary">
						{`// drop your code below and we'll rate it — brutally honest or full roast mode`}
					</p>
				</section>

				<section>
					<CodeEditor
						onCodeChange={handleCodeChange}
						onLimitChange={setIsOverLimit}
					/>
				</section>

				<section className="flex items-center justify-between">
					<Toggle
						pressed={roastMode === "spicy"}
						onPressedChange={(pressed) =>
							setRoastMode(pressed ? "spicy" : "normal")
						}
					>
						roast mode
					</Toggle>
					<Button
						disabled={
							isOverLimit || createRoastMutation.isPending || !code.trim()
						}
						onClick={handleSubmit}
					>
						{createRoastMutation.isPending
							? "$ processando..."
							: "$ roast_my_code"}
					</Button>
				</section>

				{error && (
					<div className="flex flex-col gap-3 rounded border border-accent-red bg-accent-red/10 p-4">
						<p className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-red">
							{error}
						</p>
						<Button onClick={handleSubmit}>Tentar novamente</Button>
					</div>
				)}

				{result && (
					<RoastResultComponent result={result} submittedCode={code} />
				)}

				<Suspense fallback={<MetricsSkeleton />}>
					<Metrics />
				</Suspense>

				<section className="flex flex-col gap-6 pt-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-green">
								{`//`}
							</span>
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-primary">
								shame_leaderboard
							</span>
						</div>
						<Link
							href="/leaderboard"
							className="flex items-center gap-1 rounded-none border border-border-primary px-3 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-secondary"
						>
							{`$ view_all >>`}
						</Link>
					</div>
					<p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						{`// the worst code on the internet, ranked by shame`}
					</p>
					<div className="flex flex-col border border-border-primary">
						<div className="flex h-10 items-center gap-6 border-b border-border-primary bg-bg-surface px-5">
							<span className="w-10 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
								#
							</span>
							<span className="w-[60px] font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
								score
							</span>
							<span className="flex-1 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
								code
							</span>
							<span className="w-24 text-right font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
								lang
							</span>
						</div>
						<TableRow
							rank={1}
							score={1.2}
							code="var total = 0; for (var i = 0; i < items.length; i++) {"
							language="javascript"
						/>
						<TableRow
							rank={2}
							score={2.8}
							code="function add(a,b) { return a+b; } var result = add(1,"
							language="javascript"
						/>
						<TableRow
							rank={3}
							score={3.1}
							code="const getData = async () => { return await fetch('/api"
							language="typescript"
						/>
					</div>
					<p className="text-center font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						showing top 3 of 2,847 · view full leaderboard &gt;&gt;
					</p>
				</section>
			</div>
		</main>
	);
}

function RoastResultComponent({
	result,
	submittedCode,
}: {
	result: RoastResult;
	submittedCode: string;
}) {
	return (
		<div className="flex flex-col gap-8">
			<div className="h-px w-full bg-border-primary" />

			<section className="flex items-center gap-12">
				<ScoreRing score={result.score} />
				<div className="flex flex-1 flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="h-2 w-2 rounded-full bg-accent-red" />
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-medium text-accent-red">
							verdict: {result.verdict}
						</span>
					</div>
					<p className="font-[family-name:var(--font-ibm-plex-mono)] text-xl leading-relaxed text-text-primary">
						{result.roastTitle}
					</p>
					<div className="flex items-center gap-4">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							lang: {result.language}
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							·
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							{result.roastMode}
						</span>
					</div>
				</div>
			</section>

			<div className="h-px w-full bg-border-primary" />

			<section className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-green">
						{"//"}
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-primary">
						your_submission
					</span>
				</div>
				<SubmittedCodeDisplay code={submittedCode} />
			</section>

			<div className="h-px w-full bg-border-primary" />

			<section className="flex flex-col gap-6">
				<div className="flex items-center gap-2">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-green">
						{"//"}
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-primary">
						detailed_analysis
					</span>
				</div>
				<div className="grid grid-cols-2 gap-5">
					{result.issues.map((issue, i) => (
						<IssueCard key={`${issue.title}-${i}`} issue={issue} />
					))}
				</div>
			</section>

			<div className="h-px w-full bg-border-primary" />

			<section className="flex flex-col gap-6">
				<div className="flex items-center gap-2">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-green">
						{"//"}
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-primary">
						suggested_fix
					</span>
				</div>
				<DiffDisplay diff={result.fix} />
			</section>
		</div>
	);
}

function SubmittedCodeDisplay({ code }: { code: string }) {
	const lines = code.split("\n");

	return (
		<div className="flex h-[300px] overflow-hidden rounded border border-border-primary bg-bg-input">
			<div className="flex flex-col items-end gap-2 border-r border-border-primary bg-bg-surface px-3 py-3">
				{lines.map((_, i) => (
					<span
						key={i}
						className="font-[family-name:var(--font-jetbrains-mono)] text-xs leading-[18px] text-text-tertiary"
					>
						{i + 1}
					</span>
				))}
			</div>
			<pre className="flex-1 overflow-x-auto p-4 font-[family-name:var(--font-jetbrains-mono)] text-xs leading-[18px] text-text-secondary">
				<code>{code}</code>
			</pre>
		</div>
	);
}

function IssueCard({
	issue,
}: {
	issue: { type: string; title: string; description: string };
}) {
	const colors: Record<string, string> = {
		critical: "bg-accent-red text-accent-red",
		warning: "bg-accent-amber text-accent-amber",
		good: "bg-accent-green text-accent-green",
	};

	return (
		<div className="flex flex-col gap-3 rounded border border-border-primary p-5">
			<div className="flex items-center gap-2">
				<span
					className={`h-2 w-2 rounded-full ${
						colors[issue.type]?.split(" ")[0] || "bg-gray-500"
					}`}
				/>
				<span
					className={`font-[family-name:var(--font-jetbrains-mono)] text-xs font-medium ${
						colors[issue.type]?.split(" ")[1] || "text-gray-500"
					}`}
				>
					{issue.type}
				</span>
			</div>
			<h4 className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-medium text-text-primary">
				{issue.title}
			</h4>
			<p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs leading-relaxed text-text-secondary">
				{issue.description}
			</p>
		</div>
	);
}

function DiffDisplay({ diff }: { diff: string }) {
	const lines = diff.split("\n");

	return (
		<div className="flex flex-col rounded border border-border-primary bg-bg-input">
			<div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
				<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-medium text-text-secondary">
					improved_code.ts
				</span>
			</div>
			<div className="flex flex-col">
				{lines.map((line, i) => {
					const isAdd = line.startsWith("+");
					const isRemove = line.startsWith("-");

					let bgClass = "transparent";
					if (isAdd) bgClass = "bg-accent-green/10";
					if (isRemove) bgClass = "bg-accent-red/10";

					return (
						<div
							key={i}
							className={`flex h-7 items-center px-4 font-[family-name:var(--font-jetbrains-mono)] text-xs ${bgClass}`}
						>
							{line.startsWith("+") || line.startsWith("-") ? (
								<>
									<span
										className={`mr-3 font-medium ${
											isAdd ? "text-accent-green" : "text-accent-red"
										}`}
									>
										{isAdd ? "+" : "-"}
									</span>
									<span
										className={
											isAdd
												? "text-accent-green"
												: isRemove
													? "text-accent-red"
													: "text-text-primary"
										}
									>
										{line.slice(1)}
									</span>
								</>
							) : (
								<span className="text-text-tertiary">{line}</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

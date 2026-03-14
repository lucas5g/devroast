import { createCaller } from "@/trpc/server";

export async function generateStaticParams() {
	return [{ id: "550e8400-e29b-41d4-a716-446655440000" }];
}

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Roast Result | DevRoast",
	description: "Your code roast result",
};

const STATIC_ROAST_DATA = {
	id: "550e8400-e29b-41d4-a716-446655440000",
	score: 3.5,
	verdict: "needs_serious_help",
	roastTitle:
		'"this code looks like it was written during a power outage... in 2005."',
	language: "javascript",
	lines: 7,
	code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`,
	issues: [
		{
			type: "critical",
			title: "using var instead of const/let",
			description:
				"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
		},
		{
			type: "warning",
			title: "imperative loop pattern",
			description:
				"for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
		},
		{
			type: "good",
			title: "clear naming conventions",
			description:
				"calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
		},
		{
			type: "good",
			title: "single responsibility",
			description:
				"the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
		},
	],
	fix: `function calculateTotal(items) {
+  return items.reduce((sum, item) => sum + item.price, 0);
-   var total = 0;
-   for (var i = 0; i < items.length; i++) {
-     total = total + items[i].price;
-   }
-   if (total > 100) {
-     console.log("discount applied");
-     total = total * 0.9;
-   }
-   return total;
}`,
};

export default async function RoastResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const caller = await createCaller();
	const roast = await caller.getRoast({ id });
	const data = roast || STATIC_ROAST_DATA;

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page">
			<div className="flex w-full max-w-[960px] flex-col gap-10 px-10 py-12">
				{/* Score Hero */}
				<section className="flex items-center gap-12">
					{/* Score Ring */}
					<div className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full border-4 border-border-primary">
						<div className="absolute inset-0 rounded-full border-4 border-transparent bg-[conic-gradient(from_0deg,#EF4444_0%,#F59E0B_35%,#10B981_35%,#10B981_100%)] opacity-50" />
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-[48px] font-bold text-accent-amber">
							{data.score}
						</span>
						<span className="absolute bottom-8 font-[family-name:var(--font-jetbrains-mono)] text-sm text-text-tertiary">
							/10
						</span>
					</div>

					{/* Roast Summary */}
					<div className="flex flex-1 flex-col gap-4">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-accent-red" />
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-medium text-accent-red">
								verdict: {data.verdict}
							</span>
						</div>
						<p className="font-[family-name:var(--font-ibm-plex-mono)] text-xl leading-relaxed text-text-primary">
							{data.roastTitle}
						</p>
						<div className="flex items-center gap-4">
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
								lang: {data.language}
							</span>
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
								·
							</span>
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
								{data.lines} lines
							</span>
						</div>
						<div className="flex items-center gap-3 pt-2">
							<button
								type="button"
								className="flex items-center gap-1.5 rounded border border-border-primary px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-primary transition-colors hover:bg-bg-hover"
							>
								share_roast
							</button>
						</div>
					</div>
				</section>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Submitted Code */}
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-primary">
							your_submission
						</span>
					</div>

					<div className="flex h-[300px] overflow-hidden rounded border border-border-primary bg-bg-input">
						<CodeBlock code={data.code} />
					</div>
				</section>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Detailed Analysis */}
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
						{data.issues.map((issue) => (
							<IssueCard key={issue.title} issue={issue} />
						))}
					</div>
				</section>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Suggested Fix */}
				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-primary">
							suggested_fix
						</span>
					</div>

					<div className="flex flex-col rounded border border-border-primary bg-bg-input">
						<div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-medium text-text-secondary">
								your_code.ts → improved_code.ts
							</span>
						</div>
						<DiffBlock code={data.fix} />
					</div>
				</section>
			</div>
		</main>
	);
}

function CodeBlock({ code }: { code: string }) {
	const lines = code.split("\n");

	return (
		<>
			<div className="flex flex-col items-end gap-2 border-r border-border-primary bg-bg-surface px-3 py-3">
				{lines.map((_, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: line numbers are stable
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
		</>
	);
}

function IssueCard({
	issue,
}: {
	issue: (typeof STATIC_ROAST_DATA.issues)[number];
}) {
	const colors = {
		critical: "bg-accent-red text-accent-red",
		warning: "bg-accent-amber text-accent-amber",
		good: "bg-accent-green text-accent-green",
	};

	return (
		<div className="flex flex-col gap-3 rounded border border-border-primary p-5">
			<div className="flex items-center gap-2">
				<span
					className={`h-2 w-2 rounded-full ${colors[issue.type as keyof typeof colors].split(" ")[0]}`}
				/>
				<span
					className={`font-[family-name:var(--font-jetbrains-mono)] text-xs font-medium ${colors[issue.type as keyof typeof colors].split(" ")[1]}`}
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

function DiffBlock({ code }: { code: string }) {
	const lines = code.split("\n");

	return (
		<div className="flex flex-col">
			{lines.map((line, i) => {
				const isAdd = line.startsWith("+");
				const isRemove = line.startsWith("-");
				const isContext = !isAdd && !isRemove;

				let bgClass = "transparent";
				if (isAdd) bgClass = "bg-accent-green/10";
				if (isRemove) bgClass = "bg-accent-red/10";

				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: diff lines are stable
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
	);
}

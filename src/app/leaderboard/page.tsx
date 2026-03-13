import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";

const STATIC_LEADERBOARD = [
	{
		rank: 1,
		score: 1.2,
		language: "javascript",
		code: `var total = 0;
for (var i = 0; i < items.length; i++) {
  total += items[i].price * items[i].qty;
}`,
		date: "2024-01-15",
		submissions: 42,
	},
	{
		rank: 2,
		score: 2.1,
		language: "python",
		code: `def process():
    data = get_data()
    for i in range(len(data)):
        if data[i] > 10:
            print(data[i])
    return True`,
		date: "2024-01-14",
		submissions: 38,
	},
	{
		rank: 3,
		score: 2.8,
		language: "typescript",
		code: `const add = (a,b) => {
return a+b;
}
const result = add(1, "2")`,
		date: "2024-01-13",
		submissions: 35,
	},
	{
		rank: 4,
		score: 3.1,
		language: "javascript",
		code: `function getData() {
  return fetch('/api')
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
}`,
		date: "2024-01-12",
		submissions: 31,
	},
	{
		rank: 5,
		score: 3.5,
		language: "java",
		code: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,
		date: "2024-01-11",
		submissions: 28,
	},
];

export const metadata = {
	title: "Shame Leaderboard | DevRoast",
	description: "The most roasted code on the internet",
};

export default function LeaderboardPage() {
	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page">
			<div className="flex w-full max-w-[960px] flex-col gap-10 px-10 py-12">
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-[32px] font-bold text-accent-green">
							{">"}_
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-[28px] font-bold text-text-primary">
							shame_leaderboard
						</span>
					</div>
					<p className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-text-secondary">
						{"// the most roasted code on the internet"}
					</p>
					<div className="flex items-center gap-2">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							2,847 submissions
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							·
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							avg score: 4.2/10
						</span>
					</div>
				</section>

				<section className="flex flex-col gap-5">
					{STATIC_LEADERBOARD.map((entry) => (
						<LeaderboardEntry key={entry.rank} entry={entry} />
					))}
				</section>
			</div>
		</main>
	);
}

function LeaderboardEntry({
	entry,
}: {
	entry: (typeof STATIC_LEADERBOARD)[number];
}) {
	const lines = entry.code.split("\n");

	return (
		<div className="flex flex-col rounded border border-border-primary">
			<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
				<div className="flex items-center gap-4">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-tertiary">
						#{entry.rank}
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						/
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-red">
						{entry.score.toFixed(1)}/10
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-secondary uppercase">
						{entry.language}
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						{entry.date}
					</span>
				</div>
			</div>
			<div className="flex h-[120px] overflow-hidden bg-bg-input">
				<div className="flex flex-col items-end gap-[6px] border-r border-border-primary bg-bg-surface px-[10px] py-3 pr-3">
					{/* biome-ignore lint/suspicious/noArrayIndexKey: line numbers are stable */}
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
					<code>{entry.code}</code>
				</pre>
			</div>
		</div>
	);
}

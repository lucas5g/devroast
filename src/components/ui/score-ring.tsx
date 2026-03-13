import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
	score: number;
	maxScore?: number;
}

function calculateStrokeDasharray(
	score: number,
	maxScore: number,
	circumference: number,
) {
	const progress = score / maxScore;
	const offset = circumference - progress * circumference;
	return `${circumference - offset} ${offset}`;
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
	({ className, score, maxScore = 10, ...props }, ref) => {
		const size = 180;
		const radius = (size - 8) / 2;
		const circumference = 2 * Math.PI * radius;
		const percentage = score / maxScore;
		const strokeDasharray = calculateStrokeDasharray(
			score,
			maxScore,
			circumference,
		);

		return (
			<div
				className={twMerge(
					"relative inline-flex items-center justify-center",
					className,
				)}
				ref={ref}
				style={{ width: size, height: size }}
				{...props}
			>
				<svg className="absolute -rotate-90" width={size} height={size}>
					<title>
						Score ring showing {score} out of {maxScore}
					</title>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="currentColor"
						strokeWidth={4}
						className="text-border-primary"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						strokeWidth={4}
						strokeDasharray={strokeDasharray}
						strokeLinecap="round"
						stroke="url(#scoreGradient)"
					/>
					<defs>
						<linearGradient
							id="scoreGradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop offset="0%" stopColor="var(--color-accent-green)" />
							<stop
								offset={percentage < 0.35 ? "100%" : "35%"}
								stopColor="var(--color-accent-amber)"
							/>
							{percentage >= 0.35 && (
								<stop offset="100%" stopColor="var(--color-accent-green)" />
							)}
						</linearGradient>
					</defs>
				</svg>
				<div className="flex flex-col items-center justify-center">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-5xl font-bold text-text-primary leading-none">
						{score}
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-text-secondary leading-none">
						/{maxScore}
					</span>
				</div>
			</div>
		);
	},
);

ScoreRing.displayName = "ScoreRing";

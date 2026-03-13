import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

export default function ComponentsPage() {
	return (
		<div className="container mx-auto py-12 space-y-12">
			<h1 className="text-3xl font-bold">UI Components</h1>

			<section>
				<h2 className="text-xl font-semibold mb-4">Toggle</h2>
				<div className="flex flex-wrap gap-4">
					<Toggle>roast mode</Toggle>
					<Toggle pressed>roast mode</Toggle>
				</div>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-4">Badge</h2>
				<div className="flex flex-wrap gap-4">
					<Badge variant="critical">critical</Badge>
					<Badge variant="warning">warning</Badge>
					<Badge variant="good">good</Badge>
					<Badge variant="verdict">needs_serious_help</Badge>
				</div>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-4">Card</h2>
				<Card className="w-[480px]">
					<CardHeader>
						<Badge variant="critical">critical</Badge>
					</CardHeader>
					<CardTitle>using var instead of const/let</CardTitle>
					<CardDescription>
						the var keyword is function-scoped rather than block-scoped, which
						can lead to unexpected behavior and bugs. modern javascript uses
						const for immutable bindings and let for mutable ones.
					</CardDescription>
				</Card>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-4">CodeBlock</h2>
				<CodeBlock
					code={`function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`}
					language="javascript"
					filename="calculate.js"
				/>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-4">DiffLine</h2>
				<div className="border border-gray-300">
					<DiffLine type="removed" prefix="-" code="var total = 0;" />
					<DiffLine type="added" prefix="+" code="const total = 0;" />
					<DiffLine
						type="context"
						prefix=" "
						code="for (let i = 0; i < items.length; i++) {"
					/>
				</div>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-4">TableRow</h2>
				<div className="border border-gray-300 w-full">
					<TableRow
						rank={1}
						score={2.1}
						code="function calculateTotal(items) { var total = 0; ..."
						language="javascript"
					/>
					<TableRow
						rank={2}
						score={5.8}
						code="const calculateTotal = (items) => {"
						language="typescript"
					/>
					<TableRow
						rank={3}
						score={8.2}
						code="function add(a: number, b: number): number {"
						language="typescript"
					/>
				</div>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-4">ScoreRing</h2>
				<div className="flex flex-wrap gap-8">
					<ScoreRing score={3.5} />
					<ScoreRing score={7.2} />
					<ScoreRing score={9.8} />
				</div>
			</section>
		</div>
	);
}

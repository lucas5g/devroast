import { faker } from "@faker-js/faker";
import { db } from "./index";
import {
	codeSubmissions,
	leaderboardEntries,
	roastModeEnum,
	roasts,
	users,
} from "./schema";

const roastMessages = {
	normal: [
		"Este código é tão ruim que até o compilador está chorando.",
		"Eu já vi melhores algoritmos em desenhinhos de criança.",
		"Esse código passa nos testes? Provavelmente não passa nem no olhar.",
		"Parabéns, você reinventou a roda quadrada.",
		"Isso funciona? Talvez. Mas a manutenção vai ser um pesadelo.",
		"Por favor, nunca mostre isso em uma entrevista de emprego.",
		"Você sabia que functions existem? Parece que não.",
		"Esse código tem mais bugs que um software de gestão pública.",
		"Nome de variável: 'x'. Muito criativo. Não.",
		"Por que usar três linhas quando você pode usar trinta?",
		"Esse loop infinito vai dar problemas em produção.",
		"Copiou do Stack Overflow sem entender? Parece que sim.",
		"A complexidade ciclomática desse código é absurda.",
		"Você já ouviu falar em DRY? Não, pelo visto não.",
		"Esse commit deveria ter sido dividido em dez.",
	],
	spicy: [
		"Esse código é uma agressão ao bom senso.",
		"Quem escreveu isso precisa de uma intervenção.",
		"Isso é pior que código escrito de olhos fechados.",
		"Jamais mostre isso à sua mãe, ela vai ficar desapontada.",
		"O pessoal do IT Crowd não acredita que isso existe.",
		"Esse código tem mais smell que um peixe na praia.",
		"Você está de brincadeira, certo? CERTO?",
		"Eu preciso de terapia depois de ver isso.",
		"Esse código é prova de que existem Maldições de TI.",
		"ISSO NÃO É UM CÓDIGO, É UM CRIME CONTRA A PROGRAMAÇÃO.",
		"Quando você escreveu isso, o demo do Java ainda estava em beta.",
		"Pior que isso só o código do sistema da Receita Federal.",
		"Você tem mysophobia? Porque esse código está bem limpinho de boas práticas.",
		"Esse 'engenheiro' de software deveria voltar a ser pedreiro.",
		"Detalhe: o comentário diz 'funciona', mas não funciona.",
	],
};

const codeSamples: Record<string, string[]> = {
	javascript: [
		"var total = 0; for (var i = 0; i < items.length; i++) { total += items[i].price; }",
		"function add(a,b) { return a+b; } var result = add(1, '2');",
		"const x = []; if (x == false) { console.log('empty'); }",
		"for (let i = 0; i < 10; i++) { setTimeout(() => console.log(i), 0); }",
		"const data = JSON.parse(JSON.stringify(obj));",
		"function doStuff() { var a = 1; return a + b; }",
		"arr.forEach((item) => { arr.push(item * 2); });",
		"const isValid = !!value;",
		"try { } catch (e) { console.log(e); }",
		"function x(a,b,c,d,e,f,g,h,i) { return a+b+c+d+e+f+g+h+i; }",
	],
	typescript: [
		"const getData = async () => { return await fetch('/api/data').then(r => r.json()); }",
		"interface User { name: string; age: number; } const user: any = {};",
		"type Foo = { a: string } & { b: number };",
		"function process<T extends object>(item: T): T { return item; }",
		"const ids: number[] = items.map(i => i.id as number);",
		"class Controller { public name: string; private data: any; }",
		"const fn = (x: string | number): string => x.toString();",
		"interface Config { [key: string]: any; }",
		"function foo(args: { a: string, b?: number }) { return args.a; }",
		"type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };",
	],
	python: [
		"def add(a,b): return a+b",
		"for i in range(len(items)): print(items[i])",
		"data = {} if data is None else data",
		"class Foo: pass",
		"import * as utils from 'utils'",
		"def process(x, y, z, a, b, c): return x + y + z + a + b + c",
		"result = [i for i in range(10) if i % 2 == 0 if i > 0]",
		"try: pass except: pass",
		"x = lambda x: x + 1; print(x)",
		"from os import *",
	],
	rust: [
		'fn main() { let x = 1; let y = &x; println!("{}", y); }',
		"fn add(a: i32, b: i32) -> i32 { return a + b; }",
		"let mut data = Vec::new(); for i in 0..10 { data.push(i); }",
		"struct User { name: String, age: u32, }",
		"fn process<T>(item: T) -> T { item }",
		"let x = Some(5); match x { Some(v) => v, None => 0 };",
		"fn foo(v: Vec<i32>) -> &i32 { &v[0] }",
		"pub fn add(a: i32, b: i32) -> i32 { a + b }",
		"impl Clone for Data { fn clone(&self) -> Self { todo!() } }",
		"fn main() { let s = String::new(); }",
	],
	go: [
		"func add(a, b int) int { return a + b }",
		"func process(items []string) { for i, _ := range items { fmt.Println(i) } }",
		"type User struct { Name string Age int }",
		"var data map[string]interface{} = make(map[string]interface{})",
		"func foo(args ...int) int { sum := 0; for _, v := range args { sum += v }; return sum }",
		"if err != nil { return err }",
		"defer func() { recover() }()",
		"go func() { ch <- result }()",
		"const ONE = 1; const TWO = 2;",
		"var wg sync.WaitGroup",
	],
};

const languages = ["javascript", "typescript", "python", "rust", "go"];

function getRandomElement<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)] as T;
}

async function seed() {
	console.log("🌱 Starting seed...");

	console.log("Creating users...");
	const createdUsers = await db
		.insert(users)
		.values(
			Array.from({ length: 20 }, () => ({
				username: faker.internet.username().replace(/[^a-zA-Z0-9_]/g, "_"),
				email: faker.internet.email(),
				passwordHash: faker.string.alphanumeric(60),
			})),
		)
		.returning({ id: users.id });

	console.log(`Created ${createdUsers.length} users`);

	console.log("Creating code submissions...");
	const submissions = await db
		.insert(codeSubmissions)
		.values(
			createdUsers.flatMap((user) =>
				Array.from({ length: 5 }, () => {
					const language = getRandomElement(languages);
					return {
						userId: user.id,
						code: getRandomElement(codeSamples[language]),
						language,
						isAnonymous: Math.random() > 0.7,
					};
				}),
			),
		)
		.returning({
			id: codeSubmissions.id,
			language: codeSubmissions.language,
			code: codeSubmissions.code,
		});

	console.log(`Created ${submissions.length} code submissions`);

	console.log("Creating roasts...");
	const roastData = submissions.map((sub) => {
		const mode = Math.random() > 0.5 ? "normal" : "spicy";
		return {
			submissionId: sub.id,
			score: (Math.random() * 10).toFixed(1),
			roastText: getRandomElement(roastMessages[mode]),
			roastMode: mode as "normal" | "spicy",
		};
	});
	await db.insert(roasts).values(roastData);

	console.log(`Created ${submissions.length} roasts`);

	console.log("Creating leaderboard entries...");
	const shuffledSubmissions = [...submissions].sort(() => Math.random() - 0.5);
	const topSubmissions = shuffledSubmissions.slice(0, 100);

	const leaderboardData = topSubmissions.map((sub, idx) => ({
		submissionId: sub.id,
		rank: idx + 1,
		score: Math.min(10 - idx * 0.3 + Math.random(), 10).toFixed(1),
		language: sub.language,
		codePreview: sub.code.slice(0, 100),
	}));
	await db.insert(leaderboardEntries).values(leaderboardData);

	console.log(`Created ${topSubmissions.length} leaderboard entries`);

	console.log("✅ Seed completed!");
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error("Seed failed:", err);
		process.exit(1);
	});

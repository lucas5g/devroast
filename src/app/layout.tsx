import { JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${jetbrainsMono.variable} bg-bg-page min-h-screen text-text-primary`}
			>
				<TRPCReactProvider>
					<Navbar />
					{children}
				</TRPCReactProvider>
			</body>
		</html>
	);
}

import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "DiscountH",
	description: "DiscountH",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`dark ${geist.variable}`}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

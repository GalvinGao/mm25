import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "初音ミク「マジカルミライ 2025」楽曲コンテスト 非公式楽曲ライブラリー",
	description:
		"初音ミク「マジカルミライ 2025」楽曲コンテストの非公式楽曲ライブラリーです。",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" className="h-full">
			<body className="h-full bg-gray-50 min-h-full">{children}</body>
		</html>
	);
}

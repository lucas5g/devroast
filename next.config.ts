import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverComponentsExternalPackages: [
			"@takumi-rs/image-response",
			"@takumi-rs/core",
		],
	},
};

export default nextConfig;

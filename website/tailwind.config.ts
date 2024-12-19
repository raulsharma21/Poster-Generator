import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				'smoky_black': { DEFAULT: '#191308', 100: '#050401', 200: '#090703', 300: '#0e0b04', 400: '#130e06', 500: '#191308', 600: '#60491e', 700: '#a98135', 800: '#d1ae6d', 900: '#e8d7b6' }, 
				'van_dyke': { DEFAULT: '#322a26', 100: '#0a0807', 200: '#14110f', 300: '#1e1916', 400: '#28211e', 500: '#322a26', 600: '#62524a', 700: '#927a6e', 800: '#b6a69e', 900: '#dbd3cf' }, 
				'taupe_gray': { DEFAULT: '#988d93', 100: '#1f1c1d', 200: '#3d373a', 300: '#5c5358', 400: '#7a6e75', 500: '#988d93', 600: '#aca3a8', 700: '#c0babe', 800: '#d5d1d3', 900: '#eae8e9' }, 
				'alabaster': { DEFAULT: '#dfdfd5', 100: '#313125', 200: '#63634b', 300: '#949471', 400: '#b9b9a2', 500: '#dfdfd5', 600: '#e5e5dc', 700: '#ebebe5', 800: '#f2f2ee', 900: '#f8f8f6' }, 
				'pumpkin': { DEFAULT: '#f5853f', 100: '#3a1803', 200: '#743006', 300: '#ae4909', 400: '#e9610c', 500: '#f5853f', 600: '#f79c64', 700: '#f9b58b', 800: '#fbceb1', 900: '#fde6d8' },
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;

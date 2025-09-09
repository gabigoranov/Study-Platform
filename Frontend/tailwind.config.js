/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		boxShadow: {
  			black25: '0 4px 6px rgba(0, 0, 0, 0.5)'
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				light: '#3B82F6',
  				dark: '#1E40AF',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				light: '#FBBF24',
  				dark: '#B45309',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			tertiary: {
  				DEFAULT: '#10B981',
  				light: '#34D399',
  				dark: '#047857'
  			},
  			neutral: {
  				'50': '#F9FAFB',
  				'100': '#F3F4F6',
  				'200': '#E5E7EB',
  				'300': '#D1D5DB',
  				'400': '#9CA3AF',
  				'500': '#6B7280',
  				'600': '#4B5563',
  				'700': '#374151',
  				'800': '#1F2937',
  				'900': '#111827'
  			},
  			background: "var(--background)",
			"background-dark": "var(--background-dark)", // optional if you want separate
			foreground: "var(--foreground)",
			"foreground-dark": "var(--foreground-dark)",
			surface: "var(--surface)",
			"surface-dark": "var(--surface-dark)",
  			success: {
  				DEFAULT: '#16A34A',
  				light: '#4ADE80',
  				dark: '#166534'
  			},
  			warning: {
  				DEFAULT: '#FBBF24',
  				light: '#FCD34D',
  				dark: '#B45309'
  			},
  			error: {
  				DEFAULT: '#DC2626',
  				light: '#EF4444',
  				dark: '#991B1B'
  			},
  			info: {
  				DEFAULT: '#3B82F6',
  				light: '#60A5FA',
  				dark: '#1D4ED8'
  			},
  			text: {
  				light: '#F9FAFB',
  				DEFAULT: '#111827',
  				muted: '#6B7280',
  				inverted: '#FFFFFF'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
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
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  "plugins": ["prettier-plugin-tailwindcss"],
    plugins: [require("tailwindcss-animate")]
}


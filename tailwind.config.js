/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,tsx}",
    "./src/**/*.{js,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/app/*.{js,jsx,ts,tsx}",
    './app/**/*.{js,jsx,ts,tsx}',  // Covers all Expo Router routes (e.g., main.tsx, login.tsx)
    './components/**/*.{js,jsx,ts,tsx}',  // Covers reusable components
    './src/**/*.{js,jsx,ts,tsx}',  // If you have a src/ folder
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  safelist: [
    // Posições
    "bottom-6",
    "bottom-4",
    "bottom-8",
    "left-6",
    "left-4",
    "left-8",
    "right-6",
    "right-4",
    "right-8",
    "absolute",
    "relative",

    // Espaçamentos (padding, margin)
    "p-2",
    "p-4",
    "p-6",
    "px-2",
    "px-4",
    "py-2",
    "py-3",
    "mb-1",
    "mb-4",
    "mb-20",
    "mt-auto",

    // Bordas
    "border-2",
    "border-none",
    "border-white",
    "border-gray-600",
    "border-gray-700",
    "rounded",
    "rounded-lg",

    // Cores de fundo
    "bg-yellow-500",
    "bg-transparent",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-900",
    "bg-gray-700",
    "bg-neutral-800",
    "bg-neutral-900",

    // Cores de texto
    "text-white",
    "text-black",
    "text-gray-300",
    "text-xs",
    "text-xl",
    "font-bold",
    "font-semibold",
    "text-center",

    // Flexbox
    "flex",
    "flex-1",
    "flex-row",
    "flex-wrap",
    "items-center",
    "justify-center",
    "justify-between",

    // Outros
    "hidden",
    "max-w-md",
    "h-full",
    "h-20",
    "w-full",
    "w-16",
    "mx-4",
    "mb-6",
    "mb-2",
  ],

  theme: {
    extend: {},
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 배경색: 차가운 남색 대신 따뜻한 보라빛 밤하늘색
        cosmic: {
          900: "#2D243F", // Deep Mauve (메인 배경)
          800: "#4A3B5C", // Lighter Mauve (박스 배경)
          700: "#6D5A85", 
        },
        // 포인트: 촌스러운 빨강 -> 벚꽃 핑크
        accent: "#FF9EAA", 
        // 별빛: 쨍한 노랑 -> 부드러운 샴페인 골드
        starlight: "#FFE082", 
        // 텍스트: 차가운 흰색 -> 따뜻한 크림색
        cream: "#FFF9F0",
      },
    },
  },
  plugins: [],
};
export default config;
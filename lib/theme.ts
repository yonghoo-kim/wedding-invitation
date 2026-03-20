// app/lib/theme.ts

// 🌟 계절별 테마 색상 정의
export const themeColors = {
  spring: {
    primary: 'bg-rose-400 border-rose-400 hover:bg-rose-500',
    text: 'text-rose-500',
    textMuted: 'text-rose-400/80',
    icon: 'text-rose-400',
  },
  summer: {
    primary: 'bg-emerald-600 border-emerald-600 hover:bg-emerald-700',
    text: 'text-emerald-700',
    textMuted: 'text-emerald-600/80',
    icon: 'text-emerald-600',
  },
  autumn: {
    primary: 'bg-amber-800 border-amber-800 hover:bg-amber-900',
    text: 'text-amber-800',
    textMuted: 'text-amber-700/80',
    icon: 'text-amber-700',
  },
  winter: {
    primary: 'bg-slate-700 border-slate-700 hover:bg-slate-800',
    text: 'text-slate-700',
    textMuted: 'text-slate-600/80',
    icon: 'text-slate-600',
  }
};

// 🌟 Props에서 사용할 타입도 같이 빼두면 아주 편리합니다!
export type SeasonTheme = keyof typeof themeColors; // 'spring' | 'summer' | 'autumn' | 'winter'
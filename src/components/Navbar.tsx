import React from 'react';
import { StepId } from '../types';
import { ChefHat, Sparkles, Tv, Settings, RotateCcw, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentStep: StepId;
  onNavigate: (step: StepId) => void;
  onOpenClassroomBoard: () => void;
  onOpenTeacherAdmin: () => void;
  onResetTeam: () => void;
  teamName: string;
  hasDrawnCards: boolean;
}

const STEPS: { id: StepId; label: string; number: string; icon: string }[] = [
  { id: 'cards', label: '냉장고 & 카드', number: '①', icon: '🧊' },
  { id: 'recipe', label: '레시피 개발', number: '②', icon: '📝' },
  { id: 'additives', label: '첨가물 탐정', number: '③', icon: '🔍' },
  { id: 'final-menu', label: '메뉴 완성', number: '④', icon: '🍽️' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onNavigate,
  onOpenClassroomBoard,
  onOpenTeacherAdmin,
  onResetTeam,
  teamName,
  hasDrawnCards,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur border-b border-[#e8dfd3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subject Tag */}
          <div 
            onClick={() => onNavigate('start')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  중학 기술·가정
                </span>
                <span className="text-xs text-stone-500 font-medium">가족의 식사 조리</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-stone-900 tracking-tight flex items-center gap-1.5">
                <span>오늘 뭐 해먹지?</span>
                <span className="text-stone-400 font-normal">|</span>
                <span className="text-rose-600 text-sm sm:text-base font-bold">조리법 레시피 연구소</span>
              </h1>
            </div>
          </div>

          {/* Center Info / Team Badge */}
          {teamName && (
            <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>연구 중:</span>
              <span className="text-rose-600 font-bold">{teamName}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenClassroomBoard}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              title="전체 모둠 메뉴판 (전자칠판 화면)"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">전체 모둠 메뉴판</span>
              <span className="sm:hidden">전체</span>
            </button>

            <button
              onClick={onOpenTeacherAdmin}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              title="교사용 관리 화면"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">교사용 관리</span>
            </button>

            <button
              onClick={onResetTeam}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              title="새 모둠으로 다시 시작"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Learning Flow Progress Stepper */}
        {currentStep !== 'start' && (
          <div className="py-2.5 border-t border-[#f0e9df] overflow-x-auto no-scrollbar">
            <nav className="flex items-center justify-between min-w-[580px] sm:min-w-0">
              {STEPS.map((s, idx) => {
                const isActive = currentStep === s.id;
                const isPassed =
                  (currentStep === 'recipe' && idx === 0) ||
                  (currentStep === 'additives' && idx <= 1) ||
                  (currentStep === 'final-menu' && idx <= 2);

                return (
                  <React.Fragment key={s.id}>
                    <button
                      onClick={() => {
                        // Allow navigating if cards are drawn
                        if (hasDrawnCards || idx === 0) {
                          onNavigate(s.id);
                        }
                      }}
                      disabled={!hasDrawnCards && idx > 0}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105'
                          : isPassed
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'text-stone-400 bg-stone-100 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span>{s.number}</span>
                      <span>{s.label}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />}
                    </button>

                    {idx < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                          isPassed ? 'bg-amber-300' : 'bg-stone-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

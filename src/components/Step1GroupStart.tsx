import React, { useState } from 'react';
import { ChefHat, Flame, BookOpen, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Utensils } from 'lucide-react';
import { COOKING_METHODS } from '../data/cookingMethods';

interface Step1Props {
  initialTeamName: string;
  initialMembers: string;
  onStart: (teamName: string, members: string) => void;
  onOpenClassroomBoard: () => void;
}

export const Step1GroupStart: React.FC<Step1Props> = ({
  initialTeamName,
  initialMembers,
  onStart,
  onOpenClassroomBoard,
}) => {
  const [teamName, setTeamName] = useState(initialTeamName || '');
  const [members, setMembers] = useState(initialMembers || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setErrorMsg('모둠 이름을 입력해 주세요! (예: 1모둠, 골든 셰프팀)');
      return;
    }
    setErrorMsg('');
    onStart(teamName.trim(), members.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Welcome Banner */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold shadow-xs mb-4">
          <BookOpen className="w-4 h-4 text-rose-600" />
          <span>중학교 기술·가정 [가족의 식사 조리] 단원 연계</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl sm:text-6xl animate-bounce">🍳</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight">
            오늘 뭐 해먹지?
          </h1>
        </div>

        <p className="text-xl sm:text-2xl font-extrabold text-rose-600 tracking-wide mb-3">
          조리법 레시피 연구소
        </p>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
          우리가 요리 연구원이 되어, 랜덤으로 주어지는 <strong className="text-stone-900 underline decoration-amber-400">재료 + 조리법 + 요리 미션</strong>으로
          세상에 없던 창의적인 신메뉴를 개발하고 AI 음식 사진으로 시각화해 봅시다!
        </p>
      </div>

      {/* Start Form Card */}
      <div className="mt-8 max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#e6ddd1] shadow-xl shadow-stone-200/50 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />

        <form onSubmit={handleStartSubmit} className="space-y-5 relative">
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-1.5">
              1. 우리 모둠 이름 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="예: 1모둠 (맛있는 과학반), 꼬마 셰프단"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none text-base font-semibold text-stone-900 transition-all placeholder:text-stone-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-900 mb-1.5">
              2. 모둠원 이름 (선택)
            </label>
            <input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="예: 김민준, 박서연, 이도현, 최지우"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none text-sm text-stone-800 transition-all placeholder:text-stone-400"
            />
          </div>

          {errorMsg && (
            <p className="text-sm font-bold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              ⚠️ {errorMsg}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-rose-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>요리 시작하기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>💡 브라우저에 자동 저장되어 새로고침해도 유지됩니다.</span>
          <button
            onClick={onOpenClassroomBoard}
            className="text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            모둠 결과 모아보기 →
          </button>
        </div>
      </div>

      {/* Curriculum Knowledge Highlights for Middle School Home Economics */}
      <div className="mt-12 space-y-6">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-black text-stone-900 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>오늘 수업에서 배울 핵심 교과 내용</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            조리법의 과학적 원리와 식품 첨가물 건강 수칙을 레시피에 담아보세요!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Meaning of Cooking */}
          <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede5d8] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl mb-3">
              🍲
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              조리(Cooking)의 의의
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              식품을 재료로 먹을 수 있는 음식을 만드는 과정입니다. 조리를 통해{' '}
              <strong className="text-stone-900 font-bold">영양적·기호적 가치</strong>가 향상되고{' '}
              <strong className="text-stone-900 font-bold">안전성</strong>이 증가합니다.
            </p>
          </div>

          {/* Card 2: 8 Cooking Methods */}
          <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede5d8] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-3">
              🔥
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              가열조리 vs 생조리
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-2">
              열을 전달하는 매체(물, 수증기, 기름, 직접열)에 따라 8대 가열조리와 신선한 생조리로 구분됩니다.
            </p>
            <div className="flex flex-wrap gap-1">
              {COOKING_METHODS.map((m) => (
                <span
                  key={m.id}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 font-medium"
                >
                  {m.icon} {m.name}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Food Additives Detective */}
          <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede5d8] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-3">
              🧪
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              식품 첨가물 탐정
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              가공식품 속 보존료, 발색제, 향미증진제를 확인하고,{' '}
              <strong className="text-stone-900 font-bold">데치기, 국물 버리기, 구워 먹기</strong> 등의 조리 비법으로 첨가물 섭취를 현명하게 줄여봅니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

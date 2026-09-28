import React, { useState } from 'react';
import { ChefHat, Clock, Flame, ShieldCheck, CheckCircle2, Tv, Printer, Share2, Sparkles, ArrowLeft, Download, Award, CheckSquare, Refrigerator } from 'lucide-react';
import { TeamRecipe } from '../types';

interface Step6FinalMenuCardProps {
  recipe: TeamRecipe;
  onOpenClassroomBoard: () => void;
  onEditRecipe: () => void;
}

export const Step6FinalMenuCard: React.FC<Step6FinalMenuCardProps> = ({
  recipe,
  onOpenClassroomBoard,
  onEditRecipe,
}) => {
  const [copied, setCopied] = useState(false);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Copy share summary
  const handleCopySummary = () => {
    const text = `🍽️ [${recipe.teamName}] 신메뉴: ${recipe.menuName}\n` +
      `🧊 냉장고 재료: ${recipe.mainIngredients}\n` +
      `🔥 조리법: ${recipe.drawnMethod?.name} (${recipe.cookingTimeMinutes}분)\n` +
      `🎯 미션: ${recipe.drawnMission?.title}\n` +
      `💡 조리법 선택 이유: ${recipe.methodReason}\n` +
      `🧪 첨가물 안심 수칙: ${recipe.additiveResult.reductionPlan || '해당 없음'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const ingredientsList = recipe.drawnIngredients && recipe.drawnIngredients.length > 0
    ? recipe.drawnIngredients
    : recipe.drawnIngredient
    ? [recipe.drawnIngredient]
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs mb-3">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>신메뉴 개발 완료! 기술·가정 레시피 연구소 인증서</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
          🍽️ 우리 모둠의 신메뉴 메뉴판
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          {recipe.teamName} 연구원들이 개발한 특별한 조리법 레시피와 식사 계획을 확인하세요.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onEditRecipe}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>레시피 수정</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? '복사 완료!' : '요약 복사'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>학습지 인쇄 / PDF</span>
          </button>

          <button
            onClick={onOpenClassroomBoard}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Tv className="w-4 h-4" />
            <span>전자칠판 모아보기</span>
          </button>
        </div>
      </div>

      {/* Menu Board Printable Card */}
      <div className="bg-[#fffefb] rounded-3xl border-3 border-amber-300/80 shadow-2xl p-6 sm:p-10 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Ribbon Tag */}
        <div className="flex items-center justify-between border-b-2 border-stone-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600" />
            <span className="text-xs sm:text-sm font-black text-rose-700 tracking-wider">
              {recipe.teamName} RESEARCH LAB
            </span>
            {recipe.members && (
              <span className="text-xs text-stone-400 font-medium">
                (연구원: {recipe.members})
              </span>
            )}
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            🎯 미션: {recipe.drawnMission?.title}
          </span>
        </div>

        {/* Title & Headline */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            {recipe.menuName}
          </h1>
          <p className="text-sm font-bold text-amber-700 mt-2 flex items-center gap-2">
            <span>{recipe.drawnMethod?.icon} 조리법: {recipe.drawnMethod?.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-stone-500" />
              <span>조리 시간 {recipe.cookingTimeMinutes}분</span>
            </span>
          </p>
        </div>

        {/* Hero Culinary Emblem Showcase & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
          {/* Left: Prestigious Culinary Lab Emblem */}
          <div className="rounded-2xl p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/50 shadow-inner flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 text-stone-300/50 text-5xl font-black select-none pointer-events-none">
              ★
            </div>

            <div>
              <span className="text-xs font-black tracking-widest text-amber-800 uppercase block mb-1">
                CULINARY LAB SIGNATURE
              </span>
              <h3 className="text-lg font-black text-stone-900">
                냉장고 속 3가지 핵심 재료의 조화
              </h3>
            </div>

            {/* 3 Ingredients Emblems */}
            <div className="my-5 flex items-center justify-center gap-3">
              {ingredientsList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white/90 backdrop-blur-xs px-3.5 py-3 rounded-2xl border border-amber-200 shadow-sm text-center flex-1 max-w-[100px]"
                >
                  <span className="text-3xl block mb-1">{item.emoji}</span>
                  <strong className="text-xs font-black text-stone-900 block truncate">
                    {item.name}
                  </strong>
                  <span className="text-[10px] text-stone-500 block truncate">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Cooking Method Feature */}
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-left">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 mb-0.5">
                <span>{recipe.drawnMethod?.icon}</span>
                <span>{recipe.drawnMethod?.name}의 조리 과학 원리</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                {recipe.drawnMethod?.features || recipe.drawnMethod?.definition}
              </p>
            </div>
          </div>

          {/* Right: Recipe details */}
          <div className="space-y-3.5 flex flex-col justify-between">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-black text-stone-500 block mb-1">
                주요 재료 및 분량
              </span>
              <p className="text-sm font-bold text-stone-900">
                {recipe.mainIngredients}
              </p>
              {recipe.extraIngredients && (
                <p className="text-xs text-stone-600 mt-1">
                  부재료: {recipe.extraIngredients}
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-black text-stone-500 block mb-1">
                필요한 조리 용구
              </span>
              <p className="text-sm font-semibold text-stone-800">
                {recipe.utensils || '프라이팬, 조리도구, 접시 등'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-xs font-black text-rose-800 block mb-1">
                조리법({recipe.drawnMethod?.name})을 선택한 이유
              </span>
              <p className="text-xs sm:text-sm font-bold text-rose-950 leading-relaxed">
                “{recipe.methodReason}”
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Cooking Process */}
        <div className="mb-8">
          <h3 className="text-lg font-black text-stone-900 mb-3 flex items-center gap-2">
            <span>👨‍🍳 단계별 식사 조리 순서</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {recipe.steps.map((step, idx) => (
              <div
                key={step.id}
                className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-start gap-3 shadow-2xs"
              >
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additives Reduction & Self-Evaluation Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t-2 border-stone-100">
          {/* Additive Reduction Method */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-black text-emerald-900">
                식품 첨가물 줄이기 안심 실천
              </span>
            </div>
            <p className="text-xs text-stone-700 font-semibold leading-relaxed">
              {recipe.additiveResult.reductionPlan
                ? `수칙: ${recipe.additiveResult.reductionPlan}`
                : '신선한 천연 식재료 위주로 조리하여 건강한 영양을 그대로 섭취'}
            </p>
          </div>

          {/* Cooking Process Checklist Completion */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-1.5">
              <CheckSquare className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-black text-amber-900">
                식사 조리 순서 점검 완료
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-700 font-semibold">
              <span className="bg-white px-2 py-0.5 rounded border border-amber-200">✓ 계량·손질</span>
              <span className="bg-white px-2 py-0.5 rounded border border-amber-200">✓ 위생 세척</span>
              <span className="bg-white px-2 py-0.5 rounded border border-amber-200">✓ 가열·맛내기</span>
              <span className="bg-white px-2 py-0.5 rounded border border-amber-200">✓ 상차림·뒷정리</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              모둠원과 협력하여 전 조리 과정을 체계적으로 설계했습니다.
            </p>
          </div>
        </div>

        {/* Laboratory Stamp */}
        <div className="mt-8 text-center pt-4 border-t border-dashed border-stone-200 text-xs text-stone-400 font-medium">
          중학교 기술·가정 [가족의 식사 조리] 조리법 레시피 연구소 • 발행 완료
        </div>
      </div>
    </div>
  );
};

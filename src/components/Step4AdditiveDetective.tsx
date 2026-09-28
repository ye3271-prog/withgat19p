import React, { useState, useEffect } from 'react';
import { ShieldCheck, Flame, BookOpen, Check, ArrowRight, ArrowLeft, AlertTriangle, Sparkles, PlusCircle } from 'lucide-react';
import { TeamRecipe } from '../types';
import { ADDITIVES_ENCYCLOPEDIA, PROCESSED_FOOD_REDUCTION_GUIDES, ProcessedFoodReductionGuide } from '../data/additives';

interface Step4AdditiveDetectiveProps {
  recipe: TeamRecipe;
  onUpdateRecipe: (updater: (prev: TeamRecipe) => TeamRecipe) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const Step4AdditiveDetective: React.FC<Step4AdditiveDetectiveProps> = ({
  recipe,
  onUpdateRecipe,
  onProceed,
  onBack,
}) => {
  // Check if drawn ingredient or recipe text has processed foods
  const detectInitialProcessedFoods = () => {
    const list: string[] = [];
    const textToCheck = `${recipe.drawnIngredient?.name || ''} ${recipe.mainIngredients} ${recipe.extraIngredients}`.toLowerCase();

    if (textToCheck.includes('햄') || textToCheck.includes('소시지') || textToCheck.includes('소세지')) list.push('햄·소시지·어묵');
    if (textToCheck.includes('어묵') || textToCheck.includes('오뎅')) list.push('햄·소시지·어묵');
    if (textToCheck.includes('통조림') || textToCheck.includes('참치') || textToCheck.includes('옥수수콘')) list.push('통조림 (참치, 옥수수, 햄)');
    if (textToCheck.includes('라면') || textToCheck.includes('면')) list.push('라면');
    if (textToCheck.includes('식빵') || textToCheck.includes('빵')) list.push('식빵');
    if (textToCheck.includes('단무지') || textToCheck.includes('피클')) list.push('단무지·피클');

    return Array.from(new Set(list));
  };

  const [activeTab, setActiveTab] = useState<'mission' | 'encyclopedia'>('mission');
  const [selectedGuide, setSelectedGuide] = useState<ProcessedFoodReductionGuide | null>(null);
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

  // Initialize selected guide
  useEffect(() => {
    const detected = detectInitialProcessedFoods();
    if (detected.length > 0) {
      const match = PROCESSED_FOOD_REDUCTION_GUIDES.find((g) => g.foodName === detected[0]);
      if (match) setSelectedGuide(match);
    } else {
      setSelectedGuide(PROCESSED_FOOD_REDUCTION_GUIDES[0]); // default guide
    }
  }, []);

  // Apply reduction tip to recipe
  const handleApplyToRecipe = (guide: ProcessedFoodReductionGuide) => {
    onUpdateRecipe((prev) => {
      // Check if step already exists
      const alreadyHasStep = prev.steps.some((s) => s.description.includes(guide.reductionMethod));
      let newSteps = [...prev.steps];

      if (!alreadyHasStep) {
        newSteps.unshift({
          id: `step-clean-${Date.now()}`,
          order: 1,
          description: `[첨가물 줄이기] ${guide.foodName}은(는) 조리 전 ${guide.reductionMethod}`,
          phaseCategory: '손질',
        });
        // reindex
        newSteps = newSteps.map((s, idx) => ({ ...s, order: idx + 1 }));
      }

      return {
        ...prev,
        steps: newSteps,
        additiveResult: {
          hasProcessedFood: true,
          selectedProcessedFoods: Array.from(new Set([...prev.additiveResult.selectedProcessedFoods, guide.foodName])),
          chosenAdditives: guide.suspectedAdditives,
          reductionPlan: guide.reductionMethod,
          appliedToRecipe: true,
        },
      };
    });

    setAppliedMessage(`“${guide.actionTitle}” 수칙이 우리 레시피 첫 조리 단계에 성공적으로 추가되었습니다!`);
    setTimeout(() => setAppliedMessage(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          STEP 3 • 식품 첨가물 탐정
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
          가공식품 속 첨가물을 찾고 건강하게 줄여보자!
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          식품 첨가물의 사용 목적을 이해하고, 조리 과정에서 현명하게 첨가물 섭취를 줄이는 실천 비법을 적용합니다.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-stone-200 p-1 rounded-2xl flex gap-1">
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'mission'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🕵️‍♂️ 첨가물 줄이기 미션 도전
          </button>
          <button
            onClick={() => setActiveTab('encyclopedia')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'encyclopedia'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📖 교과서 식품 첨가물 도감
          </button>
        </div>
      </div>

      {appliedMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-2 shadow-sm animate-pulse">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{appliedMessage}</span>
        </div>
      )}

      {activeTab === 'mission' ? (
        <div className="space-y-6">
          {/* Question Banner */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-center">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wide">
              탐정 핵심 질문
            </span>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-1">
              “이 재료를 사용할 때 첨가물 섭취를 줄이려면 어떻게 해야 할까?”
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              해당하는 가공식품 카드를 고르고, 우리 레시피에 줄이기 조리 수칙을 적용해 보세요.
            </p>
          </div>

          {/* Processed Food Selection Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {PROCESSED_FOOD_REDUCTION_GUIDES.map((guide) => {
              const isSelected = selectedGuide?.foodName === guide.foodName;
              return (
                <button
                  key={guide.foodName}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-md scale-102'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <span className="text-3xl block mb-1">{guide.icon}</span>
                  <span className="text-xs font-black text-stone-900 block line-clamp-1">
                    {guide.foodName}
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    {guide.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Detective Card Details */}
          {selectedGuide && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedGuide.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      탐정 분석 대상
                    </span>
                    <h4 className="text-xl font-black text-stone-900 mt-0.5">
                      {selectedGuide.foodName}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {selectedGuide.suspectedAdditives.map((ad, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      ⚠️ {ad}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Solution Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💡</span>
                  <h5 className="text-base sm:text-lg font-black text-emerald-950">
                    첨가물 섭취 줄이기 비법: {selectedGuide.actionTitle}
                  </h5>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-medium">
                  {selectedGuide.reason}
                </p>
              </div>

              {/* Apply Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  <span>선택한 비법을 누르면 모둠 조리 순서(1단계)에 자동으로 안전 손질법이 등록됩니다.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyToRecipe(selectedGuide)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>우리 레시피에 적용하기</span>
                </button>
              </div>
            </div>
          )}

          {/* Recipe Reduction Plan Summary Box */}
          <div className="bg-[#faf8f4] p-5 rounded-2xl border border-[#e5ded2]">
            <h4 className="text-sm font-black text-stone-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>현재 우리 모둠의 식품 첨가물 안심 수칙 계획</span>
            </h4>
            {recipe.additiveResult.appliedToRecipe ? (
              <p className="text-xs text-stone-700 font-semibold bg-white p-3 rounded-xl border border-stone-200">
                ✅ 반영 완료: {recipe.additiveResult.selectedProcessedFoods.join(', ')} →{' '}
                <span className="text-emerald-700">{recipe.additiveResult.reductionPlan}</span>
              </p>
            ) : (
              <p className="text-xs text-stone-500">
                위 카드에서 우리 요리에 맞는 비법을 선택하고 [우리 레시피에 적용하기]를 눌러보세요.
                (자연 식재료만 사용한 경우 바로 다음 단계로 이동 가능합니다.)
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Textbook Additives Encyclopedia Table */
        <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-xl overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-black text-stone-900">
              중학교 기술·가정 교과서 수록 대표 식품 첨가물
            </h3>
          </div>

          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <th className="p-3 rounded-l-xl">종류</th>
                <th className="p-3">사용 목적</th>
                <th className="p-3">대표 첨가물</th>
                <th className="p-3 rounded-r-xl">식품 사용 예</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {ADDITIVES_ENCYCLOPEDIA.map((item) => (
                <tr key={item.type} className="hover:bg-amber-50/50 transition-colors">
                  <td className="p-3 font-black text-stone-900">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 text-stone-600 leading-relaxed font-medium">
                    {item.purpose}
                  </td>
                  <td className="p-3 text-rose-700 font-semibold">
                    {item.examples.join(', ')}
                  </td>
                  <td className="p-3 text-stone-700 font-medium">
                    {item.foodUses.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-stone-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전: 레시피 수정</span>
        </button>

        <button
          type="button"
          onClick={onProceed}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>다음: 최종 신메뉴 완성하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, ArrowLeft, CheckSquare, Square, Lightbulb, Clock, UtensilsCrossed, AlertCircle, Sparkles } from 'lucide-react';
import { TeamRecipe, RecipeStepItem, CookingChecklist } from '../types';

interface Step3RecipeLabProps {
  recipe: TeamRecipe;
  onUpdateRecipe: (updater: (prev: TeamRecipe) => TeamRecipe) => void;
  onProceed: () => void;
  onBack: () => void;
}

const CHECKLIST_ITEMS: { key: keyof CookingChecklist; label: string; desc: string; icon: string }[] = [
  { key: 'measuring', label: '계량', desc: '재료 분량 정확히 재기', icon: '⚖️' },
  { key: 'trimming', label: '다듬기', desc: '껍질 벗기기, 불필요한 부분 제거', icon: '🔪' },
  { key: 'washing', label: '씻기', desc: '이물질과 흙을 물로 깨끗이 씻기', icon: '💧' },
  { key: 'cutting', label: '썰기', desc: '조리법에 맞게 알맞은 크기로 자르기', icon: '🥕' },
  { key: 'heating', label: '가열하기', desc: '불을 켜고 조리법에 따라 익히기', icon: '🔥' },
  { key: 'seasoning', label: '맛내기', desc: '간을 맞추고 양념 첨가하기', icon: '🧂' },
  { key: 'serving', label: '상차림', desc: '완성된 음식을 정갈하게 그릇에 담기', icon: '🍽️' },
  { key: 'cleaning', label: '뒷정리', desc: '조리 용구 설거지 및 가스레인지 정리', icon: '🧽' },
];

const REASON_PRESETS = [
  '빠르게 익힐 수 있어서',
  '바삭한 식감을 만들기 위해',
  '재료 본래의 맛과 영양을 살리기 위해',
  '적은 양의 기름을 사용하여 건강하게 조리하기 위해',
  '부드러운 식감을 만들어 소화를 돕기 위해',
  '양념이 깊숙이 배어들어 감칠맛을 내기 위해',
];

export const Step3RecipeLab: React.FC<Step3RecipeLabProps> = ({
  recipe,
  onUpdateRecipe,
  onProceed,
  onBack,
}) => {
  const [newStepText, setNewStepText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Add step item
  const handleAddStep = () => {
    if (!newStepText.trim()) return;

    onUpdateRecipe((prev) => {
      const nextOrder = prev.steps.length + 1;
      const newStep: RecipeStepItem = {
        id: `step-${Date.now()}-${Math.random()}`,
        order: nextOrder,
        description: newStepText.trim(),
      };
      return {
        ...prev,
        steps: [...prev.steps, newStep],
      };
    });
    setNewStepText('');
    setValidationError(null);
  };

  // Remove step item
  const handleRemoveStep = (id: string) => {
    onUpdateRecipe((prev) => {
      const filtered = prev.steps.filter((s) => s.id !== id);
      const reindexed = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
      return {
        ...prev,
        steps: reindexed,
      };
    });
  };

  // Edit step item inline
  const handleEditStep = (id: string, text: string) => {
    onUpdateRecipe((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === id ? { ...s, description: text } : s)),
    }));
  };

  // Toggle checklist
  const handleToggleChecklist = (key: keyof CookingChecklist) => {
    onUpdateRecipe((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: !prev.checklist[key],
      },
    }));
  };

  // Validate before proceeding to Step 4
  const handleNextClick = () => {
    if (!recipe.menuName.trim()) {
      setValidationError('메뉴명을 입력해 주세요! (예: 감자 바삭구이)');
      return;
    }
    if (!recipe.mainIngredients.trim()) {
      setValidationError('주요 재료를 입력해 주세요!');
      return;
    }
    if (!recipe.cookingTimeMinutes || recipe.cookingTimeMinutes <= 0) {
      setValidationError('예상 조리 시간을 숫자로 입력해 주세요!');
      return;
    }
    if (!recipe.steps || recipe.steps.length === 0) {
      setValidationError('조리 순서를 한 단계 이상 작성해주세요.');
      return;
    }
    if (!recipe.methodReason.trim()) {
      setValidationError('“왜 이 조리법을 선택했나요?”에 대한 이유를 작성해주세요.');
      return;
    }

    setValidationError(null);
    onProceed();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top mission reminder strip */}
      <div className="bg-[#fcf7ed] border border-amber-300 rounded-2xl p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2.5 py-1 rounded-md bg-rose-600 text-white">
            우리 모둠 과제
          </span>
          <span className="text-sm font-bold text-stone-800">
            🧊 {recipe.drawnIngredients && recipe.drawnIngredients.length > 0
              ? recipe.drawnIngredients.map((i) => `${i.emoji} ${i.name}`).join(' + ')
              : `${recipe.drawnIngredient?.emoji || '🥔'} ${recipe.drawnIngredient?.name || '감자'}`}
            {' '}• {recipe.drawnMethod?.icon} {recipe.drawnMethod?.name}
            {' '}• {recipe.drawnMission?.icon} {recipe.drawnMission?.title}
          </span>
        </div>
        <span className="text-xs text-stone-500 font-medium">
          STEP 2 • 창의 레시피 개발
        </span>
      </div>

      <div className="text-center mb-8">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          STEP 2 • 레시피 연구소
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
          새로운 조리법 레시피를 개발해 보세요!
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          음식의 작업 순서와 조리 시간을 꼼꼼히 계획하여 완성도 높은 레시피를 만듭니다.
        </p>
      </div>

      {/* Main Recipe Form */}
      <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border-2 border-stone-200 shadow-xl">
        {/* 1. 메뉴명 & 조리시간 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-black text-stone-900 mb-1">
              ① 개발할 신메뉴 이름 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={recipe.menuName}
              onChange={(e) =>
                onUpdateRecipe((prev) => ({ ...prev, menuName: e.target.value }))
              }
              placeholder="예: 바삭바삭 감자 치즈구이, 영양 만점 두부 샐러드"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 text-base font-bold text-stone-900 outline-none transition-all placeholder:font-normal placeholder:text-stone-400"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-stone-900 mb-1 flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>예상 조리 시간 (분) <span className="text-rose-500">*</span></span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="180"
                value={recipe.cookingTimeMinutes || ''}
                onChange={(e) =>
                  onUpdateRecipe((prev) => ({
                    ...prev,
                    cookingTimeMinutes: parseInt(e.target.value, 10) || 0,
                  }))
                }
                placeholder="예: 15"
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 text-base font-bold text-stone-900 outline-none transition-all"
              />
              <span className="absolute right-4 top-3.5 text-sm font-bold text-stone-500">
                분
              </span>
            </div>
          </div>
        </div>

        {/* 2. 재료 & 조리용구 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-black text-stone-900 mb-1">
              ② 주요 재료 및 분량 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={recipe.mainIngredients}
              onChange={(e) =>
                onUpdateRecipe((prev) => ({ ...prev, mainIngredients: e.target.value }))
              }
              placeholder="예: 감자 2개, 소금 1/2작은술, 식용유 1큰술"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 text-sm font-semibold text-stone-900 outline-none transition-all"
            />
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              💡 냉장고에서 선택한 재료({recipe.drawnIngredients && recipe.drawnIngredients.length > 0 ? recipe.drawnIngredients.map(i => i.name).join(', ') : recipe.drawnIngredient?.name || '감자'})를 기본으로 추가 재료와 양념을 함께 적어주세요.
            </p>
          </div>

          <div>
            <label className="block text-sm font-black text-stone-900 mb-1 flex items-center gap-1">
              <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
              <span>필요한 조리 용구</span>
            </label>
            <input
              type="text"
              value={recipe.utensils}
              onChange={(e) =>
                onUpdateRecipe((prev) => ({ ...prev, utensils: e.target.value }))
              }
              placeholder="예: 프라이팬, 뒤집개, 칼, 도마, 계량스푼, 접시"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 text-sm font-semibold text-stone-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* 3. 조리 순서 빌더 (다단계) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-sm font-black text-stone-900">
                ③ 단계별 조리 순서 <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-stone-500">
                손질부터 가열, 상차림까지 순서대로 구체적으로 작성해 보세요.
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
              현재 {recipe.steps.length}단계
            </span>
          </div>

          {/* Steps List */}
          <div className="space-y-2 mb-3">
            {recipe.steps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 group hover:border-stone-300 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={step.description}
                  onChange={(e) => handleEditStep(step.id, e.target.value)}
                  className="flex-1 bg-transparent border-none text-sm font-semibold text-stone-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStep(step.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {recipe.steps.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 text-xs">
                아직 조리 과정이 없습니다. 아래 입력창에 첫 번째 과정을 입력해 보세요!
              </div>
            )}
          </div>

          {/* Add Step Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddStep();
                }
              }}
              placeholder={`예: ${
                recipe.steps.length === 0
                  ? '감자를 물에 깨끗이 씻고 껍질을 벗긴다.'
                  : recipe.steps.length === 1
                  ? '프라이팬을 달구고 기름을 얇게 두른다.'
                  : '노릇하게 구워 완성된 접시에 담는다.'
              }`}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-sm outline-none"
            />
            <button
              type="button"
              onClick={handleAddStep}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>과정 추가</span>
            </button>
          </div>
        </div>

        {/* 4. 조리 순서 체크리스트 (교과서 내용 반영) */}
        <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#e8e0d3]">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-black text-stone-900">
              식사 조리 순서 점검표 (Checklist)
            </h4>
          </div>
          <p className="text-xs text-stone-600 mb-3">
            작성한 레시피에 아래 핵심 조리 과정들이 고루 반영되었는지 체크해 보세요!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = recipe.checklist[item.key];
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => handleToggleChecklist(item.key)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[10px] text-stone-400 block line-clamp-1">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. 핵심 질문: 조리법 선택 이유 */}
        <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-rose-600" />
            <label className="text-sm font-black text-rose-900">
              ④ 수업 핵심 질문: “왜 이 조리법({recipe.drawnMethod?.name || '조리법'})을 선택했나요?” <span className="text-rose-500">*</span>
            </label>
          </div>
          <p className="text-xs text-rose-700 mb-3">
            재료의 특성, 식감, 영양 보존, 시간 단축 등의 과학적·조리적 이유를 작성해 주세요.
          </p>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {REASON_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() =>
                  onUpdateRecipe((prev) => ({
                    ...prev,
                    methodReason: prev.methodReason
                      ? `${prev.methodReason}, ${preset}`
                      : preset,
                  }))
                }
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-rose-200 hover:bg-rose-100 text-rose-800 font-medium transition-colors cursor-pointer"
              >
                + {preset}
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            value={recipe.methodReason}
            onChange={(e) =>
              onUpdateRecipe((prev) => ({ ...prev, methodReason: e.target.value }))
            }
            placeholder="예: 감자의 겉면을 바삭하게 익히고 수분을 적절히 날려 고소한 풍미를 극대화하기 위해 굽기 조리법을 선택했습니다."
            className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-sm font-medium text-stone-900 outline-none"
          />
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-sm font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전: 카드 다시 보기</span>
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>다음: 식품 첨가물 탐정 단계</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

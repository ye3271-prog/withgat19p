import React, { useState } from 'react';
import { Sparkles, Camera, CheckSquare, Square, RefreshCw, ArrowRight, ArrowLeft, AlertCircle, Eye, CheckCircle2, Image as ImageIcon, Flame } from 'lucide-react';
import { TeamRecipe, AiVerification } from '../types';
import { generateFoodImage } from '../services/imageService';

interface Step5AiFoodDesignerProps {
  recipe: TeamRecipe;
  onUpdateRecipe: (updater: (prev: TeamRecipe) => TeamRecipe) => void;
  onProceed: () => void;
  onBack: () => void;
}

const VERIFICATION_KEYS: { key: keyof Omit<AiVerification, 'feedbackNote'>; label: string }[] = [
  { key: 'ingredientsMatch', label: '재료가 맞다' },
  { key: 'methodMatch', label: '조리법이 맞게 표현되었다' },
  { key: 'appearanceMatch', label: '음식의 형태가 적절하다' },
  { key: 'recipeConsistency', label: '레시피와 이미지가 일치한다' },
  { key: 'feasibility', label: '실제로 만들 수 있을 것 같다' },
];

export const Step5AiFoodDesigner: React.FC<Step5AiFoodDesignerProps> = ({
  recipe,
  onUpdateRecipe,
  onProceed,
  onBack,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState(recipe.aiVerification.feedbackNote || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [variationIndex, setVariationIndex] = useState(0);

  // Trigger Image Generation
  const handleGenerate = async (revisionNote?: string) => {
    setIsGenerating(true);
    setErrorMessage(null);

    const nextIndex = revisionNote ? variationIndex + 1 : variationIndex;
    setVariationIndex(nextIndex);

    try {
      const result = await generateFoodImage(recipe, revisionNote, nextIndex);
      onUpdateRecipe((prev) => ({
        ...prev,
        aiImageUrl: result.imageUrl,
        aiPromptUsed: result.promptUsed,
        aiImageSource: result.source,
        aiImageVariations: result.variations,
        aiGeneratedAt: new Date().toISOString(),
        aiVerification: {
          ...prev.aiVerification,
          feedbackNote: revisionNote || prev.aiVerification.feedbackNote,
        },
      }));
    } catch (err: any) {
      setErrorMessage('이미지 시각화 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Switch to specific variation
  const handleSelectVariation = (url: string) => {
    onUpdateRecipe((prev) => ({
      ...prev,
      aiImageUrl: url,
    }));
  };

  // Toggle checklist
  const handleToggleCheck = (key: keyof Omit<AiVerification, 'feedbackNote'>) => {
    onUpdateRecipe((prev) => ({
      ...prev,
      aiVerification: {
        ...prev.aiVerification,
        [key]: !prev.aiVerification[key],
      },
    }));
  };

  // Save feedback note
  const handleFeedbackChange = (text: string) => {
    setFeedbackInput(text);
    onUpdateRecipe((prev) => ({
      ...prev,
      aiVerification: {
        ...prev.aiVerification,
        feedbackNote: text,
      },
    }));
  };

  const hasImage = !!recipe.aiImageUrl;
  const variations = recipe.aiImageVariations || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          STEP 4 • 고화질 실사 AI Food Designer
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
          우리가 개발한 레시피를 실사 음식 사진으로 시각화!
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          학생이 선택한 재료와 조리법의 특징(불향, 바삭한 튀김옷, 윤기 있는 양념)을 실제 완성 요리 사진으로 생생하게 구현합니다.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-xl space-y-8">
        {/* Generator Viewport Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Image Display Area */}
          <div className="relative aspect-4/3 bg-stone-950 rounded-2xl overflow-hidden border-2 border-stone-800 shadow-2xl flex items-center justify-center group">
            {recipe.aiImageUrl ? (
              <img
                src={recipe.aiImageUrl}
                alt={recipe.menuName}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <Camera className="w-12 h-12 text-stone-600 mx-auto animate-pulse" />
                <p className="text-stone-300 font-bold text-sm">
                  아직 시각화된 실사 이미지가 없습니다.
                </p>
                <p className="text-stone-500 text-xs">
                  우측의 [실사 음식 사진 시각화하기] 버튼을 눌러보세요!
                </p>
              </div>
            )}

            {/* Quality & Method Watermark Badge */}
            {hasImage && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-black flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>4K 실사 미식 포토그래피</span>
              </div>
            )}

            {hasImage && (
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                조리법: {recipe.drawnMethod?.name}
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3 p-4">
                <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="font-extrabold text-base text-amber-300 animate-pulse">
                  실사 음식 사진 렌더링 중...
                </p>
                <p className="text-xs text-stone-400 text-center">
                  레시피 재료와 {recipe.drawnMethod?.name || '조리법'}의 질감을 분석하여 레스토랑 수준의 실제 음식 사진으로 준비하고 있습니다.
                </p>
              </div>
            )}
          </div>

          {/* Recipe Parameters reflected */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider block mb-1">
                실사 시각화 반영 기준
              </span>
              <h4 className="text-base font-black text-stone-900 mb-2">
                {recipe.menuName || '우리 모둠 신메뉴'}
              </h4>
              <ul className="text-xs space-y-1.5 text-stone-700 font-medium">
                <li>• <strong>식재료:</strong> {recipe.mainIngredients || '감자, 치즈'}</li>
                <li>• <strong>조리법 기법:</strong> {recipe.drawnMethod?.name} ({recipe.drawnMethod?.definition})</li>
                <li>• <strong>조리 시간:</strong> 약 {recipe.cookingTimeMinutes}분</li>
                <li>• <strong>적용된 조리 단계:</strong> {recipe.steps.length}단계 계획 완료</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{hasImage ? '실사 음식 사진 다시 추천/생성' : '실사 음식 사진 시각화하기'}</span>
            </button>

            {/* Alternative Plating Variations */}
            {variations.length > 1 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-600 block">
                  실사 플레이팅 스타일 선택:
                </span>
                <div className="flex gap-2">
                  {variations.map((vUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectVariation(vUrl)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        recipe.aiImageUrl === vUrl
                          ? 'border-rose-600 ring-2 ring-rose-300 scale-105'
                          : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={vUrl} alt={`스타일 ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* AI Image Verification Section (검증) */}
        {hasImage && (
          <div className="p-6 rounded-3xl bg-[#fcfaf5] border-2 border-stone-200 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  AI가 우리 레시피를 제대로 표현했을까?
                </h3>
                <p className="text-xs text-stone-500">
                  생성된 실사 이미지를 직접 검토하고 체크리스트를 점검해 보세요.
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {VERIFICATION_KEYS.map((item) => {
                const isChecked = recipe.aiVerification[item.key];
                return (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => handleToggleCheck(item.key)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Revision Feedback Box & Regenerate */}
            <div className="pt-3 border-t border-stone-200 space-y-3">
              <label className="block text-xs font-black text-stone-800">
                수정해야 할 점 (피드백 반영)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={feedbackInput}
                  onChange={(e) => handleFeedbackChange(e.target.value)}
                  placeholder="예: 튀긴 것처럼 보여서 팬에 노릇하게 굽는 모습으로 수정해야 한다."
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleGenerate(feedbackInput)}
                  disabled={isGenerating || !feedbackInput.trim()}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>피드백 반영하여 다시 만들기</span>
                </button>
              </div>
            </div>
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
            <span>이전: 첨가물 탐정</span>
          </button>

          <button
            type="button"
            onClick={onProceed}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>다음: 최종 메뉴판 완성하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

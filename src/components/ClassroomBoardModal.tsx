import React, { useState } from 'react';
import { Tv, X, Search, Clock, ChefHat, ShieldCheck, ChevronRight, Refrigerator, CheckSquare } from 'lucide-react';
import { TeamRecipe } from '../types';

interface ClassroomBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: TeamRecipe[];
  onSelectRecipeForDetails?: (recipe: TeamRecipe) => void;
}

export const ClassroomBoardModal: React.FC<ClassroomBoardModalProps> = ({
  isOpen,
  onClose,
  recipes,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<TeamRecipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  if (!isOpen) return null;

  // Filter recipes
  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.menuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.mainIngredients.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod =
      filterMethod === 'all' || r.drawnMethod?.name === filterMethod;

    return matchesSearch && matchesMethod;
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex flex-col p-3 sm:p-6 overflow-hidden">
      {/* Top Bar for Smartboard */}
      <div className="flex items-center justify-between bg-stone-900 text-white px-6 py-4 rounded-2xl border border-stone-800 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                전자칠판 공유 화면
              </span>
              <span className="text-xs text-stone-400">교실 전체 모둠 신메뉴 발표회</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>전체 모둠 메뉴판 (Classroom Board)</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-800 text-amber-400">
                총 {recipes.length}개 모둠 등록
              </span>
            </h2>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="모둠명, 메뉴명, 재료 검색..."
              className="bg-transparent text-xs text-white outline-none w-36 lg:w-48 placeholder:text-stone-500"
            />
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto py-6">
        {filteredRecipes.length === 0 ? (
          <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center text-stone-400 p-8">
            <ChefHat className="w-16 h-16 mb-4 text-stone-600 animate-pulse" />
            <h3 className="text-lg font-bold text-stone-300">
              아직 등록된 모둠 레시피가 없습니다.
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md">
              각 모둠에서 [STEP 4 메뉴 완성]을 마치면 이곳 전자칠판 메뉴판에 모둠 신메뉴와 레시피가 자동으로 등록됩니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredRecipes.map((item) => {
              const ingredientsList = item.drawnIngredients && item.drawnIngredients.length > 0
                ? item.drawnIngredients
                : item.drawnIngredient
                ? [item.drawnIngredient]
                : [];

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedRecipe(item)}
                  className="bg-white rounded-3xl p-5 border-2 border-stone-200 hover:border-amber-400 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                        {item.teamName}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                        {item.drawnMethod?.icon} {item.drawnMethod?.name}
                      </span>
                    </div>

                    {/* Culinary Lab Signature Card Graphic */}
                    <div className="aspect-4/3 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/60 p-4 mb-3 border border-amber-200 flex flex-col items-center justify-center text-center relative shadow-inner">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {ingredientsList.map((ing, idx) => (
                          <span key={ing.id || idx} className="text-3xl filter drop-shadow-xs" title={ing.name}>
                            {ing.emoji}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-900 line-clamp-1">
                        {item.menuName}
                      </span>
                      <span className="text-[10px] text-stone-500 font-semibold mt-0.5 line-clamp-1">
                        {item.mainIngredients}
                      </span>

                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-stone-700 text-[10px] font-bold border border-amber-200">
                        ⏱️ {item.cookingTimeMinutes}분
                      </span>
                    </div>

                    {/* Menu Name & Ingredient */}
                    <h4 className="text-base font-black text-stone-900 line-clamp-1 mb-1">
                      {item.menuName}
                    </h4>
                    <p className="text-[11px] text-amber-800 font-bold line-clamp-1">
                      🎯 {item.drawnMission?.title}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-500 group-hover:text-rose-600">
                    <span>레시피 전체 보기</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Showcase Modal (대화면 발표용 모달) */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fffefc] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border-2 border-amber-300">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-600 text-white">
                  {selectedRecipe.teamName} 발표 화면
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  미션: {selectedRecipe.drawnMission?.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Signature Showcase Block */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-stone-900">
                  {selectedRecipe.menuName}
                </h3>
                <p className="text-xs font-bold text-amber-800 mt-1">
                  주요 재료: {selectedRecipe.mainIngredients}
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-bold mt-2">
                  <span className="px-2.5 py-1 bg-white border border-amber-200 text-amber-900 rounded-lg">
                    {selectedRecipe.drawnMethod?.icon} {selectedRecipe.drawnMethod?.name}
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-stone-200 text-stone-700 rounded-lg">
                    조리 시간 {selectedRecipe.cookingTimeMinutes}분
                  </span>
                </div>
              </div>

              {/* 3 Ingredients icons */}
              <div className="flex gap-2">
                {(selectedRecipe.drawnIngredients || [selectedRecipe.drawnIngredient]).map((ing, idx) => (
                  <div key={idx} className="w-14 h-14 rounded-xl bg-white border border-amber-200 flex flex-col items-center justify-center text-center shadow-xs">
                    <span className="text-2xl">{ing?.emoji || '🥔'}</span>
                    <span className="text-[9px] font-bold text-stone-700 truncate max-w-full px-1">{ing?.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Method Reason */}
            <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium mb-4">
              <strong>조리법({selectedRecipe.drawnMethod?.name}) 선택 이유:</strong> “{selectedRecipe.methodReason}”
            </div>

            {/* Steps */}
            <div className="space-y-2 mb-4">
              <h5 className="text-xs font-black text-stone-800 uppercase tracking-wider">
                식사 조리 순서
              </h5>
              <div className="space-y-1.5">
                {selectedRecipe.steps.map((st, idx) => (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-stone-800 font-medium">{st.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additives */}
            {selectedRecipe.additiveResult.reductionPlan && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>식품 첨가물 안심 수칙:</strong> {selectedRecipe.additiveResult.reductionPlan}
                </span>
              </div>
            )}

            <button
              onClick={() => setSelectedRecipe(null)}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

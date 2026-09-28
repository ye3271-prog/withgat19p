import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCw, ArrowRight, Info, Check, Dices, Hand, Refrigerator } from 'lucide-react';
import { Ingredient } from '../data/ingredients';
import { CookingMethod } from '../data/cookingMethods';
import { Mission, TeamRecipe } from '../types';

interface Step2CardDrawProps {
  recipe: TeamRecipe;
  availableIngredients: Ingredient[];
  availableMethods: CookingMethod[];
  availableMissions: Mission[];
  onUpdateRecipe: (updater: (prev: TeamRecipe) => TeamRecipe) => void;
  onProceedToRecipe: () => void;
}

export const Step2CardDraw: React.FC<Step2CardDrawProps> = ({
  recipe,
  availableIngredients,
  availableMethods,
  availableMissions,
  onUpdateRecipe,
  onProceedToRecipe,
}) => {
  // Refrigerator selection mode: 'random' | 'manual'
  const [fridgeMode, setFridgeMode] = useState<'random' | 'manual'>('random');
  const [activeFridgeCategory, setActiveFridgeCategory] = useState<string>('전체');

  // Currently selected 3 ingredients
  const currentIngredients: Ingredient[] = recipe.drawnIngredients && recipe.drawnIngredients.length > 0
    ? recipe.drawnIngredients
    : recipe.drawnIngredient
    ? [recipe.drawnIngredient]
    : [];

  // Card Flip states
  const [flipped, setFlipped] = useState<{
    fridge: boolean;
    method: boolean;
    mission: boolean;
  }>({
    fridge: currentIngredients.length === 3,
    method: !!recipe.drawnMethod,
    mission: !!recipe.drawnMission,
  });

  const [selectedMethodDetail, setSelectedMethodDetail] = useState<CookingMethod | null>(null);

  // Helper to pick N unique random items
  const pickRandomN = <T,>(arr: T[], n: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  // Helper to pick 1 random item
  const pickRandom = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Draw 3 random ingredients from refrigerator
  const handleRandomDrawFridge = () => {
    const drawn3 = pickRandomN(availableIngredients, 3);
    setFlipped((prev) => ({ ...prev, fridge: true }));

    onUpdateRecipe((prev) => {
      const ingredientNames = drawn3.map((i) => i.name).join(', ');
      return {
        ...prev,
        drawnIngredients: drawn3,
        drawnIngredient: drawn3[0], // primary
        mainIngredients: prev.mainIngredients || ingredientNames,
      };
    });
  };

  // Toggle selection of an ingredient in manual mode
  const handleToggleManualIngredient = (item: Ingredient) => {
    const exists = currentIngredients.some((i) => i.id === item.id);
    let updated: Ingredient[];

    if (exists) {
      updated = currentIngredients.filter((i) => i.id !== item.id);
    } else {
      if (currentIngredients.length >= 3) {
        // replace the oldest or alert
        updated = [...currentIngredients.slice(1), item];
      } else {
        updated = [...currentIngredients, item];
      }
    }

    if (updated.length === 3) {
      setFlipped((prev) => ({ ...prev, fridge: true }));
    }

    onUpdateRecipe((prev) => {
      const names = updated.map((i) => i.name).join(', ');
      return {
        ...prev,
        drawnIngredients: updated,
        drawnIngredient: updated[0] || null,
        mainIngredients: names,
      };
    });
  };

  // Redraw 3 refrigerator ingredients (1/1 limit)
  const handleRedrawFridge = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.redrawCounts.ingredient >= 1) return;

    const currentIds = new Set(currentIngredients.map((i) => i.id));
    const pool = availableIngredients.filter((i) => !currentIds.has(i.id));
    const drawn3 = pickRandomN(pool.length >= 3 ? pool : availableIngredients, 3);

    onUpdateRecipe((prev) => {
      const names = drawn3.map((i) => i.name).join(', ');
      return {
        ...prev,
        drawnIngredients: drawn3,
        drawnIngredient: drawn3[0],
        mainIngredients: names,
        redrawCounts: {
          ...prev.redrawCounts,
          ingredient: prev.redrawCounts.ingredient + 1,
        },
      };
    });
  };

  // Flip/Draw Cooking Method Card
  const handleMethodClick = () => {
    if (flipped.method) return;
    setFlipped((prev) => ({ ...prev, method: true }));

    if (!recipe.drawnMethod) {
      const chosen = pickRandom(availableMethods);
      onUpdateRecipe((prev) => ({ ...prev, drawnMethod: chosen }));
    }
  };

  // Redraw Cooking Method Card
  const handleRedrawMethod = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.redrawCounts.method >= 1) return;

    const others = availableMethods.filter((m) => m.id !== recipe.drawnMethod?.id);
    const chosen = pickRandom(others.length ? others : availableMethods);

    onUpdateRecipe((prev) => ({
      ...prev,
      drawnMethod: chosen,
      redrawCounts: {
        ...prev.redrawCounts,
        method: prev.redrawCounts.method + 1,
      },
    }));
  };

  // Flip/Draw Mission Card
  const handleMissionClick = () => {
    if (flipped.mission) return;
    setFlipped((prev) => ({ ...prev, mission: true }));

    if (!recipe.drawnMission) {
      const chosen = pickRandom(availableMissions);
      onUpdateRecipe((prev) => ({ ...prev, drawnMission: chosen }));
    }
  };

  // Redraw Mission Card
  const handleRedrawMission = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.redrawCounts.mission >= 1) return;

    const others = availableMissions.filter((m) => m.id !== recipe.drawnMission?.id);
    const chosen = pickRandom(others.length ? others : availableMissions);

    onUpdateRecipe((prev) => ({
      ...prev,
      drawnMission: chosen,
      redrawCounts: {
        ...prev.redrawCounts,
        mission: prev.redrawCounts.mission + 1,
      },
    }));
  };

  const isFridgeComplete = currentIngredients.length === 3;
  const allReady = isFridgeComplete && flipped.method && flipped.mission && !!recipe.drawnMethod && !!recipe.drawnMission;

  // Filtered ingredients for manual fridge browsing
  const filteredIngredients = availableIngredients.filter((i) => {
    if (activeFridgeCategory === '전체') return true;
    return i.category === activeFridgeCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header section with pedagogical prompt */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          STEP 1 • 냉장고 재료 3종 + 조리법 + 미션 매칭
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-stone-900 mt-2">
          냉장고 속 3가지 재료와 조리법으로 신메뉴 개발하기!
        </h2>
        <p className="text-sm sm:text-base text-stone-600 mt-1 font-medium">
          냉장고에서 재료 3개를 뽑거나 골라보고, 알맞은 조리법과 도전 미션을 조합해 보세요.
        </p>
      </div>

      {/* Main 3 Cards / Stages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CARD 1: Refrigerator (냉장고 속 3가지 재료) - spans 6 cols */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border-3 border-sky-300 shadow-xl shadow-sky-100 flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Refrigerator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    🧊 우리 집 냉장고 파먹기
                  </h3>
                  <span className="text-xs text-sky-700 font-semibold">
                    재료 3가지 조합 ({currentIngredients.length}/3)
                  </span>
                </div>
              </div>

              {/* Mode switch */}
              <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFridgeMode('random')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                    fridgeMode === 'random' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>랜덤 뽑기</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFridgeMode('manual')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                    fridgeMode === 'manual' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  <Hand className="w-3.5 h-3.5" />
                  <span>직접 고르기</span>
                </button>
              </div>
            </div>

            {/* 3 Selected Ingredient Slots Display */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[0, 1, 2].map((slotIdx) => {
                const item = currentIngredients[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={`h-28 rounded-2xl border-2 p-2 flex flex-col items-center justify-center text-center transition-all ${
                      item
                        ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                        : 'bg-stone-50 border-dashed border-stone-200 text-stone-400'
                    }`}
                  >
                    {item ? (
                      <>
                        <span className="text-3xl filter drop-shadow-xs">{item.emoji}</span>
                        <strong className="text-xs font-black text-stone-900 mt-1 line-clamp-1">
                          {item.name}
                        </strong>
                        <span className="text-[10px] text-stone-500 font-medium line-clamp-1">
                          {item.category}
                        </span>
                        {item.isProcessed && (
                          <span className="text-[9px] bg-rose-100 text-rose-700 px-1 rounded-xs font-bold mt-0.5">
                            가공식품
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-xl opacity-40">?</span>
                        <span className="text-[11px] font-bold text-stone-400 mt-1">
                          재료 {slotIdx + 1}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mode-specific actions */}
            {fridgeMode === 'random' ? (
              <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-200 text-center space-y-3">
                <p className="text-xs text-sky-900 font-medium">
                  냉장고 문을 열고 맛있는 요리를 위한 <strong className="text-stone-900">3가지 재료</strong>를 랜덤으로 뽑아보세요!
                </p>

                <button
                  type="button"
                  onClick={handleRandomDrawFridge}
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-extrabold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Dices className="w-4 h-4" />
                  <span>{currentIngredients.length === 3 ? '새로운 3종 재료 다시 뽑기' : '냉장고 재료 3종 뽑기'}</span>
                </button>
              </div>
            ) : (
              /* Manual Selection Pantry */
              <div className="space-y-2.5">
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                  {['전체', '채소', '육류·가공', '수산', '곡류·기타', '유제품·달걀'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveFridgeCategory(cat)}
                      className={`px-2 py-0.5 rounded-full shrink-0 font-bold transition-colors cursor-pointer ${
                        activeFridgeCategory === cat
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-44 overflow-y-auto p-1.5 bg-stone-50 rounded-xl border border-stone-200">
                  {filteredIngredients.map((item) => {
                    const isSelected = currentIngredients.some((i) => i.id === item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleManualIngredient(item)}
                        className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-amber-200 border-amber-500 shadow-xs scale-102 font-black text-amber-950'
                            : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <span className="text-xl">{item.emoji}</span>
                        <span className="text-[10px] truncate max-w-full font-bold">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-500 text-center font-medium">
                  💡 냉장고 선반에서 원하는 재료를 3개 골라보세요.
                </p>
              </div>
            )}
          </div>

          {/* Redraw 1/1 Strip */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              onClick={handleRedrawFridge}
              disabled={recipe.redrawCounts.ingredient >= 1 || currentIngredients.length < 3}
              className={`font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
                recipe.redrawCounts.ingredient >= 1
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-sky-100 text-sky-900 hover:bg-sky-200 active:scale-95 cursor-pointer'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>재료 다시 뽑기 ({1 - recipe.redrawCounts.ingredient}/1)</span>
            </button>
            <span className="text-[11px] text-stone-400 font-medium">1회 한정</span>
          </div>
        </div>

        {/* CARD 2: Cooking Method Card - spans 3 cols */}
        <div className="lg:col-span-3 flex flex-col">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2 text-center">
            조리 방법 카드
          </span>

          <motion.div
            onClick={handleMethodClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full min-h-[460px] rounded-3xl cursor-pointer p-6 border-3 transition-all flex flex-col justify-between relative shadow-lg ${
              !flipped.method
                ? 'bg-gradient-to-br from-rose-600 via-red-600 to-amber-700 border-rose-400 text-white shadow-rose-500/20'
                : 'bg-white border-rose-400 text-stone-900 shadow-stone-200'
            }`}
          >
            {!flipped.method ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black text-white shadow-inner animate-pulse">
                  ?
                </div>
                <h3 className="text-xl font-black tracking-wide">조리법 카드</h3>
                <p className="text-xs text-rose-100 font-medium">클릭하여 뒤집기</p>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      {recipe.drawnMethod?.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (recipe.drawnMethod) setSelectedMethodDetail(recipe.drawnMethod);
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-md"
                      title="조리법 정의 자세히 보기"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-6xl block mb-2 filter drop-shadow">
                      {recipe.drawnMethod?.icon || '🔥'}
                    </span>
                    <h3 className="text-2xl font-black text-stone-900">
                      {recipe.drawnMethod?.name || '굽기'}
                    </h3>
                    <p className="text-xs text-stone-700 font-bold mt-1">
                      매체: {recipe.drawnMethod?.medium}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                      {recipe.drawnMethod?.definition}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={handleRedrawMethod}
                    disabled={recipe.redrawCounts.method >= 1}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
                      recipe.redrawCounts.method >= 1
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-rose-100 text-rose-900 hover:bg-rose-200 active:scale-95 cursor-pointer'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>다시 뽑기 ({1 - recipe.redrawCounts.method}/1)</span>
                  </button>
                  <span className="text-[11px] text-stone-400 font-medium">1회 한정</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* CARD 3: Mission Card - spans 3 cols */}
        <div className="lg:col-span-3 flex flex-col">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2 text-center">
            도전 미션 카드
          </span>

          <motion.div
            onClick={handleMissionClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full min-h-[460px] rounded-3xl cursor-pointer p-6 border-3 transition-all flex flex-col justify-between relative shadow-lg ${
              !flipped.mission
                ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 border-emerald-300 text-white shadow-emerald-500/20'
                : 'bg-white border-emerald-400 text-stone-900 shadow-stone-200'
            }`}
          >
            {!flipped.mission ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black text-white shadow-inner animate-pulse">
                  ?
                </div>
                <h3 className="text-xl font-black tracking-wide">미션 카드</h3>
                <p className="text-xs text-emerald-100 font-medium">클릭하여 뒤집기</p>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      도전 미션
                    </span>
                    <span className="text-emerald-600 text-xs font-bold">★ MISSION</span>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-6xl block mb-2 filter drop-shadow">
                      {recipe.drawnMission?.icon || '🎯'}
                    </span>
                    <h3 className="text-xl font-black text-stone-900">
                      {recipe.drawnMission?.title || '10분 안에 만들기'}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {recipe.drawnMission?.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={handleRedrawMission}
                    disabled={recipe.redrawCounts.mission >= 1}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
                      recipe.redrawCounts.mission >= 1
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 active:scale-95 cursor-pointer'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>다시 뽑기 ({1 - recipe.redrawCounts.mission}/1)</span>
                  </button>
                  <span className="text-[11px] text-stone-400 font-medium">1회 한정</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Summary Box when all cards are revealed */}
      <AnimatePresence>
        {allReady && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl"
          >
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-xs mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>우리 모둠의 최종 요리 미션 완성!</span>
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-4">
                우리 모둠의 연구 과제
              </h3>

              {/* 3 Summary Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2.5">
                  <span className="text-2xl">🧊</span>
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-stone-500 block">냉장고 재료 3종</span>
                    <strong className="text-xs sm:text-sm text-stone-900 line-clamp-1">
                      {currentIngredients.map((i) => i.name).join(', ')}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2.5">
                  <span className="text-2xl">{recipe.drawnMethod?.icon}</span>
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-stone-500 block">조리법</span>
                    <strong className="text-sm sm:text-base text-stone-900">{recipe.drawnMethod?.name}</strong>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2.5">
                  <span className="text-2xl">{recipe.drawnMission?.icon}</span>
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-stone-500 block">도전 미션</span>
                    <strong className="text-xs sm:text-sm text-stone-900 line-clamp-1">{recipe.drawnMission?.title}</strong>
                  </div>
                </div>
              </div>

              {/* Key Inquiry Question */}
              <div className="my-5 p-4 rounded-2xl bg-white/80 border border-amber-200">
                <p className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">
                  생각 열기 질문
                </p>
                <p className="text-lg sm:text-2xl font-black text-rose-700 tracking-tight">
                  “이 3가지 재료와 [{recipe.drawnMethod?.name}] 조리법으로 어떤 음식을 만들 수 있을까?”
                </p>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  냉장고 속 3가지 식재료의 특징을 살려, 지정된 조리법으로 만들 최고의 신메뉴를 계획해 보세요!
                </p>
              </div>

              <button
                onClick={onProceedToRecipe}
                className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-lg shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>레시피 연구소 입장하기</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cooking Method Definition Modal */}
      {selectedMethodDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedMethodDetail.icon}</span>
                <h3 className="text-xl font-black text-stone-900">
                  {selectedMethodDetail.name} ({selectedMethodDetail.category})
                </h3>
              </div>
              <button
                onClick={() => setSelectedMethodDetail(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-stone-700">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900 block text-xs mb-0.5">정의</span>
                <p>{selectedMethodDetail.definition}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900 block text-xs mb-0.5">열전달 매체 및 특징</span>
                <p>매체: {selectedMethodDetail.medium}</p>
                <p className="mt-1 text-stone-600 text-xs">{selectedMethodDetail.features}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900 block text-xs mb-0.5">대표 음식 예</span>
                <p className="text-xs text-rose-700 font-medium">
                  {selectedMethodDetail.examples.join(', ')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedMethodDetail(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-sm cursor-pointer"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StepId, TeamRecipe } from './types';
import { INITIAL_INGREDIENTS, Ingredient } from './data/ingredients';
import { COOKING_METHODS, CookingMethod } from './data/cookingMethods';
import { INITIAL_MISSIONS, Mission } from './data/missions';
import { Navbar } from './components/Navbar';
import { Step1GroupStart } from './components/Step1GroupStart';
import { Step2CardDraw } from './components/Step2CardDraw';
import { Step3RecipeLab } from './components/Step3RecipeLab';
import { Step4AdditiveDetective } from './components/Step4AdditiveDetective';
import { Step6FinalMenuCard } from './components/Step6FinalMenuCard';
import { ClassroomBoardModal } from './components/ClassroomBoardModal';
import { TeacherAdminModal } from './components/TeacherAdminModal';

const STORAGE_KEY_CURRENT_RECIPE = 'cooking_lab_current_recipe_v1';
const STORAGE_KEY_SAVED_TEAMS = 'cooking_lab_saved_teams_v1';
const STORAGE_KEY_INGREDIENTS = 'cooking_lab_ingredients_v1';
const STORAGE_KEY_METHODS = 'cooking_lab_methods_v1';
const STORAGE_KEY_MISSIONS = 'cooking_lab_missions_v1';

const createDefaultRecipe = (teamName = '', members = ''): TeamRecipe => ({
  id: `team-${Date.now()}`,
  teamName,
  members,
  createdAt: new Date().toISOString(),
  drawnIngredient: null,
  drawnMethod: null,
  drawnMission: null,
  redrawCounts: {
    ingredient: 0,
    method: 0,
    mission: 0,
  },
  menuName: '',
  mainIngredients: '',
  extraIngredients: '',
  utensils: '프라이팬, 뒤집개, 칼, 도마, 접시, 계량스푼',
  cookingTimeMinutes: 15,
  steps: [],
  checklist: {
    measuring: false,
    trimming: false,
    washing: false,
    cutting: false,
    heating: false,
    seasoning: false,
    serving: false,
    cleaning: false,
  },
  methodReason: '',
  additiveResult: {
    hasProcessedFood: false,
    selectedProcessedFoods: [],
    chosenAdditives: [],
    reductionPlan: '',
    appliedToRecipe: false,
  },
  aiImageUrl: null,
  aiPromptUsed: '',
  aiVerification: {
    ingredientsMatch: false,
    methodMatch: false,
    appearanceMatch: false,
    recipeConsistency: false,
    feasibility: false,
    feedbackNote: '',
  },
  isCompleted: false,
});

// Exemplar sample recipes for teacher demo
const SAMPLE_EXEMPLAR_TEAMS: TeamRecipe[] = [
  {
    id: 'sample-1',
    teamName: '1모둠 (바삭연구소)',
    members: '김민준, 박서연, 이도현',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    drawnIngredients: [INITIAL_INGREDIENTS[0], INITIAL_INGREDIENTS[7], INITIAL_INGREDIENTS[17]], // 감자, 양파, 치즈
    drawnIngredient: INITIAL_INGREDIENTS[0], // 감자
    drawnMethod: COOKING_METHODS[8], // 굽기
    drawnMission: INITIAL_MISSIONS[0], // 10분 안에 만들기
    redrawCounts: { ingredient: 1, method: 0, mission: 0 },
    menuName: '감자 바삭구이',
    mainIngredients: '감자 2개, 양파 1/2개, 슬라이스 치즈 1장',
    extraIngredients: '파슬리 가루 약간, 올리브유 1큰술',
    utensils: '프라이팬, 칼, 도마, 계량스푼, 뒤집개',
    cookingTimeMinutes: 10,
    steps: [
      { id: 's1', order: 1, description: '감자를 깨끗이 씻고 껍질째 0.5cm 두께로 얇게 썬다.' },
      { id: 's2', order: 2, description: '키친타월로 감자 표면의 수분을 닦아낸다.' },
      { id: 's3', order: 3, description: '달군 팬에 기름을 얇게 두르고 감자와 양파를 겹치지 않게 올린다.' },
      { id: 's4', order: 4, description: '중불에서 4~5분간 노릇하게 구운 뒤 뒤집어 치즈를 올리고 녹인다.' },
      { id: 's5', order: 5, description: '파슬리를 솔솔 뿌려 접시에 정갈하게 담아낸다.' },
    ],
    checklist: {
      measuring: true,
      trimming: true,
      washing: true,
      cutting: true,
      heating: true,
      seasoning: true,
      serving: true,
      cleaning: true,
    },
    methodReason: '얇게 썰어 센 열로 직접 구우면 10분 이내에 속까지 익고 겉면의 바삭한 식감을 살릴 수 있어서 선택했습니다.',
    additiveResult: {
      hasProcessedFood: false,
      selectedProcessedFoods: [],
      chosenAdditives: [],
      reductionPlan: '신선한 통감자와 천연 치즈를 사용하여 건강하게 조리',
      appliedToRecipe: true,
    },
    aiImageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200&auto=format&fit=crop&q=85',
    aiImageSource: 'photorealistic-culinary',
    aiPromptUsed: 'Ultra-realistic 4K commercial food photography of crispy roasted herb potatoes with melted cheese...',
    aiVerification: {
      ingredientsMatch: true,
      methodMatch: true,
      appearanceMatch: true,
      recipeConsistency: true,
      feasibility: true,
      feedbackNote: '',
    },
    isCompleted: true,
  },
  {
    id: 'sample-2',
    teamName: '2모둠 (단백질마스터)',
    members: '최지우, 강하늘, 윤서진',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    drawnIngredients: [INITIAL_INGREDIENTS[3], INITIAL_INGREDIENTS[2], INITIAL_INGREDIENTS[7]], // 두부, 달걀, 양파
    drawnIngredient: INITIAL_INGREDIENTS[3], // 두부
    drawnMethod: COOKING_METHODS[6], // 부치기
    drawnMission: INITIAL_MISSIONS[2], // 밥과 잘 어울리는 반찬
    redrawCounts: { ingredient: 0, method: 0, mission: 0 },
    menuName: '두부 간장구이 (부침)',
    mainIngredients: '부침용 두부 1모, 달걀 1개, 양파 1/4개',
    extraIngredients: '들기름 1큰술, 양념간장 2큰술, 통깨, 쪽파',
    utensils: '프라이팬, 뒤집개, 칼, 도마, 양념 종지',
    cookingTimeMinutes: 15,
    steps: [
      { id: 's1', order: 1, description: '두부를 1cm 두께로 네모나게 썰어 키친타월로 물기를 뺀다.' },
      { id: 's2', order: 2, description: '간장, 참기름, 쪽파, 고춧가루를 섞어 양념장을 만든다.' },
      { id: 's3', order: 3, description: '팬에 들기름을 두르고 달걀옷을 입힌 두부를 중약불에서 노릇하게 지진다.' },
      { id: 's4', order: 4, description: '양면이 노릇해지면 양념간장을 곁들여 상을 차린다.' },
    ],
    checklist: {
      measuring: true,
      trimming: false,
      washing: true,
      cutting: true,
      heating: true,
      seasoning: true,
      serving: true,
      cleaning: true,
    },
    methodReason: '기름을 적당히 두르고 중약불에서 지지면 표면은 바삭하고 속은 부드러운 두부의 고소한 풍미가 극대화되기 때문입니다.',
    additiveResult: {
      hasProcessedFood: false,
      selectedProcessedFoods: [],
      chosenAdditives: [],
      reductionPlan: '천연 콩 두부와 자연 발효 간장 사용',
      appliedToRecipe: true,
    },
    aiImageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=85',
    aiImageSource: 'photorealistic-culinary',
    aiPromptUsed: 'Pan-seared golden tofu patties with savory dipping sauce and spring onions...',
    aiVerification: {
      ingredientsMatch: true,
      methodMatch: true,
      appearanceMatch: true,
      recipeConsistency: true,
      feasibility: true,
      feedbackNote: '',
    },
    isCompleted: true,
  },
];

export default function App() {
  // Current active recipe
  const [activeRecipe, setActiveRecipe] = useState<TeamRecipe>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_RECIPE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return createDefaultRecipe();
  });

  // Classroom saved teams
  const [savedTeams, setSavedTeams] = useState<TeamRecipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_TEAMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_EXEMPLAR_TEAMS;
  });

  // Card dataset states
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_INGREDIENTS;
  });

  const [cookingMethods, setCookingMethods] = useState<CookingMethod[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_METHODS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return COOKING_METHODS;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MISSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MISSIONS;
  });

  // Current Step
  const [currentStep, setCurrentStep] = useState<StepId>(() => {
    if (activeRecipe.teamName) {
      if (activeRecipe.isCompleted) return 'final-menu';
      if (activeRecipe.steps && activeRecipe.steps.length > 0) return 'recipe';
      if (activeRecipe.drawnIngredient || (activeRecipe.drawnIngredients && activeRecipe.drawnIngredients.length > 0)) return 'cards';
    }
    return 'start';
  });

  // Modals
  const [isClassroomBoardOpen, setIsClassroomBoardOpen] = useState(false);
  const [isTeacherAdminOpen, setIsTeacherAdminOpen] = useState(false);

  // Sync activeRecipe to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_RECIPE, JSON.stringify(activeRecipe));
    } catch (e) {
      console.error('Failed to save current recipe to localStorage', e);
    }
  }, [activeRecipe]);

  // Sync savedTeams to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_TEAMS, JSON.stringify(savedTeams));
    } catch (e) {
      console.error('Failed to save teams to localStorage', e);
    }
  }, [savedTeams]);

  // Sync ingredients to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(ingredients));
    } catch (e) {}
  }, [ingredients]);

  // Sync methods to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_METHODS, JSON.stringify(cookingMethods));
    } catch (e) {}
  }, [cookingMethods]);

  // Sync missions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(missions));
    } catch (e) {}
  }, [missions]);

  // Auto-save completed recipe into savedTeams pool
  const saveCurrentRecipeToClassroomPool = (recipe: TeamRecipe) => {
    setSavedTeams((prev) => {
      const existingIdx = prev.findIndex((t) => t.id === recipe.id || t.teamName === recipe.teamName);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = recipe;
        return copy;
      }
      return [recipe, ...prev];
    });
  };

  // Start new team
  const handleStartTeam = (teamName: string, members: string) => {
    setActiveRecipe((prev) => ({
      ...prev,
      teamName,
      members,
    }));
    setCurrentStep('cards');
  };

  // Reset current team with confirm
  const handleResetTeam = () => {
    if (window.confirm('새로운 모둠 활동을 시작하시겠습니까? 현재 모둠의 내용은 저장 목록에 보관됩니다.')) {
      if (activeRecipe.teamName && activeRecipe.menuName) {
        saveCurrentRecipeToClassroomPool(activeRecipe);
      }
      const newRecipe = createDefaultRecipe();
      setActiveRecipe(newRecipe);
      setCurrentStep('start');
    }
  };

  // Delete team from teacher control
  const handleDeleteTeam = (teamId: string) => {
    setSavedTeams((prev) => prev.filter((t) => t.id !== teamId));
  };

  // Complete wipe (Whole class reset)
  const handleResetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_CURRENT_RECIPE);
    localStorage.removeItem(STORAGE_KEY_SAVED_TEAMS);
    localStorage.removeItem(STORAGE_KEY_INGREDIENTS);
    localStorage.removeItem(STORAGE_KEY_METHODS);
    localStorage.removeItem(STORAGE_KEY_MISSIONS);

    setActiveRecipe(createDefaultRecipe());
    setSavedTeams(SAMPLE_EXEMPLAR_TEAMS);
    setIngredients(INITIAL_INGREDIENTS);
    setCookingMethods(COOKING_METHODS);
    setMissions(INITIAL_MISSIONS);
    setCurrentStep('start');
  };

  const hasDrawnCards =
    !!activeRecipe.drawnIngredient &&
    !!activeRecipe.drawnMethod &&
    !!activeRecipe.drawnMission;

  return (
    <div className="min-h-screen bg-[#fdfaf4] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        onNavigate={(step) => setCurrentStep(step)}
        onOpenClassroomBoard={() => setIsClassroomBoardOpen(true)}
        onOpenTeacherAdmin={() => setIsTeacherAdminOpen(true)}
        onResetTeam={handleResetTeam}
        teamName={activeRecipe.teamName}
        hasDrawnCards={hasDrawnCards}
      />

      {/* Main Body */}
      <main className="flex-1 pb-16">
        {currentStep === 'start' && (
          <Step1GroupStart
            initialTeamName={activeRecipe.teamName}
            initialMembers={activeRecipe.members}
            onStart={handleStartTeam}
            onOpenClassroomBoard={() => setIsClassroomBoardOpen(true)}
          />
        )}

        {currentStep === 'cards' && (
          <Step2CardDraw
            recipe={activeRecipe}
            availableIngredients={ingredients}
            availableMethods={cookingMethods}
            availableMissions={missions}
            onUpdateRecipe={setActiveRecipe}
            onProceedToRecipe={() => setCurrentStep('recipe')}
          />
        )}

        {currentStep === 'recipe' && (
          <Step3RecipeLab
            recipe={activeRecipe}
            onUpdateRecipe={setActiveRecipe}
            onProceed={() => setCurrentStep('additives')}
            onBack={() => setCurrentStep('cards')}
          />
        )}

        {currentStep === 'additives' && (
          <Step4AdditiveDetective
            recipe={activeRecipe}
            onUpdateRecipe={setActiveRecipe}
            onProceed={() => {
              setActiveRecipe((prev) => {
                const completed = { ...prev, isCompleted: true };
                saveCurrentRecipeToClassroomPool(completed);
                return completed;
              });
              setCurrentStep('final-menu');
            }}
            onBack={() => setCurrentStep('recipe')}
          />
        )}

        {currentStep === 'final-menu' && (
          <Step6FinalMenuCard
            recipe={activeRecipe}
            onOpenClassroomBoard={() => setIsClassroomBoardOpen(true)}
            onEditRecipe={() => setCurrentStep('recipe')}
          />
        )}
      </main>

      {/* Modals */}
      <ClassroomBoardModal
        isOpen={isClassroomBoardOpen}
        onClose={() => setIsClassroomBoardOpen(false)}
        recipes={savedTeams}
      />

      <TeacherAdminModal
        isOpen={isTeacherAdminOpen}
        onClose={() => setIsTeacherAdminOpen(false)}
        ingredients={ingredients}
        cookingMethods={cookingMethods}
        missions={missions}
        savedTeams={savedTeams}
        onUpdateIngredients={setIngredients}
        onUpdateMethods={setCookingMethods}
        onUpdateMissions={setMissions}
        onDeleteTeam={handleDeleteTeam}
        onResetAllData={handleResetAllData}
        onOpenClassroomBoard={() => {
          setIsTeacherAdminOpen(false);
          setIsClassroomBoardOpen(true);
        }}
      />
    </div>
  );
}

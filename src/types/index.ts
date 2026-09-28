import { Ingredient } from '../data/ingredients';
import { CookingMethod } from '../data/cookingMethods';

export type StepId = 
  | 'start'              // 모둠 시작
  | 'cards'              // 냉장고 재료 & 카드 뽑기
  | 'recipe'             // 레시피 연구소
  | 'additives'          // 식품 첨가물 탐정
  | 'final-menu';        // 최종 메뉴 완성

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeColor: string;
  evaluationFocus: string;
}

export interface AdditiveInfo {
  type: string;
  purpose: string;
  examples: string[];
  foodUses: string[];
  reductionMethod?: string;
}

export interface CookingChecklist {
  measuring: boolean;    // 계량
  trimming: boolean;     // 다듬기
  washing: boolean;      // 씻기
  cutting: boolean;      // 썰기
  heating: boolean;      // 가열하기
  seasoning: boolean;    // 맛내기
  serving: boolean;      // 상차림
  cleaning: boolean;     // 뒷정리
}

export interface RecipeStepItem {
  id: string;
  order: number;
  description: string;
  phaseCategory?: '준비' | '손질' | '가열' | '맛내기' | '마무리';
}

export interface AdditiveDetectiveResult {
  hasProcessedFood: boolean;
  selectedProcessedFoods: string[];
  chosenAdditives: string[];
  reductionPlan: string;
  appliedToRecipe: boolean;
}

export interface AiVerification {
  ingredientsMatch: boolean;       // 재료가 맞다
  methodMatch: boolean;            // 조리법이 맞게 표현되었다
  appearanceMatch: boolean;        // 음식의 형태가 적절하다
  recipeConsistency: boolean;      // 레시피와 이미지가 일치한다
  feasibility: boolean;            // 실제로 만들 수 있을 것 같다
  feedbackNote: string;            // 수정해야 할 점
}

export interface TeamRecipe {
  id: string;
  teamName: string;
  members: string;
  createdAt: string;

  // Drawn Cards
  drawnIngredients?: Ingredient[]; // 냉장고에서 선택되거나 뽑힌 재료 3개
  drawnIngredient: Ingredient | null;
  drawnMethod: CookingMethod | null;
  drawnMission: Mission | null;
  redrawCounts: {
    ingredient: number; // max 1
    method: number;     // max 1
    mission: number;    // max 1
  };
  aiImageSource?: 'imagen-3' | 'photorealistic-culinary';
  aiImageVariations?: string[];

  // Recipe Details
  menuName: string;
  mainIngredients: string;
  extraIngredients: string;
  utensils: string;
  cookingTimeMinutes: number;
  steps: RecipeStepItem[];
  checklist: CookingChecklist;
  methodReason: string;

  // Additives
  additiveResult: AdditiveDetectiveResult;

  // AI Food Designer
  aiImageUrl: string | null;
  aiPromptUsed: string;
  aiVerification: AiVerification;
  aiGeneratedAt?: string;

  // Submission Status
  isCompleted: boolean;
}

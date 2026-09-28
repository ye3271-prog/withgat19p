import { AdditiveInfo } from '../types';

export interface ProcessedFoodReductionGuide {
  foodName: string;
  category: string;
  icon: string;
  suspectedAdditives: string[];
  reductionMethod: string;
  actionTitle: string;
  reason: string;
}

export const ADDITIVES_ENCYCLOPEDIA: AdditiveInfo[] = [
  {
    type: '보존료',
    purpose: '미생물의 번식을 막아 제품의 신선도와 영양을 오래 유지',
    examples: ['소르브산', '안식향산', '데히드로초산'],
    foodUses: ['햄', '소시지', '어묵', '치즈', '절임식품'],
    reductionMethod: '끓는 물에 2~3분 데치거나, 찬물에 헹구어 표면의 방부 성분을 씻어냄',
  },
  {
    type: '향미 증진제',
    purpose: '식품의 맛과 향을 좋게 함 (감칠맛 부여)',
    examples: ['L-글루탐산 나트륨 (MSG)', '5\'-이노신산이나트륨', '5\'-구아닐산이나트륨'],
    foodUses: ['라면', '통조림', '카레', '음료류', '스낵류'],
    reductionMethod: '라면 면을 먼저 삶아 물을 버리거나, 천연 육수(멸치, 다시마)로 맛을 보충',
  },
  {
    type: '감미료',
    purpose: '설탕 대신 적은 양으로 강한 단맛을 냄',
    examples: ['아스파탐', '사카린 나트륨', '수크랄로스', '아세설팜칼륨'],
    foodUses: ['음료류', '과자류', '빙과류', '발효유'],
    reductionMethod: '인공감미료 첨가 가공 음료 대신 물, 보리차나 천연 생과일 섭취',
  },
  {
    type: '착색료',
    purpose: '식품에 특정 색을 띠게 하여 먹음직스럽게 함',
    examples: ['타르 색소 (식용색소 황색 4호, 적색 40호 등)', '캐러멜 색소'],
    foodUses: ['주스', '과자류', '탄산음료', '사탕', '빙과류'],
    reductionMethod: '찬물에 담가 색소를 우려내거나, 인공색소 무첨가 제품 선택',
  },
  {
    type: '향료',
    purpose: '식품 본래의 향을 유지하거나 특유의 향이 나게 함',
    examples: ['바닐라향', '오렌지향', '레몬향', '딸기향 등 합성향료'],
    foodUses: ['음료류', '아이스크림', '사탕', '제과류'],
    reductionMethod: '천연 레몬즙이나 허브, 신선한 과일 껍질 등 천연 식재료로 향 대체',
  },
  {
    type: '발색제',
    purpose: '식품의 색소와 결합하여 고기의 붉은색을 안정시키거나 선명하게 함',
    examples: ['아질산나트륨', '질산나트륨', '질산칼륨'],
    foodUses: ['햄', '소시지', '베이컨', '어묵'],
    reductionMethod: '칼집을 낸 후 끓는 물에 2~3분 데쳐내면 수용성 발색제 성분이 용출되어 배출됨',
  },
];

export const PROCESSED_FOOD_REDUCTION_GUIDES: ProcessedFoodReductionGuide[] = [
  {
    foodName: '햄·소시지·어묵',
    category: '육가공·어육제품',
    icon: '🥓',
    suspectedAdditives: ['발색제 (아질산나트륨)', '보존료 (소르브산)', '향미 증진제'],
    reductionMethod: '끓는 물에 2~3분 정도 데친다.',
    actionTitle: '🔥 끓는 물에 2~3분 데치기',
    reason: '아질산나트륨과 소르브산 등은 열과 물에 녹아 나오므로, 칼집을 내어 데치면 첨가물과 지방을 동시에 줄일 수 있습니다.',
  },
  {
    foodName: '통조림 (참치, 옥수수, 햄)',
    category: '통조림 제품',
    icon: '🥫',
    suspectedAdditives: ['보존료', '산화방지제', '향미 증진제'],
    reductionMethod: '국물은 버리고 조리한다.',
    actionTitle: '🥫 국물 버리고 조리하기',
    reason: '통조림 내부의 기름과 국물에 첨가물 및 방부 성분이 녹아있으므로, 내용물만 체에 밭쳐 국물을 버리고 헹굽니다.',
  },
  {
    foodName: '라면',
    category: '유탕면류',
    icon: '🍜',
    suspectedAdditives: ['향미 증진제 (L-글루탐산나트륨)', '유화제', '산도조절제'],
    reductionMethod: '면 삶은 물은 버리고, 수프만 따로 끓인 물에 삶은 면을 넣어 다시 끓인다.',
    actionTitle: '🍜 면 삶은 물 버리고 다시 끓이기',
    reason: '면을 튀길 때 사용한 산화된 기름과 면발의 첨가물이 삶은 물에 배어 나오므로 1차 삶은 물을 버리는 것이 좋습니다.',
  },
  {
    foodName: '식빵',
    category: '제빵류',
    icon: '🍞',
    suspectedAdditives: ['보존료 (프로피온산칼슘)', '유화제', '팽창제'],
    reductionMethod: '구워 먹는다.',
    actionTitle: '🍞 구워 먹기',
    reason: '토스터기나 팬에 노릇하게 구우면 보존료 성분이 열에 의해 일부 휘발되어 첨가물 섭취량을 줄일 수 있습니다.',
  },
  {
    foodName: '단무지·피클',
    category: '절임식품',
    icon: '🥒',
    suspectedAdditives: ['착색료 (황색 4호 등)', '보존료', '감미료 (사카린 등)'],
    reductionMethod: '찬물에 5분 이상 담갔다가 먹는다.',
    actionTitle: '🥒 찬물에 5분 이상 담그기',
    reason: '단무지의 노란 인공 색소나 방부제, 과도한 나트륨과 감미료가 물에 우러나와 훨씬 깔끔하고 건강하게 먹을 수 있습니다.',
  },
];

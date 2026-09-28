export interface CookingMethod {
  id: string;
  name: string;
  category: '생조리' | '가열조리';
  medium: string; // 열전달 매체 (물, 수증기, 기름, 공기/직접열 등)
  definition: string;
  features: string;
  examples: string[];
  visualCue: string; // AI 이미지 및 시각적 특징
  icon: string;
  color: string;
}

export const COOKING_METHODS: CookingMethod[] = [
  {
    id: 'raw',
    name: '생조리',
    category: '생조리',
    medium: '가열 없음 (물리적 손질·양념)',
    definition: '식품을 가열하지 않고 손질하고 양념하여 조리하는 방법',
    features: '열에 약한 비타민 C 등 수용성 비타민 파괴를 막고, 신선하고 아삭한 식감과 천연 풍미를 살림',
    examples: ['샐러드', '생채', '회', '장아찌'],
    visualCue: '신선한 천연 색감, 소스와 버무려진 아삭한 형태',
    icon: '🥗',
    color: 'from-emerald-500 to-green-600',
  },
  {
    id: 'boil',
    name: '끓이기(삶기)',
    category: '가열조리',
    medium: '물 (100℃ 액체)',
    definition: '식품을 물에 넣고 가열하여 익히는 방법',
    features: '식품의 조직이 부드러워지고 소화 흡수가 잘 됨. 국물에 맛과 영양 성분이 우러나옴',
    examples: ['된장찌개', '수육', '감자 삶기', '달걀 완숙'],
    visualCue: '자작하거나 풍성한 맑은/진한 국물, 촉촉하고 부드럽게 익은 식감',
    icon: '🍲',
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'blanch',
    name: '데치기',
    category: '가열조리',
    medium: '끓는 물 (짧은 시간 접촉)',
    definition: '식품을 끓는 물에서 짧은 시간에 살짝 익히는 방법',
    features: '채소의 선명한 초록빛을 살리고 아삭한 식감을 유지하며, 가공육의 첨가물이나 떫은 맛을 제거함',
    examples: ['시금치 나물', '브로콜리 숙회', '소시지 데치기'],
    visualCue: '선명하고 또렷한 색감, 살짝 익어 숨이 죽었으나 싱싱한 형태',
    icon: '🥬',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'steam',
    name: '찌기',
    category: '가열조리',
    medium: '수증기 (기체 열전달)',
    definition: '물을 가열하여 생긴 수증기로 식품을 익히는 방법',
    features: '식품이 물에 직접 닿지 않아 수용성 영양소 손실이 적고, 본래의 형태와 맛을 고스란히 보존함',
    examples: ['고구마 찜', '계란찜', '만두', '생선찜'],
    visualCue: '수증기 김이 피어오르고 촉촉하며 부서지지 않은 고운 형태',
    icon: '🥟',
    color: 'from-cyan-500 to-sky-600',
  },
  {
    id: 'braise',
    name: '조리기',
    category: '가열조리',
    medium: '양념 국물 (서서히 농축)',
    definition: '식품에 양념을 넣고 센 불로 끓이다가 약한 불에서 오래 끓여 국물이 졸아들 때까지 가열하는 방법',
    features: '양념이 재료 속까지 깊게 배어들어 진한 감칠맛과 윤기를 띰',
    examples: ['감자조림', '고등어조림', '두부조림', '장조림'],
    visualCue: '진한 갈색/붉은 양념이 코팅되어 윤기가 흐르는 자작한 국물',
    icon: '🥘',
    color: 'from-amber-600 to-orange-700',
  },
  {
    id: 'stir_fry',
    name: '볶기',
    category: '가열조리',
    medium: '적은 양의 기름 + 센 불',
    definition: '프라이팬에 적은 양의 기름을 두르고 센 불에서 짧은 시간 가열하는 방법',
    features: '기름막이 영양소 유출을 방지하고 지용성 비타민의 흡수를 돕고, 고소한 풍미와 아삭함을 줌',
    examples: ['야채 볶음', '어묵 볶음', '제육 볶음', '볶음밥'],
    visualCue: '적은 기름으로 코팅된 윤기와 고소한 볶음 불향, 센 불에 살짝 익은 채소 단면',
    icon: '🍳',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'pan_fry',
    name: '부치기',
    category: '가열조리',
    medium: '적은 양의 기름 + 중약불 지지기',
    definition: '프라이팬에 적은 양의 기름을 두르고 지지는 방법',
    features: '표면은 바삭하고 속은 부드러운 상태(겉바속촉)를 만들며, 전이나 부침 요리에 쓰임',
    examples: ['두부 부침', '김치전', '감자전', '호박전'],
    visualCue: '평평하게 노릇노릇 지져진 겉면 골든 브라운 크러스트',
    icon: '🥞',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'deep_fry',
    name: '튀기기',
    category: '가열조리',
    medium: '많은 양의 끓는 기름 (160~180℃)',
    definition: '많은 양의 끓는 기름 속에서 단시간에 식품을 익히는 방법',
    features: '식품 표면의 수분이 증발하며 극도의 바삭한 튀김옷과 고소한 맛을 냄',
    examples: ['치킨', '감자튀김', '탕수육', '돈가스'],
    visualCue: '바삭바삭한 황금빛 튀김옷(골든 크런치)과 기름에 잘 튀겨진 질감',
    icon: '🍗',
    color: 'from-amber-500 to-red-500',
  },
  {
    id: 'grill',
    name: '굽기',
    category: '가열조리',
    medium: '직접열(팬, 석쇠) / 뜨거운 공기(오븐)',
    definition: '프라이팬, 석쇠 등으로 직접 익히거나 오븐의 뜨거운 공기로 익히는 방법',
    features: '식품 표면 단백질이 응고되어 육즙이 보존되고 숯불향이나 캐러멜화된 불맛이 일품',
    examples: ['고등어구이', '스테이크', '군고구마', '토스트'],
    visualCue: '석쇠 자국이나 오븐의 노릇한 그릴 마크, 바삭하고 진한 갈색 겉면',
    icon: '🔥',
    color: 'from-rose-500 to-red-600',
  },
];

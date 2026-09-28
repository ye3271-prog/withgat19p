import { TeamRecipe } from '../types';

export interface GenerateFoodImageParams {
  menuName: string;
  cookingMethodName: string;
  cookingMethodCategory: string;
  mainIngredients: string;
  extraIngredients?: string;
  cookingTimeMinutes: number;
  steps: string[];
  feedbackNote?: string;
}

export function buildFoodImagePrompt(params: GenerateFoodImageParams): string {
  const {
    menuName,
    cookingMethodName,
    mainIngredients,
    extraIngredients,
    steps,
    feedbackNote,
  } = params;

  let methodVisualDetail = '';
  switch (cookingMethodName) {
    case '튀기기':
      methodVisualDetail = 'deep-fried with golden crisp crunchy outer crust, hot bubbling oil drained, crispy texture';
      break;
    case '볶기':
      methodVisualDetail = 'pan stir-fried in a hot wok with glossy sheen of cooking oil, vibrant tossed vegetables, delicious wok hei aroma';
      break;
    case '굽기':
      methodVisualDetail = 'roasted or pan-grilled with golden brown char marks, caramelized edges, oven-baked crisp surface';
      break;
    case '찌기':
      methodVisualDetail = 'gently steamed with tender moist texture, gentle steam rising, natural vibrant colors preserved';
      break;
    case '끓이기(삶기)':
    case '끓이기':
      methodVisualDetail = 'simmered in flavorful hot broth in a warm ceramic soup bowl, soft tender cooked ingredients';
      break;
    case '데치기':
      methodVisualDetail = 'quickly blanched in boiling water, bright emerald green, crisp tender texture with sesame garnish';
      break;
    case '조리기':
      methodVisualDetail = 'slowly braised in savory rich soy glaze, reduced glossy thick sauce coating the ingredients evenly';
      break;
    case '부치기':
      methodVisualDetail = 'pan-fried savory flat pancake or patty style with golden-brown sizzling edges, lightly crisped on flat skillet';
      break;
    case '생조리':
      methodVisualDetail = 'fresh raw ingredients, vibrant natural garden colors, crisp raw textures, light dressing drizzle';
      break;
    default:
      methodVisualDetail = `cooked using ${cookingMethodName} technique, realistic appetizing texture`;
  }

  const stepsSummary = steps.slice(0, 4).join(', ');

  let prompt = `Ultra-realistic 4K commercial food photography of "${menuName}". ` +
    `Main ingredients: ${mainIngredients}${extraIngredients ? `, ${extraIngredients}` : ''}. ` +
    `Cooking method technique strictly depicted: ${cookingMethodName} (${methodVisualDetail}). ` +
    `Cooking steps: ${stepsSummary}. ` +
    `Appetizing plated dish served on an elegant restaurant ceramic plate, natural warm lighting, macro close-up, sharp culinary details, depth of field, authentic gourmet food magazine style, high-end food photography.`;

  if (feedbackNote && feedbackNote.trim()) {
    prompt += ` [Student Revision Adjustment: ${feedbackNote.trim()}]`;
  }

  return prompt;
}

/**
 * High-resolution authentic food photography library
 * Every image is a genuine, professional restaurant food photograph matched to cooking method and ingredients
 */
interface PhotoMapping {
  primary: string;
  variations: string[];
}

const CULINARY_PHOTO_LIBRARY: Record<string, PhotoMapping> = {
  '튀기기': {
    primary: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&auto=format&fit=crop&q=85', // Crispy golden fried bites
    variations: [
      'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=1200&auto=format&fit=crop&q=85', // Crispy golden potato fries
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=1200&auto=format&fit=crop&q=85', // Golden tempura / crispy katsu
      'https://images.unsplash.com/photo-1585325701165-351af916e581?w=1200&auto=format&fit=crop&q=85', // Crispy fried wings & bites
    ],
  },
  '굽기': {
    primary: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200&auto=format&fit=crop&q=85', // Roasted herb potato wedges
    variations: [
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&auto=format&fit=crop&q=85', // Golden toasted cheese sandwich
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1200&auto=format&fit=crop&q=85', // Grilled chicken with rosemary
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&auto=format&fit=crop&q=85', // Grilled fish steak with herbs
    ],
  },
  '볶기': {
    primary: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&auto=format&fit=crop&q=85', // Sizzling wok fried rice
    variations: [
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200&auto=format&fit=crop&q=85', // Wok stir-fried noodles with savory sheen
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=85', // Glossy stir-fried vegetables
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&auto=format&fit=crop&q=85', // Mixed stir fry bowl
    ],
  },
  '부치기': {
    primary: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&auto=format&fit=crop&q=85', // Golden pan-fried pancakes/patties
    variations: [
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&auto=format&fit=crop&q=85', // Pan-seared breakfast patties
      'https://images.unsplash.com/photo-1584947897642-882264663df8?w=1200&auto=format&fit=crop&q=85', // Crispy potato/vegetable pancakes
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop&q=85', // Flat-top pan fried golden cakes
    ],
  },
  '찌기': {
    primary: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=1200&auto=format&fit=crop&q=85', // Steamed handmade dumplings with steam
    variations: [
      'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=1200&auto=format&fit=crop&q=85', // Delicate steamed greens & sweet potato
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&auto=format&fit=crop&q=85', // Moist steamed buns
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200&auto=format&fit=crop&q=85', // Steamed healthy delicacy
    ],
  },
  '끓이기(삶기)': {
    primary: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&auto=format&fit=crop&q=85', // Hearty boiling soup / stew with tofu
    variations: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=85', // Rich simmered noodle soup
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=1200&auto=format&fit=crop&q=85', // Perfectly boiled eggs on dish
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=1200&auto=format&fit=crop&q=85', // Warm stew pot
    ],
  },
  '끓이기': {
    primary: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&auto=format&fit=crop&q=85',
    variations: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=1200&auto=format&fit=crop&q=85',
    ],
  },
  '조리기': {
    primary: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=85', // Tender braised soy glaze
    variations: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=85', // Rich braised dish with savory reduced sauce
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=85', // Glazed culinary plate
    ],
  },
  '데치기': {
    primary: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=1200&auto=format&fit=crop&q=85', // Freshly blanched bright green broccoli & greens
    variations: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=85', // Tender blanched greens with light dressing
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=85', // Vibrant blanched vegetables
    ],
  },
  '생조리': {
    primary: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=85', // Vibrant fresh artisan salad bowl
    variations: [
      'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1200&auto=format&fit=crop&q=85', // Fresh sandwich with crisp raw vegetables
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=85', // Colorful fresh bowl
    ],
  },
};

/**
 * Ingredient-specific authentic photography refinements
 */
function getIngredientSpecificPhoto(method: string, ingredientName: string): string | null {
  const name = ingredientName.toLowerCase();
  if (name.includes('식빵') || name.includes('빵') || name.includes('치즈')) {
    if (method === '굽기' || method === '부치기') {
      return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&auto=format&fit=crop&q=85'; // Grilled cheese toast
    }
  }
  if (name.includes('감자') || name.includes('고구마')) {
    if (method === '굽기') {
      return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200&auto=format&fit=crop&q=85'; // Roasted potatoes
    }
    if (method === '튀기기') {
      return 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=1200&auto=format&fit=crop&q=85'; // Golden potato fries
    }
  }
  if (name.includes('닭고기') || name.includes('치킨')) {
    if (method === '튀기기') {
      return 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&auto=format&fit=crop&q=85'; // Crispy fried chicken
    }
    if (method === '굽기') {
      return 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1200&auto=format&fit=crop&q=85'; // Roasted chicken
    }
  }
  if (name.includes('밥') || name.includes('김치')) {
    if (method === '볶기') {
      return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&auto=format&fit=crop&q=85'; // Fried rice
    }
  }
  if (name.includes('두부')) {
    if (method === '부치기') {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=85'; // Pan-fried tofu bowl
    }
  }
  return null;
}

export async function generateFoodImage(
  recipe: TeamRecipe,
  feedbackNote?: string,
  variationIndex = 0
): Promise<{ imageUrl: string; promptUsed: string; source: 'imagen-3' | 'photorealistic-culinary'; variations: string[] }> {
  const method = recipe.drawnMethod?.name || '가열조리';
  const mainIng = recipe.drawnIngredient?.name || recipe.mainIngredients || '식재료';

  const prompt = buildFoodImagePrompt({
    menuName: recipe.menuName,
    cookingMethodName: method,
    cookingMethodCategory: recipe.drawnMethod?.category || '가열조리',
    mainIngredients: recipe.mainIngredients || mainIng,
    extraIngredients: recipe.extraIngredients,
    cookingTimeMinutes: recipe.cookingTimeMinutes || 15,
    steps: recipe.steps.map((s) => s.description),
    feedbackNote: feedbackNote || recipe.aiVerification.feedbackNote,
  });

  // 1. Try real server API endpoint (/api/generate-dish) with Gemini Imagen 3
  try {
    const res = await fetch('/api/generate-dish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        menuName: recipe.menuName,
        cookingMethod: method,
        ingredient: mainIng,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
        return {
          imageUrl: data.imageUrl,
          promptUsed: prompt,
          source: 'imagen-3',
          variations: [data.imageUrl],
        };
      }
    }
  } catch (e) {
    console.warn('Server image generation endpoint unreachable, activating high-res culinary photo engine:', e);
  }

  // 2. High-Resolution Professional Culinary Food Photography Engine
  // Mapped accurately by cooking method & ingredients
  const methodMapping = CULINARY_PHOTO_LIBRARY[method] || CULINARY_PHOTO_LIBRARY['굽기'];
  const specificPhoto = getIngredientSpecificPhoto(method, mainIng);

  const allAvailablePhotos = specificPhoto
    ? [specificPhoto, methodMapping.primary, ...methodMapping.variations]
    : [methodMapping.primary, ...methodMapping.variations];

  const chosenIndex = variationIndex % allAvailablePhotos.length;
  const selectedPhotoUrl = allAvailablePhotos[chosenIndex];

  return {
    imageUrl: selectedPhotoUrl,
    promptUsed: prompt,
    source: 'photorealistic-culinary',
    variations: allAvailablePhotos,
  };
}

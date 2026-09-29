import { GoogleGenAI } from '@google/genai';
import { PlanResultData, BudgetBreakdownCategory, PlanItem } from './db';

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface RecommendationRequest {
  plan_type: 'home' | 'party' | 'jewelry';
  budget: number;
  [key: string]: any;
}

/**
 * Deterministic fallback generator when Gemini API is unavailable or budget cannot be parsed
 */
export function generateFallbackPlan(req: RecommendationRequest): PlanResultData {
  const budget = Math.max(1000, Number(req.budget) || 10000);
  const type = req.plan_type;

  if (type === 'home') {
    const furnitureBudget = Math.floor(budget * 0.35);
    const decorBudget = Math.floor(budget * 0.20);
    const diningBudget = Math.floor(budget * 0.18);
    const lightingBudget = Math.floor(budget * 0.15);
    const fansBudget = Math.floor(budget * 0.12);

    const breakdown: BudgetBreakdownCategory[] = [
      {
        category: 'Furniture',
        allocated_budget: furnitureBudget,
        percentage_of_budget: 35,
        items: [
          {
            name: `${req.style || 'Modern'} Comfort Seating & Table Set`,
            category: 'Furniture',
            estimated_price: Math.floor(furnitureBudget * 0.72),
            quantity: 1,
            reason: `Optimized for ${req.room || 'living space'} with durable framing and stain-resistant fabric.`,
            shopping_query: `${req.style || 'modern'} seating sofa table set for ${req.room || 'home'}`,
          },
          {
            name: 'Ergonomic Accent Side Console',
            category: 'Furniture',
            estimated_price: Math.floor(furnitureBudget * 0.25),
            quantity: 1,
            reason: 'Compact utility surface with integrated shelf for display and storage.',
            shopping_query: 'accent side console table storage engineered wood',
          },
        ],
      },
      {
        category: 'Decor & Essentials',
        allocated_budget: decorBudget,
        percentage_of_budget: 20,
        items: [
          {
            name: 'Soft Woven Geometric Floor Area Rug',
            category: 'Decor & Essentials',
            estimated_price: Math.floor(decorBudget * 0.55),
            quantity: 1,
            reason: 'Anchors room aesthetics and protects floor surfaces.',
            shopping_query: 'soft woven geometric floor area rug living room',
          },
          {
            name: 'Minimalist Wall Art & Planter Set',
            category: 'Decor & Essentials',
            estimated_price: Math.floor(decorBudget * 0.40),
            quantity: 1,
            reason: 'Adds organic color accents without crowding walking corridors.',
            shopping_query: 'minimalist framed wall art set and ceramic indoor planter',
          },
        ],
      },
      {
        category: 'Dining & Utility',
        allocated_budget: diningBudget,
        percentage_of_budget: 18,
        items: [
          {
            name: 'Space-Saving Multi-Functional Dining / Utility Unit',
            category: 'Dining',
            estimated_price: Math.floor(diningBudget * 0.90),
            quantity: 1,
            reason: 'Fits apartments or houses with fold-out or expandable versatility.',
            shopping_query: 'space saving expandable utility dining table',
          },
        ],
      },
      {
        category: 'Lighting',
        allocated_budget: lightingBudget,
        percentage_of_budget: 15,
        items: [
          {
            name: 'Smart Dimmable Tri-Color LED Fixture',
            category: 'Lighting',
            estimated_price: Math.floor(lightingBudget * 0.50),
            quantity: 1,
            reason: 'Variable color temperatures from warm relaxation to focused white light.',
            shopping_query: 'smart dimmable tri color led ceiling fixture',
          },
          {
            name: 'Ambient Warm Arc / Corner Lamp',
            category: 'Lighting',
            estimated_price: Math.floor(lightingBudget * 0.45),
            quantity: 1,
            reason: 'Distributes soothing diffuse indirect lighting for evenings.',
            shopping_query: 'warm ambient corner floor lamp modern',
          },
        ],
      },
      {
        category: 'Fans & Airflow',
        allocated_budget: fansBudget,
        percentage_of_budget: 12,
        items: [
          {
            name: 'BLDC Ultra-Quiet Energy Saving Ceiling Fan',
            category: 'Fans',
            estimated_price: Math.floor(fansBudget * 0.90),
            quantity: 1,
            reason: 'Consumes only 28W at top speed, yielding up to 65% power bill savings.',
            shopping_query: 'BLDC energy efficient remote ceiling fan',
          },
        ],
      },
    ];

    let budgetUsed = 0;
    for (const cat of breakdown) {
      for (const item of cat.items) {
        budgetUsed += item.estimated_price * item.quantity;
      }
    }
    const budgetRemaining = Math.max(0, budget - budgetUsed);

    return {
      title: `Smart Home Plan for ₹${budget.toLocaleString('en-IN')}`,
      summary: `A balanced home plan designed for a ${req.home_type || 'residence'} ${req.room || 'space'} in ${req.style || 'Modern'} style with ${req.priority || 'Balanced'} priority allocation.`,
      budget_used: budgetUsed,
      budget_remaining: budgetRemaining,
      budget_breakdown: breakdown,
      tips: [
        'Compare pricing between online retail sales and local wholesale markets for loose furniture.',
        'Keep the remaining budget buffer for unexpected delivery charges or professional installation.',
        'Prioritize high-use items (like sofa cushions and BLDC motors) over purely decorative accents.',
        'Check warranty terms and BIS certifications before finalizing electrical fittings.',
      ],
      disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
    };
  } else if (type === 'party') {
    const foodBudget = Math.floor(budget * 0.35);
    const venueBudget = Math.floor(budget * 0.25);
    const decorBudget = Math.floor(budget * 0.15);
    const entertainmentBudget = Math.floor(budget * 0.15);
    const contingencyBudget = Math.floor(budget * 0.10);

    const breakdown: BudgetBreakdownCategory[] = [
      {
        category: 'Food & Drinks',
        allocated_budget: foodBudget,
        percentage_of_budget: 35,
        items: [
          {
            name: `Catered Platter & Starters (${req.guests || 20} Guests)`,
            category: 'Food & Drinks',
            estimated_price: Math.floor(foodBudget * 0.70),
            quantity: 1,
            reason: `Delicious assorted snacks aligned with ${req.food_preference || 'party preferences'}.`,
            shopping_query: `catering party snack box food platter ${req.food_preference || ''}`,
          },
          {
            name: 'Signature Celebration Cake & Refreshment Bar',
            category: 'Food & Drinks',
            estimated_price: Math.floor(foodBudget * 0.25),
            quantity: 1,
            reason: 'Delivers centerpiece celebration moment and chilled drink dispensers.',
            shopping_query: 'celebration party designer cake and mocktail syrup',
          },
        ],
      },
      {
        category: 'Venue & Seating',
        allocated_budget: venueBudget,
        percentage_of_budget: 25,
        items: [
          {
            name: `${req.location || 'Reserved Space'} Booking & Basic Amenities`,
            category: 'Venue',
            estimated_price: Math.floor(venueBudget * 0.90),
            quantity: 1,
            reason: 'Covers sanitized space access, seating arrangement, and cleanup fee.',
            shopping_query: 'party venue banquet clubhouse booking',
          },
        ],
      },
      {
        category: 'Decorations',
        allocated_budget: decorBudget,
        percentage_of_budget: 15,
        items: [
          {
            name: `${req.decoration_preference || 'Themed'} Backdrop & Garland Kit`,
            category: 'Decorations',
            estimated_price: Math.floor(decorBudget * 0.55),
            quantity: 1,
            reason: 'Includes balloons, shimmer foil backdrop, and ribbon ties for photos.',
            shopping_query: 'party theme backdrop garland balloon decor kit',
          },
          {
            name: 'LED Fairy Curtain Lights & Photo Props',
            category: 'Decorations',
            estimated_price: Math.floor(decorBudget * 0.35),
            quantity: 1,
            reason: 'Enriches evening ambiance and fuels fun social media photo moments.',
            shopping_query: 'led fairy curtain lights party photo booth props',
          },
        ],
      },
      {
        category: 'Entertainment & Music',
        allocated_budget: entertainmentBudget,
        percentage_of_budget: 15,
        items: [
          {
            name: 'Portable High-Power Bluetooth Party Speaker with Mic',
            category: 'Entertainment',
            estimated_price: Math.floor(entertainmentBudget * 0.75),
            quantity: 1,
            reason: `Delivers immersive music and mic announcements for ${req.guests || 20} attendees.`,
            shopping_query: 'portable bluetooth party speaker with microphone',
          },
          {
            name: 'Interactive Icebreaker & Party Games Bundle',
            category: 'Entertainment',
            estimated_price: Math.floor(entertainmentBudget * 0.20),
            quantity: 1,
            reason: 'Keeps guests entertained and engaged throughout the event.',
            shopping_query: 'interactive party card board game bundle',
          },
        ],
      },
      {
        category: 'Contingency & Supplies',
        allocated_budget: contingencyBudget,
        percentage_of_budget: 10,
        items: [
          {
            name: 'Eco-Friendly Tableware & Serving Utensils Pack',
            category: 'Supplies',
            estimated_price: Math.floor(contingencyBudget * 0.60),
            quantity: 1,
            reason: 'Biodegradable plates, glasses, napkins, and clean disposal bags.',
            shopping_query: 'biodegradable disposable party tableware pack',
          },
        ],
      },
    ];

    let budgetUsed = 0;
    for (const cat of breakdown) {
      for (const item of cat.items) {
        budgetUsed += item.estimated_price * item.quantity;
      }
    }
    const budgetRemaining = Math.max(0, budget - budgetUsed);

    return {
      title: `Party Budget Plan for ₹${budget.toLocaleString('en-IN')}`,
      summary: `A complete ${req.party_type || 'celebration'} plan for ${req.guests || 20} guests at a ${req.location || 'designated venue'}, balancing delicious catering, vibrant decor, and music.`,
      budget_used: budgetUsed,
      budget_remaining: budgetRemaining,
      budget_breakdown: breakdown,
      tips: [
        'Confirm guest RSVPs 3 days in advance to prevent over-ordering food platters.',
        'DIY balloon arch setup takes 1 hour and saves up to ₹3,000 on event management fees.',
        'Keep backup ice packs and cold drink refills in reserve during warmer afternoons.',
        'Use the contingency buffer for unexpected gratuities or last-minute dietary needs.',
      ],
      disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
    };
  } else {
    // Jewelry fallback
    const mainBudget = Math.floor(budget * 0.55);
    const matchingBudget = Math.floor(budget * 0.25);
    const careBudget = Math.floor(budget * 0.10);
    const bufferBudget = Math.floor(budget * 0.10);

    const metal = req.preferred_metal || 'Gold';
    const breakdown: BudgetBreakdownCategory[] = [
      {
        category: `Main Piece (${req.main_piece || 'Necklace'})`,
        allocated_budget: mainBudget,
        percentage_of_budget: 55,
        items: [
          {
            name: `Hallmarked ${metal} ${req.jewelry_type || 'Main Piece'} (${req.style || 'Elegant'})`,
            category: 'Main Piece',
            estimated_price: Math.floor(mainBudget * 0.95),
            quantity: 1,
            reason: `Handcrafted in ${metal} featuring authentic hallmarking, tailored for ${req.occasion || 'special occasions'}.`,
            shopping_query: `hallmarked ${metal} ${req.jewelry_type || 'necklace'} ${req.style || 'elegant'}`,
          },
        ],
      },
      {
        category: 'Matching Piece',
        allocated_budget: matchingBudget,
        percentage_of_budget: 25,
        items: [
          {
            name: `Coordinated ${metal} Matching Earrings / Accent Band`,
            category: 'Matching Piece',
            estimated_price: Math.floor(matchingBudget * 0.92),
            quantity: 1,
            reason: 'Harmonious design motifs complementing the main centerpiece.',
            shopping_query: `matching ${metal} earrings studs ${req.style || 'elegant'}`,
          },
        ],
      },
      {
        category: 'Care & Packaging',
        allocated_budget: careBudget,
        percentage_of_budget: 10,
        items: [
          {
            name: 'Anti-Tarnish Modular Velvet Display Case & Polishing Cloth',
            category: 'Care & Storage',
            estimated_price: Math.floor(careBudget * 0.50),
            quantity: 1,
            reason: 'Shields precious metals against dust, moisture, and scratch marks.',
            shopping_query: 'anti tarnish velvet jewelry storage organizer box with lock',
          },
        ],
      },
      {
        category: 'Market Buffer & GST Contingency',
        allocated_budget: bufferBudget,
        percentage_of_budget: 10,
        items: [
          {
            name: 'Precious Metal Daily Fluctuation & Making Charge Cushion',
            category: 'Market Buffer',
            estimated_price: Math.floor(bufferBudget * 0.40),
            quantity: 1,
            reason: 'Safeguards against intra-day bullion rate shifts and state GST differences.',
            shopping_query: 'hallmarked jewelry care and insurance warranty',
          },
        ],
      },
    ];

    let budgetUsed = 0;
    for (const cat of breakdown) {
      for (const item of cat.items) {
        budgetUsed += item.estimated_price * item.quantity;
      }
    }
    const budgetRemaining = Math.max(0, budget - budgetUsed);

    return {
      title: `Jewelry Budget Plan for ₹${budget.toLocaleString('en-IN')}`,
      summary: `A certified ${metal} ensemble curated for ${req.occasion || 'festive occasions'}, prioritizing hallmarked quality and timeless aesthetics within ₹${budget.toLocaleString('en-IN')}.`,
      budget_used: budgetUsed,
      budget_remaining: budgetRemaining,
      budget_breakdown: breakdown,
      tips: [
        'Always verify the 6-digit alphanumeric HUID hallmark laser stamp before completing gold transactions.',
        'Ask your jeweler to itemize the exact metal weight, purity (e.g. 22K/18K), and making charge per gram.',
        'Store gemstones and precious metal pieces in separate soft pouches to prevent abrasions.',
        'Use the leftover buffer to cover hallmarking fees and final tax rounding.',
      ],
      disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
    };
  }
}

/**
 * Normalizes and clamps the plan to ensure budget is never exceeded
 */
function sanitizeAndClampPlan(raw: any, userBudget: number): PlanResultData {
  const budget = Math.max(1000, Number(userBudget) || 10000);
  
  if (!raw || typeof raw !== 'object') {
    return generateFallbackPlan({ plan_type: 'home', budget });
  }

  const title = String(raw.title || `Smart Budget Plan for ₹${budget.toLocaleString('en-IN')}`);
  const summary = String(raw.summary || 'A customized smart budget plan generated to match your requirements.');
  const rawBreakdown = Array.isArray(raw.budget_breakdown) ? raw.budget_breakdown : [];

  const breakdown: BudgetBreakdownCategory[] = [];
  let calculatedBudgetUsed = 0;

  for (const cat of rawBreakdown) {
    if (!cat || typeof cat !== 'object') continue;
    const catName = String(cat.category || 'General Essentials');
    const rawItems = Array.isArray(cat.items) ? cat.items : [];
    const items: PlanItem[] = [];

    for (const it of rawItems) {
      if (!it || typeof it !== 'object') continue;
      const itemName = String(it.name || 'Budget Item');
      const itemCat = String(it.category || catName);
      const estPrice = Math.max(100, Math.round(Number(it.estimated_price) || 500));
      const qty = Math.max(1, Math.min(100, Math.round(Number(it.quantity) || 1)));
      const reason = String(it.reason || 'Fits within the category budget allocation.');
      const shoppingQuery = String(it.shopping_query || `${itemName} ${itemCat}`);

      items.push({
        name: itemName,
        category: itemCat,
        estimated_price: estPrice,
        quantity: qty,
        reason,
        shopping_query: shoppingQuery,
      });

      calculatedBudgetUsed += estPrice * qty;
    }

    const catBudget = Math.max(
      0,
      Number(cat.allocated_budget) || items.reduce((s, i) => s + i.estimated_price * i.quantity, 0)
    );
    const catPct = Number(cat.percentage_of_budget) || Math.round((catBudget / budget) * 100);

    breakdown.push({
      category: catName,
      allocated_budget: catBudget,
      percentage_of_budget: catPct,
      items,
    });
  }

  // If AI gave no items or empty breakdown, return fallback
  if (breakdown.length === 0 || calculatedBudgetUsed === 0) {
    return generateFallbackPlan({ plan_type: 'home', budget });
  }

  // CRITICAL REQUIREMENT: The total recommended amount must never intentionally exceed the user's entered budget.
  // If calculatedBudgetUsed > budget, scale items down proportionally
  if (calculatedBudgetUsed > budget) {
    const scaleFactor = (budget * 0.95) / calculatedBudgetUsed;
    calculatedBudgetUsed = 0;

    for (const cat of breakdown) {
      let catSum = 0;
      for (const it of cat.items) {
        it.estimated_price = Math.max(50, Math.round(it.estimated_price * scaleFactor));
        catSum += it.estimated_price * it.quantity;
      }
      cat.allocated_budget = catSum;
      cat.percentage_of_budget = Math.round((catSum / budget) * 100);
      calculatedBudgetUsed += catSum;
    }
  }

  const budgetRemaining = Math.max(0, budget - calculatedBudgetUsed);

  // Tips
  const tips: string[] = Array.isArray(raw.tips) && raw.tips.length > 0
    ? raw.tips.map((t: any) => String(t))
    : [
        'Compare product ratings and multiple sellers before ordering.',
        'Keep your remaining buffer aside for logistics and warranty add-ons.',
        'Look for bundle discounts to shave 5-10% off your overall expense.',
      ];

  const disclaimer = String(
    raw.disclaimer ||
      'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.'
  );

  return {
    title,
    summary,
    budget_used: calculatedBudgetUsed,
    budget_remaining: budgetRemaining,
    budget_breakdown: breakdown,
    tips,
    disclaimer,
  };
}

/**
 * Generate plan with Google Gemini AI (gemini-3.8-flash) or fallback
 */
export async function generateAIPlan(req: RecommendationRequest): Promise<PlanResultData> {
  const budget = Math.max(1000, Number(req.budget) || 10000);
  const ai = getAIClient();

  if (!ai) {
    console.warn('GEMINI_API_KEY not configured or placeholder. Using high-fidelity deterministic fallback.');
    return generateFallbackPlan(req);
  }

  try {
    let contextPrompt = '';
    if (req.plan_type === 'home') {
      contextPrompt = `
Category: Home Budget Planning
Total Budget: ₹${budget} (Indian Rupees)
Room / Area: ${req.room || 'Living Room'}
Home Type: ${req.home_type || 'Apartment'}
Style Preference: ${req.style || 'Modern'}
Priority: ${req.priority || 'Balanced'}
Required Items requested by user: ${req.required_items || 'Standard essentials'}
Additional Requirements: ${req.additional_requirements || 'None'}
`;
    } else if (req.plan_type === 'party') {
      contextPrompt = `
Category: Party Budget Planning
Total Budget: ₹${budget} (Indian Rupees)
Party Type: ${req.party_type || 'Celebration'}
Number of Guests: ${req.guests || 20}
Location: ${req.location || 'Home / Clubhouse'}
Food Preference: ${req.food_preference || 'Starters & Drinks'}
Decoration Preference: ${req.decoration_preference || 'Themed Decor'}
Entertainment Preference: ${req.entertainment_preference || 'Music & Games'}
Date: ${req.date || 'Upcoming weekend'}
Additional Requirements: ${req.additional_requirements || 'None'}
`;
    } else {
      contextPrompt = `
Category: Jewelry Budget Planning
Total Budget: ₹${budget} (Indian Rupees)
Jewelry Type: ${req.jewelry_type || 'Set'}
Occasion: ${req.occasion || 'Festive / Special Occasion'}
Preferred Metal: ${req.preferred_metal || 'Gold'}
Style: ${req.style || 'Elegant'}
Main Piece: ${req.main_piece || 'Necklace / Pendant'}
Matching Requirements: ${req.matching_requirements || 'Earrings / Ring'}
Additional Requirements: ${req.additional_requirements || 'Hallmarked'}
`;
    }

    const systemInstruction = `
You are PocketSmart AI, an expert financial planner and smart purchasing recommendation engine for Indian consumers.
All prices must be in Indian Rupees (₹).

CRITICAL RULE: The total sum of (item.estimated_price * item.quantity) across all items MUST NEVER EXCEED the user's entered budget of ₹${budget}. Leave a sensible 5-10% buffer as budget_remaining.

You must return valid JSON matching this exact structure:
{
  "title": "Short descriptive title, e.g. Smart Home Plan for ₹50,000",
  "summary": "2-3 concise sentences explaining the budget strategy, quality focus, and reasoning.",
  "budget_used": 45000,
  "budget_remaining": 5000,
  "budget_breakdown": [
    {
      "category": "Furniture",
      "allocated_budget": 16000,
      "percentage_of_budget": 32,
      "items": [
        {
          "name": "3-Seater Fabric Sofa",
          "category": "Furniture",
          "estimated_price": 12000,
          "quantity": 1,
          "reason": "High density foam, space-saving design fitting the modern apartment requirement.",
          "shopping_query": "3 seater fabric sofa modern living room"
        }
      ]
    }
  ],
  "tips": [
    "Practical purchasing tip 1",
    "Practical purchasing tip 2",
    "Practical purchasing tip 3"
  ],
  "disclaimer": "Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing."
}
Only output pure JSON. Do not include markdown code fence formatting.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Please generate a comprehensive, realistic budget plan for the following user request:\n${contextPrompt}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text ? response.text.trim() : '';
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    // Clean any accidental markdown backticks
    const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return sanitizeAndClampPlan(parsed, budget);
  } catch (error) {
    console.error('Error generating AI plan with Gemini, falling back to deterministic engine:', error);
    return generateFallbackPlan(req);
  }
}

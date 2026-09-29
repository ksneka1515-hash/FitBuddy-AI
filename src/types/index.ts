export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface PlanItem {
  name: string;
  category: string;
  estimated_price: number;
  quantity: number;
  reason: string;
  shopping_query?: string;
}

export interface BudgetBreakdownCategory {
  category: string;
  allocated_budget: number;
  percentage_of_budget: number;
  items: PlanItem[];
}

export interface PlanResultData {
  title: string;
  summary: string;
  budget_used: number;
  budget_remaining: number;
  budget_breakdown: BudgetBreakdownCategory[];
  tips: string[];
  disclaimer: string;
}

export type PlanType = 'home' | 'party' | 'jewelry';

export interface Plan {
  id: string;
  user_id: string;
  plan_type: PlanType;
  title: string;
  budget: number;
  budget_used: number;
  budget_remaining: number;
  request_data: Record<string, any>;
  result_data: PlanResultData;
  created_at: string;
}

export interface DashboardStats {
  total_plans: number;
  total_budget_planned: number;
  total_budget_used: number;
  total_budget_remaining: number;
  recent_plan: Plan | null;
}

export interface HomePlannerInput {
  budget: number | '';
  room: string;
  home_type: string;
  required_items: string;
  style: string;
  priority: string;
  additional_requirements: string;
}

export interface PartyPlannerInput {
  budget: number | '';
  party_type: string;
  guests: number | '';
  location: string;
  food_preference: string;
  decoration_preference: string;
  entertainment_preference: string;
  date: string;
  additional_requirements: string;
}

export interface JewelryPlannerInput {
  budget: number | '';
  jewelry_type: string;
  occasion: string;
  preferred_metal: string;
  style: string;
  main_piece: string;
  matching_requirements: string;
  additional_requirements: string;
}

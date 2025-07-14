import { Category } from './Category';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  rating: number;
  difficulty: string;
  preparationTime: string;
  category: Category;
  active: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface Instruction {
  id: number;
  step: number;
  description: string;
}

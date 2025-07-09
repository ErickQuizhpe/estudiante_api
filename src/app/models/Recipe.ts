import { Category } from './Category';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  images: RecipeImage[];
  ingredients: Ingredient[];

  instructions: Instruction[];
  ratings: RecipeRating[];
  difficulty: string;
  preparationTime: string;
  category: Category;
}

export interface RecipeImage {
  id: number;
  url: string;
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

export interface RecipeRating {
  id: number;
  score: number;
}

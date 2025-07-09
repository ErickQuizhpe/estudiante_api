import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { Recipe } from '../../models/Recipe';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-recipes',
  imports: [],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {
  recipes: Recipe[] = [];
  category: Category | null = null;

  constructor(
    private recipeService: RecipeService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.recipeService.getRecipes().subscribe((recipes) => {
      this.recipes = recipes;
      console.log(this.recipes);
    });

    this.categoryService.getCategory(1).subscribe((category) => {
      this.category = category;
      console.log(this.category);
    });
  }
}

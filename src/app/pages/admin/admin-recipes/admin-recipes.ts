import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../../models/Recipe';
import { Category } from '../../../models/Category';
import { RecipeService } from '../../../services/recipe-service';
import { CategoryService } from '../../../services/category-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeForm } from '../../../components/admin/recipe-form/recipe-form';

@Component({
  selector: 'app-admin-recipes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    RecipeForm,
  ],
  templateUrl: './admin-recipes.html',
  styleUrl: './admin-recipes.css',
  providers: [RecipeService, CategoryService],
})
export class AdminRecipes implements OnInit {
  recipes: Recipe[] = [];
  categories: Category[] = [];
  selectedRecipe: Recipe | null = null;
  recipeDialog = false;
  isEdit = false;
  currentRecipe: Recipe | undefined = undefined;
  loading = false;

  constructor(
    private recipeService: RecipeService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadRecipes();
    this.loadCategories();
  }

  loadRecipes() {
    this.loading = true;
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        console.error('Error loading categories');
      },
    });
  }

  openNew() {
    this.currentRecipe = undefined;
    this.isEdit = false;
    this.recipeDialog = true;
  }

  editRecipe(recipe: Recipe) {
    this.currentRecipe = { ...recipe };
    this.isEdit = true;
    this.recipeDialog = true;
  }

  onRecipeSubmit(recipe: Recipe) {
    this.loading = true;

    // Transformar los datos al formato esperado por la API
    const recipePayload = {
      title: recipe.title,
      description: recipe.description,
      difficulty: recipe.difficulty,
      preparationTime: recipe.preparationTime,
      categoryId: recipe.category?.id || 0,
      images:
        recipe.images?.map((img) => ({
          url: img.url,
          active: img.active,
        })) || [],
      ingredients:
        recipe.ingredients?.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
        })) || [],
      instructions:
        recipe.instructions?.map((inst) => ({
          step: inst.step,
          description: inst.description,
        })) || [],
    };

    if (this.isEdit && this.currentRecipe?.id) {
      this.recipeService
        .updateRecipe(this.currentRecipe.id, recipePayload as any)
        .subscribe({
          next: () => {
            this.loadRecipes();
            this.recipeDialog = false;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating recipe:', error);
            this.loading = false;
          },
        });
    } else {
      this.recipeService.createRecipe(recipePayload as any).subscribe({
        next: () => {
          this.loadRecipes();
          this.recipeDialog = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating recipe:', error);
          this.loading = false;
        },
      });
    }
  }

  deleteRecipe(recipe: Recipe) {
    if (confirm('¿Seguro que deseas eliminar esta receta?')) {
      this.recipeService.deleteRecipe(recipe.id).subscribe(() => {
        this.loadRecipes();
      });
    }
  }

  hideDialog() {
    this.recipeDialog = false;
  }
}

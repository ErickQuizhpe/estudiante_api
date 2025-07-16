import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { Recipe } from '../../models/Recipe';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category-service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { RecipeRatingComponent } from '../../components/recipe-rating/recipe-rating';

@Component({
  selector: 'app-recipes',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DividerModule,
    TagModule,
    RecipeRatingComponent,
  ],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  search: string = '';
  selectedCategory: number | 'Todas' = 'Todas';
  selectedDifficulty: string = 'Todas';
  resultsPerPage: number = 3;
  currentPage: number = 1;
  totalPages: number = 1;
  categories: Category[] = [];
  difficulties: string[] = ['Todas', 'Facil', 'Media', 'Dificil'];
  selectedRecipe: Recipe | null = null;
  loadingRecipe: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.recipeService.getRecipes().subscribe((recipes) => {
      this.recipes = recipes;
      this.applyFilters();
    });
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  getMainImage(recipe: Recipe): string {
    return (
      recipe.imageUrl || 'https://via.placeholder.com/400x200?text=Sin+Imagen'
    );
  }

  applyFilters() {
    let filtered = this.recipes;
    if (this.selectedCategory !== 'Todas') {
      filtered = filtered.filter(
        (r) => r.category?.id === this.selectedCategory
      );
    }
    if (this.selectedDifficulty !== 'Todas') {
      filtered = filtered.filter(
        (r) =>
          (r.difficulty || '').normalize('NFD').replace(/[ -]/g, '') ===
          this.selectedDifficulty
      );
    }
    if (this.search.trim()) {
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(this.search.toLowerCase())
      );
    }
    this.filteredRecipes = filtered;
    this.totalPages =
      Math.ceil(this.filteredRecipes.length / this.resultsPerPage) || 1;
    this.currentPage = 1;
  }

  get paginatedRecipes() {
    const start = (this.currentPage - 1) * this.resultsPerPage;
    return this.filteredRecipes.slice(start, start + this.resultsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  verReceta(recipe: Recipe) {
    this.loadingRecipe = true;
    this.recipeService.getRecipe(recipe.id).subscribe({
      next: (detalle) => {
        this.selectedRecipe = {
          ...detalle,
          instructions: detalle.instructions.sort((a, b) => a.step - b.step),
        };
        this.loadingRecipe = false;
      },
      error: () => {
        alert('Error al cargar la receta');
        this.loadingRecipe = false;
      },
    });
  }

  cerrarDetalle() {
    this.selectedRecipe = null;
  }

  onRatingChange(rating: number) {
    if (this.selectedRecipe) {
      this.selectedRecipe.rating = rating;
      console.log(`Receta ${this.selectedRecipe.title} calificada con ${rating} estrellas`);
    }
  }
}

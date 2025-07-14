import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { Recipe } from '../../models/Recipe';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    CarouselModule,
    RatingModule,
    DividerModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  featuredRecipes: Recipe[] = [];
  currentSlide = 0;
  carouselInterval: any;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  loadRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        // Seleccionar las primeras 6 recetas como destacadas
        this.featuredRecipes = recipes.slice(0, 6);
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
      },
    });
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambiar slide cada 5 segundos
  }

  nextSlide() {
    if (this.featuredRecipes.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.featuredRecipes.length;
    }
  }

  prevSlide() {
    if (this.featuredRecipes.length > 0) {
      this.currentSlide =
        this.currentSlide === 0
          ? this.featuredRecipes.length - 1
          : this.currentSlide - 1;
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  getAverageRating(ratings: any[]): number {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  getMainImage(recipe: Recipe): string {
    return recipe.imageUrl;
  }
}

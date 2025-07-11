import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import {
  Recipe,
  Ingredient,
  Instruction,
  RecipeImage,
} from '../../../models/Recipe';
import { Category } from '../../../models/Category';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-recipe-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
  ],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
  providers: [CategoryService],
})
export class RecipeForm implements OnInit, OnChanges {
  @Input() initialData?: Recipe;
  @Input() isEditing: boolean = false;
  @Output() onSubmit = new EventEmitter<Recipe>();

  formData: {
    title: string;
    description: string;
    difficulty: string;
    preparationTime: string;
    category: any;
    ingredients: Ingredient[];
    instructions: Instruction[];
    images: RecipeImage[];
  } = {
    title: '',
    description: '',
    difficulty: '',
    preparationTime: '',
    category: null,
    ingredients: [{ id: 0, name: '', quantity: 0, unit: '' }],
    instructions: [{ id: 0, step: 1, description: '' }],
    images: [{ id: 0, url: '', active: true }],
  };

  categories: Category[] = [];
  loading = false;

  difficultyOptions = [
    { label: 'Fácil', value: 'Fácil' },
    { label: 'Medio', value: 'Medio' },
    { label: 'Difícil', value: 'Difícil' },
  ];

  constructor(private categoryService: CategoryService) {
    this.initializeFormData();
  }

  ngOnInit() {
    this.loadCategories();
    this.initializeFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData']) {
      this.initializeFormData();
    }
  }

  initializeFormData() {
    this.formData = {
      title: this.initialData?.title || '',
      description: this.initialData?.description || '',
      difficulty: this.initialData?.difficulty || '',
      preparationTime: this.initialData?.preparationTime || '',
      category: this.initialData?.category || null,
      ingredients: this.initialData?.ingredients || [
        { id: 0, name: '', quantity: 0, unit: '' },
      ],
      instructions: this.initialData?.instructions || [
        { id: 0, step: 1, description: '' },
      ],
      images: this.initialData?.images || [{ id: 0, url: '', active: true }],
    };
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        console.error('Error loading categories');
        this.loading = false;
      },
    });
  }

  handleSubmit() {
    console.log('=== DEBUG: Form Data Before Processing ===');
    console.log('Full formData object:', this.formData);
    console.log('Ingredients raw:', this.formData.ingredients);
    console.log('Instructions raw:', this.formData.instructions);
    console.log('Images raw:', this.formData.images);

    // Filtrar ingredientes, instrucciones e imágenes vacías antes de enviar
    const filteredIngredients = this.formData.ingredients.filter(
      (ing) =>
        ing.name.trim() !== '' || ing.quantity > 0 || ing.unit.trim() !== ''
    );

    const filteredInstructions = this.formData.instructions.filter(
      (inst) => inst.description.trim() !== ''
    );

    const filteredImages = this.formData.images.filter(
      (img) => img.url.trim() !== ''
    );

    console.log('=== DEBUG: After Filtering ===');
    console.log('Filtered ingredients:', filteredIngredients);
    console.log('Filtered instructions:', filteredInstructions);
    console.log('Filtered images:', filteredImages);

    const recipeData = {
      ...this.formData,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      images: filteredImages,
    };

    console.log('Sending recipe data:', recipeData); // Debug log
    this.onSubmit.emit(recipeData as Recipe);
  }

  // Método para debug desde el template
  debugFormData() {
    console.log('Current form data:', this.formData);
    return true;
  }

  // TrackBy functions para evitar recrear elementos DOM
  trackByIngredientIndex(index: number, item: any): number {
    return index;
  }

  trackByInstructionIndex(index: number, item: any): number {
    return index;
  }

  trackByImageIndex(index: number, item: any): number {
    return index;
  }

  addIngredient() {
    this.formData.ingredients.push({ id: 0, name: '', quantity: 0, unit: '' });
    // Forzar detección de cambios
    this.formData.ingredients = [...this.formData.ingredients];
  }

  removeIngredient(index: number) {
    if (this.formData.ingredients.length > 1) {
      this.formData.ingredients.splice(index, 1);
      // Forzar detección de cambios
      this.formData.ingredients = [...this.formData.ingredients];
    }
  }

  updateIngredient(index: number, field: string, value: any) {
    if (index >= 0 && index < this.formData.ingredients.length) {
      this.formData.ingredients[index] = {
        ...this.formData.ingredients[index],
        [field]: value,
      };
      // Forzar detección de cambios
      this.formData.ingredients = [...this.formData.ingredients];
    }
  }

  addInstruction() {
    const newStep = this.formData.instructions.length + 1;
    this.formData.instructions.push({ id: 0, step: newStep, description: '' });
    // Forzar detección de cambios
    this.formData.instructions = [...this.formData.instructions];
  }

  removeInstruction(index: number) {
    if (this.formData.instructions.length > 1) {
      this.formData.instructions.splice(index, 1);
      // Reorder steps
      this.formData.instructions.forEach((instruction, i) => {
        instruction.step = i + 1;
      });
      // Forzar detección de cambios
      this.formData.instructions = [...this.formData.instructions];
    }
  }

  updateInstruction(index: number, description: string) {
    if (index >= 0 && index < this.formData.instructions.length) {
      this.formData.instructions[index] = {
        ...this.formData.instructions[index],
        description: description,
      };
      // Forzar detección de cambios
      this.formData.instructions = [...this.formData.instructions];
    }
  }

  addImage() {
    this.formData.images.push({ id: 0, url: '', active: true });
    // Forzar detección de cambios
    this.formData.images = [...this.formData.images];
  }

  removeImage(index: number) {
    if (this.formData.images.length > 1) {
      this.formData.images.splice(index, 1);
      // Forzar detección de cambios
      this.formData.images = [...this.formData.images];
    }
  }

  updateImage(index: number, url: string) {
    if (index >= 0 && index < this.formData.images.length) {
      this.formData.images[index] = {
        ...this.formData.images[index],
        url: url,
      };
      // Forzar detección de cambios
      this.formData.images = [...this.formData.images];
    }
  }
}

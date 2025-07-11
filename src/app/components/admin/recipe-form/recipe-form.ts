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
    this.onSubmit.emit(this.formData as Recipe);
  }

  addIngredient() {
    this.formData.ingredients.push({ id: 0, name: '', quantity: 0, unit: '' });
  }

  removeIngredient(index: number) {
    this.formData.ingredients.splice(index, 1);
  }

  updateIngredient(index: number, field: string, value: any) {
    this.formData.ingredients[index] = {
      ...this.formData.ingredients[index],
      [field]: value,
    };
  }

  addInstruction() {
    const newStep = this.formData.instructions.length + 1;
    this.formData.instructions.push({ id: 0, step: newStep, description: '' });
  }

  removeInstruction(index: number) {
    this.formData.instructions.splice(index, 1);
    // Reorder steps
    this.formData.instructions.forEach((instruction, i) => {
      instruction.step = i + 1;
    });
  }

  updateInstruction(index: number, description: string) {
    this.formData.instructions[index].description = description;
  }

  addImage() {
    this.formData.images.push({ id: 0, url: '', active: true });
  }

  removeImage(index: number) {
    this.formData.images.splice(index, 1);
  }

  updateImage(index: number, url: string) {
    this.formData.images[index].url = url;
  }
}

import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/Category';
import { CategoryService } from '../../../services/category-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
  providers: [CategoryService],
})
export class AdminCategories implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  categoryDialog = false;
  isEdit = false;
  category: Category = { id: 0, name: '', description: '' };
  loading = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openNew() {
    this.category = { id: 0, name: '', description: '' };
    this.isEdit = false;
    this.categoryDialog = true;
  }

  editCategory(category: Category) {
    this.category = { ...category };
    this.isEdit = true;
    this.categoryDialog = true;
  }

  saveCategory() {
    if (this.isEdit && this.category.id) {
      this.categoryService
        .updateCategory(this.category.id, this.category)
        .subscribe(() => {
          this.loadCategories();
          this.categoryDialog = false;
        });
    } else {
      this.categoryService.createCategory(this.category).subscribe(() => {
        this.loadCategories();
        this.categoryDialog = false;
      });
    }
  }

  deleteCategory(category: Category) {
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
      this.categoryService.deleteCategory(category.id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  hideDialog() {
    this.categoryDialog = false;
  }
}

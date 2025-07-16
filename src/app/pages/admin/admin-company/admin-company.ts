import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company-service';
import { Company } from '../../../models/Company';

@Component({
  selector: 'app-admin-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-company.html',
  styleUrl: './admin-company.css',
  providers: [CompanyService]
})
export class AdminCompany implements OnInit {
  companyForm!: FormGroup;
  company: Company | null = null;
  loading = false;
  editMode = false;

  constructor(private fb: FormBuilder, private companyService: CompanyService) {}

  ngOnInit() {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      logoUrl: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      city: [''],
      mission: [''],
      vision: ['']
    });
    this.loadCompany();
  }

  loadCompany() {
    this.loading = true;
    this.companyService.getCompany().subscribe({
      next: (data) => {
        this.company = data;
        this.companyForm.patchValue(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  enableEdit() {
    this.editMode = true;
    this.companyForm.enable();
  }

  cancelEdit() {
    this.editMode = false;
    if (this.company) {
      this.companyForm.patchValue(this.company);
    }
    this.companyForm.disable();
  }

  saveCompany() {
    if (this.company && this.company.id) {
      this.companyService.updateCompany(this.company.id, {
        ...this.company,
        ...this.companyForm.value
      }).subscribe({
        next: (updated) => {
          this.editMode = false;
          this.companyForm.disable();
          this.loadCompany();
          // Aquí puedes mostrar un mensaje de éxito
        },
        error: () => {
          // Aquí puedes mostrar un mensaje de error
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company-service';
import { Company, SocialMedia, Banner } from '../../../models/Company';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-company',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TableModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-company.html',
  styleUrl: './admin-company.css',
})
export class AdminCompany implements OnInit {
  companyForm!: FormGroup;
  company: Company | null = null;
  loading = false;
  editMode = false;

  // Social Media Management
  socialMediaDialog = false;
  socialMediaForm: Partial<SocialMedia> = {};
  editingSocialMedia: SocialMedia | null = null;

  // Banner Management
  bannerDialog = false;
  bannerForm: Partial<Banner> = {};
  editingBanner: Banner | null = null;

  constructor(
    private fb: FormBuilder, 
    private companyService: CompanyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      logoUrl: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      city: [''],
      footerText: [''],
      mission: [''],
      vision: ['']
    });
    
    // Inicialmente deshabilitar el formulario
    this.companyForm.disable();
    
    this.loadCompany();
  }

  loadCompany() {
    console.log('loadCompany() called');
    this.loading = true;
    this.companyService.getCompany().subscribe({
      next: (data) => {
        console.log('Company data loaded:', data);
        this.company = data;
        this.companyForm.patchValue(data);
        console.log('Form patched with data:', this.companyForm.value);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading company:', error);
        this.loading = false;
      }
    });
  }

  enableEdit() {
    console.log('enableEdit() called');
    console.log('Current editMode:', this.editMode);
    console.log('Form disabled status before:', this.companyForm.disabled);
    
    this.editMode = true;
    this.companyForm.enable();
    
    console.log('New editMode:', this.editMode);
    console.log('Form disabled status after:', this.companyForm.disabled);
    console.log('Form value:', this.companyForm.value);
  }

  cancelEdit() {
    console.log('cancelEdit() called');
    console.log('Current editMode:', this.editMode);
    
    this.editMode = false;
    if (this.company) {
      this.companyForm.patchValue(this.company);
      console.log('Form patched with company data:', this.company);
    }
    this.companyForm.disable();
    
    console.log('New editMode:', this.editMode);
    console.log('Form disabled status:', this.companyForm.disabled);
  }

  saveCompany() {
    if (this.company && this.company.id && this.companyForm.valid) {
      console.log('Saving company with data:', this.companyForm.value);
      console.log('Original company:', this.company);
      
      const updatedCompany: Company = {
        ...this.company,
        ...this.companyForm.value
      };
      
      console.log('Updated company to save:', updatedCompany);
      
      this.companyService.saveCompleteCompany(updatedCompany).subscribe({
        next: (response) => {
          console.log('Company saved successfully:', response);
          this.company = response;
          this.editMode = false;
          this.companyForm.disable();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Información de la empresa actualizada correctamente'
          });
        },
        error: (error) => {
          console.error('Error saving company:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la información de la empresa'
          });
        }
      });
    } else {
      console.log('Form validation failed:', {
        hasCompany: !!this.company,
        hasId: !!this.company?.id,
        isValid: this.companyForm.valid,
        formErrors: this.companyForm.errors,
        formValue: this.companyForm.value
      });
      
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, complete todos los campos requeridos'
      });
    }
  }

  // Social Media Management Methods - Local handling
  openSocialMediaDialog(socialMedia?: SocialMedia) {
    this.editingSocialMedia = socialMedia || null;
    this.socialMediaForm = socialMedia ? { ...socialMedia } : {
      platform: '',
      url: '',
      iconUrl: '',
      active: true
    };
    this.socialMediaDialog = true;
  }

  saveSocialMedia() {
    if (!this.socialMediaForm.platform || !this.socialMediaForm.url) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Plataforma y URL son requeridos'
      });
      return;
    }

    if (!this.company) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo encontrar la información de la empresa'
      });
      return;
    }

    // Initialize socialMedia array if it doesn't exist
    if (!this.company.socialMedia) {
      this.company.socialMedia = [];
    }

    if (this.editingSocialMedia) {
      // Update existing social media
      const index = this.company.socialMedia.findIndex(sm => sm.id === this.editingSocialMedia!.id);
      if (index !== -1) {
        this.company.socialMedia[index] = {
          ...this.editingSocialMedia,
          ...this.socialMediaForm as SocialMedia
        };
      }
    } else {
      // Create new social media
      const newSocialMedia: SocialMedia = {
        id: Date.now(), // Generate temporary ID
        platform: this.socialMediaForm.platform,
        url: this.socialMediaForm.url,
        iconUrl: this.socialMediaForm.iconUrl || '',
        active: this.socialMediaForm.active ?? true
      };
      this.company.socialMedia.push(newSocialMedia);
    }

    // Save the complete company
    this.companyService.saveCompleteCompany(this.company).subscribe({
      next: (response) => {
        this.company = response;
        this.socialMediaDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.editingSocialMedia ? 'Red social actualizada correctamente' : 'Red social creada correctamente'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la red social'
        });
      }
    });
  }

  deleteSocialMedia(socialMedia: SocialMedia) {
    if (!this.company) return;
    
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar la red social ${socialMedia.platform}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!this.company?.socialMedia) return;
        
        // Remove from local array
        this.company.socialMedia = this.company.socialMedia.filter(sm => sm.id !== socialMedia.id);
        
        // Save the complete company
        this.companyService.saveCompleteCompany(this.company).subscribe({
          next: (response) => {
            this.company = response;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Red social eliminada correctamente'
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la red social'
            });
          }
        });
      }
    });
  }

  // Banner Management Methods - Local handling
  openBannerDialog(banner?: Banner) {
    this.editingBanner = banner || null;
    this.bannerForm = banner ? { ...banner } : {
      description: '',
      imageUrl: '',
      active: true
    };
    this.bannerDialog = true;
  }

  saveBanner() {
    if (!this.bannerForm.imageUrl) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'URL de imagen es requerida'
      });
      return;
    }

    if (!this.company) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo encontrar la información de la empresa'
      });
      return;
    }

    // Initialize banners array if it doesn't exist
    if (!this.company.banners) {
      this.company.banners = [];
    }

    if (this.editingBanner) {
      // Update existing banner
      const index = this.company.banners.findIndex(b => b.id === this.editingBanner!.id);
      if (index !== -1) {
        this.company.banners[index] = {
          ...this.editingBanner,
          description: this.bannerForm.description || '',
          imageUrl: this.bannerForm.imageUrl,
          active: this.bannerForm.active ?? true
        };
      }
    } else {
      // Create new banner
      const newBanner: Banner = {
        id: Date.now(), // Generate temporary ID
        description: this.bannerForm.description || '',
        imageUrl: this.bannerForm.imageUrl,
        active: this.bannerForm.active ?? true
      };
      this.company.banners.push(newBanner);
    }

    // Save the complete company
    this.companyService.saveCompleteCompany(this.company).subscribe({
      next: (response) => {
        this.company = response;
        this.bannerDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.editingBanner ? 'Banner actualizado correctamente' : 'Banner creado correctamente'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el banner'
        });
      }
    });
  }

  deleteBanner(banner: Banner) {
    if (!this.company) return;
    
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este banner?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!this.company?.banners) return;
        
        // Remove from local array
        this.company.banners = this.company.banners.filter(b => b.id !== banner.id);
        
        // Save the complete company
        this.companyService.saveCompleteCompany(this.company).subscribe({
          next: (response) => {
            this.company = response;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Banner eliminado correctamente'
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el banner'
            });
          }
        });
      }
    });
  }
}

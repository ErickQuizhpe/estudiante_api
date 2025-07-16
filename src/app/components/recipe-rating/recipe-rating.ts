import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Definición local del tipo de evento de PrimeNG Rating
interface RatingRateEvent {
  originalEvent: Event;
  value: number;
}

@Component({
  selector: 'app-recipe-rating',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, ToastModule],
  templateUrl: './recipe-rating.html',
  styleUrls: ['./recipe-rating.css'],
  providers: [MessageService]
})
export class RecipeRatingComponent {
  @Input() recipeId: string = '';
  @Input() currentRating: number = 0;
  @Input() isReadOnly: boolean = false;
  @Input() showRatingText: boolean = true;
  @Output() ratingChange = new EventEmitter<number>();

  hoveredStar: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  onStarHover(event: any): void {
    const value = event.value;
    if (!this.isReadOnly) {
      this.hoveredStar = value;
    }
  }

  onStarLeave(): void {
    if (!this.isReadOnly) {
      this.hoveredStar = 0;
    }
  }

  onStarClick(event: any): void {
    const value = event.value;
    if (!this.isReadOnly) {
      // Verificar autenticación antes de permitir calificar
      if (!this.authService.isAuthenticated()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'Debes iniciar sesión para calificar recetas',
          life: 3000
        });
        return;
      }

      const token = this.authService.getToken();
      const currentUser = this.authService.getCurrentUser();
      
      console.log('Estado de autenticación:', {
        isAuthenticated: this.authService.isAuthenticated(),
        hasToken: !!token,
        currentUser: currentUser,
        token: token ? 'Token presente' : 'Sin token'
      });

      this.ratingChange.emit(value);
      
      if (this.recipeId && this.recipeId.trim() !== '') {
        console.log('Enviando calificación:', { 
          recipeId: this.recipeId, 
          rating: value,
          userAuthenticated: this.authService.isAuthenticated()
        });
        
        this.userService.rateRecipe(this.recipeId, value).subscribe({
          next: (response) => {
            console.log('Calificación enviada exitosamente', response);
            this.messageService.add({
              severity: 'success',
              summary: '¡Gracias!',
              detail: 'Tu calificación ha sido registrada.',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error al enviar calificación:', error);
            console.error('Detalles del error:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              error: error.error,
              url: error.url
            });
            
            // Revertir la calificación visual en caso de error
            this.currentRating = 0;
            
            // Mensajes de error más específicos
            if (error.status === 401) {
              this.messageService.add({
                severity: 'error',
                summary: 'Sesión expirada',
                detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                life: 4000
              });
              this.authService.logout();
            } else if (error.status === 403) {
              this.messageService.add({
                severity: 'error',
                summary: 'Sin permisos',
                detail: 'No tienes permisos para calificar esta receta.',
                life: 4000
              });
            } else if (error.status === 500) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error del servidor',
                detail: 'Por favor, inténtalo más tarde.',
                life: 4000
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al enviar la calificación. Por favor, inténtalo de nuevo.',
                life: 4000
              });
            }
          }
        });
      } else {
        console.warn('No se puede calificar: recipeId no válido:', this.recipeId);
      }
    }
  }

  getStarClass(star: number): string {
    const rating = this.hoveredStar || this.currentRating;
    
    if (star <= rating) {
      return 'p-rating-icon-active';
    } else {
      return 'p-rating-icon-inactive';
    }
  }

  getStarColor(star: number): string {
    const rating = this.hoveredStar || this.currentRating;
    
    if (star <= rating) {
      return '#ffd700'; // Dorado para estrellas llenas
    } else if (star - 0.5 <= rating) {
      return '#ffd700'; // Para media estrella (se puede mejorar con gradiente)
    } else {
      return 'var(--text-color-secondary)'; // Color gris de PrimeNG
    }
  }

  getRatingText(): string {
    const rating = this.currentRating;
    if (rating === 0) return 'Sin calificar';
    if (rating === 1) return 'Muy malo';
    if (rating === 2) return 'Malo';
    if (rating === 3) return 'Regular';
    if (rating === 4) return 'Bueno';
    if (rating === 5) return 'Excelente';
    return '';
  }

  get isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}

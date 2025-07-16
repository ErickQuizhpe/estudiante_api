import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { RecipeRatingComponent } from './recipe-rating';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';

describe('RecipeRatingComponent', () => {
  let component: RecipeRatingComponent;
  let fixture: ComponentFixture<RecipeRatingComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['rateRecipe']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'getCurrentUser',
      'logout'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RecipeRatingComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeRatingComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Configuración por defecto de mocks
    authService.isAuthenticated.and.returnValue(true);
    authService.getToken.and.returnValue('mock-token');
    authService.getCurrentUser.and.returnValue({ 
      id: '1', 
      username: 'testuser',
      email: 'test@test.com',
      roles: ['USER']
    } as any);
    userService.rateRecipe.and.returnValue(of('Valoración agregada'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.recipeId).toBe('');
    expect(component.currentRating).toBe(0);
    expect(component.isReadOnly).toBe(false);
    expect(component.showRatingText).toBe(true);
    expect(component.hoveredStar).toBe(0);
    expect(component.stars).toEqual([1, 2, 3, 4, 5]);
  });

  describe('Star hover functionality', () => {
    it('should set hoveredStar when hovering over a star and not readonly', () => {
      component.isReadOnly = false;
      component.onStarHover(3);
      expect(component.hoveredStar).toBe(3);
    });

    it('should not set hoveredStar when readonly', () => {
      component.isReadOnly = true;
      component.onStarHover(3);
      expect(component.hoveredStar).toBe(0);
    });

    it('should reset hoveredStar on star leave', () => {
      component.isReadOnly = false;
      component.hoveredStar = 3;
      component.onStarLeave();
      expect(component.hoveredStar).toBe(0);
    });
  });

  describe('Star click functionality', () => {
    beforeEach(() => {
      component.recipeId = '123';
      spyOn(component.ratingChange, 'emit');
      spyOn(window, 'alert');
    });

    it('should emit rating change and call service when authenticated user clicks star', () => {
      authService.isAuthenticated.and.returnValue(true);
      
      component.onStarClick(4);
      
      expect(component.currentRating).toBe(4);
      expect(component.ratingChange.emit).toHaveBeenCalledWith(4);
      expect(userService.rateRecipe).toHaveBeenCalledWith('123', 4);
    });

    it('should show alert when unauthenticated user tries to rate', () => {
      authService.isAuthenticated.and.returnValue(false);
      
      component.onStarClick(4);
      
      expect(window.alert).toHaveBeenCalledWith('Debes iniciar sesión para calificar recetas');
      expect(userService.rateRecipe).not.toHaveBeenCalled();
    });

    it('should not allow rating when readonly', () => {
      component.isReadOnly = true;
      
      component.onStarClick(4);
      
      expect(component.ratingChange.emit).not.toHaveBeenCalled();
      expect(userService.rateRecipe).not.toHaveBeenCalled();
    });

    it('should show success message on successful rating', () => {
      userService.rateRecipe.and.returnValue(of('Valoración agregada'));
      
      component.onStarClick(5);
      
      expect(window.alert).toHaveBeenCalledWith('¡Gracias por tu calificación!');
    });

    it('should handle 401 error and logout user', () => {
      const error = { status: 401, statusText: 'Unauthorized' };
      userService.rateRecipe.and.returnValue(throwError(() => error));
      
      component.onStarClick(3);
      
      expect(window.alert).toHaveBeenCalledWith('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should handle 403 error', () => {
      const error = { status: 403, statusText: 'Forbidden' };
      userService.rateRecipe.and.returnValue(throwError(() => error));
      
      component.onStarClick(3);
      
      expect(window.alert).toHaveBeenCalledWith('No tienes permisos para calificar esta receta.');
    });

    it('should handle 500 error', () => {
      const error = { status: 500, statusText: 'Internal Server Error' };
      userService.rateRecipe.and.returnValue(throwError(() => error));
      
      component.onStarClick(3);
      
      expect(window.alert).toHaveBeenCalledWith('Error del servidor. Por favor, inténtalo más tarde.');
    });

    it('should revert rating on error', () => {
      const error = { status: 500, statusText: 'Internal Server Error' };
      userService.rateRecipe.and.returnValue(throwError(() => error));
      component.currentRating = 0;
      
      component.onStarClick(3);
      
      expect(component.currentRating).toBe(0);
    });
  });

  describe('getStarClass method', () => {
    it('should return active class for filled stars', () => {
      component.currentRating = 3;
      component.hoveredStar = 0;
      
      expect(component.getStarClass(1)).toBe('p-rating-icon-active');
      expect(component.getStarClass(3)).toBe('p-rating-icon-active');
    });

    it('should return inactive class for empty stars', () => {
      component.currentRating = 3;
      component.hoveredStar = 0;
      
      expect(component.getStarClass(4)).toBe('p-rating-icon-inactive');
      expect(component.getStarClass(5)).toBe('p-rating-icon-inactive');
    });

    it('should prioritize hovered star over current rating', () => {
      component.currentRating = 2;
      component.hoveredStar = 4;
      
      expect(component.getStarClass(3)).toBe('p-rating-icon-active');
      expect(component.getStarClass(5)).toBe('p-rating-icon-inactive');
    });
  });

  describe('getStarColor method', () => {
    it('should return gold color for filled stars', () => {
      component.currentRating = 3;
      component.hoveredStar = 0;
      
      expect(component.getStarColor(1)).toBe('#ffd700');
      expect(component.getStarColor(3)).toBe('#ffd700');
    });

    it('should return secondary color for empty stars', () => {
      component.currentRating = 2;
      component.hoveredStar = 0;
      
      expect(component.getStarColor(4)).toBe('var(--text-color-secondary)');
      expect(component.getStarColor(5)).toBe('var(--text-color-secondary)');
    });
  });

  describe('getRatingText method', () => {
    it('should return correct text for each rating', () => {
      const testCases = [
        { rating: 0, expected: 'Sin calificar' },
        { rating: 1, expected: 'Muy malo' },
        { rating: 2, expected: 'Malo' },
        { rating: 3, expected: 'Regular' },
        { rating: 4, expected: 'Bueno' },
        { rating: 5, expected: 'Excelente' }
      ];

      testCases.forEach(({ rating, expected }) => {
        component.currentRating = rating;
        expect(component.getRatingText()).toBe(expected);
      });
    });
  });

  describe('isUserAuthenticated getter', () => {
    it('should return true when user is authenticated', () => {
      authService.isAuthenticated.and.returnValue(true);
      expect(component.isUserAuthenticated).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      authService.isAuthenticated.and.returnValue(false);
      expect(component.isUserAuthenticated).toBe(false);
    });
  });

  describe('Component inputs', () => {
    it('should accept recipeId input', () => {
      component.recipeId = '456';
      expect(component.recipeId).toBe('456');
    });

    it('should accept currentRating input', () => {
      component.currentRating = 4;
      expect(component.currentRating).toBe(4);
    });

    it('should accept isReadOnly input', () => {
      component.isReadOnly = true;
      expect(component.isReadOnly).toBe(true);
    });

    it('should accept showRatingText input', () => {
      component.showRatingText = false;
      expect(component.showRatingText).toBe(false);
    });
  });

  describe('Warning for invalid recipeId', () => {
    it('should warn when recipeId is empty', () => {
      spyOn(console, 'warn');
      component.recipeId = '';
      
      component.onStarClick(3);
      
      expect(console.warn).toHaveBeenCalledWith('No se puede calificar: recipeId no válido:', '');
    });

    it('should warn when recipeId is only whitespace', () => {
      spyOn(console, 'warn');
      component.recipeId = '   ';
      
      component.onStarClick(3);
      
      expect(console.warn).toHaveBeenCalledWith('No se puede calificar: recipeId no válido:', '   ');
    });
  });
});
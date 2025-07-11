import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecipes } from './admin-recipes';

describe('AdminRecipes', () => {
  let component: AdminRecipes;
  let fixture: ComponentFixture<AdminRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

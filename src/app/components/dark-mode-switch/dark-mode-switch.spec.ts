import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkModeSwitch } from './dark-mode-switch';

describe('DarkModeSwitch', () => {
  let component: DarkModeSwitch;
  let fixture: ComponentFixture<DarkModeSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkModeSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkModeSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

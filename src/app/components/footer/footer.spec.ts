import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FooterComponent } from './footer';
import { CompanyService } from '../../services/company-service';
import { DividerModule } from 'primeng/divider';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let companyService: jasmine.SpyObj<CompanyService>;

  beforeEach(async () => {
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', ['getCompany']);

    await TestBed.configureTestingModule({
      imports: [FooterComponent, HttpClientTestingModule, DividerModule],
      providers: [
        { provide: CompanyService, useValue: companyServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    companyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;
  });


  it('should handle error when loading company data', () => {
    spyOn(console, 'error');
    companyService.getCompany.and.throwError('Error loading company');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('Error al cargar los datos de la empresa:', jasmine.any(Error));
  });
});

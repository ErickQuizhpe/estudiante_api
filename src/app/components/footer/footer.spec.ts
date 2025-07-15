import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FooterComponent } from './footer';
import { CompanyService } from '../../services/company-service';
import { DividerModule } from 'primeng/divider';
import { of } from 'rxjs';
import { Company } from '../../models/Company';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let companyService: jasmine.SpyObj<CompanyService>;

  const mockCompany: Company = {
    id: 1,
    name: 'Recetas Caseras',
    description: 'Empresa dedicada a recetas caseras',
    logoUrl: 'https://example.com/logo.png',
    phone: '1234567890',
    email: 'recetas-caseras@gmail.com',
    address: 'Calle 123, Ciudad, Ecuador',
    city: 'Cuenca',
    mission: 'Nuestra misión es ofrecer recetas caseras de alta calidad',
    vision: 'Nuestra visión es ser la empresa líder en recetas caseras',
    socialMedia: [],
    banners: []
  };

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

  it('should create', () => {
    companyService.getCompany.and.returnValue(of(mockCompany));
    expect(component).toBeTruthy();
  });

  it('should load company data on init', () => {
    companyService.getCompany.and.returnValue(of(mockCompany));
    
    component.ngOnInit();
    
    expect(companyService.getCompany).toHaveBeenCalled();
    expect(component.company).toEqual(mockCompany);
  });

  it('should handle error when loading company data', () => {
    spyOn(console, 'error');
    companyService.getCompany.and.throwError('Error loading company');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('Error al cargar los datos de la empresa:', jasmine.any(Error));
  });
});

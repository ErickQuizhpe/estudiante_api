import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Home } from './home';
import { CompanyService } from '../../services/company-service';
import { Company } from '../../models/Company';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let companyServiceSpy: jasmine.SpyObj<CompanyService>;

  beforeEach(async () => {
    const companySpy = jasmine.createSpyObj('CompanyService', ['getCompany']);
    
    const mockCompany: Company = {
      id: 1,
      name: 'Test Company',
      description: 'Test Description',
      logoUrl: '',
      phone: '123456789',
      email: 'test@company.com',
      address: 'Test Address',
      city: 'Test City',
      footerText: 'Test Footer',
      mission: 'Test Mission',
      vision: 'Test Vision',
      socialMedia: [],
      banners: []
    };

    await TestBed.configureTestingModule({
      imports: [Home, HttpClientTestingModule],
      providers: [
        { provide: CompanyService, useValue: companySpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    companyServiceSpy = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;
    
    // Configurar el spy para devolver el mock
    companyServiceSpy.getCompany.and.returnValue(of(mockCompany));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

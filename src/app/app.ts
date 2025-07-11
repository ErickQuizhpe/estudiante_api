import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CompanyService } from './services/company-service';
import { NavbarComponent } from './components/navbar-component/navbar-component';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'recetas-caseras-front';
  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.companyService.getCompany().subscribe((company) => {
      console.log(company);
    });
  }
}

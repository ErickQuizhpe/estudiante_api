import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CompanyService } from '../../services/company-service';
import { Company, SocialMedia } from '../../models/Company';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, DividerModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  company?: Company;
  loading = true;
  error = '';
  // Form fields
  name = '';
  email = '';
  subject = '';
  phone = '';
  message = '';
  sending = false;
  sent = false;
  sendError = '';

  constructor(private companyService: CompanyService) {
    this.companyService.getCompany().subscribe({
      next: (data) => {
        this.company = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la información de contacto.';
        this.loading = false;
      }
    });
  }

  get activeSocialMedia(): SocialMedia[] {
    return this.company?.socialMedia?.filter(s => s.active) || [];
  }

  async sendMessage() {
    this.sending = true;
    this.sent = false;
    this.sendError = '';
    try {
      // @ts-ignore
      const emailjs = (await import('emailjs-com')).default;
      await emailjs.send(
        'Epquizhpeucacue',
        'mailucacue',
        {
          from_name: this.name,
          from_email: this.email,
          subject: this.subject,
          phone: this.phone,
          message: this.message
        },
        '7tPCB8nuIvKF5turX'
      );
      this.sent = true;
      this.name = this.email = this.subject = this.phone = this.message = '';
    } catch (err) {
      this.sendError = 'No se pudo enviar el mensaje. Intenta nuevamente.';
    } finally {
      this.sending = false;
    }
  }
}

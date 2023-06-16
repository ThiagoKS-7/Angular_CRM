import { Component } from '@angular/core';
import { CrmApiService } from '../crm-api.service';
import {  FormBuilder,  FormGroup } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm:FormGroup; 
  loading = false;
  hide = true;
  
  constructor(private crmApiService:CrmApiService, private fb: FormBuilder) {
     // Form element defined below
     this.loginForm = this.fb.group({
      name: '',
      password: '',
    });
  }



  async login() {
    try {
      this.loading = true;
      await this.crmApiService.login(this.loginForm.value);
    } catch(error) {
      console.error(error);
    } finally { 
      this.loading = false;
    }
  }
}

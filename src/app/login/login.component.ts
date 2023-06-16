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
  hide = true;
  
  constructor(private crmApiService:CrmApiService, private fb: FormBuilder) {
     // Form element defined below
     this.loginForm = this.fb.group({
      name: '',
      password: '',
    });
  }



  async login() {
    await this.crmApiService.login(this.loginForm.value);
  }
}

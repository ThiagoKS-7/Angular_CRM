import { Component } from '@angular/core';
import {  FormBuilder,  FormGroup } from '@angular/forms';
import { CrmApiService } from '../crm-api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public  registerForm:FormGroup; 
  hide = true;
  loading = false;

  constructor(private crmApiService:CrmApiService, private fb: FormBuilder, private toastr: ToastrService) {
     // Form element defined below
     this.registerForm = this.fb.group({
      name: '',
      password: '',
      confirmPassword: '',
    });
  }

  async  register() {
    try {
      this.loading = true;
      if (this.registerForm.get('password')?.value != null && this.registerForm.get('password')?.value == this.registerForm.get('confirmPassword')?.value) {
        await this.crmApiService.register({
          name: this.registerForm.get('name')?.value,
          password: this.registerForm.get('password')?.value
        });
      } else {
        this.toastr.error("Passwords dont match! Try again.",'Error:',{
          timeOut: 8000,
        });
      }
    } catch (err) {
      console.error(err);

    } finally {
      this.loading = false;
    }
   
  }
}

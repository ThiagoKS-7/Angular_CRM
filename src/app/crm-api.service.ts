import { Injectable } from '@angular/core';
import axios from 'axios';
import {Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { environment } from './../environments/environment';
axios.defaults.baseURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class CrmApiService {

  constructor(private router:Router, private toastr: ToastrService) { }

  async register(params:object) {
    try {
      const response = await axios.post("/agent/register", params);
      console.log(response)
      localStorage.setItem("token", JSON.stringify(response.data.token));
      this.toastr.success("Agent registered successfully!", "Success!");
      this.router.navigate(['/']);
    } catch(error:any) {
      console.error(error);
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
    }
  }
  async login(params:object) {
    try {
      const response = await axios.post("/agent/login", params);
      localStorage.setItem("token", JSON.stringify(response.data.token));
      this.router.navigate(['/']);
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });

    }
  }
  logout() {
    localStorage.clear();
  }
}

import { Injectable } from '@angular/core';
import axios from 'axios';
import {Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { environment } from './../environments/environment';
import jwt_decode from 'jwt-decode';
axios.defaults.baseURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class CrmApiService {

  constructor(private router:Router, private toastr: ToastrService) { }

  getTokenData() : any {
    try {
      const data = JSON.parse(localStorage.getItem('token') as string);
      const tokenInfo = jwt_decode(data);
      return tokenInfo;
    } catch(error) {
      return null;
    }
  }
  getToken() : any {
    try {
      const data = JSON.parse(localStorage.getItem('token') as string);
      return data;
    } catch(error) {
      return null;
    }
  }
  logout() {
    localStorage.clear();
  }

  handleException(error:any){
    console.error(error);
    if (error?.response) {        
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    } else {
      this.toastr.error(error,'Error:',{
        timeOut: 8000,
      });
      return error;
    }
  }

  async checkToken() {
    const token = this.getToken();
    const isExpired = Date.now() >= token.exp * 1000;
    if (!token || isExpired) {
      this.logout();
      return false;
    }
    return true;
  }

  async register(params:object) {
    try {
      const response = await axios.post("/agent/register", params);
      console.log(response)
      localStorage.setItem("token", JSON.stringify(response.data.token));
      this.toastr.success("Agent registered successfully!", "Success!");
      this.router.navigate(['/']);
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async login(params:object) {
    try {
      const response = await axios.post("/agent/login", params);
      localStorage.setItem("token", JSON.stringify(response.data.token));
      this.router.navigate(['/']);
    } catch(error:any) {
      this.handleException(error);
    }
  }

  async createClient(params:any) : Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const headers = {
        'Authorization': token
      };
      const response = await axios.post("/agent/list-clients", headers, params );
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }

  async listClients() : Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get("/agent/list-clients");
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async listAgents(): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get("/agent/list-clients");
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async listClientsByAgent(): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get("/agent/list-clients-by-agent");
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async editClient(params:object) : Promise<any>{
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.put("/agent/edit-client",  params);
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async updateStatus(params:object): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.put("/agent/update_status", params);
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async asignAgent(params: object): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.patch("/agent/assign", params);
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async deleteClient(params: object): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.patch("/agent/delete-client", params);
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async getAddressByZip(zip: string): Promise<any> {
    try {
      const token = this.getToken();
      console.log(zip)
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.get(`https://viacep.com.br/ws/${zip}/json/`);
      return response
    } catch(error:any) {
      this.handleException(error);
    }
  }
}
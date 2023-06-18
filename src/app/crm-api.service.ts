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
    this.router.navigate(['/login']);
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
    const tokenData = this.getTokenData();
    if (!tokenData) {
      this.toastr.error("Token not found! Please log in in your account.",'Error:',{
        timeOut: 8000,
      });
      this.logout();
      return false;
    }
    const isExpired = Date.now() >= tokenData.exp * 1000;
    if (isExpired) {
      this.toastr.error("Invalid token provided!",'Error:',{
        timeOut: 8000,
      });
      this.logout();
      return false;
    }
    return true;
  }

  async register(params:object) {
    try {
      const response = await axios.post("/agent/register", params);
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
      const validToken = await this.checkToken();
      if (validToken) {
        const token = await this.getToken();
        const response = await axios.post("/agent/create-client", params, { headers: {
          'Authorization':  `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Methods': '*',

        }});

        return response
      }
    } catch(error:any) {
      this.handleException(error);
    }
  }

  async listClients() : Promise<any> {
    try {
      const validToken = await this.checkToken();
      if (validToken) {
        const token = await this.getToken();
        const response = await axios.get("/agent/list-clients", { headers: {
          'Authorization':  `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Methods': '*',

        }});

        return response
      }
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async listAgents(): Promise<any> {
    try {
      const validToken = await this.checkToken();
      if (validToken) {
        const token = await this.getToken();
        const response = await axios.get("/agent/list-agents", { headers: {
          'Authorization':  `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Methods': '*',

        }});
        return response
      }
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async listClientsByAgent(): Promise<any> {
    try {
      const validToken = await this.checkToken();
      if (validToken) {
        const token = await this.getToken();
        const response = await axios.get("/agent/list-clients-by-agent", { headers: {
          'Authorization':  `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Methods': '*',

        }});
        return response
      }
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async editClient(params:object) : Promise<any>{
    try {
      const validToken = await this.checkToken();
      if (validToken) {
        const token = await this.getToken();
        const response = await axios.put("/agent/edit-client", params, { headers: {
          'Authorization':  `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Methods': '*',

        }});
        return response
      }
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async updateStatus(params:object): Promise<any> {
    try {
      const validToken = await this.checkToken();
      if (validToken) {
        const token = await this.getToken();
        const response = await axios.put("/agent/update_status", params, { headers: {
          'Authorization':  `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Methods': '*',

        }});
        return response
      }
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async asignAgent(params: object): Promise<any> {
    try {
      const validToken = await this.checkToken();
      if (validToken) {
        const token = await this.getToken();
        const response = await axios.patch("/agent/assign", params, { headers: {
          'Authorization':  `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Methods': '*',

        }});
        return response
      }
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async deleteClient(params: object): Promise<any> {
    try {
      const validToken = await this.checkToken();
      if (validToken) {
        const token = await this.getToken();
        const response = await axios.patch("/agent/delete-client", params, { headers: {
          'Authorization':  `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Methods': '*',

        }});
        return response
      }
    } catch(error:any) {
      this.handleException(error);
    }
  }
  async getAddressByZip(zip: string): Promise<any> {
    try {
      const token = this.getToken();
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
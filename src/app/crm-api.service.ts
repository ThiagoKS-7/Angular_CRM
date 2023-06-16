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

  getToken():any {
    try {
      const data = JSON.parse(localStorage.getItem('token') as string);
      console.log("DATA", data);
      const tokenInfo = jwt_decode(data);
      console.log("TOKEN INFO", tokenInfo);
    } catch(error) {
      return null;
    }
  }

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

  async createClient() {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.get("/agent/list-clients");
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }

  async listClients() {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.get("/agent/list-clients");
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }
  async listAgents() {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.get("/agent/list-clients");
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }
  async listClientsByAgent() {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.get("/agent/list-clients-by-agent");
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }
  async editClient(params:object) {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.put("/agent/edit-client", params);
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }
  async updateStatus(params:object) {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.put("/agent/update_status", params);
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }
  async assignAgent(params: object) {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.patch("/agent/assign", params);
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }
  async deleteClient(params: object) {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.patch("/agent/delete-client", params);
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }
  async getAddressByZip(zip: string) {
    try {
      const token = this.getToken();
      if (!token) {
        this.toastr.error("Invalid token!",'Error:',{
          timeOut: 8000,
        });
        return
      }
      const response = await axios.get("https://viacep.com.br/ws/"+zip+"/json/");
      console.log(response);
      return response
    } catch(error:any) {
      this.toastr.error(error.response.data.message,'Error:',{
        timeOut: 8000,
      });
      return error.response.data;
    }
  }
}
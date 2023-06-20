import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrmApiService } from '../crm-api.service';
import {Router} from "@angular/router";
import {  FormBuilder,  FormGroup } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public  createClientForm:FormGroup; 
  public  editClientForm:FormGroup; 
  public currentClient: any = {};
  public agents: any = [];
  public crmData: any = {
    waitingForService: [],
    inAttendence: [],
    proposalMade: [],
    notCompleted: [],
    sold: [],
  };
  public confirmationName: string = '';
  public formTemplate: object = { 
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    street: '',
    neighborhood: '',
    number: '',
    zip: ''
  };
  public loading = false;
  public modalLoading=false;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private router: Router, private crmApiService: CrmApiService) {
    this.editClientForm = this.fb.group(this.formTemplate);
    this.createClientForm = this.fb.group(this.formTemplate);
  }
  // https://angular.io/guide/lifecycle-hooks
  ngOnInit() {
    this.checkToken();
  }
  public open(modal: any, client:any): void {
    this.currentClient = client;
    this.modalService.open(modal);
  }

  public openNewTab(url:string) {
    window.open(url, "_blank");
  }
  public openInWhatsapp(url:string) {
    const number = url.replace(/[^\d]/g, ''); 
    window.open("https://wa.me/" + number, "_blank");
  }
  public openInGmail(email:string) {
    window.open("mailto:" + email, "_blank");
  }

  public getFormatedDate(date: string) {
    return moment(date).format('DD/MM/YYYY, hh:mm:ss');
  }
  async drop(event: CdkDragDrop<string[] | any>) {
    const idTranslate:any = {
      "drop-1": "Aguardando atendimento",
      "drop-2": "Em atendimento",
      "drop-3": "Proposta feita",
      "drop-4": "Não concluído",
      "drop-5": "Vendido"
    }
    console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
        );
      const id = event.container.data[event.currentIndex].id;
      await this.updateStatus(id,  idTranslate[event.container.id]);
    }
  }
  async checkToken() {
    const tokeIsValid = await this.crmApiService.checkToken();
    if (tokeIsValid) {
      await this.listClients();
      await this.listAgents();
    }
  }
  async logout() {
    await this.crmApiService.logout();
  }
  async createClient() {
    try {
      this.modalLoading = true;
      let params:any = {
        address: {}
      }
      const addressKeys = ["zip", "city", "state", "street", "neighborhood", "number"]
      for (let key in this.createClientForm.controls) {
        if (addressKeys.includes(key)) {
          params.address[key] = this.createClientForm.controls[key]?.value.toString();
        } else {
          params[key] = this.createClientForm.controls[key]?.value;
        }
      }
      await this.crmApiService.createClient(params);
      await this.listClients();
    } catch (error) {
      console.error(error);
    } finally {
      this.modalLoading =false;
    }
  }
  async asignMyself(id:string) {
    try {
      this.modalLoading = true;
      const tokenData:any = await this.crmApiService.getTokenData();
      await this.crmApiService.asignAgent({id, name:tokenData.name});
      await this.listClients();
    } catch(error) {
      console.error("assignSelfError",error);
    } finally { 
      this.modalLoading = false;
      this.modalService.dismissAll('Cross click');
    }
  }
  async asignAgent(id:string, agentName:any) {
    try {
      this.modalLoading = true;
      await this.crmApiService.asignAgent({id, name:agentName});
      await this.listClients();
    } catch (error) {
      console.error("assignError", error);
    } finally {
      this.modalLoading = false;
      this.modalService.dismissAll('Cross click');
    }
  }
  async listClients() {
    try {    
      this.loading = true;
      const {data} = await this.crmApiService.listClients();
      if (!data){
       return;
      } else {
         this.crmData.waitingForService = data.data.waiting || [],
         this.crmData.inAttendence = data.data.inAttendence || [],
         this.crmData.proposalMade = data.data.proposalMade || [],
         this.crmData.notCompleted = data.data.notCompleted || [],
         this.crmData.sold = data.data.sold || []
       }
    } catch(err) {
      console.error("listClientsError", err);
    } finally {
      this.loading = false;
    }

  }
  async listClientsByAgent() {
    return await this.crmApiService.listClientsByAgent();
  }
  async listAgents() {
    const { data } = await this.crmApiService.listAgents();
    this.agents = data.data;
  }
  async editClient(params:any) {
    await this.crmApiService.editClient(params);
  }
  async updateStatus(id: string, status: string) {
    try {
      this.loading = true;
      const params = {
        id,
        status,
      }
      await this.crmApiService.updateStatus(params);
      await this.listClients();
    } catch(err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }
  async deleteClient() {
    try {
      this.modalLoading = true;
      await this.crmApiService.deleteClient({ id: this.currentClient.id});
      await this.listClients();
    } catch (err) {
      console.error(err);
    } finally {
      this.modalLoading = false;
      this.modalService.dismissAll('Cross click');
    }
  }

  async getAddressByZip(zip:string) {
    const { data } = await this.crmApiService.getAddressByZip(zip);
    if (data) {
      this.createClientForm.patchValue({
        state: data.uf,
        city: data.localidade,
        street: data.logradouro,
        neighborhood: data.bairro,
        zip: data.cep
      })
    }
  }
  onChange(event: any) {
    console.log(event);
  }
}

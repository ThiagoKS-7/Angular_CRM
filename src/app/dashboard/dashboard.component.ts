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
    window.open("https://wa.me/" + url, "_blank");
  }
  public openInGmail(email:string) {
    window.open("mailto:" + email, "_blank");
  }

  public getFormatedDate(date: string) {
    return moment(date).format('DD/MM/YYYY, hh:mm:ss');
  }
  async drop(event: CdkDragDrop<string[] | any>) {
    const idTranslate:any = {
      "cdk-drop-list-0": "Aguardando atendimento",
      "cdk-drop-list-1": "Em atendimento",
      "cdk-drop-list-2": "Proposta feita",
      "cdk-drop-list-3": "Não concluído",
      "cdk-drop-list-4": "Vendido"
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
        );
      const id = event.container.data[0].id;
      await this.updateStatus({id, status:idTranslate[event.container.id]});

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
  async createClient(params:any) {
    await this.crmApiService.createClient(params);
  }
  async asignMyself(id:string) {
    const tokenData:any = await this.crmApiService.getTokenData();
    await this.crmApiService.asignAgent({id, name:tokenData.name});
  }
  async asignAgent(id:string, agentName:any) {
    await this.crmApiService.asignAgent({id, name:agentName});
  }
  async listClients() {
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

  }
  async listClientsByAgent() {
    return await this.crmApiService.listClientsByAgent();
  }
  async listAgents() {
    const { data } = await this.crmApiService.listAgents();
    console.log(data);
    this.agents = data.data;
  }
  async editClient(params:any) {
    await this.crmApiService.editClient(params);
  }
  async updateStatus(params:any) {
    await this.crmApiService.updateStatus(params);
  }
  async deleteClient(params:any) {
    await this.crmApiService.deleteClient(params);
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
}

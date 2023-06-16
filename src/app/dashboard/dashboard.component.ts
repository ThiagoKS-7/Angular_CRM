import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrmApiService } from '../crm-api.service';
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
  waitingForService:any = [
    {
    id: 1,
    name: "Cliente1", 
    email: "cliente1@gmail.com", 
    status: "Aguardando atendimento",
    phone: "123", 
    address: {
      city: "San Francisco",
      state: "CA",
      neighborhood: "San Francisco",
      street: "test street",
      number: "123",
      zip: "123",
    },
    createdAt: "2023-06-15T22:06:43.271+00:00"
  },
  {
    id: 2,
    name: "Cliente2", 
    email: "cliente1@gmail.com", 
    status: "Aguardando atendimento",
    phone: "123", 
    address: {
      city: "San Francisco",
      state: "CA",
      neighborhood: "San Francisco",
      street: "test street",
      number: "123",
      zip: "123",
    },
    createdAt: "2023-06-15T22:06:43.271+00:00"
  },
];
  inAttendence:any = [];
  proposalMade:any = [];
  notCompleted:any = [];
  sold:any = [];
  currentClient: any = {};
  agents: any = [
    {
        "id": "648a02a477115edf7a8e8502",
        "name": "Agente 1",
        "password": "$2b$08$RogRE5qaFJfdZmuPOc0eF.Wg92.Fq3gOszEQ.KRR66HoroTRU6pr2",
        "clients": [],
        "createdAt": "2023-06-14T18:10:44.834Z"
    },
    {
        "id": "648b8b730b28545dd8400dfd",
        "name": "Agente 2",
        "password": "$2b$08$0wOMIH5yUgeqHg1xm4YJ2OtHDzWdK6HtEneu1R.jXg9jTl0ghXVfS",
        "clients": [],
        "createdAt": "2023-06-15T22:06:43.271Z"
    },
    {
        "id": "648b9c0113ea0b968df90831",
        "name": "Agente 3",
        "password": "$2b$08$r0FyZf3WYkN15eXJyvrOfu460fE6BEmYkeV9pYohposTHclqGrJxu",
        "clients": [],
        "createdAt": "2023-06-15T23:17:21.386Z"
    },
    {
        "id": "648bbc27c43f5952ee19d102",
        "name": "Agente 4",
        "password": "$2b$08$mpzDtG5imZsp7eyCYwqlDug1941WKz5BbSGdqRsBHJtt.Hc/2VsDC",
        "clients": [],
        "createdAt": "2023-06-16T01:34:31.410Z"
    },
    {
        "id": "648bbc91c43f5952ee19d103",
        "name": "Agente 5",
        "password": "$2b$08$rL3fX63waKZogxhIRqB1i.lPXjDonf.PUX6dM6Wn74WrevJpEGhby",
        "clients": [],
        "createdAt": "2023-06-16T01:36:17.318Z"
    },
    {
        "id": "648bbf1bd98ca39b5fe45229",
        "name": "Agente 6",
        "password": "$2b$08$9vs8c/mqDWEjOFH0F1tsquPaJL3iwAKLDMfVwm1CWplYqzcxn3NL6",
        "clients": [],
        "createdAt": "2023-06-16T01:47:06.475Z"
    },
    {
        "id": "648bbfe8a5521d74d837a2eb",
        "name": "Agente 7",
        "password": "$2b$08$zAAymbKlaoyqQPFujMK4l.gfl0QkbWZ2AwZm8C.sh/qrfV2xd/vZW",
        "clients": [],
        "createdAt": "2023-06-16T01:50:32.235Z"
    },
    {
        "id": "648bced322b76f2a731e935a",
        "name": "Agente 8",
        "password": "$2b$08$5t/D.1UtYrkCRyz26aeD3uFpddSc8NPSkoLZ5Dk32q7TBzzTecyJO",
        "clients": [],
        "createdAt": "2023-06-16T02:54:11.303Z"
    },
    {
        "id": "648bef9b38a3fba0e831ae5e",
        "name": "Agente 10",
        "password": "$2b$08$xqWCI1QG.KjTfsRRSPyDa.IIxDHxJF3QO/qgN.op9B17B1JuzVRL2",
        "clients": [],
        "createdAt": "2023-06-16T05:14:02.661Z"
    },
];

  constructor(private modalService: NgbModal, private fb: FormBuilder,  private crmApiService: CrmApiService) {
    this.editClientForm = this.fb.group({
      name: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      street: '',
      neighborhood: '',
      number: '',
      zip: ''
    });
    this.createClientForm = this.fb.group({
      name: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      street: '',
      neighborhood: '',
      number: '',
      zip: ''
    });
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

  public drop(event: CdkDragDrop<string[] | any>) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  async logout() {
    await this.crmApiService.logout();
  }
  async createClient() {

  }
  async asignMyself() {
    await this.crmApiService.getToken();
  }
  async asignAgent() {

  }
  async listClients() {

  }
  async listClientsByAgent() {

  }
  async listAgents() {
    
  }
  async editClient() {

  }
  async updateStatus() {

  }
  async deleteClient() {}

  public getFormatedDate(date: string) {
    return moment(date).format('DD/MM/YYYY, hh:mm:ss');
  }
  async getAddressByZip(zip:string) {
    return await this.crmApiService.getAddressByZip(zip);
  }
}

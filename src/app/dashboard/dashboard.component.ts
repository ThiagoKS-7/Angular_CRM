import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrmApiService } from '../crm-api.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  waitingForService:any = [
    {
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
    }
  },
  {
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
    }
  },
];
  inAttendence:any = [];
  proposalMade:any = [];
  notCompleted:any = [];
  sold:any = [];

  constructor(private modalService: NgbModal, private crmApiService: CrmApiService) {
  }
  

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public openNewTab(url:string) {
    window.open(url, "_blank");
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
}

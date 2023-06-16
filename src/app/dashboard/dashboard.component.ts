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
  waitingForService = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  inAttendence = [];
  proposalMade = [];
  notCompleted = [];
  sold = [];

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

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  inAttendence = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  proposalMade = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  notCompleted = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  sold = [];

  constructor(private modalService: NgbModal) {
  }
  

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public openNewTab(url:string) {
    window.open(url, "_blank");
  }
  drop(event: CdkDragDrop<string[]>) {
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
}

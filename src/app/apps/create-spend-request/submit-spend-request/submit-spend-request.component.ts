import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-submit-spend-request',
  imports: [CommonModule],
  templateUrl: './submit-spend-request.component.html',
  styleUrl: './submit-spend-request.component.scss'
})
export class SubmitSpendRequestComponent {
  @Output() finalSubmitionClick = new EventEmitter<any>();
  isActive:boolean=true
  data:any={}

  clickNext() {
    this.finalSubmitionClick.emit(this.data);
  }
}

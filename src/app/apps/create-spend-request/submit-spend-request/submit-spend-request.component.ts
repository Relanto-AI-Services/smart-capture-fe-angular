import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-submit-spend-request',
  imports: [CommonModule, MatDividerModule, MatCardModule, MatButtonModule, MatIconModule],
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

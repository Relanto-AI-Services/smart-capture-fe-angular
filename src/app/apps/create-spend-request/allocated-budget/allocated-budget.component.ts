import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allocated-budget',
  imports: [CommonModule],
  templateUrl: './allocated-budget.component.html',
  styleUrl: './allocated-budget.component.scss'
})
export class AllocatedBudgetComponent {
  @Output() sowClick = new EventEmitter<any>();
  isActive:boolean=true
  clickNext(type:any) {
    this.sowClick.emit('');
  }
}

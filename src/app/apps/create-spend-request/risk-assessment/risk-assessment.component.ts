import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-risk-assessment',
  imports: [CommonModule],
  templateUrl: './risk-assessment.component.html',
  styleUrl: './risk-assessment.component.scss'
})
export class RiskAssessmentComponent {
  @Output() riskAssessmentClick = new EventEmitter<any>();
  isActive:boolean=true
  data:any={}

  clickNext() {
    this.riskAssessmentClick.emit(this.data);
  }
}

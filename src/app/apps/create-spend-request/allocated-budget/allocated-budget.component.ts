import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';

interface BudgetDetail {
  name: string;
  description: string;
  q1: number;
  q2: number;
  allPeriods: number;
}

interface ForecastBudget {
  title: string;
  selectedPeriod: string;
  periods: string[];
  budgetRemaining: number;
  details: BudgetDetail[];
  expanded: boolean;
}
@Component({
  selector: 'app-allocated-budget',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule
  ],
  templateUrl: './allocated-budget.component.html',
  styleUrl: './allocated-budget.component.scss'
})
export class AllocatedBudgetComponent {
  @Output() allocatedBudgetSubmit = new EventEmitter<any>();
  isActive:boolean=true
  totalSpend: number = 20000;
  eventId: any = '';

  forecastBudget = [
    {
      title: '09S: Cloud Summits - NORTHAM',
      selectedPeriod: 'Q1 FY254',
      budgetRemaining: 45000,
      expanded: true,
      periods: ['Q1 FY25', 'Q2 FY25', 'All Periods'],
      details: [
        {
          name: 'Cloud Summit',
          description: 'SCA12696 - Event & Experience',
          q1: 5000,
          q2: 5000,
          allPeriods: 10000,
        },
      ],
    },
    {
      title: '09S: NEXT Global',
      selectedPeriod: 'Q1 FY254',
      budgetRemaining: 32000,
      expanded: false,
      periods: ['Q1 FY25', 'Q2 FY25', 'All Periods'],
      details: [
        {
          name: 'Cloud Summit',
          description: 'SCA12696 - Event & Experience',
          q1: 5000,
          q2: 5000,
          allPeriods: 10000,
        }
      ],
    },
  ];

  distributeTotalSpend() {
    let totalAllocations = this.forecastBudget.reduce((sum, budget) => sum + budget.details.length, 0);
    if (totalAllocations > 0) {
      let equalAmount = this.totalSpend / totalAllocations;
      this.forecastBudget.forEach(budget => {
        budget.details.forEach(detail => {
          detail.q1 = equalAmount / 2;
          detail.q2 = equalAmount / 2;
          detail.allPeriods = equalAmount;
        });
      });
    }
  }
  toggleExpand(index: number) {
    this.forecastBudget[index].expanded = !this.forecastBudget[index].expanded;
  }
  clickNext(type:any) {
    this.allocatedBudgetSubmit.emit('');
  }

}

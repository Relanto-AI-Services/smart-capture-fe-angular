import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../../services/auth/auth.service';

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
  @Input() sowFormSubmitedData!: any;
  isActive:boolean=true
  totalSpend: number = 20000;
  eventId: any = '';
  selectedCurrency:any=''
  forecastBudget = [
    {
      title: '09S: Cloud Summits - NORTHAM',
      selectedPeriod: 'Q1 FY25',
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
      selectedPeriod: 'Q2 FY25',
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
  constructor(public authservice:AuthService){}
  ngOnInit() {
    this.selectedCurrency = this.sowFormSubmitedData.value.currency
    console.log('sowFormData',this.sowFormSubmitedData.value);

  }
  distributeTotalSpend() {
    if (!this.totalSpend || this.forecastBudget.length === 0) {
      return;
    }
  
    const numBudgets = this.forecastBudget.length;
    let remainingAmount = this.totalSpend;
    let distributedAmount = Math.floor(this.totalSpend / numBudgets); // Ensure integer division
  
    this.forecastBudget.forEach((budget, index) => {
      budget.details.forEach(detail => {
        // Distribute evenly and remove decimal places
        detail.q1 = Math.floor(distributedAmount / 3);
        detail.q2 = Math.floor(distributedAmount / 3);
        detail.allPeriods = distributedAmount;
  
        // Handle remaining amount on last item to balance total
        if (index === this.forecastBudget.length - 1) {
          detail.allPeriods += remainingAmount % numBudgets; 
        }
      });
  
      remainingAmount -= distributedAmount;
    });
  }
  
  toggleExpand(index: number) {
    this.forecastBudget[index].expanded = !this.forecastBudget[index].expanded;
  }
  getFormData(){
    try {
      this.authservice.getData('').subscribe((res:any)=>{
        console.log(res);
      })
    } catch (error) {
      console.error('error',error)
    }
  }
  pushFormData(){
    try {
      this.authservice.postData('','').subscribe((res:any)=>{
        console.log(res);
      })
    } catch (error) {
      console.error('error',error)
    }
  }
  validateForm(): boolean {
    return (
      this.totalSpend &&
      this.eventId?.match(/^[A-Za-z]{2}\d{6,8}$/) &&
      this.forecastBudget.every(budget =>
        budget.details.every(detail =>
          detail.q1 !== null && detail.q2 !== null && detail.allPeriods !== null
        )
      )
    );
  }
  
  onSubmit() {
    if (!this.validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }
    // Proceed with form submission logic
  }
  
  clickNext(type:any) {
    this.allocatedBudgetSubmit.emit('');
  }

}

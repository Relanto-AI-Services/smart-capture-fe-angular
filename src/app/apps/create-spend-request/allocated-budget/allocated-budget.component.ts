import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonService } from '../../../services/common/common.service';

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
  totalSpend: number = 0;
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
  public sowExtractedData:any={}
  constructor(public authservice:AuthService,public commonService:CommonService){}

  ngOnInit() {
    this.selectedCurrency = this.sowFormSubmitedData.value.currency
    const extractedData = localStorage.getItem("extractedData");
    if (extractedData) {
      const parsedData = JSON.parse(extractedData);
      this.totalSpend = parsedData?.total_amount 
      this.getFormData(parsedData?.row_id) 
    }
    this.commonService.getFormData$().subscribe(data => {
      let isFormFilled = this.isAnyValueFilled(data?.budgetFormData)
      if(isFormFilled){
        this.eventId = data?.budgetFormData?.eventId
        this.selectedCurrency = data?.budgetFormData?.selectedCurrency
        this.forecastBudget = data?.budgetFormData?.forecastBudget
      }
    });
    
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
  getFormData(id:any){
    try {
      this.authservice.postData('/get_spend_request_tactic_data',{spend_request_id:id}).subscribe((res:any)=>{
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
      (this.eventId?.match(/^[A-Za-z]{2}\d{6,8}$/) || this.eventId === "") &&
      this.forecastBudget.every(budget =>
        budget.details.every(detail =>
          detail.q1 !== null && detail.q2 !== null 
          // detail.q1 !== null && detail.q2 !== null && detail.allPeriods !== null
        )
      )
    );
  }
  
  onSubmit() {
    if (!this.validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }else{
      let budgetFormData = {
        totalSpend:this.totalSpend,
        eventId:this.eventId,
        selectedCurrency:this.selectedCurrency,
        forecastBudget:this.forecastBudget
      }
      let payload ={
        "spend_request_id": "2b2d9e13-6f9b-438f-af9c-98904144c96e",
        "tactic_code": "26197",
        "tactic_spend_code": "26197 | SR001_SC",
        "grandchild_cc_code": "1Q1: C14: GC21",
        "tactic_spend_cc_code": "26197 | SR001_SC | 1Q1: C14: GC21",
        "forecast": 200,
        "tactic_id": "TID001",
        "cc_name": "Cost Center A"
    }
      this.authservice.postData('/ingest_to_budget_forecast',payload).subscribe((res:any)=>{
        console.log(res)
        this.allocatedBudgetSubmit.emit({data:'',type:'continue'});
      })
      this.commonService.setFormData({budgetFormData:budgetFormData})
    }
    // Proceed with form submission logic
  }
  
  clickNext(type:any) {
    if(type === 'continue'){
      this.onSubmit()
    }else{
      this.allocatedBudgetSubmit.emit({data:'',type:'back'});
    }
  }
  isAnyValueFilled = (obj: Record<string, any>): boolean => {
    if (!obj || typeof obj !== 'object') return false;
  
    return Object.values(obj).some(value =>
      Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== ''
    );
  };
  
  
}

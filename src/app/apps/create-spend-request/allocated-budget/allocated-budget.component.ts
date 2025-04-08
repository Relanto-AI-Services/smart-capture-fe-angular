import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonService } from '../../../services/common/common.service';
interface TacticDetail {
  expanded: boolean;
  selectedPeriod: string;
  budgetRemaining: number;
  tactic_id: string;
  tactic_name: string;
  tactic_type: string;
  primary_cost_center: string;
  tactic_code: string;
  cost_center_code: string;
  forecast: { [key: string]: number }; // ✅ Add forecast here
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
  @Input() rowId!: string;
  isActive: boolean = true
  totalSpend: number = 0;
  eventId: any = '';
  selectedCurrency: any = ''
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
  public sowExtractedData: any = {}
  // fetchedBudgetData = {
  //   "spend_request_id": "SR-SCTE0893",
  //   "time": ["Q1 FY25", "Q2 FY24", "Q3 FY24", "Q4 FY24"],
  //   "tactic_details": [
  //     {
  //       expanded:true,
  //       selectedPeriod:'Q1 FY25',
  //       budgetRemaining:45000,
  //       "tactic_id": "TAC-67890",
  //       "tactic_name": "Marketing Campaign",
  //       "tactic_type": "Digital",
  //       "primary_cost_center": "Marketing Department",
  //       "tactic_code": "MKT-001",
  //       "cost_center_code": "MKT-001-CC"
  //     }
  //   ]
  // }
  fetchedBudgetData:any 
  // {
  //   spend_request_id: string;
  //   time: string[];
  //   tactic_details: TacticDetail[];
  // } = {
  //     spend_request_id: '',
  //     time: [],
  //     tactic_details: []
  //   };


  constructor(public authservice: AuthService, public commonService: CommonService) { }

  ngOnInit() {
    // this.fetchedBudgetData = {
    //   spend_request_id: '',
    //   "time": ["Q1 FY25", "Q2 FY24"],
    //   tactic_details: [{
    //     expanded: true,
    //     selectedPeriod: 'Q1 FY25',
    //     budgetRemaining: 45000,
    //     "tactic_id": "TAC-67890",
    //     "tactic_name": "Marketing Campaign",
    //     "tactic_type": "Digital",
    //     "primary_cost_center": "Marketing Department",
    //     "tactic_code": "MKT-001",
    //     "cost_center_code": "MKT-001-CC"
    //   },
    //   {
    //     expanded: true,
    //     selectedPeriod: 'Q1 FY25',
    //     budgetRemaining: 45000,
    //     "tactic_id": "TAC-67890",
    //     "tactic_name": "Marketing Campaign",
    //     "tactic_type": "Digital",
    //     "primary_cost_center": "Marketing Department",
    //     "tactic_code": "MKT-001",
    //     "cost_center_code": "MKT-001-CC"
    //   }] as TacticDetail[]
    // };

    this.selectedCurrency = this.sowFormSubmitedData.value.currency
    const extractedData = localStorage.getItem("extractedData");
    if (extractedData) {
      const parsedData = JSON.parse(extractedData);
      this.totalSpend = parsedData?.results[0]?.spend_request[0]?.total_amount
      this.getBudgetFormData(this.rowId)
    }
    this.commonService.getFormData$().subscribe(data => {
      let isFormFilled = this.isAnyValueFilled(data?.budgetFormData)
      if (isFormFilled) {
        this.eventId = data?.budgetFormData?.eventId
        this.selectedCurrency = data?.budgetFormData?.selectedCurrency
        this.forecastBudget = data?.budgetFormData?.forecastBudget
      }
    });
    // this.fetchedBudgetData.tactic_details = this.fetchedBudgetData.tactic_details.map(detail => {
    //   const forecast: any = {};
    //   this.fetchedBudgetData.time.forEach((period: any) => forecast[period] = 0);
    //   return { ...detail, forecast };
    // });

    console.log('this.fetchedBudgetData', this.fetchedBudgetData);

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
  getBudgetFormData(id: any) {
    try {
      this.authservice.postData('/budget_tactic_fetch', { spend_request_id: id }).subscribe((res: any) => {
        console.log(res);
        // let res = {
        //   spend_request_id: '',
        //   "time": ["Q1 FY25", "Q2 FY24"],
        //   tactic_details: [{
        //     "tactic_id": "TAC-67890",
        //     "tactic_name": "Marketing Campaign",
        //     "tactic_type": "Digital",
        //     "primary_cost_center": "Marketing Department",
        //     "tactic_code": "MKT-001",
        //     "cost_center_code": "MKT-001-CC"
        //   },
        //   {
        //     "tactic_id": "TAC-67890",
        //     "tactic_name": "Marketing Campaign",
        //     "tactic_type": "Digital",
        //     "primary_cost_center": "Marketing Department",
        //     "tactic_code": "MKT-001",
        //     "cost_center_code": "MKT-001-CC"
        //   }]
        // }
        this.fetchedBudgetData = res
        this.fetchedBudgetData.tactic_details = this.fetchedBudgetData.tactic_details.map((detail:any) => {
          const forecast: any = {};
          this.fetchedBudgetData.time.forEach((period: any) => forecast[period] = 0);
          return { ...detail, forecast, expanded: true,
            selectedPeriod: 'Q1 FY25',
            budgetRemaining: 45000,};
        });
      })
    } catch (error) {
      console.error('error', error)
    }
  }
  pushFormData(payload:any) {
    try {
      // let payload = payload
      this.authservice.postData('/ingest_to_budget_forecast', payload).subscribe((res: any) => {
        console.log(res);
        this.allocatedBudgetSubmit.emit({ data: '', type: 'continue' });
      })
    } catch (error) {
      console.error('error', error)
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
    } else {
      this.submitForecastForm()
      return
      let budgetFormData = {
        totalSpend: this.totalSpend,
        eventId: this.eventId,
        selectedCurrency: this.selectedCurrency,
        forecastBudget: this.forecastBudget
      }
      let payload = {
        "spend_request_id": "2b2d9e13-6f9b-438f-af9c-98904144c96e",
        "tactic_code": "26197",
        "tactic_spend_code": "26197 | SR001_SC",
        "grandchild_cc_code": "1Q1: C14: GC21",
        "tactic_spend_cc_code": "26197 | SR001_SC | 1Q1: C14: GC21",
        "forecast": 200,
        "tactic_id": "TID001",
        "cc_name": "Cost Center A"
      }
      this.authservice.postData('/ingest_to_budget_forecast', payload).subscribe((res: any) => {
        console.log(res)
        this.allocatedBudgetSubmit.emit({ data: '', type: 'continue' });
      })
      this.commonService.setFormData({ budgetFormData: budgetFormData })
    }
    // Proceed with form submission logic
  }

  clickNext(type: any) {
    if (type === 'continue') {
      this.onSubmit()
    } else {
      this.allocatedBudgetSubmit.emit({ data: '', type: 'back' });
    }
  }
  isAnyValueFilled = (obj: Record<string, any>): boolean => {
    if (!obj || typeof obj !== 'object') return false;

    return Object.values(obj).some(value =>
      Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== ''
    );
  };

  getTotalForecast(budget: any): number {
    return Object.values(budget.forecast).reduce((total: number, val: any) => total + Number(val), 0);
  }
  submitForecastForm() {
    const now = new Date().toISOString().replace('Z', ' UTC');
  
    const response: any = {
      data: []
    };
  
    this.fetchedBudgetData.tactic_details.forEach((detail: any) => {
      const tacticDetails: any[] = [];
  
      Object.keys(detail.forecast).forEach((timePeriod: string) => {
        const forecastValue = detail.forecast[timePeriod];
        if (forecastValue > 0) {
          tacticDetails.push({
            tactic_code: detail?.tactic_code,
            tactic_spend_code: `${detail?.tactic_code} | ${this.rowId}`,
            grandchild_cc_code: '',
            tactic_spend_cc_code:  `${detail?.tactic_code} | ${this.rowId} | ${detail?.grandchild_cc_code}`,
            tactic_id: detail.tactic_id,
            time: timePeriod,
            forecast: forecastValue.toString(),
            cc_name: detail.primary_cost_center,
            is_active: 'FALSE',
            created_time: now,
            updated_time: now
          });
        }
      });
  
      if (tacticDetails.length > 0) {
        response.data.push({
          spend_request_id: this.rowId,
          tactic_details: tacticDetails
        });
      }
    });
    this.pushFormData(response)
    // this.budgetFormPayload = response
    console.log('Final Submit Data:', response);
  }
  
  

}

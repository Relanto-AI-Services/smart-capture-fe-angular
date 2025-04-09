import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-submit-spend-request',
  imports: [CommonModule, MatDividerModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './submit-spend-request.component.html',
  styleUrl: './submit-spend-request.component.scss'
})
export class SubmitSpendRequestComponent implements OnInit {
  @Output() finalSubmitionClick = new EventEmitter<any>();
  @Input() rowId!: string;
  isActive:boolean=true
  data:any={}
  sowdata: any = {};
  reviewData: any = {};
  budgetData: any = {};


  constructor(private apiService: ApiService){

  }

  ngOnInit(): void {
    this.fetchSubmitAndReview();
  }

  clickNext(type:any) {
    if (type === 'continue') {
      this.postSubmitAndReview();
      this.finalSubmitionClick.emit({ data: this.data, type: 'continue' });
    }else{
      this.finalSubmitionClick.emit({ data: this.data, type: 'back' });
    }
  }

  postSubmitAndReview(){
    this.apiService.postReviewAndSubmitData( this.rowId ).subscribe({
      next: (response) =>{        
        console.log('Success:', response)},
      error: (error) => console.error('Error:', error)
    });
  
  }

  fetchSubmitAndReview(){
    this.apiService.getReviewAndSubmitData( this.rowId ).subscribe({
      next: (response) =>{
        this.data = response;
        this.sowdata = this.data.sow;
        this.budgetData = this.groupByCCName(this.data.budget.tactic_details);
        this.reviewData = this.data.review.risk_fields;

        
        console.log('Success:', response)},
      error: (error) => console.error('Error:', error)
    });
  
  }


   groupByCCName(data: any[]): any[] {
    const grouped: { [key: string]: any } = {};
    data.forEach(item => {
      const ccName = item.cc_name;
      if (!grouped[ccName]) {
        grouped[ccName] = { cc_name: ccName };
      }
      for (const key in item) {
        if (key !== 'cc_name') {
          if (!grouped[ccName][key]) {
            grouped[ccName][key] = [];
          }
          grouped[ccName][key].push(item[key]);
        }
      }
    });
  
    return Object.values(grouped);
  }
  



}

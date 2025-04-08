import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
export class SubmitSpendRequestComponent {
  @Output() finalSubmitionClick = new EventEmitter<any>();
  isActive:boolean=true
  data:any={}

  constructor(private apiService: ApiService){

  }

  clickNext(type:any) {
    if (type === 'continue') {
      this.finalSubmitionClick.emit({ data: this.data, type: 'continue' });
    }else{
      this.finalSubmitionClick.emit({ data: this.data, type: 'back' });
    }
  }

 




  fetchSubmitAndReview() {
    this.apiService.getReviewAndSubmitData().subscribe({
      next: (response: any) => {
        console.log("Raw API Response:", response);
      
      },
      error: (error) => {
        console.error("Error fetching spend request data:", error);
      },
    
    });
   
  }
}

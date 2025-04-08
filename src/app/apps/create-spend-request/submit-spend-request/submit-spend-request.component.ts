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

  constructor(private apiService: ApiService){

  }

  ngOnInit(): void {
    this.fetchSubmitAndReview();
  }

  clickNext(type:any) {
    if (type === 'continue') {
      this.finalSubmitionClick.emit({ data: this.data, type: 'continue' });
    }else{
      this.finalSubmitionClick.emit({ data: this.data, type: 'back' });
    }
  }

 

  fetchSubmitAndReview(){
    this.apiService.getReviewAndSubmitData( this.rowId ).subscribe({
      next: (response) =>{
        this.data = response;
        console.log('Success:', response)},
      error: (error) => console.error('Error:', error)
    });
  
  }



}

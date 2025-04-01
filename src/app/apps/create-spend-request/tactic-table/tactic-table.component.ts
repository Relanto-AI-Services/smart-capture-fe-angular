import { CommonModule,  } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonService } from '../../../services/common/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-tactic-table',
  imports: [FormsModule, ReactiveFormsModule, CommonModule,
    //  DragDropModule 
    ],
  templateUrl: './tactic-table.component.html',
  styleUrl: './tactic-table.component.scss',
})
export class TacticTableComponent implements OnInit {
  @Output() tacticClick = new EventEmitter<any>();
  selectedFilter = 'Cost Center';
  searchText = '';
  filters = ['Name', 'ID', 'Cost Center', 'Type', 'Program'];
  isActive: boolean = false;
  // private dialog = inject(MatDialog);
  private cdr= inject(ChangeDetectorRef);
  cs = inject(CommonService)

  data = [
{
id: 'SCA12696',
tacticName: 'Cloud Summit',
subTitle: 'Multiple Events - Central: 1P SMB Webinars',
program: 'Program',
type: 'Events & Experiences: Multiple Events',
startDate: '1/1/2025',
endDate: '12/29/2025',
costCenter: '1P8: Touched Center - Traditional',
warning: '',
warningAction: '',
},
{
id: 'GLO24352',
tacticName: 'Leaders Connect',
subTitle: 'Single Event - Cloud Summit JAPAC',
program: 'Vendor',
type: 'Events & Experiences: Single Event',
startDate: '1/1/2025',
endDate: '12/29/2025',
costCenter: '095: Cloud Summit - JAPAC',
warning: '',
warningAction: '',
},
{
id: 'GLO63746',
tacticName: 'webinars',
subTitle: 'Multiple Events',
program: 'Program',
type: 'Events & Experiences: Multiple Events',
startDate: '1/1/2025',
endDate: '12/29/2025',
costCenter: '095: Cloud Summit - JAPAC APAC',
warning: 'Missing Basic Details',
warningAction: 'Edit Tactic',
},
{
id: 'SCA12696',
tacticName: 'Event & Experience',
subTitle: 'Multiple Events - Mumbai Leaders Connect',
program: 'vendor',
type: 'Events & Experiences: Multiple Events',
startDate: '1/1/2025',
endDate: '12/29/2025',
costCenter: '095: Cloud Summit - EMEA',
warning: '',
warningAction: '',
},
{
id: 'GLO34526',
tacticName: 'Event & Experience',
subTitle: 'Single Event',
program: 'vendor',
type: 'Events & Experiences: multiple Event',
startDate: '1/1/2025',
endDate: '12/29/2025',
costCenter: '095: Cloud Summit - JAPAC',
warning: 'Missing Basic Details',
warningAction: 'Edit Tactic',
},
{
id: 'SCA23432',
tacticName: 'Event & Experience',
subTitle: 'Single Event - Sydney Summit',
program: 'Program',
type: 'Events & Experiences: Multiple Events',
startDate: '1/1/2025',
endDate: '12/29/2025',
costCenter: '095: Cloud Summit - JAPAC APAC',
warning: '',
warningAction: '',
},

];
  droppedItems: any[] = [];

  filteredData = [...this.data];

  selectedData: any[] = [];
  conceptValue: boolean = false;
  editPopUp: boolean = false;
  // spendRequestData: any;
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cs.value$.subscribe((newValue) => {
      this.conceptValue = newValue; 
    });
    this. fetchSpendRequestData()
  }

  fetchSpendRequestData() {
    this.apiService.getSpendRequest().subscribe({
      next: (data :any) => {
        this.data = data;
        this.data = data.map((item: any) => ({
          id: item["Tactic ID"],           
          tacticName: item["Tactic title"], 
          program: item["PV"],              
          type: item["Tactic Type"],        
          startDate: item["Start date"],   
          endDate: item["End date"],        
          costCenter: item["Primary CC"],  
          warning: item["Priority"], 
        }));
        this.filteredData = this.data;
        console.log("Filtered Data:", this.filteredData);
      },
      error: (error) => {
        console.error('Error fetching spend request data:', error);
      },
    });
  }

  toggleSelection(event: any, row: any) {
    this.isActive = true;
    if (event.target.checked) {
      this.selectedData.push(row);
    } else {
      this.selectedData = this.selectedData.filter((item) => item !== row);
    }
  }

  performAction(action: string) {
    this.editPopUp  = true;
  }

  applyFilter(): void {
    const filterMap: Record<string, keyof (typeof this.data)[0]> = {
      Name: 'tacticName',
      ID: 'id',
      'Cost Center': 'costCenter',
      Type: 'type',
      Program: 'program'
    };

    const filterKey = filterMap[this.selectedFilter];

    if (!filterKey) {
      this.filteredData = [...this.data];
      return;
    }

    this.filteredData = this.data.filter((row) =>
      row[filterKey]
        ?.toString()
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  resetIfEmpty(): void {
    console.log('hello');
    if (!this.searchText.trim()) {
      this.filteredData = [...this.data]; // Restore full table
    }
  }

  //   editDetails(row:any){
  //     console.log(row);
  //   }
  clickNext(type: any) {
    if(type === 'continue' && this.selectedData.length){
      this.sendRequest([...this.selectedData])
      this.tacticClick.emit({ ...this.selectedData, type: type });
    }else{
      this.tacticClick.emit({ ...this.selectedData, type: type });
    }
  }
 

  sendRequest(arr: Array<any>) {
    console.log(arr)
    const spendRequestId = this.generateRandomString(10);
    const tacticNames = arr.map((dt) => {
      return dt.id + '-' +dt.tacticName
    })
   

    this.apiService.saveSpendRequestTactic(spendRequestId, tacticNames).subscribe({
      next: (response) => console.log('Success:', response),
      error: (error) => console.error('Error:', error)
    });
  }


   generateRandomString(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


 

  closePopup() {
    this.editPopUp = false;
  }


}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { GoogleDriveService } from '../../../services/googleDrive/google-drive.service';
import { SowFormComponent } from "../sow-form/sow-form.component";
import { CommonService } from '../../../services/common/common.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { LoaderModalComponent } from '../../../components/shared/loader-modal/loader-modal.component';

@Component({
  selector: 'app-sow',
  imports: [CommonModule, SowFormComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

  ],
  templateUrl: './sow.component.html',
  styleUrl: './sow.component.scss'
})
export class SowComponent {
  @Output() sowClick = new EventEmitter<any>();
  @ViewChild(SowFormComponent) sowForm!: SowFormComponent;
  @Input() rowId!: string;
  @Output() sowFormDataChange = new EventEmitter<any>();
  @Input() formData!: any;

  isActive: boolean = true
  data: any = {}
  public user = localStorage.getItem('user')
  public userData = JSON.parse(this.user ? this.user : '');
  public accessType: any = 'writer'
  selectedFiles: any[] = [];
  oauthToken: string = this.userData?.token?.client_id;
  showSowForm: boolean = false;
  extractedData: any = this.formData
  userName: string = 'John Doe';
  firstLetter: string = this.userData?.email.charAt(0).toUpperCase();
  dialogRef: any;
  constructor(public authService: AuthService, private googleDriveService: GoogleDriveService, public commonService: CommonService, private dialog: MatDialog) {
    console.log(this.formData);
    
  }
  ngOnInit() {
    this.selectedFiles = []
    this.googleDriveService.fileSelected.subscribe((files) => {
      this.selectedFiles = files;
      console.log("fileeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", this.selectedFiles);
    });

  }

  openGoogleDrivePicker() {
    this.googleDriveService.openPicker();
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  clickNext(type: any) {
    if (type === 'extract') {
      // this.sowClick.emit({data:this.sowForm.sowForm,type:'extract'});
      if(this.selectedFiles.length === 0){
        this.showSowForm = true // after extracting data
        window.setTimeout(() => {
          this.sowClick.emit({data:this.sowForm?.sowForm?.value,type:'extract'});
        }, 500);
      }else{
        this.shareAccess()
      }
    } else {
      this.sowForm.onSubmit();
      if (this.sowForm.isFormValid && this.extractedData) {
        this.sowClick.emit({data:this.sowForm?.sowForm,type:'submit'});
      }
    }
  }
  shareAccess() {
    try {
      let id = this.selectedFiles[0].id
      const payload = {
        "doc_links": [`https://docs.google.com/document/d/${id}/`],
        "roles": [this.accessType]
      }
      this.openLoader()
      this.authService.postData('/share', payload).subscribe(
        {
          next: (res) => {
            let processPayload = {
              urls: [res.shared_links[0].shared_link],
              row_id: this.rowId
            }
            this.extractData(processPayload)
          },
          error: (error) => {
            console.error('Error Status:', error.status);
            console.error('Error Message:', error.message);
          }
        })
    } catch (error) {
      console.error('error', error)
    }
  }

  extractData(payload: any) {
    try {
      this.authService.postData('/process_urls_for_extraction', payload).subscribe(proRes => {
        this.dialogRef.close()
        this.extractedData = proRes?.results[0]?.spend_request[0]
        this.showSowForm = true // after extracting data
        this.pushToBigQuery({ ...proRes, extraction_results: proRes?.results })
        window.setTimeout(() => {
          this.sowClick.emit({data:this.sowForm?.sowForm?.value,type:'extract'});
        }, 500);
      })
    } catch (error) {
      console.error('error', error)
    }
  }
  pushToBigQuery(data: any) {
    delete data.total_processing_time
    delete data.results
    let payload = data;
    this.authService.postData('/ingest_to_bigquery', payload).subscribe((res) => {
      console.log('Res', res);

    })
  }
  getSowFormData(event: any) {
    this.data = event //form data from sow
  }
  openLoader(): void {
    this.dialogRef = this.dialog.open(LoaderModalComponent, {
      disableClose: true,
      data: { page: 'sow' },
    });
  }
  onFormChange(data: any) {
    this.notifycreateSpendRequest(data);
  }
  notifycreateSpendRequest(data: any) {
    this.sowFormDataChange.emit(data);
  }
}

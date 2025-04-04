import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
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
  isActive: boolean = true
  data: any = {}
  public user = localStorage.getItem('user')
  public userData = JSON.parse(this.user ? this.user : '');
  public accessType :any = 'writer'
  selectedFiles: any[] = [];
  oauthToken: string = this.userData?.token?.client_id;
  showSowForm: boolean = false;
  extractedData:any={}
  userName: string = 'John Doe';
  firstLetter: string = this.userData?.email.charAt(0).toUpperCase();
  dialogRef: any;
  constructor(public authService: AuthService, private googleDriveService: GoogleDriveService, public commonService:CommonService,private dialog: MatDialog) {

  }
  ngOnInit() {
    // this.commonService.resetTabs()
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

  clickNext(type:any) {
    if(type === 'extract'){
      this.shareAccess()
    }else{
      this.sowForm.onSubmit();
      if(this.sowForm.isFormValid && this.extractedData){
        this.sowClick.emit(this.extractedData);
      }
    }
  }
  shareAccess(){
    try {
      let id = this.selectedFiles[0].id
      const payload ={
        "doc_links": [`https://docs.google.com/document/d/${id}/`],
        "roles": [this.accessType]
        // "roles": ["writer"]
      }
      this.authService.postData('http://localhost:8000/share',payload).subscribe(res=>{
        let processPayload = {
          urls:[res.shared_links[0].shared_link]
        }
        this.extractData(processPayload)
      })
    } catch (error) {
      console.error('error',error)
    }
  }

  extractData(payload:any){
    try {
      this.openLoader()
      this.authService.postData('http://localhost:8000/process_urls_for_extraction',payload).subscribe(proRes=>{
       this.dialogRef.close()
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',proRes);
        this.extractedData = proRes
        this.showSowForm = true // after extracting data
      })
    } catch (error) {
      console.error('error',error)
    }
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
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { GoogleDriveService } from '../../../services/googleDrive/google-drive.service';
import { SowFormComponent } from "../sow-form/sow-form.component";
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-sow',
  imports: [CommonModule, SowFormComponent],
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

  selectedFiles: any[] = [];
  oauthToken: string = this.userData?.token?.client_id;
  showSowForm: boolean = false;
  constructor(public authService: AuthService, private googleDriveService: GoogleDriveService, public commonService:CommonService) {

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
      this.showSowForm = true
    }else{
      this.sowForm.onSubmit();
      if(this.sowForm.isFormValid){
        this.sowClick.emit(this.data);
      }
    }
  }
  getSowFormData(event: any) {
    this.data = event //form data from sow
  }
}

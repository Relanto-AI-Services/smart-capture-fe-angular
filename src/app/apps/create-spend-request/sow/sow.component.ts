import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
declare var gapi: any;
declare var google: any;
@Component({
  selector: 'app-sow',
  imports: [CommonModule],
  templateUrl: './sow.component.html',
  styleUrl: './sow.component.scss'
})
export class SowComponent {
  @Output() sowClick = new EventEmitter<any>();
  isActive:boolean=true
  data:any={}

  clickNext() {
    this.sowClick.emit(this.data);
    console.log('SOW...');
  }

  selectedFiles: any[] = [];
  developerKey = 'AIzaSyBrrnYEOOoSWQhsnlBMRZFVQ4u5R3H4tGQ';
  clientId = '594715748674-qiv013juoo6tvf7s49odabv8sdc2g331.apps.googleusercontent.com';
  scope = ['https://www.googleapis.com/auth/drive.file'];
  pickerApiLoaded = false;
  oauthToken: string | null = null;

  ngOnInit() {
    // this.loadGoogleAPIs();
  }

  loadGoogleAPIs() {
    gapi.load('auth', { callback: this.onAuthApiLoad.bind(this) });
    gapi.load('picker', { callback: this.onPickerApiLoad.bind(this) });
  }

  onAuthApiLoad() {
    gapi.auth.authorize(
      {
        client_id: this.clientId,
        scope: this.scope,
        immediate: false
      },
      (authResult: any) => {
        if (authResult && !authResult.error) {
          this.oauthToken = authResult.access_token;
        }
      }
    );
  }

  onPickerApiLoad() {
    this.pickerApiLoaded = true;
  }

  openGoogleDrivePicker() {
    if (!this.pickerApiLoaded || !this.oauthToken) {
      alert('Google Drive API is not ready yet.');
      return;
    }

    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS)
      .setOAuthToken(this.oauthToken)
      .setDeveloperKey(this.developerKey)
      .setCallback(this.pickerCallback.bind(this))
      .build();
    picker.setVisible(true);
  }

  pickerCallback(data: any) {
    if (data.action === google.picker.Action.PICKED) {
      const file = data.docs[0];
      this.selectedFiles.push({ name: file.name, progress: 100 });
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

}


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderModalComponent } from '../../shared/loader-modal/loader-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  dialogRef: any;

  constructor(private router: Router, public authService: AuthService,private dialog: MatDialog) { }

  ngOnInit() {
    // this.authService.userSession.subscribe({
    //   next: (response) => {
    //     console.log('API Response:', response);
    //   },
    //   error: (error) => {
    //     console.error('API Error:', error);
    //   },
    //   complete: () => {
    //     console.log('API Request Completed');
    //   }
    // });
  }

  loginWithGoogle() {
    this.openLoader();
    this.authService.logeInUser('/login').subscribe((res) => {
      this.dialogRef.close()
      this.router.navigate(['/spendRequest/createSpendRequest']);
    })
  }

  openLoader(): void {
      this.dialogRef = this.dialog.open(LoaderModalComponent, {
        disableClose: true,
        data: { page: 'login' },
      });
    }
}

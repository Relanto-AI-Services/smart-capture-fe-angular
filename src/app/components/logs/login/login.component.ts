
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) { }

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
    this.authService.logeInUser('http://localhost:8000/login').subscribe((res) => {
      console.log(res);
      this.router.navigate(['/spendRequest/createSpendRequest']);
    })
  }


  routeToCreatre() {
    this.router.navigate(['/spendRequest/createSpendRequest']);
  }
}

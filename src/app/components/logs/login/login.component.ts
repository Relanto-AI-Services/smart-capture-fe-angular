// import { Component, inject, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../services/auth/auth.service';
// declare global {
//   interface Window {
//     google: any;
//   }
// }@Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
//   imports:[]
// })
// export class LoginComponent implements OnInit {
   
//   private clientId = 'YOUR_GOOGLE_CLIENT_ID';
//   private authService = inject(AuthService);
//   constructor(private http: HttpClient, private router: Router,public authServoice:AuthService) {}

//   ngOnInit() {
//     // console.log('asasasas',this.authServoice.userLog)
//     this.loadGoogleAuth();
//   }

//   loadGoogleAuth() {
//     (window as any).gapi.load('auth2', () => {
//       (window as any).gapi.auth2.init({
//         client_id: this.clientId,
//       });
//     });
//   }
//   // loadGoogleAuth() {
//   //   if (typeof window !== 'undefined') { 
//   //     window.google?.accounts?.id.initialize({
//   //       client_id: 'YOUR_GOOGLE_CLIENT_ID',
//   //       callback: this.handleCredentialResponse.bind(this),
//   //     });
//   //     window.google?.accounts?.id.renderButton(
//   //       document.getElementById('googleSignInDiv'),
//   //       { theme: 'outline', size: 'large' }
//   //     );
//   //   }
//   // }
//   handleCredentialResponse(response: any) {
//     console.log('Google Credential Response:', response);
    
//     // Send the token to your backend API for verification
//     this.authService.verifyGoogleToken(response.credential).subscribe(
//       (res) => {
//         console.log('Login Success:', res);
//         // Handle successful login (e.g., store token, redirect)
//       },
//       (error) => {
//         console.error('Login Error:', error);
//       }
//     );
//   }
  
//   async loginWithGoogle() {
//     const auth2 = (window as any).gapi.auth2.getAuthInstance();
//     try {
//       const googleUser = await auth2.signIn();
//       const idToken = googleUser.getAuthResponse().id_token;

//       // Send token to backend API
//       // this.http
//       //   .post('https://your-backend-api.com/auth/google', { token: idToken })
//       //   .subscribe(
//       //     (response: any) => {
//       //       localStorage.setItem('authToken', response.authToken);
//       //       this.router.navigate(['/dashboard']);
//       //     },
//       //     (error) => {
//       //       console.error('Login failed', error);
//       //     }
//       //   );
//     } catch (error) {
//       console.error('Google login error:', error);
//     }
//   }

//   routeToCreatre(){
//     this.router.navigate(['/spendRequest/createSpendRequest']);
//   }
// }
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private clientId = 'YOUR_GOOGLE_CLIENT_ID';
  private authService = inject(AuthService);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadGoogleAuth();
  }

  loadGoogleAuth() {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: this.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false, // Disable automatic login, allow account selection
        });
      };
    }
  }

  handleCredentialResponse(response: any) {
    console.log('Google Credential Response:', response);

    // Send token to backend API
    this.authService.verifyGoogleToken(response.credential).subscribe({
      next: (res) => {
        console.log('Login Success:', res);
        localStorage.setItem('authToken', res.authToken);
        this.router.navigate(['/spendRequest/createSpendRequest']);
      },
      error: (error) => {
        console.error('Login Error:', error);
      }
    });
    
  }

  loginWithGoogle() {
    if (window.google?.accounts) {
      window.google.accounts.id.prompt(); // Opens Google account selection popup
    }
  }


    routeToCreatre(){
    this.router.navigate(['/spendRequest/createSpendRequest']);
  }
}

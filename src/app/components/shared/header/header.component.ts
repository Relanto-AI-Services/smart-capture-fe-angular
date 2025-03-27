import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
constructor(public authService:AuthService,public router:Router){}
logout(){
  try {
    this.authService.getData('http://localhost:8000/logout').subscribe((res:any)=>{
      this.router.navigate(['login'])
      localStorage.clear()
      console.log(res);
    })
  } catch (error) {
    console.error('error',error)
  }
}
}

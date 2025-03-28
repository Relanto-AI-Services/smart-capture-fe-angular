import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common/common.service';
@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
constructor(public authService:AuthService,public router:Router, private cs: CommonService){}
logout(){
  try {
    this.authService.getData('/logout').subscribe((res:any)=>{
      this.router.navigate(['login'])
      this.authService.userSession.next('')
      localStorage.clear()
      console.log(res);
    })
  } catch (error) {
    console.error('error',error)
  }
}

  updateValue() {
    this.cs.setValue(); // Set the value to true
  }


}

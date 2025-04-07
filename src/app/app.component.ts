import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { CommonService } from './services/common/common.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Smart-Capture';
  public userSession :boolean = false
  constructor(public authService:AuthService,private activatedRoute: ActivatedRoute, private router: Router){
    // if(localStorage.getItem('sid')){
    //   this.userSession = true
    // }else{
    //   this.userSession = false
    // }
  }
  ngOnInit() {
    
    this.authService.userLog.subscribe((res:any)=>{
      if(res){
        this.userSession = true
      }else{
        this.userSession = false
      }
      console.log('login log res',res)
    })
    // if(localStorage.getItem('sid')){
    //   this.userSession = true
    // }else{
    //   this.userSession = false
    // }
  }
  // ngOnChange(){
  //   console.log('change, change, change, change, change')
  // }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Smart-Capture';
  public userSession :boolean = false
  ngOnInit() {
    if(localStorage.getItem('sid')){
      this.userSession = true
    }else{
      this.userSession = false
    }
  }
  constructor(){
    if(localStorage.getItem('sid')){
      this.userSession = true
    }else{
      this.userSession = false
    }
  }
  // ngOnChange(){
  //   console.log('change, change, change, change, change')
  // }
}

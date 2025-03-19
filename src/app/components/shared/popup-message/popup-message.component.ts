import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-message',
  imports: [],
  templateUrl: './popup-message.component.html',
  styleUrl: './popup-message.component.scss'
})
export class PopupMessageComponent {
  // closePopup(){
  //   this.isOpen = false
  // }
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() isOpen: boolean = false;
  @Output() closePopup = new EventEmitter<void>();
}

import { Component } from '@angular/core';
import { PopupMessageComponent } from "../../../components/shared/popup-message/popup-message.component";
import { TabComponent } from "../tab/tab.component";
import { TacticTableComponent } from "../tactic-table/tactic-table.component";
import { RequestTypeComponent } from "../request-type/request-type.component";
import { SowComponent } from "../sow/sow.component";
import { RiskAssessmentComponent } from "../risk-assessment/risk-assessment.component";
import { SubmitSpendRequestComponent } from "../submit-spend-request/submit-spend-request.component";
import { FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../services/common/common.service';
interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  options?: string[];
}
@Component({
  selector: 'app-create-spend-request',
  imports: [PopupMessageComponent, TabComponent, TacticTableComponent, RequestTypeComponent, SowComponent, RiskAssessmentComponent, SubmitSpendRequestComponent,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './create-spend-request.component.html',
  styleUrl: './create-spend-request.component.scss',
  standalone: true,
})
export class CreateSpendRequestComponent {
  public isPopupOpen: boolean = false
  public activeTab:any= 'tactic'
  public activePage = 'Request Type'
  constructor(public commonService:CommonService) { }

  tabClick(event: any) {
    this.activeTab = event
    console.log(event);
    this.commonService.setActiveTab(event);
  }
  requestType(event: any) {
    this.activePage = 'Tactics'
    // this.activeTab = 'tactic'
    // this.commonService.setActiveTab('tactic');
    this.tabClick('tactic')
    // console.log('event from Request type',event);
  }
  onTacticSelection(event:any){
    this.activePage = 'SOW'
    // this.commonService.setActiveTab('sow');
    this.tabClick('sow')
    // console.log('event from tactic',event);
  }
  onSowSelection(event:any){
    this.activePage = 'Risk Assessment'
    // this.commonService.setActiveTab('riskAssessment');
    this.tabClick('riskAssessment')
    // console.log('event from SOW',event);
  }
  onRiskAssessmentSelection(event:any){
    this.activePage = 'Review And Submit'
    this.tabClick('reviewAndSubmit')
    // this.commonService.setActiveTab('reviewAndSubmit');
    // console.log('event from onRiskAssessmentSelection',event);
  }
  onFinalSubmitionClick(event:any){
    this.activePage = 'Review And Submit'
    this.tabClick('reviewAndSubmit')
    // console.log('event from final sumbmition',event);
  }


  // ####################################


messages: ChatMessage[] = [
    {
        text: "Need help with your SOW?",
        sender: 'ai',
        options: ["Need help with your SOW?", "Need a quick review?", "Should I assist with anything else?"]
    },
    {
        text: "**I've pre-filled 11 of 14 questions in blue.**<br> Please review, edit if needed, and continue.",
        sender: 'ai'
    },
    {
        text: "Help me update the work start date 04/01/2025 and end date 03/01/2026",
        sender: 'user'
    },
    {
        text: "Got it! I’ve updated the dates. Let me know if you need any further changes!",
        sender: 'ai'
    },
    {
        text: "You submitted a spend request for Creative Solutions 4 months ago.<br>**Want to reuse those answers to speed up?**",
        sender: 'ai',
        options: ["Yes", "No"]
    },
    {
        text: "**Almost there! Everything looks good?**<br> Please validate and ‘Submit’ when you’re ready!",
        sender: 'ai',
        options: ["Need help before submitting?"]
    }
];

newMessage: string = '';
chatVisible: boolean = false;

toggleChat() {
    this.chatVisible = !this.chatVisible;
}

sendMessage() {
    if (this.newMessage.trim()) {
        this.messages.push({ text: this.newMessage, sender: 'user' });
        this.newMessage = '';

        setTimeout(() => {
            this.messages.push({ text: "I'm processing your request...", sender: 'ai' });
        }, 1000);
    }
}

selectOption(option: string) {
    this.messages.push({ text: option, sender: 'user' });
}

extractChatJSON() {
    console.log(JSON.stringify(this.messages, null, 2));
}

}

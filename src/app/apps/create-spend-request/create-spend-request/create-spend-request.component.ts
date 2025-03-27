import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabComponent } from '../tab/tab.component';
import { TacticTableComponent } from '../tactic-table/tactic-table.component';
import { RequestTypeComponent } from '../request-type/request-type.component';
import { SowComponent } from '../sow/sow.component';
import { RiskAssessmentComponent } from '../risk-assessment/risk-assessment.component';
import { SubmitSpendRequestComponent } from '../submit-spend-request/submit-spend-request.component';
import { CommonService } from '../../../services/common/common.service';
import { AuthService } from '../../../services/auth/auth.service';
import { AllocatedBudgetComponent } from "../allocated-budget/allocated-budget.component";

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  options?: string[];
}
@Component({
  selector: 'app-create-spend-request',
  standalone: true,
  imports: [
    CommonModule,
    TabComponent,
    TacticTableComponent,
    RequestTypeComponent,
    SowComponent,
    RiskAssessmentComponent,
    SubmitSpendRequestComponent,
    FormsModule,
    ReactiveFormsModule
    // importProvidersFrom(FormsModule, ReactiveFormsModule)
    ,
    AllocatedBudgetComponent
],
  templateUrl: './create-spend-request.component.html',
  styleUrl: './create-spend-request.component.scss',
})
export class CreateSpendRequestComponent {
  public activeTab:any= 'tactic'
  public activePage = 'Request Type'
  constructor(public commonService:CommonService, public authService:AuthService) { }
  ngOnInit() {
   }

  tabClick(event: any) {
    this.activeTab = event
    console.log(event);
    this.commonService.setActiveTab(event);
  }
  requestType(event: any) {
    this.activePage = 'Tactics'
    this.tabClick('tactic')
  }
  onTacticSelection(event:any){
    this.activePage = 'SOW'
    this.tabClick('sow')
  }
  onSowSelection(event:any){
    this.activePage = 'Allocated Budget';    
    this.tabClick('allocatedBudget')
  }
  onAllocatedBidgetSelection(event:any){
    this.activePage = 'Risk Assessment';    
    this.tabClick('riskAssessment')
  }
  onRiskAssessmentSelection(event:any){
    this.activePage = 'Review And Submit'
    this.tabClick('reviewAndSubmit')
  }
  onFinalSubmitionClick(event:any){
    this.activePage = 'Review And Submit'
    this.tabClick('reviewAndSubmit')
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



//////////////////////////////////////////////////////// Chat functionality
newMessage: string = '';
chatVisible: boolean = true;

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

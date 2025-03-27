import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-request-type',
  imports: [CommonModule],
  templateUrl: './request-type.component.html',
  styleUrl: './request-type.component.scss'
})
export class RequestTypeComponent {
  @Output() cardClick = new EventEmitter<any>();
  public requests = [
    { icon: '../../../../assets/images/default-icon.png', title: 'Default', description: 'I need a signed contract and/or PO to be shared with my selected supplier to run my marketing program or to onboard my vendor.' },
    { icon: '../../../../assets/images/media-icon.png', title: 'Media', description: 'I am running paid media, have already requested a new campaign in Marketing Garage. I have the required MRFID for next steps in order to run my campaign.' },
    { icon: '../../../../assets/images/gcard-icon.png', title: 'GCard', description: 'I used my gGCard (<= $5,000) to pay for a marketing expense that should be reflected against my program budget.' },
    { icon: '../../../../assets/images/housead-icon.png', title: 'House Ads', description: 'I used Google Search Ads, YouTube Ads, GDN, Play, or any ads on any other Google O&O inventory to promote Cloud Marketing products.' },
    { icon: '../../../../assets/images/internal-change-icon.png', title: 'Internal Change', description: 'I am working with an internal service team that is directly charging my cost center.' },
    { icon: '../../../../assets/images/partner-payment-icon.png', title: 'Partner Payment', description: 'I have to pay via PO for a partner since the area is not supported by Google Payments Center (which releases payments for all Google incentives).' }
  ];
  public isActive: any = '';
  public data: any = {}
  onCardClick(event: any, title: any) {
    this.data = { event: event, page: 'Request Type' }
    this.isActive = title
    this.clickNext()
  }
  clickNext() {
    if(this.isActive === 'Default'){
      this.cardClick.emit(this.data);
    }else{
      return
      window.open('https://www.figma.com/proto/pCrVhQL8S6bS8at3DFlkLm/Himmat----Google?page-id=3%3A6&node-id=3377-77469&viewport=-14204%2C-46155%2C0.43&t=5utaSyAWIXstXnD3-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=3286%3A25500&show-proto-sidebar=1&hide-ui=1', '_blank');
    }
  }
}

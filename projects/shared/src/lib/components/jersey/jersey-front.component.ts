import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-jersey-front',
  template: ` <img class="logo" src="/assets/logos/{{ logo }}" /> `,
  styleUrls: ['./jersey.component.scss'],
})
export class JerseyFrontComponent {
  @Input() logo: string = '';
  @Input() color: string = '';

  @HostBinding('class') get classes() {
    return `${this.color}`;
  }
}

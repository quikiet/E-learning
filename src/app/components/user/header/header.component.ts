import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { Divider } from 'primeng/divider';
@Component({
  selector: 'app-header',
  imports: [BadgeModule, RouterLink, Divider],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}

import { Component } from '@angular/core';
import { HeaderComponent } from "../../../components/user/header/header.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../../components/user/footer/footer.component";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}

import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar'; import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms'; import { Select } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { Skeleton } from 'primeng/skeleton';
import { FormElementComponent } from "../form-element/form-element.component";
import { PasswordModule } from 'primeng/password';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-profile-info',
  imports: [PasswordModule, RippleModule, Select, AvatarModule, ButtonModule, InputTextModule, FormsModule, DividerModule, Skeleton, FormElementComponent],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent implements OnInit {
  cities: City[] | undefined;

  selectedCity: City | undefined;

  ngOnInit() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
  }
}


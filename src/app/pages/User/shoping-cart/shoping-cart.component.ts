import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag'; import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-shoping-cart',
  imports: [DividerModule, ButtonModule, CardModule, Tag, CommonModule, FormsModule],
  templateUrl: './shoping-cart.component.html',
  styleUrl: './shoping-cart.component.css'
})
export class ShoppingCartComponent {
  lists: any[] = [
    { 'value': 1, },
    { 'value': 2, },
    { 'value': 3, },
    { 'value': 4, },
  ];
}
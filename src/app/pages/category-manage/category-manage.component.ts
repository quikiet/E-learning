import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';
import { PopoverModule } from 'primeng/popover';
@Component({
  selector: 'app-category-manage',
  imports: [ToolbarModule, Button, Divider, CommonModule, PopoverModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.css'
})
export class CategoryManageComponent {

}

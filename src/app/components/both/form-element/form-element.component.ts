import { Component, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form-element',
  imports: [InputTextModule, FormsModule, CommonModule],
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.css'
})
export class FormElementComponent {
  @Input() validation: any;
  @Input() label: string = '';
  @Input() control!: AbstractControl;
}

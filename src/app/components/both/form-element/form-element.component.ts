import { Component, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-element',
  imports: [InputTextModule, FormsModule],
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.css'
})
export class FormElementComponent {
  @Input() validation: any;
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() control!: AbstractControl;
}

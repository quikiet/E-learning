import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [ConfirmDialog, ToastModule, ButtonModule, CommonModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  @Input() visible: boolean = false;
  @Input() header: string = 'Delete Confirmation';
  @Input() message: string = 'Are you sure you want to delete this item? This action cannot be undone.';
  @Input() icon: string = 'pi pi-trash';
  @Input() acceptLabel: string = 'Delete';
  @Input() rejectLabel: string = 'Cancel';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  show() {
    this.confirmationService.confirm({
      header: this.header,
      message: this.message,
      icon: this.icon,
      acceptLabel: this.acceptLabel,
      rejectLabel: this.rejectLabel,
      accept: () => {
        this.onConfirm.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Item deleted successfully',
          life: 3000
        });
      },
      reject: () => {
        this.onCancel.emit();
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Delete action cancelled',
          life: 3000
        });
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { InstructorsService } from '../../../services/instructors.service';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-instructor-revenue',
  imports: [CommonModule, FormsModule, ToastModule, TableModule, SelectModule],
  providers: [MessageService, InstructorsService],
  templateUrl: './instructor-revenue.component.html',
  styleUrl: './instructor-revenue.component.css'
})
export class InstructorRevenueComponent implements OnInit {
  instructor: any = null;
  courses: any[] = [];
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  months = [
    { name: 'All', value: null },
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];
  years = Array.from({ length: 10 }, (_, i) => ({
    name: (2025 - i).toString(),
    value: 2025 - i
  }));

  constructor(
    private instructorService: InstructorsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    this.instructorService.getInstructorDetail(this.selectedMonth, this.selectedYear).subscribe({
      next: (response) => {
        this.instructor = {
          instructor_id: response.instructor_id,
          name: response.name
        };
        this.courses = response.courses;
        // console.log('Instructor details loaded:', response);
      },
      error: (err) => {
        // console.error('Error loading instructor details:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to load instructor details.',
          life: 3000
        });
      }
    });
  }
}
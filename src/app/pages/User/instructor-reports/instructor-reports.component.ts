import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CoursesService } from '../../../services/courses.service';
import { MessageService } from 'primeng/api';
import { LoadingComponent } from '../../../components/both/loading/loading.component';
import { Router, RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  username: string;
  email: string;
  fullname: string;
  role: string;
  student: {
    id: number;
    learning_goals: string;
  };
}

interface Course {
  id: number;
  course_name: string;
  course_url: string;
  difficulty_level: string;
}

interface Report {
  id: number;
  user_id: number;
  course_id: number;
  reason: string;
  report_type: string;
  status: string;
  user: User;
  course: Course;
}

@Component({
  selector: 'app-instructor-reports',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    LoadingComponent,
    RouterLink,
    AvatarModule,
    TooltipModule,
    SelectModule,
    FormsModule
  ],
  providers: [CoursesService, MessageService],
  templateUrl: './instructor-reports.component.html',
  styleUrls: ['./instructor-reports.component.css']
})
export class InstructorReportsComponent implements OnInit {
  reports: Report[] = [];
  isLoading: boolean = true;
  @ViewChild('dt') dt: Table | undefined;
  report_types: any[] = [];


  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadReports();
    this.initializeReportTypes();

  }

  initializeReportTypes() {
    this.report_types = [
      { label: 'All', value: null },
      { label: 'Spam', value: 'spam' },
      { label: 'Technical issue', value: 'technical_issue' },
      { label: 'Inappropriate Content', value: 'inappropriate_content' },
      { label: 'Copyright violation', value: 'copyright_violation' },
      { label: 'Other', value: 'other' },
    ];
  }


  loadReports() {
    this.isLoading = true;
    this.coursesService.getInstructorReport().subscribe({
      next: (res) => {
        this.reports = res.reports;
        this.isLoading = false;
        console.log('Reports:', this.reports);
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to load reports.',
          life: 3000
        });
      }
    });
  }

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dt && input) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'pending':
        return 'warn';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'contrast';
    }
  }

  viewReportDetails(course_id: number) {
    // this.router.navigate(['/course-detail/:slug'])
  }
}
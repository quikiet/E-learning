import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AnalystService } from '../../../services/analyst.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-course-comment-stats',
  imports: [TableModule, MultiSelectModule, ToastModule, FormsModule],
  providers: [MessageService, DatePipe, AnalystService],
  templateUrl: './course-comment-stats.component.html',
  styleUrl: './course-comment-stats.component.css'
})
export class CourseCommentStatsComponent implements OnInit {
  courseId!: number;
  counts: any = {};
  comments: any = {};
  selectedTypes: string[] = ['content_quality', 'instructor', 'not_interested'];
  feedbackTypes = [
    { name: 'Content Quality', value: 'content_quality' },
    { name: 'Instructor', value: 'instructor' },
    { name: 'Not Interested', value: 'not_interested' }
  ];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private analystService: AnalystService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.loadStatistics();
  }

  loadStatistics() {
    this.isLoading = true;
    this.analystService.getCommentStatistics(this.courseId, this.selectedTypes).subscribe({
      next: (response: any) => {
        this.counts = response.data.counts;
        this.comments = response.data.comments;
        console.log('Comment statistics loaded:', response.data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading comment statistics:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to load comment statistics.',
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }
}
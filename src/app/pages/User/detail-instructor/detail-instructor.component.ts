import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InstructorsService } from '../../../services/instructors.service';


@Component({
  selector: 'app-detail-instructor',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-instructor.component.html',
  styleUrl: './detail-instructor.component.css'
})
export class DetailInstructorComponent implements OnInit {
  instructor: any = null;
  courses: any[] = [];
  showFullBio: boolean = false;
  totalStudents: number = 0;
  totalReviews: number = 0;

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorsService
  ) { }

  ngOnInit(): void {
    const instructorId = +this.route.snapshot.paramMap.get('id')!;
    this.instructorService.getInstructorInfo(instructorId).subscribe({
      next: (res) => {
        this.instructor = res.data.instructor;
        this.courses = res.data.courses;
        this.totalStudents = this.courses.reduce((sum: number, course: any) => sum + course.total_students, 0);
        this.totalReviews = this.courses.reduce((sum: number, course: any) => sum + course.total_reviews, 0);
        console.log('Instructor profile loaded:', res.data);
      },
      error: (err) => {
        console.error('Error loading instructor profile:', err);
      }
    });
  }

  toggleBio() {
    this.showFullBio = !this.showFullBio;
  }

  openYouTube() {
    window.open('https://www.youtube.com/', '_blank');
  }
}

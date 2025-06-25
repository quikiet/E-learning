import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../../services/courses.service';
import { Router, RouterLink } from '@angular/router';

interface Course {
  id: number;
  course_name: string;
  course_url: string;
  image: string;
  category: string;
  instructor_name: string;
}

@Component({
  selector: 'app-custom-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.css'],
})
export class CustomAutocompleteComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;
  query: string = '';
  showDropdown: boolean = false;

  constructor(private courseService: CoursesService,) { }

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: Course[]) => {
        this.courses = res;
        this.filteredCourses = res;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  filterCourses() {
    const queryLower = this.query.toLowerCase();
    this.filteredCourses = this.courses.filter((course) =>
      course.course_name.toLowerCase().startsWith(queryLower)
    );
    this.showDropdown = true;
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.query = course.course_name;
    this.showDropdown = false;
  }

  onBlur() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Delay để cho phép click item
  }
}
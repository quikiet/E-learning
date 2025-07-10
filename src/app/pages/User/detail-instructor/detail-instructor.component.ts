import { Component, OnInit } from '@angular/core';
import { InstructorsService } from '../../../services/instructors.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-instructor',
  imports: [],
  templateUrl: './detail-instructor.component.html',
  styleUrl: './detail-instructor.component.css'
})
export class DetailInstructorComponent implements OnInit {

  instructorId: number = 0;


  constructor(
    private instructorServices: InstructorsService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.instructorId = +this.route.snapshot.paramMap.get('id')!;

  }
}

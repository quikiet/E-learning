import { AfterViewInit, Component } from '@angular/core';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
@Component({
  selector: 'app-policy',
  imports: [],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css'
})
export class PolicyComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".head", {
      duration: 1,
      opacity: 0,
      y: -50,
    });
    gsap.from(".left-to-right", {
      delay: 0.75,
      duration: 1,
      opacity: 0,
      x: -50,
      stagger: 0.15,
    });
  }
}

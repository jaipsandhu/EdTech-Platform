import {
  Component,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

  reveal = false;

  @HostListener('window:scroll')
  onScroll() {

    const elements =
      document.querySelectorAll('.reveal');

    elements.forEach((element) => {

      const top =
        element.getBoundingClientRect().top;

      if (top < window.innerHeight * 0.85) {

        element.classList.add('revealed');

      }

    });

  }

}

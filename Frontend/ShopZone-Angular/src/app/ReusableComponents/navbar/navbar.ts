import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Products } from '../../PagesComponents/products/products';
import { DataService } from '../../data-service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  logoPath: any = 'assets/ShopZone Logo.png';

    isLoggedIn = false;
  constructor(private service: DataService, private router: Router) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.isLoggedIn = localStorage.getItem('isLoggedIn')==='true';
      }
    })
  }

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  logout() {
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('userId');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    localStorage.removeItem('cartId');

    this.router.navigateByUrl('/')
    .then(() => {
      window.location.reload();
    });
  }
}


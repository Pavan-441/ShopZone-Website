import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DataService } from './data-service';
import { ReactiveFormsModule } from '@angular/forms';
import { Navbar } from './ReusableComponents/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  records: any = []
  protected title = 'ShopZone-Angular';
 
  constructor(private service: DataService){
    this.service.getConnection().subscribe({next: data => {console.log(data)}} );
  }

   ngOnInit(): any {
      return this.service.getUsers().subscribe({next: data => {console.log(data), this.records=data as [];
      }})
  }
}

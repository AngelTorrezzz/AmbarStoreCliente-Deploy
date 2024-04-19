import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { Location } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.css']
})
export class Header2Component implements OnInit {

  ruta : any;

  constructor(private router: Router,private translate: TranslateService,private location: Location) {
  }

  ngOnInit(): void {
    $(document).ready(function () { $(".dropdown-trigger").dropdown(); });
    this.router = this.router;
  }

  modificarRuta(s: string){
    this.ruta = s;
    //console.log(this.ruta);
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  setIdioma(idioma:any) {
    localStorage.removeItem('idioma');
    if (idioma == 1){
      this.translate.use("en");
    }
    if (idioma == 2){
      this.translate.use("es");
    }
    localStorage.setItem('idioma', idioma.toString());

    this.reloadPage();
  }
  reloadPage() {
    const currentUrl = this.location.path();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
  });}
}

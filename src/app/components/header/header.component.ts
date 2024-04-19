import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import { TranslateService } from "@ngx-translate/core";
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  ruta : any;
  nombre_usuario: any;


  constructor(private router: Router, private carritoService: CarritoService,private translate: TranslateService,private location: Location) { }

  ngOnInit(): void {
    $(document).ready(function () { $(".dropdown-trigger").dropdown(); });
    this.nombre_usuario = localStorage.getItem('nombre_usuario');
    this.router = this.router;
  }

  modificarRuta(s: string){
    this.ruta = s;
    //console.log(this.ruta);
  }

  logout(){
    this.carritoService.eliminarCarrito(localStorage.getItem('id_carrito')).subscribe((res: any) => {
      console.log(res);
    });
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

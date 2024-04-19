import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { CarritoService } from 'src/app/services/carrito.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TiposProductoService } from 'src/app/services/tipos-producto.service';
import { Producto } from 'src/models/Producto';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
declare var $:any;

import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendedor-productos-secciones',
  templateUrl: './vendedor-productos-secciones.component.html',
  styleUrls: ['./vendedor-productos-secciones.component.css']
})
export class VendedorProductosSeccionesComponent implements OnInit {

  productos : Producto[] = [];
  producto : Producto = new Producto();

  id_tipo_producto : any;
  titulo : any;
  tituloEn : any;
  idProducto :any;
  cantidad: any;
  pageSize=10;
  p = 1;
  idioma: any;
  constructor(private productoService: ProductoService, private tiposProductosService: TiposProductoService, private carritoService: CarritoService, private translate: TranslateService, private router:Router, private location: Location) { }

  ngOnInit(): void {
    $(document).ready(function(){
      $('#modalAgregar').modal();
    });
    this.idioma = localStorage.getItem('idioma');
    this.id_tipo_producto = localStorage.getItem('id_tipo_producto');
    this.titulo = localStorage.getItem('tipo_producto');
    this.tituloEn = localStorage.getItem('tipo_producto_En2');

    this.productoService.listar_productos_tipo(this.id_tipo_producto).subscribe((resProductos: any) =>{
      resProductos.forEach((element: any) => {
        this.productoService.diferencia(localStorage.getItem('id_carrito'), element.id).subscribe((res: any) =>{
          element.cantidad = element.cantidad - res;
        },err => console.error(err));
      });
      this.productos = resProductos;
      //console.log(resProductos);
    },err => console.error(err));

  }

  ApartarProducto(producto: Producto){
    console.log(producto);
  }

  AnadirCarrito(){
    this.carritoService.agregarProducto(localStorage.getItem('id_carrito'), this.idProducto,this.producto.cantidad_producto).subscribe((res: any) =>{
      //console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado al carrito',
        showConfirmButton: false,
        timer: 1500
      });
    });
    $("#modalAgregar").modal("close");
    this.ngOnInit();
    this.reloadPage();
  }

  ComprarCantidad(id: any) {
    this.productoService.listOne(id).subscribe((res1: any) =>{
      //console.log(res);
      $("#modalAgregar").modal("open");
      this.idProducto = id
      this.productoService.diferencia(localStorage.getItem('id_carrito'), id).subscribe((res2: any) =>{
        this.cantidad = res1.cantidad - res2;
      });
    },err => console.error(err));
  }

  getCantidadOptions(): number[] {
    const opciones = [];
    for (let i = 1; i <= this.cantidad; i++) {
      opciones.push(i);
    }
    return opciones;
  }

  reloadPage() {
    const currentUrl = this.location.path();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
  });
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
  }
}

  
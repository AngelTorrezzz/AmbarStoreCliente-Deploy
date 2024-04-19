import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { ServicioCService } from 'src/app/services/servicio-c.service';
import { Producto } from 'src/models/Producto';
import { Oferta } from 'src/models/Oferta';
import { Descuento } from 'src/models/descuento';
import { DescuentoServiceService } from 'src/app/services/descuento-service.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  productos : Producto[] = [];
  producto : Producto = new Producto();
  ofertas: Oferta[] = [];
  oferta: Oferta = new Oferta();
  temp: Oferta = new Oferta();

  descuentos: Descuento[] = [];
  descuento: Descuento = new Descuento();
  pageSize = 3;
  p = 1;
  idioma: any;

  nuevoDescuento: Descuento = new Descuento();
  constructor(private productoService: ProductoService,private correoService:ServicioCService, private descuentoService:DescuentoServiceService, private translate: TranslateService) { 
    this.productoService.list().subscribe((resProductos: any) =>{
      this.productos = resProductos;
    },err => console.error(err));
    this.descuentoService.list().subscribe((res: any) =>{
      this.descuentos = res;
    },err => console.error(err));
  }

  eliminarDescuento(idP:any){
    this.verificarIdioma();
    Swal.fire({
      title: this.translate.instant('Esta seguro?'),
      text: this.translate.instant('Porfavor, verifique que no comprometa descuentos de productos.'),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant('Cancelar'),
      confirmButtonText: this.translate.instant('Confirmar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.descuentoService.eliminarDescuento(idP).subscribe((resProductos: any) =>{
          console.log(resProductos);
          Swal.fire({
            title: "¡Eliminado Exitoso!",
            text: "se elimino el descuento.",
            icon: "success"
          });
          this.descuentoService.list().subscribe((res: any) =>{
            this.descuentos = res;
          },err => console.error(err));
        },err => console.error(err));
      }else{
        
      }
    });
  }

  crearDescuento(){
    this.nuevoDescuento = new Descuento();
    $('#modalAgregarDescuento').modal();
    $('#modalAgregarDescuento').modal('open');
  }

  enviarDescuento(dato:any){
    this.verificarIdioma();
    this.descuentoService.crearDescuento(dato).subscribe((resProductos: any) =>{
      if (resProductos) {
        Swal.fire({
          title: this.translate.instant('¡Actualizacion Exitosa!'),
          text: this.translate.instant('Descuento añadido.'),
          icon: "success"
        });
        this.descuentoService.list().subscribe((res: any) =>{
          this.descuentos = res;
          //console.log(res);
        },err => console.error(err));
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: this.translate.instant('Algo sucedio :((.'),
        });
      }

    },err => console.error(err));

  }

  ngOnInit(): void {
    $(document).ready(function(){
      $('#modalAgregar').modal();
    });
    this.idioma = localStorage.getItem('idioma');

  }



  eliminarPromo(producto:any){
    //Debemos de eliminar la promo
    const resultado = this.ofertas.findIndex(animal => animal.producto == producto);
    if (resultado !== -1) {
      this.ofertas.splice(resultado, 1);
  }
    //console.log("Eliminando...");
  }
  addOferta(id:any){
    this.productoService.listOne(id).subscribe((resProductos: any) =>{
      this.producto = resProductos;
      this.productoService.precioDescuento(id).subscribe((res: any) =>{
        this.producto.precioDescuento = res;
        $('#modalAgregarOferta').modal();
        $('#modalAgregarOferta').modal('open');
      },err => console.error(err));  
    },err => console.error(err));
  }

  enviarOfertas(){
    this.verificarIdioma();
    //console.log(this.ofertas.length); Se debe de reducir el zoom para que se vea
    if (this.ofertas.length==6) {
      this.correoService.enviarPromo(this.ofertas).subscribe((resProductos: any) =>{
        Swal.fire({
          title: this.translate.instant('¡Actualizacion Exitosa!'),
          text: this.translate.instant('Promos enviadas.'),
          icon: "success"
        });
      },err => console.error(err));
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: this.translate.instant('Inserte solo 6 productos.'),
      });
    }
  }
  ConfirmarProducto(nombre:any){
    this.oferta = new Oferta();
    this.verificarIdioma();
    Swal.fire({
      title: this.translate.instant('¿Confirmar Producto?'),
      text: this.translate.instant('Porfavor, verifique que los datos sean correctos.'),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant('Cancelar'),
      confirmButtonText: this.translate.instant('Confirmar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.oferta.producto = this.producto.producto;
        this.oferta.precio = this.producto.precio;
        this.oferta.precioDescuento = this.producto.precioDescuento;
        this.oferta.producto_En = this.producto.producto_En;

        const resultado = this.ofertas.findIndex(animal => animal.producto == nombre);
        //console.log(producto);
        //console.log(resultado);
        if (resultado== -1) {
          this.ofertas.push(this.oferta);
          Swal.fire({
            title: this.translate.instant('¡Actualizacion Exitosa!'),
            text: this.translate.instant('Promo añadida.'),
            icon: "success"
          });
        }else{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: this.translate.instant('Dato repetido.'),
          });
        }
      }else{
        $('#modalAgregarOferta').modal('open');
      }
    });
  }

  verificarIdioma(){
    if(this.idioma == 1)
      this.translate.use("en");
    if(this.idioma == 2)
      this.translate.use("es");
  }
}

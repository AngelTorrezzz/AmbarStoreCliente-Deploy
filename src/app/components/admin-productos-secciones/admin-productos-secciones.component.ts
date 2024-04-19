import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../models/Producto';
import { ProductoService } from '../../services/producto.service';
import { TipoProductos } from '../../../models/TipoProducto';
import { TiposProductoService } from '../../services/tipos-producto.service';
import { TranslateService } from "@ngx-translate/core";
import Swal from 'sweetalert2';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { environment } from 'src/environments/environment';

declare var $:any;

@Component({
  selector: 'app-admin-productos-secciones',
  templateUrl: './admin-productos-secciones.component.html',
  styleUrls: ['./admin-productos-secciones.component.css']
})
export class AdminProductosSeccionesComponent implements OnInit {

  productos : Producto[] = [];
  producto : Producto = new Producto();

  id_tipo_producto : any;
  titulo : any;
  tituloEn : any;
  pageSize = 3;
  p = 1;
  idioma: any;
  liga = '';
  imgUsuario: any;
  fileToUpload: any;
  blob: any;
  constructor(private productoService: ProductoService, private tiposProductosService: TiposProductoService,private imagenesService: ImagenesService, private translate: TranslateService) {
    this.imgUsuario = null;
    this.fileToUpload = null;
    this.liga = environment.API_URI_IMAGENES;
   }

  ngOnInit(): void {
    $(document).ready(function(){
      $('.modal').modal();
    });
    
    this.idioma = localStorage.getItem('idioma');
    
    this.id_tipo_producto = localStorage.getItem('id_tipo_producto');
    this.titulo = localStorage.getItem('tipo_producto');
    this.tituloEn = localStorage.getItem('tipo_producto_En1');
    console.log(this.id_tipo_producto+"Localstorage de idioma: "+ this.idioma);
    this.productoService.listar_productos_tipo(this.id_tipo_producto).subscribe((resProductos: any) =>{
      this.productos = resProductos;
      console.log(resProductos);
    },err => console.error(err));

  }

  cargandoImagen(archivo: any) {
    if (archivo.files.length == 0) {
      this.imgUsuario = null;
      this.liga = environment.API_URI_IMAGENES;
      Swal.fire({
        title: "¡Error!",
        text: "No se ha seleccionado ninguna imagen.",
        icon: "error"
      });
    } else {
      this.imgUsuario = null;
      this.liga = environment.API_URI_IMAGENES;
      this.fileToUpload = archivo.files.item(0);
      let imgPromise = this.getFileBlob(this.fileToUpload);
      imgPromise.then(blob => {//Espera a que se cargue la img
        console.log("convirtiendo imagen");
        this.blob = blob;//Se convierte la imagen a blob
      });
    }


  }

  getFileBlob(file: any) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) { //Espera a que se cargue la img
      reader.onload = (function (thefile) {
        return function (e) {
          // console.log(e.target?.result)
          resolve(e.target?.result);
        };

      })(file);
      reader.readAsDataURL(file);
    });

  }

  mostrarImagen(productoooo:any){
    //console.log(productoooo)
    this.producto = productoooo;
    //console.log(this.producto);
    $('#Imagen').modal();
    $("#Imagen").modal("open");
  }

  guardarActualizarUsuario(ca: any) {
    if (this.fileToUpload != null) {
      this.imagenesService.guardarImagen(this.producto.id, "productos", this.blob).subscribe(
        (res: any) => {
          this.imgUsuario = this.blob;
          // Actualizar la variable 'liga' después de cargar la imagen
          this.liga = environment.API_URI_IMAGENES + "/productos/" + this.producto.id + ".jpg";
          //this.id_tipo_producto = localStorage.getItem('id_tipo_producto');
          /*this.productoService.listar_productos_tipo(this.id_tipo_producto).subscribe((resProductos: any) => {
            
            //console.log(resUsuarios);
            
            this.productos = resProductos;
            //this.rolesService.list().subscribe((resRoles: any) => {
            //  this.roles = resRoles;
            //  console.log("roles:", this.roles);
            //}, err => console.error(err));
          }, err => console.error(err));*/
        },
      err => console.error(err));

      this.producto = ca;
      this.producto.fotito = 1;
      //console.log(this.cajero);
      this.productoService.actualizar_producto(this.producto.id, this.producto.producto, this.producto.producto_En,this.producto.precio, this.producto.costo, this.producto.cantidad, this.producto.descripcion, this.producto.descripcion_En,this.producto.id_tipoDescuento,1).subscribe((res) => {
        $('#modalModificarUsuario').modal('close');
        this.productoService.listar_productos_tipo(this.id_tipo_producto).subscribe((resUsuarios: any) => {
          this.productos = resUsuarios;
        }, err => console.error(err));
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Foto de Perfil Actualizada',
        })
      }, err => console.error(err));
    this.reloadPage();
    }else{
      Swal.fire({
        title: "¡Error!",
        text: "No se ha seleccionado ninguna imagen.",
        icon: "error"
      });
    }
  }

  reloadPage() {
    window.location.reload();
  }

  CrearProducto(){
    this.producto = new Producto();
    $('#modalNuevoProducto').modal('open');
  }

  NuevoProducto(){
    this.verificarIdioma();
    Swal.fire({
      title: this.translate.instant('¿Confirmar Registro?'), 
      text: this.translate.instant('Porfavor, verifique que los datos ingresados sean correctos.'),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant('Cancelar'),
      confirmButtonText: this.translate.instant('Confirmar'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.crear_producto(this.producto.producto, this.producto.producto_En, this.producto.precio, this.producto.costo, this.producto.cantidad, this.producto.descripcion, this.producto.descripcion_En,this.id_tipo_producto, 0).subscribe((resProducto: any) =>{
          this.productos.push(resProducto);
          console.log(resProducto);
          $('#modalNuevoProducto').modal('close');
          this.productoService.listar_productos_tipo(this.id_tipo_producto).subscribe((resProductos: any) =>{
            this.productos = resProductos;
            //console.log(resProductos);
          },err => console.error(err));
        },
        err => console.error(err)
        );


        Swal.fire({
          title: this.translate.instant('¡Producto Registrado!'),
          text: this.translate.instant('Nuevo Producto Añadido.'),
          icon: "success"
        });
      }else{
        $('#modalNuevoProducto').modal('open');
      }
    });
  }

  EditarProducto(id: any){
    this.productoService.listOne(id).subscribe((resProducto: any) =>{
      this.producto = resProducto;
      console.log(this.productos);
      $('#modalEditarProducto').modal();
      $('#modalEditarProducto').modal('open');
    },err => console.error(err));
  }

  ConfirmarEdicionProducto(id: any, producto_resp: any){
    this.verificarIdioma();
    Swal.fire({
      title: this.translate.instant('¿Confirmar Actualización Del Producto? '),
      text: this.translate.instant('Porfavor, verifique que los datos actualizados sean correctos.'),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant('Cancelar'),
      confirmButtonText: this.translate.instant('Confirmar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.actualizar_producto(id, this.producto.producto, this.producto.producto_En,this.producto.precio, this.producto.costo, this.producto.cantidad, this.producto.descripcion, this.producto.descripcion_En,this.producto.id_tipoDescuento,this.producto.fotito).subscribe((resProducto: any) =>{
          //this.productos.push(resProducto);
          console.log(resProducto);
          $('#modalEditarProducto').modal('close');
          this.productoService.listar_productos_tipo(this.id_tipo_producto).subscribe((resProductos: any) =>{
            this.productos = resProductos;
            //console.log(resProductos);
          },err => console.error(err));
        },
        err => console.error(err)
        );


        Swal.fire({
          title: this.translate.instant('¡Actualizacion Exitosa!'),
          text: this.translate.instant('Producto Actualizado.'),
          icon: "success"
        });
      }else{
        $('#modalEditarProducto').modal('open');
      }
    });
  }

  EliminarProducto(id: any, producto_resp: any){
    Swal.fire({
      title: this.translate.instant('¿Eliminar Producto?'),
      text: this.translate.instant('¡No podrá revertir esto!'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: this.translate.instant('Cancelar'),
      confirmButtonText: this.translate.instant('Eliminar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminar_producto(id).subscribe((resProducto: any) =>{
          //this.productos.push(resProducto);
          console.log(resProducto);
          this.productoService.listar_productos_tipo(this.id_tipo_producto).subscribe((resProductos: any) =>{
            this.productos = resProductos;
            //console.log(resProductos);
          },err => console.error(err));
        },
        err => console.error(err)
        );
      }
    },err => console.error(err));
  }
  verificarIdioma(){
    if(this.idioma == 1)
      this.translate.use("en");
    if(this.idioma == 2)
      this.translate.use("es");
  }

}

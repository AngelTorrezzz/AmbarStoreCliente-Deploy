import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/Usuario';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { TranslateService } from "@ngx-translate/core";
declare var $: any;

@Component({
  selector: 'app-admin-cajeros',
  templateUrl: './admin-cajeros.component.html',
  styleUrls: ['./admin-cajeros.component.css'],
})
export class AdminCajerosComponent implements OnInit {

  cajeros: Usuario[] = [];
  cajero: Usuario = new Usuario();
  pageSize = 3;
  p = 1;
  idioma: any;

  liga = '';
  imgUsuario: any;
  fileToUpload: any;
  blob: any;

  constructor(private imagenesService: ImagenesService, private cajeroService: UsuarioService, private translate: TranslateService) {
    this.imgUsuario = null;
    this.fileToUpload = null;
    this.liga = environment.API_URI_IMAGENES;
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.modal').modal();
    });
    this.idioma = localStorage.getItem('idioma');
    this.cajeroService.list_cajeros().subscribe((resCajeros: any) => {
      this.cajeros = resCajeros;
      //console.log(this.cajeros);
    }, err => console.error(err));
    //console.log(environment.API_URI);
  }

  cargandoImagen(archivo: any) {
    if (archivo.files.length == 0) {
      this.imgUsuario = null;
      this.liga = environment.API_URI_IMAGENES;
      this.verificarIdioma();
      Swal.fire({
        title: this.translate.instant('¡Error!'),
        text: this.translate.instant('No se ha seleccionado ninguna imagen.'),
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

  mostrarImagen(cajeroo: any) {

    //console.log(cajeroo);
    this.cajero = cajeroo;
    $('#Imagen').modal();
    $("#Imagen").modal("open");
  }

  guardarActualizarUsuario(ca: any) {
    if (this.fileToUpload != null) {
      this.verificarIdioma();
      this.imagenesService.guardarImagen(this.cajero.id, "usuarios", this.blob).subscribe(
        (res: any) => {
          this.imgUsuario = this.blob;
          // Actualizar la variable 'liga' después de cargar la imagen
          this.liga = environment.API_URI_IMAGENES + "/usuarios/" + this.cajero.id + ".jpg";
          
          this.cajeroService.list_cajeros().subscribe((resUsuarios: any) => {
            
            //console.log(resUsuarios);
            
            this.cajeros = resUsuarios;
            //this.rolesService.list().subscribe((resRoles: any) => {
            //  this.roles = resRoles;
            //  console.log("roles:", this.roles);
            //}, err => console.error(err));
          }, err => console.error(err));
        },
      err => console.error(err));

      this.cajero = ca;
      this.cajero.fotito = 1;
      //console.log(this.cajero);
      this.cajeroService.actualizarUsuario(this.cajero).subscribe((res) => {
        $('#modalModificarUsuario').modal('close');
        this.cajeroService.list_cajeros().subscribe((resUsuarios: any) => {
          this.cajeros = resUsuarios;
        }, err => console.error(err));
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: this.translate.instant('Foto de Perfil Actualizada'),
        })
      }, err => console.error(err));
    this.reloadPage();
    }else{
      Swal.fire({
        title: this.translate.instant('¡Error!'),
        text: this.translate.instant('No se ha seleccionado ninguna imagen.'),
        icon: "error"
      });
    }
  }

  reloadPage() {
    window.location.reload();
  }

  CrearCajero() {
    this.cajero = new Usuario();
    $('#modalNuevoCajero').modal();
    $('#modalNuevoCajero').modal('open');
  }

  NuevoCajero() {
    let tamanio = this.cajeros.length;
    this.verificarIdioma();
    while (tamanio > 0) {
      tamanio--;
      if (this.cajeros[tamanio].nombre_usuario == this.cajero.nombre_usuario) {
        Swal.fire({
          title: this.translate.instant('¡Nombre De Usuario Existente!'),
          text: this.translate.instant('Porfavor, ingrese otro nombre de usuario.'),
          icon: "error"
        });
        return;
      }
      if (this.cajeros[tamanio].correo == this.cajero.correo) {
        Swal.fire({
          title: this.translate.instant('¡Correo Existente!'),
          text: this.translate.instant('Porfavor, ingrese otro correo.'),
          icon: "error"
        });
        return;
      }
    }
    Swal.fire({
      title: this.translate.instant('¿Confirmar Registro?'),
      text: this.translate.instant('Porfavor, verifique que los datos ingresados sean correctos.'),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cajeroService.crear_cajero(this.cajero.nombre_usuario, this.cajero.nombres, this.cajero.apellidos, this.cajero.correo, this.cajero.contrasena, this.cajero.telefono, this.cajero.direccion).subscribe((resCajero: any) => {
          //this.cajeros.push(resCajero);
          console.log(resCajero);
          $('#modalNuevoCajero').modal('close');
          this.cajeroService.list_cajeros().subscribe((resCajeros: any) => {
            this.cajeros = resCajeros;
            console.log(this.cajeros);
          }, err => console.error(err));
        },
          err => console.error(err)
        );


        Swal.fire({
          title: this.translate.instant('¡Cajero Registrado!'),
          text: this.translate.instant('Nuevo Cajero Añadido.'),
          icon: "success"
        });
      } else {
        $('#modalNuevoCajero').modal('open');
      }
    });
  }

  EditarCajero(id: any) {
    this.cajeroService.listOne(id).subscribe((resCajero: any) => {
      this.cajero = resCajero;
      console.log(this.cajeros);
      $('#modalEditarCajero').modal();
      $('#modalEditarCajero').modal('open');
    }, err => console.error(err));
  }

  ConfirmarEdicionCajero(id: any, nombre_usuario: any) {
    this.verificarIdioma();
    Swal.fire({
      title: this.translate.instant('¿Confirmar Actualización Del Cajero?'),
      text: this.translate.instant('Porfavor, verifique que los datos actualizados sean correctos.'),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant('Cancelar'),
      confirmButtonText: this.translate.instant('Confirmar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.cajeroService.actualizar_cajero(id, this.cajero.correo, this.cajero.telefono, this.cajero.direccion).subscribe((resCajero: any) => {
          //this.cajeros.push(resCajero);
          console.log(resCajero);
          $('#modalEditarCajero').modal('close');
          this.cajeroService.list_cajeros().subscribe((resCajeros: any) => {
            this.cajeros = resCajeros;
            console.log(this.cajeros);
          }, err => console.error(err));
        },
          err => console.error(err)
        );


        Swal.fire({
          title: this.translate.instant('¡Actualizacion Exitosa!'),
          text: this.translate.instant('Cajero Actualizado.'),
          icon: "success"
        });
      } else {
        $('#modalEditarCajero').modal('open');
      }
    });
  }

  HabilitarCajero(id: any, nombre_usuario: any) {
    this.verificarIdioma();
    Swal.fire({
      title: this.translate.instant('¿Desea Activar Al Cajero: ') + nombre_usuario + "?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant('Cancelar'),
      confirmButtonText: this.translate.instant('Confirmar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.cajeroService.habilitar_cajero(id).subscribe((resCajero: any) => {
          this.cajeros.push(resCajero);
          console.log(resCajero);
          this.cajeroService.list_cajeros().subscribe((resCajeros: any) => {
            this.cajeros = resCajeros;
            console.log(this.cajeros);
          }, err => console.error(err));
        },
          err => console.error(err)
        );


        Swal.fire({
          title: this.translate.instant('¡Activacion Exitosa!'),
          text: this.translate.instant('Cajero: ') + nombre_usuario + this.translate.instant(' Activado.'),
          icon: "success"
        });
      }
    });
  }

  DeshabilitarCajero(id: any, nombre_usuario: any) {
    this.verificarIdioma();
    Swal.fire({
      title: this.translate.instant('¿Desea Desactivar Al Cajero: ') + nombre_usuario + "?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant('Cancelar'),
      confirmButtonText: this.translate.instant('Confirmar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.cajeroService.deshabilitar_cajero(id).subscribe((resCajero: any) => {
          this.cajeros.push(resCajero);
          console.log(resCajero);
          this.cajeroService.list_cajeros().subscribe((resCajeros: any) => {
            this.cajeros = resCajeros;
            console.log(this.cajeros);
          }, err => console.error(err));
        },
          err => console.error(err)
        );


        Swal.fire({
          title: this.translate.instant('¡Desactivacion Exitosa!'),
          text: this.translate.instant('Cajero: ') + nombre_usuario + this.translate.instant(' Desactivado.'),
          icon: "success"
        });
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import { ServicioCService } from 'src/app/services/servicio-c.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CrearCarrito } from 'src/models/CrearCarrito';
import { Usuario } from 'src/models/Usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css']
})
export class Login2Component implements OnInit {

  usuario = new Usuario();
  crearCarritoModel = new CrearCarrito();

  constructor(private usuarioService: UsuarioService, private router: Router, private carritoService: CarritoService,
    private route: ActivatedRoute,private servicioCorreo: ServicioCService) { }

  ngOnInit(): void {
    localStorage.clear();

    this.route.paramMap.subscribe(params => {
      let token = params.get('token');
      //console.log(token);
      let idP = params.get('id');
      //console.log(idP);

      this.servicioCorreo.decodificarCorreo2(token).subscribe((resDeco: any) => {
        //console.log(resDeco);
        this.usuarioService.listOneMail(resDeco).subscribe((resU: any) => {
          //console.log(resU);
          if(resU.id_tipoUsuario == 1){
            localStorage.setItem('id_usuario', resU.id);
            localStorage.setItem('nombre_usuario', 'Administrador');
            this.router.navigateByUrl('/admin/productos');
          } else {
            localStorage.setItem('id_usuario', resU.id);
            localStorage.setItem('nombre_usuario', resU.nombre_usuario);
            this.carritoService.crearCarrito(this.crearCarritoModel.confirmado, this.crearCarritoModel.fecha, this.crearCarritoModel.hora, this.crearCarritoModel.monto_eventual_sin_descuento, this.crearCarritoModel.monto_eventual, this.crearCarritoModel.costo_eventual, this.crearCarritoModel.id_cliente, resU.id).subscribe((res2: any) => {
              //console.log(res2);
              localStorage.setItem('id_carrito', res2);
              this.carritoService.agregarProducto(localStorage.getItem('id_carrito'), idP,1).subscribe((res: any) =>{
                //console.log(res);
                this.router.navigateByUrl('/home/carrito');
                Swal.fire({
                  icon: 'success',
                  title: 'Producto agregado al carrito',
                  showConfirmButton: false,
                  timer: 1500
                });
              });
            });
            
          }
        });
    });
  });
}

}

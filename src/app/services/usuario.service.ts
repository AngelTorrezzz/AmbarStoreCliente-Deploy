import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  constructor(private http: HttpClient) { }

  list_cajeros(){
    return this.http.get(`${environment.API_URI}/usuarios/listar_cajeros`);
  }

  listOne(id: any){ 
    return this.http.get(`${environment.API_URI}/usuarios/${id}`);
  }

  listOneMail(token: any){ 
    return this.http.get(`${environment.API_URI}/usuarios/email/${token}`);
  }

  validar_usuario(nombre_usuario: any, contrasena: any){
    return this.http.post(`${environment.API_URI}/usuarios/validar_usuario`,{"nombre_usuario": nombre_usuario, "contrasena": contrasena});
  }

  crear_cliente(nombre_usuario: any, telefono: any, correo: any){
    return this.http.post(`${environment.API_URI}/usuarios/crear_cliente`,{"nombre_usuario": nombre_usuario, "telefono": telefono, "correo": correo});
  }

  crear_cajero(nombre_usuario: any, nombres: any, apellidos: any, correo: any, contrasena: any, telefono: any, direccion: any){
    return this.http.post(`${environment.API_URI}/usuarios/crear_cajero`,{"nombre_usuario": nombre_usuario,"nombres": nombres, "apellidos": apellidos, "correo": correo, "contrasena": contrasena, "telefono": telefono, "direccion": direccion});
  }

  actualizar_cajero(id: any, correo: any, telefono: any, direccion: any){
    return this.http.put(`${environment.API_URI}/usuarios/update_cajero/${id}`,{"correo": correo ,"telefono": telefono, "direccion": direccion});
  }

  actualizarUsuario(usuario: any) {
    return this.http.put(`${environment.API_URI}/usuarios/update_cajero/${usuario.id}`,usuario);
  }

  habilitar_cajero(id: any){
    return this.http.get(`${environment.API_URI}/usuarios/habilitar_cajero/${id}`);
  }

  deshabilitar_cajero(id: any){
    return this.http.get(`${environment.API_URI}/usuarios/deshabilitar_cajero/${id}`);
  }
}

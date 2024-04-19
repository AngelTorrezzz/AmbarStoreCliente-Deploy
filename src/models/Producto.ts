export class Producto {
    id: any;
    producto: any;
    producto_En: any;
    precio: any;
    costo: any;
    cantidad: any;
    descripcion: any;
    descripcion_En: any;
    imagen: string;
    id_tipoProducto: any;
    id_tipoDescuento: number;
    cantidad_producto: number;
    precioDescuento: any;
    fotito:any;

    constructor() {
        this.id = "";
        this.producto = "";
        this.producto_En = "";
        this.precio = "";
        this.costo = "";
        this.cantidad = "";
        this.descripcion = "";
        this.descripcion_En = "";
        this.imagen = "";
        this.id_tipoProducto = "";
        this.id_tipoDescuento = 0;
        this.cantidad_producto = 1;
        this.precioDescuento = 0;
        this.fotito = 0;
    }
}
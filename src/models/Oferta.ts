export class Oferta {
    producto: any;
    producto_En: any;   
    precio: any;
    precioDescuento: any;
    duracion: Date;

    constructor() {
        this.producto = "";
        this.precio = 0;
        this.precioDescuento = 0;
        this.duracion = new Date();
        this.producto_En = "";
    }
}
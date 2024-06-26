// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //API_URI: 'http://localhost:3000/api',
  //API_URI_CORREOS: "http://localhost:3001",
  //API_URI_IMAGENES: "http://localhost:3002"

  API_URI: 'https://ambar-index-vsrq.onrender.com/api',
  API_URI_CORREOS: "https://ambar-app.onrender.com",
  API_URI_IMAGENES: "https://ambar-imagen.onrender.com"

  //API_URI: 'http://3.141.51.166/api',
  //API_URI_CORREOS: "http://3.141.51.166:8080",
  //API_URI_IMAGENES: "http://3.141.51.166:8081"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

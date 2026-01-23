import('./footer.js')
import $ from 'jquery';
import { getls } from './widev.js';
import { rutas } from './rutas/ruta.js';

const pages = ['inicio','media','videos','audios','images','acerca'];
pages.forEach(pg => rutas.register(`/${pg}`, () => import(`./web/${pg}.js`))); // Publico general

rutas.register('/smile',() => getls('wiSmile')?import('./smile/smile.js'):import('./smile/descubre.js')); import('./header.js');//Con Auth

rutas.init(); // Rutas registrados y go excelente app. 

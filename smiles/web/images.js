import './images.css';
import jQuery from 'jquery';
import { Notificacion, abrirModal, cerrarModal, wicopy } from '../widev.js';

export const render = () => `
  <div class="image_container">
    <div class="image_layout">
      <!-- LEFT: Visor de Imagen -->
      <div class="image_left">
        <div class="image_zone" id="imageZone">
          <div class="image_placeholder">
            <i class="fas fa-images"></i>
            <h2>Arrastra tus imágenes aquí</h2>
            <p>o <strong>haz doble clic</strong> para seleccionar</p>
            <p class="upload_hint">Soporta: <kbd>JPG</kbd> <kbd>PNG</kbd> <kbd>GIF</kbd> <kbd>WebP</kbd> <kbd>SVG</kbd></p>
          </div>
          
          <div class="image_viewer dpn">
            <img id="mainImage" alt="Imagen principal">
            <div class="image_overlay">
              <button class="btn_zoom_in" title="Acercar"><i class="fas fa-search-plus"></i></button>
              <button class="btn_zoom_out" title="Alejar"><i class="fas fa-search-minus"></i></button>
            </div>
          </div>
        </div>

        <!-- Info y Controles -->
        <div class="image_info dpn">
          <div class="info_left">
            <span class="image_name">Sin imagen</span>
            <span class="image_dimensions">0 x 0</span>
          </div>
          <div class="info_controls">
            <button class="btn_control btn_prev" title="Anterior (←)"><i class="fas fa-chevron-left"></i></button>
            <button class="btn_control btn_download" title="Descargar"><i class="fas fa-download"></i></button>
            <button class="btn_control btn_slideshow" title="Slideshow"><i class="fas fa-play"></i></button>
            <button class="btn_control btn_fullscreen" title="Pantalla completa (F)"><i class="fas fa-expand"></i></button>
            <button class="btn_control btn_next" title="Siguiente (→)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Galería de miniaturas -->
      <div class="image_right">
        <div class="gallery_header">
          <h3><i class="fas fa-image"></i> Galería</h3>
          <div class="gallery_actions">
            <button class="btn_icon btn_add" title="Agregar imágenes"><i class="fas fa-plus"></i></button>
            <button class="btn_icon btn_clear_all" title="Limpiar todo"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        
        <div class="image_gallery" id="imageGallery">
          <div class="gallery_empty">
            <i class="fas fa-folder-open"></i>
            <p>No hay imágenes</p>
            <small>Arrastra o agrega imágenes</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Slideshow -->
  <div class="wiModal" id="slideshowModal">
    <div class="modalBody" style="max-width: 95vw; max-height: 95vh; padding: 0; background: var(--0);">
      <button class="modalX" onclick="window.cerrarModal('slideshowModal')"><i class="fas fa-times"></i></button>
      <div class="slideshow_container">
        <img id="slideshowImage" alt="Slideshow">
        <div class="slideshow_controls">
          <button class="btn_slide_prev"><i class="fas fa-chevron-left"></i></button>
          <button class="btn_slide_play"><i class="fas fa-pause"></i></button>
          <button class="btn_slide_next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="slideshow_counter">
          <span id="slideCounter">1 / 1</span>
        </div>
      </div>
    </div>
  </div>
`;

// ==================== VARIABLES GLOBALES ====================
const $ = jQuery;
let images = [];
let currentIndex = 0;
let zoomLevel = 1;
let slideshowInterval = null;
const FORMATOS_VALIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ZOOM_STEP = 0.2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const SLIDESHOW_DELAY = 180000;

// ==================== UTILIDADES ====================
const formatearTamaño = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const obtenerDimensiones = (img, callback) => {
  const tempImg = new Image();
  tempImg.onload = () => callback(tempImg.width, tempImg.height);
  tempImg.src = img.src;
};

// ==================== GALERÍA ====================
const actualizarGaleria = () => {
  const galeria = $('#imageGallery');
  
  if (images.length === 0) {
    galeria.html(`
      <div class="gallery_empty">
        <i class="fas fa-folder-open"></i>
        <p>No hay imágenes</p>
        <small>Arrastra o agrega imágenes</small>
      </div>
    `);
    return;
  }
  
  const html = images.map((img, index) => `
    <div class="gallery_item ${index === currentIndex ? 'active' : ''}" data-index="${index}">
      <img src="${img.url}" alt="${img.name}">
      <div class="item_overlay">
        <span class="item_name">${img.name}</span>
        <button class="btn_delete_mini" data-index="${index}" title="Eliminar">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  galeria.html(html);
};

// ==================== PROCESAR IMÁGENES ====================
const agregarImagenes = (archivos) => {
  const archivosArray = Array.from(archivos);
  let agregados = 0;
  
  archivosArray.forEach(archivo => {
    if (!FORMATOS_VALIDOS.includes(archivo.type)) {
      Notificacion(`${archivo.name} no es un formato válido`, 'error', 2000);
      return;
    }
    
    const url = URL.createObjectURL(archivo);
    images.push({ name: archivo.name, size: archivo.size, url, type: archivo.type });
    agregados++;
  });
  
  if (agregados > 0) {
    Notificacion(`${agregados} imagen${agregados > 1 ? 'es' : ''} agregada${agregados > 1 ? 's' : ''}`, 'success', 2000);
    actualizarGaleria();
    
    if (images.length === agregados) {
      mostrarImagen(0);
    }
  }
};

// ==================== VISOR ====================
const mostrarImagen = (index) => {
  if (index < 0 || index >= images.length) return;
  
  currentIndex = index;
  zoomLevel = 1;
  
  const imgData = images[index];
  const mainImg = $('#mainImage');
  
  $('.image_placeholder').addClass('dpn');
  $('.image_viewer').removeClass('dpn');
  $('.image_info').removeClass('dpn');
  $('#imageZone').addClass('viewing');
  
  mainImg[0].src = imgData.url;
  mainImg.css('transform', 'scale(1)');
  
  $('.image_name').text(imgData.name);
  
  obtenerDimensiones(mainImg[0], (w, h) => {
    $('.image_dimensions').text(`${w} x ${h} px · ${formatearTamaño(imgData.size)}`);
  });
  
  actualizarGaleria();
};

const aplicarZoom = (direccion) => {
  if (direccion === 'in' && zoomLevel < MAX_ZOOM) {
    zoomLevel += ZOOM_STEP;
  } else if (direccion === 'out' && zoomLevel > MIN_ZOOM) {
    zoomLevel -= ZOOM_STEP;
  }
  
  zoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel));
  $('#mainImage').css('transform', `scale(${zoomLevel})`);
};

const siguienteImagen = () => {
  if (currentIndex < images.length - 1) {
    mostrarImagen(currentIndex + 1);
  } else {
    mostrarImagen(0);
  }
};

const anteriorImagen = () => {
  if (currentIndex > 0) {
    mostrarImagen(currentIndex - 1);
  } else {
    mostrarImagen(images.length - 1);
  }
};

const descargarImagen = () => {
  if (images.length === 0) return;
  
  const img = images[currentIndex];
  const a = document.createElement('a');
  a.href = img.url;
  a.download = img.name;
  a.click();
  
  Notificacion('Imagen descargada', 'success', 1500);
};

const toggleFullscreen = () => {
  const viewer = $('.image_viewer')[0];
  
  if (!document.fullscreenElement) {
    viewer.requestFullscreen().catch(() => {
      Notificacion('Pantalla completa no disponible', 'error', 2000);
    });
  } else {
    document.exitFullscreen();
  }
};

// ==================== SLIDESHOW ====================
const iniciarSlideshow = () => {
  if (images.length === 0) return;
  
  abrirModal('slideshowModal');
  actualizarSlide();
  
  slideshowInterval = setInterval(() => {
    siguienteImagen();
    actualizarSlide();
  }, SLIDESHOW_DELAY);
  
  $('.btn_slide_play').html('<i class="fas fa-pause"></i>');
};

const detenerSlideshow = () => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    $('.btn_slide_play').html('<i class="fas fa-play"></i>');
  }
};

const toggleSlideshow = () => {
  if (slideshowInterval) {
    detenerSlideshow();
  } else {
    slideshowInterval = setInterval(() => {
      siguienteImagen();
      actualizarSlide();
    }, SLIDESHOW_DELAY);
    $('.btn_slide_play').html('<i class="fas fa-pause"></i>');
  }
};

const actualizarSlide = () => {
  if (images.length === 0) return;
  
  const img = images[currentIndex];
  $('#slideshowImage')[0].src = img.url;
  $('#slideCounter').text(`${currentIndex + 1} / ${images.length}`);
};

// ==================== EVENTOS DE CARGA ====================
const abrirSelector = () => {
  const entrada = $('<input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml" multiple style="display:none;">');
  
  entrada.on('change', function() {
    if (this.files.length > 0) {
      agregarImagenes(this.files);
    }
    entrada.remove();
  });
  
  $('body').append(entrada);
  entrada.click();
};

const manejarDragOver = (e) => {
  e.preventDefault();
  $('#imageZone').addClass('dragover');
};

const manejarDragLeave = () => {
  $('#imageZone').removeClass('dragover');
};

const manejarDrop = (e) => {
  e.preventDefault();
  $('#imageZone').removeClass('dragover');
  
  const archivos = e.originalEvent.dataTransfer?.files;
  if (archivos?.length) {
    agregarImagenes(archivos);
  }
};

// ==================== INICIALIZACIÓN ====================
export const init = () => {
  // Exponer cerrarModal globalmente para el modal
  window.cerrarModal = cerrarModal;
  
  // Eventos de zona de carga
  $('#imageZone')
    .on('dblclick', abrirSelector)
    .on('dragover', manejarDragOver)
    .on('dragleave', manejarDragLeave)
    .on('drop', manejarDrop);
  
  // Eventos de controles
  $('.btn_prev').on('click', anteriorImagen);
  $('.btn_next').on('click', siguienteImagen);
  $('.btn_zoom_in').on('click', () => aplicarZoom('in'));
  $('.btn_zoom_out').on('click', () => aplicarZoom('out'));
  $('.btn_download').on('click', descargarImagen);
  $('.btn_fullscreen').on('click', toggleFullscreen);
  $('.btn_slideshow').on('click', iniciarSlideshow);
  
  // Zoom con scroll
  $('#mainImage').on('wheel', (e) => {
    e.preventDefault();
    if (e.originalEvent.deltaY < 0) {
      aplicarZoom('in');
    } else {
      aplicarZoom('out');
    }
  });
  
  // Eventos de galería
  $(document).on('click', '.gallery_item', function() {
    const index = parseInt($(this).data('index'));
    mostrarImagen(index);
  });
  
  $(document).on('click', '.btn_delete_mini', function(e) {
    e.stopPropagation();
    const index = parseInt($(this).data('index'));
    
    URL.revokeObjectURL(images[index].url);
    images.splice(index, 1);
    
    if (index === currentIndex && images.length > 0) {
      currentIndex = Math.min(index, images.length - 1);
      mostrarImagen(currentIndex);
    } else if (images.length === 0) {
      $('.image_viewer').addClass('dpn');
      $('.image_placeholder').removeClass('dpn');
      $('.image_info').addClass('dpn');
      $('#imageZone').removeClass('viewing');
    } else if (index < currentIndex) {
      currentIndex--;
    }
    
    actualizarGaleria();
    Notificacion('Imagen eliminada', 'success', 1500);
  });
  
  // Botones de acciones
  $('.btn_add').on('click', abrirSelector);
  
  $('.btn_clear_all').on('click', () => {
    if (images.length === 0) return;
    
    images.forEach(img => URL.revokeObjectURL(img.url));
    images = [];
    currentIndex = 0;
    
    $('.image_viewer').addClass('dpn');
    $('.image_placeholder').removeClass('dpn');
    $('.image_info').addClass('dpn');
    $('#imageZone').removeClass('viewing');
    
    actualizarGaleria();
    Notificacion('Todas las imágenes eliminadas', 'success', 2000);
  });
  
  // Controles de slideshow
  $('.btn_slide_prev').on('click', () => {
    anteriorImagen();
    actualizarSlide();
  });
  
  $('.btn_slide_next').on('click', () => {
    siguienteImagen();
    actualizarSlide();
  });
  
  $('.btn_slide_play').on('click', toggleSlideshow);
  
  // Cerrar slideshow
  $('#slideshowModal').on('click', function(e) {
    if (e.target === this) {
      detenerSlideshow();
      cerrarModal('slideshowModal');
    }
  });
  
  // Teclas de acceso rápido
  $(document).on('keydown', (e) => {
    if (images.length === 0) return;
    
    switch(e.key) {
      case 'ArrowLeft':
        anteriorImagen();
        if ($('#slideshowModal').hasClass('active')) actualizarSlide();
        break;
      case 'ArrowRight':
        siguienteImagen();
        if ($('#slideshowModal').hasClass('active')) actualizarSlide();
        break;
      case '+':
      case '=':
        aplicarZoom('in');
        break;
      case '-':
        aplicarZoom('out');
        break;
      case 'f':
      case 'F':
        if (!$('#slideshowModal').hasClass('active')) {
          toggleFullscreen();
        }
        break;
      case 'Escape':
        if ($('#slideshowModal').hasClass('active')) {
          detenerSlideshow();
          cerrarModal('slideshowModal');
        }
        break;
    }
  });
  
  console.log('✅ Visor de imágenes cargado');
};

// ==================== LIMPIEZA ====================
export const cleanup = () => {
  $('#imageZone, .btn_prev, .btn_next, .btn_zoom_in, .btn_zoom_out, .btn_download, .btn_fullscreen, .btn_slideshow, .btn_add, .btn_clear_all, .btn_slide_prev, .btn_slide_next, .btn_slide_play, #slideshowModal, #mainImage').off();
  
  $(document).off('click', '.gallery_item');
  $(document).off('click', '.btn_delete_mini');
  $(document).off('keydown');
  
  detenerSlideshow();
  
  images.forEach(img => URL.revokeObjectURL(img.url));
  images = [];
  
  delete window.cerrarModal;
  
  console.log('🧹 Visor de imágenes limpiado');
};
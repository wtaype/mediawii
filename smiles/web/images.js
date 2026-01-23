import './images.css';
import $ from 'jquery';
import { Notificacion, abrirModal, cerrarModal } from '../widev.js';

export const render = () => `
  <div class="image_container">
    <div class="image_layout">
      <div class="image_left">
        <div class="image_zone" id="imageZone">
          <div class="image_placeholder">
            <i class="fas fa-images"></i>
            <h2>Arrastra tus imágenes aquí</h2>
            <p>o <strong>haz doble clic</strong> para seleccionar</p>
            <p class="upload_hint">
              <kbd>JPG</kbd> <kbd>PNG</kbd> <kbd>GIF</kbd> <kbd>WebP</kbd> <kbd>SVG</kbd>
            </p>
            <p class="paste_hint">
              <i class="fas fa-paste"></i> <kbd>Ctrl+V</kbd> para pegar capturas
            </p>
          </div>
          
          <div class="image_viewer dpn">
            <img id="mainImage" alt="Imagen">
            <div class="image_overlay">
              <button class="btn_zoom_in" title="Zoom +"><i class="fas fa-plus"></i></button>
              <button class="btn_zoom_out" title="Zoom -"><i class="fas fa-minus"></i></button>
              <button class="btn_zoom_reset" title="Reset"><i class="fas fa-compress"></i></button>
            </div>
          </div>
        </div>

        <div class="image_info dpn">
          <div class="info_left">
            <span class="image_name"></span>
            <span class="image_dimensions"></span>
          </div>
          <div class="info_controls">
            <button class="btn_control btn_prev" title="Anterior (←)"><i class="fas fa-chevron-left"></i></button>
            <button class="btn_control btn_download" title="Descargar"><i class="fas fa-download"></i></button>
            <button class="btn_control btn_slideshow" title="Slideshow"><i class="fas fa-play"></i></button>
            <button class="btn_control btn_fullscreen" title="Fullscreen (F)"><i class="fas fa-expand"></i></button>
            <button class="btn_control btn_next" title="Siguiente (→)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <div class="image_right">
        <div class="gallery_header">
          <h3><i class="fas fa-images"></i> Galería (<span id="imgCount">0</span>)</h3>
          <div class="gallery_actions">
            <button class="btn_icon btn_add" title="Agregar"><i class="fas fa-plus"></i></button>
            <button class="btn_icon btn_clear" title="Limpiar"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="image_gallery" id="imageGallery"></div>
      </div>
    </div>
  </div>

  <div class="wiModal" id="slideshowModal">
    <div class="modalBody" style="max-width:95vw;max-height:95vh;padding:0;background:var(--0)">
      <button class="modalX"><i class="fas fa-times"></i></button>
      <div class="slideshow_container">
        <img id="slideshowImage" alt="Slideshow">
        <div class="slideshow_controls">
          <button class="btn_slide_prev"><i class="fas fa-chevron-left"></i></button>
          <button class="btn_slide_play"><i class="fas fa-pause"></i></button>
          <button class="btn_slide_next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="slideshow_counter" id="slideCounter">1 / 1</div>
      </div>
    </div>
  </div>
`;

// Variables
let images = [];
let currentIndex = 0;
let zoomLevel = 1;
let slideshowInterval = null;
let pasteCount = 1;

const FORMATOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const SLIDESHOW_DELAY = 3000;

// Utilidades
const bytes = (b) => {
  if (!b) return '0 B';
  const k = 1024, s = ['B', 'KB', 'MB'], i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(1)} ${s[i]}`;
};

const getDim = (img, cb) => {
  const i = new Image();
  i.onload = () => cb(i.width, i.height);
  i.src = img.src;
};

// Galería
const updateGallery = () => {
  const g = $('#imageGallery');
  $('#imgCount').text(images.length);
  
  if (!images.length) {
    g.html('<div class="gallery_empty"><i class="fas fa-folder-open"></i><p>Sin imágenes</p></div>');
    return;
  }
  
  g.html(images.map((img, i) => `
    <div class="gallery_item ${i === currentIndex ? 'active' : ''}" data-i="${i}">
      <img src="${img.url}" alt="${img.name}">
      ${img.pasted ? '<span class="paste_badge"><i class="fas fa-paste"></i></span>' : ''}
      <button class="btn_del" data-i="${i}"><i class="fas fa-times"></i></button>
    </div>
  `).join(''));
};

// Agregar imágenes
const addImages = (files, pasted = false) => {
  let added = 0;
  Array.from(files).forEach(f => {
    if (!FORMATOS.includes(f.type)) return;
    images.push({ name: f.name, size: f.size, url: URL.createObjectURL(f), pasted });
    added++;
  });
  
  if (added) {
    Notificacion(pasted ? 'Captura pegada' : `${added} imagen${added > 1 ? 'es' : ''} agregada${added > 1 ? 's' : ''}`, 'success', 1500);
    updateGallery();
    if (images.length === added || pasted) showImage(pasted ? images.length - 1 : 0);
  }
};

// ✅ PASTE CORREGIDO (Win+Shift+S + Ctrl+V)
const handlePaste = (e) => {
  // ✅ CLAVE: Usar e.originalEvent.clipboardData (evento nativo)
  const items = e.originalEvent?.clipboardData?.items;
  if (!items) return;
  
  let found = false;
  $.each(items, (i, item) => {
    // ✅ Verificar si es imagen
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile();
      if (blob) {
        const file = new File([blob], `Captura_${pasteCount++}.png`, { type: blob.type });
        addImages([file], true);
        found = true;
        
        // Animación flash
        $('#imageZone').addClass('paste_flash');
        setTimeout(() => $('#imageZone').removeClass('paste_flash'), 300);
        
        return false; // Detener loop
      }
    }
  });
  
  if (!found) Notificacion('No se detectó imagen en portapapeles', 'error', 2000);
};

// Mostrar imagen
const showImage = (i) => {
  if (i < 0 || i >= images.length) return;
  currentIndex = i;
  zoomLevel = 1;
  
  const img = images[i];
  const $img = $('#mainImage');
  
  $('.image_placeholder').addClass('dpn');
  $('.image_viewer, .image_info').removeClass('dpn');
  
  $img[0].src = img.url;
  $img.css('transform', 'scale(1)');
  
  $('.image_name').text(img.name);
  getDim($img[0], (w, h) => {
    $('.image_dimensions').text(`${w}×${h} · ${bytes(img.size)}${img.pasted ? ' · Pegada' : ''}`);
  });
  
  updateGallery();
};

// Zoom
const zoom = (dir) => {
  if (dir === 'in') zoomLevel = Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM);
  else if (dir === 'out') zoomLevel = Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM);
  else zoomLevel = 1;
  $('#mainImage').css('transform', `scale(${zoomLevel})`);
};

// Navegación
const next = () => showImage(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
const prev = () => showImage(currentIndex > 0 ? currentIndex - 1 : images.length - 1);

// Descargar
const download = () => {
  if (!images.length) return;
  const a = document.createElement('a');
  a.href = images[currentIndex].url;
  a.download = images[currentIndex].name;
  a.click();
  Notificacion('Descargada', 'success', 1500);
};

// Fullscreen
const fullscreen = () => {
  const el = $('.image_viewer')[0];
  if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
  else document.exitFullscreen();
};

// Slideshow
const startSlideshow = () => {
  if (!images.length) return;
  abrirModal('slideshowModal');
  updateSlide();
  slideshowInterval = setInterval(() => { next(); updateSlide(); }, SLIDESHOW_DELAY);
  $('.btn_slide_play').html('<i class="fas fa-pause"></i>');
};

const stopSlideshow = () => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    $('.btn_slide_play').html('<i class="fas fa-play"></i>');
  }
};

const toggleSlideshow = () => {
  if (slideshowInterval) stopSlideshow();
  else {
    slideshowInterval = setInterval(() => { next(); updateSlide(); }, SLIDESHOW_DELAY);
    $('.btn_slide_play').html('<i class="fas fa-pause"></i>');
  }
};

const updateSlide = () => {
  if (!images.length) return;
  $('#slideshowImage')[0].src = images[currentIndex].url;
  $('#slideCounter').text(`${currentIndex + 1} / ${images.length}`);
};

// Selector de archivos
const openFile = () => {
  const input = $('<input type="file" accept="image/*" multiple style="display:none">');
  input.on('change', function() {
    if (this.files.length) addImages(this.files);
    input.remove();
  });
  $('body').append(input);
  input.click();
};

// Init
export const init = () => {
  // ✅ DOBLE CLIC para abrir selector (no click simple)
  $('#imageZone')
    .on('dblclick', openFile)
    .on('dragover', (e) => { 
      e.preventDefault(); 
      $('#imageZone').addClass('dragover'); 
    })
    .on('dragleave', () => $('#imageZone').removeClass('dragover'))
    .on('drop', (e) => {
      e.preventDefault();
      $('#imageZone').removeClass('dragover');
      // ✅ Drag & Drop con e.originalEvent
      if (e.originalEvent.dataTransfer?.files.length) {
        addImages(e.originalEvent.dataTransfer.files);
      }
    });
  
  // Controles
  $('.btn_prev').on('click', prev);
  $('.btn_next').on('click', next);
  $('.btn_zoom_in').on('click', () => zoom('in'));
  $('.btn_zoom_out').on('click', () => zoom('out'));
  $('.btn_zoom_reset').on('click', () => zoom('reset'));
  $('.btn_download').on('click', download);
  $('.btn_fullscreen').on('click', fullscreen);
  $('.btn_slideshow').on('click', startSlideshow);
  
  // Zoom con scroll
  $('#mainImage').on('wheel', (e) => {
    e.preventDefault();
    zoom(e.originalEvent.deltaY < 0 ? 'in' : 'out');
  });
  
  // Galería
  $(document).on('click', '.gallery_item', function() {
    showImage(parseInt($(this).data('i')));
  });
  
  $(document).on('click', '.btn_del', function(e) {
    e.stopPropagation();
    const i = parseInt($(this).data('i'));
    URL.revokeObjectURL(images[i].url);
    images.splice(i, 1);
    
    if (images.length) {
      if (i === currentIndex) showImage(Math.min(i, images.length - 1));
      else if (i < currentIndex) currentIndex--;
    } else {
      $('.image_viewer, .image_info').addClass('dpn');
      $('.image_placeholder').removeClass('dpn');
    }
    updateGallery();
  });
  
  // Botones
  $('.btn_add').on('click', openFile);
  $('.btn_clear').on('click', () => {
    if (!images.length) return;
    images.forEach(i => URL.revokeObjectURL(i.url));
    images = [];
    currentIndex = 0;
    pasteCount = 1;
    $('.image_viewer, .image_info').addClass('dpn');
    $('.image_placeholder').removeClass('dpn');
    updateGallery();
    Notificacion('Galería limpiada', 'success', 1500);
  });
  
  // Slideshow
  $('.btn_slide_prev').on('click', () => { prev(); updateSlide(); });
  $('.btn_slide_next').on('click', () => { next(); updateSlide(); });
  $('.btn_slide_play').on('click', toggleSlideshow);
  
  $('.modalX').on('click', () => {
    stopSlideshow();
    cerrarModal('slideshowModal');
  });
  
  // ✅ PASTE GLOBAL (Ctrl+V)
  $(document).on('paste', handlePaste);
  
  // Teclado
  $(document).on('keydown', (e) => {
    if (!images.length) return;
    
    const k = e.key;
    if (k === 'ArrowLeft') { prev(); if ($('#slideshowModal').hasClass('active')) updateSlide(); }
    else if (k === 'ArrowRight') { next(); if ($('#slideshowModal').hasClass('active')) updateSlide(); }
    else if (k === '+' || k === '=') zoom('in');
    else if (k === '-') zoom('out');
    else if (k === '0') zoom('reset');
    else if (k === 'f' || k === 'F') fullscreen();
    else if (k === 'Escape' && $('#slideshowModal').hasClass('active')) {
      stopSlideshow();
      cerrarModal('slideshowModal');
    }
  });
  
  console.log('✅ Visor de imágenes con Paste perfecto cargado');
};

// Cleanup
export const cleanup = () => {
  $('#imageZone, .btn_prev, .btn_next, .btn_zoom_in, .btn_zoom_out, .btn_zoom_reset, .btn_download, .btn_fullscreen, .btn_slideshow, .btn_add, .btn_clear, .modalX, #mainImage').off();
  $(document).off('click', '.gallery_item');
  $(document).off('click', '.btn_del');
  $(document).off('paste');
  $(document).off('keydown');
  stopSlideshow();
  images.forEach(i => URL.revokeObjectURL(i.url));
  images = [];
  console.log('🧹 Visor limpiado');
};
import './media.css';
import $ from 'jquery';
import { Notificacion, abrirModal, cerrarModal } from '../widev.js';

export const render = () => `
  <div class="media_container">
    <div class="media_layout">
      <div class="media_left">
        <div class="media_zone" id="mediaZone">
          <div class="media_placeholder">
            <i class="fas fa-photo-film"></i>
            <h2>Arrastra tus archivos aquí</h2>
          </div>
          <div class="media_player video_player dpn">
            <video id="videoPlayer" controls></video>
          </div>
          <div class="media_player audio_player dpn">
            <canvas id="audioWave"></canvas>
            <audio id="audioPlayer"></audio>
          </div>
          <div class="media_player image_player dpn">
            <img id="imageViewer" alt="Imagen">
            <div class="image_overlay">
              <button class="btn_zoom_in" title="Zoom +"><i class="fas fa-plus"></i></button>
              <button class="btn_zoom_out" title="Zoom -"><i class="fas fa-minus"></i></button>
              <button class="btn_zoom_reset" title="Reset"><i class="fas fa-compress"></i></button>
            </div>
          </div>
        </div>
        <div class="media_info dpn">
          <div class="info_top">
            <div class="info_left">
              <span class="media_name"></span>
              <span class="media_details"></span>
            </div>
          </div>
          <div class="info_timeline dpn">
            <span class="time_current">00:00</span>
            <div class="timeline_container">
              <div class="timeline_bg"><div class="timeline_fill"></div></div>
            </div>
            <span class="time_total">00:00</span>
          </div>
          <div class="info_controls" id="mediaControls"></div>
        </div>
      </div>

      <div class="media_right">
        <div class="gallery_header" id="galleryHeader">
          <h3 class="gallery_title"><i class="fas fa-photo-film"></i> Archivos (<span id="mediaCount">0</span>)</h3>
          <div class="gallery_actions">
            <button class="btn_icon btn_add" title="Agregar"><i class="fas fa-folder-open"></i></button>
            <button class="btn_icon btn_clear" title="Limpiar"><i class="fas fa-trash"></i></button>
            <button class="btn_icon btn_search" title="Buscar"><i class="fas fa-search"></i></button>
          </div>
        </div>

        <div class="search_bar dpn" id="searchBar">
          <i class="fas fa-search search_icon"></i>
          <input type="text" id="searchInput" placeholder="Buscar archivos..." autocomplete="off">
          <button class="btn_close_search" id="btnCloseSearch"><i class="fas fa-times"></i></button>
          <div class="search_results" id="searchResults">0 de 0</div>
        </div>

        <div class="media_gallery" id="mediaGallery"></div>
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

/* ══════════════════ ESTADO ══════════════════ */
let mediaFiles = [], currentIndex = 0, currentType = null, pasteCount = 1;
let zoomLevel = 1, isLooping = false, currentSpeed = 1, currentVolume = 70;
let slideshowInterval = null, searchQuery = '', isSearchActive = false;

/* Web Audio API — singleton */
let audioCtx = null, analyser = null, dataArray = null, audioSource = null;
let waveCanvas = null, waveCtx = null, animFrame = null;
let waveColorBg = '', waveColorPrimary = '', waveColorAlt = '';

/* ══════════════════ HELPERS ══════════════════ */
const bytes = b => {
  if (!b) return '0 B';
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / 1024 ** i).toFixed(1)} ${['B','KB','MB','GB'][i]}`;
};
const fmt = (s = 0) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(Math.floor(s % 60)).padStart(2,'0')}`;
const TYPES = {
  VIDEO:  ['video/mp4','video/webm','video/ogg'],
  AUDIO:  ['audio/mp3','audio/mpeg','audio/wav','audio/m4a','audio/ogg','audio/flac','audio/aac'],
  IMAGEN: ['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/svg+xml'],
};
const detectType = f => Object.keys(TYPES).find(k => TYPES[k].includes(f.type)) ?? null;

/* ══════════════════ BUSCADOR ══════════════════ */
const toggleSearch = () => {
  isSearchActive = !isSearchActive;
  if (isSearchActive) {
    $('#galleryHeader').addClass('dpn');
    $('#searchBar').removeClass('dpn');
    setTimeout(() => $('#searchInput').focus(), 80);
  } else {
    closeSearch();
  }
};

const closeSearch = () => {
  isSearchActive = false;
  $('#searchBar').addClass('dpn');
  $('#galleryHeader').removeClass('dpn');
  $('#searchInput').val('');
  searchQuery = '';
  updateGallery();
};

const handleSearch = query => {
  searchQuery = query.toLowerCase().trim();
  updateGallery();
  const n = getFiltered().length;
  $('#searchResults').text(`${n} de ${mediaFiles.length}`);
};

const getFiltered = () =>
  searchQuery ? mediaFiles.filter(m => m.name.toLowerCase().includes(searchQuery)) : mediaFiles;

/* ══════════════════ THUMBNAIL ══════════════════ */
const videoThumb = (file, cb) => {
  const v = document.createElement('video');
  const c = document.createElement('canvas');
  v.muted = v.playsInline = true;
  v.preload = 'metadata';
  v.onloadedmetadata = () => { v.currentTime = Math.min(1, v.duration * 0.1); };
  v.onseeked = () => {
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
    cb(c.toDataURL('image/jpeg', 0.7));
    URL.revokeObjectURL(v.src);
  };
  v.onerror = () => { cb(null); URL.revokeObjectURL(v.src); };
  v.src = URL.createObjectURL(file);
};

const getDimensions = (file, url, cb) => {
  if (file.type.startsWith('image/')) {
    const img = new Image();
    img.onload = () => cb(img.width, img.height, null);
    img.src = url; // reutiliza la URL ya creada, sin leak
  } else if (file.type.startsWith('video/')) {
    const v = document.createElement('video');
    v.onloadedmetadata = () => { cb(v.videoWidth, v.videoHeight, v.duration); URL.revokeObjectURL(v.src); };
    v.src = URL.createObjectURL(file);
  } else {
    const a = document.createElement('audio');
    a.onloadedmetadata = () => { cb(null, null, a.duration); URL.revokeObjectURL(a.src); };
    a.src = URL.createObjectURL(file);
  }
};

/* ══════════════════ ARCHIVOS ══════════════════ */
const addFiles = (files, isPasted = false) => {
  let added = 0;
  Array.from(files).forEach(f => {
    const type = detectType(f);
    if (!type) return Notificacion(`${f.name} no es un formato válido`, 'error', 2000);
    const url = URL.createObjectURL(f);
    const entry = { id: Date.now() + Math.random(), name: f.name, type, format: f.type, size: f.size, url, isPasted, thumbnail: null };

    if (type === 'VIDEO') {
      videoThumb(f, thumb => { entry.thumbnail = thumb; updateGallery(); });
    }

    getDimensions(f, url, (w, h, d) => {
      if (w) entry.width = w;
      if (h) entry.height = h;
      if (d) entry.duration = d;
      updateGallery();
    });

    mediaFiles.push(entry);
    added++;
  });

  if (!added) return;
  Notificacion(isPasted ? 'Captura pegada' : `${added} archivo(s) agregado(s)`, 'success', 1500);
  updateGallery();
  playMedia(isPasted ? mediaFiles.length - 1 : 0);
};

/* ══════════════════ PASTE ══════════════════ */
const handlePaste = e => {
  const items = e.originalEvent?.clipboardData?.items;
  if (!items) return;
  let found = false;
  $.each(items, (_, item) => {
    if (!item.type.startsWith('image/')) return true;
    const blob = item.getAsFile(); if (!blob) return true;
    addFiles([new File([blob], `Captura_${pasteCount++}.png`, { type: blob.type })], true);
    found = true;
    $('#mediaZone').addClass('paste_flash');
    setTimeout(() => $('#mediaZone').removeClass('paste_flash'), 300);
    return false;
  });
  if (!found) Notificacion('No se detectó imagen en portapapeles', 'error', 2000);
};

/* ══════════════════ GALERÍA ══════════════════ */
const updateGallery = () => {
  const $g = $('#mediaGallery');
  const filtered = getFiltered();
  $('#mediaCount').text(mediaFiles.length);

  if (!mediaFiles.length)
    return $g.html('<div class="gallery_empty"><i class="fas fa-folder-open"></i><p>Sin archivos</p></div>');
  if (!filtered.length && searchQuery)
    return $g.html('<div class="gallery_empty"><i class="fas fa-search"></i><p>No se encontraron archivos</p><small>Intenta con otro término</small></div>');

  const icon = { VIDEO: 'fa-video', AUDIO: 'fa-music', IMAGEN: 'fa-image' };
  $g.html(filtered.map(m => {
    const ri = mediaFiles.indexOf(m);
    const preview = m.type === 'VIDEO' ? (m.thumbnail ? `<img src="${m.thumbnail}" alt="">` : `<i class="fas fa-video"></i>`)
      : m.type === 'IMAGEN' ? `<img src="${m.url}" alt="">`
      : `<i class="fas fa-music"></i>`;
    const name = searchQuery
      ? m.name.replace(new RegExp(`(${searchQuery})`, 'gi'), '<mark>$1</mark>')
      : m.name;
    return `
      <div class="gallery_item ${ri === currentIndex ? 'active' : ''}" data-i="${ri}">
        <div class="item_preview ${m.type.toLowerCase()}">${preview}</div>
        <div class="item_info">
          <span class="item_name">${name}</span>
          <span class="item_details">${bytes(m.size)}${m.duration ? ` • ${fmt(m.duration)}` : ''}</span>
        </div>
        <span class="type_badge ${m.type.toLowerCase()}"><i class="fas ${icon[m.type]}"></i></span>
        ${m.isPasted ? '<span class="paste_badge"><i class="fas fa-paste"></i></span>' : ''}
        <button class="btn_del_mini" data-i="${ri}"><i class="fas fa-times"></i></button>
      </div>`;
  }).join(''));
};

/* ══════════════════ PLAY ══════════════════ */
const playMedia = i => {
  if (i < 0 || i >= mediaFiles.length) return;
  currentIndex = i;
  const m = mediaFiles[i];
  currentType = m.type;
  $('.media_placeholder,.video_player,.audio_player,.image_player').addClass('dpn');
  $('.media_info').removeClass('dpn');
  stopAllMedia();
  if (m.type === 'VIDEO')  playVideo(m);
  else if (m.type === 'AUDIO') playAudio(m);
  else playImage(m);
  $('.media_name').text(m.name);
  updateGallery();
  renderControls(m.type);
};

const playVideo = m => {
  $('.video_player').removeClass('dpn');
  const v = $('#videoPlayer')[0];
  v.src = m.url; v.load(); v.play().catch(() => {});
  $('.media_details').text(`${m.width}×${m.height} • ${bytes(m.size)} • ${fmt(m.duration)}`);
  $('.info_timeline').removeClass('dpn');
  v.ontimeupdate = () => {
    $('.time_current').text(fmt(v.currentTime));
    $('.timeline_fill').css('width', `${(v.currentTime / v.duration) * 100}%`);
    $('.time_total').text(fmt(v.duration));
  };
  v.onplay  = () => $('.btn_play i').attr('class', 'fas fa-pause');
  v.onpause = () => $('.btn_play i').attr('class', 'fas fa-play');
  v.onended = () => isLooping ? (v.currentTime = 0, v.play()) : nextMedia();
};

const playAudio = m => {
  $('.audio_player').removeClass('dpn');
  const a = $('#audioPlayer')[0];
  a.src = m.url; a.load(); a.play().catch(() => {});
  $('.media_details').text(`${bytes(m.size)} • ${fmt(m.duration)}`);
  $('.info_timeline').removeClass('dpn');
  setupWaveform(a);
  a.ontimeupdate = () => {
    $('.time_current').text(fmt(a.currentTime));
    $('.timeline_fill').css('width', `${(a.currentTime / a.duration) * 100}%`);
    $('.time_total').text(fmt(a.duration));
  };
  a.onplay  = () => $('.btn_play i').attr('class', 'fas fa-pause');
  a.onpause = () => $('.btn_play i').attr('class', 'fas fa-play');
  a.onended = () => isLooping ? (a.currentTime = 0, a.play()) : nextMedia();
};

const playImage = m => {
  $('.image_player').removeClass('dpn');
  const img = $('#imageViewer')[0];
  img.src = m.url; zoomLevel = 1; $(img).css('transform', 'scale(1)');
  $('.media_details').text(`${m.width}×${m.height} • ${bytes(m.size)}${m.isPasted ? ' • Pegada' : ''}`);
  $('.info_timeline').addClass('dpn');
};

/* ══════════════════ WAVEFORM ══════════════════ */
const setupWaveform = el => {
  waveCanvas = $('#audioWave')[0]; if (!waveCanvas) return;
  waveCtx = waveCanvas.getContext('2d');
  waveCanvas.width = waveCanvas.offsetWidth;
  waveCanvas.height = waveCanvas.offsetHeight;

  // Cachear colores una sola vez por sesión de reproducción
  const cs = getComputedStyle(document.documentElement);
  waveColorBg      = cs.getPropertyValue('--bg3').trim();
  waveColorPrimary = cs.getPropertyValue('--mco').trim();
  waveColorAlt     = cs.getPropertyValue('--bg2').trim();

  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  if (!audioSource) audioSource = audioCtx.createMediaElementSource(el);
  if (!analyser) {
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  if (animFrame) cancelAnimationFrame(animFrame);
  drawWave();
};

const drawWave = () => {
  animFrame = requestAnimationFrame(drawWave);
  if (!analyser || !waveCtx || !waveCanvas) return;
  analyser.getByteFrequencyData(dataArray);

  waveCtx.fillStyle = waveColorBg;
  waveCtx.fillRect(0, 0, waveCanvas.width, waveCanvas.height);

  const barW = (waveCanvas.width / dataArray.length) * 2.5;
  let x = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const h = (dataArray[i] / 255) * waveCanvas.height;
    const g = waveCtx.createLinearGradient(0, waveCanvas.height, 0, waveCanvas.height - h);
    g.addColorStop(0, waveColorPrimary);
    g.addColorStop(1, waveColorAlt);
    waveCtx.fillStyle = g;
    waveCtx.fillRect(x, waveCanvas.height - h, barW, h);
    x += barW + 1;
  }
};

/* ══════════════════ CONTROLES ══════════════════ */
const renderControls = type => {
  const $c = $('#mediaControls');
  const nav = `
    <button class="btn_control btn_prev"><i class="fas fa-step-backward"></i></button>
    <button class="btn_control btn_play"><i class="fas fa-play"></i></button>
    <button class="btn_control btn_next"><i class="fas fa-step-forward"></i></button>`;
  const vol = `
    <div class="volume_control">
      <button class="btn_control btn_volume"><i class="fas fa-volume-up"></i></button>
      <div class="volume_container"><div class="volume_bg"><div class="volume_fill"></div></div></div>
    </div>`;

  if (type === 'VIDEO') $c.html(`${nav}
    <button class="btn_control btn_loop"><i class="fas fa-redo"></i></button>
    <button class="btn_control btn_speed">1x</button>
    ${vol}
    <button class="btn_control btn_pip"><i class="fas fa-clone"></i></button>
    <button class="btn_control btn_fullscreen"><i class="fas fa-expand"></i></button>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>`);
  else if (type === 'AUDIO') $c.html(`${nav}
    <button class="btn_control btn_loop"><i class="fas fa-redo"></i></button>
    <button class="btn_control btn_speed">1x</button>
    ${vol}
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>`);
  else $c.html(`
    <button class="btn_control btn_prev"><i class="fas fa-chevron-left"></i></button>
    <button class="btn_control btn_next"><i class="fas fa-chevron-right"></i></button>
    <button class="btn_control btn_zoom_in_ctrl"><i class="fas fa-search-plus"></i></button>
    <button class="btn_control btn_zoom_out_ctrl"><i class="fas fa-search-minus"></i></button>
    <button class="btn_control btn_fullscreen"><i class="fas fa-expand"></i></button>
    <button class="btn_control btn_slideshow"><i class="fas fa-play-circle"></i></button>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>`);

  setTimeout(() => $('.volume_fill').css('width', `${currentVolume}%`), 10);
};

/* ══════════════════ ACCIONES ══════════════════ */
const player  = () => currentType === 'VIDEO' ? $('#videoPlayer')[0] : $('#audioPlayer')[0];
const togglePlay = () => { const p = player(); if (p) p.paused ? p.play() : p.pause(); };
const toggleLoop = () => { isLooping = !isLooping; $('.btn_loop').toggleClass('active', isLooping); Notificacion(`Loop ${isLooping ? 'activado' : 'desactivado'}`, 'info', 1500); };
const nextMedia  = () => playMedia((currentIndex + 1) % mediaFiles.length);
const prevMedia  = () => playMedia(currentIndex > 0 ? currentIndex - 1 : mediaFiles.length - 1);
const zoom       = d => { zoomLevel = d === 'in' ? Math.min(zoomLevel + 0.25, 5) : d === 'out' ? Math.max(zoomLevel - 0.25, 0.5) : 1; $('#imageViewer').css('transform', `scale(${zoomLevel})`); };

const changeSpeed = () => {
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];
  currentSpeed = speeds[(speeds.indexOf(currentSpeed) + 1) % speeds.length];
  player().playbackRate = currentSpeed;
  $('.btn_speed').text(`${currentSpeed}x`);
  Notificacion(`Velocidad: ${currentSpeed}x`, 'info', 1500);
};

const changeVolume = () => {
  const vols = [0, 25, 50, 70, 100];
  currentVolume = vols[(vols.indexOf(currentVolume) + 1) % vols.length];
  player().volume = currentVolume / 100;
  $('.volume_fill').css('width', `${currentVolume}%`);
  $('.btn_volume i').attr('class', `fas ${currentVolume === 0 ? 'fa-volume-mute' : currentVolume < 50 ? 'fa-volume-down' : 'fa-volume-up'}`);
  Notificacion(`Volumen: ${currentVolume}%`, 'info', 1500);
};

const togglePiP = async () => {
  const v = $('#videoPlayer')[0];
  try { document.pictureInPictureElement ? await document.exitPictureInPicture() : await v.requestPictureInPicture(); }
  catch { Notificacion('PiP no disponible', 'error', 2000); }
};

const toggleFullscreen = () => {
  const c = $('.media_player:not(.dpn)')[0];
  document.fullscreenElement ? document.exitFullscreen() : c?.requestFullscreen().catch(() => {});
};

const downloadMedia = () => {
  if (!mediaFiles.length) return;
  const m = mediaFiles[currentIndex];
  Object.assign(document.createElement('a'), { href: m.url, download: m.name }).click();
  Notificacion(`${m.name} descargado`, 'success', 1500);
};

/* ══════════════════ SLIDESHOW ══════════════════ */
const getImages = () => mediaFiles.filter(m => m.type === 'IMAGEN');

const startSlideshow = () => {
  const imgs = getImages(); if (!imgs.length) return Notificacion('No hay imágenes', 'error', 2000);
  abrirModal('slideshowModal');
  currentIndex = mediaFiles.indexOf(imgs[0]);
  updateSlide();
  slideshowInterval = setInterval(() => {
    const rest = mediaFiles.slice(currentIndex + 1).find(m => m.type === 'IMAGEN');
    currentIndex = rest ? mediaFiles.indexOf(rest) : mediaFiles.indexOf(imgs[0]);
    updateSlide();
  }, 3000);
};

const updateSlide = () => {
  const m = mediaFiles[currentIndex];
  $('#slideshowImage')[0].src = m.url;
  const imgs = getImages();
  const idx = mediaFiles.slice(0, currentIndex + 1).filter(m => m.type === 'IMAGEN').length;
  $('#slideCounter').text(`${idx} / ${imgs.length}`);
};

/* ══════════════════ STOP / LIMPIEZA ══════════════════ */
const stopAllMedia = () => {
  [$('#videoPlayer')[0], $('#audioPlayer')[0]].forEach(p => { if (p) { p.pause(); p.currentTime = 0; } });
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
};

const openFile = () => {
  const $input = $('<input type="file" accept="video/*,audio/*,image/*" multiple style="display:none">');
  $input.on('change', function () { if (this.files.length) addFiles(this.files); $input.remove(); });
  $('body').append($input); $input.click();
};

/* ══════════════════ INIT ══════════════════ */
export const init = () => {
  $('#mediaZone')
    .on('dblclick', openFile)
    .on('dragover',  e => { e.preventDefault(); $('#mediaZone').addClass('dragover'); })
    .on('dragleave', () => $('#mediaZone').removeClass('dragover'))
    .on('drop',      e => { e.preventDefault(); $('#mediaZone').removeClass('dragover'); const f = e.originalEvent.dataTransfer?.files; if (f?.length) addFiles(f); });

  $(document).on('paste.media', handlePaste);

  $('.btn_add').on('click', openFile);
  $('.btn_clear').on('click', () => {
    if (!mediaFiles.length) return;
    mediaFiles.forEach(m => URL.revokeObjectURL(m.url));
    mediaFiles = []; currentIndex = 0; pasteCount = 1;
    stopAllMedia();
    $('.media_placeholder').removeClass('dpn'); $('.media_info').addClass('dpn');
    updateGallery(); closeSearch();
    Notificacion('Todo limpiado', 'success', 1500);
  });
  $('.btn_search').on('click', toggleSearch);
  $('#btnCloseSearch').on('click', closeSearch);
  $('#searchInput').on('input', function () { handleSearch($(this).val()); });

  // Controles delegados
  $(document).on('click.media', '.btn_play',           togglePlay);
  $(document).on('click.media', '.btn_prev',           prevMedia);
  $(document).on('click.media', '.btn_next',           nextMedia);
  $(document).on('click.media', '.btn_loop',           toggleLoop);
  $(document).on('click.media', '.btn_speed',          changeSpeed);
  $(document).on('click.media', '.btn_volume',         changeVolume);
  $(document).on('click.media', '.btn_pip',            togglePiP);
  $(document).on('click.media', '.btn_fullscreen',     toggleFullscreen);
  $(document).on('click.media', '.btn_download',       downloadMedia);
  $(document).on('click.media', '.btn_zoom_in,.btn_zoom_in_ctrl',   () => zoom('in'));
  $(document).on('click.media', '.btn_zoom_out,.btn_zoom_out_ctrl', () => zoom('out'));
  $(document).on('click.media', '.btn_zoom_reset',     () => zoom('reset'));
  $(document).on('click.media', '.btn_slideshow',      startSlideshow);

  $(document).on('click.media', '.timeline_container', function (e) {
    const p = player(); if (p) p.currentTime = (e.offsetX / $(this).width()) * p.duration;
  });
  $(document).on('click.media', '.volume_container', function (e) {
    currentVolume = Math.round((e.offsetX / $(this).width()) * 100);
    const p = player(); if (p) p.volume = currentVolume / 100;
    $('.volume_fill').css('width', `${currentVolume}%`);
  });

  $(document).on('click.media', '.gallery_item', function () { playMedia(+$(this).data('i')); });
  $(document).on('click.media', '.btn_del_mini', function (e) {
    e.stopPropagation();
    const i = +$(this).data('i');
    URL.revokeObjectURL(mediaFiles[i].url);
    mediaFiles.splice(i, 1);
    if (mediaFiles.length) {
      if (i === currentIndex) playMedia(Math.min(i, mediaFiles.length - 1));
      else if (i < currentIndex) currentIndex--;
    } else {
      stopAllMedia();
      $('.media_placeholder').removeClass('dpn'); $('.media_info').addClass('dpn');
    }
    updateGallery();
  });

  // Slideshow modal
  $('.btn_slide_prev').on('click', prevMedia);
  $('.btn_slide_next').on('click', nextMedia);
  $('.btn_slide_play').on('click', () => {
    if (slideshowInterval) { clearInterval(slideshowInterval); slideshowInterval = null; $('.btn_slide_play i').attr('class', 'fas fa-play'); }
    else startSlideshow();
  });
  $('.modalX').on('click', () => { clearInterval(slideshowInterval); slideshowInterval = null; cerrarModal('slideshowModal'); });

  // Atajos de teclado
  $(document).on('keydown.media', e => {
    if (isSearchActive) { if (e.key === 'Escape') closeSearch(); return; }
    if (!mediaFiles.length) return;
    if ([' ','ArrowLeft','ArrowRight','f','F','+','=','-','0'].includes(e.key)) e.preventDefault();
    if (e.key === ' '        && currentType !== 'IMAGEN') togglePlay();
    if (e.key === 'ArrowLeft')  prevMedia();
    if (e.key === 'ArrowRight') nextMedia();
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    if (e.key === '+' || e.key === '=') currentType === 'IMAGEN' && zoom('in');
    if (e.key === '-')  currentType === 'IMAGEN' && zoom('out');
    if (e.key === '0')  currentType === 'IMAGEN' && zoom('reset');
  });

  console.log('🎬 Mediawii · Centro Multimedia OK');
};

export const cleanup = () => {
  stopAllMedia();
  mediaFiles.forEach(m => URL.revokeObjectURL(m.url));
  mediaFiles = [];
  if (slideshowInterval) { clearInterval(slideshowInterval); slideshowInterval = null; }
  if (audioCtx) { audioCtx.close(); audioCtx = null; analyser = null; audioSource = null; }
  $(document).off('.media');
  $('#mediaZone, .btn_add, .btn_clear, .btn_search, #btnCloseSearch, #searchInput, .modalX').off();
  console.log('🧹 Mediawii · limpiado');
};

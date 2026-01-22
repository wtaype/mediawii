import './videos.css';
import jQuery from 'jquery';
import { Notificacion } from '../widev.js';

export const render = () => `
  <div class="video_container">
    <div class="video_layout">
      <!-- LEFT: Reproductor -->
      <div class="video_left">
        <div class="video_zone" id="videoZone">
          <div class="video_placeholder">
            <i class="fas fa-film"></i>
            <h2>Arrastra tus videos aquí</h2>
            <p>o <strong>haz doble clic</strong> para seleccionar</p>
            <p class="upload_hint">Soporta: <kbd>MP4</kbd> <kbd>WebM</kbd> <kbd>OGG</kbd></p>
          </div>
          
          <div class="video_player dpn">
            <video id="mainVideo" preload="metadata"></video>
            <div class="video_overlay">
              <button class="btn_play_big"><i class="fas fa-play"></i></button>
            </div>
          </div>
        </div>

        <!-- Controles del reproductor -->
        <div class="video_controls dpn">
          <div class="controls_progress">
            <div class="progress_bar_container">
              <div class="progress_bar_bg">
                <div class="progress_bar_fill"></div>
              </div>
            </div>
            <div class="progress_time">
              <span class="time_current">00:00</span>
              <span class="time_duration">00:00</span>
            </div>
          </div>
          
          <div class="controls_main">
            <button class="btn_control btn_prev" title="Anterior"><i class="fas fa-step-backward"></i></button>
            <button class="btn_control btn_play" title="Play"><i class="fas fa-play"></i></button>
            <button class="btn_control btn_next" title="Siguiente"><i class="fas fa-step-forward"></i></button>
            <button class="btn_control btn_loop" title="Loop"><i class="fas fa-repeat"></i></button>
            
            <div class="volume_control">
              <button class="btn_control btn_volume" title="Volumen"><i class="fas fa-volume-up"></i></button>
              <div class="volume_bar_container">
                <div class="volume_bar_bg">
                  <div class="volume_bar_fill"></div>
                </div>
              </div>
            </div>
            
            <button class="btn_control btn_speed" title="Velocidad">1x</button>
            <button class="btn_control btn_fullscreen" title="Pantalla completa"><i class="fas fa-expand"></i></button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Lista de videos -->
      <div class="video_right">
        <div class="list_header">
          <h3><i class="fas fa-list"></i> Lista de reproducción</h3>
          <div class="list_actions">
            <button class="btn_icon btn_add" title="Agregar videos"><i class="fas fa-plus"></i></button>
            <button class="btn_icon btn_clear_all" title="Limpiar todo"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        
        <div class="video_list" id="videoList">
          <div class="list_empty">
            <i class="fas fa-folder-open"></i>
            <p>No hay videos</p>
            <small>Arrastra o agrega videos</small>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// ==================== VARIABLES GLOBALES ====================
const $ = jQuery;
let videos = [];
let currentIndex = 0;
const FORMATOS_VALIDOS = ['video/mp4', 'video/webm', 'video/ogg'];

// ==================== ELEMENTOS DOM ====================
const obtenerElementos = () => ({
  zona: $('#videoZone'),
  placeholder: $('.video_placeholder'),
  player: $('.video_player'),
  video: $('#mainVideo')[0],
  controles: $('.video_controls'),
  lista: $('#videoList'),
  progressBar: $('.progress_bar_fill'),
  progressContainer: $('.progress_bar_container'),
  volumeBar: $('.volume_bar_fill'),
  volumeContainer: $('.volume_bar_container'),
  btnPlay: $('.btn_play'),
  btnPlayBig: $('.btn_play_big'),
  btnPrev: $('.btn_prev'),
  btnNext: $('.btn_next'),
  btnLoop: $('.btn_loop'),
  btnVolume: $('.btn_volume'),
  btnSpeed: $('.btn_speed'),
  btnFullscreen: $('.btn_fullscreen'),
  timeCurrent: $('.time_current'),
  timeDuration: $('.time_duration'),
  overlay: $('.video_overlay')
});

// ==================== UTILIDADES ====================
const formatearTiempo = (segundos) => {
  if (!isFinite(segundos)) return '00:00';
  const mins = Math.floor(segundos / 60);
  const secs = Math.floor(segundos % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const formatearTamaño = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

// ==================== LISTA DE VIDEOS ====================
const actualizarLista = () => {
  const { lista } = obtenerElementos();
  
  if (videos.length === 0) {
    lista.html(`
      <div class="list_empty">
        <i class="fas fa-folder-open"></i>
        <p>No hay videos</p>
        <small>Arrastra o agrega videos</small>
      </div>
    `);
    return;
  }
  
  const html = videos.map((video, index) => `
    <div class="video_item ${index === currentIndex ? 'active' : ''}" data-index="${index}">
      <div class="item_info">
        <i class="fas fa-film"></i>
        <div class="item_text">
          <span class="item_name" title="${video.name}">${video.name}</span>
          <span class="item_size">${formatearTamaño(video.size)}</span>
        </div>
      </div>
      <button class="btn_delete" data-index="${index}" title="Eliminar">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
  
  lista.html(html);
};

// ==================== PROCESAR VIDEOS ====================
const agregarVideos = (archivos) => {
  const archivosArray = Array.from(archivos);
  let agregados = 0;
  
  archivosArray.forEach(archivo => {
    if (!FORMATOS_VALIDOS.includes(archivo.type)) {
      Notificacion(`${archivo.name} no es un formato válido`, 'error', 2000);
      return;
    }
    
    const url = URL.createObjectURL(archivo);
    videos.push({ name: archivo.name, size: archivo.size, url, type: archivo.type });
    agregados++;
  });
  
  if (agregados > 0) {
    Notificacion(`${agregados} video${agregados > 1 ? 's' : ''} agregado${agregados > 1 ? 's' : ''}`, 'success', 2000);
    actualizarLista();
    
    if (videos.length === agregados) {
      reproducirVideo(0);
    }
  }
};

// ==================== REPRODUCTOR ====================
const reproducirVideo = (index) => {
  if (index < 0 || index >= videos.length) return;
  
  const { placeholder, player, video, controles, zona } = obtenerElementos();
  const videoData = videos[index];
  
  currentIndex = index;
  
  placeholder.addClass('dpn');
  player.removeClass('dpn');
  controles.removeClass('dpn');
  zona.addClass('playing'); // ✅ Eliminar borde dashed
  
  video.src = videoData.url;
  video.play().catch(() => {});
  
  actualizarLista();
};

const togglePlay = () => {
  const { video, btnPlay, btnPlayBig } = obtenerElementos();
  
  if (video.paused) {
    video.play();
    btnPlay.html('<i class="fas fa-pause"></i>');
    btnPlayBig.html('<i class="fas fa-pause"></i>');
  } else {
    video.pause();
    btnPlay.html('<i class="fas fa-play"></i>');
    btnPlayBig.html('<i class="fas fa-play"></i>');
  }
};

const siguienteVideo = () => {
  if (currentIndex < videos.length - 1) {
    reproducirVideo(currentIndex + 1);
  } else {
    reproducirVideo(0);
  }
};

const anteriorVideo = () => {
  if (currentIndex > 0) {
    reproducirVideo(currentIndex - 1);
  } else {
    reproducirVideo(videos.length - 1);
  }
};

const toggleLoop = () => {
  const { video, btnLoop } = obtenerElementos();
  video.loop = !video.loop;
  btnLoop.toggleClass('active', video.loop);
  Notificacion(video.loop ? 'Loop activado' : 'Loop desactivado', 'info', 1500);
};

const cambiarVelocidad = () => {
  const { video, btnSpeed } = obtenerElementos();
  const velocidades = [0.5, 1, 1.5, 2];
  const indexActual = velocidades.indexOf(video.playbackRate);
  const siguiente = velocidades[(indexActual + 1) % velocidades.length];
  
  video.playbackRate = siguiente;
  btnSpeed.text(`${siguiente}x`);
  Notificacion(`Velocidad: ${siguiente}x`, 'info', 1500);
};

const toggleFullscreen = () => {
  const { player } = obtenerElementos();
  
  if (!document.fullscreenElement) {
    player[0].requestFullscreen().catch(() => {
      Notificacion('Pantalla completa no disponible', 'error', 2000);
    });
  } else {
    document.exitFullscreen();
  }
};

// ==================== EVENTOS DE CARGA ====================
const abrirSelector = () => {
  const entrada = $('<input type="file" accept="video/mp4,video/webm,video/ogg" multiple style="display:none;">');
  
  entrada.on('change', function() {
    if (this.files.length > 0) {
      agregarVideos(this.files);
    }
    entrada.remove();
  });
  
  $('body').append(entrada);
  entrada.click();
};

const manejarDragOver = (e) => {
  e.preventDefault();
  obtenerElementos().zona.addClass('dragover');
};

const manejarDragLeave = () => {
  obtenerElementos().zona.removeClass('dragover');
};

const manejarDrop = (e) => {
  e.preventDefault();
  obtenerElementos().zona.removeClass('dragover');
  
  const archivos = e.originalEvent.dataTransfer?.files;
  if (archivos?.length) {
    agregarVideos(archivos);
  }
};

// ==================== EVENTOS DEL REPRODUCTOR ====================
const configurarEventosVideo = () => {
  const { video, progressBar, timeCurrent, timeDuration, btnPlay, btnPlayBig, overlay } = obtenerElementos();
  
  // Actualizar tiempo y progreso
  $(video).on('timeupdate', () => {
    if (video.duration) {
      const porcentaje = (video.currentTime / video.duration) * 100;
      progressBar.css('width', `${porcentaje}%`);
      timeCurrent.text(formatearTiempo(video.currentTime));
    }
  });
  
  // Cargar metadata
  $(video).on('loadedmetadata', () => {
    timeDuration.text(formatearTiempo(video.duration));
  });
  
  // Play/Pausa
  $(video).on('play', () => {
    btnPlay.html('<i class="fas fa-pause"></i>');
    btnPlayBig.html('<i class="fas fa-pause"></i>');
    overlay.addClass('hide');
  });
  
  $(video).on('pause', () => {
    btnPlay.html('<i class="fas fa-play"></i>');
    btnPlayBig.html('<i class="fas fa-play"></i>');
    overlay.removeClass('hide');
  });
  
  // Fin del video
  $(video).on('ended', () => {
    if (!video.loop) {
      siguienteVideo();
    }
  });
};

// ==================== INICIALIZACIÓN ====================
export const init = () => {
  const { zona, progressContainer, volumeContainer, volumeBar, video, btnPlay, btnPlayBig, btnPrev, btnNext, btnLoop, btnVolume, btnSpeed, btnFullscreen, lista } = obtenerElementos();
  
  // Configurar volumen inicial
  video.volume = 0.7;
  volumeBar.css('width', '70%');
  
  // Eventos de zona de carga
  zona.on('dblclick', abrirSelector)
      .on('dragover', manejarDragOver)
      .on('dragleave', manejarDragLeave)
      .on('drop', manejarDrop);
  
  // Eventos de controles
  btnPlay.on('click', togglePlay);
  btnPlayBig.on('click', togglePlay);
  btnPrev.on('click', anteriorVideo);
  btnNext.on('click', siguienteVideo);
  btnLoop.on('click', toggleLoop);
  btnSpeed.on('click', cambiarVelocidad);
  btnFullscreen.on('click', toggleFullscreen);
  
  // Control de volumen
  btnVolume.on('click', () => {
    video.muted = !video.muted;
    btnVolume.html(video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>');
  });
  
  // Click en barra de volumen
  volumeContainer.on('click', function(e) {
    const percent = e.offsetX / $(this).width();
    video.volume = percent;
    video.muted = false;
    volumeBar.css('width', `${percent * 100}%`);
    btnVolume.html('<i class="fas fa-volume-up"></i>');
  });
  
  // Click en barra de progreso
  progressContainer.on('click', function(e) {
    const percent = e.offsetX / $(this).width();
    video.currentTime = percent * video.duration;
  });
  
  // Eventos de lista
  lista.on('click', '.video_item', function() {
    const index = parseInt($(this).data('index'));
    reproducirVideo(index);
  });
  
  lista.on('click', '.btn_delete', function(e) {
    e.stopPropagation();
    const index = parseInt($(this).data('index'));
    
    URL.revokeObjectURL(videos[index].url);
    videos.splice(index, 1);
    
    if (index === currentIndex && videos.length > 0) {
      currentIndex = Math.min(index, videos.length - 1);
      reproducirVideo(currentIndex);
    } else if (videos.length === 0) {
      const { placeholder, player, controles, zona } = obtenerElementos();
      player.addClass('dpn');
      placeholder.removeClass('dpn');
      controles.addClass('dpn');
      zona.removeClass('playing'); // ✅ Restaurar borde
      video.src = '';
    } else if (index < currentIndex) {
      currentIndex--;
    }
    
    actualizarLista();
    Notificacion('Video eliminado', 'success', 1500);
  });
  
  // Botones de acciones
  $('.btn_add').on('click', abrirSelector);
  $('.btn_clear_all').on('click', () => {
    if (videos.length === 0) return;
    
    videos.forEach(v => URL.revokeObjectURL(v.url));
    videos = [];
    currentIndex = 0;
    
    const { placeholder, player, controles, zona } = obtenerElementos();
    player.addClass('dpn');
    placeholder.removeClass('dpn');
    controles.addClass('dpn');
    zona.removeClass('playing'); // ✅ Restaurar borde
    video.src = '';
    
    actualizarLista();
    Notificacion('Todos los videos eliminados', 'success', 2000);
  });
  
  // Configurar eventos del video
  configurarEventosVideo();
  
  // Teclas de acceso rápido
  $(document).on('keydown', (e) => {
    if (videos.length === 0) return;
    
    switch(e.key) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        video.currentTime -= 5;
        break;
      case 'ArrowRight':
        video.currentTime += 5;
        break;
      case 'ArrowUp':
        video.volume = Math.min(1, video.volume + 0.1);
        volumeBar.css('width', `${video.volume * 100}%`);
        break;
      case 'ArrowDown':
        video.volume = Math.max(0, video.volume - 0.1);
        volumeBar.css('width', `${video.volume * 100}%`);
        break;
      case 'f':
        toggleFullscreen();
        break;
    }
  });
  
  console.log('✅ Reproductor de videos cargado');
};

// ==================== LIMPIEZA ====================
export const cleanup = () => {
  const selectores = ['#videoZone', '.btn_play', '.btn_play_big', '.btn_prev', '.btn_next', '.btn_loop', '.btn_volume', '.btn_speed', '.btn_fullscreen', '.progress_bar_container', '.volume_bar_container', '#videoList', '.btn_add', '.btn_clear_all'];
  
  selectores.forEach(sel => $(sel).off());
  $(document).off('keydown');
  
  const { video } = obtenerElementos();
  $(video).off();
  video.pause();
  video.src = '';
  
  console.log('🧹 Reproductor limpiado');
};
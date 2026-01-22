import './audios.css';
import jQuery from 'jquery';
import { Notificacion } from '../widev.js';

export const render = () => `
  <div class="audio_container">
    <div class="audio_layout">
      <!-- LEFT: Reproductor con Waves -->
      <div class="audio_left">
        <div class="audio_zone" id="audioZone">
          <div class="audio_placeholder">
            <i class="fas fa-music"></i>
            <h2>Arrastra tus audios aquí</h2>
            <p>o <strong>haz doble clic</strong> para seleccionar</p>
            <p class="upload_hint">Soporta: <kbd>MP3</kbd> <kbd>WAV</kbd> <kbd>OGG</kbd> <kbd>M4A</kbd></p>
          </div>
          
          <div class="audio_player dpn">
            <div class="audio_info">
              <h3 class="audio_title">Sin audio</h3>
              <p class="audio_artist">Desconocido</p>
            </div>
            <canvas id="audioWaves"></canvas>
            <div class="waves_overlay" id="wavesOverlay">
              <button class="btn_play_waves"><i class="fas fa-play"></i></button>
            </div>
          </div>
        </div>

        <!-- Controles del reproductor -->
        <div class="audio_controls dpn">
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
            <button class="btn_control btn_shuffle" title="Aleatorio"><i class="fas fa-random"></i></button>
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
          </div>
        </div>
      </div>

      <!-- RIGHT: Lista de audios -->
      <div class="audio_right">
        <div class="list_header">
          <h3><i class="fas fa-list"></i> Lista de reproducción</h3>
          <div class="list_actions">
            <button class="btn_icon btn_add" title="Agregar audios"><i class="fas fa-plus"></i></button>
            <button class="btn_icon btn_clear_all" title="Limpiar todo"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        
        <div class="audio_list" id="audioList">
          <div class="list_empty">
            <i class="fas fa-folder-open"></i>
            <p>No hay audios</p>
            <small>Arrastra o agrega audios</small>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// ==================== VARIABLES GLOBALES ====================
const $ = jQuery;
let audios = [];
let currentIndex = 0;
let shuffleMode = false;
const FORMATOS_VALIDOS = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/m4a'];

// ✅ Audio global persistente
const audio = new Audio();

// Variables Web Audio API
let audioContext, analyser, source, dataArray, bufferLength;
let animationId;

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

// ==================== WEB AUDIO API ====================
const inicializarAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
};

const dibujarWaves = () => {
  const canvas = $('#audioWaves')[0];
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  analyser.getByteFrequencyData(dataArray);
  
  ctx.clearRect(0, 0, width, height);
  
  const barCount = 40;
  const barWidth = width / barCount;
  const gap = barWidth * 0.2;
  const actualBarWidth = barWidth - gap;
  
  const computedStyle = getComputedStyle(document.documentElement);
  const mainColor = computedStyle.getPropertyValue('--mco').trim();
  
  for (let i = 0; i < barCount; i++) {
    const dataIndex = Math.floor((i / barCount) * bufferLength);
    const barHeight = (dataArray[dataIndex] / 255) * height * 0.8;
    
    const x = i * barWidth + gap / 2;
    const y = (height - barHeight) / 2;
    
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, mainColor);
    gradient.addColorStop(0.5, mainColor + 'cc');
    gradient.addColorStop(1, mainColor + '66');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, actualBarWidth, barHeight);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x, y, actualBarWidth, Math.min(barHeight * 0.3, 3));
  }
  
  animationId = requestAnimationFrame(dibujarWaves);
};

const detenerAnimacion = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  const canvas = $('#audioWaves')[0];
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

// ==================== LISTA DE AUDIOS ====================
const actualizarLista = () => {
  const lista = $('#audioList');
  
  if (audios.length === 0) {
    lista.html(`
      <div class="list_empty">
        <i class="fas fa-folder-open"></i>
        <p>No hay audios</p>
        <small>Arrastra o agrega audios</small>
      </div>
    `);
    return;
  }
  
  const html = audios.map((audioItem, index) => `
    <div class="audio_item ${index === currentIndex ? 'active' : ''}" data-index="${index}">
      <div class="item_info">
        <i class="fas fa-music"></i>
        <div class="item_text">
          <span class="item_name" title="${audioItem.name}">${audioItem.name}</span>
          <span class="item_size">${formatearTamaño(audioItem.size)}</span>
        </div>
      </div>
      <button class="btn_delete" data-index="${index}" title="Eliminar">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
  
  lista.html(html);
};

// ==================== PROCESAR AUDIOS ====================
const agregarAudios = (archivos) => {
  const archivosArray = Array.from(archivos);
  let agregados = 0;
  
  archivosArray.forEach(archivo => {
    if (!FORMATOS_VALIDOS.includes(archivo.type)) {
      Notificacion(`${archivo.name} no es un formato válido`, 'error', 2000);
      return;
    }
    
    const url = URL.createObjectURL(archivo);
    audios.push({ name: archivo.name, size: archivo.size, url, type: archivo.type });
    agregados++;
  });
  
  if (agregados > 0) {
    Notificacion(`${agregados} audio${agregados > 1 ? 's' : ''} agregado${agregados > 1 ? 's' : ''}`, 'success', 2000);
    actualizarLista();
    
    if (audios.length === agregados) {
      reproducirAudio(0);
    }
  }
};

// ==================== REPRODUCTOR ====================
const reproducirAudio = (index) => {
  if (index < 0 || index >= audios.length) return;
  
  const audioData = audios[index];
  currentIndex = index;
  
  $('.audio_placeholder').addClass('dpn');
  $('.audio_player').removeClass('dpn');
  $('.audio_controls').removeClass('dpn');
  $('#audioZone').addClass('playing');
  
  const canvas = $('#audioWaves')[0];
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  inicializarAudioContext();
  
  audio.src = audioData.url;
  audio.play().then(() => {
    audioContext.resume();
    dibujarWaves();
  }).catch(err => {
    console.error('Error al reproducir:', err);
    Notificacion('Error al reproducir audio', 'error', 2000);
  });
  
  const nombreLimpio = audioData.name.replace(/\.[^/.]+$/, '');
  $('.audio_title').text(nombreLimpio);
  $('.audio_artist').text('Desconocido');
  
  actualizarLista();
};

const togglePlay = () => {
  if (audio.paused) {
    audio.play().then(() => {
      if (audioContext) audioContext.resume();
      dibujarWaves();
    });
    $('.btn_play').html('<i class="fas fa-pause"></i>');
    $('.btn_play_waves').html('<i class="fas fa-pause"></i>');
    $('#wavesOverlay').addClass('hide');
  } else {
    audio.pause();
    detenerAnimacion();
    $('.btn_play').html('<i class="fas fa-play"></i>');
    $('.btn_play_waves').html('<i class="fas fa-play"></i>');
    $('#wavesOverlay').removeClass('hide');
  }
};

const siguienteAudio = () => {
  if (shuffleMode && audios.length > 1) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * audios.length);
    } while (newIndex === currentIndex);
    reproducirAudio(newIndex);
  } else if (currentIndex < audios.length - 1) {
    reproducirAudio(currentIndex + 1);
  } else {
    reproducirAudio(0);
  }
};

const anteriorAudio = () => {
  if (currentIndex > 0) {
    reproducirAudio(currentIndex - 1);
  } else {
    reproducirAudio(audios.length - 1);
  }
};

const toggleLoop = () => {
  audio.loop = !audio.loop;
  $('.btn_loop').toggleClass('active', audio.loop);
  Notificacion(audio.loop ? 'Loop activado' : 'Loop desactivado', 'info', 1500);
};

const toggleShuffle = () => {
  shuffleMode = !shuffleMode;
  $('.btn_shuffle').toggleClass('active', shuffleMode);
  Notificacion(shuffleMode ? 'Aleatorio activado' : 'Aleatorio desactivado', 'info', 1500);
};

// ==================== EVENTOS DE CARGA ====================
const abrirSelector = () => {
  const entrada = $('<input type="file" accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a" multiple style="display:none;">');
  
  entrada.on('change', function() {
    if (this.files.length > 0) {
      agregarAudios(this.files);
    }
    entrada.remove();
  });
  
  $('body').append(entrada);
  entrada.click();
};

const manejarDragOver = (e) => {
  e.preventDefault();
  $('#audioZone').addClass('dragover');
};

const manejarDragLeave = () => {
  $('#audioZone').removeClass('dragover');
};

const manejarDrop = (e) => {
  e.preventDefault();
  $('#audioZone').removeClass('dragover');
  
  const archivos = e.originalEvent.dataTransfer?.files;
  if (archivos?.length) {
    agregarAudios(archivos);
  }
};

// ==================== EVENTOS DEL REPRODUCTOR ====================
const configurarEventosAudio = () => {
  $(audio).on('timeupdate', () => {
    if (audio.duration && isFinite(audio.duration)) {
      const porcentaje = (audio.currentTime / audio.duration) * 100;
      $('.progress_bar_fill').css('width', `${porcentaje}%`);
      $('.time_current').text(formatearTiempo(audio.currentTime));
    }
  });
  
  $(audio).on('loadedmetadata', () => {
    $('.time_duration').text(formatearTiempo(audio.duration));
  });
  
  $(audio).on('play', () => {
    $('.btn_play').html('<i class="fas fa-pause"></i>');
    $('.btn_play_waves').html('<i class="fas fa-pause"></i>');
    $('#wavesOverlay').addClass('hide');
  });
  
  $(audio).on('pause', () => {
    $('.btn_play').html('<i class="fas fa-play"></i>');
    $('.btn_play_waves').html('<i class="fas fa-play"></i>');
    $('#wavesOverlay').removeClass('hide');
  });
  
  $(audio).on('ended', () => {
    if (!audio.loop) {
      siguienteAudio();
    }
  });
};

// ==================== INICIALIZACIÓN ====================
export const init = () => {
  audio.volume = 0.7;
  $('.volume_bar_fill').css('width', '70%');
  
  const ajustarCanvas = () => {
    const canvas = $('#audioWaves')[0];
    if (canvas && !canvas.classList?.contains?.('dpn')) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  };
  
  $(window).on('resize', ajustarCanvas);
  
  $('#audioZone')
    .on('dblclick', abrirSelector)
    .on('dragover', manejarDragOver)
    .on('dragleave', manejarDragLeave)
    .on('drop', manejarDrop);
  
  $('.btn_play').on('click', togglePlay);
  $('.btn_play_waves').on('click', togglePlay);
  $('.btn_prev').on('click', anteriorAudio);
  $('.btn_next').on('click', siguienteAudio);
  $('.btn_loop').on('click', toggleLoop);
  $('.btn_shuffle').on('click', toggleShuffle);
  
  $('.btn_volume').on('click', () => {
    audio.muted = !audio.muted;
    $('.btn_volume').html(audio.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>');
  });
  
  $('.volume_bar_container').on('click', function(e) {
    const percent = e.offsetX / $(this).width();
    audio.volume = percent;
    audio.muted = false;
    $('.volume_bar_fill').css('width', `${percent * 100}%`);
    $('.btn_volume').html('<i class="fas fa-volume-up"></i>');
  });
  
  $('.progress_bar_container').on('click', function(e) {
    if (!audio.duration || !isFinite(audio.duration)) return;
    const percent = e.offsetX / $(this).width();
    audio.currentTime = percent * audio.duration;
  });
  
  $(document).on('click', '.audio_item', function() {
    const index = parseInt($(this).data('index'));
    reproducirAudio(index);
  });
  
  $(document).on('click', '.btn_delete', function(e) {
    e.stopPropagation();
    const index = parseInt($(this).data('index'));
    
    URL.revokeObjectURL(audios[index].url);
    audios.splice(index, 1);
    
    if (index === currentIndex && audios.length > 0) {
      currentIndex = Math.min(index, audios.length - 1);
      reproducirAudio(currentIndex);
    } else if (audios.length === 0) {
      $('.audio_player').addClass('dpn');
      $('.audio_placeholder').removeClass('dpn');
      $('.audio_controls').addClass('dpn');
      $('#audioZone').removeClass('playing');
      audio.src = '';
      detenerAnimacion();
    } else if (index < currentIndex) {
      currentIndex--;
    }
    
    actualizarLista();
    Notificacion('Audio eliminado', 'success', 1500);
  });
  
  $('.btn_add').on('click', abrirSelector);
  
  $('.btn_clear_all').on('click', () => {
    if (audios.length === 0) return;
    
    audios.forEach(a => URL.revokeObjectURL(a.url));
    audios = [];
    currentIndex = 0;
    
    $('.audio_player').addClass('dpn');
    $('.audio_placeholder').removeClass('dpn');
    $('.audio_controls').addClass('dpn');
    $('#audioZone').removeClass('playing');
    audio.src = '';
    detenerAnimacion();
    
    actualizarLista();
    Notificacion('Todos los audios eliminados', 'success', 2000);
  });
  
  configurarEventosAudio();
  
  $(document).on('keydown', (e) => {
    if (audios.length === 0) return;
    
    switch(e.key) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        if (audio.duration && isFinite(audio.duration)) {
          audio.currentTime = Math.max(0, audio.currentTime - 5);
        }
        break;
      case 'ArrowRight':
        if (audio.duration && isFinite(audio.duration)) {
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        }
        break;
      case 'ArrowUp':
        audio.volume = Math.min(1, audio.volume + 0.1);
        $('.volume_bar_fill').css('width', `${audio.volume * 100}%`);
        break;
      case 'ArrowDown':
        audio.volume = Math.max(0, audio.volume - 0.1);
        $('.volume_bar_fill').css('width', `${audio.volume * 100}%`);
        break;
    }
  });
  
  console.log('✅ Reproductor de audios cargado');
};

// ==================== LIMPIEZA ====================
export const cleanup = () => {
  $('#audioZone, .btn_play, .btn_play_waves, .btn_prev, .btn_next, .btn_loop, .btn_shuffle, .btn_volume, .progress_bar_container, .volume_bar_container, .btn_add, .btn_clear_all').off();
  $(document).off('click', '.audio_item');
  $(document).off('click', '.btn_delete');
  $(document).off('keydown');
  $(window).off('resize');
  
  $(audio).off();
  audio.pause();
  audio.src = '';
  
  detenerAnimacion();
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  console.log('🧹 Reproductor de audios limpiado');
};
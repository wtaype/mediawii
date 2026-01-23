import './media.css';
import $ from 'jquery';
import { Notificacion, abrirModal, cerrarModal, savels, getls } from '../widev.js';

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
        <div class="gallery_header">
          <h3><i class="fas fa-photo-film"></i> Archivos (<span id="mediaCount">0</span>)</h3>
          <div class="gallery_actions">
            <button class="btn_icon btn_add" title="Agregar"><i class="fas fa-folder-open"></i></button>
            <button class="btn_icon btn_clear" title="Limpiar"><i class="fas fa-trash"></i></button>
            <button class="btn_icon btn_reload" title="Recargar"><i class="fas fa-rotate-right"></i></button>
          </div>
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

/* ==================== ESTADO ==================== */
let mediaFiles = [], currentIndex = 0, currentType = null, pasteCount = 1;
let zoomLevel = 1, isLooping = false, currentSpeed = 1, currentVolume = 70, slideshowInterval = null;

/* Web Audio API (única conexión) */
let audioContext = null, analyser = null, dataArray = null, audioSource = null;
let waveCanvas = null, waveCtx = null, animationId = null;

/* ==================== HELPERS ==================== */
const bytes = (b) => !b ? '0 B' : `${(b / 1024 ** (Math.floor(Math.log(b)/Math.log(1024)))).toFixed(1)} ${['B','KB','MB'][Math.floor(Math.log(b)/Math.log(1024))]}`;
const formatTime = (sec=0) => `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(Math.floor(sec%60)).padStart(2,'0')}`;
const FORMATS = {
  VIDEO: ['video/mp4','video/webm','video/ogg'],
  AUDIO: ['audio/mp3','audio/mpeg','audio/wav','audio/m4a','audio/ogg'],
  IMAGEN: ['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/svg+xml']
};
const detectType = (f) => FORMATS.VIDEO.includes(f.type) ? 'VIDEO' : FORMATS.AUDIO.includes(f.type) ? 'AUDIO' : FORMATS.IMAGEN.includes(f.type) ? 'IMAGEN' : null;

/* ==================== 🎬 GENERAR THUMBNAIL DE VIDEO ==================== */
const generateVideoThumbnail = (file, callback) => {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  video.preload = 'metadata';
  video.muted = true;
  video.playsInline = true;
  
  video.onloadedmetadata = () => {
    // Ir al segundo 1 o 10% del video
    video.currentTime = Math.min(1, video.duration * 0.1);
  };
  
  video.onseeked = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir canvas a Data URL
    const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
    callback(thumbnailUrl);
    
    // Limpiar
    URL.revokeObjectURL(video.src);
    video.remove();
    canvas.remove();
  };
  
  video.onerror = () => {
    callback(null);
    URL.revokeObjectURL(video.src);
    video.remove();
    canvas.remove();
  };
  
  video.src = URL.createObjectURL(file);
};

const getDimensions = (file, cb) => {
  if (file.type.startsWith('image/')) {
    const img = new Image(); 
    img.onload = () => cb(img.width, img.height); 
    img.src = URL.createObjectURL(file);
  } else if (file.type.startsWith('video/')) {
    const v = document.createElement('video'); 
    v.onloadedmetadata = () => {
      cb(v.videoWidth, v.videoHeight, v.duration);
      URL.revokeObjectURL(v.src);
    };
    v.src = URL.createObjectURL(file);
  } else if (file.type.startsWith('audio/')) {
    const a = document.createElement('audio'); 
    a.onloadedmetadata = () => {
      cb(null, null, a.duration);
      URL.revokeObjectURL(a.src);
    };
    a.src = URL.createObjectURL(file);
  }
};

/* ==================== ARCHIVOS ==================== */
const addFiles = (files, isPasted=false) => {
  let added = 0;
  Array.from(files).forEach(f => {
    const type = detectType(f);
    if (!type) return Notificacion(`${f.name} no es un formato válido`, 'error', 2000);
    const url = URL.createObjectURL(f);
    const mediaFile = { 
      id: Date.now()+Math.random(), 
      name: f.name, 
      type, 
      format: f.type, 
      size: f.size, 
      url, 
      isPasted, 
      addedAt: new Date().toISOString(),
      thumbnail: null // 🎬 Para almacenar el thumbnail
    };
    
    // 🎬 Generar thumbnail para videos
    if (type === 'VIDEO') {
      generateVideoThumbnail(f, (thumbUrl) => {
        mediaFile.thumbnail = thumbUrl;
        updateGallery();
        saveSession(false);
      });
    }
    
    getDimensions(f, (w,h,d) => { 
      if(w) mediaFile.width = w; 
      if(h) mediaFile.height = h; 
      if(d) mediaFile.duration = d; 
      updateGallery(); 
      saveSession(false); 
    });
    
    mediaFiles.push(mediaFile); 
    added++;
  });
  
  if (!added) return;
  Notificacion(isPasted ? 'Captura pegada' : `${added} archivo(s) agregado(s)`, 'success', 1500);
  updateGallery();
  playMedia(isPasted ? mediaFiles.length-1 : 0);
  saveSession(false);
};

/* ==================== PASTE ==================== */
const handlePaste = (e) => {
  const items = e.originalEvent?.clipboardData?.items; if (!items) return;
  let found = false;
  $.each(items, (_, item) => {
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile(); if (!blob) return true;
      addFiles([ new File([blob], `Captura_${pasteCount++}.png`, { type: blob.type }) ], true);
      found = true;
      $('#mediaZone').addClass('paste_flash'); setTimeout(()=>$('#mediaZone').removeClass('paste_flash'), 300);
      return false;
    }
  });
  if (!found) Notificacion('No se detectó imagen en portapapeles', 'error', 2000);
};

/* ==================== GALERÍA ==================== */
const updateGallery = () => {
  const g = $('#mediaGallery'); $('#mediaCount').text(mediaFiles.length);
  if (!mediaFiles.length) return g.html(`<div class="gallery_empty"><i class="fas fa-folder-open"></i><p>Sin archivos</p></div>`);
  
  g.html(mediaFiles.map((m,i)=>{
    let preview = '';
    
    // 🎬 VIDEO: Mostrar thumbnail si existe, sino icono
    if (m.type === 'VIDEO') {
      preview = m.thumbnail 
        ? `<img src="${m.thumbnail}" alt="${m.name}">`
        : `<i class="fas fa-video"></i>`;
    }
    // 🖼️ IMAGEN: Mostrar imagen
    else if (m.type === 'IMAGEN') {
      preview = `<img src="${m.url}" alt="${m.name}">`;
    }
    // 🎵 AUDIO: Mostrar icono
    else {
      preview = `<i class="fas fa-music"></i>`;
    }
    
    return `
      <div class="gallery_item ${i===currentIndex?'active':''}" data-i="${i}">
        <div class="item_preview ${m.type.toLowerCase()}">${preview}</div>
        <div class="item_info">
          <span class="item_name">${m.name}</span>
          <span class="item_details">${bytes(m.size)}${m.duration?` • ${formatTime(m.duration)}`:''}</span>
        </div>
        <span class="type_badge ${m.type.toLowerCase()}"><i class="fas ${m.type==='VIDEO'?'fa-video':m.type==='AUDIO'?'fa-music':'fa-image'}"></i></span>
        ${m.isPasted?'<span class="paste_badge"><i class="fas fa-paste"></i></span>':''}
        <button class="btn_del_mini" data-i="${i}"><i class="fas fa-times"></i></button>
      </div>
    `;
  }).join(''));
};

/* ==================== PLAY ==================== */
const playMedia = (i) => {
  if (i<0 || i>=mediaFiles.length) return;
  currentIndex=i; const media=mediaFiles[i]; currentType=media.type;
  $('.media_placeholder,.video_player,.audio_player,.image_player').addClass('dpn'); $('.media_info').removeClass('dpn');
  stopAllMedia();
  if (media.type==='VIDEO') playVideo(media);
  else if (media.type==='AUDIO') playAudio(media);
  else playImage(media);
  $('.media_name').text(media.name);
  updateGallery(); renderControls(media.type);
};

const playVideo = (m) => {
  $('.video_player').removeClass('dpn');
  const v=$('#videoPlayer')[0]; v.src=m.url; v.load(); v.play().catch(()=>{});
  $('.media_details').text(`${m.width}×${m.height} • ${bytes(m.size)} • ${formatTime(m.duration)}`); $('.info_timeline').removeClass('dpn');
  v.ontimeupdate=()=>{ $('.time_current').text(formatTime(v.currentTime)); $('.timeline_fill').css('width', `${(v.currentTime/v.duration)*100}%`); $('.time_total').text(formatTime(v.duration)); };
  v.onplay=()=>$('.btn_play i').attr('class','fas fa-pause'); v.onpause=()=>$('.btn_play i').attr('class','fas fa-play');
  v.onended=()=> isLooping ? (v.currentTime=0, v.play()) : nextMedia();
};

const playAudio = (m) => {
  $('.audio_player').removeClass('dpn');
  const a=$('#audioPlayer')[0]; a.src=m.url; a.load(); a.play().catch(()=>{});
  $('.media_details').text(`${bytes(m.size)} • ${formatTime(m.duration)}`); $('.info_timeline').removeClass('dpn');
  setupAudioVisualizer(a, '#audioWave');
  a.ontimeupdate=()=>{ $('.time_current').text(formatTime(a.currentTime)); $('.timeline_fill').css('width', `${(a.currentTime/a.duration)*100}%`); $('.time_total').text(formatTime(a.duration)); };
  a.onplay=()=>$('.btn_play i').attr('class','fas fa-pause'); a.onpause=()=>$('.btn_play i').attr('class','fas fa-play');
  a.onended=()=> isLooping ? (a.currentTime=0, a.play()) : nextMedia();
};

const playImage = (m) => {
  $('.image_player').removeClass('dpn');
  const img=$('#imageViewer')[0]; img.src=m.url; zoomLevel=1; $(img).css('transform','scale(1)');
  $('.media_details').text(`${m.width}×${m.height} • ${bytes(m.size)}${m.isPasted?' • Pegada':''}`); $('.info_timeline').addClass('dpn');
};

/* ==================== WEB AUDIO (única fuente) ==================== */
const setupAudioVisualizer = (el, canvasSel) => {
  waveCanvas = $(canvasSel)[0]; if (!waveCanvas) return;
  waveCtx = waveCanvas.getContext('2d'); waveCanvas.width = waveCanvas.offsetWidth; waveCanvas.height = waveCanvas.offsetHeight;

  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();

  if (!audioSource) {
    audioSource = audioContext.createMediaElementSource(el);
  }
  if (!analyser) {
    analyser = audioContext.createAnalyser(); analyser.fftSize = 256;
    audioSource.connect(analyser); analyser.connect(audioContext.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  if (animationId) cancelAnimationFrame(animationId);
  drawWave();
};

const drawWave = () => {
  animationId = requestAnimationFrame(drawWave);
  if (!analyser || !dataArray || !waveCtx || !waveCanvas) return;
  analyser.getByteFrequencyData(dataArray);
  waveCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg3');
  waveCtx.fillRect(0,0,waveCanvas.width,waveCanvas.height);
  const barW = (waveCanvas.width / dataArray.length) * 2.5; let x=0;
  for (let i=0;i<dataArray.length;i++){
    const h = (dataArray[i]/255)*waveCanvas.height;
    const g = waveCtx.createLinearGradient(0,waveCanvas.height,0,waveCanvas.height-h);
    g.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--mco'));
    g.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--bg2'));
    waveCtx.fillStyle = g;
    waveCtx.fillRect(x, waveCanvas.height - h, barW, h);
    x += barW + 1;
  }
};

/* ==================== CONTROLES UI ==================== */
const renderControls = (type) => {
  const c = $('#mediaControls');
  const common = `
    <button class="btn_control btn_prev"><i class="fas fa-step-backward"></i></button>
    <button class="btn_control btn_play"><i class="fas fa-play"></i></button>
    <button class="btn_control btn_next"><i class="fas fa-step-forward"></i></button>
  `;
  if (type==='VIDEO') c.html(`${common}
    <button class="btn_control btn_loop"><i class="fas fa-redo"></i></button>
    <button class="btn_control btn_speed">1x</button>
    <div class="volume_control">
      <button class="btn_control btn_volume"><i class="fas fa-volume-up"></i></button>
      <div class="volume_container"><div class="volume_bg"><div class="volume_fill"></div></div></div>
    </div>
    <button class="btn_control btn_pip"><i class="fas fa-clone"></i></button>
    <button class="btn_control btn_fullscreen"><i class="fas fa-expand"></i></button>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>
  `);
  else if (type==='AUDIO') c.html(`${common}
    <button class="btn_control btn_loop"><i class="fas fa-redo"></i></button>
    <button class="btn_control btn_speed">1x</button>
    <div class="volume_control">
      <button class="btn_control btn_volume"><i class="fas fa-volume-up"></i></button>
      <div class="volume_container"><div class="volume_bg"><div class="volume_fill"></div></div></div>
    </div>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>
  `);
  else c.html(`
    <button class="btn_control btn_prev"><i class="fas fa-chevron-left"></i></button>
    <button class="btn_control btn_next"><i class="fas fa-chevron-right"></i></button>
    <button class="btn_control btn_zoom_in_ctrl"><i class="fas fa-search-plus"></i></button>
    <button class="btn_control btn_zoom_out_ctrl"><i class="fas fa-search-minus"></i></button>
    <button class="btn_control btn_fullscreen"><i class="fas fa-expand"></i></button>
    <button class="btn_control btn_slideshow"><i class="fas fa-play-circle"></i></button>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>
  `);
  setTimeout(()=>$('.volume_fill').css('width','70%'),10);
};

const togglePlay = () => {
  const p = currentType==='VIDEO' ? $('#videoPlayer')[0] : $('#audioPlayer')[0]; if (!p) return;
  p.paused ? p.play() : p.pause();
};
const toggleLoop = () => { isLooping=!isLooping; $('.btn_loop').toggleClass('active',isLooping); Notificacion(`Loop ${isLooping?'activado':'desactivado'}`,'info',1500); };
const changeSpeed = () => {
  const speeds=[0.25,0.5,0.75,1,1.25,1.5,2,3]; currentSpeed = speeds[(speeds.indexOf(currentSpeed)+1)%speeds.length];
  const p = currentType==='VIDEO'?$('#videoPlayer')[0]:$('#audioPlayer')[0]; p.playbackRate=currentSpeed;
  $('.btn_speed').text(`${currentSpeed}x`); Notificacion(`Velocidad: ${currentSpeed}x`,'info',1500);
};
const changeVolume = () => {
  const vols=[0,25,50,70,100]; currentVolume = vols[(vols.indexOf(currentVolume)+1)%vols.length];
  const p = currentType==='VIDEO'?$('#videoPlayer')[0]:$('#audioPlayer')[0]; p.volume=currentVolume/100;
  $('.volume_fill').css('width', `${currentVolume}%`);
  $('.btn_volume i').attr('class', `fas ${currentVolume===0?'fa-volume-mute':currentVolume<50?'fa-volume-down':'fa-volume-up'}`);
  Notificacion(`Volumen: ${currentVolume}%`,'info',1500);
};
const togglePiP = async () => { const v=$('#videoPlayer')[0]; try{ document.pictureInPictureElement ? await document.exitPictureInPicture() : await v.requestPictureInPicture(); }catch{ Notificacion('PiP no disponible','error',2000);} };
const toggleFullscreen = () => { const c=$('.media_player:not(.dpn)')[0]; if(!document.fullscreenElement) c.requestFullscreen().catch(()=>{}); else document.exitFullscreen(); };
const downloadMedia = () => { if(!mediaFiles.length) return; const m=mediaFiles[currentIndex]; const a=document.createElement('a'); a.href=m.url; a.download=m.name; a.click(); Notificacion(`${m.name} descargado`,'success',1500); };
const zoom = (d) => { zoomLevel = d==='in'?Math.min(zoomLevel+0.25,5):d==='out'?Math.max(zoomLevel-0.25,0.5):1; $('#imageViewer').css('transform',`scale(${zoomLevel})`); };
const nextMedia = () => playMedia(currentIndex < mediaFiles.length-1 ? currentIndex+1 : 0);
const prevMedia = () => playMedia(currentIndex > 0 ? currentIndex-1 : mediaFiles.length-1);

/* ==================== SLIDESHOW ==================== */
const startSlideshow = () => {
  const imgs = mediaFiles.filter(m=>m.type==='IMAGEN'); if(!imgs.length) return Notificacion('No hay imágenes','error',2000);
  abrirModal('slideshowModal'); currentIndex = mediaFiles.indexOf(imgs[0]); updateSlide();
  slideshowInterval = setInterval(()=>{ const next = mediaFiles.slice(currentIndex+1).find(m=>m.type==='IMAGEN'); currentIndex = next? mediaFiles.indexOf(next) : mediaFiles.indexOf(imgs[0]); updateSlide(); },3000);
};
const updateSlide = () => {
  const m=mediaFiles[currentIndex]; $('#slideshowImage')[0].src=m.url;
  const total=mediaFiles.filter(x=>x.type==='IMAGEN').length;
  const idx=mediaFiles.slice(0,currentIndex+1).filter(x=>x.type==='IMAGEN').length;
  $('#slideCounter').text(`${idx} / ${total}`);
};

/* ==================== SESSION ==================== */
const saveSession = (notify=true) => {
  savels('mediawii_files', mediaFiles.map(m=>({
    name:m.name,type:m.type,format:m.format,size:m.size,width:m.width,height:m.height,duration:m.duration,isPasted:m.isPasted,thumbnail:m.thumbnail
  })), 720);
  if (notify) Notificacion('Sesión guardada','success',1500);
};
const loadSession = () => {
  const s=getls('mediawii_files');
  if (s?.length) { 
    console.log(`✅ ${s.length} archivo(s) cargados de la sesión anterior`); 
    Notificacion(`Sesión anterior: ${s.length} archivos`,'info',2000); 
  }
};

/* ==================== STOP / CLEAN ==================== */
const stopAllMedia = () => {
  const v=$('#videoPlayer')[0], a=$('#audioPlayer')[0];
  if (v){ v.pause(); v.currentTime=0; }
  if (a){ a.pause(); a.currentTime=0; }
  if (animationId) cancelAnimationFrame(animationId);
  animationId=null;
};

const openFile = () => {
  const input=$('<input type="file" accept="video/*,audio/*,image/*" multiple style="display:none">');
  input.on('change',function(){ if(this.files.length) addFiles(this.files); input.remove(); });
  $('body').append(input); input.click();
};

/* ==================== INIT ==================== */
export const init = () => {
  $('#mediaZone')
    .on('dblclick', openFile)
    .on('dragover', e=>{e.preventDefault(); $('#mediaZone').addClass('dragover');})
    .on('dragleave', ()=>$('#mediaZone').removeClass('dragover'))
    .on('drop', e=>{e.preventDefault(); $('#mediaZone').removeClass('dragover'); const f=e.originalEvent.dataTransfer?.files; if(f?.length) addFiles(f);});

  $(document).on('paste', handlePaste);
  $('.btn_add').on('click', openFile);
  $('.btn_clear').on('click', () => {
    if(!mediaFiles.length) return;
    mediaFiles.forEach(m=>URL.revokeObjectURL(m.url));
    mediaFiles=[]; currentIndex=0; pasteCount=1; stopAllMedia();
    $('.media_placeholder').removeClass('dpn'); $('.media_info').addClass('dpn');
    updateGallery(); saveSession(false); Notificacion('Todo limpiado','success',1500);
  });
  $('.btn_reload').on('click', ()=>{ loadSession(); updateGallery(); });

  $(document).on('click', '.btn_play', togglePlay);
  $(document).on('click', '.btn_prev', prevMedia);
  $(document).on('click', '.btn_next', nextMedia);
  $(document).on('click', '.btn_loop', toggleLoop);
  $(document).on('click', '.btn_speed', changeSpeed);
  $(document).on('click', '.btn_volume', changeVolume);
  $(document).on('click', '.btn_pip', togglePiP);
  $(document).on('click', '.btn_fullscreen', toggleFullscreen);
  $(document).on('click', '.btn_download', downloadMedia);
  $(document).on('click', '.btn_zoom_in, .btn_zoom_in_ctrl', ()=>zoom('in'));
  $(document).on('click', '.btn_zoom_out, .btn_zoom_out_ctrl', ()=>zoom('out'));
  $(document).on('click', '.btn_zoom_reset', ()=>zoom('reset'));
  $(document).on('click', '.btn_slideshow', startSlideshow);

  $(document).on('click', '.timeline_container', function(e){
    const p = currentType==='VIDEO'?$('#videoPlayer')[0]:$('#audioPlayer')[0];
    p.currentTime = (e.offsetX / $(this).width()) * p.duration;
  });
  $(document).on('click', '.volume_container', function(e){
    const p = currentType==='VIDEO'?$('#videoPlayer')[0]:$('#audioPlayer')[0];
    currentVolume = Math.round((e.offsetX/$(this).width())*100);
    p.volume = currentVolume/100; $('.volume_fill').css('width', `${currentVolume}%`);
  });

  $(document).on('click', '.gallery_item', function(){ playMedia(parseInt($(this).data('i'))); });
  $(document).on('click', '.btn_del_mini', function(e){
    e.stopPropagation(); const i=parseInt($(this).data('i')); URL.revokeObjectURL(mediaFiles[i].url); mediaFiles.splice(i,1);
    if (mediaFiles.length) {
      if (i===currentIndex) playMedia(Math.min(i, mediaFiles.length-1)); else if (i<currentIndex) currentIndex--;
    } else { stopAllMedia(); $('.media_placeholder').removeClass('dpn'); $('.media_info').addClass('dpn'); }
    updateGallery(); saveSession(false);
  });

  $('.btn_slide_prev').on('click', prevMedia);
  $('.btn_slide_next').on('click', nextMedia);
  $('.btn_slide_play').on('click', ()=>{ if(slideshowInterval){clearInterval(slideshowInterval); slideshowInterval=null; $('.btn_slide_play i').attr('class','fas fa-play');} else startSlideshow(); });
  $('.modalX').on('click', ()=>{ if(slideshowInterval) clearInterval(slideshowInterval); cerrarModal('slideshowModal'); });

  $(document).on('keydown', (e)=>{
    if(!mediaFiles.length) return;
    if ([' ','ArrowLeft','ArrowRight','f','F','+','=','-','0'].includes(e.key)) e.preventDefault();
    if (e.key===' ' && currentType!=='IMAGEN') togglePlay();
    if (e.key==='ArrowLeft') prevMedia();
    if (e.key==='ArrowRight') nextMedia();
    if (e.key==='f'||e.key==='F') toggleFullscreen();
    if (e.key==='+'||e.key==='=') currentType==='IMAGEN' && zoom('in');
    if (e.key==='-') currentType==='IMAGEN' && zoom('out');
    if (e.key==='0') currentType==='IMAGEN' && zoom('reset');
  });

  loadSession();
  console.log('✅ Centro Multimedia cargado');
};

export const cleanup = () => {
  stopAllMedia();
  mediaFiles.forEach(m=>URL.revokeObjectURL(m.url));
  mediaFiles=[];
  if (audioContext){ audioContext.close(); audioContext=null; }
  $('#mediaZone, .btn_add, .btn_clear, .btn_reload, .modalX').off();
  $(document).off('click'); $(document).off('paste'); $(document).off('keydown');
  console.log('🧹 Centro Multimedia limpiado');
};
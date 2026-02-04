import{j as M}from"./vendor-gzd0YkcT.js";import{N as p}from"./main-D7tVh7M4.js";import"./main-CLK08isc.js";const q=()=>`
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
`,t=M;let n=[],d=0;const S=["video/mp4","video/webm","video/ogg"],l=()=>({zona:t("#videoZone"),placeholder:t(".video_placeholder"),player:t(".video_player"),video:t("#mainVideo")[0],controles:t(".video_controls"),lista:t("#videoList"),progressBar:t(".progress_bar_fill"),progressContainer:t(".progress_bar_container"),volumeBar:t(".volume_bar_fill"),volumeContainer:t(".volume_bar_container"),btnPlay:t(".btn_play"),btnPlayBig:t(".btn_play_big"),btnPrev:t(".btn_prev"),btnNext:t(".btn_next"),btnLoop:t(".btn_loop"),btnVolume:t(".btn_volume"),btnSpeed:t(".btn_speed"),btnFullscreen:t(".btn_fullscreen"),timeCurrent:t(".time_current"),timeDuration:t(".time_duration"),overlay:t(".video_overlay")}),L=e=>{if(!isFinite(e))return"00:00";const s=Math.floor(e/60),o=Math.floor(e%60);return`${String(s).padStart(2,"0")}:${String(o).padStart(2,"0")}`},T=e=>{if(e===0)return"0 B";const s=1024,o=["B","KB","MB","GB"],i=Math.floor(Math.log(e)/Math.log(s));return`${(e/Math.pow(s,i)).toFixed(1)} ${o[i]}`},f=()=>{const{lista:e}=l();if(n.length===0){e.html(`
      <div class="list_empty">
        <i class="fas fa-folder-open"></i>
        <p>No hay videos</p>
        <small>Arrastra o agrega videos</small>
      </div>
    `);return}const s=n.map((o,i)=>`
    <div class="video_item ${i===d?"active":""}" data-index="${i}">
      <div class="item_info">
        <i class="fas fa-film"></i>
        <div class="item_text">
          <span class="item_name" title="${o.name}">${o.name}</span>
          <span class="item_size">${T(o.size)}</span>
        </div>
      </div>
      <button class="btn_delete" data-index="${i}" title="Eliminar">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join("");e.html(s)},w=e=>{const s=Array.from(e);let o=0;s.forEach(i=>{if(!S.includes(i.type)){p(`${i.name} no es un formato válido`,"error",2e3);return}const a=URL.createObjectURL(i);n.push({name:i.name,size:i.size,url:a,type:i.type}),o++}),o>0&&(p(`${o} video${o>1?"s":""} agregado${o>1?"s":""}`,"success",2e3),f(),n.length===o&&v(0))},v=e=>{if(e<0||e>=n.length)return;const{placeholder:s,player:o,video:i,controles:a,zona:u}=l(),m=n[e];d=e,s.addClass("dpn"),o.removeClass("dpn"),a.removeClass("dpn"),u.addClass("playing"),i.src=m.url,i.play().catch(()=>{}),f()},k=()=>{const{video:e,btnPlay:s,btnPlayBig:o}=l();e.paused?(e.play(),s.html('<i class="fas fa-pause"></i>'),o.html('<i class="fas fa-pause"></i>')):(e.pause(),s.html('<i class="fas fa-play"></i>'),o.html('<i class="fas fa-play"></i>'))},z=()=>{d<n.length-1?v(d+1):v(0)},D=()=>{d>0?v(d-1):v(n.length-1)},j=()=>{const{video:e,btnLoop:s}=l();e.loop=!e.loop,s.toggleClass("active",e.loop),p(e.loop?"Loop activado":"Loop desactivado","info",1500)},E=()=>{const{video:e,btnSpeed:s}=l(),o=[.5,1,1.5,2],i=o.indexOf(e.playbackRate),a=o[(i+1)%o.length];e.playbackRate=a,s.text(`${a}x`),p(`Velocidad: ${a}x`,"info",1500)},x=()=>{const{player:e}=l();document.fullscreenElement?document.exitFullscreen():e[0].requestFullscreen().catch(()=>{p("Pantalla completa no disponible","error",2e3)})},$=()=>{const e=t('<input type="file" accept="video/mp4,video/webm,video/ogg" multiple style="display:none;">');e.on("change",function(){this.files.length>0&&w(this.files),e.remove()}),t("body").append(e),e.click()},F=e=>{e.preventDefault(),l().zona.addClass("dragover")},O=()=>{l().zona.removeClass("dragover")},U=e=>{e.preventDefault(),l().zona.removeClass("dragover");const s=e.originalEvent.dataTransfer?.files;s?.length&&w(s)},N=()=>{const{video:e,progressBar:s,timeCurrent:o,timeDuration:i,btnPlay:a,btnPlayBig:u,overlay:m}=l();t(e).on("timeupdate",()=>{if(e.duration){const b=e.currentTime/e.duration*100;s.css("width",`${b}%`),o.text(L(e.currentTime))}}),t(e).on("loadedmetadata",()=>{i.text(L(e.duration))}),t(e).on("play",()=>{a.html('<i class="fas fa-pause"></i>'),u.html('<i class="fas fa-pause"></i>'),m.addClass("hide")}),t(e).on("pause",()=>{a.html('<i class="fas fa-play"></i>'),u.html('<i class="fas fa-play"></i>'),m.removeClass("hide")}),t(e).on("ended",()=>{e.loop||z()})},X=()=>{const{zona:e,progressContainer:s,volumeContainer:o,volumeBar:i,video:a,btnPlay:u,btnPlayBig:m,btnPrev:b,btnNext:P,btnLoop:V,btnVolume:_,btnSpeed:A,btnFullscreen:R,lista:C}=l();a.volume=.7,i.css("width","70%"),e.on("dblclick",$).on("dragover",F).on("dragleave",O).on("drop",U),u.on("click",k),m.on("click",k),b.on("click",D),P.on("click",z),V.on("click",j),A.on("click",E),R.on("click",x),_.on("click",()=>{a.muted=!a.muted,_.html(a.muted?'<i class="fas fa-volume-mute"></i>':'<i class="fas fa-volume-up"></i>')}),o.on("click",function(r){const c=r.offsetX/t(this).width();a.volume=c,a.muted=!1,i.css("width",`${c*100}%`),_.html('<i class="fas fa-volume-up"></i>')}),s.on("click",function(r){const c=r.offsetX/t(this).width();a.currentTime=c*a.duration}),C.on("click",".video_item",function(){const r=parseInt(t(this).data("index"));v(r)}),C.on("click",".btn_delete",function(r){r.stopPropagation();const c=parseInt(t(this).data("index"));if(URL.revokeObjectURL(n[c].url),n.splice(c,1),c===d&&n.length>0)d=Math.min(c,n.length-1),v(d);else if(n.length===0){const{placeholder:g,player:h,controles:y,zona:B}=l();h.addClass("dpn"),g.removeClass("dpn"),y.addClass("dpn"),B.removeClass("playing"),a.src=""}else c<d&&d--;f(),p("Video eliminado","success",1500)}),t(".btn_add").on("click",$),t(".btn_clear_all").on("click",()=>{if(n.length===0)return;n.forEach(y=>URL.revokeObjectURL(y.url)),n=[],d=0;const{placeholder:r,player:c,controles:g,zona:h}=l();c.addClass("dpn"),r.removeClass("dpn"),g.addClass("dpn"),h.removeClass("playing"),a.src="",f(),p("Todos los videos eliminados","success",2e3)}),N(),t(document).on("keydown",r=>{if(n.length!==0)switch(r.key){case" ":r.preventDefault(),k();break;case"ArrowLeft":a.currentTime-=5;break;case"ArrowRight":a.currentTime+=5;break;case"ArrowUp":a.volume=Math.min(1,a.volume+.1),i.css("width",`${a.volume*100}%`);break;case"ArrowDown":a.volume=Math.max(0,a.volume-.1),i.css("width",`${a.volume*100}%`);break;case"f":x();break}}),console.log("✅ Reproductor de videos cargado")},H=()=>{["#videoZone",".btn_play",".btn_play_big",".btn_prev",".btn_next",".btn_loop",".btn_volume",".btn_speed",".btn_fullscreen",".progress_bar_container",".volume_bar_container","#videoList",".btn_add",".btn_clear_all"].forEach(o=>t(o).off()),t(document).off("keydown");const{video:s}=l();t(s).off(),s.pause(),s.src="",console.log("🧹 Reproductor limpiado")};export{H as cleanup,X as init,q as render};

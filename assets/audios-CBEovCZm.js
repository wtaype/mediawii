import{j as W}from"./vendor-gzd0YkcT.js";import{N as u}from"./main-CrwO8EL-.js";import"./main-7g0wFfK8.js";const Q=()=>`
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
`,a=W;let n=[],l=0,p=!1;const F=["audio/mpeg","audio/mp3","audio/wav","audio/ogg","audio/mp4","audio/m4a"],t=new Audio;let r,f,R,x,L,g;const T=o=>{if(!isFinite(o))return"00:00";const e=Math.floor(o/60),i=Math.floor(o%60);return`${String(e).padStart(2,"0")}:${String(i).padStart(2,"0")}`},E=o=>{if(o===0)return"0 B";const e=1024,i=["B","KB","MB","GB"],s=Math.floor(Math.log(o)/Math.log(e));return`${(o/Math.pow(e,s)).toFixed(1)} ${i[s]}`},Z=()=>{r||(r=new(window.AudioContext||window.webkitAudioContext),f=r.createAnalyser(),f.fftSize=128,R=r.createMediaElementSource(t),R.connect(f),f.connect(r.destination),L=f.frequencyBinCount,x=new Uint8Array(L))},M=()=>{const o=a("#audioWaves")[0];if(!o)return;const e=o.getContext("2d"),i=o.width,s=o.height;f.getByteFrequencyData(x),e.clearRect(0,0,i,s);const d=40,k=i/d,S=k*.2,$=k-S,C=getComputedStyle(document.documentElement).getPropertyValue("--mco").trim();for(let m=0;m<d;m++){const D=Math.floor(m/d*L),v=x[D]/255*s*.8,_=m*k+S/2,b=(s-v)/2,h=e.createLinearGradient(_,b,_,b+v);h.addColorStop(0,C),h.addColorStop(.5,C+"cc"),h.addColorStop(1,C+"66"),e.fillStyle=h,e.fillRect(_,b,$,v),e.fillStyle="rgba(255, 255, 255, 0.2)",e.fillRect(_,b,$,Math.min(v*.3,3))}g=requestAnimationFrame(M)},y=()=>{g&&(cancelAnimationFrame(g),g=null);const o=a("#audioWaves")[0];o&&o.getContext("2d").clearRect(0,0,o.width,o.height)},w=()=>{const o=a("#audioList");if(n.length===0){o.html(`
      <div class="list_empty">
        <i class="fas fa-folder-open"></i>
        <p>No hay audios</p>
        <small>Arrastra o agrega audios</small>
      </div>
    `);return}const e=n.map((i,s)=>`
    <div class="audio_item ${s===l?"active":""}" data-index="${s}">
      <div class="item_info">
        <i class="fas fa-music"></i>
        <div class="item_text">
          <span class="item_name" title="${i.name}">${i.name}</span>
          <span class="item_size">${E(i.size)}</span>
        </div>
      </div>
      <button class="btn_delete" data-index="${s}" title="Eliminar">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join("");o.html(e)},j=o=>{const e=Array.from(o);let i=0;e.forEach(s=>{if(!F.includes(s.type)){u(`${s.name} no es un formato válido`,"error",2e3);return}const d=URL.createObjectURL(s);n.push({name:s.name,size:s.size,url:d,type:s.type}),i++}),i>0&&(u(`${i} audio${i>1?"s":""} agregado${i>1?"s":""}`,"success",2e3),w(),n.length===i&&c(0))},c=o=>{if(o<0||o>=n.length)return;const e=n[o];l=o,a(".audio_placeholder").addClass("dpn"),a(".audio_player").removeClass("dpn"),a(".audio_controls").removeClass("dpn"),a("#audioZone").addClass("playing");const i=a("#audioWaves")[0];i.width=i.offsetWidth,i.height=i.offsetHeight,Z(),t.src=e.url,t.play().then(()=>{r.resume(),M()}).catch(d=>{console.error("Error al reproducir:",d),u("Error al reproducir audio","error",2e3)});const s=e.name.replace(/\.[^/.]+$/,"");a(".audio_title").text(s),a(".audio_artist").text("Desconocido"),w()},A=()=>{t.paused?(t.play().then(()=>{r&&r.resume(),M()}),a(".btn_play").html('<i class="fas fa-pause"></i>'),a(".btn_play_waves").html('<i class="fas fa-pause"></i>'),a("#wavesOverlay").addClass("hide")):(t.pause(),y(),a(".btn_play").html('<i class="fas fa-play"></i>'),a(".btn_play_waves").html('<i class="fas fa-play"></i>'),a("#wavesOverlay").removeClass("hide"))},z=()=>{if(p&&n.length>1){let o;do o=Math.floor(Math.random()*n.length);while(o===l);c(o)}else l<n.length-1?c(l+1):c(0)},B=()=>{l>0?c(l-1):c(n.length-1)},U=()=>{t.loop=!t.loop,a(".btn_loop").toggleClass("active",t.loop),u(t.loop?"Loop activado":"Loop desactivado","info",1500)},I=()=>{p=!p,a(".btn_shuffle").toggleClass("active",p),u(p?"Aleatorio activado":"Aleatorio desactivado","info",1500)},O=()=>{const o=a('<input type="file" accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a" multiple style="display:none;">');o.on("change",function(){this.files.length>0&&j(this.files),o.remove()}),a("body").append(o),o.click()},G=o=>{o.preventDefault(),a("#audioZone").addClass("dragover")},P=()=>{a("#audioZone").removeClass("dragover")},q=o=>{o.preventDefault(),a("#audioZone").removeClass("dragover");const e=o.originalEvent.dataTransfer?.files;e?.length&&j(e)},H=()=>{a(t).on("timeupdate",()=>{if(t.duration&&isFinite(t.duration)){const o=t.currentTime/t.duration*100;a(".progress_bar_fill").css("width",`${o}%`),a(".time_current").text(T(t.currentTime))}}),a(t).on("loadedmetadata",()=>{a(".time_duration").text(T(t.duration))}),a(t).on("play",()=>{a(".btn_play").html('<i class="fas fa-pause"></i>'),a(".btn_play_waves").html('<i class="fas fa-pause"></i>'),a("#wavesOverlay").addClass("hide")}),a(t).on("pause",()=>{a(".btn_play").html('<i class="fas fa-play"></i>'),a(".btn_play_waves").html('<i class="fas fa-play"></i>'),a("#wavesOverlay").removeClass("hide")}),a(t).on("ended",()=>{t.loop||z()})},J=()=>{t.volume=.7,a(".volume_bar_fill").css("width","70%");const o=()=>{const e=a("#audioWaves")[0];e&&!e.classList?.contains?.("dpn")&&(e.width=e.offsetWidth,e.height=e.offsetHeight)};a(window).on("resize",o),a("#audioZone").on("dblclick",O).on("dragover",G).on("dragleave",P).on("drop",q),a(".btn_play").on("click",A),a(".btn_play_waves").on("click",A),a(".btn_prev").on("click",B),a(".btn_next").on("click",z),a(".btn_loop").on("click",U),a(".btn_shuffle").on("click",I),a(".btn_volume").on("click",()=>{t.muted=!t.muted,a(".btn_volume").html(t.muted?'<i class="fas fa-volume-mute"></i>':'<i class="fas fa-volume-up"></i>')}),a(".volume_bar_container").on("click",function(e){const i=e.offsetX/a(this).width();t.volume=i,t.muted=!1,a(".volume_bar_fill").css("width",`${i*100}%`),a(".btn_volume").html('<i class="fas fa-volume-up"></i>')}),a(".progress_bar_container").on("click",function(e){if(!t.duration||!isFinite(t.duration))return;const i=e.offsetX/a(this).width();t.currentTime=i*t.duration}),a(document).on("click",".audio_item",function(){const e=parseInt(a(this).data("index"));c(e)}),a(document).on("click",".btn_delete",function(e){e.stopPropagation();const i=parseInt(a(this).data("index"));URL.revokeObjectURL(n[i].url),n.splice(i,1),i===l&&n.length>0?(l=Math.min(i,n.length-1),c(l)):n.length===0?(a(".audio_player").addClass("dpn"),a(".audio_placeholder").removeClass("dpn"),a(".audio_controls").addClass("dpn"),a("#audioZone").removeClass("playing"),t.src="",y()):i<l&&l--,w(),u("Audio eliminado","success",1500)}),a(".btn_add").on("click",O),a(".btn_clear_all").on("click",()=>{n.length!==0&&(n.forEach(e=>URL.revokeObjectURL(e.url)),n=[],l=0,a(".audio_player").addClass("dpn"),a(".audio_placeholder").removeClass("dpn"),a(".audio_controls").addClass("dpn"),a("#audioZone").removeClass("playing"),t.src="",y(),w(),u("Todos los audios eliminados","success",2e3))}),H(),a(document).on("keydown",e=>{if(n.length!==0)switch(e.key){case" ":e.preventDefault(),A();break;case"ArrowLeft":t.duration&&isFinite(t.duration)&&(t.currentTime=Math.max(0,t.currentTime-5));break;case"ArrowRight":t.duration&&isFinite(t.duration)&&(t.currentTime=Math.min(t.duration,t.currentTime+5));break;case"ArrowUp":t.volume=Math.min(1,t.volume+.1),a(".volume_bar_fill").css("width",`${t.volume*100}%`);break;case"ArrowDown":t.volume=Math.max(0,t.volume-.1),a(".volume_bar_fill").css("width",`${t.volume*100}%`);break}}),console.log("✅ Reproductor de audios cargado")},Y=()=>{a("#audioZone, .btn_play, .btn_play_waves, .btn_prev, .btn_next, .btn_loop, .btn_shuffle, .btn_volume, .progress_bar_container, .volume_bar_container, .btn_add, .btn_clear_all").off(),a(document).off("click",".audio_item"),a(document).off("click",".btn_delete"),a(document).off("keydown"),a(window).off("resize"),a(t).off(),t.pause(),t.src="",y(),r&&(r.close(),r=null),console.log("🧹 Reproductor de audios limpiado")};export{Y as cleanup,J as init,Q as render};

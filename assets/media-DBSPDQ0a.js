import{j as a}from"./vendor-gzd0YkcT.js";import{N as d,c as B,s as q,g as X,a as H}from"./main-CrwO8EL-.js";import"./main-7g0wFfK8.js";const fe=()=>`
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
`;let n=[],s=0,m=null,W=1,x=1,w=!1,$=1,r=70,g=null,u=null,f=null,y=null,P=null,l=null,v=null,k=null;const L=e=>e?`${(e/1024**Math.floor(Math.log(e)/Math.log(1024))).toFixed(1)} ${["B","KB","MB"][Math.floor(Math.log(e)/Math.log(1024))]}`:"0 B",_=(e=0)=>`${String(Math.floor(e/60)).padStart(2,"0")}:${String(Math.floor(e%60)).padStart(2,"0")}`,R={VIDEO:["video/mp4","video/webm","video/ogg"],AUDIO:["audio/mp3","audio/mpeg","audio/wav","audio/m4a","audio/ogg"],IMAGEN:["image/jpeg","image/jpg","image/png","image/gif","image/webp","image/svg+xml"]},K=e=>R.VIDEO.includes(e.type)?"VIDEO":R.AUDIO.includes(e.type)?"AUDIO":R.IMAGEN.includes(e.type)?"IMAGEN":null,Q=(e,t)=>{const i=document.createElement("video"),o=document.createElement("canvas"),c=o.getContext("2d");i.preload="metadata",i.muted=!0,i.playsInline=!0,i.onloadedmetadata=()=>{i.currentTime=Math.min(1,i.duration*.1)},i.onseeked=()=>{o.width=i.videoWidth,o.height=i.videoHeight,c.drawImage(i,0,0,o.width,o.height);const p=o.toDataURL("image/jpeg",.7);t(p),URL.revokeObjectURL(i.src),i.remove(),o.remove()},i.onerror=()=>{t(null),URL.revokeObjectURL(i.src),i.remove(),o.remove()},i.src=URL.createObjectURL(e)},J=(e,t)=>{if(e.type.startsWith("image/")){const i=new Image;i.onload=()=>t(i.width,i.height),i.src=URL.createObjectURL(e)}else if(e.type.startsWith("video/")){const i=document.createElement("video");i.onloadedmetadata=()=>{t(i.videoWidth,i.videoHeight,i.duration),URL.revokeObjectURL(i.src)},i.src=URL.createObjectURL(e)}else if(e.type.startsWith("audio/")){const i=document.createElement("audio");i.onloadedmetadata=()=>{t(null,null,i.duration),URL.revokeObjectURL(i.src)},i.src=URL.createObjectURL(e)}},D=(e,t=!1)=>{let i=0;Array.from(e).forEach(o=>{const c=K(o);if(!c)return d(`${o.name} no es un formato válido`,"error",2e3);const p=URL.createObjectURL(o),I={id:Date.now()+Math.random(),name:o.name,type:c,format:o.type,size:o.size,url:p,isPasted:t,addedAt:new Date().toISOString(),thumbnail:null};c==="VIDEO"&&Q(o,A=>{I.thumbnail=A,b(),M(!1)}),J(o,(A,S,V)=>{A&&(I.width=A),S&&(I.height=S),V&&(I.duration=V),b(),M(!1)}),n.push(I),i++}),i&&(d(t?"Captura pegada":`${i} archivo(s) agregado(s)`,"success",1500),b(),E(t?n.length-1:0),M(!1))},Y=e=>{const t=e.originalEvent?.clipboardData?.items;if(!t)return;let i=!1;a.each(t,(o,c)=>{if(c.type.startsWith("image/")){const p=c.getAsFile();return p?(D([new File([p],`Captura_${W++}.png`,{type:p.type})],!0),i=!0,a("#mediaZone").addClass("paste_flash"),setTimeout(()=>a("#mediaZone").removeClass("paste_flash"),300),!1):!0}}),i||d("No se detectó imagen en portapapeles","error",2e3)},b=()=>{const e=a("#mediaGallery");if(a("#mediaCount").text(n.length),!n.length)return e.html('<div class="gallery_empty"><i class="fas fa-folder-open"></i><p>Sin archivos</p></div>');e.html(n.map((t,i)=>{let o="";return t.type==="VIDEO"?o=t.thumbnail?`<img src="${t.thumbnail}" alt="${t.name}">`:'<i class="fas fa-video"></i>':t.type==="IMAGEN"?o=`<img src="${t.url}" alt="${t.name}">`:o='<i class="fas fa-music"></i>',`
      <div class="gallery_item ${i===s?"active":""}" data-i="${i}">
        <div class="item_preview ${t.type.toLowerCase()}">${o}</div>
        <div class="item_info">
          <span class="item_name">${t.name}</span>
          <span class="item_details">${L(t.size)}${t.duration?` • ${_(t.duration)}`:""}</span>
        </div>
        <span class="type_badge ${t.type.toLowerCase()}"><i class="fas ${t.type==="VIDEO"?"fa-video":t.type==="AUDIO"?"fa-music":"fa-image"}"></i></span>
        ${t.isPasted?'<span class="paste_badge"><i class="fas fa-paste"></i></span>':""}
        <button class="btn_del_mini" data-i="${i}"><i class="fas fa-times"></i></button>
      </div>
    `}).join(""))},E=e=>{if(e<0||e>=n.length)return;s=e;const t=n[e];m=t.type,a(".media_placeholder,.video_player,.audio_player,.image_player").addClass("dpn"),a(".media_info").removeClass("dpn"),O(),t.type==="VIDEO"?ee(t):t.type==="AUDIO"?te(t):ae(t),a(".media_name").text(t.name),b(),oe(t.type)},ee=e=>{a(".video_player").removeClass("dpn");const t=a("#videoPlayer")[0];t.src=e.url,t.load(),t.play().catch(()=>{}),a(".media_details").text(`${e.width}×${e.height} • ${L(e.size)} • ${_(e.duration)}`),a(".info_timeline").removeClass("dpn"),t.ontimeupdate=()=>{a(".time_current").text(_(t.currentTime)),a(".timeline_fill").css("width",`${t.currentTime/t.duration*100}%`),a(".time_total").text(_(t.duration))},t.onplay=()=>a(".btn_play i").attr("class","fas fa-pause"),t.onpause=()=>a(".btn_play i").attr("class","fas fa-play"),t.onended=()=>w?(t.currentTime=0,t.play()):C()},te=e=>{a(".audio_player").removeClass("dpn");const t=a("#audioPlayer")[0];t.src=e.url,t.load(),t.play().catch(()=>{}),a(".media_details").text(`${L(e.size)} • ${_(e.duration)}`),a(".info_timeline").removeClass("dpn"),ie(t,"#audioWave"),t.ontimeupdate=()=>{a(".time_current").text(_(t.currentTime)),a(".timeline_fill").css("width",`${t.currentTime/t.duration*100}%`),a(".time_total").text(_(t.duration))},t.onplay=()=>a(".btn_play i").attr("class","fas fa-pause"),t.onpause=()=>a(".btn_play i").attr("class","fas fa-play"),t.onended=()=>w?(t.currentTime=0,t.play()):C()},ae=e=>{a(".image_player").removeClass("dpn");const t=a("#imageViewer")[0];t.src=e.url,x=1,a(t).css("transform","scale(1)"),a(".media_details").text(`${e.width}×${e.height} • ${L(e.size)}${e.isPasted?" • Pegada":""}`),a(".info_timeline").addClass("dpn")},ie=(e,t)=>{l=a(t)[0],l&&(v=l.getContext("2d"),l.width=l.offsetWidth,l.height=l.offsetHeight,u||(u=new(window.AudioContext||window.webkitAudioContext)),u.state==="suspended"&&u.resume(),P||(P=u.createMediaElementSource(e)),f||(f=u.createAnalyser(),f.fftSize=256,P.connect(f),f.connect(u.destination),y=new Uint8Array(f.frequencyBinCount)),k&&cancelAnimationFrame(k),Z())},Z=()=>{if(k=requestAnimationFrame(Z),!f||!y||!v||!l)return;f.getByteFrequencyData(y),v.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--bg3"),v.fillRect(0,0,l.width,l.height);const e=l.width/y.length*2.5;let t=0;for(let i=0;i<y.length;i++){const o=y[i]/255*l.height,c=v.createLinearGradient(0,l.height,0,l.height-o);c.addColorStop(0,getComputedStyle(document.documentElement).getPropertyValue("--mco")),c.addColorStop(1,getComputedStyle(document.documentElement).getPropertyValue("--bg2")),v.fillStyle=c,v.fillRect(t,l.height-o,e,o),t+=e+1}},oe=e=>{const t=a("#mediaControls"),i=`
    <button class="btn_control btn_prev"><i class="fas fa-step-backward"></i></button>
    <button class="btn_control btn_play"><i class="fas fa-play"></i></button>
    <button class="btn_control btn_next"><i class="fas fa-step-forward"></i></button>
  `;e==="VIDEO"?t.html(`${i}
    <button class="btn_control btn_loop"><i class="fas fa-redo"></i></button>
    <button class="btn_control btn_speed">1x</button>
    <div class="volume_control">
      <button class="btn_control btn_volume"><i class="fas fa-volume-up"></i></button>
      <div class="volume_container"><div class="volume_bg"><div class="volume_fill"></div></div></div>
    </div>
    <button class="btn_control btn_pip"><i class="fas fa-clone"></i></button>
    <button class="btn_control btn_fullscreen"><i class="fas fa-expand"></i></button>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>
  `):e==="AUDIO"?t.html(`${i}
    <button class="btn_control btn_loop"><i class="fas fa-redo"></i></button>
    <button class="btn_control btn_speed">1x</button>
    <div class="volume_control">
      <button class="btn_control btn_volume"><i class="fas fa-volume-up"></i></button>
      <div class="volume_container"><div class="volume_bg"><div class="volume_fill"></div></div></div>
    </div>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>
  `):t.html(`
    <button class="btn_control btn_prev"><i class="fas fa-chevron-left"></i></button>
    <button class="btn_control btn_next"><i class="fas fa-chevron-right"></i></button>
    <button class="btn_control btn_zoom_in_ctrl"><i class="fas fa-search-plus"></i></button>
    <button class="btn_control btn_zoom_out_ctrl"><i class="fas fa-search-minus"></i></button>
    <button class="btn_control btn_fullscreen"><i class="fas fa-expand"></i></button>
    <button class="btn_control btn_slideshow"><i class="fas fa-play-circle"></i></button>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>
  `),setTimeout(()=>a(".volume_fill").css("width","70%"),10)},z=()=>{const e=m==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];e&&(e.paused?e.play():e.pause())},ne=()=>{w=!w,a(".btn_loop").toggleClass("active",w),d(`Loop ${w?"activado":"desactivado"}`,"info",1500)},se=()=>{const e=[.25,.5,.75,1,1.25,1.5,2,3];$=e[(e.indexOf($)+1)%e.length];const t=m==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.playbackRate=$,a(".btn_speed").text(`${$}x`),d(`Velocidad: ${$}x`,"info",1500)},le=()=>{const e=[0,25,50,70,100];r=e[(e.indexOf(r)+1)%e.length];const t=m==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.volume=r/100,a(".volume_fill").css("width",`${r}%`),a(".btn_volume i").attr("class",`fas ${r===0?"fa-volume-mute":r<50?"fa-volume-down":"fa-volume-up"}`),d(`Volumen: ${r}%`,"info",1500)},ce=async()=>{const e=a("#videoPlayer")[0];try{document.pictureInPictureElement?await document.exitPictureInPicture():await e.requestPictureInPicture()}catch{d("PiP no disponible","error",2e3)}},T=()=>{const e=a(".media_player:not(.dpn)")[0];document.fullscreenElement?document.exitFullscreen():e.requestFullscreen().catch(()=>{})},de=()=>{if(!n.length)return;const e=n[s],t=document.createElement("a");t.href=e.url,t.download=e.name,t.click(),d(`${e.name} descargado`,"success",1500)},h=e=>{x=e==="in"?Math.min(x+.25,5):e==="out"?Math.max(x-.25,.5):1,a("#imageViewer").css("transform",`scale(${x})`)},C=()=>E(s<n.length-1?s+1:0),U=()=>E(s>0?s-1:n.length-1),j=()=>{const e=n.filter(t=>t.type==="IMAGEN");if(!e.length)return d("No hay imágenes","error",2e3);H("slideshowModal"),s=n.indexOf(e[0]),F(),g=setInterval(()=>{const t=n.slice(s+1).find(i=>i.type==="IMAGEN");s=t?n.indexOf(t):n.indexOf(e[0]),F()},3e3)},F=()=>{const e=n[s];a("#slideshowImage")[0].src=e.url;const t=n.filter(o=>o.type==="IMAGEN").length,i=n.slice(0,s+1).filter(o=>o.type==="IMAGEN").length;a("#slideCounter").text(`${i} / ${t}`)},M=(e=!0)=>{q("mediawii_files",n.map(t=>({name:t.name,type:t.type,format:t.format,size:t.size,width:t.width,height:t.height,duration:t.duration,isPasted:t.isPasted,thumbnail:t.thumbnail})),720),e&&d("Sesión guardada","success",1500)},G=()=>{const e=X("mediawii_files");e?.length&&(console.log(`✅ ${e.length} archivo(s) cargados de la sesión anterior`),d(`Sesión anterior: ${e.length} archivos`,"info",2e3))},O=()=>{const e=a("#videoPlayer")[0],t=a("#audioPlayer")[0];e&&(e.pause(),e.currentTime=0),t&&(t.pause(),t.currentTime=0),k&&cancelAnimationFrame(k),k=null},N=()=>{const e=a('<input type="file" accept="video/*,audio/*,image/*" multiple style="display:none">');e.on("change",function(){this.files.length&&D(this.files),e.remove()}),a("body").append(e),e.click()},pe=()=>{a("#mediaZone").on("dblclick",N).on("dragover",e=>{e.preventDefault(),a("#mediaZone").addClass("dragover")}).on("dragleave",()=>a("#mediaZone").removeClass("dragover")).on("drop",e=>{e.preventDefault(),a("#mediaZone").removeClass("dragover");const t=e.originalEvent.dataTransfer?.files;t?.length&&D(t)}),a(document).on("paste",Y),a(".btn_add").on("click",N),a(".btn_clear").on("click",()=>{n.length&&(n.forEach(e=>URL.revokeObjectURL(e.url)),n=[],s=0,W=1,O(),a(".media_placeholder").removeClass("dpn"),a(".media_info").addClass("dpn"),b(),M(!1),d("Todo limpiado","success",1500))}),a(".btn_reload").on("click",()=>{G(),b()}),a(document).on("click",".btn_play",z),a(document).on("click",".btn_prev",U),a(document).on("click",".btn_next",C),a(document).on("click",".btn_loop",ne),a(document).on("click",".btn_speed",se),a(document).on("click",".btn_volume",le),a(document).on("click",".btn_pip",ce),a(document).on("click",".btn_fullscreen",T),a(document).on("click",".btn_download",de),a(document).on("click",".btn_zoom_in, .btn_zoom_in_ctrl",()=>h("in")),a(document).on("click",".btn_zoom_out, .btn_zoom_out_ctrl",()=>h("out")),a(document).on("click",".btn_zoom_reset",()=>h("reset")),a(document).on("click",".btn_slideshow",j),a(document).on("click",".timeline_container",function(e){const t=m==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.currentTime=e.offsetX/a(this).width()*t.duration}),a(document).on("click",".volume_container",function(e){const t=m==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];r=Math.round(e.offsetX/a(this).width()*100),t.volume=r/100,a(".volume_fill").css("width",`${r}%`)}),a(document).on("click",".gallery_item",function(){E(parseInt(a(this).data("i")))}),a(document).on("click",".btn_del_mini",function(e){e.stopPropagation();const t=parseInt(a(this).data("i"));URL.revokeObjectURL(n[t].url),n.splice(t,1),n.length?t===s?E(Math.min(t,n.length-1)):t<s&&s--:(O(),a(".media_placeholder").removeClass("dpn"),a(".media_info").addClass("dpn")),b(),M(!1)}),a(".btn_slide_prev").on("click",U),a(".btn_slide_next").on("click",C),a(".btn_slide_play").on("click",()=>{g?(clearInterval(g),g=null,a(".btn_slide_play i").attr("class","fas fa-play")):j()}),a(".modalX").on("click",()=>{g&&clearInterval(g),B("slideshowModal")}),a(document).on("keydown",e=>{n.length&&([" ","ArrowLeft","ArrowRight","f","F","+","=","-","0"].includes(e.key)&&e.preventDefault(),e.key===" "&&m!=="IMAGEN"&&z(),e.key==="ArrowLeft"&&U(),e.key==="ArrowRight"&&C(),(e.key==="f"||e.key==="F")&&T(),(e.key==="+"||e.key==="=")&&m==="IMAGEN"&&h("in"),e.key==="-"&&m==="IMAGEN"&&h("out"),e.key==="0"&&m==="IMAGEN"&&h("reset"))}),G(),console.log("✅ Centro Multimedia cargado")},ve=()=>{O(),n.forEach(e=>URL.revokeObjectURL(e.url)),n=[],u&&(u.close(),u=null),a("#mediaZone, .btn_add, .btn_clear, .btn_reload, .modalX").off(),a(document).off("click"),a(document).off("paste"),a(document).off("keydown"),console.log("🧹 Centro Multimedia limpiado")};export{ve as cleanup,pe as init,fe as render};

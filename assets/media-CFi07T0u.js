import{j as a}from"./vendor-gzd0YkcT.js";import{N as d,c as X,s as Q,a as K,g as J}from"./main-YGQq1nns.js";import"./main-nfyEp11B.js";const ge=()=>`
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
`;let n=[],l=0,f=null,Z=1,x=1,k=!1,$=1,u=70,w=null,b="",E=!1,m=null,p=null,I=null,S=null,c=null,_=null,C=null;const R=e=>e?`${(e/1024**Math.floor(Math.log(e)/Math.log(1024))).toFixed(1)} ${["B","KB","MB"][Math.floor(Math.log(e)/Math.log(1024))]}`:"0 B",g=(e=0)=>`${String(Math.floor(e/60)).padStart(2,"0")}:${String(Math.floor(e%60)).padStart(2,"0")}`,U={VIDEO:["video/mp4","video/webm","video/ogg"],AUDIO:["audio/mp3","audio/mpeg","audio/wav","audio/m4a","audio/ogg"],IMAGEN:["image/jpeg","image/jpg","image/png","image/gif","image/webp","image/svg+xml"]},Y=e=>U.VIDEO.includes(e.type)?"VIDEO":U.AUDIO.includes(e.type)?"AUDIO":U.IMAGEN.includes(e.type)?"IMAGEN":null,ee=()=>{E=!E,E?(a("#galleryHeader").addClass("dpn"),a("#searchBar").removeClass("dpn"),setTimeout(()=>a("#searchInput").focus(),100)):V()},V=()=>{E=!1,a("#searchBar").addClass("dpn"),a("#galleryHeader").removeClass("dpn"),a("#searchInput").val(""),b="",v()},te=e=>{b=e.toLowerCase().trim(),v();const t=q();a("#searchResults").text(`${t.length} de ${n.length}`)},q=()=>b?n.filter(e=>e.name.toLowerCase().includes(b)):n,ae=(e,t)=>{const i=document.createElement("video"),s=document.createElement("canvas"),o=s.getContext("2d");i.preload="metadata",i.muted=!0,i.playsInline=!0,i.onloadedmetadata=()=>{i.currentTime=Math.min(1,i.duration*.1)},i.onseeked=()=>{s.width=i.videoWidth,s.height=i.videoHeight,o.drawImage(i,0,0,s.width,s.height);const r=s.toDataURL("image/jpeg",.7);t(r),URL.revokeObjectURL(i.src),i.remove(),s.remove()},i.onerror=()=>{t(null),URL.revokeObjectURL(i.src),i.remove(),s.remove()},i.src=URL.createObjectURL(e)},ie=(e,t)=>{if(e.type.startsWith("image/")){const i=new Image;i.onload=()=>t(i.width,i.height),i.src=URL.createObjectURL(e)}else if(e.type.startsWith("video/")){const i=document.createElement("video");i.onloadedmetadata=()=>{t(i.videoWidth,i.videoHeight,i.duration),URL.revokeObjectURL(i.src)},i.src=URL.createObjectURL(e)}else if(e.type.startsWith("audio/")){const i=document.createElement("audio");i.onloadedmetadata=()=>{t(null,null,i.duration),URL.revokeObjectURL(i.src)},i.src=URL.createObjectURL(e)}},z=(e,t=!1)=>{let i=0;Array.from(e).forEach(s=>{const o=Y(s);if(!o)return d(`${s.name} no es un formato válido`,"error",2e3);const r=URL.createObjectURL(s),h={id:Date.now()+Math.random(),name:s.name,type:o,format:s.type,size:s.size,url:r,isPasted:t,addedAt:new Date().toISOString(),thumbnail:null};o==="VIDEO"&&ae(s,L=>{h.thumbnail=L,v(),A(!1)}),ie(s,(L,T,F)=>{L&&(h.width=L),T&&(h.height=T),F&&(h.duration=F),v(),A(!1)}),n.push(h),i++}),i&&(d(t?"Captura pegada":`${i} archivo(s) agregado(s)`,"success",1500),v(),O(t?n.length-1:0),A(!1))},ne=e=>{const t=e.originalEvent?.clipboardData?.items;if(!t)return;let i=!1;a.each(t,(s,o)=>{if(o.type.startsWith("image/")){const r=o.getAsFile();return r?(z([new File([r],`Captura_${Z++}.png`,{type:r.type})],!0),i=!0,a("#mediaZone").addClass("paste_flash"),setTimeout(()=>a("#mediaZone").removeClass("paste_flash"),300),!1):!0}}),i||d("No se detectó imagen en portapapeles","error",2e3)},v=()=>{const e=a("#mediaGallery"),t=q();if(a("#mediaCount").text(n.length),!n.length)return e.html('<div class="gallery_empty"><i class="fas fa-folder-open"></i><p>Sin archivos</p></div>');if(!t.length&&b)return e.html('<div class="gallery_empty"><i class="fas fa-search"></i><p>No se encontraron archivos</p><small>Intenta con otro término</small></div>');e.html(t.map(i=>{const s=n.indexOf(i);let o="";i.type==="VIDEO"?o=i.thumbnail?`<img src="${i.thumbnail}" alt="${i.name}">`:'<i class="fas fa-video"></i>':i.type==="IMAGEN"?o=`<img src="${i.url}" alt="${i.name}">`:o='<i class="fas fa-music"></i>';let r=i.name;if(b){const h=new RegExp(`(${b})`,"gi");r=i.name.replace(h,"<mark>$1</mark>")}return`
      <div class="gallery_item ${s===l?"active":""}" data-i="${s}">
        <div class="item_preview ${i.type.toLowerCase()}">${o}</div>
        <div class="item_info">
          <span class="item_name">${r}</span>
          <span class="item_details">${R(i.size)}${i.duration?` • ${g(i.duration)}`:""}</span>
        </div>
        <span class="type_badge ${i.type.toLowerCase()}"><i class="fas ${i.type==="VIDEO"?"fa-video":i.type==="AUDIO"?"fa-music":"fa-image"}"></i></span>
        ${i.isPasted?'<span class="paste_badge"><i class="fas fa-paste"></i></span>':""}
        <button class="btn_del_mini" data-i="${s}"><i class="fas fa-times"></i></button>
      </div>
    `}).join(""))},O=e=>{if(e<0||e>=n.length)return;l=e;const t=n[e];f=t.type,a(".media_placeholder,.video_player,.audio_player,.image_player").addClass("dpn"),a(".media_info").removeClass("dpn"),P(),t.type==="VIDEO"?se(t):t.type==="AUDIO"?oe(t):le(t),a(".media_name").text(t.name),v(),de(t.type)},se=e=>{a(".video_player").removeClass("dpn");const t=a("#videoPlayer")[0];t.src=e.url,t.load(),t.play().catch(()=>{}),a(".media_details").text(`${e.width}×${e.height} • ${R(e.size)} • ${g(e.duration)}`),a(".info_timeline").removeClass("dpn"),t.ontimeupdate=()=>{a(".time_current").text(g(t.currentTime)),a(".timeline_fill").css("width",`${t.currentTime/t.duration*100}%`),a(".time_total").text(g(t.duration))},t.onplay=()=>a(".btn_play i").attr("class","fas fa-pause"),t.onpause=()=>a(".btn_play i").attr("class","fas fa-play"),t.onended=()=>k?(t.currentTime=0,t.play()):M()},oe=e=>{a(".audio_player").removeClass("dpn");const t=a("#audioPlayer")[0];t.src=e.url,t.load(),t.play().catch(()=>{}),a(".media_details").text(`${R(e.size)} • ${g(e.duration)}`),a(".info_timeline").removeClass("dpn"),ce(t,"#audioWave"),t.ontimeupdate=()=>{a(".time_current").text(g(t.currentTime)),a(".timeline_fill").css("width",`${t.currentTime/t.duration*100}%`),a(".time_total").text(g(t.duration))},t.onplay=()=>a(".btn_play i").attr("class","fas fa-pause"),t.onpause=()=>a(".btn_play i").attr("class","fas fa-play"),t.onended=()=>k?(t.currentTime=0,t.play()):M()},le=e=>{a(".image_player").removeClass("dpn");const t=a("#imageViewer")[0];t.src=e.url,x=1,a(t).css("transform","scale(1)"),a(".media_details").text(`${e.width}×${e.height} • ${R(e.size)}${e.isPasted?" • Pegada":""}`),a(".info_timeline").addClass("dpn")},ce=(e,t)=>{c=a(t)[0],c&&(_=c.getContext("2d"),c.width=c.offsetWidth,c.height=c.offsetHeight,m||(m=new(window.AudioContext||window.webkitAudioContext)),m.state==="suspended"&&m.resume(),S||(S=m.createMediaElementSource(e)),p||(p=m.createAnalyser(),p.fftSize=256,S.connect(p),p.connect(m.destination),I=new Uint8Array(p.frequencyBinCount)),C&&cancelAnimationFrame(C),H())},H=()=>{if(C=requestAnimationFrame(H),!p||!I||!_||!c)return;p.getByteFrequencyData(I),_.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--bg3"),_.fillRect(0,0,c.width,c.height);const e=c.width/I.length*2.5;let t=0;for(let i=0;i<I.length;i++){const s=I[i]/255*c.height,o=_.createLinearGradient(0,c.height,0,c.height-s);o.addColorStop(0,getComputedStyle(document.documentElement).getPropertyValue("--mco")),o.addColorStop(1,getComputedStyle(document.documentElement).getPropertyValue("--bg2")),_.fillStyle=o,_.fillRect(t,c.height-s,e,s),t+=e+1}},de=e=>{const t=a("#mediaControls"),i=`
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
  `),setTimeout(()=>a(".volume_fill").css("width","70%"),10)},j=()=>{const e=f==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];e&&(e.paused?e.play():e.pause())},re=()=>{k=!k,a(".btn_loop").toggleClass("active",k),d(`Loop ${k?"activado":"desactivado"}`,"info",1500)},ue=()=>{const e=[.25,.5,.75,1,1.25,1.5,2,3];$=e[(e.indexOf($)+1)%e.length];const t=f==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.playbackRate=$,a(".btn_speed").text(`${$}x`),d(`Velocidad: ${$}x`,"info",1500)},me=()=>{const e=[0,25,50,70,100];u=e[(e.indexOf(u)+1)%e.length];const t=f==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.volume=u/100,a(".volume_fill").css("width",`${u}%`),a(".btn_volume i").attr("class",`fas ${u===0?"fa-volume-mute":u<50?"fa-volume-down":"fa-volume-up"}`),d(`Volumen: ${u}%`,"info",1500)},fe=async()=>{const e=a("#videoPlayer")[0];try{document.pictureInPictureElement?await document.exitPictureInPicture():await e.requestPictureInPicture()}catch{d("PiP no disponible","error",2e3)}},N=()=>{const e=a(".media_player:not(.dpn)")[0];document.fullscreenElement?document.exitFullscreen():e.requestFullscreen().catch(()=>{})},pe=()=>{if(!n.length)return;const e=n[l],t=document.createElement("a");t.href=e.url,t.download=e.name,t.click(),d(`${e.name} descargado`,"success",1500)},y=e=>{x=e==="in"?Math.min(x+.25,5):e==="out"?Math.max(x-.25,.5):1,a("#imageViewer").css("transform",`scale(${x})`)},M=()=>O(l<n.length-1?l+1:0),D=()=>O(l>0?l-1:n.length-1),G=()=>{const e=n.filter(t=>t.type==="IMAGEN");if(!e.length)return d("No hay imágenes","error",2e3);K("slideshowModal"),l=n.indexOf(e[0]),B(),w=setInterval(()=>{const t=n.slice(l+1).find(i=>i.type==="IMAGEN");l=t?n.indexOf(t):n.indexOf(e[0]),B()},3e3)},B=()=>{const e=n[l];a("#slideshowImage")[0].src=e.url;const t=n.filter(s=>s.type==="IMAGEN").length,i=n.slice(0,l+1).filter(s=>s.type==="IMAGEN").length;a("#slideCounter").text(`${i} / ${t}`)},A=(e=!0)=>{Q("mediawii_files",n.map(t=>({name:t.name,type:t.type,format:t.format,size:t.size,width:t.width,height:t.height,duration:t.duration,isPasted:t.isPasted,thumbnail:t.thumbnail})),720),e&&d("Sesión guardada","success",1500)},ve=()=>{const e=J("mediawii_files");e?.length&&(console.log(`✅ ${e.length} archivo(s) cargados de la sesión anterior`),d(`Sesión anterior: ${e.length} archivos`,"info",2e3))},P=()=>{const e=a("#videoPlayer")[0],t=a("#audioPlayer")[0];e&&(e.pause(),e.currentTime=0),t&&(t.pause(),t.currentTime=0),C&&cancelAnimationFrame(C),C=null},W=()=>{const e=a('<input type="file" accept="video/*,audio/*,image/*" multiple style="display:none">');e.on("change",function(){this.files.length&&z(this.files),e.remove()}),a("body").append(e),e.click()},ye=()=>{a("#mediaZone").on("dblclick",W).on("dragover",e=>{e.preventDefault(),a("#mediaZone").addClass("dragover")}).on("dragleave",()=>a("#mediaZone").removeClass("dragover")).on("drop",e=>{e.preventDefault(),a("#mediaZone").removeClass("dragover");const t=e.originalEvent.dataTransfer?.files;t?.length&&z(t)}),a(document).on("paste",ne),a(".btn_add").on("click",W),a(".btn_clear").on("click",()=>{n.length&&(n.forEach(e=>URL.revokeObjectURL(e.url)),n=[],l=0,Z=1,P(),a(".media_placeholder").removeClass("dpn"),a(".media_info").addClass("dpn"),v(),A(!1),d("Todo limpiado","success",1500))}),a(".btn_search").on("click",ee),a("#btnCloseSearch").on("click",V),a("#searchInput").on("input",function(){te(a(this).val())}),a(document).on("click",".btn_play",j),a(document).on("click",".btn_prev",D),a(document).on("click",".btn_next",M),a(document).on("click",".btn_loop",re),a(document).on("click",".btn_speed",ue),a(document).on("click",".btn_volume",me),a(document).on("click",".btn_pip",fe),a(document).on("click",".btn_fullscreen",N),a(document).on("click",".btn_download",pe),a(document).on("click",".btn_zoom_in, .btn_zoom_in_ctrl",()=>y("in")),a(document).on("click",".btn_zoom_out, .btn_zoom_out_ctrl",()=>y("out")),a(document).on("click",".btn_zoom_reset",()=>y("reset")),a(document).on("click",".btn_slideshow",G),a(document).on("click",".timeline_container",function(e){const t=f==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.currentTime=e.offsetX/a(this).width()*t.duration}),a(document).on("click",".volume_container",function(e){const t=f==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];u=Math.round(e.offsetX/a(this).width()*100),t.volume=u/100,a(".volume_fill").css("width",`${u}%`)}),a(document).on("click",".gallery_item",function(){O(parseInt(a(this).data("i")))}),a(document).on("click",".btn_del_mini",function(e){e.stopPropagation();const t=parseInt(a(this).data("i"));URL.revokeObjectURL(n[t].url),n.splice(t,1),n.length?t===l?O(Math.min(t,n.length-1)):t<l&&l--:(P(),a(".media_placeholder").removeClass("dpn"),a(".media_info").addClass("dpn")),v(),A(!1)}),a(".btn_slide_prev").on("click",D),a(".btn_slide_next").on("click",M),a(".btn_slide_play").on("click",()=>{w?(clearInterval(w),w=null,a(".btn_slide_play i").attr("class","fas fa-play")):G()}),a(".modalX").on("click",()=>{w&&clearInterval(w),X("slideshowModal")}),a(document).on("keydown",e=>{if(E){e.key==="Escape"&&V();return}n.length&&([" ","ArrowLeft","ArrowRight","f","F","+","=","-","0"].includes(e.key)&&e.preventDefault(),e.key===" "&&f!=="IMAGEN"&&j(),e.key==="ArrowLeft"&&D(),e.key==="ArrowRight"&&M(),(e.key==="f"||e.key==="F")&&N(),(e.key==="+"||e.key==="=")&&f==="IMAGEN"&&y("in"),e.key==="-"&&f==="IMAGEN"&&y("out"),e.key==="0"&&f==="IMAGEN"&&y("reset"))}),ve(),console.log("✅ Centro Multimedia cargado")},we=()=>{P(),n.forEach(e=>URL.revokeObjectURL(e.url)),n=[],m&&(m.close(),m=null),a("#mediaZone, .btn_add, .btn_clear, .btn_search, #btnCloseSearch, #searchInput, .modalX").off(),a(document).off("click"),a(document).off("paste"),a(document).off("keydown"),console.log("🧹 Centro Multimedia limpiado")};export{we as cleanup,ye as init,ge as render};

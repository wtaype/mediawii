import{j as a}from"./vendor-gzd0YkcT.js";import{N as c,c as B,s as q,g as X,a as H}from"./main-CRuECGBs.js";import"./main-Do9n7hkZ.js";const me=()=>`
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
`;let o=[],s=0,u=null,W=1,k=1,g=!1,I=1,d=70,b=null,r=null,f=null,h=null,O=null,l=null,p=null,y=null;const P=e=>e?`${(e/1024**Math.floor(Math.log(e)/Math.log(1024))).toFixed(1)} ${["B","KB","MB"][Math.floor(Math.log(e)/Math.log(1024))]}`:"0 B",v=(e=0)=>`${String(Math.floor(e/60)).padStart(2,"0")}:${String(Math.floor(e%60)).padStart(2,"0")}`,D={VIDEO:["video/mp4","video/webm","video/ogg"],AUDIO:["audio/mp3","audio/mpeg","audio/wav","audio/m4a","audio/ogg"],IMAGEN:["image/jpeg","image/jpg","image/png","image/gif","image/webp","image/svg+xml"]},K=e=>D.VIDEO.includes(e.type)?"VIDEO":D.AUDIO.includes(e.type)?"AUDIO":D.IMAGEN.includes(e.type)?"IMAGEN":null,Q=(e,t)=>{if(e.type.startsWith("image/")){const i=new Image;i.onload=()=>t(i.width,i.height),i.src=URL.createObjectURL(e)}else if(e.type.startsWith("video/")){const i=document.createElement("video");i.onloadedmetadata=()=>t(i.videoWidth,i.videoHeight,i.duration),i.src=URL.createObjectURL(e)}else if(e.type.startsWith("audio/")){const i=document.createElement("audio");i.onloadedmetadata=()=>t(null,null,i.duration),i.src=URL.createObjectURL(e)}},L=(e,t=!1)=>{let i=0;Array.from(e).forEach(n=>{const m=K(n);if(!m)return c(`${n.name} no es un formato válido`,"error",2e3);const $=URL.createObjectURL(n),A={id:Date.now()+Math.random(),name:n.name,type:m,format:n.type,size:n.size,url:$,isPasted:t,addedAt:new Date().toISOString()};Q(n,(V,z,R)=>{V&&(A.width=V),z&&(A.height=z),R&&(A.duration=R),w(),M(!1)}),o.push(A),i++}),i&&(c(t?"Captura pegada":`${i} archivo(s) agregado(s)`,"success",1500),w(),C(t?o.length-1:0),M(!1))},J=e=>{const t=e.originalEvent?.clipboardData?.items;if(!t)return;let i=!1;a.each(t,(n,m)=>{if(m.type.startsWith("image/")){const $=m.getAsFile();return $?(L([new File([$],`Captura_${W++}.png`,{type:$.type})],!0),i=!0,a("#mediaZone").addClass("paste_flash"),setTimeout(()=>a("#mediaZone").removeClass("paste_flash"),300),!1):!0}}),i||c("No se detectó imagen en portapapeles","error",2e3)},w=()=>{const e=a("#mediaGallery");if(a("#mediaCount").text(o.length),!o.length)return e.html('<div class="gallery_empty"><i class="fas fa-folder-open"></i><p>Sin archivos</p></div>');e.html(o.map((t,i)=>`
    <div class="gallery_item ${i===s?"active":""}" data-i="${i}">
      <div class="item_preview ${t.type.toLowerCase()}">${t.type==="IMAGEN"?`<img src="${t.url}" alt="${t.name}">`:`<i class="fas ${t.type==="VIDEO"?"fa-video":t.type==="AUDIO"?"fa-music":"fa-image"}"></i>`}</div>
      <div class="item_info"><span class="item_name">${t.name}</span><span class="item_details">${P(t.size)}${t.duration?` • ${v(t.duration)}`:""}</span></div>
      <span class="type_badge ${t.type.toLowerCase()}"><i class="fas ${t.type==="VIDEO"?"fa-video":t.type==="AUDIO"?"fa-music":"fa-image"}"></i></span>
      ${t.isPasted?'<span class="paste_badge"><i class="fas fa-paste"></i></span>':""}
      <button class="btn_del_mini" data-i="${i}"><i class="fas fa-times"></i></button>
    </div>
  `).join(""))},C=e=>{if(e<0||e>=o.length)return;s=e;const t=o[e];u=t.type,a(".media_placeholder,.video_player,.audio_player,.image_player").addClass("dpn"),a(".media_info").removeClass("dpn"),E(),t.type==="VIDEO"?Y(t):t.type==="AUDIO"?ee(t):te(t),a(".media_name").text(t.name),w(),ie(t.type)},Y=e=>{a(".video_player").removeClass("dpn");const t=a("#videoPlayer")[0];t.src=e.url,t.load(),t.play().catch(()=>{}),a(".media_details").text(`${e.width}×${e.height} • ${P(e.size)} • ${v(e.duration)}`),a(".info_timeline").removeClass("dpn"),t.ontimeupdate=()=>{a(".time_current").text(v(t.currentTime)),a(".timeline_fill").css("width",`${t.currentTime/t.duration*100}%`),a(".time_total").text(v(t.duration))},t.onplay=()=>a(".btn_play i").attr("class","fas fa-pause"),t.onpause=()=>a(".btn_play i").attr("class","fas fa-play"),t.onended=()=>g?(t.currentTime=0,t.play()):x()},ee=e=>{a(".audio_player").removeClass("dpn");const t=a("#audioPlayer")[0];t.src=e.url,t.load(),t.play().catch(()=>{}),a(".media_details").text(`${P(e.size)} • ${v(e.duration)}`),a(".info_timeline").removeClass("dpn"),ae(t,"#audioWave"),t.ontimeupdate=()=>{a(".time_current").text(v(t.currentTime)),a(".timeline_fill").css("width",`${t.currentTime/t.duration*100}%`),a(".time_total").text(v(t.duration))},t.onplay=()=>a(".btn_play i").attr("class","fas fa-pause"),t.onpause=()=>a(".btn_play i").attr("class","fas fa-play"),t.onended=()=>g?(t.currentTime=0,t.play()):x()},te=e=>{a(".image_player").removeClass("dpn");const t=a("#imageViewer")[0];t.src=e.url,k=1,a(t).css("transform","scale(1)"),a(".media_details").text(`${e.width}×${e.height} • ${P(e.size)}${e.isPasted?" • Pegada":""}`),a(".info_timeline").addClass("dpn")},ae=(e,t)=>{l=a(t)[0],l&&(p=l.getContext("2d"),l.width=l.offsetWidth,l.height=l.offsetHeight,r||(r=new(window.AudioContext||window.webkitAudioContext)),r.state==="suspended"&&r.resume(),O||(O=r.createMediaElementSource(e)),f||(f=r.createAnalyser(),f.fftSize=256,O.connect(f),f.connect(r.destination),h=new Uint8Array(f.frequencyBinCount)),y&&cancelAnimationFrame(y),Z())},Z=()=>{if(y=requestAnimationFrame(Z),!f||!h||!p||!l)return;f.getByteFrequencyData(h),p.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--bg3"),p.fillRect(0,0,l.width,l.height);const e=l.width/h.length*2.5;let t=0;for(let i=0;i<h.length;i++){const n=h[i]/255*l.height,m=p.createLinearGradient(0,l.height,0,l.height-n);m.addColorStop(0,getComputedStyle(document.documentElement).getPropertyValue("--mco")),m.addColorStop(1,getComputedStyle(document.documentElement).getPropertyValue("--bg2")),p.fillStyle=m,p.fillRect(t,l.height-n,e,n),t+=e+1}},ie=e=>{const t=a("#mediaControls"),i=`
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
  `),setTimeout(()=>a(".volume_fill").css("width","70%"),10)},U=()=>{const e=u==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];e&&(e.paused?e.play():e.pause())},oe=()=>{g=!g,a(".btn_loop").toggleClass("active",g),c(`Loop ${g?"activado":"desactivado"}`,"info",1500)},ne=()=>{const e=[.25,.5,.75,1,1.25,1.5,2,3];I=e[(e.indexOf(I)+1)%e.length];const t=u==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.playbackRate=I,a(".btn_speed").text(`${I}x`),c(`Velocidad: ${I}x`,"info",1500)},se=()=>{const e=[0,25,50,70,100];d=e[(e.indexOf(d)+1)%e.length];const t=u==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.volume=d/100,a(".volume_fill").css("width",`${d}%`),a(".btn_volume i").attr("class",`fas ${d===0?"fa-volume-mute":d<50?"fa-volume-down":"fa-volume-up"}`),c(`Volumen: ${d}%`,"info",1500)},le=async()=>{const e=a("#videoPlayer")[0];try{document.pictureInPictureElement?await document.exitPictureInPicture():await e.requestPictureInPicture()}catch{c("PiP no disponible","error",2e3)}},F=()=>{const e=a(".media_player:not(.dpn)")[0];document.fullscreenElement?document.exitFullscreen():e.requestFullscreen().catch(()=>{})},ce=()=>{if(!o.length)return;const e=o[s],t=document.createElement("a");t.href=e.url,t.download=e.name,t.click(),c(`${e.name} descargado`,"success",1500)},_=e=>{k=e==="in"?Math.min(k+.25,5):e==="out"?Math.max(k-.25,.5):1,a("#imageViewer").css("transform",`scale(${k})`)},x=()=>C(s<o.length-1?s+1:0),S=()=>C(s>0?s-1:o.length-1),T=()=>{const e=o.filter(t=>t.type==="IMAGEN");if(!e.length)return c("No hay imágenes","error",2e3);H("slideshowModal"),s=o.indexOf(e[0]),G(),b=setInterval(()=>{const t=o.slice(s+1).find(i=>i.type==="IMAGEN");s=t?o.indexOf(t):o.indexOf(e[0]),G()},3e3)},G=()=>{const e=o[s];a("#slideshowImage")[0].src=e.url;const t=o.filter(n=>n.type==="IMAGEN").length,i=o.slice(0,s+1).filter(n=>n.type==="IMAGEN").length;a("#slideCounter").text(`${i} / ${t}`)},M=(e=!0)=>{q("mediawii_files",o.map(t=>({name:t.name,type:t.type,format:t.format,size:t.size,width:t.width,height:t.height,duration:t.duration,isPasted:t.isPasted})),720),e&&c("Sesión guardada","success",1500)},N=()=>{const e=X("mediawii_files");e?.length&&(console.log(`✅ ${e.length} archivo(s) cargados de la sesión anterior`),c(`Sesión anterior: ${e.length} archivos`,"info",2e3))},E=()=>{const e=a("#videoPlayer")[0],t=a("#audioPlayer")[0];e&&(e.pause(),e.currentTime=0),t&&(t.pause(),t.currentTime=0),y&&cancelAnimationFrame(y),y=null},j=()=>{const e=a('<input type="file" accept="video/*,audio/*,image/*" multiple style="display:none">');e.on("change",function(){this.files.length&&L(this.files),e.remove()}),a("body").append(e),e.click()},fe=()=>{a("#mediaZone").on("dblclick",j).on("dragover",e=>{e.preventDefault(),a("#mediaZone").addClass("dragover")}).on("dragleave",()=>a("#mediaZone").removeClass("dragover")).on("drop",e=>{e.preventDefault(),a("#mediaZone").removeClass("dragover");const t=e.originalEvent.dataTransfer?.files;t?.length&&L(t)}),a(document).on("paste",J),a(".btn_add").on("click",j),a(".btn_clear").on("click",()=>{o.length&&(o.forEach(e=>URL.revokeObjectURL(e.url)),o=[],s=0,W=1,E(),a(".media_placeholder").removeClass("dpn"),a(".media_info").addClass("dpn"),w(),M(!1),c("Todo limpiado","success",1500))}),a(".btn_reload").on("click",()=>{N(),w()}),a(document).on("click",".btn_play",U),a(document).on("click",".btn_prev",S),a(document).on("click",".btn_next",x),a(document).on("click",".btn_loop",oe),a(document).on("click",".btn_speed",ne),a(document).on("click",".btn_volume",se),a(document).on("click",".btn_pip",le),a(document).on("click",".btn_fullscreen",F),a(document).on("click",".btn_download",ce),a(document).on("click",".btn_zoom_in, .btn_zoom_in_ctrl",()=>_("in")),a(document).on("click",".btn_zoom_out, .btn_zoom_out_ctrl",()=>_("out")),a(document).on("click",".btn_zoom_reset",()=>_("reset")),a(document).on("click",".btn_slideshow",T),a(document).on("click",".timeline_container",function(e){const t=u==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];t.currentTime=e.offsetX/a(this).width()*t.duration}),a(document).on("click",".volume_container",function(e){const t=u==="VIDEO"?a("#videoPlayer")[0]:a("#audioPlayer")[0];d=Math.round(e.offsetX/a(this).width()*100),t.volume=d/100,a(".volume_fill").css("width",`${d}%`)}),a(document).on("click",".gallery_item",function(){C(parseInt(a(this).data("i")))}),a(document).on("click",".btn_del_mini",function(e){e.stopPropagation();const t=parseInt(a(this).data("i"));URL.revokeObjectURL(o[t].url),o.splice(t,1),o.length?t===s?C(Math.min(t,o.length-1)):t<s&&s--:(E(),a(".media_placeholder").removeClass("dpn"),a(".media_info").addClass("dpn")),w(),M(!1)}),a(".btn_slide_prev").on("click",S),a(".btn_slide_next").on("click",x),a(".btn_slide_play").on("click",()=>{b?(clearInterval(b),b=null,a(".btn_slide_play i").attr("class","fas fa-play")):T()}),a(".modalX").on("click",()=>{b&&clearInterval(b),B("slideshowModal")}),a(document).on("keydown",e=>{o.length&&([" ","ArrowLeft","ArrowRight","f","F","+","=","-","0"].includes(e.key)&&e.preventDefault(),e.key===" "&&u!=="IMAGEN"&&U(),e.key==="ArrowLeft"&&S(),e.key==="ArrowRight"&&x(),(e.key==="f"||e.key==="F")&&F(),(e.key==="+"||e.key==="=")&&u==="IMAGEN"&&_("in"),e.key==="-"&&u==="IMAGEN"&&_("out"),e.key==="0"&&u==="IMAGEN"&&_("reset"))}),N(),console.log("✅ Centro Multimedia cargado")},pe=()=>{E(),o.forEach(e=>URL.revokeObjectURL(e.url)),o=[],r&&(r.close(),r=null),a("#mediaZone, .btn_add, .btn_clear, .btn_reload, .modalX").off(),a(document).off("click"),a(document).off("paste"),a(document).off("keydown"),console.log("🧹 Centro Multimedia limpiado")};export{pe as cleanup,fe as init,me as render};

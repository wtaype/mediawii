import{j as t}from"./vendor-gzd0YkcT.js";import{N as u,e as J,f as ee}from"./main-QT6457uG.js";const ge=()=>`
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
`;let s=[],l=0,w=null,Z=1,x=1,$=!1,C=1,d=70,f=null,b="",M=!1,r=null,m=null,I=null,O=null,o=null,_=null,k=null,q="",H="",X="";const S=e=>{if(!e)return"0 B";const a=Math.floor(Math.log(e)/Math.log(1024));return`${(e/1024**a).toFixed(1)} ${["B","KB","MB","GB"][a]}`},g=(e=0)=>`${String(Math.floor(e/60)).padStart(2,"0")}:${String(Math.floor(e%60)).padStart(2,"0")}`,V={VIDEO:["video/mp4","video/webm","video/ogg"],AUDIO:["audio/mp3","audio/mpeg","audio/wav","audio/m4a","audio/ogg","audio/flac","audio/aac"],IMAGEN:["image/jpeg","image/jpg","image/png","image/gif","image/webp","image/svg+xml"]},te=e=>Object.keys(V).find(a=>V[a].includes(e.type))??null,ae=()=>{M=!M,M?(t("#galleryHeader").addClass("dpn"),t("#searchBar").removeClass("dpn"),setTimeout(()=>t("#searchInput").focus(),80)):U()},U=()=>{M=!1,t("#searchBar").addClass("dpn"),t("#galleryHeader").removeClass("dpn"),t("#searchInput").val(""),b="",v()},ie=e=>{b=e.toLowerCase().trim(),v();const a=K().length;t("#searchResults").text(`${a} de ${s.length}`)},K=()=>b?s.filter(e=>e.name.toLowerCase().includes(b)):s,ne=(e,a)=>{const n=document.createElement("video"),i=document.createElement("canvas");n.muted=n.playsInline=!0,n.preload="metadata",n.onloadedmetadata=()=>{n.currentTime=Math.min(1,n.duration*.1)},n.onseeked=()=>{i.width=n.videoWidth,i.height=n.videoHeight,i.getContext("2d").drawImage(n,0,0,i.width,i.height),a(i.toDataURL("image/jpeg",.7)),URL.revokeObjectURL(n.src)},n.onerror=()=>{a(null),URL.revokeObjectURL(n.src)},n.src=URL.createObjectURL(e)},se=(e,a,n)=>{if(e.type.startsWith("image/")){const i=new Image;i.onload=()=>n(i.width,i.height,null),i.src=a}else if(e.type.startsWith("video/")){const i=document.createElement("video");i.onloadedmetadata=()=>{n(i.videoWidth,i.videoHeight,i.duration),URL.revokeObjectURL(i.src)},i.src=URL.createObjectURL(e)}else{const i=document.createElement("audio");i.onloadedmetadata=()=>{n(null,null,i.duration),URL.revokeObjectURL(i.src)},i.src=URL.createObjectURL(e)}},j=(e,a=!1)=>{let n=0;Array.from(e).forEach(i=>{const c=te(i);if(!c)return u(`${i.name} no es un formato válido`,"error",2e3);const p=URL.createObjectURL(i),h={id:Date.now()+Math.random(),name:i.name,type:c,format:i.type,size:i.size,url:p,isPasted:a,thumbnail:null};c==="VIDEO"&&ne(i,R=>{h.thumbnail=R,v()}),se(i,p,(R,D,T)=>{R&&(h.width=R),D&&(h.height=D),T&&(h.duration=T),v()}),s.push(h),n++}),n&&(u(a?"Captura pegada":`${n} archivo(s) agregado(s)`,"success",1500),v(),E(a?s.length-1:0))},oe=e=>{const a=e.originalEvent?.clipboardData?.items;if(!a)return;let n=!1;t.each(a,(i,c)=>{if(!c.type.startsWith("image/"))return!0;const p=c.getAsFile();return p?(j([new File([p],`Captura_${Z++}.png`,{type:p.type})],!0),n=!0,t("#mediaZone").addClass("paste_flash"),setTimeout(()=>t("#mediaZone").removeClass("paste_flash"),300),!1):!0}),n||u("No se detectó imagen en portapapeles","error",2e3)},v=()=>{const e=t("#mediaGallery"),a=K();if(t("#mediaCount").text(s.length),!s.length)return e.html('<div class="gallery_empty"><i class="fas fa-folder-open"></i><p>Sin archivos</p></div>');if(!a.length&&b)return e.html('<div class="gallery_empty"><i class="fas fa-search"></i><p>No se encontraron archivos</p><small>Intenta con otro término</small></div>');const n={VIDEO:"fa-video",AUDIO:"fa-music",IMAGEN:"fa-image"};e.html(a.map(i=>{const c=s.indexOf(i),p=i.type==="VIDEO"?i.thumbnail?`<img src="${i.thumbnail}" alt="">`:'<i class="fas fa-video"></i>':i.type==="IMAGEN"?`<img src="${i.url}" alt="">`:'<i class="fas fa-music"></i>',h=b?i.name.replace(new RegExp(`(${b})`,"gi"),"<mark>$1</mark>"):i.name;return`
      <div class="gallery_item ${c===l?"active":""}" data-i="${c}">
        <div class="item_preview ${i.type.toLowerCase()}">${p}</div>
        <div class="item_info">
          <span class="item_name">${h}</span>
          <span class="item_details">${S(i.size)}${i.duration?` • ${g(i.duration)}`:""}</span>
        </div>
        <span class="type_badge ${i.type.toLowerCase()}"><i class="fas ${n[i.type]}"></i></span>
        ${i.isPasted?'<span class="paste_badge"><i class="fas fa-paste"></i></span>':""}
        <button class="btn_del_mini" data-i="${c}"><i class="fas fa-times"></i></button>
      </div>`}).join(""))},E=e=>{if(e<0||e>=s.length)return;l=e;const a=s[e];w=a.type,t(".media_placeholder,.video_player,.audio_player,.image_player").addClass("dpn"),t(".media_info").removeClass("dpn"),P(),a.type==="VIDEO"?le(a):a.type==="AUDIO"?ce(a):de(a),t(".media_name").text(a.name),v(),ue(a.type)},le=e=>{t(".video_player").removeClass("dpn");const a=t("#videoPlayer")[0];a.src=e.url,a.load(),a.play().catch(()=>{}),t(".media_details").text(`${e.width}×${e.height} • ${S(e.size)} • ${g(e.duration)}`),t(".info_timeline").removeClass("dpn"),a.ontimeupdate=()=>{t(".time_current").text(g(a.currentTime)),t(".timeline_fill").css("width",`${a.currentTime/a.duration*100}%`),t(".time_total").text(g(a.duration))},a.onplay=()=>t(".btn_play i").attr("class","fas fa-pause"),a.onpause=()=>t(".btn_play i").attr("class","fas fa-play"),a.onended=()=>$?(a.currentTime=0,a.play()):A()},ce=e=>{t(".audio_player").removeClass("dpn");const a=t("#audioPlayer")[0];a.src=e.url,a.load(),a.play().catch(()=>{}),t(".media_details").text(`${S(e.size)} • ${g(e.duration)}`),t(".info_timeline").removeClass("dpn"),re(a),a.ontimeupdate=()=>{t(".time_current").text(g(a.currentTime)),t(".timeline_fill").css("width",`${a.currentTime/a.duration*100}%`),t(".time_total").text(g(a.duration))},a.onplay=()=>t(".btn_play i").attr("class","fas fa-pause"),a.onpause=()=>t(".btn_play i").attr("class","fas fa-play"),a.onended=()=>$?(a.currentTime=0,a.play()):A()},de=e=>{t(".image_player").removeClass("dpn");const a=t("#imageViewer")[0];a.src=e.url,x=1,t(a).css("transform","scale(1)"),t(".media_details").text(`${e.width}×${e.height} • ${S(e.size)}${e.isPasted?" • Pegada":""}`),t(".info_timeline").addClass("dpn")},re=e=>{if(o=t("#audioWave")[0],!o)return;_=o.getContext("2d"),o.width=o.offsetWidth,o.height=o.offsetHeight;const a=getComputedStyle(document.documentElement);q=a.getPropertyValue("--bg3").trim(),H=a.getPropertyValue("--mco").trim(),X=a.getPropertyValue("--bg2").trim(),r||(r=new(window.AudioContext||window.webkitAudioContext)),r.state==="suspended"&&r.resume(),O||(O=r.createMediaElementSource(e)),m||(m=r.createAnalyser(),m.fftSize=256,O.connect(m),m.connect(r.destination),I=new Uint8Array(m.frequencyBinCount)),k&&cancelAnimationFrame(k),Q()},Q=()=>{if(k=requestAnimationFrame(Q),!m||!_||!o)return;m.getByteFrequencyData(I),_.fillStyle=q,_.fillRect(0,0,o.width,o.height);const e=o.width/I.length*2.5;let a=0;for(let n=0;n<I.length;n++){const i=I[n]/255*o.height,c=_.createLinearGradient(0,o.height,0,o.height-i);c.addColorStop(0,H),c.addColorStop(1,X),_.fillStyle=c,_.fillRect(a,o.height-i,e,i),a+=e+1}},ue=e=>{const a=t("#mediaControls"),n=`
    <button class="btn_control btn_prev"><i class="fas fa-step-backward"></i></button>
    <button class="btn_control btn_play"><i class="fas fa-play"></i></button>
    <button class="btn_control btn_next"><i class="fas fa-step-forward"></i></button>`,i=`
    <div class="volume_control">
      <button class="btn_control btn_volume"><i class="fas fa-volume-up"></i></button>
      <div class="volume_container"><div class="volume_bg"><div class="volume_fill"></div></div></div>
    </div>`;e==="VIDEO"?a.html(`${n}
    <button class="btn_control btn_loop"><i class="fas fa-redo"></i></button>
    <button class="btn_control btn_speed">1x</button>
    ${i}
    <button class="btn_control btn_pip"><i class="fas fa-clone"></i></button>
    <button class="btn_control btn_fullscreen"><i class="fas fa-expand"></i></button>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>`):e==="AUDIO"?a.html(`${n}
    <button class="btn_control btn_loop"><i class="fas fa-redo"></i></button>
    <button class="btn_control btn_speed">1x</button>
    ${i}
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>`):a.html(`
    <button class="btn_control btn_prev"><i class="fas fa-chevron-left"></i></button>
    <button class="btn_control btn_next"><i class="fas fa-chevron-right"></i></button>
    <button class="btn_control btn_zoom_in_ctrl"><i class="fas fa-search-plus"></i></button>
    <button class="btn_control btn_zoom_out_ctrl"><i class="fas fa-search-minus"></i></button>
    <button class="btn_control btn_fullscreen"><i class="fas fa-expand"></i></button>
    <button class="btn_control btn_slideshow"><i class="fas fa-play-circle"></i></button>
    <button class="btn_control btn_download"><i class="fas fa-download"></i></button>`),setTimeout(()=>t(".volume_fill").css("width",`${d}%`),10)},L=()=>w==="VIDEO"?t("#videoPlayer")[0]:t("#audioPlayer")[0],F=()=>{const e=L();e&&(e.paused?e.play():e.pause())},me=()=>{$=!$,t(".btn_loop").toggleClass("active",$),u(`Loop ${$?"activado":"desactivado"}`,"info",1500)},A=()=>E((l+1)%s.length),z=()=>E(l>0?l-1:s.length-1),y=e=>{x=e==="in"?Math.min(x+.25,5):e==="out"?Math.max(x-.25,.5):1,t("#imageViewer").css("transform",`scale(${x})`)},fe=()=>{const e=[.25,.5,.75,1,1.25,1.5,2,3];C=e[(e.indexOf(C)+1)%e.length],L().playbackRate=C,t(".btn_speed").text(`${C}x`),u(`Velocidad: ${C}x`,"info",1500)},pe=()=>{const e=[0,25,50,70,100];d=e[(e.indexOf(d)+1)%e.length],L().volume=d/100,t(".volume_fill").css("width",`${d}%`),t(".btn_volume i").attr("class",`fas ${d===0?"fa-volume-mute":d<50?"fa-volume-down":"fa-volume-up"}`),u(`Volumen: ${d}%`,"info",1500)},ve=async()=>{const e=t("#videoPlayer")[0];try{document.pictureInPictureElement?await document.exitPictureInPicture():await e.requestPictureInPicture()}catch{u("PiP no disponible","error",2e3)}},G=()=>{const e=t(".media_player:not(.dpn)")[0];document.fullscreenElement?document.exitFullscreen():e?.requestFullscreen().catch(()=>{})},he=()=>{if(!s.length)return;const e=s[l];Object.assign(document.createElement("a"),{href:e.url,download:e.name}).click(),u(`${e.name} descargado`,"success",1500)},Y=()=>s.filter(e=>e.type==="IMAGEN"),N=()=>{const e=Y();if(!e.length)return u("No hay imágenes","error",2e3);ee("slideshowModal"),l=s.indexOf(e[0]),B(),f=setInterval(()=>{const a=s.slice(l+1).find(n=>n.type==="IMAGEN");l=a?s.indexOf(a):s.indexOf(e[0]),B()},3e3)},B=()=>{const e=s[l];t("#slideshowImage")[0].src=e.url;const a=Y(),n=s.slice(0,l+1).filter(i=>i.type==="IMAGEN").length;t("#slideCounter").text(`${n} / ${a.length}`)},P=()=>{[t("#videoPlayer")[0],t("#audioPlayer")[0]].forEach(e=>{e&&(e.pause(),e.currentTime=0)}),k&&(cancelAnimationFrame(k),k=null)},W=()=>{const e=t('<input type="file" accept="video/*,audio/*,image/*" multiple style="display:none">');e.on("change",function(){this.files.length&&j(this.files),e.remove()}),t("body").append(e),e.click()},ye=()=>{t("#mediaZone").on("dblclick",W).on("dragover",e=>{e.preventDefault(),t("#mediaZone").addClass("dragover")}).on("dragleave",()=>t("#mediaZone").removeClass("dragover")).on("drop",e=>{e.preventDefault(),t("#mediaZone").removeClass("dragover");const a=e.originalEvent.dataTransfer?.files;a?.length&&j(a)}),t(document).on("paste.media",oe),t(".btn_add").on("click",W),t(".btn_clear").on("click",()=>{s.length&&(s.forEach(e=>URL.revokeObjectURL(e.url)),s=[],l=0,Z=1,P(),t(".media_placeholder").removeClass("dpn"),t(".media_info").addClass("dpn"),v(),U(),u("Todo limpiado","success",1500))}),t(".btn_search").on("click",ae),t("#btnCloseSearch").on("click",U),t("#searchInput").on("input",function(){ie(t(this).val())}),t(document).on("click.media",".btn_play",F),t(document).on("click.media",".btn_prev",z),t(document).on("click.media",".btn_next",A),t(document).on("click.media",".btn_loop",me),t(document).on("click.media",".btn_speed",fe),t(document).on("click.media",".btn_volume",pe),t(document).on("click.media",".btn_pip",ve),t(document).on("click.media",".btn_fullscreen",G),t(document).on("click.media",".btn_download",he),t(document).on("click.media",".btn_zoom_in,.btn_zoom_in_ctrl",()=>y("in")),t(document).on("click.media",".btn_zoom_out,.btn_zoom_out_ctrl",()=>y("out")),t(document).on("click.media",".btn_zoom_reset",()=>y("reset")),t(document).on("click.media",".btn_slideshow",N),t(document).on("click.media",".timeline_container",function(e){const a=L();a&&(a.currentTime=e.offsetX/t(this).width()*a.duration)}),t(document).on("click.media",".volume_container",function(e){d=Math.round(e.offsetX/t(this).width()*100);const a=L();a&&(a.volume=d/100),t(".volume_fill").css("width",`${d}%`)}),t(document).on("click.media",".gallery_item",function(){E(+t(this).data("i"))}),t(document).on("click.media",".btn_del_mini",function(e){e.stopPropagation();const a=+t(this).data("i");URL.revokeObjectURL(s[a].url),s.splice(a,1),s.length?a===l?E(Math.min(a,s.length-1)):a<l&&l--:(P(),t(".media_placeholder").removeClass("dpn"),t(".media_info").addClass("dpn")),v()}),t(".btn_slide_prev").on("click",z),t(".btn_slide_next").on("click",A),t(".btn_slide_play").on("click",()=>{f?(clearInterval(f),f=null,t(".btn_slide_play i").attr("class","fas fa-play")):N()}),t(".modalX").on("click",()=>{clearInterval(f),f=null,J("slideshowModal")}),t(document).on("keydown.media",e=>{if(M){e.key==="Escape"&&U();return}s.length&&([" ","ArrowLeft","ArrowRight","f","F","+","=","-","0"].includes(e.key)&&e.preventDefault(),e.key===" "&&w!=="IMAGEN"&&F(),e.key==="ArrowLeft"&&z(),e.key==="ArrowRight"&&A(),(e.key==="f"||e.key==="F")&&G(),(e.key==="+"||e.key==="=")&&w==="IMAGEN"&&y("in"),e.key==="-"&&w==="IMAGEN"&&y("out"),e.key==="0"&&w==="IMAGEN"&&y("reset"))}),console.log("🎬 Mediawii · Centro Multimedia OK")},we=()=>{P(),s.forEach(e=>URL.revokeObjectURL(e.url)),s=[],f&&(clearInterval(f),f=null),r&&(r.close(),r=null,m=null,O=null),t(document).off(".media"),t("#mediaZone, .btn_add, .btn_clear, .btn_search, #btnCloseSearch, #searchInput, .modalX").off(),console.log("🧹 Mediawii · limpiado")};export{we as cleanup,ye as init,ge as render};

import{j as C}from"./vendor-gzd0YkcT.js";import{c as p,N as g,a as $}from"./main-BKpyaKX_.js";import"./main-FJ1tPpNx.js";const U=()=>`
  <div class="image_container">
    <div class="image_layout">
      <!-- LEFT: Visor de Imagen -->
      <div class="image_left">
        <div class="image_zone" id="imageZone">
          <div class="image_placeholder">
            <i class="fas fa-images"></i>
            <h2>Arrastra tus imágenes aquí</h2>
            <p>o <strong>haz doble clic</strong> para seleccionar</p>
            <p class="upload_hint">Soporta: <kbd>JPG</kbd> <kbd>PNG</kbd> <kbd>GIF</kbd> <kbd>WebP</kbd> <kbd>SVG</kbd></p>
          </div>
          
          <div class="image_viewer dpn">
            <img id="mainImage" alt="Imagen principal">
            <div class="image_overlay">
              <button class="btn_zoom_in" title="Acercar"><i class="fas fa-search-plus"></i></button>
              <button class="btn_zoom_out" title="Alejar"><i class="fas fa-search-minus"></i></button>
            </div>
          </div>
        </div>

        <!-- Info y Controles -->
        <div class="image_info dpn">
          <div class="info_left">
            <span class="image_name">Sin imagen</span>
            <span class="image_dimensions">0 x 0</span>
          </div>
          <div class="info_controls">
            <button class="btn_control btn_prev" title="Anterior (←)"><i class="fas fa-chevron-left"></i></button>
            <button class="btn_control btn_download" title="Descargar"><i class="fas fa-download"></i></button>
            <button class="btn_control btn_slideshow" title="Slideshow"><i class="fas fa-play"></i></button>
            <button class="btn_control btn_fullscreen" title="Pantalla completa (F)"><i class="fas fa-expand"></i></button>
            <button class="btn_control btn_next" title="Siguiente (→)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Galería de miniaturas -->
      <div class="image_right">
        <div class="gallery_header">
          <h3><i class="fas fa-image"></i> Galería</h3>
          <div class="gallery_actions">
            <button class="btn_icon btn_add" title="Agregar imágenes"><i class="fas fa-plus"></i></button>
            <button class="btn_icon btn_clear_all" title="Limpiar todo"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        
        <div class="image_gallery" id="imageGallery">
          <div class="gallery_empty">
            <i class="fas fa-folder-open"></i>
            <p>No hay imágenes</p>
            <small>Arrastra o agrega imágenes</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Slideshow -->
  <div class="wiModal" id="slideshowModal">
    <div class="modalBody" style="max-width: 95vw; max-height: 95vh; padding: 0; background: var(--0);">
      <button class="modalX" onclick="window.cerrarModal('slideshowModal')"><i class="fas fa-times"></i></button>
      <div class="slideshow_container">
        <img id="slideshowImage" alt="Slideshow">
        <div class="slideshow_controls">
          <button class="btn_slide_prev"><i class="fas fa-chevron-left"></i></button>
          <button class="btn_slide_play"><i class="fas fa-pause"></i></button>
          <button class="btn_slide_next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="slideshow_counter">
          <span id="slideCounter">1 / 1</span>
        </div>
      </div>
    </div>
  </div>
`,e=C;let i=[],t=0,o=1,m=null;const S=["image/jpeg","image/jpg","image/png","image/gif","image/webp","image/svg+xml"],h=.2,w=.5,k=3,M=18e4,L=a=>{if(a===0)return"0 B";const s=1024,n=["B","KB","MB"],l=Math.floor(Math.log(a)/Math.log(s));return`${(a/Math.pow(s,l)).toFixed(1)} ${n[l]}`},j=(a,s)=>{const n=new Image;n.onload=()=>s(n.width,n.height),n.src=a.src},_=()=>{const a=e("#imageGallery");if(i.length===0){a.html(`
      <div class="gallery_empty">
        <i class="fas fa-folder-open"></i>
        <p>No hay imágenes</p>
        <small>Arrastra o agrega imágenes</small>
      </div>
    `);return}const s=i.map((n,l)=>`
    <div class="gallery_item ${l===t?"active":""}" data-index="${l}">
      <img src="${n.url}" alt="${n.name}">
      <div class="item_overlay">
        <span class="item_name">${n.name}</span>
        <button class="btn_delete_mini" data-index="${l}" title="Eliminar">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `).join("");a.html(s)},x=a=>{const s=Array.from(a);let n=0;s.forEach(l=>{if(!S.includes(l.type)){g(`${l.name} no es un formato válido`,"error",2e3);return}const b=URL.createObjectURL(l);i.push({name:l.name,size:l.size,url:b,type:l.type}),n++}),n>0&&(g(`${n} imagen${n>1?"es":""} agregada${n>1?"s":""}`,"success",2e3),_(),i.length===n&&r(0))},r=a=>{if(a<0||a>=i.length)return;t=a,o=1;const s=i[a],n=e("#mainImage");e(".image_placeholder").addClass("dpn"),e(".image_viewer").removeClass("dpn"),e(".image_info").removeClass("dpn"),e("#imageZone").addClass("viewing"),n[0].src=s.url,n.css("transform","scale(1)"),e(".image_name").text(s.name),j(n[0],(l,b)=>{e(".image_dimensions").text(`${l} x ${b} px · ${L(s.size)}`)}),_()},d=a=>{a==="in"&&o<k?o+=h:a==="out"&&o>w&&(o-=h),o=Math.max(w,Math.min(k,o)),e("#mainImage").css("transform",`scale(${o})`)},f=()=>{t<i.length-1?r(t+1):r(0)},v=()=>{t>0?r(t-1):r(i.length-1)},z=()=>{if(i.length===0)return;const a=i[t],s=document.createElement("a");s.href=a.url,s.download=a.name,s.click(),g("Imagen descargada","success",1500)},y=()=>{const a=e(".image_viewer")[0];document.fullscreenElement?document.exitFullscreen():a.requestFullscreen().catch(()=>{g("Pantalla completa no disponible","error",2e3)})},A=()=>{i.length!==0&&($("slideshowModal"),c(),m=setInterval(()=>{f(),c()},M),e(".btn_slide_play").html('<i class="fas fa-pause"></i>'))},u=()=>{m&&(clearInterval(m),m=null,e(".btn_slide_play").html('<i class="fas fa-play"></i>'))},O=()=>{m?u():(m=setInterval(()=>{f(),c()},M),e(".btn_slide_play").html('<i class="fas fa-pause"></i>'))},c=()=>{if(i.length===0)return;const a=i[t];e("#slideshowImage")[0].src=a.url,e("#slideCounter").text(`${t+1} / ${i.length}`)},I=()=>{const a=e('<input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml" multiple style="display:none;">');a.on("change",function(){this.files.length>0&&x(this.files),a.remove()}),e("body").append(a),a.click()},E=a=>{a.preventDefault(),e("#imageZone").addClass("dragover")},Z=()=>{e("#imageZone").removeClass("dragover")},D=a=>{a.preventDefault(),e("#imageZone").removeClass("dragover");const s=a.originalEvent.dataTransfer?.files;s?.length&&x(s)},P=()=>{window.cerrarModal=p,e("#imageZone").on("dblclick",I).on("dragover",E).on("dragleave",Z).on("drop",D),e(".btn_prev").on("click",v),e(".btn_next").on("click",f),e(".btn_zoom_in").on("click",()=>d("in")),e(".btn_zoom_out").on("click",()=>d("out")),e(".btn_download").on("click",z),e(".btn_fullscreen").on("click",y),e(".btn_slideshow").on("click",A),e("#mainImage").on("wheel",a=>{a.preventDefault(),a.originalEvent.deltaY<0?d("in"):d("out")}),e(document).on("click",".gallery_item",function(){const a=parseInt(e(this).data("index"));r(a)}),e(document).on("click",".btn_delete_mini",function(a){a.stopPropagation();const s=parseInt(e(this).data("index"));URL.revokeObjectURL(i[s].url),i.splice(s,1),s===t&&i.length>0?(t=Math.min(s,i.length-1),r(t)):i.length===0?(e(".image_viewer").addClass("dpn"),e(".image_placeholder").removeClass("dpn"),e(".image_info").addClass("dpn"),e("#imageZone").removeClass("viewing")):s<t&&t--,_(),g("Imagen eliminada","success",1500)}),e(".btn_add").on("click",I),e(".btn_clear_all").on("click",()=>{i.length!==0&&(i.forEach(a=>URL.revokeObjectURL(a.url)),i=[],t=0,e(".image_viewer").addClass("dpn"),e(".image_placeholder").removeClass("dpn"),e(".image_info").addClass("dpn"),e("#imageZone").removeClass("viewing"),_(),g("Todas las imágenes eliminadas","success",2e3))}),e(".btn_slide_prev").on("click",()=>{v(),c()}),e(".btn_slide_next").on("click",()=>{f(),c()}),e(".btn_slide_play").on("click",O),e("#slideshowModal").on("click",function(a){a.target===this&&(u(),p("slideshowModal"))}),e(document).on("keydown",a=>{if(i.length!==0)switch(a.key){case"ArrowLeft":v(),e("#slideshowModal").hasClass("active")&&c();break;case"ArrowRight":f(),e("#slideshowModal").hasClass("active")&&c();break;case"+":case"=":d("in");break;case"-":d("out");break;case"f":case"F":e("#slideshowModal").hasClass("active")||y();break;case"Escape":e("#slideshowModal").hasClass("active")&&(u(),p("slideshowModal"));break}}),console.log("✅ Visor de imágenes cargado")},T=()=>{e("#imageZone, .btn_prev, .btn_next, .btn_zoom_in, .btn_zoom_out, .btn_download, .btn_fullscreen, .btn_slideshow, .btn_add, .btn_clear_all, .btn_slide_prev, .btn_slide_next, .btn_slide_play, #slideshowModal, #mainImage").off(),e(document).off("click",".gallery_item"),e(document).off("click",".btn_delete_mini"),e(document).off("keydown"),u(),i.forEach(a=>URL.revokeObjectURL(a.url)),i=[],delete window.cerrarModal,console.log("🧹 Visor de imágenes limpiado")};export{T as cleanup,P as init,U as render};

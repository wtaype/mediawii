import{j as e}from"./vendor-gzd0YkcT.js";import{N as _,c as w,a as x}from"./main-CrwO8EL-.js";import"./main-7g0wFfK8.js";const P=()=>`
  <div class="image_container">
    <div class="image_layout">
      <div class="image_left">
        <div class="image_zone" id="imageZone">
          <div class="image_placeholder">
            <i class="fas fa-images"></i>
            <h2>Arrastra tus imágenes aquí</h2>
            <p>o <strong>haz doble clic</strong> para seleccionar</p>
            <p class="upload_hint">
              <kbd>JPG</kbd> <kbd>PNG</kbd> <kbd>GIF</kbd> <kbd>WebP</kbd> <kbd>SVG</kbd>
            </p>
            <p class="paste_hint">
              <i class="fas fa-paste"></i> <kbd>Ctrl+V</kbd> para pegar capturas
            </p>
          </div>
          
          <div class="image_viewer dpn">
            <img id="mainImage" alt="Imagen">
            <div class="image_overlay">
              <button class="btn_zoom_in" title="Zoom +"><i class="fas fa-plus"></i></button>
              <button class="btn_zoom_out" title="Zoom -"><i class="fas fa-minus"></i></button>
              <button class="btn_zoom_reset" title="Reset"><i class="fas fa-compress"></i></button>
            </div>
          </div>
        </div>

        <div class="image_info dpn">
          <div class="info_left">
            <span class="image_name"></span>
            <span class="image_dimensions"></span>
          </div>
          <div class="info_controls">
            <button class="btn_control btn_prev" title="Anterior (←)"><i class="fas fa-chevron-left"></i></button>
            <button class="btn_control btn_download" title="Descargar"><i class="fas fa-download"></i></button>
            <button class="btn_control btn_slideshow" title="Slideshow"><i class="fas fa-play"></i></button>
            <button class="btn_control btn_fullscreen" title="Fullscreen (F)"><i class="fas fa-expand"></i></button>
            <button class="btn_control btn_next" title="Siguiente (→)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <div class="image_right">
        <div class="gallery_header">
          <h3><i class="fas fa-images"></i> Galería (<span id="imgCount">0</span>)</h3>
          <div class="gallery_actions">
            <button class="btn_icon btn_add" title="Agregar"><i class="fas fa-plus"></i></button>
            <button class="btn_icon btn_clear" title="Limpiar"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="image_gallery" id="imageGallery"></div>
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
`;let t=[],n=0,c=1,r=null,C=1;const z=["image/jpeg","image/jpg","image/png","image/gif","image/webp","image/svg+xml"],k=.25,E=.5,L=5,I=3e3,O=a=>{if(!a)return"0 B";const s=1024,i=["B","KB","MB"],l=Math.floor(Math.log(a)/Math.log(s));return`${(a/Math.pow(s,l)).toFixed(1)} ${i[l]}`},S=(a,s)=>{const i=new Image;i.onload=()=>s(i.width,i.height),i.src=a.src},u=()=>{const a=e("#imageGallery");if(e("#imgCount").text(t.length),!t.length){a.html('<div class="gallery_empty"><i class="fas fa-folder-open"></i><p>Sin imágenes</p></div>');return}a.html(t.map((s,i)=>`
    <div class="gallery_item ${i===n?"active":""}" data-i="${i}">
      <img src="${s.url}" alt="${s.name}">
      ${s.pasted?'<span class="paste_badge"><i class="fas fa-paste"></i></span>':""}
      <button class="btn_del" data-i="${i}"><i class="fas fa-times"></i></button>
    </div>
  `).join(""))},v=(a,s=!1)=>{let i=0;Array.from(a).forEach(l=>{z.includes(l.type)&&(t.push({name:l.name,size:l.size,url:URL.createObjectURL(l),pasted:s}),i++)}),i&&(_(s?"Captura pegada":`${i} imagen${i>1?"es":""} agregada${i>1?"s":""}`,"success",1500),u(),(t.length===i||s)&&f(s?t.length-1:0))},Z=a=>{const s=a.originalEvent?.clipboardData?.items;if(!s)return;let i=!1;e.each(s,(l,g)=>{if(g.type.startsWith("image/")){const b=g.getAsFile();if(b){const $=new File([b],`Captura_${C++}.png`,{type:b.type});return v([$],!0),i=!0,e("#imageZone").addClass("paste_flash"),setTimeout(()=>e("#imageZone").removeClass("paste_flash"),300),!1}}}),i||_("No se detectó imagen en portapapeles","error",2e3)},f=a=>{if(a<0||a>=t.length)return;n=a,c=1;const s=t[a],i=e("#mainImage");e(".image_placeholder").addClass("dpn"),e(".image_viewer, .image_info").removeClass("dpn"),i[0].src=s.url,i.css("transform","scale(1)"),e(".image_name").text(s.name),S(i[0],(l,g)=>{e(".image_dimensions").text(`${l}×${g} · ${O(s.size)}${s.pasted?" · Pegada":""}`)}),u()},o=a=>{a==="in"?c=Math.min(c+k,L):a==="out"?c=Math.max(c-k,E):c=1,e("#mainImage").css("transform",`scale(${c})`)},m=()=>f(n<t.length-1?n+1:0),h=()=>f(n>0?n-1:t.length-1),F=()=>{if(!t.length)return;const a=document.createElement("a");a.href=t[n].url,a.download=t[n].name,a.click(),_("Descargada","success",1500)},y=()=>{const a=e(".image_viewer")[0];document.fullscreenElement?document.exitFullscreen():a.requestFullscreen().catch(()=>{})},R=()=>{t.length&&(x("slideshowModal"),d(),r=setInterval(()=>{m(),d()},I),e(".btn_slide_play").html('<i class="fas fa-pause"></i>'))},p=()=>{r&&(clearInterval(r),r=null,e(".btn_slide_play").html('<i class="fas fa-play"></i>'))},A=()=>{r?p():(r=setInterval(()=>{m(),d()},I),e(".btn_slide_play").html('<i class="fas fa-pause"></i>'))},d=()=>{t.length&&(e("#slideshowImage")[0].src=t[n].url,e("#slideCounter").text(`${n+1} / ${t.length}`))},M=()=>{const a=e('<input type="file" accept="image/*" multiple style="display:none">');a.on("change",function(){this.files.length&&v(this.files),a.remove()}),e("body").append(a),a.click()},U=()=>{e("#imageZone").on("dblclick",M).on("dragover",a=>{a.preventDefault(),e("#imageZone").addClass("dragover")}).on("dragleave",()=>e("#imageZone").removeClass("dragover")).on("drop",a=>{a.preventDefault(),e("#imageZone").removeClass("dragover"),a.originalEvent.dataTransfer?.files.length&&v(a.originalEvent.dataTransfer.files)}),e(".btn_prev").on("click",h),e(".btn_next").on("click",m),e(".btn_zoom_in").on("click",()=>o("in")),e(".btn_zoom_out").on("click",()=>o("out")),e(".btn_zoom_reset").on("click",()=>o("reset")),e(".btn_download").on("click",F),e(".btn_fullscreen").on("click",y),e(".btn_slideshow").on("click",R),e("#mainImage").on("wheel",a=>{a.preventDefault(),o(a.originalEvent.deltaY<0?"in":"out")}),e(document).on("click",".gallery_item",function(){f(parseInt(e(this).data("i")))}),e(document).on("click",".btn_del",function(a){a.stopPropagation();const s=parseInt(e(this).data("i"));URL.revokeObjectURL(t[s].url),t.splice(s,1),t.length?s===n?f(Math.min(s,t.length-1)):s<n&&n--:(e(".image_viewer, .image_info").addClass("dpn"),e(".image_placeholder").removeClass("dpn")),u()}),e(".btn_add").on("click",M),e(".btn_clear").on("click",()=>{t.length&&(t.forEach(a=>URL.revokeObjectURL(a.url)),t=[],n=0,C=1,e(".image_viewer, .image_info").addClass("dpn"),e(".image_placeholder").removeClass("dpn"),u(),_("Galería limpiada","success",1500))}),e(".btn_slide_prev").on("click",()=>{h(),d()}),e(".btn_slide_next").on("click",()=>{m(),d()}),e(".btn_slide_play").on("click",A),e(".modalX").on("click",()=>{p(),w("slideshowModal")}),e(document).on("paste",Z),e(document).on("keydown",a=>{if(!t.length)return;const s=a.key;s==="ArrowLeft"?(h(),e("#slideshowModal").hasClass("active")&&d()):s==="ArrowRight"?(m(),e("#slideshowModal").hasClass("active")&&d()):s==="+"||s==="="?o("in"):s==="-"?o("out"):s==="0"?o("reset"):s==="f"||s==="F"?y():s==="Escape"&&e("#slideshowModal").hasClass("active")&&(p(),w("slideshowModal"))}),console.log("✅ Visor de imágenes con Paste perfecto cargado")},B=()=>{e("#imageZone, .btn_prev, .btn_next, .btn_zoom_in, .btn_zoom_out, .btn_zoom_reset, .btn_download, .btn_fullscreen, .btn_slideshow, .btn_add, .btn_clear, .modalX, #mainImage").off(),e(document).off("click",".gallery_item"),e(document).off("click",".btn_del"),e(document).off("paste"),e(document).off("keydown"),p(),t.forEach(a=>URL.revokeObjectURL(a.url)),t=[],console.log("🧹 Visor limpiado")};export{B as cleanup,U as init,P as render};

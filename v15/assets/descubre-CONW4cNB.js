import{j as o}from"./vendor-gzd0YkcT.js";import{c as d,y as r,v,l as m,a as f,g,d as i,w as h}from"./main-DmT8Fq5K.js";const b=[{num:"3",label:"Reproductores",icon:"fa-photo-film",color:"#0EBEFF"},{num:"17+",label:"Formatos",icon:"fa-file-video",color:"#7000FF"},{num:"100%",label:"Privado",icon:"fa-shield-halved",color:"#FF5C69"},{num:r(),label:"Actualizado",icon:"fa-calendar-check",color:"#29C72E"}],_=[{icon:"fa-video",color:"#FF5C69",label:"Videos",desc:"MP4 · WebM · OGG · AVI · MOV",url:"/videos"},{icon:"fa-music",color:"#7000FF",label:"Audios",desc:"MP3 · WAV · M4A · FLAC · OGG",url:"/audios"},{icon:"fa-images",color:"#29C72E",label:"Imágenes",desc:"JPG · PNG · GIF · SVG · WebP",url:"/images"}],$=[{icon:"fa-video",color:"Dulce",titulo:"Video Player HD",desc:"Reproduce MP4, WebM, OGG y más con controles profesionales. Velocidad ajustable, loop inteligente y Picture in Picture nativo."},{icon:"fa-wave-square",color:"Mora",titulo:"Audio + Waveform",desc:"Escucha MP3, WAV, M4A con visualizador de ondas en tiempo real gracias a la Web Audio API del navegador."},{icon:"fa-magnifying-glass-plus",color:"Paz",titulo:"Image Viewer",desc:"Visualiza JPG, PNG, GIF, SVG con zoom inteligente, slideshow automático y vista galería en grid."},{icon:"fa-shield-halved",color:"Cielo",titulo:"100% Privado",desc:"Todo el procesamiento es local. Tus archivos nunca salen de tu navegador. Sin servidores, sin rastreo."},{icon:"fa-infinity",color:"Dulce",titulo:"Sin Límites",desc:"Sin restricciones de tamaño, duración ni cantidad de archivos. Reproduce todo lo que quieras."},{icon:"fa-bolt",color:"Paz",titulo:"Ultra Rápido",desc:"Carga instantánea. Sin tiempos de espera. Funciona incluso sin conexión a internet."}],p=[{num:"1",icon:"fa-upload",titulo:"Sube o arrastra",desc:"Drag & drop directo al reproductor. Sin instalación ni registro previo."},{num:"2",icon:"fa-play-circle",titulo:"Reproduce al instante",desc:"Controles profesionales: velocidad, loop, volumen y pantalla completa."},{num:"3",icon:"fa-shield-halved",titulo:"Privacidad total",desc:"Tus archivos nunca se suben al servidor. Siempre en tu dispositivo."}],w=[{avatar:"👩‍💻",nombre:"Ana Rodríguez",rol:"Editora de Contenido",texto:"Con Mediawii reviso mis videos de grabación sin instalar nada. Simple, rápido y mis archivos nunca salen de mi PC.",estrellas:5},{avatar:"👨‍🎵",nombre:"Luis Paredes",rol:"Productor Musical",texto:"El visualizador de waveform en tiempo real es increíble. Escucho mis pistas en cualquier navegador sin depender de apps.",estrellas:5},{avatar:"📸",nombre:"Valeria Castro",rol:"Fotógrafa",texto:"El Image Viewer con zoom y galería es perfecto para revisar mis fotos RAW convertidas. Todo en el navegador, sin drama.",estrellas:5},{avatar:"🎬",nombre:"Rodrigo Huanca",rol:"Videógrafo Freelance",texto:"Uso Mediawii para previsualizar mis clips antes de editar. El Picture in Picture me permite trabajar con el video flotante.",estrellas:5}],C=[{icon:"fas fa-film",label:"HTML5 Video",color:"#FF5C69"},{icon:"fas fa-wave-square",label:"Web Audio API",color:"#7000FF"},{icon:"fab fa-js",label:"JavaScript ES6+",color:"#FFB800"},{icon:"fab fa-css3-alt",label:"CSS3 Moderno",color:"#0EBEFF"},{icon:"fas fa-bolt",label:"Vite",color:"#29C72E"},{icon:"fas fa-mobile-screen",label:"Responsive",color:"#FF8C00"}],A=()=>`
<div class="dc_wrap">

  <!-- ══ HERO ══ -->
  <section class="dc_hero">
    <div class="dc_hero_orb dc_orb1"></div>
    <div class="dc_hero_orb dc_orb2"></div>
    <div class="dc_hero_orb dc_orb3"></div>
    <div class="dc_hero_body">
      <div class="dc_hero_logo">
        <img src="/mediawii/v15/logo.webp" alt="${d}" loading="lazy">
      </div>
      <div class="dc_hero_badge"><i class="fas fa-photo-film"></i> Reproductor Multimedia Profesional</div>
      <h1 class="dc_hero_tit">${d}</h1>
      <p class="dc_hero_sub">
        Tu centro <strong>multimedia</strong> en el navegador.
        Videos HD, audios con waveform y galería de imágenes.
        Todo <strong>100% local</strong>, sin subir tus archivos.
      </p>
      <div class="dc_hero_stats">
        ${b.map(a=>`
          <div class="dc_stat" style="--sc:${a.color}">
            <i class="fas ${a.icon}" style="color:${a.color}"></i>
            <strong>${a.num}</strong>
            <span>${a.label}</span>
          </div>`).join("")}
      </div>
      <div class="dc_hero_btns">
        <a href="/videos" class="dc_btn_p dc_btn_glow"><i class="fas fa-play-circle"></i> Comenzar ahora</a>
        <button class="dc_btn_s" id="dc_compartir"><i class="fas fa-share-nodes"></i> Compartir</button>
      </div>
      <div class="dc_hero_scroll"><i class="fas fa-chevron-down"></i></div>
    </div>
  </section>

  <!-- ══ COUNTER BAND ══ -->
  <div class="dc_counter_band">
    <div class="dc_counter_item">
      <span class="dc_counter_num" data-target="3">0</span>
      <p>Reproductores integrados</p>
    </div>
    <div class="dc_counter_sep"></div>
    <div class="dc_counter_item">
      <span class="dc_counter_num" data-target="17">0</span><span>+</span>
      <p>Formatos de archivo</p>
    </div>
    <div class="dc_counter_sep"></div>
    <div class="dc_counter_item">
      <span class="dc_counter_num" data-target="100">0</span><span>%</span>
      <p>Privado y local</p>
    </div>
    <div class="dc_counter_sep"></div>
    <div class="dc_counter_item">
      <span class="dc_counter_num" data-target="5">0</span>
      <p>Temas de color</p>
    </div>
  </div>

  <!-- ══ REPRODUCTORES ══ -->
  <section class="dc_sec">
    <div class="dc_sec_head">
      <div class="dc_sec_badge"><i class="fas fa-photo-film"></i> Reproductores</div>
      <h2 class="dc_sec_tit">Elige tu <span class="dc_grad">reproductor</span></h2>
      <p class="dc_sec_sub">3 reproductores profesionales para cada tipo de archivo multimedia</p>
    </div>
    <div class="dc_cat_grid">
      ${_.map(a=>`
        <a href="${a.url}" class="dc_cat_card wi_fadeUp" style="--cc:${a.color}">
          <div class="dc_cat_ico"><i class="fas ${a.icon}"></i></div>
          <div class="dc_cat_info">
            <strong>${a.label}</strong>
            <span>${a.desc}</span>
          </div>
          <div class="dc_cat_arr"><i class="fas fa-arrow-right"></i></div>
        </a>`).join("")}
    </div>
  </section>

  <!-- ══ CARACTERÍSTICAS ══ -->
  <section class="dc_sec dc_sec_alt">
    <div class="dc_sec_head">
      <div class="dc_sec_badge"><i class="fas fa-star"></i> Características</div>
      <h2 class="dc_sec_tit">Todo lo que <span class="dc_grad">necesitas</span></h2>
      <p class="dc_sec_sub">Reproductores profesionales con características diseñadas para tu uso diario</p>
    </div>
    <div class="dc_feat_grid">
      ${$.map(a=>`
        <div class="dc_feat_card wi_fadeUp dc_color_${a.color.toLowerCase()}">
          <div class="dc_feat_ico"><i class="fas ${a.icon}"></i></div>
          <h3>${a.titulo}</h3>
          <p>${a.desc}</p>
        </div>`).join("")}
    </div>
  </section>

  <!-- ══ CÓMO FUNCIONA ══ -->
  <section class="dc_sec">
    <div class="dc_sec_head">
      <div class="dc_sec_badge"><i class="fas fa-route"></i> Cómo funciona</div>
      <h2 class="dc_sec_tit">3 pasos para <span class="dc_grad">reproducir tus archivos</span></h2>
      <p class="dc_sec_sub">Sin curva de aprendizaje. Arrastra y reproduce desde el primer segundo</p>
    </div>
    <div class="dc_pasos">
      ${p.map((a,c)=>`
        <div class="dc_paso wi_fadeUp">
          <div class="dc_paso_num">${a.num}</div>
          <div class="dc_paso_ico"><i class="fas ${a.icon}"></i></div>
          <h3>${a.titulo}</h3>
          <p>${a.desc}</p>
        </div>
        ${c<p.length-1?'<div class="dc_paso_sep"><i class="fas fa-chevron-right"></i></div>':""}`).join("")}
    </div>
  </section>

  <!-- ══ TESTIMONIOS ══ -->
  <section class="dc_sec dc_sec_alt">
    <div class="dc_sec_head">
      <div class="dc_sec_badge"><i class="fas fa-comments"></i> Testimonios</div>
      <h2 class="dc_sec_tit">Lo que dicen quienes ya <span class="dc_grad">reproducen mejor</span></h2>
      <p class="dc_sec_sub">Personas reales que disfrutan sus archivos con Mediawii</p>
    </div>
    <div class="dc_test_grid">
      ${w.map(a=>`
        <div class="dc_test_card wi_fadeUp">
          <div class="dc_test_stars">${'<i class="fas fa-star"></i>'.repeat(a.estrellas)}</div>
          <p class="dc_test_txt">"${a.texto}"</p>
          <div class="dc_test_autor">
            <span class="dc_test_avatar">${a.avatar}</span>
            <div>
              <strong>${a.nombre}</strong>
              <span>${a.rol}</span>
            </div>
          </div>
        </div>`).join("")}
    </div>
  </section>

  <!-- ══ TECNOLOGÍA ══ -->
  <section class="dc_sec">
    <div class="dc_sec_head">
      <div class="dc_sec_badge"><i class="fas fa-code"></i> Stack técnico</div>
      <h2 class="dc_sec_tit">Construido con <span class="dc_grad">APIs nativas</span></h2>
      <p class="dc_sec_sub">Sin plugins ni dependencias pesadas. Solo lo mejor del estándar web</p>
    </div>
    <div class="dc_tech_grid">
      ${C.map(a=>`
        <div class="dc_tech_item wi_fadeUp" style="--tc:${a.color}">
          <i class="${a.icon}" style="color:${a.color}"></i>
          <span>${a.label}</span>
        </div>`).join("")}
    </div>
  </section>

  <!-- ══ CTA FINAL ══ -->
  <section class="dc_cta_sec">
    <div class="dc_cta_wrap wi_fadeUp">
      <div class="dc_cta_glow"></div>
      <div class="dc_cta_particles">
        ${Array.from({length:6}).map(()=>'<span class="dc_particle"></span>').join("")}
      </div>
      <div class="dc_cta_inner">
        <span class="dc_cta_emoji">🎬</span>
        <h2>¿Listo para reproducir<br>tus archivos?</h2>
        <p>Sin instalación · Sin registro · 100% gratis para siempre</p>
        <div class="dc_cta_chips">
          ${_.map(a=>`
            <a href="${a.url}" class="dc_chip" style="--cc:${a.color}" ${g(a.desc)}>
              <i class="fas ${a.icon}"></i> ${a.label}
            </a>`).join("")}
        </div>
        <div class="dc_cta_btns">
          <a href="/videos" class="dc_btn_p dc_btn_lg dc_btn_glow"><i class="fas fa-play-circle"></i> Comenzar ahora</a>
          <button class="dc_btn_s dc_btn_lg" id="dc_compartir2"><i class="fas fa-share-nodes"></i> Compartir</button>
        </div>
        <p class="dc_footer_txt">
          ${d} ${v} · Hecho con <i class="fas fa-heart"></i> por
          <a href="${m}" target="_blank" rel="noopener">${f}</a> · ${r()}
        </p>
      </div>
    </div>
  </section>

</div>`,F=()=>{o(".dc_counter_num").each(function(){const a=o(this),c=+a.data("target"),e=1800;let s=null;const t=l=>{s||(s=l);const n=Math.min((l-s)/e,1),u=1-Math.pow(1-n,3);a.text(Math.floor(u*c).toLocaleString()),n<1&&requestAnimationFrame(t)};requestAnimationFrame(t)})},S=()=>{i(".dc_cat_card",null,{anim:"wi_fadeUp",stagger:60}),i(".dc_feat_card",null,{anim:"wi_fadeUp",stagger:80}),i(".dc_paso",null,{anim:"wi_fadeUp",stagger:120}),i(".dc_tech_item",null,{anim:"wi_fadeUp",stagger:60}),i(".dc_test_card",null,{anim:"wi_fadeUp",stagger:80}),i(".dc_cta_wrap",null,{anim:"wi_fadeUp"});const a=o(".dc_counter_band")[0];if(a){const e=new IntersectionObserver(([s])=>{s.isIntersecting&&(F(),e.disconnect())},{threshold:.3});e.observe(a)}const c=e=>{const s=window.location.origin+"/";navigator.share?navigator.share({title:d,text:`🎬 ${d} — Reproduce videos, audios e imágenes en tu navegador`,url:s}).catch(()=>{}):h(s,e,"¡Link copiado! ✨")};o("#dc_compartir").on("click",function(){c(this)}),o("#dc_compartir2").on("click",function(){c(this)}),console.log(`🎬 ${d} ${v} · Descubre ${r()}`)},E=()=>{o("#dc_compartir, #dc_compartir2").off("click"),console.log("🧹 Descubre")};export{E as cleanup,S as init,A as render};

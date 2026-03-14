import{j as n}from"./vendor-gzd0YkcT.js";import{S as p,c as t,g as e,l as m,a as u,y as f,d as a}from"./main-DmT8Fq5K.js";const g=["Videos HD hasta 4K sin límites 🎬","Audios con waveform en tiempo real 🎵","Imágenes con zoom y slideshow 🖼️","100% local, tus archivos nunca se suben 🔒"],h=[{valor:3,label:"Reproductores",sufijo:""},{valor:17,label:"Formatos",sufijo:"+"},{valor:5,label:"Temas visuales",sufijo:""},{valor:100,label:"Privado",sufijo:"%"}],d=[{id:"videos",icon:"fa-video",color:"#FF5C69",nombre:"Video Player",desc:"Reproduce MP4, WebM, OGG y más con controles profesionales",items:[{icon:"fa-gauge-high",name:"Velocidad x0.25–2×",desc:"Control de velocidad preciso"},{icon:"fa-rotate",name:"Loop inteligente",desc:"Repite secciones exactas"},{icon:"fa-display",name:"Picture in Picture",desc:"Ventana flotante sobre apps"}]},{id:"audios",icon:"fa-music",color:"#7000FF",nombre:"Audio Player",desc:"Escucha MP3, WAV, M4A con visualizador de ondas en tiempo real",items:[{icon:"fa-wave-square",name:"Waveform visual",desc:"Web Audio API nativa"},{icon:"fa-list-music",name:"Cola de pistas",desc:"Organiza tu sesión"},{icon:"fa-sliders",name:"Control de volumen",desc:"Ajuste preciso"}]},{id:"images",icon:"fa-images",color:"#29C72E",nombre:"Image Viewer",desc:"Visualiza JPG, PNG, GIF, SVG, WebP con zoom y galería completa",items:[{icon:"fa-magnifying-glass-plus",name:"Zoom inteligente",desc:"Scroll y pinch to zoom"},{icon:"fa-film",name:"Slideshow",desc:"Presentación automática"},{icon:"fa-table-cells",name:"Vista galería",desc:"Grid de miniaturas"}]}],$=[{icon:"fa-shield-halved",titulo:"100% Privado",desc:"Todo el procesamiento es local. Tus archivos nunca salen de tu navegador. Sin servidores, sin rastreo."},{icon:"fa-infinity",titulo:"Sin Límites",desc:"Reproduce todos los archivos que quieras. Sin restricciones de tamaño, duración ni cantidad."},{icon:"fa-bolt",titulo:"Ultra Rápido",desc:"Carga instantánea. Sin tiempos de espera. Funciona incluso sin conexión a internet."}],b=[{icon:"fa-video",color:"#FF5C69",nombre:"Videos",desc:"MP4 · WebM · OGG · AVI · MOV",ruta:"/videos"},{icon:"fa-music",color:"#7000FF",nombre:"Audios",desc:"MP3 · WAV · M4A · FLAC · OGG",ruta:"/audios"},{icon:"fa-images",color:"#29C72E",nombre:"Imágenes",desc:"JPG · PNG · GIF · SVG · WebP",ruta:"/images"}],y=[{num:"01",icon:"fa-upload",titulo:"Sube o arrastra",desc:"Drag & drop directo al reproductor. Sin instalación, sin registro."},{num:"02",icon:"fa-play-circle",titulo:"Reproduce al instante",desc:"Controles profesionales: velocidad, loop, volumen y pantalla completa."},{num:"03",icon:"fa-shield-halved",titulo:"Privacidad total",desc:"Sin servidores. Tus archivos nunca se suben. Siempre en tu dispositivo."}],w=[40,65,30,80,55,45,70,35,60,75,40,85,50,30,65,45,70,55,40,60],F=w.map((i,s)=>`<div class="ini_wb" style="--wh:${i}%;--wd:${s*.07}s"></div>`).join(""),P=i=>`
  <div class="ini_stat">
    <div class="ini_stat_n" data-target="${i.valor}" data-sufijo="${i.sufijo}">0</div>
    <div class="ini_stat_l">${i.label}</div>
  </div>`,C=i=>`
  <a href="${i.ruta}" class="ini_eco_card" style="--ec:${i.color}">
    <div class="ini_eco_ico"><i class="fas ${i.icon}"></i></div>
    <div class="ini_eco_info">
      <strong>${i.nombre}</strong>
      <span>${i.desc}</span>
    </div>
    <i class="fas fa-arrow-right ini_eco_arr"></i>
  </a>`,j=i=>`
  <div class="ini_cat_card" style="--cc:${i.color}">
    <div class="ini_cat_bar"></div>
    <div class="ini_cat_top">
      <div class="ini_cat_ico"><i class="fas ${i.icon}"></i></div>
      <div class="ini_cat_info"><h3>${i.nombre}</h3><p>${i.desc}</p></div>
    </div>
    <ul class="ini_cat_tools">
      ${i.items.map(s=>`
        <li><a href="/${i.id}" class="ini_tool_a">
          <i class="fas ${s.icon}"></i>
          <div><strong>${s.name}</strong><span>${s.desc}</span></div>
          <i class="fas fa-arrow-right ini_ext"></i>
        </a></li>`).join("")}
    </ul>
  </div>`,S=(i,s)=>`
  <div class="ini_about_card" style="--d:${s*.15}s">
    <div class="ini_card_ico"><i class="fas ${i.icon}"></i></div>
    <h3>${i.titulo}</h3>
    <p>${i.desc}</p>
  </div>`,A=(i,s)=>`
  ${s>0?'<div class="ini_step_arr"><i class="fas fa-arrow-right"></i></div>':""}
  <div class="ini_step">
    <div class="ini_step_n">${i.num}</div>
    <div class="ini_step_ico"><i class="fas ${i.icon}"></i></div>
    <h3>${i.titulo}</h3>
    <p>${i.desc}</p>
  </div>`,I=()=>`
<div class="ini_wrap">

  <!-- ===== HERO ===== -->
  <section class="ini_hero">
    <div class="ini_hero_content">

      <div class="ini_saludo" style="--d:0s">
        <span>${p()} </span><span class="ini_wave">👋</span>
      </div>

      <h1 class="ini_titulo" style="--d:.18s">
        Tu centro <span class="ini_grad">multimedia</span> en el navegador
      </h1>

      <div class="ini_roles" style="--d:.36s">
        ${g.map((i,s)=>`<span class="ini_role${s===0?" active":""}">${i}</span>`).join("")}
      </div>

      <p class="ini_sub" style="--d:.54s">
        ${t} reproduce videos, audios e imágenes directamente en tu navegador.
        Sin instalación, sin registro, 100% privado y gratis para siempre.
      </p>

      <div class="ini_stats" id="in_stats" style="--d:.72s">
        ${h.map(P).join("")}
      </div>

      <div class="ini_btns" style="--d:.9s">
        <a href="/videos" class="ini_btn_p"><i class="fas fa-play-circle"></i> Comenzar ahora</a>
        <a href="/images" class="ini_btn_s"><i class="fas fa-images"></i> Ver galería</a>
      </div>

    </div>

    <!-- Derecha: media player preview -->
    <div class="ini_hero_visual">
      <div class="ini_media_card" style="--d:.3s">
        <div class="ini_code_hd">
          <div class="ini_code_dots">
            <span style="background:#FF5F57"></span>
            <span style="background:#FFBD2E"></span>
            <span style="background:#28CA41"></span>
          </div>
          <span class="ini_code_fname"><i class="fas fa-photo-film"></i> mediawii</span>
          <span class="ini_code_live"><i class="fas fa-circle"></i> Activo</span>
        </div>

        <div class="ini_mc_screen">
          <div class="ini_mc_overlay">
            <div class="ini_mc_play_btn"><i class="fas fa-play"></i></div>
          </div>
          <div class="ini_mc_bottom">
            <div class="ini_mc_prog">
              <div class="ini_mc_track"><div class="ini_mc_fill"></div></div>
              <span class="ini_mc_time">1:24 / 3:48</span>
            </div>
            <div class="ini_mc_ctrls">
              <i class="fas fa-backward-step"></i>
              <i class="fas fa-circle-pause ini_mc_main"></i>
              <i class="fas fa-forward-step"></i>
              <i class="fas fa-volume-high"></i>
              <i class="fas fa-expand" style="margin-left:auto"></i>
            </div>
          </div>
        </div>

        <div class="ini_mc_audio">
          <i class="fas fa-music ini_mc_audio_ico"></i>
          <div class="ini_mc_wave">${F}</div>
        </div>

        <div class="ini_mc_gallery">
          <i class="fas fa-images ini_mc_gallery_ico"></i>
          <div class="ini_mc_strip">
            <div class="ini_mc_thumb" style="--tc:#FF5C69"><i class="fas fa-image"></i></div>
            <div class="ini_mc_thumb ini_mc_thumb_act" style="--tc:#7000FF"><i class="fas fa-image"></i></div>
            <div class="ini_mc_thumb" style="--tc:#29C72E"><i class="fas fa-image"></i></div>
            <div class="ini_mc_thumb" style="--tc:#FFB800"><i class="fas fa-image"></i></div>
            <div class="ini_mc_more">+14</div>
          </div>
        </div>
      </div>

      <div class="ini_ftech ini_ft1" style="--d:.5s"  ${e("Videos HD")}><i class="fas fa-video"></i></div>
      <div class="ini_ftech ini_ft2" style="--d:.65s" ${e("Audio + Waveform")}><i class="fas fa-music"></i></div>
      <div class="ini_ftech ini_ft3" style="--d:.8s"  ${e("17+ Formatos")}><i class="fas fa-film"></i></div>
      <div class="ini_ftech ini_ft4" style="--d:.95s" ${e("100% Privado")}><i class="fas fa-lock"></i></div>
    </div>
  </section>

  <!-- ===== REPRODUCTORES ===== -->
  <section class="ini_eco_sec">
    <div class="ini_eco_label">Elige tu <span class="ini_grad">reproductor</span></div>
    <div class="ini_eco_grid">${b.map(C).join("")}</div>
  </section>

  <!-- ===== FUNCIONALIDADES ===== -->
  <section class="ini_cats_sec">
    <div class="ini_sec_head">
      <h2 class="ini_sec_tit">Todo lo que <span class="ini_grad">necesitas</span></h2>
      <div class="ini_sec_line"></div>
      <p class="ini_sec_desc">Tres reproductores profesionales para cada tipo de archivo</p>
    </div>
    <div class="ini_cats_grid">${d.map(j).join("")}</div>
  </section>

  <!-- ===== CÓMO FUNCIONA ===== -->
  <section class="ini_steps_sec">
    <div class="ini_sec_head">
      <h2 class="ini_sec_tit">¿Cómo <span class="ini_grad">funciona?</span></h2>
      <div class="ini_sec_line"></div>
      <p class="ini_sec_desc">Tres pasos para reproducir cualquier archivo</p>
    </div>
    <div class="ini_steps_grid">${y.map(A).join("")}</div>
  </section>

  <!-- ===== ¿POR QUÉ? ===== -->
  <section class="ini_about_sec">
    <div class="ini_sec_head">
      <h2 class="ini_sec_tit">¿Por qué <span class="ini_grad">${t}?</span></h2>
      <div class="ini_sec_line"></div>
    </div>
    <div class="ini_about_grid">${$.map(S).join("")}</div>
  </section>

  <!-- ===== CTA ===== -->
  <section class="ini_cta_sec">
    <div class="ini_cta_wrap">
      <i class="fas fa-play-circle ini_cta_ico"></i>
      <h2>¿Listo para disfrutar tus archivos? 🎬</h2>
      <p>Sin instalación · Sin registro · 100% gratis para siempre</p>
      <div class="ini_cta_chips">
        ${d.map(i=>`<a href="/${i.id}" class="ini_chip" style="--cc:${i.color}" ${e(i.desc)}><i class="fas ${i.icon}"></i> ${i.nombre}</a>`).join("")}
      </div>
      <p class="ini_cta_autor">Hecho con ❤️ por <a href="${m}" target="_blank" rel="noopener">${u}</a> © ${f()}</p>
    </div>
  </section>

</div>`;let r=null;const O=()=>{let i=0;const s=n(".ini_role");r=setInterval(()=>{s.removeClass("active"),s.eq(i=(i+1)%s.length).addClass("active")},2800),a("#in_stats",()=>{n(".ini_stat_n").each(function(){const c=n(this),o=+c.data("target"),_=c.data("sufijo")||"";let l=0;const v=setInterval(()=>{l+=o/50,l>=o?(c.text(o+_),clearInterval(v)):c.text(Math.floor(l))},28)})}),a(".ini_cat_card",null,{anim:"wi_fadeUp",stagger:120}),a(".ini_about_card",null,{anim:"wi_fadeUp",stagger:140}),a(".ini_step",null,{anim:"wi_fadeUp",stagger:160}),a(".ini_cta_wrap",null,{anim:"wi_fadeUp"}),a(".ini_sec_head",null,{anim:"wi_fadeUp"}),a(".ini_eco_card",null,{anim:"wi_fadeUp",stagger:100}),console.log(`🚀 ${t} · Inicio OK`)},R=()=>{clearInterval(r),n(document).off(".inicio")};export{R as cleanup,O as init,I as render};

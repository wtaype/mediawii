import './descubre.css';
import $ from 'jquery';
import { app, version, autor, linkme } from '../wii.js';
import { wiVista, year, wiTip, wicopy } from '../widev.js';

// ============================================================
// 📦 DATA
// ============================================================
const stats = [
  { num: '3',    label: 'Reproductores',  icon: 'fa-photo-film',     color: '#0EBEFF' },
  { num: '17+',  label: 'Formatos',       icon: 'fa-file-video',     color: '#7000FF' },
  { num: '100%', label: 'Privado',        icon: 'fa-shield-halved',  color: '#FF5C69' },
  { num: year(), label: 'Actualizado',    icon: 'fa-calendar-check', color: '#29C72E' },
];

const reproductores = [
  { icon: 'fa-video',  color: '#FF5C69', label: 'Videos',   desc: 'MP4 · WebM · OGG · AVI · MOV', url: '/videos' },
  { icon: 'fa-music',  color: '#7000FF', label: 'Audios',   desc: 'MP3 · WAV · M4A · FLAC · OGG',  url: '/audios' },
  { icon: 'fa-images', color: '#29C72E', label: 'Imágenes', desc: 'JPG · PNG · GIF · SVG · WebP',   url: '/images' },
];

const beneficios = [
  { icon: 'fa-video',               color: 'Dulce', titulo: 'Video Player HD',
    desc: 'Reproduce MP4, WebM, OGG y más con controles profesionales. Velocidad ajustable, loop inteligente y Picture in Picture nativo.' },
  { icon: 'fa-wave-square',         color: 'Mora',  titulo: 'Audio + Waveform',
    desc: 'Escucha MP3, WAV, M4A con visualizador de ondas en tiempo real gracias a la Web Audio API del navegador.' },
  { icon: 'fa-magnifying-glass-plus', color: 'Paz', titulo: 'Image Viewer',
    desc: 'Visualiza JPG, PNG, GIF, SVG con zoom inteligente, slideshow automático y vista galería en grid.' },
  { icon: 'fa-shield-halved',       color: 'Cielo', titulo: '100% Privado',
    desc: 'Todo el procesamiento es local. Tus archivos nunca salen de tu navegador. Sin servidores, sin rastreo.' },
  { icon: 'fa-infinity',            color: 'Dulce', titulo: 'Sin Límites',
    desc: 'Sin restricciones de tamaño, duración ni cantidad de archivos. Reproduce todo lo que quieras.' },
  { icon: 'fa-bolt',                color: 'Paz',   titulo: 'Ultra Rápido',
    desc: 'Carga instantánea. Sin tiempos de espera. Funciona incluso sin conexión a internet.' },
];

const pasos = [
  { num: '1', icon: 'fa-upload',        titulo: 'Sube o arrastra',      desc: 'Drag & drop directo al reproductor. Sin instalación ni registro previo.' },
  { num: '2', icon: 'fa-play-circle',   titulo: 'Reproduce al instante', desc: 'Controles profesionales: velocidad, loop, volumen y pantalla completa.' },
  { num: '3', icon: 'fa-shield-halved', titulo: 'Privacidad total',      desc: 'Tus archivos nunca se suben al servidor. Siempre en tu dispositivo.' },
];

const testimonios = [
  { avatar: '👩‍💻', nombre: 'Ana Rodríguez',  rol: 'Editora de Contenido',
    texto: 'Con Mediawii reviso mis videos de grabación sin instalar nada. Simple, rápido y mis archivos nunca salen de mi PC.', estrellas: 5 },
  { avatar: '👨‍🎵', nombre: 'Luis Paredes',   rol: 'Productor Musical',
    texto: 'El visualizador de waveform en tiempo real es increíble. Escucho mis pistas en cualquier navegador sin depender de apps.', estrellas: 5 },
  { avatar: '📸',  nombre: 'Valeria Castro',  rol: 'Fotógrafa',
    texto: 'El Image Viewer con zoom y galería es perfecto para revisar mis fotos RAW convertidas. Todo en el navegador, sin drama.', estrellas: 5 },
  { avatar: '🎬',  nombre: 'Rodrigo Huanca',  rol: 'Videógrafo Freelance',
    texto: 'Uso Mediawii para previsualizar mis clips antes de editar. El Picture in Picture me permite trabajar con el video flotante.', estrellas: 5 },
];

const tecnologias = [
  { icon: 'fas fa-film',          label: 'HTML5 Video',    color: '#FF5C69' },
  { icon: 'fas fa-wave-square',   label: 'Web Audio API',  color: '#7000FF' },
  { icon: 'fab fa-js',            label: 'JavaScript ES6+',color: '#FFB800' },
  { icon: 'fab fa-css3-alt',      label: 'CSS3 Moderno',   color: '#0EBEFF' },
  { icon: 'fas fa-bolt',          label: 'Vite',           color: '#29C72E' },
  { icon: 'fas fa-mobile-screen', label: 'Responsive',     color: '#FF8C00' },
];

// ============================================================
// 🎨 RENDER
// ============================================================
export const render = () => `
<div class="dc_wrap">

  <!-- ══ HERO ══ -->
  <section class="dc_hero">
    <div class="dc_hero_orb dc_orb1"></div>
    <div class="dc_hero_orb dc_orb2"></div>
    <div class="dc_hero_orb dc_orb3"></div>
    <div class="dc_hero_body">
      <div class="dc_hero_logo">
        <img src="${import.meta.env.BASE_URL}logo.webp" alt="${app}" loading="lazy">
      </div>
      <div class="dc_hero_badge"><i class="fas fa-photo-film"></i> Reproductor Multimedia Profesional</div>
      <h1 class="dc_hero_tit">${app}</h1>
      <p class="dc_hero_sub">
        Tu centro <strong>multimedia</strong> en el navegador.
        Videos HD, audios con waveform y galería de imágenes.
        Todo <strong>100% local</strong>, sin subir tus archivos.
      </p>
      <div class="dc_hero_stats">
        ${stats.map(s => `
          <div class="dc_stat" style="--sc:${s.color}">
            <i class="fas ${s.icon}" style="color:${s.color}"></i>
            <strong>${s.num}</strong>
            <span>${s.label}</span>
          </div>`).join('')}
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
      ${reproductores.map(r => `
        <a href="${r.url}" class="dc_cat_card wi_fadeUp" style="--cc:${r.color}">
          <div class="dc_cat_ico"><i class="fas ${r.icon}"></i></div>
          <div class="dc_cat_info">
            <strong>${r.label}</strong>
            <span>${r.desc}</span>
          </div>
          <div class="dc_cat_arr"><i class="fas fa-arrow-right"></i></div>
        </a>`).join('')}
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
      ${beneficios.map(f => `
        <div class="dc_feat_card wi_fadeUp dc_color_${f.color.toLowerCase()}">
          <div class="dc_feat_ico"><i class="fas ${f.icon}"></i></div>
          <h3>${f.titulo}</h3>
          <p>${f.desc}</p>
        </div>`).join('')}
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
      ${pasos.map((p, i) => `
        <div class="dc_paso wi_fadeUp">
          <div class="dc_paso_num">${p.num}</div>
          <div class="dc_paso_ico"><i class="fas ${p.icon}"></i></div>
          <h3>${p.titulo}</h3>
          <p>${p.desc}</p>
        </div>
        ${i < pasos.length - 1 ? '<div class="dc_paso_sep"><i class="fas fa-chevron-right"></i></div>' : ''}`
      ).join('')}
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
      ${testimonios.map(t => `
        <div class="dc_test_card wi_fadeUp">
          <div class="dc_test_stars">${'<i class="fas fa-star"></i>'.repeat(t.estrellas)}</div>
          <p class="dc_test_txt">"${t.texto}"</p>
          <div class="dc_test_autor">
            <span class="dc_test_avatar">${t.avatar}</span>
            <div>
              <strong>${t.nombre}</strong>
              <span>${t.rol}</span>
            </div>
          </div>
        </div>`).join('')}
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
      ${tecnologias.map(t => `
        <div class="dc_tech_item wi_fadeUp" style="--tc:${t.color}">
          <i class="${t.icon}" style="color:${t.color}"></i>
          <span>${t.label}</span>
        </div>`).join('')}
    </div>
  </section>

  <!-- ══ CTA FINAL ══ -->
  <section class="dc_cta_sec">
    <div class="dc_cta_wrap wi_fadeUp">
      <div class="dc_cta_glow"></div>
      <div class="dc_cta_particles">
        ${Array.from({length:6}).map(()=>'<span class="dc_particle"></span>').join('')}
      </div>
      <div class="dc_cta_inner">
        <span class="dc_cta_emoji">🎬</span>
        <h2>¿Listo para reproducir<br>tus archivos?</h2>
        <p>Sin instalación · Sin registro · 100% gratis para siempre</p>
        <div class="dc_cta_chips">
          ${reproductores.map(r => `
            <a href="${r.url}" class="dc_chip" style="--cc:${r.color}" ${wiTip(r.desc)}>
              <i class="fas ${r.icon}"></i> ${r.label}
            </a>`).join('')}
        </div>
        <div class="dc_cta_btns">
          <a href="/videos" class="dc_btn_p dc_btn_lg dc_btn_glow"><i class="fas fa-play-circle"></i> Comenzar ahora</a>
          <button class="dc_btn_s dc_btn_lg" id="dc_compartir2"><i class="fas fa-share-nodes"></i> Compartir</button>
        </div>
        <p class="dc_footer_txt">
          ${app} ${version} · Hecho con <i class="fas fa-heart"></i> por
          <a href="${linkme}" target="_blank" rel="noopener">${autor}</a> · ${year()}
        </p>
      </div>
    </div>
  </section>

</div>`;

// ============================================================
// 🔢 COUNTER ANIMATION
// ============================================================
const _animateCounters = () => {
  $('.dc_counter_num').each(function () {
    const $el = $(this), target = +$el.data('target'), duration = 1800;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      $el.text(Math.floor(ease * target).toLocaleString());
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
};

// ============================================================
// ⚡ INIT
// ============================================================
export const init = () => {
  wiVista('.dc_cat_card',  null, { anim: 'wi_fadeUp', stagger: 60  });
  wiVista('.dc_feat_card', null, { anim: 'wi_fadeUp', stagger: 80  });
  wiVista('.dc_paso',      null, { anim: 'wi_fadeUp', stagger: 120 });
  wiVista('.dc_tech_item', null, { anim: 'wi_fadeUp', stagger: 60  });
  wiVista('.dc_test_card', null, { anim: 'wi_fadeUp', stagger: 80  });
  wiVista('.dc_cta_wrap',  null, { anim: 'wi_fadeUp' });

  const $band = $('.dc_counter_band')[0];
  if ($band) {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { _animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe($band);
  }

  const _share = (el) => {
    const url = window.location.origin + '/';
    if (navigator.share) {
      navigator.share({ title: app, text: `🎬 ${app} — Reproduce videos, audios e imágenes en tu navegador`, url }).catch(() => {});
    } else {
      wicopy(url, el, '¡Link copiado! ✨');
    }
  };

  $('#dc_compartir').on('click',  function () { _share(this); });
  $('#dc_compartir2').on('click', function () { _share(this); });

  console.log(`🎬 ${app} ${version} · Descubre ${year()}`);
};

export const cleanup = () => {
  $('#dc_compartir, #dc_compartir2').off('click');
  console.log('🧹 Descubre');
};

import './nuevo.css';
import $ from 'jquery';
import { wiAuth, wiSpin, Notificacion, Mensaje, wiTip } from '../widev.js';
import { db } from '../smile/firebase.js';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { COL, getPost, clearPostCache, clearBlogCache } from './devblog.js';
import { wiPath } from '../rutas/rutadev.js';

const CATEGORIAS = ['Animales','Naturaleza','Amor','Inspiración','Vida'];
const toSlug = s => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/\b(el|la|los|las|de|del|en|un|una|y|a|con|por|para|que|es|se)\b/g,' ')
  .replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,'_').replace(/_{2,}/g,'_').replace(/^_|_$/g,'').slice(0,50);
const countWords = html => { const t=html.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean); return { words:t.length, min:Math.max(1,Math.ceil(t.length/200)) }; };

// ── Detectar modo edición ─────────────────────────────────────
const getEditSlug = () => wiPath.params()?.edit || new URLSearchParams(location.search).get('edit') || null;

export const render = () => {
  if (!wiAuth.user?.usuario) return `<div class="nu_err dpvc"><i class="fas fa-lock"></i><h2>Acceso restringido</h2><p>Inicia sesión para crear historias</p></div>`;
  const u = wiAuth.user;
  const editSlug = getEditSlug();
  return `
  <div class="nu_wrap">
    <div class="nu_head">
      <div class="nu_head_left"><h1><i class="fas fa-${editSlug?'pen':'pen-fancy'}"></i> ${editSlug?'Editar historia':'Nueva historia'}</h1><p>${editSlug?`Editando: <strong>${editSlug}</strong> ✏️`:'Comparte una historia que inspire 🐾'}</p></div>
      <div class="nu_head_right">
        ${editSlug?`<a href="/${editSlug}" class="nu_btn_outline" ${wiTip('Ver post')}><i class="fas fa-eye"></i> Ver</a>`:`<button type="button" id="nu_preview_pg" class="nu_btn_outline" ${wiTip('Preview')}><i class="fas fa-eye"></i> Preview</button>`}
        <button type="submit" form="nu_form" id="nu_submit" class="nu_btn_submit"><i class="fas fa-${editSlug?'save':'paper-plane'}"></i> ${editSlug?'Guardar':'Publicar'}</button>
      </div>
    </div>
    <form id="nu_form" autocomplete="off"><div class="nu_layout">
      <div class="nu_left">
        <div class="nu_card">
          <div class="nu_card_title"><i class="fas fa-heading"></i> Título</div>
          <input id="nu_titulo" type="text" class="nu_titulo_inp" placeholder="El perro que salvó a su familia..." maxlength="100" required/>
          <div class="nu_slug_box">
            <span class="nu_slug_label"><i class="fas fa-link"></i> historiawi.web.app/</span>
            <input id="nu_slug_inp" type="text" placeholder="mi_historia" maxlength="50" spellcheck="false" ${editSlug?'readonly':''}/>
            ${editSlug?'':`<button type="button" id="nu_slug_reset" class="nu_slug_btn" ${wiTip('Regenerar')}><i class="fas fa-rotate"></i></button>`}
          </div>
          <div id="nu_slug_status" class="nu_slug_status">${editSlug?'<span class="ok"><i class="fas fa-lock"></i> Slug bloqueado (edición)</span>':''}</div>
        </div>
        <div class="nu_card">
          <div class="nu_card_title"><i class="fas fa-align-left"></i> Resumen</div>
          <textarea id="nu_resumen" rows="3" maxlength="160" placeholder="Describe en pocas palabras..."></textarea>
          <div class="nu_counter"><span id="nu_resumen_cnt">0</span>/160</div>
        </div>
        <div class="nu_card nu_card_editor">
          <div class="nu_card_title_row">
            <span><i class="fas fa-code"></i> Contenido HTML</span>
            <div class="nu_editor_tabs">
              <button type="button" class="nu_tab active" data-tab="edit"><i class="fas fa-code"></i> Editor</button>
              <button type="button" class="nu_tab" data-tab="prev"><i class="fas fa-eye"></i> Preview</button>
            </div>
          </div>
          <div class="nu_toolbar">${[['fa-bold','<strong>texto</strong>'],['fa-italic','<em>texto</em>'],['fa-heading','<h2>Título</h2>'],['fa-quote-left','<blockquote>cita</blockquote>'],['fa-list-ul','<ul>\n  <li>item</li>\n</ul>'],['fa-image','<img src="url" alt="desc"/>'],['fa-link','<a href="url">texto</a>']].map(([ic,tag])=>`<button type="button" class="nu_tool" data-tag='${tag}' ${wiTip(ic)}><i class="fas ${ic}"></i></button>`).join('')}</div>
          <textarea id="nu_contenido" class="nu_code" rows="18" placeholder="<p>Había una vez...</p>"></textarea>
          <div id="nu_prev_html" class="nu_html_prev dpn"></div>
          <div class="nu_content_footer"><span id="nu_palabras" class="nu_hint"><i class="fas fa-font"></i> 0 palabras</span><span id="nu_lectura" class="nu_hint"><i class="fas fa-clock"></i> 1 min</span></div>
        </div>
      </div>
      <div class="nu_right">
        <div class="nu_card nu_card_publish">
          <div class="nu_card_title"><i class="fas fa-rocket"></i> ${editSlug?'Actualizar':'Publicar'}</div>
          <div class="nu_publish_opts">
            <label class="nu_check_l"><input type="checkbox" id="nu_activo" checked/><span><i class="fas fa-eye"></i> Visible</span></label>
            <label class="nu_check_l"><input type="checkbox" id="nu_destacado"/><span><i class="fas fa-star"></i> Destacado</span></label>
          </div>
          <button type="submit" form="nu_form" class="nu_btn_submit nu_btn_full"><i class="fas fa-${editSlug?'save':'paper-plane'}"></i> ${editSlug?'Guardar cambios':'Publicar'}</button>
        </div>
        <div class="nu_card">
          <div class="nu_card_title"><i class="fas fa-folder"></i> Categoría</div>
          <div class="nu_cats_grid">${CATEGORIAS.map((c,i)=>`<label class="nu_cat_opt"><input type="radio" name="nu_cat" value="${c}" ${i===0?'checked':''}/><span>${c}</span></label>`).join('')}</div>
        </div>
        <div class="nu_card">
          <div class="nu_card_title"><i class="fas fa-image"></i> Imagen</div>
          <input id="nu_img" type="url" placeholder="https://cdn.pixabay.com/..."/>
          <div id="nu_img_prev" class="nu_img_prev dpn"><img id="nu_img_el" src="" alt=""/><button type="button" id="nu_img_clear" class="nu_img_clear" ${wiTip('Quitar')}><i class="fas fa-xmark"></i></button></div>
        </div>
        <div class="nu_card">
          <div class="nu_card_title"><i class="fas fa-tags"></i> Tags</div>
          <input id="nu_tags_inp" type="text" placeholder="Tag + Enter"/>
          <div id="nu_tags_box" class="nu_tags_box"></div>
        </div>
        <div class="nu_card nu_card_autor">
          <div class="nu_card_title"><i class="fas fa-user-pen"></i> Autor</div>
          <div class="nu_autor_info"><div class="nu_autor_av"><i class="fas fa-user-circle"></i></div><div><strong>${u?.nombre||u?.usuario||'Anónimo'}</strong><span>${u?.email||''}</span></div></div>
        </div>
      </div>
    </div></form>
  </div>`;
};

export const init = async () => {
  if (!wiAuth.user?.usuario) return;
  const editSlug = getEditSlug();
  let tags=[], sT, iT, scT, isEdit = !!editSlug;

  const genSlug = ()=> toSlug($('#nu_titulo').val());
  const updCount = ()=>{ const{words,min}=countWords($('#nu_contenido').val()); $('#nu_palabras').html(`<i class="fas fa-font"></i> ${words} palabras`); $('#nu_lectura').html(`<i class="fas fa-clock"></i> ${min} min`); };
  const renderTags = ()=> $('#nu_tags_box').html(tags.map((t,i)=>`<span class="nu_tag_chip">#${t} <i class="fas fa-xmark nu_tag_rm" data-i="${i}"></i></span>`).join(''));

  // ── CARGAR POST PARA EDICIÓN ────────────────────────────────
  if (isEdit) {
    try {
      const result = await getPost(editSlug, true); // force para tener datos frescos
      if (!result?.data) { Notificacion('Post no encontrado','error'); return; }
      const p = result.data;

      // Rellenar formulario
      $('#nu_titulo').val(p.titulo);
      $('#nu_slug_inp').val(p.slug || p.id);
      $('#nu_resumen').val(p.resumen || '').trigger('input');
      $('#nu_contenido').val(p.contenido || '');
      $('#nu_img').val(p.imagen || '');
      $('#nu_activo').prop('checked', p.activo !== false);
      $('#nu_destacado').prop('checked', !!p.destacado);

      // Categoría
      if (p.categoria) $(`input[name="nu_cat"][value="${p.categoria}"]`).prop('checked', true);

      // Tags
      tags = Array.isArray(p.tags) ? [...p.tags] : [];
      renderTags();

      // Imagen preview
      if (p.imagen) {
        $('#nu_img_el').attr('src', p.imagen);
        $('#nu_img_prev').removeClass('dpn');
      }

      // Actualizar contadores
      $('#nu_resumen_cnt').text((p.resumen||'').length);
      updCount();

    } catch(e) { console.error('edit load:', e); Notificacion('Error cargando post','error'); }
  }

  // ── EVENTOS COMUNES ─────────────────────────────────────────
  if (!isEdit) {
    $('#nu_titulo').on('input', function(){ clearTimeout(sT); sT=setTimeout(()=>{ if(!$('#nu_slug_inp').data('m')) $('#nu_slug_inp').val(genSlug()).trigger('input'); },400); });
    $('#nu_slug_inp').on('input', function(){ $(this).data('m',true); $(this).val($(this).val().replace(/[^a-z0-9_]/gi,s=>s===' '?'_':'').toLowerCase().replace(/_{2,}/g,'_'));
      clearTimeout(scT); const v=$(this).val(), $s=$('#nu_slug_status'); if(!v) return $s.html('').removeClass('ok err');
      $s.html('<i class="fas fa-spinner fa-spin"></i>').removeClass('ok err');
      scT=setTimeout(async()=>{ if(v.length<3) return $s.html('<i class="fas fa-exclamation"></i> Muy corto').addClass('err').removeClass('ok');
        const snap=await getDoc(doc(db,COL,v)).catch(()=>null); snap?.exists() ? $s.html('<i class="fas fa-xmark"></i> Ya existe').addClass('err').removeClass('ok') : $s.html('<i class="fas fa-check"></i> OK').addClass('ok').removeClass('err');
      },600);
    });
    $('#nu_slug_reset').on('click',()=>{ $('#nu_slug_inp').removeData('m').val(genSlug()).trigger('input'); });
  }

  $('#nu_resumen').on('input', function(){ $('#nu_resumen_cnt').text($(this).val().length); });
  $('#nu_img').on('input', function(){ clearTimeout(iT); iT=setTimeout(()=>{ const u=$(this).val().trim(); if(!u) return $('#nu_img_prev').addClass('dpn');
    $('#nu_img_el').attr('src',u).off('load error').on('load',()=>$('#nu_img_prev').removeClass('dpn')).on('error',()=>$('#nu_img_prev').addClass('dpn'));
  },600); });
  $('#nu_img_clear').on('click',()=>{ $('#nu_img').val(''); $('#nu_img_prev').addClass('dpn'); });
  $('#nu_contenido').on('input', updCount);
  $('#nu_tags_inp').on('keydown', function(e){ if(e.key!=='Enter'&&e.key!==',') return; e.preventDefault(); const t=$(this).val().trim().toLowerCase().replace(/\s+/g,'_'); if(t&&!tags.includes(t)&&tags.length<8){ tags.push(t); renderTags(); } $(this).val(''); });

  $(document)
    .on('click.nuevo','.nu_tool', function(){ const tag=$(this).data('tag'),$ta=$('#nu_contenido'),ta=$ta[0],s=ta.selectionStart,e=ta.selectionEnd,sel=ta.value.substring(s,e)||'texto';
      const ins=tag.replace('texto',sel).replace('cita',sel); $ta.val(ta.value.substring(0,s)+ins+ta.value.substring(e)); ta.focus();ta.selectionStart=s;ta.selectionEnd=s+ins.length; updCount(); })
    .on('click.nuevo','.nu_tab', function(){ const t=$(this).data('tab'); $('.nu_tab').removeClass('active');$(this).addClass('active');
      t==='prev' ? ($('#nu_prev_html').html($('#nu_contenido').val()).removeClass('dpn'),$('#nu_contenido').addClass('dpn')) : ($('#nu_contenido').removeClass('dpn'),$('#nu_prev_html').addClass('dpn')); })
    .on('click.nuevo','.nu_tag_rm', function(){ tags.splice(+$(this).data('i'),1); renderTags(); });

  // ── SUBMIT: CREAR o ACTUALIZAR ──────────────────────────────
  $('#nu_form').on('submit', async function(e){
    e.preventDefault(); const $btn=$('#nu_submit,.nu_btn_full'), u=wiAuth.user;
    const [titulo,resumen,cat,img,contenido,slug] = [$('#nu_titulo').val().trim(),$('#nu_resumen').val().trim(),$('input[name="nu_cat"]:checked').val(),$('#nu_img').val().trim(),$('#nu_contenido').val().trim(),$('#nu_slug_inp').val().trim()];
    if(!titulo||!resumen||!cat||!img||!contenido) return Notificacion('Completa todos los campos','warning');
    if(contenido.length<50) return Notificacion('Contenido muy corto','warning');
    if(!slug||slug.length<3) return Notificacion('Slug inválido','warning');
    if(!isEdit && $('#nu_slug_status').hasClass('err')) return Notificacion('Slug no disponible','error');

    wiSpin($btn, true, isEdit ? 'Guardando...' : 'Publicando...');

    try {
      const tiempo_lectura = `${countWords(contenido).min} min`;

      if (isEdit) {
        // ── MODO EDICIÓN: updateDoc ───────────────────────────
        await updateDoc(doc(db, COL, editSlug), {
          activo: $('#nu_activo').is(':checked'),
          destacado: $('#nu_destacado').is(':checked'),
          titulo, resumen, categoria: cat, contenido,
          imagen: img, imagenAlt: titulo,
          tags, tiempo_lectura,
          actualizado: serverTimestamp()
        });
        // Limpiar caches del post editado
        clearPostCache(editSlug);
        clearBlogCache();
        Mensaje('¡Historia actualizada! 🐾✨', 'success');
        setTimeout(() => import('../rutas/ruta.js').then(m => m.rutas.navigate(`/${editSlug}`)), 1200);

      } else {
        // ── MODO CREAR: setDoc ────────────────────────────────
        if ((await getDoc(doc(db, COL, slug))).exists()) return wiSpin($btn, false), Notificacion('Slug existente','warning');
        await setDoc(doc(db, COL, slug), {
          id: slug, slug,
          activo: $('#nu_activo').is(':checked'),
          destacado: $('#nu_destacado').is(':checked'),
          usuario: u.usuario, email: u.email,
          autor: u.nombre || u.usuario,
          titulo, resumen, categoria: cat, contenido,
          imagen: img, imagenAlt: titulo,
          tags, vistas: 0, tiempo_lectura,
          creado: serverTimestamp(), actualizado: serverTimestamp()
        });
        clearBlogCache();
        Mensaje('¡Historia publicada! 🐾✨', 'success');
        setTimeout(() => import('../rutas/ruta.js').then(m => m.rutas.navigate(`/${slug}`)), 1200);
      }

    } catch(err) { console.error('nuevo:', err); Notificacion(isEdit ? 'Error al guardar' : 'Error al publicar', 'error'); wiSpin($btn, false); }
  });
};

export const cleanup = () => { $('#nu_form,#nu_slug_inp,#nu_titulo,#nu_resumen,#nu_img,#nu_contenido').off(); $(document).off('.nuevo'); };
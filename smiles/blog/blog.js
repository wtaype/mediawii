import './blog.css';
import $ from 'jquery';
import { wiVista, wiTip, Notificacion } from '../widev.js';
import { CATS, getPosts, superDate, catInfo, skCard, fade, srcBadge, prefetchPost, clearBlogCache } from './devblog.js';

const POR_PAG = 9;
const ORDEN = [{ id:'nuevo', icon:'fa-clock', label:'Más nuevos' }, { id:'vistas', icon:'fa-fire', label:'Más vistos' }];

const tplCard = (p, i) => { const c = catInfo(p.categoria); return `
  <article class="bl_card bl_fade" style="--d:${i*.055}s" data-slug="${p.slug||p.id}">
    <div class="bl_card_img">
      <img src="${p.imagen||'https://placehold.co/600x400?text=🐾'}" alt="${p.imagenAlt||p.titulo}" loading="lazy" onerror="this.src='https://placehold.co/600x400?text=🐾'" />
      <div class="bl_card_over">
        <span class="bl_card_cat" style="--cc:${c.color}"><i class="fas ${c.icon}"></i> ${p.categoria||'—'}</span>
        ${p.destacado?`<span class="bl_card_dest" ${wiTip('Destacada')}><i class="fas fa-star"></i></span>`:''}
      </div>
    </div>
    <div class="bl_card_body">
      <h2 class="bl_card_tit">${p.titulo}</h2>
      <p class="bl_card_res">${p.resumen||''}</p>
      <div class="bl_card_meta">
        <span ${wiTip('Autor')}><i class="fas fa-user-pen"></i> ${p.autor||'Autor'}</span>
        <span ${wiTip('Lectura')}><i class="fas fa-clock"></i> ${p.tiempo_lectura||'—'}</span>
        <span ${wiTip('Vistas')}><i class="fas fa-eye"></i> ${p.vistas||0}</span>
      </div>
      <div class="bl_card_footer">
        <span class="bl_card_fecha"><i class="fas fa-calendar"></i> ${superDate(p.creado)}</span>
        <span class="bl_card_leer">Leer <i class="fas fa-arrow-right"></i></span>
      </div>
    </div>
  </article>`; };

export const render = () => `
  <div class="bl_wrap">
    <div class="bl_hero bl_fade" style="--d:0s">
      <span class="bl_hero_tag"><i class="fas fa-paw"></i> Historiawi Blog</span>
      <h1 class="bl_hero_tit">Historias que <span class="bl_grad">llenan el alma</span> 🐾</h1>
      <div class="bl_hero_stats">
        <span class="bl_stat" ${wiTip('Total')}><i class="fas fa-book-open"></i> <strong id="bl_total">...</strong> historias</span>
        <span class="bl_stat_div"></span>
        <span class="bl_stat" ${wiTip('Categorías')}><i class="fas fa-folder"></i> <strong>5</strong> categorías</span>
        <span class="bl_stat_div"></span>
        <span class="bl_stat" ${wiTip('Gratis')}><i class="fas fa-heart"></i> <strong>100%</strong> gratis</span>
      </div>
    </div>
    <div class="bl_bar">
      <div class="bl_cats">${CATS.map(c=>`<button class="bl_cat_btn ${c.id==='todo'?'active':''}" data-cat="${c.id}" style="--cc:${c.color}" ${wiTip(c.label)}><i class="fas ${c.icon}"></i><span>${c.label}</span></button>`).join('')}</div>
      <div class="bl_bar_right">
        <div class="bl_orden">${ORDEN.map(o=>`<button class="bl_ord_btn ${o.id==='nuevo'?'active':''}" data-ord="${o.id}" ${wiTip(o.label)}><i class="fas ${o.icon}"></i><span>${o.label}</span></button>`).join('')}</div>
        <button class="bl_refresh_btn" id="bl_refresh" ${wiTip('Limpiar cache')}><i class="fas fa-rotate"></i></button>
      </div>
    </div>
    <div class="bl_result_bar" id="bl_result_bar"></div>
    <div class="bl_grid" id="bl_grid">${Array(POR_PAG).fill(skCard()).join('')}</div>
    <div class="bl_mas_wrap" id="bl_mas_wrap" style="display:none"><button class="bl_mas_btn" id="bl_mas" ${wiTip('Ver más')}><i class="fas fa-plus"></i> Ver más historias</button></div>
    <div class="bl_empty dpvc" id="bl_empty" style="display:none"><i class="fas fa-paw"></i><h3>Sin historias aquí aún</h3><p>Pronto habrá historias 🐾</p></div>
  </div>`;

export const init = async () => {
  let cat = 'todo', ord = 'nuevo', pag = 0, lista = [], busy = false;
  const nav = s => import('../rutas/ruta.js').then(m => m.rutas.navigate(s));

  const grid = (append) => {
    const $g = $('#bl_grid');
    if (!append) { $g.html(''); pag = 0; }
    const desde = append ? pag * POR_PAG : 0, slice = lista.slice(desde, desde + POR_PAG);
    if (!slice.length && !append) { $('#bl_empty').show(); $('#bl_mas_wrap').hide(); return; }
    $('#bl_empty').hide();
    $g.append(slice.map(tplCard).join(''));
    fade('bl_fade', $g[0]);
    $('#bl_mas_wrap').toggle(desde + POR_PAG < lista.length);
  };

  const cargar = async (force) => {
    if (busy) return; busy = true;
    $('#bl_grid').html(Array(POR_PAG).fill(skCard()).join(''));
    $('#bl_empty,#bl_mas_wrap').hide(); $('#bl_result_bar').html('');
    try {
      const r = await getPosts(cat, ord, force);
      lista = r.lista;
      $('#bl_result_bar').html(`<span><strong>${lista.length}</strong> historia${lista.length!==1?'s':''}</span>${srcBadge(r.fromCache)}`);
      let v=0; const t=lista.length, $t=$('#bl_total'), ti=setInterval(()=>{v+=Math.ceil(t/25)||1;if(v>=t){$t.text(t);clearInterval(ti)}else $t.text(v)},30);
      grid();
      fade('bl_fade', document.querySelector('.bl_hero'));
    } catch(e) { console.error('[blog]',e); Notificacion('Error al cargar','error'); $('#bl_grid').html(''); $('#bl_empty').show(); }
    busy = false;
  };

  await cargar();
  wiVista('.bl_hero', null, { anim:'wi_fadeUp' });

  $(document)
    .on('click.blog','.bl_cat_btn', function(){ const c=$(this).data('cat'); if(c===cat)return; cat=c;pag=0; $('.bl_cat_btn').removeClass('active');$(this).addClass('active'); cargar(); })
    .on('click.blog','.bl_ord_btn', function(){ const o=$(this).data('ord'); if(o===ord)return; ord=o;pag=0; $('.bl_ord_btn').removeClass('active');$(this).addClass('active'); cargar(); })
    .on('click.blog','#bl_refresh', async function(){ $(this).html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled',true); clearBlogCache(); await cargar(true); $(this).html('<i class="fas fa-rotate"></i>').prop('disabled',false); Notificacion('Cache limpiado ✅','success'); })
    .on('click.blog','#bl_mas', ()=>{ pag++; grid(true); })
    .on('click.blog','.bl_card', function(){ const s=$(this).data('slug'); s&&nav(`/${s}`); })
    .on('mouseenter.blog','.bl_card', function(){ prefetchPost($(this).data('slug')); });
};

export const cleanup = () => $(document).off('.blog');
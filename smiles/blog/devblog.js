import { savels, getls, wiTip } from '../widev.js';
import { db } from '../smile/firebase.js';
import { doc, getDoc, collection, getDocs, updateDoc, increment } from 'firebase/firestore';

// ── CONFIG ────────────────────────────────────────────────────
export const COL = 'blog';
const TTL = { list: 3, post: 12, rel: 6 };
const K   = { list: (c, o) => `wi_blog_${c}_${o}`, post: s => `wi_post_${s}`, rel: c => `wi_rel_${c}` };

// ── SERIALIZAR ────────────────────────────────────────────────
const toMs = v => v?.toDate?.()?.getTime?.() ?? v ?? null;
export const ser = d => ({ ...d, creado: toMs(d.creado), actualizado: toMs(d.actualizado) });

// ── FECHA ─────────────────────────────────────────────────────
const FMT = { corta: { day:'numeric', month:'short', year:'numeric' }, larga: { day:'numeric', month:'long', year:'numeric' } };
export const superDate = (ms, largo) => { if (!ms) return ''; try { return new Date(ms).toLocaleDateString('es-PE', largo ? FMT.larga : FMT.corta); } catch { return ''; } };

// ── CATEGORÍAS ────────────────────────────────────────────────
export const CATS = [
  { id:'todo',        icon:'fa-paw',      label:'Todas',       color:'var(--mco)' },
  { id:'Animales',    icon:'fa-dog',      label:'Animales',    color:'#0EBEFF'    },
  { id:'Naturaleza',  icon:'fa-leaf',     label:'Naturaleza',  color:'#25b62a'    },
  { id:'Amor',        icon:'fa-heart',    label:'Amor',        color:'#ff3849'    },
  { id:'Inspiración', icon:'fa-star',     label:'Inspiración', color:'#ffa726'    },
  { id:'Vida',        icon:'fa-seedling', label:'Vida',        color:'#6a00f5'    },
];
export const catInfo = cat => CATS.find(c => c.id === cat) || CATS[1];

// ── SKELETON ──────────────────────────────────────────────────
export const skCard = () => `<div class="bl_card_sk"><div class="bl_sk_img shimmer"></div><div class="bl_sk_body"><div class="bl_sk_cat shimmer"></div><div class="bl_sk_tit shimmer"></div><div class="bl_sk_tit bl_sk_t2 shimmer"></div><div class="bl_sk_p shimmer"></div><div class="bl_sk_p bl_sk_p2 shimmer"></div><div class="bl_sk_foot shimmer"></div></div></div>`;

// ── FADE ──────────────────────────────────────────────────────
export const fade = (cls = 'bl_fade', root = document) => requestAnimationFrame(() =>
  root.querySelectorAll?.(`.${cls}:not(.${cls.replace('fade','visible')})`)?.forEach(el => {
    const d = parseFloat(el.style.getPropertyValue('--d') || '0') * 1000;
    setTimeout(() => el.classList.add(cls.replace('fade', 'visible')), d);
  })
);

// ── SHARES ────────────────────────────────────────────────────
export const shareLinks = t => [
  { icon:'fab fa-facebook',  url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`, color:'#1877F2', label:'Facebook'  },
  { icon:'fab fa-twitter',   url:`https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(t)}`, color:'#1da1f2', label:'Twitter'   },
  { icon:'fab fa-whatsapp',  url:`https://wa.me/?text=${encodeURIComponent(t+' '+location.href)}`, color:'#25D366', label:'WhatsApp'  },
  { icon:'fab fa-telegram',  url:`https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(t)}`, color:'#0088cc', label:'Telegram' },
];

export const tplShare = (titulo, full) => shareLinks(titulo).map((r, i) => full || i < 3 ? `
  <a href="${r.url}" target="_blank" rel="noopener" class="po_share_${full?'full_':''}btn" style="--sc:${r.color}" ${wiTip(r.label)}>
    <i class="${r.icon}"></i>${full ? ` ${r.label}` : ''}
  </a>` : '').join('');

// ── BADGE FUENTE ──────────────────────────────────────────────
export const srcBadge = fc => fc
  ? `<span class="bl_cache_tag" ${wiTip('⚡ Cache local')}><i class="fas fa-bolt"></i> Cache</span>`
  : `<span class="bl_fire_tag"  ${wiTip('☁️ Firestore')}><i class="fas fa-database"></i> Firestore</span>`;

// ── FETCH ALL (una sola vez, reutilizable) ────────────────────
let _allCache = null, _allTime = 0;
const fetchAll = async (force) => {
  if (!force && _allCache && Date.now() - _allTime < 60000) return _allCache;
  const snap = await getDocs(collection(db, COL));
  _allCache = snap.docs.map(d => ser(d.data())).filter(d => d.activo);
  _allTime = Date.now();
  return _allCache;
};

// ── LISTA DE POSTS ────────────────────────────────────────────
export const getPosts = async (cat = 'todo', orden = 'nuevo', force = false) => {
  const key = K.list(cat, orden);
  if (!force) { const c = getls(key); if (Array.isArray(c) && c.length) return { lista: c, fromCache: true }; }
  let lista = await fetchAll(force);
  if (cat !== 'todo') lista = lista.filter(d => d.categoria === cat);
  lista = [...lista].sort((a, b) => orden === 'vistas' ? (b.vistas||0)-(a.vistas||0) : (b.creado||0)-(a.creado||0));
  if (lista.length) savels(key, lista, TTL.list);
  return { lista, fromCache: false };
};

// ── POST INDIVIDUAL ───────────────────────────────────────────
export const getPost = async (slug, force = false) => {
  if (!force) { const c = getls(K.post(slug)); if (c) return { data: c, fromCache: true }; }
  const snap = await getDoc(doc(db, COL, slug));
  if (!snap.exists()) return null;
  const data = ser(snap.data());
  savels(K.post(slug), data, TTL.post);
  return { data, fromCache: false };
};

// ── PREVIEW RÁPIDO (desde cache del blog) ─────────────────────
export const getPreview = slug => {
  for (const k of Object.keys(localStorage).filter(k => k.startsWith('wi_blog_'))) {
    const arr = getls(k);
    if (Array.isArray(arr)) { const p = arr.find(d => d.slug === slug || d.id === slug); if (p) return p; }
  }
  return null;
};

// ── RELACIONADOS (desde memoria/cache, sin Firestore extra) ──
export const getRelacionados = async (slug, categoria, force = false) => {
  if (!force) { const c = getls(K.rel(categoria)); if (Array.isArray(c)) return c.filter(d => d.slug !== slug && d.id !== slug).slice(0, 3); }
  // Intenta usar _allCache si existe, sino busca en localStorage del blog
  let pool = _allCache || [];
  if (!pool.length) {
    for (const k of Object.keys(localStorage).filter(k => k.startsWith('wi_blog_'))) {
      const arr = getls(k);
      if (Array.isArray(arr) && arr.length) { pool = arr; break; }
    }
  }
  // Solo si no hay nada, hacemos fetch
  if (!pool.length) pool = await fetchAll(force);
  const lista = pool.filter(d => d.activo !== false && d.categoria === categoria)
    .sort((a, b) => (b.creado||0)-(a.creado||0)).slice(0, 5);
  if (lista.length) savels(K.rel(categoria), lista, TTL.rel);
  return lista.filter(d => d.slug !== slug && d.id !== slug).slice(0, 3);
};

// ── PREFETCH (hover en blog) ──────────────────────────────────
const _prefetched = new Set();
export const prefetchPost = slug => {
  if (_prefetched.has(slug) || getls(K.post(slug))) return;
  _prefetched.add(slug);
  getDoc(doc(db, COL, slug)).then(s => s.exists() && savels(K.post(slug), ser(s.data()), TTL.post)).catch(() => {});
};

// ── VISTAS + CACHE CLEAR ──────────────────────────────────────
export const addView = s => updateDoc(doc(db, COL, s), { vistas: increment(1) }).catch(() => {});
export const clearPostCache = s => localStorage.removeItem(K.post(s));
export const clearRelCache = c => localStorage.removeItem(K.rel(c));
export const clearBlogCache = () => Object.keys(localStorage).filter(k => k.startsWith('wi_blog_')).forEach(k => localStorage.removeItem(k));
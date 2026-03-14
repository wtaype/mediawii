import './smile.css';
import $ from 'jquery';
import { auth, db } from './firebase.js';
import { collection, setDoc, doc, query, where, onSnapshot, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Notificacion, wicopy, wiTip, getls, Saludar } from '../widev.js';
import { rutas } from '../rutas/ruta.js';
import { app } from '../wii.js';

// ============================================================
// PARTE 1 · ESTADO Y CACHÉ
// ============================================================
let msgs = [], unsub = null, pendiente = null;
const CACHE  = 'wi_mensajes_cache';
const wi     = () => getls('wiSmile') || {};
const _save  = d  => { try { localStorage.setItem(CACHE, JSON.stringify(d)); } catch (_) {} };
const _cache = () => { try { return JSON.parse(localStorage.getItem(CACHE) || '[]'); } catch (_) { return []; } };

// ============================================================
// PARTE 2 · RENDER
// ============================================================
export const render = () => {
  const u = wi();
  if (!u.email) { location.replace('/'); return ''; }
  const { nombre = '', usuario = '', email = '' } = u;
  const display = nombre || usuario || email || auth.currentUser?.email || '';

  return `
  <div class="smile_container">

    <div class="smile_header">
      <div class="header_info">
        <img src="/logo.webp" alt="${app}" class="header_avatar" />
        <div class="header_text">
          <h1>Mis Mensajes</h1>
          <p>${Saludar()} <strong>${display}</strong></p>
        </div>
      </div>
      <div class="header_status">
        <span class="status_dot"></span>
        <span class="status_text">Cargando...</span>
      </div>
    </div>

    <div class="smile_chat" id="smileChat">
      ${_htmlList(_cache())}
    </div>

    <div class="smile_input">
      <div class="input_wrapper">
        <textarea id="nuevoMensaje"
          placeholder="Escribe un mensaje."
          rows="1" maxlength="500"></textarea>
        <span class="char_count" id="charCount">0/500</span>
      </div>
      <button id="btnEnviar" disabled ${wiTip('Enviar · Enter')}>
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>

    <div class="modal_overlay" id="modalEliminar">
      <div class="modal_content">
        <i class="fas fa-trash-alt"></i>
        <h3>¿Eliminar mensaje?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="modal_actions">
          <button class="btn_cancelar" id="btnCancelar">Cancelar</button>
          <button class="btn_confirmar" id="btnConfirmar">Eliminar</button>
        </div>
      </div>
    </div>

  </div>`;
};

// ============================================================
// PARTE 3 · LÓGICA: INIT · EVENTOS · FIRESTORE · HELPERS
// ============================================================
export const init = () => {
  const u = wi();
  if (!u.email) return rutas.navigate('/');

  const userEmail = u.email || auth.currentUser?.email;

  // ── EVENTOS ──
  $(document)
    .on('input.sm', '#nuevoMensaje', function () {
      $('#charCount').text(`${$(this).val().length}/500`);
      $('#btnEnviar').prop('disabled', !$(this).val().trim());
      $(this).css('height', 'auto').css('height', Math.min(this.scrollHeight, 150) + 'px');
    })
    .on('keydown.sm', '#nuevoMensaje', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _enviar(userEmail); }
    })
    .on('click.sm',  '#btnEnviar',   () => _enviar(userEmail))
    .on('click.sm',  '.msg_item',    function (e) {
      if ($(e.target).closest('.btn_delete').length) return;
      const msg = msgs.find(m => m.id === $(this).data('id'));
      if (!msg) return;
      wicopy(msg.mensaje, this, '¡Copiado! <i class="fas fa-check-circle"></i>');
      $(this).addClass('copied');
      setTimeout(() => $(this).removeClass('copied'), 800);
    })
    .on('click.sm',  '.btn_delete',  function (e) {
      e.stopPropagation();
      pendiente = $(this).data('id');
      $('#modalEliminar').addClass('show');
    })
    .on('click.sm',  '#btnCancelar, #modalEliminar', e => {
      if ($(e.target).is('#btnCancelar, #modalEliminar')) {
        $('#modalEliminar').removeClass('show');
        pendiente = null;
      }
    })
    .on('click.sm', '#btnConfirmar', _eliminar);

  // ── TIEMPO REAL ──
  unsub = onSnapshot(
    query(collection(db, 'wiMensajes'), where('email', '==', userEmail)),
    { includeMetadataChanges: false },
    snap => {
      msgs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0));
      _save(msgs);
      $('#smileChat').html(_htmlList(msgs));
      _status(true);
    },
    err => {
      console.error('❌', err);
      _status(false);
      const cache = _cache();
      if (cache.length) {
        msgs = cache;
        $('#smileChat').html(_htmlList(msgs));
        Notificacion('Caché local 📦', 'warning', 2000);
      } else {
        $('#smileChat').html(_empty('fa-wifi-slash', 'Sin conexión', 'Verifica tu internet'));
      }
    }
  );
};

// ── ENVIAR ──
const _enviar = async (email) => {
  const $ta   = $('#nuevoMensaje');
  const nota  = $ta.val().trim();
  if (!nota) return;

  const { usuario = '', nombre = '' } = wi();
  const ts  = Date.now();
  const id  = `m${ts}`;

  const $btn = $('#btnEnviar').prop('disabled', true)
    .html('<i class="fas fa-spinner fa-pulse"></i>');

  try {
    await setDoc(doc(db, 'wiMensajes', id), {
      id,
      mensaje: nota,
      email,
      usuario: nombre || usuario || email,
      fecha: serverTimestamp()
    });
    $ta.val('').css('height', 'auto').trigger('focus');
    $('#charCount').text('0/500');
  } catch (e) {
    console.error('❌', e);
    Notificacion('Error al guardar', 'error');
  } finally {
    $btn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i>');
  }
};

// ── ELIMINAR ──
const _eliminar = async () => {
  if (!pendiente) return;
  const id = pendiente;
  pendiente = null;
  $('#modalEliminar').removeClass('show');
  $(`.msg_item[data-id="${id}"]`).addClass('deleting');
  try {
    await deleteDoc(doc(db, 'wiMensajes', id));
    Notificacion('Mensaje eliminado 🗑️', 'success', 1500);
  } catch (e) {
    console.error('❌', e);
    $(`.msg_item[data-id="${id}"]`).removeClass('deleting');
    Notificacion('Error al eliminar', 'error');
  }
};

// ── HELPERS ──
const _status  = ok => {
  $('.status_dot').toggleClass('active', ok).toggleClass('error', !ok);
  $('.status_text').text(ok ? 'En vivo' : 'Desconectado');
};

const _htmlList = list => list?.length
  ? list.map(m => `
    <div class="msg_item" data-id="${m.id}" ${wiTip('Click para copiar')}>
      <div class="msg_content">
        <p class="msg_texto">${_esc(m.mensaje).replace(/\n/g, '<br>')}</p>
        <div class="msg_footer">
          <span class="msg_fecha">${_fecha(m.fecha)}</span>
          <i class="fas fa-check-double msg_check"></i>
        </div>
      </div>
      <button class="btn_delete" data-id="${m.id}" ${wiTip('Eliminar')}>
        <i class="fas fa-trash"></i>
      </button>
    </div>`).join('')
  : _empty('fa-comment-dots', 'Sin mensajes aún', 'Escribe tu primer mensaje 👇');

const _empty = (ico, txt, sub) => `
  <div class="chat_empty">
    <i class="fas ${ico}"></i>
    <p>${txt}</p><span>${sub}</span>
  </div>`;

const _esc = t => String(t || '').replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c]));

const _fecha = ts => {
  if (!ts) return 'Ahora';
  const d  = ts.toDate?.() || new Date((ts.seconds || 0) * 1000);
  const df = Date.now() - d;
  const m  = ~~(df / 6e4), h = ~~(df / 36e5), dias = ~~(df / 864e5);
  if (m   <  1) return 'Ahora';
  if (m   < 60) return `${m}m`;
  if (h   < 24) return `${h}h`;
  if (dias < 7) return `${dias}d`;
  return d.toLocaleDateString('es', { day:'2-digit', month:'short' });
};

export const cleanup = () => {
  unsub?.();
  $(document).off('.sm');
  [msgs, unsub, pendiente] = [[], null, null];
};
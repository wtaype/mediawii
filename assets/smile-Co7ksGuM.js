import{j as t}from"./vendor-gzd0YkcT.js";import{d as f}from"./firebase-jpi2_lo5.js";import{g as b,d,T as l,s as v,a as h}from"./firebase-cMSvyH06.js";import{g as r,f as m,S as g,s as u,N as o,h as p}from"./main-D7rP3lAl.js";import"./main-CWyybY0m.js";let e=r("wiSmile");const i="wiNotas",k=async()=>{const c=r(i),a=c?.fechaUpdate?m(l).get(c.fechaUpdate,"DD/MM/YYYY HH:mm"):"Sin notas";return`
   <div class="miweb">
    <div class="mhead"><h1 class="mh1"><i class="fas fa-sticky-note"></i> ${g()} ${e.nombre}</h1></div>
    <div class="mibody">
     <textarea class="nota-text" placeholder="Empieza escribir tus notas">${c?.notas||""}</textarea>
     <div class="nota-footer">
      <span class="nota-fecha"><i class="far fa-clock"></i> ${c?.fechaCreacion?"Actualizado":"Nota creada"}: ${a}</span>
      <div class="nota-btns">
       <button class="btn btn-save"><i class="fas fa-save"></i> Guardar</button>
       <button class="btn btn-delete"><i class="fas fa-trash"></i> Eliminar</button>
      </div>
     </div>
    </div>
   </div>`},C=async()=>{if(!r(i))try{const a=await b(d(f,"misnotas",e.usuario));if(a.exists()){const s=a.data();t(".nota-text").val(s.notas),u(i,s),t(".nota-fecha").html(`<i class="far fa-clock"></i> Actualizado: ${m(l).get(s.fechaUpdate,"DD/MM/YYYY HH:mm")}`),o("✅ Notas cargadas","success")}}catch(a){console.error(a),o("❌ Error al cargar","error")}t(".btn-save").click(async function(){const a=t(".nota-text").val().trim();if(!a)return o("⚠️ Escribe algo primero","warning");p(this,!0);try{const s=r(i);await v(d(f,"misnotas",e.usuario),{email:e.email,usuario:e.nombre,notas:a,fechaUpdate:h(),...!s?.fechaCreacion&&{fechaCreacion:h()}},{merge:!0});const n=Date.now();u(i,{email:e.email,usuario:e.nombre,notas:a,fechaUpdate:n,fechaCreacion:s?.fechaCreacion||n}),t(".nota-fecha").html(`<i class="far fa-clock"></i> Actualizado: ${m(l).get(n,"DD/MM/YYYY HH:mm")}`),o("✅ Guardado exitosamente!","success")}catch(s){console.error(s),o("❌ Error al guardar","error")}finally{p(this,!1)}}),t(".btn-delete").click(function(){confirm("¿Eliminar todas las notas?")&&(t(".nota-text").val(""),t(".nota-fecha").html('<i class="far fa-clock"></i> Nota creada: Sin notas'),o("🗑️ Notas eliminadas","info"))})},E=()=>{console.log("😊 Smile limpiado")};export{E as cleanup,C as init,k as render,e as smile};

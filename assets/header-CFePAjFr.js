const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/login-BhVa41UO.js","assets/vendor-gzd0YkcT.js","assets/firebase-C9HGLBXb.js","assets/main-QT6457uG.js","assets/firebase-CGAbnnJF.js","assets/login-pzxUIRzl.css"])))=>i.map(i=>d[i]);
import{M as l,h as t,r as c,_ as n}from"./main-QT6457uG.js";import{j as s}from"./vendor-gzd0YkcT.js";const e=a=>{l("Bienvenido "+a.nombre),s(".nv_right").html(`
    <a href="/milab" class="nv_item" data-page="milab"><i class="fa-solid fa-graduation-cap"></i> <span>Mi Lab</span></a>
    <a href="/smile" class="nv_item" data-page="smile"><i class="fa-solid fa-comments"></i> <span>Mensajes</span></a>
    <a href="/perfil" class="nv_item" data-page="perfil"><img src="${a.imagen||"./smile.avif"}" alt="${a.nombre}"><span>${a.nombre}</span></a>
    <button class="nv_item bt_salir" data-page="inicio"><i class="fa-solid fa-sign-out-alt"></i> <span>salir</span></button>
  `)},r=()=>{s(".nv_right").html(`
    <a href="/descubre" class="nv_item" data-page="descubre"><i class="fa-solid fa-gauge"></i> <span>Descubre </span></a>
    <button class="bt_auth registrar"><i class="fas fa-user-plus"></i><span>Registrar</span></button>
    <button class="bt_auth login"><i class="fas fa-sign-in-alt"></i><span>Login</span></button>  
  `)};t.on(a=>a?e(a):(r(),c.navigate("/")));const i=t.user;i?e(i):r();const p=["wiTema","wiSmart","wiFresh"];s(document).on("click.hdr",".bt_salir",async()=>{const{salir:a}=await n(async()=>{const{salir:o}=await import("./login-BhVa41UO.js");return{salir:o}},__vite__mapDeps([0,1,2,3,4,5]));a(p)});n(()=>import("./login-BhVa41UO.js"),__vite__mapDeps([0,1,2,3,4,5]));export{e as personal};

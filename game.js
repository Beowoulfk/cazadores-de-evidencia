/* ============================================================
   CAZADORES DE EVIDENCIA - lógica del juego
   Multijugador local 2-4 (por turnos) + editor de preguntas/colores
   Datos persistidos en localStorage. Sin dependencias externas.
   ============================================================ */

const STORE_KEY = "cazadores_data_v1";

/* ---- Datos por defecto (etapas + 14 preguntas) ---- */
const DEFAULT_DATA = {
  stages: {
    azul:     { name: "Observación",          color: "#2563eb" },
    verde:    { name: "Fuentes y Evidencia",   color: "#16a34a" },
    amarillo: { name: "Hipótesis y Variables", color: "#d97706" },
    rojo:     { name: "Regulación y Cierre",   color: "#dc2626" }
  },
  timePerQuestion: 20,
  questions: [
    {stage:"azul",q:"¿Qué hecho detonó el caso en febrero de 2025?",
     opts:["El Invima retiró un lote de acetaminofén","Audifarma suspendió la dispensación en cinco departamentos","El Gobierno subió la UPC","Cerró una fábrica de principios activos"],
     correct:1,exp:"Audifarma suspendió unilateralmente la entrega en cinco departamentos: ese fue el detonante."},
    {stage:"azul",q:"¿En qué ciudad y periodo se delimita la investigación?",
     opts:["Bogotá, 2020-2022","Cali, 2023-2025","Medellín, 2024-2026","Todo Colombia, sin fecha"],
     correct:2,exp:"El caso se delimita en Medellín, entre 2024 y 2026."},
    {stage:"azul",q:"¿Qué población es el centro del estudio?",
     opts:["Niños sanos del régimen contributivo","Médicos de las EPS","Pacientes crónicos y de alto costo","Empleados de los gestores"],
     correct:2,exp:"Pacientes crónicos y de alto costo (hipertensos, diabéticos, oncológicos) que dependen de su tratamiento."},
    {stage:"azul",q:"De 20 pacientes consultados en Medellín, ¿cuántos recibieron entrega completa?",
     opts:["Los 20","15","4","Ninguno"],
     correct:2,exp:"Solo 4 de 20 recibieron la entrega completa (El Colombiano, 2025)."},

    {stage:"verde",q:"¿Qué es una fuente primaria?",
     opts:["Un resumen que hace otro autor","Evidencia directa: informe oficial, encuesta propia o testimonio de campo","Cualquier cosa publicada en internet","Una opinión personal sin datos"],
     correct:1,exp:"Una fuente primaria es evidencia de origen directo, no un resumen de segunda mano."},
    {stage:"verde",q:"El Informe de tutelas del Ministerio de Salud (2025) es una fuente:",
     opts:["Informal de redes sociales","Institucional oficial y comprobable","Un rumor de pasillo","Una hipótesis sin comprobar"],
     correct:1,exp:"Es una fuente institucional oficial, un dato comprobable."},
    {stage:"verde",q:"Según el Observatorio de la Democracia (2026), la entrega completa fue:",
     opts:["Igual en todas las EPS","25% en intervenidas vs 43,5% en no intervenidas","90% en todas las EPS","Mejor en las intervenidas"],
     correct:1,exp:"Solo el 25% en EPS intervenidas recibió completo, frente al 43,5% en no intervenidas."},
    {stage:"verde",q:"Un testimonio recogido por un periodista en un punto de dispensación es fuente:",
     opts:["Secundaria y teórica","Primaria / directa de campo","Falsa por definición","De laboratorio clínico"],
     correct:1,exp:"Viene directo del lugar de los hechos: es una fuente primaria de campo."},

    {stage:"amarillo",q:"La postura empirista del ensayo se apoya en:",
     opts:["La intuición y creencias personales","Datos observables, cifras y hechos verificables","Solo teorías abstractas","Lo que diga la mayoría en redes"],
     correct:1,exp:"El empirismo se basa en datos observables y hechos verificables."},
    {stage:"amarillo",q:"¿Cuál es la variable principal del estudio?",
     opts:["El precio del petróleo","La percepción de los pacientes sobre la entrega de medicamentos","El clima de Medellín","El número de hospitales"],
     correct:1,exp:"El fenómeno central es la percepción de los pacientes sobre la entrega de medicamentos."},
    {stage:"amarillo",q:"¿Cuál es el factor institucional clave de la hipótesis?",
     opts:["El color del logo de la EPS","Si la EPS está intervenida o no intervenida","La edad del gerente","El nombre del gestor"],
     correct:1,exp:"Se compara la percepción según la EPS esté intervenida o no."},
    {stage:"amarillo",q:"¿Cuál es la hipótesis bien formulada?",
     opts:["\"Los medicamentos no llegan porque sí\"","EPS intervenidas: entrega percibida como más demorada por atraso de UPC y ruptura con gestores","\"Todas las EPS son perfectas\"","\"Se resuelve cambiando de gestor\""],
     correct:1,exp:"La hipótesis relaciona la percepción negativa con el atraso de la UPC y la ruptura de contratos."},

    {stage:"rojo",q:"¿Cuál es la causa estructural principal de la crisis?",
     opts:["No hay medicamentos en ningún lado","Diseño financiero: UPC insuficiente, pago anticipado y vigilancia reactiva","Los pacientes no reclaman","Los médicos no formulan bien"],
     correct:1,exp:"La causa es el diseño financiero, no la escasez ni un gestor puntual."},
    {stage:"rojo",q:"¿Por qué se descarta la escasez física como causa principal?",
     opts:["Porque nunca faltan medicamentos","Fármacos básicos había en el canal comercial pero no en el institucional","Porque el Invima lo prohibió","Porque los pacientes no los necesitaban"],
     correct:1,exp:"Valsartán, losartán o acetaminofén sí estaban en droguerías, pero no llegaban por la EPS."}
  ]
};

/* ---- Estado en memoria ---- */
let DATA = loadData();
let game = null;      // estado de la partida activa
let timer = null;
let timeLeft = 0;
let answered = false;

/* ============================================================
   Persistencia
   ============================================================ */
function loadData(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && parsed.questions && parsed.stages) return parsed;
    }
  }catch(e){ console.warn("No se pudo leer localStorage", e); }
  return structuredClone(DEFAULT_DATA);
}
function saveData(){
  try{ localStorage.setItem(STORE_KEY, JSON.stringify(DATA)); }
  catch(e){ console.warn("No se pudo guardar", e); }
}
function resetData(){
  if(confirm("¿Restablecer las preguntas y colores originales? Se perderán tus cambios.")){
    DATA = structuredClone(DEFAULT_DATA);
    saveData(); applyColors(); renderEditor(); toast("Restablecido a valores originales");
  }
}

/* ============================================================
   Utilidades UI
   ============================================================ */
function show(id){
  ["start","players","game","final","editor"].forEach(s=>{
    document.getElementById(s).classList.toggle("hidden", s!==id);
  });
  window.scrollTo(0,0);
}
function applyColors(){
  const r = document.documentElement.style;
  r.setProperty("--azul", DATA.stages.azul.color);
  r.setProperty("--verde", DATA.stages.verde.color);
  r.setProperty("--amarillo", DATA.stages.amarillo.color);
  r.setProperty("--rojo", DATA.stages.rojo.color);
}
function toast(msg){
  let t = document.getElementById("toast");
  if(!t){ t=document.createElement("div"); t.id="toast"; t.className="toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"), 1800);
}

/* ============================================================
   Navegación / Home
   ============================================================ */
function goHome(){
  clearInterval(timer);        // detiene el temporizador si estaba corriendo
  game = null;
  show("start");
}

/* ============================================================
   Configuración de jugadores
   ============================================================ */
let playerCount = 2;
function goPlayers(){ show("players"); setPlayerCount(playerCount); }
function setPlayerCount(n){
  playerCount = n;
  document.querySelectorAll(".count-pick button").forEach(b=>{
    b.classList.toggle("active", parseInt(b.dataset.n)===n);
  });
  const box = document.getElementById("playerInputs");
  box.innerHTML="";
  for(let i=0;i<n;i++){
    const inp=document.createElement("input");
    inp.type="text"; inp.maxLength=18;
    inp.placeholder="Nombre del jugador "+(i+1);
    inp.id="pname"+i;
    box.appendChild(inp);
  }
}

/* ============================================================
   Partida (competencia por turnos)
   ============================================================ */
function startGame(){
  if(DATA.questions.length===0){ alert("No hay preguntas. Añade al menos una en el editor."); return; }
  const players=[];
  for(let i=0;i<playerCount;i++){
    const v=(document.getElementById("pname"+i).value||"").trim();
    players.push({ name: v || ("Jugador "+(i+1)), score:0, correct:0 });
  }
  game = { players, order: shuffle([...Array(DATA.questions.length).keys()]), pos:0, turn:0 };
  show("game");
  renderQuestion();
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function currentQuestion(){ return DATA.questions[ game.order[game.pos] ]; }
function currentPlayer(){ return game.players[ game.turn ]; }

function renderQuestion(){
  answered=false;
  const item=currentQuestion();
  const stage=DATA.stages[item.stage] || {name:item.stage,color:"#2563eb"};
  const player=currentPlayer();

  const badge=document.getElementById("stageBadge");
  badge.textContent="Etapa: "+stage.name;
  badge.style.background=stage.color;
  document.querySelector(".progress > div").style.background=stage.color;

  document.getElementById("turnPill").textContent="Turno: "+player.name;
  document.getElementById("qcount").textContent="Pregunta "+(game.pos+1)+" de "+game.order.length;
  document.getElementById("bar").style.width=((game.pos)/game.order.length*100)+"%";
  document.getElementById("question").textContent=item.q;

  renderScoreboard();

  const box=document.getElementById("options");
  box.innerHTML="";
  const letters=["A","B","C","D","E","F"];
  item.opts.forEach((opt,i)=>{
    const b=document.createElement("button");
    b.className="opt";
    b.innerHTML='<span class="letter">'+letters[i]+'</span><span>'+escapeHtml(opt)+'</span>';
    b.onclick=()=>choose(i);
    box.appendChild(b);
  });

  const fb=document.getElementById("feedback");
  fb.className="feedback"; fb.innerHTML="";
  document.getElementById("nextBtn").classList.add("hidden");

  timeLeft=DATA.timePerQuestion; updateTimer();
  clearInterval(timer);
  timer=setInterval(()=>{
    timeLeft--; updateTimer();
    if(timeLeft<=0){ clearInterval(timer); choose(-1); }
  },1000);
}

function renderScoreboard(){
  const sb=document.getElementById("scoreboard");
  sb.innerHTML="";
  game.players.forEach((p,i)=>{
    const c=document.createElement("div");
    c.className="chip"+(i===game.turn?" current":"");
    c.innerHTML=escapeHtml(p.name)+"<small>"+p.score+" pts</small>";
    sb.appendChild(c);
  });
}

function updateTimer(){
  const t=document.getElementById("timer");
  t.textContent=timeLeft;
  t.classList.toggle("low",timeLeft<=5);
}

function choose(i){
  if(answered) return;
  answered=true; clearInterval(timer);
  const item=currentQuestion();
  const player=currentPlayer();
  const buttons=document.querySelectorAll(".opt");
  buttons.forEach((b,j)=>{
    b.disabled=true;
    if(j===item.correct) b.classList.add("correct");
    if(j===i && i!==item.correct) b.classList.add("wrong");
  });

  const fb=document.getElementById("feedback");
  if(i===item.correct){
    const gained=100 + Math.round((timeLeft/DATA.timePerQuestion)*50);
    player.score+=gained; player.correct++;
    fb.innerHTML="✅ <b>¡"+escapeHtml(player.name)+" acertó!</b> +"+gained+" puntos<br>"+escapeHtml(item.exp);
  }else if(i===-1){
    fb.innerHTML="⏱ <b>Se acabó el tiempo, "+escapeHtml(player.name)+".</b><br>"+escapeHtml(item.exp);
  }else{
    fb.innerHTML="❌ <b>Incorrecto, "+escapeHtml(player.name)+".</b><br>"+escapeHtml(item.exp);
  }
  fb.classList.add("show");
  document.getElementById("bar").style.width=((game.pos+1)/game.order.length*100)+"%";
  renderScoreboard();

  const nb=document.getElementById("nextBtn");
  nb.classList.remove("hidden");
  const last = (game.pos+1>=game.order.length) && (game.turn+1>=game.players.length);
  const endLabel = game.players.length===1 ? "Ver resultado 🏁" : "Ver podio 🏁";
  const nextLabel = game.players.length===1 ? "Siguiente pregunta →" : "Siguiente jugador →";
  nb.textContent = last ? endLabel : nextLabel;
}

function nextQuestion(){
  // pasa al siguiente jugador; cuando todos jugaron esta pregunta, avanza a la siguiente
  game.turn++;
  if(game.turn>=game.players.length){
    game.turn=0;
    game.pos++;
  }
  if(game.pos>=game.order.length){ showFinal(); }
  else{ renderQuestion(); }
}

function showFinal(){
  show("final");
  const ranked=[...game.players].sort((a,b)=>b.score-a.score);
  const total=game.order.length;

  // podio (top 3)
  const podium=document.getElementById("podium");
  podium.innerHTML="";
  const order=[1,0,2]; // 2do, 1ro, 3ro para el efecto visual
  order.forEach(rankIdx=>{
    if(ranked[rankIdx]){
      const p=ranked[rankIdx];
      const medals=["🥇","🥈","🥉"];
      const col=document.createElement("div");
      col.className="col p"+(rankIdx+1);
      col.innerHTML='<div class="medal">'+medals[rankIdx]+'</div><div class="name">'+escapeHtml(p.name)+'</div><div class="bar">'+p.score+'<br><small>pts</small></div>';
      podium.appendChild(col);
    }
  });

  const winner=ranked[0];
  if(game.players.length===1){
    document.getElementById("winnerText").textContent="⭐ "+winner.name+": "+winner.score+" puntos ("+winner.correct+"/"+total+" aciertos)";
  }else{
    document.getElementById("winnerText").textContent="🏆 Ganó "+winner.name+" con "+winner.score+" puntos";
  }

  const list=document.getElementById("resultList");
  list.innerHTML="";
  ranked.forEach((p,i)=>{
    const li=document.createElement("li");
    li.innerHTML="<span>"+(i+1)+". "+escapeHtml(p.name)+"</span><span>"+p.score+" pts · "+p.correct+"/"+total+"</span>";
    list.appendChild(li);
  });
}

function playAgain(){ show("start"); }

/* ============================================================
   EDITOR de preguntas y colores
   ============================================================ */
function openEditor(){ renderEditor(); show("editor"); }
function closeEditor(){ show("start"); }

function renderEditor(){
  // tiempo
  document.getElementById("timeInput").value = DATA.timePerQuestion;

  // colores/etapas
  const cg=document.getElementById("colorGrid");
  cg.innerHTML="";
  Object.keys(DATA.stages).forEach(key=>{
    const st=DATA.stages[key];
    const item=document.createElement("div");
    item.className="citem";
    item.innerHTML=
      '<div style="flex:1"><input type="text" value="'+escapeAttr(st.name)+'" data-stage="'+key+'" class="stageName"></div>'+
      '<input type="color" value="'+st.color+'" data-stage="'+key+'" class="stageColor">';
    cg.appendChild(item);
  });
  cg.querySelectorAll(".stageName").forEach(inp=>{
    inp.oninput=e=>{ DATA.stages[e.target.dataset.stage].name=e.target.value; saveData(); };
  });
  cg.querySelectorAll(".stageColor").forEach(inp=>{
    inp.oninput=e=>{ DATA.stages[e.target.dataset.stage].color=e.target.value; saveData(); applyColors(); };
  });

  // lista de preguntas
  const list=document.getElementById("editorList");
  list.innerHTML="";
  DATA.questions.forEach((q,qi)=>{
    const stColor = (DATA.stages[q.stage]&&DATA.stages[q.stage].color) || "#334155";
    const el=document.createElement("div");
    el.className="editor-q";
    el.style.borderLeftColor=stColor;

    let optsHtml="";
    q.opts.forEach((op,oi)=>{
      optsHtml+=
        '<div class="opt-edit">'+
          '<input type="radio" name="correct'+qi+'" '+(q.correct===oi?"checked":"")+' onchange="setCorrect('+qi+','+oi+')" title="Marcar como correcta">'+
          '<input type="text" value="'+escapeAttr(op)+'" oninput="setOpt('+qi+','+oi+',this.value)">'+
          (q.opts.length>2?'<button class="icon-btn danger" onclick="removeOpt('+qi+','+oi+')" title="Quitar opción">✕</button>':'')+
        '</div>';
    });

    let stageOptions="";
    Object.keys(DATA.stages).forEach(k=>{
      stageOptions+='<option value="'+k+'" '+(q.stage===k?"selected":"")+'>'+escapeHtml(DATA.stages[k].name)+'</option>';
    });

    el.innerHTML=
      '<div class="qhead">'+
        '<span class="qtitle">Pregunta '+(qi+1)+'</span>'+
        '<div class="qactions">'+
          '<button class="icon-btn" onclick="moveQ('+qi+',-1)" title="Subir">▲</button>'+
          '<button class="icon-btn" onclick="moveQ('+qi+',1)" title="Bajar">▼</button>'+
          '<button class="icon-btn danger" onclick="removeQ('+qi+')" title="Borrar">🗑</button>'+
        '</div>'+
      '</div>'+
      '<label>Etapa</label><select onchange="setStage('+qi+',this.value)">'+stageOptions+'</select>'+
      '<label>Pregunta</label><textarea oninput="setQText('+qi+',this.value)">'+escapeHtml(q.q)+'</textarea>'+
      '<label>Opciones (marca la correcta con el círculo)</label>'+optsHtml+
      (q.opts.length<6?'<button class="icon-btn" onclick="addOpt('+qi+')">+ Añadir opción</button>':'')+
      '<label>Explicación (se muestra al responder)</label><textarea oninput="setExp('+qi+',this.value)">'+escapeHtml(q.exp||"")+'</textarea>';
    list.appendChild(el);
  });
  document.getElementById("qTotal").textContent=DATA.questions.length+" pregunta(s)";
}

/* mutadores del editor */
function setTime(v){ const n=parseInt(v)||20; DATA.timePerQuestion=Math.max(5,Math.min(120,n)); saveData(); }
function setStage(qi,v){ DATA.questions[qi].stage=v; saveData(); renderEditor(); }
function setQText(qi,v){ DATA.questions[qi].q=v; saveData(); }
function setExp(qi,v){ DATA.questions[qi].exp=v; saveData(); }
function setOpt(qi,oi,v){ DATA.questions[qi].opts[oi]=v; saveData(); }
function setCorrect(qi,oi){ DATA.questions[qi].correct=oi; saveData(); }
function addOpt(qi){ DATA.questions[qi].opts.push("Nueva opción"); saveData(); renderEditor(); }
function removeOpt(qi,oi){
  const q=DATA.questions[qi];
  q.opts.splice(oi,1);
  if(q.correct>=q.opts.length) q.correct=0;
  else if(q.correct>oi) q.correct--;
  saveData(); renderEditor();
}
function addQuestion(){
  const firstStage=Object.keys(DATA.stages)[0];
  DATA.questions.push({stage:firstStage,q:"Escribe aquí la pregunta",opts:["Opción A","Opción B","Opción C","Opción D"],correct:0,exp:"Explicación de la respuesta."});
  saveData(); renderEditor();
  document.getElementById("editorList").lastElementChild.scrollIntoView({behavior:"smooth"});
  toast("Pregunta añadida");
}
function removeQ(qi){
  if(confirm("¿Borrar esta pregunta?")){ DATA.questions.splice(qi,1); saveData(); renderEditor(); }
}
function moveQ(qi,dir){
  const ni=qi+dir;
  if(ni<0||ni>=DATA.questions.length) return;
  [DATA.questions[qi],DATA.questions[ni]]=[DATA.questions[ni],DATA.questions[qi]];
  saveData(); renderEditor();
}

/* import / export */
function exportData(){
  const blob=new Blob([JSON.stringify(DATA,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="cazadores-preguntas.json"; a.click();
  URL.revokeObjectURL(url);
  toast("Preguntas exportadas");
}
function importData(input){
  const file=input.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const parsed=JSON.parse(e.target.result);
      if(!parsed.questions||!parsed.stages) throw new Error("formato");
      DATA=parsed; if(!DATA.timePerQuestion) DATA.timePerQuestion=20;
      saveData(); applyColors(); renderEditor(); toast("Preguntas importadas");
    }catch(err){ alert("Ese archivo no tiene el formato correcto."); }
  };
  reader.readAsText(file);
  input.value="";
}

/* Fijar como predeterminadas: genera el bloque para pegar en game.js
   y así todos vean las mismas preguntas al abrir el link publicado. */
function pinDefaults(){
  const code = "const DEFAULT_DATA = " + JSON.stringify(DATA, null, 2) + ";";
  const ok = window.prompt(
    "Copia TODO este texto (Ctrl+C) y reemplaza con él el bloque 'const DEFAULT_DATA = { ... };' que está al inicio del archivo game.js. Así estas preguntas quedarán fijas para todos los que abran el juego.",
    code
  );
  // El prompt ya deja el texto seleccionado para copiar; también lo copiamos al portapapeles si se puede.
  if(navigator.clipboard){
    navigator.clipboard.writeText(code).then(
      ()=>toast("Código copiado: pégalo en game.js"),
      ()=>{}
    );
  }
}

/* seguridad básica al inyectar texto del usuario */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s){ return escapeHtml(s); }

/* ---- init ---- */
document.addEventListener("DOMContentLoaded",()=>{
  applyColors();
  document.querySelectorAll(".count-pick button").forEach(b=>{
    b.onclick=()=>setPlayerCount(parseInt(b.dataset.n));
  });
  show("start");
});

import { enviarScrap, ouvirScraps } from "./firebase.js";

const $ = (sel) => document.querySelector(sel);
const lista = $("#scrap-lista");
const form = $("#scrap-form");
const nomeInput = $("#nome");
const msgInput = $("#mensagem");
const statusBox = $("#status-scraps");
const contador = $("#contador-scraps");

function esc(text){
  return String(text || "").replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
}

function formatDate(ts){
  try{
    const d = ts && ts.toDate ? ts.toDate() : new Date();
    return d.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }catch(e){ return 'agora'; }
}

function renderScraps(scraps, error){
  if(error){
    statusBox.innerHTML = "⚠️ Não consegui carregar os scraps. Confira as regras do Firestore.";
    statusBox.classList.add('erro');
    return;
  }
  statusBox.textContent = "scraps públicos em tempo real";
  statusBox.classList.remove('erro');
  contador.textContent = `${scraps.length} scrap${scraps.length===1?'':'s'}`;
  if(!scraps.length){
    lista.innerHTML = `<div class="empty">Seja o primeiro a deixar um scrap para a Maju 💜</div>`;
    return;
  }
  lista.innerHTML = scraps.map(s => `
    <article class="scrap">
      <img src="${esc(s.avatar || 'avatares/avatar1.jpg')}" alt="avatar">
      <div>
        <header><strong>${esc(s.nome || 'Visitante')}</strong><span>${formatDate(s.createdAt)}</span></header>
        <p>${esc(s.mensagem || '').replace(/\n/g,'<br>')}</p>
        <div class="acoes">excluir | denunciar</div>
      </div>
    </article>
  `).join('');
}

form?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'enviando...';
  try{
    await enviarScrap(nomeInput.value, msgInput.value);
    msgInput.value = '';
    statusBox.textContent = 'Scrap enviado! Todos já conseguem ver 💜';
  }catch(e){
    statusBox.textContent = 'Erro ao enviar. Veja se as regras do Firestore estão em modo teste.';
    statusBox.classList.add('erro');
  }finally{
    btn.disabled = false;
    btn.textContent = 'enviar scrap';
  }
});

ouvirScraps(renderScraps);

// contador simples de visita local
const key = 'visitas-niver-maju';
const atual = Number(localStorage.getItem(key) || 0) + 1;
localStorage.setItem(key, atual);
document.querySelectorAll('[data-visitas]').forEach(el => el.textContent = atual);

// busca decorativa
const busca = document.querySelector('#busca');
busca?.addEventListener('keydown', e => {
  if(e.key === 'Enter') alert('Busca estilo Orkut: use os botões do site para navegar 💜');
});

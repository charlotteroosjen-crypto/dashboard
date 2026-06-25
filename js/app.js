const titles = {
  intro: 'Inleiding en probleemstelling',
  burger: 'Burgerparticipatie in de opsporing',
  online: 'Online amateurspeurdersgemeenschappen',
  platform: 'Online platformen en platformdynamiek',
  community: 'Gemeenschapsvorming binnen online amateurspeurdersgemeenschappen',
  legit: 'Legitimering en grenzen van burgeropsporing'
};
const nodes = document.querySelectorAll('.concept-node');
const titleEl = document.getElementById('topic-title');
const contentEl = document.getElementById('topic-content');
function renderTopic(key){
  if(!contentEl) return;
  titleEl.textContent = titles[key];
  contentEl.innerHTML = window.DASHBOARD_CONTENT[key] || '';
  nodes.forEach(n => n.classList.toggle('active', n.dataset.topic === key));
  bindFootnotes();
}
nodes.forEach(node => node.addEventListener('click', () => renderTopic(node.dataset.topic)));
renderTopic('intro');

const navLinks = document.querySelectorAll('.nav-link');
const sections = [...document.querySelectorAll('main section[id]')];
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
},{rootMargin:'-40% 0px -55% 0px',threshold:0});
sections.forEach(sec=>observer.observe(sec));

const pop = document.getElementById('footnote-popover');
function showFootnote(btn){
  const n = btn.dataset.fn;
  const ref = window.DASHBOARD_FOOTNOTES[n] || 'Bronverwijzing wordt opgenomen in de volledige literatuurlijst.';
  pop.innerHTML = `<strong>Voetnoot ${n}</strong>${ref}`;
  pop.style.display = 'block';
  const rect = btn.getBoundingClientRect();
  const left = Math.min(rect.left, window.innerWidth - 380);
  pop.style.left = Math.max(12, left) + 'px';
  pop.style.top = Math.min(rect.bottom + 10, window.innerHeight - pop.offsetHeight - 12) + 'px';
}
function hideFootnote(){ pop.style.display = 'none'; }
function bindFootnotes(){
  document.querySelectorAll('.fn').forEach(btn=>{
    btn.addEventListener('mouseenter',()=>showFootnote(btn));
    btn.addEventListener('focus',()=>showFootnote(btn));
    btn.addEventListener('mouseleave',hideFootnote);
    btn.addEventListener('blur',hideFootnote);
    btn.addEventListener('click',(e)=>{ e.preventDefault(); showFootnote(btn); });
  });
}
document.addEventListener('click',(e)=>{ if(!e.target.classList.contains('fn')) hideFootnote(); });

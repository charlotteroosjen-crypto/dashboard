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
  if(!contentEl || !titleEl) return;
  titleEl.textContent = titles[key];
  contentEl.innerHTML = window.DASHBOARD_CONTENT[key] || '';
  nodes.forEach(n => n.classList.toggle('active', n.dataset.topic === key));
  bindFootnotes();
}
nodes.forEach(node => node.addEventListener('click', () => renderTopic(node.dataset.topic)));
if (nodes.length) renderTopic('intro');

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


// Methodologie route buttons
const methodSteps = document.querySelectorAll('.method-route .route-step[data-target]');
methodSteps.forEach(step => {
  step.addEventListener('click', () => {
    methodSteps.forEach(s => s.classList.remove('active-step'));
    step.classList.add('active-step');
    const target = document.getElementById(step.dataset.target);
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// Initial footnote binding for static factsheet content
bindFootnotes();


// Build 8 tabs for bronnen & AI-verantwoording
const tabButtons = document.querySelectorAll('.tab-button[data-tab]');
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const wrapper = button.closest('.tabs-card');
    if (!wrapper) return;
    wrapper.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    wrapper.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    button.classList.add('active');
    const panel = wrapper.querySelector('#' + button.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

// Final navigation polish: only the current section is active.
(function(){
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const secs = Array.from(document.querySelectorAll('main section[id]'));
  function setActive(id){
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
  }
  links.forEach(link => {
    link.addEventListener('click', () => {
      const id = (link.getAttribute('href') || '').replace('#','');
      if (id) setActive(id);
    });
  });
  function updateActive(){
    const probe = window.scrollY + Math.min(window.innerHeight * 0.35, 260);
    let current = secs[0]?.id || 'home';
    for (const sec of secs){
      if (sec.offsetTop <= probe) current = sec.id;
    }
    setActive(current);
  }
  window.addEventListener('scroll', updateActive, {passive:true});
  window.addEventListener('load', updateActive);
  updateActive();
})();

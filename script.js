// Simple, dependency-free carousel with keyboard, swipe & auto-play.
// Replace media files with your own. Keeps UX buttery and accessible.

(function(){
  const carousel = document.getElementById('carousel');
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const dotsContainer = document.getElementById('dots');
  let idx = 0, autoplay = true, autoplayInterval = 16000, timer;

  // Create dots
  slides.forEach((s, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i+1}`);
    dot.addEventListener('click', () => goto(i));
    dotsContainer.appendChild(dot);
  });

  function show(i){
    slides.forEach((s) => s.classList.remove('active'));
    slides[i].classList.add('active');
    // Pause/play video if present
    slides.forEach(s => {
      const v = s.querySelector('video');
      if(v){ v.pause(); v.currentTime = 0; }
    });
    const curVideo = slides[i].querySelector('video');
    if(curVideo){ curVideo.play().catch(()=>{}); }
    // dots
    Array.from(dotsContainer.children).forEach((d,k)=> {
      d.classList.toggle('active', k===i);
    });
  }

  function goto(i){
    idx = (i + slides.length) % slides.length;
    show(idx);
    resetTimer();
  }

  // prev/next
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  prevBtn.addEventListener('click', ()=> goto(idx-1));
  nextBtn.addEventListener('click', ()=> goto(idx+1));

  // keyboard
  window.addEventListener('keydown', e=>{
    if(e.key === 'ArrowLeft') goto(idx-1);
    if(e.key === 'ArrowRight') goto(idx+1);
  });

  // touch support (swipe)
  let startX = null;
  carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  carousel.addEventListener('touchend', e => {
    if(startX === null) return;
    let dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx < 0) goto(idx+1); else goto(idx-1);
    }
    startX = null;
  });

  // autoplay
  function play(){
    timer = setInterval(()=> goto(idx+1), autoplayInterval);
  }
  function resetTimer(){
    if(timer) clearInterval(timer);
    if(autoplay) play();
  }
  // start
  show(0);
  play();

  // Lazy reveal on scroll for gallery tiles
  const tiles = document.querySelectorAll('.tile');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if(ent.isIntersecting){
        ent.target.style.transform = 'translateY(0) scale(1)';
        ent.target.style.opacity = '1';
        obs.unobserve(ent.target);
      }
    })
  }, { threshold: 0.12 });
  tiles.forEach(t => {
    t.style.transform = 'translateY(18px) scale(.99)';
    t.style.opacity = '0';
    t.style.transition = 'transform .6s cubic-bezier(.2,.9,.3,1), opacity .6s';
    obs.observe(t);
  });

  // click on tile to open in full-screen lightbox (basic)
  tiles.forEach(t => t.addEventListener('click', () => {
    const img = t.querySelector('img');
    if(!img) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.9);display:flex;align-items:center;justify-content:center;z-index:1200;padding:20px";
    const big = img.cloneNode(true);
    big.style.maxWidth = '92%'; big.style.maxHeight = '92%'; big.style.borderRadius='8px';
    overlay.appendChild(big);
    overlay.addEventListener('click', ()=> document.body.removeChild(overlay));
    document.body.appendChild(overlay);
  }));
})();

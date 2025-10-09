// Minimal interactivity for Cypher prototype
document.addEventListener('DOMContentLoaded',function(){
  // Countdown
  const countdown = document.querySelector('.countdown');
  if(countdown){
    const target = new Date(countdown.dataset.date);
    const el = countdown.querySelector('.count');
    function tick(){
      const now = new Date();
      let diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000*60*60*24));
      diff -= days*(1000*60*60*24);
      const hours = Math.floor(diff/(1000*60*60));
      diff -= hours*(1000*60*60);
      const mins = Math.floor(diff/(1000*60));
      diff -= mins*(1000*60);
      const secs = Math.floor(diff/1000);
      el.textContent = `${String(days).padStart(2,'0')}d : ${String(hours).padStart(2,'0')}h : ${String(mins).padStart(2,'0')}m : ${String(secs).padStart(2,'0')}s`;
    }
    tick();
    setInterval(tick,1000);
  }

  // Newsletter
  const form = document.getElementById('newsletter');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const email = document.getElementById('email').value;
      // simple validation
      if(!email) return;
      // show thanks
      document.getElementById('thanks').hidden = false;
      form.reset();
      // fire a custom event (placeholder for analytics)
      document.dispatchEvent(new CustomEvent('cypher_newsletter_signup',{detail:{email}}));
    });
  }
});

// Reveal on scroll for elements with .reveal
document.addEventListener('DOMContentLoaded', function(){
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && reveals.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.15});
    reveals.forEach(r=>io.observe(r));
  } else {
    // fallback: immediately show
    reveals.forEach(r=>r.classList.add('in-view'));
  }
});

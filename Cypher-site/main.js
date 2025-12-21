// Shared client-side storage and helpers for a simple static demo
const storage = {
  get(key){try {return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}},
  set(key,val){localStorage.setItem(key,JSON.stringify(val))}
}

// --- Network (Home feed) ---
function initNetwork(){
  const postsKey = 'cdn_posts'
  const posts = storage.get(postsKey) || [
    {id:1,author:'Ava',text:'Big weekend performance at City Stage — crowd was lit!',time:Date.now()-3600000}
  ]
  if (!storage.get(postsKey)) storage.set(postsKey,posts)
  renderPosts()

  document.getElementById('createPostBtn').addEventListener('click', ()=>{
    const text = document.getElementById('postText').value.trim()
    const author = document.getElementById('postAuthor').value.trim() || 'Unknown'
    if (!text) return alert('Write something to post.')
    const newPost = {id:Date.now(),author,text,time:Date.now()}
    const cur = storage.get(postsKey) || []
    cur.unshift(newPost)
    storage.set(postsKey,cur)
    document.getElementById('postText').value=''
    showToast('Post published', {type:'success'})
    renderPosts()
    showFlash(document.querySelector('#postsContainer .post'))
  })

  function renderPosts(){
    const container = document.getElementById('postsContainer')
    let cur = storage.get(postsKey) || []
    // if no data in storage but static samples exist in DOM, seed storage from DOM
    if (!cur.length && container && container.children.length){
      const items = Array.from(container.querySelectorAll('article.post'))
      if (items.length){
        cur = items.map((el, idx)=>{
          const authorMeta = el.querySelector('.meta')?.textContent || ''
          const [authorPart] = authorMeta.split('•').map(s=>s.trim())
          const author = authorPart || ('User'+(idx+1))
          const text = el.querySelector('div:not(.meta)')?.textContent || el.textContent
          return {id:Date.now()+idx, author:author, text:text.trim(), time:Date.now()-(idx*3600000)}
        })
        storage.set(postsKey, cur)
      }
    }

    if (!cur.length){
      // leave existing static content if any, otherwise show message
      if (container && container.children.length) return
      container.innerHTML = '<p class="muted">No posts yet.</p>'
      return
    }

    container.innerHTML = cur.map(p=>{
      const initials = escapeHtml((p.author||'').split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase())
      return `
      <article class="post card">
        <div class="row">
          <div style="width:56px;flex-shrink:0"><div class="avatar">${initials}</div></div>
          <div style="flex:1">
            <div class="meta">${escapeHtml(p.author)} • ${new Date(p.time).toLocaleString()}</div>
            <div>${escapeHtml(p.text)}</div>
          </div>
        </div>
      </article>`
    }).join('\n')
  }
}

// --- Portfolio ---
function initPortfolio(){
  const key = 'cdn_portfolio'
  const container = document.getElementById('portfolioContainer')
  document.getElementById('addPortfolioBtn').addEventListener('click', ()=>{
    const name = document.getElementById('pfName').value.trim() || 'Untitled'
    const style = document.getElementById('pfStyle').value.trim() || 'Various'
    const date = document.getElementById('pfDate').value || new Date().toISOString().slice(0,10)
    const desc = document.getElementById('pfDesc').value.trim()
    const cur = storage.get(key) || []
    cur.unshift({id:Date.now(),name,style,date,desc})
    storage.set(key,cur)
    document.getElementById('pfName').value=''
    document.getElementById('pfStyle').value=''
    document.getElementById('pfDate').value=''
    document.getElementById('pfDesc').value=''
    showToast('Portfolio item added', {type:'success'})
    render()
    showFlash(document.querySelector('#portfolioContainer .portfolio-item'))
  })
  render()
  function render(){
    let cur = storage.get(key) || []
    // If storage empty but static DOM samples exist, seed from DOM
    if (!cur.length && container && container.children.length){
      const items = Array.from(container.querySelectorAll('.portfolio-item'))
      if (items.length){
        cur = items.map((el, idx)=>{
          const name = el.querySelector('strong')?.textContent?.trim() || ('Untitled '+(idx+1))
          const meta = el.querySelector('.meta')?.textContent || ''
          const [stylePart, datePart] = meta.split('•').map(s=>s.trim())
          const style = stylePart || 'Various'
          const date = datePart || new Date().toISOString().slice(0,10)
          const desc = el.querySelector('p')?.textContent?.trim() || ''
          return {id:Date.now()+idx,name,style,date,desc}
        })
        storage.set(key,cur)
      }
    }

    if (!cur.length){
      if (container && container.children.length) return
      container.innerHTML = '<p class="muted">No items yet. Add your work to showcase.</p>'
      return
    }

    container.innerHTML = cur.map(i=>{
      const initials = escapeHtml((i.name||'').split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase())
      return `
      <div class="portfolio-item" tabindex="0">
        <div class="row">
          <div style="width:64px;flex-shrink:0;">
            <div class="avatar">${initials}</div>
          </div>
          <div style="flex:1">
            <strong>${escapeHtml(i.name)}</strong>
            <div class="meta">${escapeHtml(i.style)} • ${i.date}</div>
            <p class="small" style="margin-top:8px">${escapeHtml(i.desc)}</p>
          </div>
        </div>
      </div>`
    }).join('\n')
  }
}

// --- Jobs ---
function initJobs(){
  const key = 'cdn_jobs'
  const container = document.getElementById('jobsContainer')
  document.getElementById('postJobBtn').addEventListener('click', ()=>{
    const title = document.getElementById('jobTitle').value.trim() || 'Untitled'
    const loc = document.getElementById('jobLoc').value.trim() || 'Remote/Various'
    const style = document.getElementById('jobStyle').value.trim() || 'Any'
    const desc = document.getElementById('jobDesc').value.trim() || ''
    const cur = storage.get(key) || []
    cur.unshift({id:Date.now(),title,loc,style,desc})
    storage.set(key,cur)
    document.getElementById('jobTitle').value=''
    document.getElementById('jobLoc').value=''
    document.getElementById('jobStyle').value=''
    document.getElementById('jobDesc').value=''
    showToast('Job posted', {type:'success'})
    render()
    showFlash(document.querySelector('#jobsContainer .job-item'))
  })
  render()
  function render(){
    const cur = storage.get(key) || []
    if (!cur.length) container.innerHTML = '<p class="muted">No job listings yet.</p>'
    else container.innerHTML = cur.map(j=>{
      const initials = escapeHtml((j.title||'').split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase())
      return `
      <div class="job-item" tabindex="0">
        <div class="row">
          <div style="width:64px;flex-shrink:0"><div class="avatar">${initials}</div></div>
          <div style="flex:1">
            <strong>${escapeHtml(j.title)}</strong>
            <div class="meta">${escapeHtml(j.style)} • ${escapeHtml(j.loc)}</div>
            <p class="small" style="margin-top:8px">${escapeHtml(j.desc)}</p>
          </div>
        </div>
      </div>`
    }).join('\n')
  }
}

// --- Messages ---
function initMessages(){
  const key = 'cdn_threads'
  const threadsContainer = document.getElementById('threadsContainer')
  const messagesContainer = document.getElementById('messagesContainer')
  let activeThread = null

  document.getElementById('startThreadBtn').addEventListener('click', ()=>{
    const name = document.getElementById('newThreadName').value.trim()
    if (!name) return alert('Enter a name to start a conversation')
    const cur = storage.get(key) || []
    const existing = cur.find(t => t.name.toLowerCase()===name.toLowerCase())
    if (existing) activeThread = existing.id
    else { const id = Date.now(); cur.unshift({id,name,messages:[]}); storage.set(key,cur); activeThread=id }
    document.getElementById('newThreadName').value=''
    showToast('Conversation started', {type:'success'})
    renderThreads(); renderActive()
    showFlash(document.querySelector('#threadsContainer .thread-item'))
  })

  document.getElementById('sendMessageBtn').addEventListener('click', ()=>{
    if (!activeThread) return alert('Select a conversation')
    const sender = document.getElementById('messageSender').value.trim() || 'You'
    const text = document.getElementById('messageText').value.trim()
    if (!text) return
    const cur = storage.get(key) || []
    const thread = cur.find(t=>t.id===activeThread)
    thread.messages.push({id:Date.now(),sender,text,time:Date.now()})
    storage.set(key,cur)
    document.getElementById('messageText').value=''
    showToast('Message sent', {type:'success'})
    renderActive()
    const last = document.getElementById('messagesContainer')?.lastElementChild
    if (last) { last.scrollIntoView({behavior:'smooth',block:'end'}); showFlash(last) }
  })

  function renderThreads(){
    const cur = storage.get(key) || []
    if (!cur.length) threadsContainer.innerHTML = '<p class="muted">No conversations yet.</p>'
    else threadsContainer.innerHTML = cur.map(t=>`<div class="thread-item" data-id="${t.id}"><strong>${escapeHtml(t.name)}</strong><div class="meta">${t.messages.length} messages</div></div>`).join('\n')

    // attach click and mark active
    threadsContainer.querySelectorAll('.thread-item').forEach(el=>{
      const id = Number(el.getAttribute('data-id'))
      el.setAttribute('tabindex','0')
      if (id === activeThread) el.classList.add('active')
      el.addEventListener('click', ()=>{
        activeThread = id
        renderActive()
        // On small screens hide the threads column and show message view
        const leftCol = document.querySelector('.messages-list')
        const back = document.getElementById('backToThreads')
        if (window.innerWidth < 900 && leftCol){
          leftCol.classList.add('hidden')
          if (back) back.setAttribute('aria-hidden','false')
        }
      })
      el.addEventListener('keydown', (e)=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click() } })
    })
  }

  function renderActive(){
    const cur = storage.get(key) || []
    const thread = cur.find(t=>t.id===activeThread)
    const title = document.getElementById('threadTitle')
    if (!thread){ title.textContent='Select a conversation'; messagesContainer.innerHTML=''; return }
    title.textContent = thread.name
    messagesContainer.innerHTML = thread.messages.map(m=>`<div class="message ${m.sender==='You' ? 'out' : 'in'}"><div class="meta">${escapeHtml(m.sender)} • ${new Date(m.time).toLocaleString()}</div><div>${escapeHtml(m.text)}</div></div>`).join('\n')
  }

  // back button behavior for mobile
  const backBtn = document.getElementById('backToThreads')
  if (backBtn){
    backBtn.addEventListener('click', ()=>{
      const left = document.querySelector('.messages-list')
      if (left) left.classList.remove('hidden')
      backBtn.setAttribute('aria-hidden','true')
    })
  }

  renderThreads(); renderActive()
}

// --- Helpers ---
function escapeHtml(str){ if(!str) return ''; return String(str).replace(/[&<>"]/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])) }
// Header: mobile toggle and active link handling
function initHeader(){
  const toggle = document.querySelector('.menu-toggle')
  const nav = document.querySelector('.main-nav')
  if (!nav) return
  if (toggle){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open')
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
  }

  // Active link detection
  const links = document.querySelectorAll('.main-nav .nav-link')
  const current = location.pathname.split('/').pop() || 'cyphersite.html'
  links.forEach(a => {
    const href = a.getAttribute('href')
    if (!href) return
    if (href === current || (href === 'cyphersite.html' && (current === '' || current === 'cyphersite.html'))){
      a.classList.add('active')
    }
    // close mobile menu when navigating
    a.addEventListener('click', ()=>{
      if (nav.classList.contains('open')){
        nav.classList.remove('open')
        if (toggle) toggle.setAttribute('aria-expanded','false')
      }
    })
  })
}

// Init header on all pages
document.addEventListener('DOMContentLoaded', ()=>{ if (typeof initHeader === 'function') initHeader() })

// tiny toast utility for feedback
function showToast(message, opts){
  opts = opts || {}
  let wrap = document.querySelector('.toast-wrap')
  if (!wrap){ wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap) }
  const el = document.createElement('div')
  el.className = 'toast' + (opts.type?(' '+opts.type):'')
  el.textContent = message
  wrap.appendChild(el)
  requestAnimationFrame(()=> el.classList.add('show'))
  const timeout = opts.timeout || 3200
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=> el.remove(),220) }, timeout)
}

// subtle highlight for newly added items
function showFlash(el){
  if (!el) return
  el.classList.add('flash')
  setTimeout(()=> el.classList.remove('flash'), 920)
}

// Small convenience: if user opens any page that has no storage keys, setup them lazily
(function ensureDefaults(){
  if (!storage.get('cdn_jobs')) storage.set('cdn_jobs',[])
  if (!storage.get('cdn_posts')) storage.set('cdn_posts',[])
  if (!storage.get('cdn_portfolio')) storage.set('cdn_portfolio',[])
  if (!storage.get('cdn_threads')) storage.set('cdn_threads',[])

  // Seed small demo items if the lists are empty (improves first-run experience)
  if ((storage.get('cdn_posts')||[]).length === 0){
    storage.set('cdn_posts', [
      {id:Date.now()+1, author:'Ava', text:'Big weekend performance at City Stage — crowd was lit!', time:Date.now()-3600000},
      {id:Date.now()+2, author:'Marco', text:'Booked a sync for next Saturday — see you there!', time:Date.now()-7200000},
      {id:Date.now()+3, author:'Sofia', text:'Dropped a new rehearsal clip — open to collabs!', time:Date.now()-10800000},
      {id:Date.now()+4, author:'Kofi', text:'Looking for background dancers for a short film in LA. DM for details.', time:Date.now()-86400000}
    ])
  }
  if ((storage.get('cdn_portfolio')||[]).length === 0){
    storage.set('cdn_portfolio', [
      {id:Date.now()+5, name:'Street Festival — Ensemble', style:'Hip-hop', date:'2024-08-12', desc:'Performed as part of the company ensemble; choreography by Lina.'},
      {id:Date.now()+6, name:'Contemporary Solo — "Falling Stars"', style:'Contemporary', date:'2023-11-02', desc:'Solo piece exploring fluidity and space; filmed for the festival showcase.'},
      {id:Date.now()+7, name:'Music Video — "Glow"', style:'Commercial', date:'2024-03-18', desc:'Featured as lead dancer in an indie artist music video. Contact: director@studio.example'}
    ])
  }
  if ((storage.get('cdn_jobs')||[]).length === 0){
    storage.set('cdn_jobs', [
      {id:Date.now()+8, title:'Background Dancers — Tour (6x)', loc:'NYC', style:'Commercial', desc:'Hiring 6 dancers for a concert tour across the East Coast. Send reel + availability to bookings@example.com'},
      {id:Date.now()+9, title:'Contemporary Ensemble', loc:'Remote auditions', style:'Contemporary', desc:'Auditions open for contemporary ensemble; submit videos by Jan 10.'},
      {id:Date.now()+10, title:'Music Video Feature', loc:'Los Angeles', style:'Hip-hop/Commercial', desc:'Paid gig — shooting March 2025. Must have own wardrobe.'},
      {id:Date.now()+11, title:'Background Dancers — Festival', loc:'Austin, TX', style:'Various', desc:'One-day gig for festival performance. $150 flat. Email festival@events.example'}
    ])
  }
  if ((storage.get('cdn_threads')||[]).length === 0){
    storage.set('cdn_threads', [
      {id:Date.now()+12, name:'Lina (Choreographer)', messages:[{id:1,sender:'Lina',text:'Are you available for rehearsals next week?',time:Date.now()-3600000},{id:2,sender:'You',text:'Yes, I can do evenings.',time:Date.now()-3500000}]},
      {id:Date.now()+13, name:'Marco (Music Director)', messages:[{id:1,sender:'Marco',text:'Love your latest clip — can we chat about a sync?',time:Date.now()-5400000}]},
      {id:Date.now()+14, name:'Casting — Festival', messages:[{id:1,sender:'Casting',text:'We received your submission. Can you send a higher-quality clip?',time:Date.now()-172800000},{id:2,sender:'You',text:'Sure — I will send it today.',time:Date.now()-171000000}]}
    ])
  }
})

// handlers generales para botones y formularios
(function(){
  'use strict';

  function saveToLocal(key, item){
    try{
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(item);
      localStorage.setItem(key, JSON.stringify(arr));
      return true;
    }catch(e){ return false; }
  }

  function isEmail(v){ return /\S+@\S+\.\S+/.test(v); }

  document.addEventListener('DOMContentLoaded', function(){
    // Cargar data de destinos (cache simple)
    let destinosData = { destinations: [], deals: [] };
    fetch('data/destinos.json').then(r=>r.json()).then(j=>{ destinosData = j || destinosData; }).catch(()=>{/* ignore */});

    // Helper: crear modal simple de resultados
    function showResultsModal(results, onSelect){
      // crear overlay si no existe
      let overlay = document.getElementById('resultsOverlay');
      if(!overlay){
        overlay = document.createElement('div'); overlay.id = 'resultsOverlay'; overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1200;';
        const box = document.createElement('div'); box.id='resultsBox'; box.style.cssText='background:#fff;padding:18px;border-radius:8px;max-width:720px;width:90%;max-height:80vh;overflow:auto;';
        overlay.appendChild(box);
        document.body.appendChild(overlay);
      }
      const box = overlay.querySelector('#resultsBox');
      box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><h3 style="margin:0;font-size:1.1rem">Resultados</h3><button id="closeResults" style="background:transparent;border:0;font-size:1.2rem">✕</button></div>';
      const list = document.createElement('div');
      if(!results || results.length===0) list.innerHTML = '<p>No se encontraron resultados.</p>';
      else{
        results.forEach(r=>{
          const item = document.createElement('div'); item.style.cssText='padding:10px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;gap:8px;';
          const left = document.createElement('div');
          left.innerHTML = `<strong>${r.name}</strong><div style="font-size:0.9rem;color:#666">${r.country||''} ${r.short || ''}</div>`;
          const right = document.createElement('div');
          const sel = document.createElement('button'); sel.className='sbm-btn'; sel.textContent='Seleccionar';
          sel.addEventListener('click', ()=>{ if(typeof onSelect==='function') onSelect(r); overlay.remove(); });
          right.appendChild(sel);
          item.appendChild(left); item.appendChild(right);
          list.appendChild(item);
        });
      }
      box.appendChild(list);
      box.querySelector('#closeResults').addEventListener('click', ()=>overlay.remove());
    }

    // Buscar desde la interfaz del calendario
    const calSearchBtn = document.getElementById('calendarSearchBtn');
    const calSearchInput = document.getElementById('calendarSearchInput');
    if(calSearchBtn && calSearchInput){
      calSearchBtn.addEventListener('click', function(){
        const q = (calSearchInput.value||'').trim().toLowerCase();
        if(!q) return alert('Introduce un destino para buscar.');
        const all = (destinosData.destinations || []).concat(destinosData.deals || []);
        const results = all.filter(d=> (d.name||'').toLowerCase().includes(q) || (d.tags||[]).some(t=> t.toLowerCase().includes(q)) ).slice(0,12);
        showResultsModal(results, function(dest){
          // Al seleccionar: setear select de destino y desplazar al calendario
          const bookingDest = document.getElementById('destination');
          if(bookingDest){
            bookingDest.value = dest.name || bookingDest.options[0]?.value || '';
          }
          // Resaltar fechas si hay availableDates (array de ISO strings) en objeto destino
          if(dest.availableDates && Array.isArray(dest.availableDates)){
            // quitar clases previas
            document.querySelectorAll('.date-cell').forEach(n=>{ n.classList.remove('highlight-search'); });
            dest.availableDates.forEach(iso=>{
              const cell = document.querySelector(`.date-cell[data-date="${iso}"]`);
              if(cell) cell.classList.add('highlight-search');
            });
          }
          // abrir modal de booking si hay una fecha pre-seleccionada en availableDates
          // desplazar a la sección del calendario
          const cal = document.querySelector('.calendar-section') || document.querySelector('.calendar-container');
          if(cal) cal.scrollIntoView({behavior:'smooth', block:'start'});
          // si hay una fecha disponible, abrir modal pidiendo seleccionar fecha
          setTimeout(()=>{
            // si hay una fecha ya visible en el input de booking (selectedDate) no tocar
            const selectedDateInput = document.getElementById('selectedDate');
            if(selectedDateInput && (!selectedDateInput.value || selectedDateInput.value==='')){
              // si destino tiene availableDates, seleccionamos la primera automáticamente
              if(dest.availableDates && dest.availableDates.length>0){
                selectedDateInput.value = dest.availableDates[0];
                const modal = document.getElementById('bookingModal');
                if(modal) modal.style.display = 'block';
              }
            }
          }, 450);
        });
      });
    }
    // Autocompletado para origin / destination en index
    function renderSuggestionsBox(boxEl, items, onPick){
      boxEl.innerHTML = '';
      if(!items || items.length===0) return;
      items.slice(0,8).forEach(it=>{
        const div = document.createElement('div'); div.className='suggest-item';
        div.style.cssText = 'padding:8px;cursor:pointer;border-bottom:1px solid #eee;';
        if(it.type === 'airport') div.innerHTML = `<strong>${it.code}</strong> — ${it.name} <div style="font-size:0.85rem;color:#666">${it.city||''}</div>`;
        else div.innerHTML = `<strong>${it.name}</strong> <div style="font-size:0.85rem;color:#666">${(it.tag||'')}</div>`;
        div.addEventListener('click', ()=>{ if(typeof onPick==='function') onPick(it); boxEl.innerHTML=''; });
        boxEl.appendChild(div);
      });
    }

    function setupAutocomplete(inputId, suggestionsId, opts){
      const inp = document.getElementById(inputId); const box = document.getElementById(suggestionsId);
      if(!inp || !box) return;
      inp.addEventListener('input', function(){
        const q = (this.value||'').trim().toLowerCase();
        if(!q){ box.innerHTML=''; return; }
        const results = [];
        // airports
        (destinosData.destinations||[]).forEach(d=>{
          if(Array.isArray(d.airports)) d.airports.forEach(a=>{
            const label = (a.code + ' ' + a.name + ' ' + (d.name||'')).toLowerCase();
            if(label.includes(q)) results.push({ type:'airport', code:a.code, name:a.name, city: d.name });
          });
        });
        // destinos
        (destinosData.destinations||[]).forEach(d=>{
          const name = (d.name||'').toLowerCase();
          const tags = (d.tags||[]).map(t=>t.toLowerCase()).join(' ');
          if(name.includes(q) || tags.includes(q)) results.push({ type:'destination', id:d.id, name:d.name, tag: d.tag });
        });
        // deals
        (destinosData.deals||[]).forEach(dd=>{
          const title = (dd.title||'').toLowerCase(); const tags = (dd.tags||[]).map(t=>t.toLowerCase()).join(' ');
          if(title.includes(q) || tags.includes(q)) results.push({ type:'deal', id:dd.id, name: dd.title, tag: 'Oferta' });
        });
        // dedupe by text
        const seen = new Set(); const unique = [];
        results.forEach(r=>{ const key = (r.type==='airport'? r.code + '|' + r.city : (r.name||'') ); if(!seen.has(key)){ seen.add(key); unique.push(r); } });
        renderSuggestionsBox(box, unique, function(item){
          if(item.type==='airport') inp.value = item.code + ' - ' + item.name;
          else inp.value = item.name;
          // store selected id
          inp.dataset.selected = item.id || item.code || '';
        });
      });
      inp.addEventListener('focus', function(){ if(box.innerHTML.trim()===''){} });
      document.addEventListener('click', function(e){ if(!box.contains(e.target) && e.target !== inp) box.innerHTML=''; });
    }

    setupAutocomplete('originInput','originSuggestions', { origin:true });
    setupAutocomplete('destinationInput','destinationSuggestions', { origin:false });

    // Mostrar detalle de un ítem dentro del modal (sin cambiar página)
    function showItemDetailInModal(item){
      const overlay = document.getElementById('resultsOverlay');
      if(!overlay) return;
      const box = overlay.querySelector('#resultsBox');
      box.innerHTML = '';
      const header = document.createElement('div'); header.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;';
      header.innerHTML = `<h3 style="margin:0;font-size:1.1rem">${item.name || item.title || 'Detalle'}</h3>`;
      const closeBtn = document.createElement('button'); closeBtn.textContent='✕'; closeBtn.style.cssText='background:transparent;border:0;font-size:1.2rem';
      closeBtn.addEventListener('click', ()=> overlay.remove()); header.appendChild(closeBtn);
      box.appendChild(header);

      const content = document.createElement('div'); content.style.cssText='display:flex;gap:12px;align-items:flex-start;';
      const img = document.createElement('img'); img.src = item.img || ''; img.alt = item.name || ''; img.style.cssText='width:140px;height:90px;object-fit:cover;border-radius:6px;';
      const info = document.createElement('div'); info.style.cssText='flex:1;';
      info.innerHTML = `<div style="margin-bottom:8px;font-weight:600">${item.name||item.title||''}</div>
        <div style="color:#666;margin-bottom:8px">${(item.tags||[]).join(' · ') || (item.tag||'')}</div>
        <div style="margin-bottom:8px">Precio: ${item.price && item.price.adult ? '$'+item.price.adult : (item.price? '$'+item.price : '-')}</div>`;
      content.appendChild(img); content.appendChild(info);
      box.appendChild(content);

      const actions = document.createElement('div'); actions.style.cssText='display:flex;gap:8px;justify-content:flex-end;margin-top:12px;';
      const addBtn = document.createElement('button'); addBtn.className='sbm-btn'; addBtn.textContent='Agregar al buscador';
      addBtn.addEventListener('click', ()=>{
        const destInp = document.getElementById('destinationInput'); if(destInp) destInp.value = item.name || item.title || '';
        // store selected id
        if(destInp) destInp.dataset.selected = item.id || '';
        showToast('Destino agregado al buscador');
      });
      const bookBtn = document.createElement('button'); bookBtn.className='sbm-btn'; bookBtn.textContent='Reservar';
      bookBtn.addEventListener('click', ()=>{
        // si hay bookingModal en la página (calendario), abrirlo; si no, mostrar mensaje
        const modal = document.getElementById('bookingModal');
        if(modal){
          // set destination if select exists
          const destSelect = document.getElementById('destination'); if(destSelect) destSelect.value = item.name || '';
          // preselect date if available
          if(item.availableDates && item.availableDates.length>0){ const sd = document.getElementById('selectedDate'); if(sd) sd.value = item.availableDates[0]; }
          modal.style.display = 'block';
        } else {
          showToast('Para reservar, visita la página Calendario o selecciona una fecha en el calendario disponible.');
        }
      });
      actions.appendChild(addBtn); actions.appendChild(bookBtn);
      box.appendChild(actions);
    }

    // Buscar desde el boton amarillo en home: combinar destinations y deals y mostrar modal
    const homeSearchBtn = document.getElementById('searchBtn');
    const homeForm = document.getElementById('searchForm');
    if(homeSearchBtn && homeForm){
      homeSearchBtn.addEventListener('click', function(e){
        e.preventDefault();
        const originVal = (document.getElementById('originInput')||{value:''}).value.trim().toLowerCase();
        const destVal = (document.getElementById('destinationInput')||{value:''}).value.trim().toLowerCase();
        // combine datasets
        const results = [];
        (destinosData.destinations||[]).forEach(d=>{
          const match = (!destVal) || (d.name||'').toLowerCase().includes(destVal) || (d.tags||[]).some(t=>t.toLowerCase().includes(destVal));
          if(match) results.push(Object.assign({ type:'destination', name: d.name, id: d.id, img: d.img, price: d.price, tags: d.tags||[], availableDates: d.availableDates||[] }, d));
        });
        (destinosData.deals||[]).forEach(de=>{
          const match = (!destVal) || (de.title||'').toLowerCase().includes(destVal) || (de.tags||[]).some(t=>t.toLowerCase().includes(destVal));
          if(match) results.push(Object.assign({ type:'deal', name: de.title, id: de.id, img: de.img, price: { adult: de.price }, tags: de.tags||[], availableDates: de.availableDates||[] }, de));
        });
        if(results.length===0) return alert('No se encontraron resultados para tu búsqueda.');
        showResultsModal(results, function(sel){
          // Si estamos en calendario, mantenemos el comportamiento de resaltar fechas.
          const path = location.pathname.split('/').pop();
          if(path === 'calendario.html'){
            const bookingDest = document.getElementById('destination');
            if(bookingDest) bookingDest.value = sel.name || '';
            if(sel.availableDates && sel.availableDates.length>0){
              document.querySelectorAll('.date-cell').forEach(n=> n.classList.remove('highlight-search'));
              sel.availableDates.forEach(iso=>{ const cell = document.querySelector(`.date-cell[data-date="${iso}"]`); if(cell) cell.classList.add('highlight-search'); });
              const selectedDateInput = document.getElementById('selectedDate'); if(selectedDateInput) selectedDateInput.value = sel.availableDates[0];
              const modal = document.getElementById('bookingModal'); if(modal) modal.style.display = 'block';
            }
          } else {
            // En la home: no redirigir. Mostrar detalle en el mismo modal y permitir agregar al buscador o reservar.
            showItemDetailInModal(sel);
          }
        });
      });
    }
    // 1) searchBtn -> submit #searchForm if exists
    const searchBtn = document.getElementById('searchBtn');
    if(searchBtn){
      searchBtn.addEventListener('click', function(e){
        e.preventDefault();
        const f = document.getElementById('searchForm');
        if(f){
          // prefer requestSubmit when available (triggers form events)
          if(typeof f.requestSubmit === 'function') try{ f.requestSubmit(); return; } catch(err){}
          f.dispatchEvent(new Event('submit', { bubbles:true, cancelable:true }));
        }
      });
    }

    // 2) Suscribirme buttons -> abrir modal de suscripción (mejor UX que prompt)
    function ensureSubscribeModal(){
      if(document.getElementById('subscribeOverlay')) return;
      const overlay = document.createElement('div'); overlay.id='subscribeOverlay'; overlay.style.display='none';
      overlay.innerHTML = `<div id="subscribeBox"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><h3 style="margin:0;font-size:1.1rem">Suscríbete</h3><button id="closeSubscribe" style="background:transparent;border:0;font-size:1.2rem">✕</button></div>
        <p>Recibe nuestras mejores ofertas por correo.</p>
        <div style="display:flex;gap:8px;align-items:center;"><input id="subscribeEmail" type="email" placeholder="tu@correo.com" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px;" /><button id="subscribeSubmit" class="sbm-btn">Suscribirme</button></div>
      </div>`;
      document.body.appendChild(overlay);
      document.getElementById('closeSubscribe').addEventListener('click', ()=>overlay.remove());
      document.getElementById('subscribeSubmit').addEventListener('click', function(){
        const email = (document.getElementById('subscribeEmail')||{value:''}).value.trim();
        if(!email) return alert('Introduce un correo.');
        if(!isEmail(email)) return alert('Correo inválido.');
        const ok = saveToLocal('subscriptions', { email: email, at: Date.now(), page: location.pathname });
        overlay.remove();
        showToast(ok ? 'Gracias por suscribirte.' : 'No fue posible suscribirte.');
      });
    }

    Array.from(document.querySelectorAll('button')).forEach(btn=>{
      try{
        const txt = (btn.textContent||'').trim().toLowerCase();
        if(/suscrib/i.test(txt) || /suscribirme/.test(txt)){
          btn.addEventListener('click', function(e){
            e.preventDefault();
            ensureSubscribeModal();
            const o = document.getElementById('subscribeOverlay'); if(o) o.style.display='flex';
          });
        }
      }catch(e){/* ignore per-button errors */}
    });

    // toast simple
    function showToast(msg, timeout){
      timeout = timeout || 3500;
      const t = document.createElement('div'); t.className='toast-msg'; t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(()=>{ t.style.opacity = '0.01'; setTimeout(()=>t.remove(),400); }, timeout);
    }

    // 3) Global submit handler (protege bookingForm que ya tiene lógica propia)
    document.addEventListener('submit', function(e){
      const form = e.target;
      if(!form || form.nodeName !== 'FORM') return;
      // allow the calendario bookingForm to handle itself
      if(form.id === 'bookingForm') return;

      e.preventDefault();

      // Contact form detection: campos nombre, apellido, correo, asunto
      const hasNombre = form.querySelector('#nombre') || form.querySelector('[name="nombre"]');
      const hasCorreo = form.querySelector('#correo') || form.querySelector('input[type="email"]');

      if(hasNombre && hasCorreo){
        const nombre = (form.querySelector('#nombre')||form.querySelector('[name="nombre"]')).value.trim();
        const apellido = (form.querySelector('#apellido')||{value:''}).value.trim();
        const correo = (form.querySelector('#correo')||form.querySelector('input[type="email"]')).value.trim();
        const asunto = (form.querySelector('#asunto')||{value:''}).value.trim();
        if(!nombre || !correo || !asunto) return alert('Por favor completa los campos obligatorios.');
        if(!isEmail(correo)) return alert('Introduce un correo válido.');
        const contact = { nombre, apellido, correo, asunto, at: Date.now(), page: location.pathname };
        const ok = saveToLocal('contacts', contact);
        if(ok){
          alert('Mensaje enviado. Gracias, ' + nombre + '.');
          form.reset();
        } else alert('Error al guardar el mensaje.');
        return;
      }

      // Generic form: serializar inputs básicos
      const data = {};
      Array.from(form.querySelectorAll('input,select,textarea')).forEach(el=>{
        if(!el.name) return;
        if(el.type === 'checkbox') data[el.name] = !!el.checked;
        else data[el.name] = el.value;
      });
      saveToLocal('forms', { page: location.pathname, data: data, at: Date.now() });
      alert('Formulario recibido. Gracias.');
      try{ form.reset(); }catch(e){}
    });

    // 4) Generic button handlers: if button has data-action attribute, handle common actions
    document.querySelectorAll('button[data-action]').forEach(btn=>{
      btn.addEventListener('click', function(e){
        const action = btn.getAttribute('data-action');
        if(action === 'download-json'){
          const payload = btn.getAttribute('data-payload') || '{}';
          const blob = new Blob([payload], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = (btn.getAttribute('data-filename')||'download') + '.json';
          document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        }
      });
    });

  });
})();

/* Felipe Vieira portfolio. Progressive enhancement; no third-party runtime. */
(() => {
  'use strict';
  const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];
  const SCENARIOS = {
    logistica: {
      kicker: 'EFICIÊNCIA OPERACIONAL', title: 'Cada entrega conta.',
      measure: 'Entregas no prazo', unit: '%', min: 84, max: 98, target: 92,
      values: [87, 89.2, 88.6, 92.4, 91.1, 93.8, 94.8],
      secondary: [84.2, 91.5, 88.3, 106.8, 112.6, 121.7, 128.4],
      tertiary: [3.8, 3.7, 3.8, 3.4, 3.5, 3.2, 3.1],
      labels: ['No prazo', 'Objetos', 'Prazo médio'], units: ['%', 'mil', 'dias'],
      notes: ['volume no mês', 'tempo de entrega'],
      questionGood: 'O prazo melhorou. Em quais unidades o resultado ainda pode evoluir?',
      questionBad: 'O prazo ficou abaixo da meta. Quais unidades precisam de atenção primeiro?'
    },
    pessoas: {
      kicker: 'CAPACIDADE DA OPERAÇÃO', title: 'Pessoas fazem acontecer.',
      measure: 'Presença no período', unit: '%', min: 88, max: 100, target: 95,
      values: [90.5, 92.1, 91.2, 93.6, 94.4, 95.2, 96.4],
      secondary: [148, 152, 154, 160, 163, 170, 176],
      tertiary: [9.5, 7.9, 8.8, 6.4, 5.6, 4.8, 3.6],
      labels: ['Presença', 'Headcount', 'Ausências'], units: ['%', '', '%'],
      notes: ['pessoas na equipe', 'no período'],
      questionGood: 'A presença superou a meta. Como distribuir melhor a capacidade entre os setores?',
      questionBad: 'A presença ficou abaixo da meta. Em quais escalas estão os maiores desvios?'
    },
    custos: {
      kicker: 'INTELIGÊNCIA DE CUSTOS', title: 'Eficiência em cada envio.',
      measure: 'Custo por envio', unit: 'R$', min: 16, max: 26, target: 20,
      values: [23.4, 22.8, 23.1, 21.4, 20.9, 19.1, 18.42],
      secondary: [84.2, 91.5, 88.3, 106.8, 112.6, 121.7, 128.4],
      tertiary: [87, 89.2, 88.6, 92.4, 91.1, 93.8, 94.8],
      labels: ['Custo / envio', 'Objetos', 'No prazo'], units: ['R$', 'mil', '%'],
      notes: ['volume no mês', 'nível de serviço'],
      questionGood: 'O custo caiu sem perder o prazo. Quais rotas explicam essa eficiência?',
      questionBad: 'O custo está acima da meta. O desvio vem da rota, do volume ou do fornecedor?'
    }
  };
  const PROJECTS = {
    logistica: {
      category: 'Logística · Visão executiva e operacional', title: 'Control Tower Logística',
      summary: 'Uma visão integrada de entregas, prazos e ocorrências para sair do indicador agregado e chegar à causa do problema.',
      question: 'Onde a operação está perdendo eficiência — e o que precisa de atenção primeiro?',
      features: ['Entregas no prazo, volume e ocorrências por período.', 'Comparativos por unidade, rota e fornecedor.', 'Investigação do indicador até o detalhe operacional.', 'Tendências e desvios em relação às metas definidas.'],
      method: 'Validaria as regras de SLA e o histórico de eventos, trataria as bases e organizaria um modelo com calendário, unidades e entregas. As medidas seriam documentadas antes da construção das páginas.',
      tags: ['Power BI', 'Power Query', 'DAX', 'SQL']
    },
    pessoas: {
      category: 'Pessoas · Capacidade e acompanhamento', title: 'Headcount diário e mensal',
      summary: 'Uma leitura organizada de presença, escalas e capacidade, com acompanhamento diário e histórico mensal.',
      question: 'A capacidade disponível está alinhada à demanda de cada setor?',
      features: ['Presença e ausência por período, setor e escala.', 'Comparação entre capacidade planejada e disponível.', 'Histórico consolidado por gestor e locação.', 'Filtros e visões adequados a cada nível de gestão.'],
      method: 'Padronizaria cadastros e regras de presença, criaria um calendário de acompanhamento e validaria a consolidação dos registros. O acesso a dados pessoais seria limitado conforme a necessidade de cada público.',
      tags: ['Excel', 'Power Query', 'Power BI']
    },
    comex: {
      category: 'Comércio exterior · Operação marítima', title: 'Operação marítima internacional',
      summary: 'Rotas, volumes, custos e atrasos conectados em uma leitura que permite comparar operações e investigar gargalos.',
      question: 'Quais rotas e eventos concentram atrasos e custos adicionais?',
      features: ['Volumes e ocupação por rota e período.', 'Prazos previstos versus realizados por etapa.', 'Custos de bunker e acompanhamento de demurrage.', 'Comparação de portos e análise de ocorrências.'],
      method: 'Organizaria as etapas de viagem e seus eventos, conciliaria unidades e moedas com regras do negócio e construiria dimensões de portos, rotas e calendário para permitir comparações consistentes.',
      tags: ['Power BI', 'Power Query', 'DAX']
    },
    qualidade: {
      category: 'Logística · Qualidade e investigação', title: 'Análise de peso e cubagem',
      summary: 'Uma forma clara de identificar divergências, priorizar casos e acompanhar contestações sem perder o histórico.',
      question: 'Quais discrepâncias merecem investigação e qual é o seu possível impacto?',
      features: ['Comparação entre valores declarados e aferidos.', 'Priorização por magnitude, frequência e impacto estimado.', 'Detalhamento por unidade, cliente ou operação.', 'Histórico de contestações e situação de cada caso.'],
      method: 'Validaria unidades de medida, tolerâncias e regras de cubagem. Depois, estruturaria comparações rastreáveis e um histórico que separa divergência identificada, análise e resolução.',
      tags: ['Power BI', 'DAX', 'Qualidade de dados']
    }
  };
  const number = (value, decimals = 1) => new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals
  }).format(value);
  const point = (scenario, index) => ({
    x: 35 + index * (430 / 6),
    y: 165 - ((scenario.values[index] - scenario.min) / (scenario.max - scenario.min)) * 135
  });
  const chartPath = scenario => scenario.values.map((_, i) => {
    const p = point(scenario, i);
    return (i ? 'L' : 'M') + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
  }).join(' ');
  const metricText = (value, unit) => unit === 'R$' ? 'R$ ' + number(value, 2) : number(value, unit === '' ? 0 : 1) + (unit === '%' ? '%' : unit ? ' ' + unit : '');
  const deltaText = (scenario, index) => {
    if (index === 0) return 'início do período';
    const delta = scenario.unit === 'R$'
      ? ((scenario.values[index] / scenario.values[0]) - 1) * 100
      : scenario.values[index] - scenario.values[0];
    return (delta > 0 ? '+' : delta < 0 ? '−' : '') + number(Math.abs(delta)) +
      (scenario.unit === 'R$' ? '%' : ' p.p.') + ' desde janeiro';
  };
  // Pure model exports make the same production calculations testable in Node.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MONTHS, SCENARIOS, PROJECTS, number, point, chartPath, metricText, deltaText };
    return;
  }

  const root = document.documentElement;
  const byId = id => document.getElementById(id);
  const all = selector => Array.from(document.querySelectorAll(selector));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 1000px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionButton = byId('motion-toggle');
  let motionPreference = true;
  try { motionPreference = localStorage.getItem('fv-motion') !== 'off'; } catch { /* Storage may be disabled. */ }
  let motionEnabled = false;
  let revealObserver;
  let refreshField = () => {};
  const revealAll = () => all('.reveal-pending').forEach(el => {
    el.classList.remove('reveal-pending');
    el.classList.add('reveal-visible');
  });
  function applyMotion() {
    motionEnabled = motionPreference && !reduced.matches;
    root.dataset.motion = motionEnabled ? 'on' : 'off';
    const label = reduced.matches ? 'Movimento reduzido pelo seu dispositivo' : motionEnabled ? 'Pausar animações' : 'Ativar animações';
    motionButton.setAttribute('aria-label', label);
    motionButton.setAttribute('title', label);
    motionButton.setAttribute('aria-pressed', String(!motionEnabled));
    motionButton.disabled = reduced.matches;
    if (!motionEnabled) {
      revealAll();
      all('.dashboard').forEach(el => {
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
      });
      if (document.getAnimations) document.getAnimations().forEach(animation => animation.cancel());
    }
    refreshField();
  }
  motionButton.addEventListener('click', () => {
    motionPreference = !motionEnabled;
    try { localStorage.setItem('fv-motion', motionPreference ? 'on' : 'off'); } catch { /* No persistence required. */ }
    applyMotion();
  });
  reduced.addEventListener('change', applyMotion);

  // A non-modal mobile disclosure: Escape closes it; navigation works without JS.
  const menuButton = byId('menu-toggle');
  const menu = byId('menu');
  function setMenu(open, restoreFocus = false) {
    menuButton.setAttribute('aria-expanded', String(open));
    byId('menu-label').textContent = open ? 'Fechar' : 'Menu';
    menu.classList.toggle('is-open', open);
    menu.inert = narrow.matches && !open;
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  all('#menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('pointerdown', event => {
    if (menuButton.getAttribute('aria-expanded') === 'true' && !byId('site-header').contains(event.target)) setMenu(false);
  });
  narrow.addEventListener('change', () => setMenu(false));
  setMenu(false);

  let activeScenario = 'logistica';
  let selectedMonth = 6;
  const slider = byId('month-slider');
  const scenarioButtons = all('[data-scenario]');
  let announcementTimer;
  const makeSvg = name => document.createElementNS('http://www.w3.org/2000/svg', name);
  function setMetric(index, value, unit) {
    const el = byId('metric-value-' + index);
    el.replaceChildren();
    if (unit === 'R$') {
      const prefix = document.createElement('small');
      prefix.textContent = 'R$ ';
      el.append(prefix, document.createTextNode(number(value, 2)));
    } else {
      el.append(document.createTextNode(number(value, unit === '' ? 0 : 1)));
      if (unit) {
        const suffix = document.createElement('small');
        suffix.textContent = unit;
        el.append(suffix);
      }
    }
  }
  function updateChart(announce = false, animate = false) {
    const scenario = SCENARIOS[activeScenario];
    byId('chart-kicker').textContent = scenario.kicker;
    byId('chart-title').textContent = scenario.title;
    byId('period-badge').textContent = MONTHS[selectedMonth];
    byId('legend-measure').textContent = scenario.measure;
    byId('legend-target').textContent = 'Meta ' + metricText(scenario.target, scenario.unit);
    byId('metric-delta').textContent = deltaText(scenario, selectedMonth);
    const metrics = [scenario.values[selectedMonth], scenario.secondary[selectedMonth], scenario.tertiary[selectedMonth]];
    metrics.forEach((value, i) => {
      byId('metric-label-' + i).textContent = scenario.labels[i];
      setMetric(i, value, scenario.units[i]);
    });
    scenario.notes.forEach((note, i) => { byId('metric-note-' + (i + 1)).textContent = note; });
    const path = chartPath(scenario);
    byId('chart-line').setAttribute('d', path);
    byId('chart-area').setAttribute('d', path + ' L465 165 L35 165Z');
    const targetY = 165 - ((scenario.target - scenario.min) / (scenario.max - scenario.min)) * 135;
    byId('chart-target').setAttribute('d', 'M35 ' + targetY.toFixed(2) + 'H465');
    [scenario.max, (scenario.min + scenario.max) / 2, scenario.min].forEach((value, i) => {
      byId(['y-top', 'y-mid', 'y-low'][i]).textContent = number(value, 0) + (scenario.unit === '%' ? '%' : '');
    });
    const dots = byId('chart-points');
    dots.replaceChildren();
    scenario.values.forEach((_, i) => {
      const p = point(scenario, i);
      const dot = makeSvg('circle');
      dot.setAttribute('cx', p.x.toFixed(2));
      dot.setAttribute('cy', p.y.toFixed(2));
      dot.setAttribute('r', '3');
      dots.append(dot);
    });
    const selected = point(scenario, selectedMonth);
    ['chart-selected', 'chart-halo'].forEach(id => {
      byId(id).setAttribute('cx', selected.x.toFixed(2));
      byId(id).setAttribute('cy', selected.y.toFixed(2));
    });
    byId('chart-cursor').setAttribute('d', 'M' + selected.x.toFixed(2) + ' 30V165');
    byId('chart-accessible-title').textContent = scenario.measure + ', janeiro a julho';
    byId('chart-accessible-desc').textContent = 'Dados fictícios. ' + scenario.values.map((value, i) => MONTHS[i] + ': ' + metricText(value, scenario.unit)).join('; ') + '.';
    slider.setAttribute('aria-valuetext', MONTHS[selectedMonth]);
    const isGood = scenario.unit === 'R$' ? scenario.values[selectedMonth] <= scenario.target : scenario.values[selectedMonth] >= scenario.target;
    byId('chart-insight').textContent = isGood ? scenario.questionGood : scenario.questionBad;
    if (animate && motionEnabled && byId('chart-line').animate) {
      byId('chart-line').animate([{ strokeDasharray: '1', strokeDashoffset: '1' }, { strokeDasharray: '1', strokeDashoffset: '0' }], { duration: 750, easing: 'cubic-bezier(.22,1,.36,1)' });
      byId('metrics').animate([{ opacity: .35, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'ease-out' });
    }
    if (announce) {
      clearTimeout(announcementTimer);
      announcementTimer = setTimeout(() => {
        byId('chart-announcement').textContent = MONTHS[selectedMonth] + '. ' + metrics.map((value, i) => scenario.labels[i] + ': ' + metricText(value, scenario.units[i])).join('. ') + '. Dados fictícios.';
      }, 120);
    }
  }
  scenarioButtons.forEach(button => button.addEventListener('click', () => {
    if (activeScenario === button.dataset.scenario) return;
    activeScenario = button.dataset.scenario;
    scenarioButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    updateChart(true, true);
  }));
  slider.addEventListener('input', () => {
    selectedMonth = Math.max(0, Math.min(6, Number(slider.value)));
    updateChart(true);
  });

  const cards = all('.project-card');
  const filterButtons = all('[data-filter]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    cards.forEach(card => {
      const matches = filter === 'todos' || card.dataset.category === filter;
      card.hidden = !matches;
      if (matches) {
        visible++;
        card.classList.remove('reveal-pending');
        card.classList.add('reveal-visible');
        if (motionEnabled && card.animate) card.animate([{ opacity: .25, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'ease-out' });
      }
    });
    byId('filter-status').textContent = visible + (visible === 1 ? ' solução encontrada.' : ' soluções encontradas.');
  }));

  const dialog = byId('project-dialog');
  let dialogTrigger;
  let backdropPointer = false;
  function openProject(key, trigger) {
    const project = PROJECTS[key];
    if (!project || typeof dialog.showModal !== 'function') return;
    byId('dialog-category').textContent = project.category;
    byId('dialog-title').textContent = project.title;
    byId('dialog-summary').textContent = project.summary;
    byId('dialog-question').textContent = project.question;
    byId('dialog-method').textContent = project.method;
    const features = byId('dialog-features');
    features.replaceChildren();
    project.features.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      features.append(li);
    });
    const tags = byId('dialog-tags');
    tags.replaceChildren();
    project.tags.forEach(text => {
      const span = document.createElement('span');
      span.textContent = text;
      tags.append(span);
    });
    byId('dialog-contact').href = 'https://wa.me/5511973418206?text=' + encodeURIComponent('Olá, Felipe! Vi seu portfólio e gostaria de conversar sobre ' + project.title + '.');
    dialogTrigger = trigger;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
  }
  all('[data-project]').forEach(button => {
    if (typeof dialog.showModal !== 'function') {
      button.hidden = true;
      button.classList.remove('js-only');
      return;
    }
    button.addEventListener('click', () => openProject(button.dataset.project, button));
  });
  byId('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('pointerdown', event => { backdropPointer = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (!backdropPointer || event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (dialogTrigger && document.contains(dialogTrigger)) dialogTrigger.focus({ preventScroll: true });
  });

  // Scroll work is batched to one frame. The document remains a native scroller.
  const sectionLinks = all('#menu a');
  const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href')));
  let scrollFrame = 0;
  function refreshScroll() {
    scrollFrame = 0;
    const max = root.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
    byId('reading-progress').style.transform = 'scaleX(' + progress + ')';
    let current = -1;
    const boundary = byId('site-header').getBoundingClientRect().height + 80;
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= boundary) current = i;
    });
    sectionLinks.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(refreshScroll); }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });

  // Lightweight geometry, capped resolution and 30fps. No render loop offscreen.
  const canvas = byId('data-field');
  const ctx = canvas.getContext('2d');
  let fieldFrame = 0, width = 0, height = 0, lastFrame = 0, fieldVisible = true;
  const pointer = { x: -9999, y: -9999 };
  const particles = Array.from({ length: 28 }, (_, i) => ({
    x: ((i * 73 + 19) % 101) / 101,
    y: ((i * 47 + 11) % 97) / 97,
    phase: i * 1.37
  }));
  function resizeField() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    refreshField();
  }
  function drawField(time) {
    fieldFrame = 0;
    if (!ctx || !motionEnabled || !fieldVisible || document.hidden) return;
    fieldFrame = requestAnimationFrame(drawField);
    if (time - lastFrame < 33) return;
    lastFrame = time;
    ctx.clearRect(0, 0, width, height);
    const count = width < 760 ? 15 : 28;
    const points = particles.slice(0, count).map(p => ({
      x: p.x * width + Math.sin(time / 13000 + p.phase) * 23,
      y: p.y * height + Math.cos(time / 16000 + p.phase) * 20
    }));
    points.forEach((p, i) => {
      for (let j = i + 1; j < points.length; j++) {
        const distance = Math.hypot(p.x - points[j].x, p.y - points[j].y);
        if (distance < 160) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = 'rgba(130,180,255,' + ((1 - distance / 160) * .14) + ')';
          ctx.lineWidth = .65; ctx.stroke();
        }
      }
      const near = Math.hypot(p.x - pointer.x, p.y - pointer.y) < 180;
      ctx.beginPath(); ctx.arc(p.x, p.y, near ? 1.8 : 1, 0, Math.PI * 2);
      ctx.fillStyle = near ? 'rgba(170,210,255,.7)' : 'rgba(130,175,250,.35)'; ctx.fill();
    });
  }
  refreshField = () => {
    if (fieldFrame) cancelAnimationFrame(fieldFrame);
    fieldFrame = 0;
    if (ctx) ctx.clearRect(0, 0, width, height);
    if (ctx && motionEnabled && fieldVisible && !document.hidden) fieldFrame = requestAnimationFrame(drawField);
  };
  const hero = document.querySelector('.hero-stage');
  hero.addEventListener('pointermove', event => {
    if (!motionEnabled || !finePointer.matches) return;
    const rect = hero.getBoundingClientRect();
    pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.x = -9999; pointer.y = -9999; });
  if ('IntersectionObserver' in window) {
    const fieldObserver = new IntersectionObserver(entries => {
      fieldVisible = entries[0].isIntersecting;
      refreshField();
    });
    fieldObserver.observe(hero);
  }
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeField, 120);
  }, { passive: true });
  document.addEventListener('visibilitychange', refreshField);

  const dashboard = byId('dashboard');
  let tiltFrame = 0;
  dashboard.addEventListener('pointermove', event => {
    if (!motionEnabled || !finePointer.matches || tiltFrame) return;
    const x = event.clientX, y = event.clientY;
    tiltFrame = requestAnimationFrame(() => {
      tiltFrame = 0;
      if (!motionEnabled) return;
      const rect = dashboard.getBoundingClientRect();
      dashboard.style.setProperty('--ry', (((x - rect.left) / rect.width - .5) * 3).toFixed(2) + 'deg');
      dashboard.style.setProperty('--rx', (((y - rect.top) / rect.height - .5) * -3).toFixed(2) + 'deg');
    });
  }, { passive: true });
  dashboard.addEventListener('pointerleave', () => {
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    dashboard.style.removeProperty('--rx');
    dashboard.style.removeProperty('--ry');
  });

  root.classList.add('js');
  byId('year').textContent = String(new Date().getFullYear());
  applyMotion();
  updateChart();
  resizeField();
  refreshScroll();
  if ('IntersectionObserver' in window && motionEnabled) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .05, rootMargin: '0px 0px 50px 0px' });
    all('.section-heading, .about-grid, .principles article, .project-card, .process-grid li, .timeline article, .contact-copy, .contact-options').forEach((el, i) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.setProperty('--reveal-delay', (i % 3) * 45 + 'ms');
      el.classList.add('reveal-pending');
      revealObserver.observe(el);
    });
  }
})();

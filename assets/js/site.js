/* ==========================================================================
   site.js — Studio Cassa
   JavaScript vanilla, sem dependência, sem type="module" (quebraria em file://).
   O MESMO arquivo roda em todas as páginas: por isso todo bloco começa com um
   guard que sai fora se o elemento não existir naquela página.

   MOVIMENTO: tudo que anima (órbita, parede de projetos, anel, nuvem) mexe
   só em transform e opacity, para quando sai da tela, e fica parado com
   prefers-reduced-motion. Nenhum bloco segura a rolagem: a parede de
   projetos lê a rolagem normal do navegador, não a substitui.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     CONSTANTES — declaradas UMA vez, em um lugar só.
     O handle do Instagram ainda vai mudar; por isso ele não aparece escrito
     em nenhum HTML. Trocar aqui troca o site inteiro.
     ====================================================================== */
  var WHATSAPP  = '5532999144851';
  var INSTAGRAM = 'xpinformatica_';
  var EMAIL     = 'gabriel.cassa02@outlook.com';

  /* ----------------------------------------------------------------------
     whats(texto) — monta o link do WhatsApp com a mensagem já preenchida.
     Cada seção manda a sua mensagem, via data-zap="...".
     ---------------------------------------------------------------------- */
  function whats(texto) {
    var base = 'https://wa.me/' + WHATSAPP;
    return texto ? base + '?text=' + encodeURIComponent(texto) : base;
  }

  function insta() {
    return 'https://www.instagram.com/' + INSTAGRAM + '/';
  }

  /* Liga todo [data-zap] ao link certo. Elemento sem texto no data-zap
     recebe o WhatsApp sem mensagem. */
  function ligarZaps() {
    var alvos = document.querySelectorAll('[data-zap]');
    if (!alvos.length) return;
    Array.prototype.forEach.call(alvos, function (a) {
      a.setAttribute('href', whats(a.getAttribute('data-zap')));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  /* Idem para o Instagram e o e-mail. */
  function ligarContatos() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-insta]'), function (a) {
      a.setAttribute('href', insta());
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      if (a.hasAttribute('data-insta-handle')) a.textContent = '@' + INSTAGRAM;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-email]'), function (a) {
      a.setAttribute('href', 'mailto:' + EMAIL);
      if (a.hasAttribute('data-email-texto')) a.textContent = EMAIL;
    });
  }

  /* ----------------------------------------------------------------------
     jsonLdSameAs() — o sameAs do JSON-LD sai daqui, e não do HTML, porque o
     handle do Instagram ainda vai mudar e não pode estar escrito em página
     nenhuma. Um endereço só, na constante lá em cima.
     ---------------------------------------------------------------------- */
  function jsonLdSameAs() {
    var bloco = document.querySelector('script[type="application/ld+json"][data-jsonld]');
    if (!bloco) return;

    try {
      var dados = JSON.parse(bloco.textContent);
      dados.sameAs = [insta()];
      bloco.textContent = JSON.stringify(dados, null, 2);
    } catch (e) {
      /* JSON-LD malformado não pode derrubar o resto do site */
    }
  }

  /* prefers-reduced-motion, lido na hora (a pessoa pode trocar no sistema) */
  function parado() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ----------------------------------------------------------------------
     suave() — devolve o behavior de rolagem a usar. Com reduced-motion tem
     que ser 'auto': um behavior explícito VENCE o scroll-behavior do CSS,
     então passar 'smooth' fixo furaria a preferência do visitante.
     ---------------------------------------------------------------------- */
  function suave() {
    return parado() ? 'auto' : 'smooth';
  }

  /* quandoVisivel(el, fn) — chama fn(true/false) quando el entra ou sai da
     tela. É o que faz cada animação parar quando ninguém está vendo. */
  function quandoVisivel(el, fn) {
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { fn(e.isIntersecting); });
    }, { rootMargin: '120px 0px' }).observe(el);
  }

  /* ----------------------------------------------------------------------
     abertura() — a cortina do primeiro carregamento. A animação é CSS; aqui
     só se anota na sessão que ela já rodou (não repete a cada volta à home)
     e, quando termina, a cortina sai da pintura de vez.
     ---------------------------------------------------------------------- */
  function abertura() {
    var raiz = document.documentElement;
    if (!raiz.classList.contains('abrindo')) return;
    try { sessionStorage.setItem('cassa-abertura', '1'); } catch (e) { /* modo anônimo */ }
    setTimeout(function () { raiz.classList.add('aberto'); }, 1900);
  }

  /* ----------------------------------------------------------------------
     revelar() — IntersectionObserver, threshold .15, escalonado por
     data-atraso (ms) e unobserve depois. Sem IO, mostra tudo na hora.
     ---------------------------------------------------------------------- */
  function revelar() {
    var itens = document.querySelectorAll('.rv');
    if (!itens.length) return;

    if (parado() || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(itens, function (el) { el.classList.add('in'); });
      return;
    }

    Array.prototype.forEach.call(itens, function (el) {
      var atraso = el.getAttribute('data-atraso');
      if (atraso) el.style.setProperty('--atraso', atraso + 'ms');
    });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(itens, function (el) { obs.observe(el); });
  }

  /* ----------------------------------------------------------------------
     contadores() — anima de 0 até o alvo com requestAnimationFrame e
     easeOutExpo, formatando em pt-BR. Dispara UMA vez (unobserve na hora),
     então rolar de volta não reinicia. Com reduced-motion mostra o valor
     final direto, sem animar.
     ---------------------------------------------------------------------- */
  function contadores() {
    var alvos = document.querySelectorAll('[data-contador]');
    if (!alvos.length) return;

    var fmt = new Intl.NumberFormat('pt-BR');

    function escrever(el, valor) {
      el.textContent = (el.getAttribute('data-prefixo') || '') + fmt.format(valor);
    }

    if (parado() || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(alvos, function (el) {
        escrever(el, parseInt(el.getAttribute('data-n'), 10) || 0);
      });
      return;
    }

    function animar(el) {
      var fim = parseInt(el.getAttribute('data-n'), 10) || 0;
      var dur = 1400, t0 = null;

      function passo(agora) {
        if (t0 === null) t0 = agora;
        var t = Math.min((agora - t0) / dur, 1);
        var e = (t === 1) ? 1 : 1 - Math.pow(2, -10 * t);   /* easeOutExpo */
        escrever(el, Math.round(fim * e));
        if (t < 1) requestAnimationFrame(passo);
        else escrever(el, fim);                             /* trava no alvo */
      }
      requestAnimationFrame(passo);
    }

    /* zera só na hora de observar, para que sem JS o HTML já mostre o número */
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        animar(e.target);
      });
    }, { threshold: 0.4 });

    Array.prototype.forEach.call(alvos, function (el) {
      escrever(el, 0);
      obs.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     focaveisEm(raiz) — os elementos que de fato recebem foco dentro de raiz.
     Usado pelo modal e pelo menu.
     ---------------------------------------------------------------------- */
  function focaveisEm(raiz) {
    return Array.prototype.filter.call(
      raiz.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null; });
  }

  /* prendeTab(e, lista) — devolve o foco ao começo/fim ao sair da lista */
  function prendeTab(e, lista) {
    if (e.key !== 'Tab' || !lista.length) return;
    var primeiro = lista[0], ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault(); ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primeiro.focus();
    }
  }

  /* ----------------------------------------------------------------------
     A parede de projetos preenche isto; a órbita do hero usa para levar o
     clique num cartão até a loja dele. Sem parede (sem projeto, ou outra
     página), fica null e o clique só desce até #portfolio.
     ---------------------------------------------------------------------- */
  var irParaPeca = null;

  /* ----------------------------------------------------------------------
     orbitaMovimento() — os cartões do hero numa elipse em volta do nome.
     Profundidade de mentira, mas convincente: o cartão na parte de baixo da
     elipse está "na frente" (maior, por cima do nome); o de cima, "atrás"
     (menor, por baixo dele). A elipse gira uma volta a cada 80s, inclina um
     pouco com o mouse, e os cartões entram vindo do centro depois que a
     cortina abre. Parada com reduced-motion, fora da tela e quando a
     pessoa aperta "Pausar movimento".
     ---------------------------------------------------------------------- */
  function orbitaMovimento() {
    var caixa = document.querySelector('[data-orbita]');
    var hero  = caixa && caixa.closest('.hero');
    if (!caixa || !hero) return;

    var itens = Array.prototype.slice.call(caixa.querySelectorAll('.orbita__item'));
    if (!itens.length) return;

    var n = itens.length;
    var VOLTA = 80000;                 /* ms por volta inteira */
    var ENTRADA = 1400;                /* ms da entrada de cada cartão */
    var atraso = document.documentElement.classList.contains('abrindo') ? 950 : 150;

    /* inclinação fixa de cada cartão, entre -7° e +7°: o ar de jogado à mão */
    var inclina = itens.map(function (el, i) { return ((i * 37) % 15) - 7; });
    var tam = [];
    var g = { cx: 0, cy: 0, rx: 0, ry: 0 };
    var mouse = { x: 0, y: 0, ax: 0, ay: 0 };
    var t0 = null, antes = null, giro = 0;
    var visivel = true, rodando = false, quieto = parado();

    /* "Pausar movimento" (WCAG 2.2.2): a órbita gira sem parar, então quem
       quiser para. A escolha fica neste navegador — é conforto de quem
       visita, não estado do site. */
    var pausado = false;
    try { pausado = localStorage.getItem('cassa-movimento') === 'pausado'; } catch (e) { /* modo anônimo */ }

    var linha = hero.querySelector('.hero__linha');
    var canto = hero.querySelector('.hero__canto');
    var acoes = hero.querySelector('.hero__acoes');
    var navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 88;

    /* altura de el dentro do hero pelo offsetTop, que ignora transform: a
       entrada do hero ainda está deslocando os textos quando isto roda */
    function topoEm(el) {
      var y = 0;
      while (el && el !== hero) { y += el.offsetTop; el = el.offsetParent; }
      return y;
    }

    function cartoes(largura) {
      var maior = 0;
      itens.forEach(function (el, i) {
        el.style.setProperty('--w', Math.round(largura) + 'px');
        tam[i] = { w: el.offsetWidth, h: el.offsetHeight };
        maior = Math.max(maior, tam[i].h);
      });
      return maior;
    }

    function medir() {
      var w = hero.clientWidth, h = hero.clientHeight;
      var largo = w >= 760;
      var base = largo ? Math.min(Math.max(w * .085, 96), 156) : Math.max(w * .19, 64);
      var maior = cartoes(base);
      g.cx = w / 2;
      if (largo) {
        g.cy = h * .47;
        g.rx = Math.min(w * .43, 740);
        g.ry = Math.min(h * .31, 290);
        return;
      }
      /* No celular a elipse passa da tela dos lados (como na referência) e
         cabe entre a barra do topo e o texto do pé. O cartão da frente
         (1,12×) passa embaixo, no vão entre a frase e o pé: não cobre a
         frase, nem o botão de pausa, o selo ou "Ver os projetos" — um
         toque ali cairia no cartão. Vão curto demais encolhe os cartões. */
      var pe = Math.min(canto ? topoEm(canto) : h, acoes ? topoEm(acoes) : h) - 12;
      var frase = linha ? topoEm(linha) + linha.offsetHeight + 12 : 0;
      if (maior * 1.12 > pe - frase) maior = cartoes(base * Math.max(pe - frase, 40) / (maior * 1.12));
      var frente = maior * 1.12 / 2, fundo = maior * .6 / 2;
      g.rx = w * .6;
      g.ry = Math.max((pe - frente - navH - fundo) / 2, 40);
      g.cy = navH + fundo + g.ry;
    }

    function sai(t) { return 1 - Math.pow(1 - t, 3); }

    function quadro(agora) {
      if (t0 === null) t0 = agora;
      if (antes === null) antes = agora;
      var t = agora - t0;
      /* o giro anda pelo tempo que passou, e só sem pausa; o teto de 64ms
         evita o pulo quando a aba volta do segundo plano */
      if (!quieto && !pausado) giro += Math.min(agora - antes, 64) / VOLTA * Math.PI * 2;
      antes = agora;
      mouse.ax += (mouse.x - mouse.ax) * .06;
      mouse.ay += (mouse.y - mouse.ay) * .06;

      var entrando = false;
      itens.forEach(function (el, i) {
        var e = quieto ? 1 : sai(Math.min(Math.max((t - atraso - i * 70) / ENTRADA, 0), 1));
        if (e < 1) entrando = true;
        var th = giro + i * (Math.PI * 2 / n) + .35;
        var s = Math.sin(th);
        var frente = (s + 1) / 2;                         /* 0 = fundo, 1 = frente */
        var abre = .3 + .7 * e;                           /* sai do centro */
        var x = g.cx + Math.cos(th) * g.rx * abre + mouse.ax * (.3 + frente);
        var y = g.cy + s * g.ry * abre + mouse.ay * (.3 + frente);
        var esc = (.6 + .52 * frente) * (.4 + .6 * e);
        el.style.transform =
          'perspective(900px) translate3d(' + (x - tam[i].w / 2).toFixed(1) + 'px,' +
          (y - tam[i].h / 2).toFixed(1) + 'px,0) rotateY(' + (-Math.cos(th) * 16).toFixed(2) +
          'deg) rotate(' + inclina[i] + 'deg) scale(' + esc.toFixed(3) + ')';
        el.style.opacity = e.toFixed(3);
        el.style.zIndex = s > .12 ? 3 : 1;
      });

      /* roda enquanto gira, entra ou segue o mouse; parada, desliga */
      var mexendo = Math.abs(mouse.x - mouse.ax) + Math.abs(mouse.y - mouse.ay) > .05;
      if (visivel && !quieto && (!pausado || entrando || mexendo)) requestAnimationFrame(quadro);
      else { rodando = false; antes = null; }
    }

    function ligar() {
      if (rodando) return;
      rodando = true;
      requestAnimationFrame(quadro);
    }

    /* o botão aparece antes de medir(): a altura dele conta no pé do hero */
    var botao = document.querySelector('[data-movimento]');
    if (botao && !quieto) {
      botao.hidden = false;
      botao.classList.toggle('pausado', pausado);
      botao.addEventListener('click', function () {
        pausado = !pausado;
        /* o nome do botão troca junto ("Pausar" ↔ "Retomar"): a metade
           escondida pelo CSS sai também do que o leitor de tela anuncia */
        botao.classList.toggle('pausado', pausado);
        try { localStorage.setItem('cassa-movimento', pausado ? 'pausado' : 'livre'); } catch (e) { /* modo anônimo */ }
        ligar();
      });
    }

    medir();
    ligar();

    window.addEventListener('resize', function () { medir(); ligar(); });
    quandoVisivel(hero, function (sim) { visivel = sim; if (sim) ligar(); });

    /* o mouse inclina a elipse — só mouse: no toque não há "pairar". Com a
       pausa, nem isso: "pausar movimento" é a órbita inteira parada. */
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || quieto || pausado) return;
      var r = hero.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - .5) * 36;
      mouse.y = ((e.clientY - r.top) / r.height - .5) * 22;
      ligar();
    });
    hero.addEventListener('pointerleave', function () { mouse.x = 0; mouse.y = 0; ligar(); });

    /* clique num cartão: desce até a loja dele no portfólio */
    caixa.addEventListener('click', function (e) {
      var item = e.target.closest('.orbita__item');
      if (!item) return;
      var i = parseInt(item.getAttribute('data-indice'), 10) || 0;
      if (irParaPeca) irParaPeca(i);
      else {
        var alvo = document.getElementById('portfolio');
        if (alvo) alvo.scrollIntoView({ behavior: suave() });
      }
    });
  }

  /* ----------------------------------------------------------------------
     evidenciaRolagem() — a parede curva do portfólio.
     A seção é alta (100svh + 80svh por projeto) e o palco fica preso na
     tela (sticky, no CSS). Aqui só se lê quanto da seção já passou e se
     põe cada cartão num cilindro em volta de quem olha: a uma distância d
     do cartão da frente, ele gira d·24° e afunda. Os cartões seguem a
     rolagem com um pouco de inércia (o "mostrado" persegue o "alvo").

     Teclado: o cartão que recebe foco vem para a frente. Mouse: clicar num
     cartão do lado traz ele para a frente; só o da frente abre o caso.
     Com reduced-motion (ou um projeto só) a seção vira grade parada.
     ---------------------------------------------------------------------- */
  function evidenciaRolagem() {
    var secao = document.querySelector('[data-evidencia]');
    if (!secao || secao.hidden) return;

    var trilho = secao.querySelector('.evidencia__trilho');
    var pecas = Array.prototype.slice.call(secao.querySelectorAll('.peca'));
    var n = pecas.length;
    if (!trilho || !n) return;

    var alvo = 0, mostrado = 0, rodando = false;

    /* As capas chegam em data-src (ver evidencia() no render.js). Nada
       baixa enquanto a galeria está só encostada no pé do hero: "perto"
       liga quando ela entra 40px na tela — rolou, ou abriu já no meio. */
    var perto = false, estatica = parado() || n < 2;
    function poeCapa(img) {
      if (estatica) img.loading = 'lazy';     /* na grade parada, o lazy do navegador basta */
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }
    function carregarPerto(p) {
      if (!perto) return;
      pecas.forEach(function (el, i) {
        if (!estatica && Math.abs(i - p) > 2.5) return;   /* a da frente e duas de cada lado */
        var img = el.querySelector('img[data-src]');
        if (img) poeCapa(img);
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting || perto) return;
          perto = true;
          carregarPerto(mostrado);
        });
      }, { rootMargin: '0px 0px -40px 0px' }).observe(secao);
    } else {
      perto = true;
    }

    if (estatica) {
      secao.classList.add('evidencia--estatica');
      carregarPerto(0);
      irParaPeca = function (i) {
        pecas[i].scrollIntoView({ behavior: suave(), block: 'center' });
      };
      return;
    }

    var atual = secao.querySelector('[data-evidencia-atual]');
    var barra = secao.querySelector('[data-evidencia-barra]');
    var PASSO = .42;                       /* rad entre um cartão e o próximo (~24°) */
    var curso = 1, raio = 900;

    function medir() {
      curso = Math.max(secao.offsetHeight - window.innerHeight, 1);
      raio = Math.max(trilho.clientWidth * 1.25, 760);
    }

    function progresso() {
      var p = -secao.getBoundingClientRect().top / curso;
      return Math.min(Math.max(p, 0), 1) * (n - 1);
    }

    function dois(x) { return (x < 10 ? '0' : '') + x; }

    function desenhar(p) {
      pecas.forEach(function (el, i) {
        var d = i - p;
        var ang = d * PASSO;
        var dist = Math.abs(d);
        var x = Math.sin(ang) * raio;
        var z = (Math.cos(ang) - 1) * raio;
        var op = Math.max(0, Math.min(1, 2.4 - dist));
        el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,' + z.toFixed(1) +
                             'px) rotateY(' + (-ang * 57.2958).toFixed(2) + 'deg)';
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(100 - Math.round(dist * 10));
        el.style.setProperty('--leg', Math.max(0, 1 - dist * 2.2).toFixed(3));
      });
      carregarPerto(p);
      var cur = Math.min(n - 1, Math.max(0, Math.round(p)));
      if (atual) atual.textContent = dois(cur + 1);
      if (barra) barra.style.setProperty('--p', (p / (n - 1)).toFixed(4));
    }

    function quadro() {
      mostrado += (alvo - mostrado) * .14;
      if (Math.abs(alvo - mostrado) < .0008) mostrado = alvo;
      desenhar(mostrado);
      if (mostrado !== alvo) requestAnimationFrame(quadro);
      else rodando = false;
    }

    function aoRolar() {
      alvo = progresso();
      if (rodando) return;
      rodando = true;
      requestAnimationFrame(quadro);
    }

    medir();
    alvo = mostrado = progresso();
    desenhar(mostrado);

    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', function () { medir(); aoRolar(); });
    window.addEventListener('load', function () { medir(); aoRolar(); });

    irParaPeca = function (i, ja) {
      medir();
      var topo = window.scrollY + secao.getBoundingClientRect().top;
      window.scrollTo({ top: topo + (i / (n - 1)) * curso, behavior: ja ? 'auto' : suave() });
    };

    /* foco pelo teclado: a peça focada passa a ser a da frente */
    trilho.addEventListener('focusin', function (e) {
      var peca = e.target.closest('.peca');
      if (!peca) return;
      var i = pecas.indexOf(peca);
      if (Math.round(alvo) !== i) irParaPeca(i, true);
    });

    /* clique numa peça do lado: vem para a frente em vez de abrir o caso.
       Captura, para chegar antes do listener do modal no document. */
    trilho.addEventListener('click', function (e) {
      var peca = e.target.closest('.peca');
      if (!peca) return;
      var i = pecas.indexOf(peca);
      if (Math.abs(i - mostrado) > .35) {
        e.preventDefault();
        e.stopPropagation();
        irParaPeca(i);
      }
    }, true);
  }

  /* ----------------------------------------------------------------------
     anel() — o desenho do "Como funciona": um anel em fio (um toro), com
     uma estação para cada passo de PROCESSO, que gira até a estação do
     passo lido e para. O passo que está
     no meio da tela — ou sob o mouse, ou com foco — acende a estação dele.
     Canvas puro; decoração (aria-hidden), os passos de verdade são a <ol>.
     ---------------------------------------------------------------------- */
  function anel() {
    var canvas = document.querySelector('[data-anel]');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var passos = Array.prototype.slice.call(document.querySelectorAll('[data-passo]'));
    var n = passos.length || 7;
    var estilo = getComputedStyle(document.documentElement);
    var cor = {
      fio:   estilo.getPropertyValue('--escuro-mid').trim() || '#A8A8A0',
      linha: estilo.getPropertyValue('--escuro-ac').trim()  || '#8DB2FF',
      ponto: estilo.getPropertyValue('--escuro-tx').trim()  || '#F3F3F1'
    };
    var TILT = 1.08;                     /* inclinação do anel para quem olha */
    var ativo = 0;
    var brilho = [];
    for (var b = 0; b < n; b++) brilho.push(b === 0 ? 1 : 0);

    /* o giro que põe a estação i na frente (embaixo da elipse, o ponto
       mais perto de quem olha) */
    function frente(i) { return Math.PI - i / n * Math.PI * 2; }
    var giro = frente(0), alvoGiro = giro;

    var W = 0, H = 0, dpr = 1, visivel = false, rodando = false;
    var quieto = parado();

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* gira em torno do eixo do anel (giro) e inclina para o observador (TILT) */
    function projeta(x, y, z) {
      var cg = Math.cos(giro), sg = Math.sin(giro);
      var x1 = x * cg - y * sg, y1 = x * sg + y * cg;
      var ct = Math.cos(TILT), st = Math.sin(TILT);
      return { x: x1, y: y1 * ct - z * st, z: y1 * st + z * ct };
    }

    function desenhar() {
      ctx.clearRect(0, 0, W, H);
      var R = Math.min(W, H) * .33, r = R * .3;
      var cx = W / 2, cy = H / 2;
      var K = 44, M = 26, k, m;

      /* os aros do tubo — mais claros no fundo, mais nítidos na frente */
      ctx.lineWidth = 1;
      for (k = 0; k < K; k++) {
        var fi = k / K * Math.PI * 2;
        var ux = Math.cos(fi), uy = Math.sin(fi);
        ctx.beginPath();
        var prof = 0;
        for (m = 0; m <= M; m++) {
          var s = m / M * Math.PI * 2;
          var p = projeta((R + r * Math.cos(s)) * ux, (R + r * Math.cos(s)) * uy, r * Math.sin(s));
          if (m === 0) ctx.moveTo(cx + p.x, cy + p.y); else ctx.lineTo(cx + p.x, cy + p.y);
          prof += p.z;
        }
        ctx.globalAlpha = .16 + .34 * ((prof / (M + 1)) / R + 1) / 2;
        ctx.strokeStyle = cor.fio;
        ctx.stroke();
      }

      /* a linha do caminho, no meio do tubo */
      ctx.beginPath();
      for (m = 0; m <= 96; m++) {
        var a = m / 96 * Math.PI * 2;
        var q = projeta(R * Math.cos(a), R * Math.sin(a), 0);
        if (m === 0) ctx.moveTo(cx + q.x, cy + q.y); else ctx.lineTo(cx + q.x, cy + q.y);
      }
      ctx.globalAlpha = .9;
      ctx.strokeStyle = cor.linha;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      /* as estações: uma por passo, a ativa maior e na cor de destaque */
      for (k = 0; k < n; k++) {
        brilho[k] += ((k === ativo ? 1 : 0) - brilho[k]) * (quieto ? 1 : .12);
        var ang = k / n * Math.PI * 2 - Math.PI / 2;
        var e = projeta(R * Math.cos(ang), R * Math.sin(ang), 0);
        var raioPonto = 3.5 + brilho[k] * 6;
        ctx.globalAlpha = .55 + .45 * Math.max(brilho[k], (e.z / R + 1) / 2);
        ctx.fillStyle = brilho[k] > .5 ? cor.linha : cor.ponto;
        ctx.beginPath();
        ctx.arc(cx + e.x, cy + e.y, raioPonto, 0, Math.PI * 2);
        ctx.fill();
        if (brilho[k] > .05) {
          ctx.globalAlpha = brilho[k] * .35;
          ctx.strokeStyle = cor.linha;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx + e.x, cy + e.y, raioPonto + 8 * brilho[k], 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    /* O anel não gira sozinho: ele gira até a estação do passo que está
       sendo lido e para (nada se mexe sozinho por mais de 5s). */
    function quadro() {
      giro += (alvoGiro - giro) * .08;
      var falta = Math.abs(alvoGiro - giro);
      if (falta < .0008) giro = alvoGiro;
      desenhar();
      var acendendo = brilho.some(function (v, k) { return Math.abs((k === ativo ? 1 : 0) - v) > .01; });
      if (visivel && (giro !== alvoGiro || acendendo)) requestAnimationFrame(quadro);
      else rodando = false;
    }

    function ligar() {
      if (quieto || !visivel) { giro = alvoGiro; desenhar(); return; }
      if (rodando) return;
      rodando = true;
      requestAnimationFrame(quadro);
    }

    function acender(i) {
      if (i === ativo || i < 0) return;
      ativo = i;
      passos.forEach(function (li, j) { li.classList.toggle('ativo', j === i); });
      /* pelo caminho mais curto até a estação nova */
      var alvo = frente(i);
      while (alvo - giro > Math.PI) alvo -= Math.PI * 2;
      while (giro - alvo > Math.PI) alvo += Math.PI * 2;
      alvoGiro = alvo;
      ligar();
    }

    medir();
    desenhar();
    if (passos[0]) passos[0].classList.add('ativo');

    window.addEventListener('resize', function () { medir(); desenhar(); });
    quandoVisivel(canvas, function (sim) { visivel = sim; if (sim) ligar(); });

    /* o passo que cruza o meio da tela acende a estação dele */
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) acender(passos.indexOf(e.target));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      passos.forEach(function (li) { obs.observe(li); });
    }
    passos.forEach(function (li, i) {
      li.addEventListener('pointerenter', function () { acender(i); });
    });
  }

  /* ----------------------------------------------------------------------
     nuvem() — a palavra "nuvemshop" desenhada por uma nuvem de pontos.
     A palavra é escrita num canvas escondido, na fonte dos títulos; cada
     pixel aceso vira o destino de um ponto. Quando a seção entra na tela,
     os pontos saem espalhados e se juntam; depois ficam quietos, e só
     fogem do cursor (ou do dedo) num raio de ~80px.
     Com reduced-motion: a palavra já formada, parada.
     ---------------------------------------------------------------------- */
  function nuvem() {
    var canvas = document.querySelector('[data-nuvem]');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var PALAVRA = 'nuvemshop';
    var cor = getComputedStyle(document.documentElement).getPropertyValue('--escuro-tx').trim() || '#F3F3F1';
    var fonte = getComputedStyle(document.documentElement).getPropertyValue('--fonte-titulo').trim() || 'sans-serif';
    var pontos = [];
    var W = 0, H = 0, dpr = 1, lado = 2;
    var mouse = { x: -9999, y: -9999 };
    var visivel = false, rodando = false, formou = false;
    var quieto = parado();

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* os destinos: pixels acesos da palavra escrita fora da tela */
    function alvos() {
      if (!W || !H) return [];             /* canvas sem tamanho (escondido) */
      var off = document.createElement('canvas');
      off.width = W; off.height = H;
      var o = off.getContext('2d');
      var tam = H * .86;
      o.font = '500 ' + tam + 'px ' + fonte;
      var larg = o.measureText(PALAVRA).width;
      if (larg > W * .94) { tam = tam * (W * .94) / larg; o.font = '500 ' + tam + 'px ' + fonte; }
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      o.fillStyle = '#000';
      o.fillText(PALAVRA, W / 2, H / 2);

      var px = o.getImageData(0, 0, W, H).data;
      var passo = Math.max(3, Math.round(W / 280));
      lado = Math.max(1.4, passo * .42);
      var lista = [];
      for (var y = 0; y < H; y += passo) {
        for (var x = 0; x < W; x += passo) {
          if (px[(y * W + x) * 4 + 3] > 140) lista.push(x, y);
        }
      }
      return lista;
    }

    function montar() {
      medir();
      var a = alvos();
      var novos = [];
      for (var i = 0; i < a.length; i += 2) {
        var velho = pontos[novos.length];
        novos.push({
          tx: a[i], ty: a[i + 1],
          x: velho ? velho.x : Math.random() * W,
          y: velho ? velho.y : (Math.random() < .5 ? -20 : H + 20) + (Math.random() - .5) * H,
          vx: 0, vy: 0,
          alfa: .45 + Math.random() * .55
        });
      }
      pontos = novos;
      if (quieto) {
        pontos.forEach(function (p) { p.x = p.tx; p.y = p.ty; });
        pintar();
      }
    }

    function pintar() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = cor;
      for (var i = 0; i < pontos.length; i++) {
        var p = pontos[i];
        ctx.globalAlpha = p.alfa;
        ctx.fillRect(p.x, p.y, lado, lado);
      }
      ctx.globalAlpha = 1;
    }

    /* Cada ponto é puxado para o seu destino e empurrado pelo cursor. Quando
       todos assentam, o laço desliga: a nuvem forma a palavra e fica
       quieta — só volta a se mexer com o mouse ou o dedo. */
    function quadro() {
      var energia = 0;
      for (var i = 0; i < pontos.length; i++) {
        var p = pontos[i];
        var fx = (p.tx - p.x) * .018;
        var fy = (p.ty - p.y) * .018;
        var mx = p.x - mouse.x, my = p.y - mouse.y;
        var d2 = mx * mx + my * my;
        if (d2 < 6400) {
          var f = (6400 - d2) / 6400 * 2.4;
          var d = Math.sqrt(d2) || 1;
          fx += mx / d * f;
          fy += my / d * f;
        }
        p.vx = (p.vx + fx) * .86;
        p.vy = (p.vy + fy) * .86;
        p.x += p.vx;
        p.y += p.vy;
        /* conta a força que sobra, não só a velocidade: a velocidade passa
           por zero na volta de cada vaivém, e o laço desligaria com os
           pontos ainda fora do lugar */
        energia += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(fx) + Math.abs(fy);
      }
      pintar();
      if (visivel && energia > pontos.length * .01) requestAnimationFrame(quadro);
      else rodando = false;
    }

    function ligar() {
      if (quieto || rodando || !visivel) return;
      rodando = true;
      requestAnimationFrame(quadro);
    }

    function comecar() {
      montar();
      quandoVisivel(canvas, function (sim) {
        visivel = sim;
        if (sim) { formou = true; ligar(); }
      });
    }

    /* a palavra é escrita na fonte dos títulos: espera ela carregar, senão
       os pontos desenhariam a fonte reserva e pulariam depois */
    if (document.fonts && document.fonts.load) {
      document.fonts.load('500 100px ' + fonte, PALAVRA).then(comecar, comecar);
    } else {
      comecar();
    }

    var espera = null;
    window.addEventListener('resize', function () {
      clearTimeout(espera);
      espera = setTimeout(function () { if (formou || quieto) { montar(); ligar(); } }, 200);
    });

    canvas.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      ligar();
    });
    canvas.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; ligar(); });
  }

  /* ----------------------------------------------------------------------
     modalProjeto() — abre por id, fecha no ESC / backdrop / X, prende o foco
     e devolve o foco ao card de origem. O conteúdo vem do render.js.
     ---------------------------------------------------------------------- */
  function modalProjeto() {
    var modal = document.getElementById('modal-projeto');
    if (!modal || !window.SCRender) return;

    var corpo  = modal.querySelector('.modal__corpo');
    var fechar = modal.querySelector('[data-modal-fechar]');
    var origem = null;

    function abrir(id, botao) {
      var p = window.SCRender.projetoPorId(id);
      if (!p || !window.SCRender.projetoVisivel(p)) return;

      origem = botao || null;
      corpo.innerHTML = window.SCRender.htmlModal(p);
      ligarZaps();
      modal.hidden = false;
      document.body.classList.add('travado');
      (focaveisEm(modal)[0] || fechar).focus();
    }

    function fecharModal() {
      if (modal.hidden) return;
      modal.hidden = true;
      corpo.innerHTML = '';
      document.body.classList.remove('travado');
      if (origem) { origem.focus({ preventScroll: true }); origem = null; }
    }

    /* delegação: vale para a parede da home e para a grade do portfolio.html */
    document.addEventListener('click', function (e) {
      var botao = e.target.closest('[data-projeto]');
      if (botao) { abrir(botao.getAttribute('data-projeto'), botao); return; }
      if (e.target.closest('[data-modal-fechar]')) fecharModal();
    });

    /* o backdrop é o próprio .modal; o painel fica dentro dele */
    modal.addEventListener('mousedown', function (e) {
      if (e.target === modal) fecharModal();
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { fecharModal(); return; }
      prendeTab(e, focaveisEm(modal));
    });
  }

  /* ----------------------------------------------------------------------
     abas() — troca de painel dos serviços. Setas (as quatro: as palavras
     ficam em coluna), Home/End, aria-selected e roving tabindex.
     ---------------------------------------------------------------------- */
  function abas() {
    var caixa = document.querySelector('[data-servicos]');
    if (!caixa) return;

    var botoes = Array.prototype.slice.call(caixa.querySelectorAll('.aba'));
    var paineis = Array.prototype.slice.call(caixa.querySelectorAll('.abas__painel'));
    if (!botoes.length) return;

    function selecionar(i, focar) {
      botoes.forEach(function (b, j) {
        b.setAttribute('aria-selected', String(j === i));
        b.tabIndex = (j === i) ? 0 : -1;
      });
      paineis.forEach(function (p, j) { p.hidden = (j !== i); });
      if (focar) botoes[i].focus();
    }

    botoes.forEach(function (b, i) {
      b.addEventListener('click', function () { selecionar(i, false); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % botoes.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + botoes.length) % botoes.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = botoes.length - 1;
        if (n === null) return;
        e.preventDefault();
        selecionar(n, true);
      });
    });
  }

  /* ----------------------------------------------------------------------
     filtros() — os filtros por tipo da grade de portfolio.html.
     ---------------------------------------------------------------------- */
  function filtros() {
    var tira = document.querySelector('[data-filtros]');
    if (!tira) return;

    var grade = document.querySelector('.grade-projetos');
    if (!grade) return;

    tira.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filtro]');
      if (!b) return;
      var alvo = b.getAttribute('data-filtro');

      Array.prototype.forEach.call(tira.querySelectorAll('[data-filtro]'), function (x) {
        x.setAttribute('aria-pressed', String(x === b));
      });
      Array.prototype.forEach.call(grade.children, function (item) {
        item.hidden = (alvo !== 'Todos' && item.getAttribute('data-tipo') !== alvo);
      });
    });
  }

  /* ----------------------------------------------------------------------
     navScroll() — a barra some ao rolar para baixo e volta ao rolar para
     cima (nos primeiros 120px ela fica sempre). Na home, o link da seção
     que está na tela ganha aria-current="location".
     ---------------------------------------------------------------------- */
  function navScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ultimo = window.scrollY;
    function checar() {
      var y = window.scrollY;
      nav.classList.toggle('rolou', y > 40);
      if (y > 120 && y > ultimo + 4) nav.classList.add('nav--escondida');
      else if (y < ultimo - 4 || y <= 120) nav.classList.remove('nav--escondida');
      ultimo = y;
    }
    checar();
    window.addEventListener('scroll', checar, { passive: true });

    if (!('IntersectionObserver' in window)) return;
    var links = Array.prototype.filter.call(nav.querySelectorAll('.nav__link'), function (a) {
      return a.getAttribute('href').charAt(0) === '#';
    });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var id = '#' + e.target.id;
        links.forEach(function (a) {
          if (a.getAttribute('href') !== id) return;
          if (e.isIntersecting) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    links.forEach(function (a) {
      var alvo = document.querySelector(a.getAttribute('href'));
      if (alvo) obs.observe(alvo);
    });
  }

  /* ----------------------------------------------------------------------
     menuMobile() — hambúrguer → tela cheia. Trava o scroll do body, fecha
     no ESC e ao clicar num link, e devolve o foco ao botão.
     ---------------------------------------------------------------------- */
  function menuMobile() {
    var botao = document.querySelector('.hamburguer');
    var menu  = document.getElementById('menu');
    if (!botao || !menu) return;

    /* O resto da página fica inerte enquanto o menu está aberto. Sem isto,
       o Tab sai do overlay e vai parar num link do corpo da página — que,
       com o body travado em overflow:hidden, está fora da tela e não dá
       para alcançar. A nav fica de fora porque o hambúrguer vive nela e
       precisa continuar focável para fechar o menu. */
    function outros() {
      return Array.prototype.filter.call(document.body.children, function (el) {
        return el !== menu && !el.contains(botao);
      });
    }

    /* o ciclo de foco é o hambúrguer mais o que estiver dentro do menu */
    function ciclo() { return [botao].concat(focaveisEm(menu)); }

    function abrir() {
      menu.classList.add('aberto');
      menu.removeAttribute('inert');
      outros().forEach(function (el) { el.setAttribute('inert', ''); });
      botao.setAttribute('aria-expanded', 'true');
      document.body.classList.add('travado');
      var primeiro = focaveisEm(menu)[0];
      if (primeiro) primeiro.focus();
    }

    function fechar(devolverFoco) {
      menu.classList.remove('aberto');
      menu.setAttribute('inert', '');
      outros().forEach(function (el) { el.removeAttribute('inert'); });
      botao.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('travado');
      if (devolverFoco) botao.focus();
    }

    menu.setAttribute('inert', '');

    botao.addEventListener('click', function () {
      if (botao.getAttribute('aria-expanded') === 'true') fechar(true);
      else abrir();
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) fechar(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('aberto')) return;
      if (e.key === 'Escape') { fechar(true); return; }
      prendeTab(e, ciclo());
    });

    /* se a janela passar dos 960px com o menu aberto, ele some por CSS —
       o body não pode ficar travado nem o resto inerte */
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (e) {
      if (e.matches && menu.classList.contains('aberto')) fechar(false);
    });
  }

  /* ----------------------------------------------------------------------
     flutuantes() — WhatsApp e voltar-ao-topo aparecem depois de 400px e
     saem de novo quando o rodapé entra na tela: lá o WhatsApp já está em
     pílula, e os botões cobririam a última linha do rodapé.
     ---------------------------------------------------------------------- */
  function flutuantes() {
    var caixa = document.querySelector('.flutuantes');
    if (!caixa) return;

    var botoes = caixa.querySelectorAll('.flutuante');
    var rodapeNaTela = false;
    var rodape = document.querySelector('.rodape');
    if (rodape) quandoVisivel(rodape, function (sim) { rodapeNaTela = sim; checar(); });

    function checar() {
      var mostra = window.scrollY > 400 && !rodapeNaTela;
      Array.prototype.forEach.call(botoes, function (b) {
        b.classList.toggle('mostra', mostra);
        /* escondido de verdade: não entra na ordem de tabulação */
        if (b.tagName === 'A' || b.tagName === 'BUTTON') b.tabIndex = mostra ? 0 : -1;
      });
    }

    checar();
    window.addEventListener('scroll', checar, { passive: true });
  }

  /* ----------------------------------------------------------------------
     voltarAoTopo()
     ---------------------------------------------------------------------- */
  function voltarAoTopo() {
    var botao = document.querySelector('[data-topo]');
    if (!botao) return;

    botao.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: suave() });
      var pular = document.querySelector('.pular');
      if (pular) pular.focus({ preventScroll: true });
    });
  }

  /* ----------------------------------------------------------------------
     ano() — © do rodapé.
     ---------------------------------------------------------------------- */
  function ano() {
    var alvos = document.querySelectorAll('[data-ano]');
    if (!alvos.length) return;
    var agora = String(new Date().getFullYear());
    Array.prototype.forEach.call(alvos, function (el) { el.textContent = agora; });
  }

  /* ----------------------------------------------------------------------
     O que o render.js precisa daqui. É a única superfície compartilhada
     entre os dois arquivos — de propósito. (O <head> da home também olha
     se window.SC existe: é como ele sabe que este arquivo carregou.)
     ---------------------------------------------------------------------- */
  window.SC = {
    WHATSAPP:  WHATSAPP,
    INSTAGRAM: INSTAGRAM,
    EMAIL:     EMAIL,
    whats:     whats,
    ligarZaps: ligarZaps
  };

  /* ----------------------------------------------------------------------
     Arranque. DOM já está pronto: os scripts ficam no fim do <body>.
     A ordem está escrita só aqui — o render.js define, não dispara.
     ---------------------------------------------------------------------- */

  /* 1. conteúdo que vem do dados.js — tem que existir antes do resto */
  if (window.SCRender) window.SCRender.montarTudo();

  /* 2. ligações e comportamentos — tudo que é addEventListener está aqui */
  abertura();
  ligarZaps();
  ligarContatos();
  jsonLdSameAs();
  navScroll();
  menuMobile();
  modalProjeto();
  abas();
  filtros();
  flutuantes();
  voltarAoTopo();
  ano();

  /* 3. i18n antes das animações: em pt não mexe no DOM, mas em outro idioma
        precisa trocar o texto antes de qualquer coisa entrar na tela */
  if (typeof iniciarI18n === 'function') iniciarI18n();

  /* 4. movimento e observadores por último: só agora existem os nós
        gerados acima. A parede vem antes da órbita, que usa irParaPeca. */
  evidenciaRolagem();
  orbitaMovimento();
  anel();
  nuvem();
  revelar();
  contadores();
})();

/* ==========================================================================
   captura-previa.js — Studio Cassa

   Fotografa uma loja como ela está AGORA, página por página, no celular e no
   computador, e guarda o cru em _previas/<id>/<data>/. É o que congela o
   projeto: depois disso, a prévia do site não depende mais da loja existir.

   O cru não é publicado (_previas/ está no .gitignore). Quem transforma o cru
   nas partes que o site mostra é o prepara-imagens.ps1.

   COMO USAR
     node captura-previa.js <id>                     recaptura as páginas que
                                                     o `previa` do dados.js já
                                                     tem; sem previa, só a home
     node captura-previa.js <id> "Nome=/caminho/" …  estas páginas. O nome é o
                                                     que aparece na aba da prévia

     --so=celular  ou  --so=computador               um aparelho só
     --sem-arquivo                                   sem o .mhtml (ver abaixo)
     --url=https://…                                 outro endereço-base, para
                                                     loja que está em
                                                     LOJAS_FEITAS ou mudou
     --limpeza=_previas/<id>/limpeza.js              para loja que o cliente
                                                     mudou depois da entrega: o
                                                     arquivo exporta uma função
                                                     async (page, { aparelho, url })
                                                     que acerta a página no
                                                     navegador da captura, antes
                                                     da foto. A loja de verdade
                                                     não muda. Sai em
                                                     _previas/<id>/<data>-limpa/,
                                                     e a captura real fica intacta

   O QUE SAI, para cada página e aparelho
     <pagina>-<aparelho>.png    a página inteira, 2x (celular 780 de largura,
                                computador 2880); menos em página muito alta
     <pagina>-<aparelho>.mhtml  cópia de consulta da página: texto, links e
                                imagens, que abre no Edge/Chrome com a loja fora
                                do ar. Não é fiel: vem sem as fontes e sem parte
                                do que o código da loja ajusta (na Colado, o
                                Comprar sai verde, e não preto). A referência
                                é o PNG
     previa.json                as páginas desta captura; o prepara-imagens lê

   ANTES DE FOTOGRAFAR, o script:
     - desce a página inteira, para o carregamento preguiçoso acordar;
     - força as imagens dos carrosséis, que fora da tela nunca acordam;
     - troca o vídeo do YouTube pela capa dele, que na foto sairia vazio;
     - volta os carrosséis ao primeiro slide e para o giro;
     - some com o que flutua: cookies, WhatsApp, pop-up, widgets. Numa foto da
       página inteira, isso ficaria boiando no meio da loja.

   Só lê: não clica em comprar, não preenche nada, não entra em conta.

   Precisa do Playwright (vem com o @playwright/cli global) e do Edge ou do
   Chrome instalado. Não instala nada, e nenhuma página do site usa este arquivo.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

function carregaPlaywright() {
  try { return require('playwright'); } catch (e) { /* segue para o global */ }
  const raiz = execSync('npm root -g').toString().trim();
  return require(path.join(raiz, '@playwright', 'cli', 'node_modules', 'playwright'));
}

async function abreNavegador(chromium) {
  for (const channel of ['msedge', 'chrome']) {
    try { return await chromium.launch({ channel, headless: true }); }
    catch (e) { /* tenta o próximo */ }
  }
  return chromium.launch({ headless: true });
}

/* lê o dados.js como o navegador leria: ele não é módulo, só declara const */
function leDados() {
  const codigo = fs.readFileSync(path.join(__dirname, 'assets', 'js', 'dados.js'), 'utf8');
  const caixa = {};
  vm.createContext(caixa);
  vm.runInContext(codigo + '\n;this.PROJETOS = PROJETOS; this.LOJAS_FEITAS = LOJAS_FEITAS;', caixa);
  return caixa.PROJETOS.concat(caixa.LOJAS_FEITAS);
}

function semAcento(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function hoje() {
  const d = new Date();
  const dois = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + dois(d.getMonth() + 1) + '-' + dois(d.getDate());
}

/* Roda DENTRO da página. Devolve o que achou para o relatório. */
async function preparaPagina(page) {
  /* loja com rolagem suave ainda estaria andando na hora da foto, e a emenda das
     telas abriria uma faixa branca (a Vilaz, por exemplo) */
  await page.addStyleTag({ content: 'html,body{scroll-behavior:auto!important;overflow-anchor:none!important}' +
                                    '.elementor-invisible{visibility:visible!important}' });

  /* Algo mais largo que a tela alarga a página toda no celular: a da Atuale saía com
     872 de largura, e não 390, e cheia de vazios. Só nesse caso: em página cujo body
     é quem rola (o Wix), esta regra tira a rolagem e a foto fica só com uma tela. */
  const larga = await page.evaluate(() => window.innerWidth > document.documentElement.clientWidth + 1);
  if (larga) await page.addStyleTag({ content: 'html{overflow-x:hidden!important}' });

  /* Site em WordPress costuma esperar o primeiro gesto da pessoa para carregar os
     efeitos, e sem gesto as seções ficam em branco (a Toledo). O mouse se mexe e a
     roda gira um pouco; nada é clicado. */
  await page.mouse.move(120, 160);
  await page.mouse.move(180, 220);
  await page.mouse.wheel(0, 40);
  /* e o cursor sai da tela: parado em cima da página, ele abria o menu da Romance e
     deixava acesa a linha que estivesse embaixo dele */
  await page.mouse.move(-20, -20);
  await page.waitForTimeout(1500);

  /* desce devagar: quem acorda a imagem é ela chegar perto da tela. O teto
     existe por causa de vitrine com rolagem infinita, que nunca acabaria. */
  await page.evaluate(async () => {
    const espera = ms => new Promise(r => setTimeout(r, ms));
    const TETO = 60000;
    let y = 0;
    while (y < Math.min(document.documentElement.scrollHeight, TETO)) {
      window.scrollTo(0, y);
      y += Math.round(window.innerHeight * 0.7);
      await espera(220);
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await espera(900);
    window.scrollTo(0, 0);
    await espera(500);
  });

  await page.evaluate(() => {
    /* carrossel: slide de fora da tela nunca chega perto o bastante para
       carregar sozinho, e sairia como um quadrado cinza na foto */
    document.querySelectorAll('img').forEach(img => {
      const conjunto = img.getAttribute('data-srcset');
      const unica = img.getAttribute('data-src');
      if (conjunto) img.setAttribute('srcset', conjunto);
      if (unica) img.setAttribute('src', unica);
      img.loading = 'eager';
      /* com "lazyloaded", e não só sem "lazyload": no tema Amazonas, foto sem essa
         marca fica invisível (.fade-in), e a Vilaz saiu com a grade cheia de buracos */
      if (conjunto || unica) {
        img.classList.remove('lazyload', 'lazyloading');
        img.classList.add('lazyloaded');
      }
    });

    /* vídeo do YouTube sai como um quadro vazio na foto: entra a capa dele */
    document.querySelectorAll('iframe').forEach(f => {
      const fonte = f.getAttribute('src') || f.getAttribute('data-src') || '';
      const achou = fonte.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/);
      if (!achou || !f.offsetWidth || !f.offsetHeight) return;
      const s = getComputedStyle(f);
      const capa = document.createElement('img');
      capa.style.cssText = 'display:block;object-fit:cover;width:' + f.offsetWidth + 'px;height:' + f.offsetHeight + 'px';
      /* no mesmo lugar: o tema costuma centrar o vídeo à força num quadro que o corta,
         e sem o transform a capa ia parar no canto (Quero Melancia, Café Serra Gerais) */
      ['position', 'top', 'left', 'right', 'bottom', 'transform', 'margin', 'z-index'].forEach(p => {
        capa.style.setProperty(p, s.getPropertyValue(p));
      });
      /* nem todo vídeo tem a capa grande; a menor sempre existe */
      capa.onerror = () => { capa.onerror = null; capa.src = 'https://img.youtube.com/vi/' + achou[1] + '/hqdefault.jpg'; };
      capa.src = 'https://img.youtube.com/vi/' + achou[1] + '/maxresdefault.jpg';
      f.replaceWith(capa);
    });

    document.querySelectorAll('.swiper, .swiper-container').forEach(s => {
      const inst = s.swiper;
      if (!inst) return;
      try {
        if (inst.autoplay) inst.autoplay.stop();
        if (inst.params && inst.params.loop) inst.slideToLoop(0, 0);
        else inst.slideTo(0, 0);
      } catch (e) { /* carrossel sem instância útil: fica como está */ }
    });

    /* vídeo da própria loja: fica no quadro em que está, para a emenda não pegar dois */
    document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) { /* segue */ } });
  });

  await apagaFlutuantes(page);
  return esperaImagens(page);
}

/* Tudo que flutua sai, menos um cabeçalho colado no topo. Roda de novo logo antes da
   foto: tem pop-up que só aparece depois de alguns segundos (o da VITAL), e entra
   também em componente fechado (shadow DOM), onde mora muito pop-up de e-mail. */
function apagaFlutuantes(page) {
  return page.evaluate(() => {
    const larg = window.innerWidth, alt = window.innerHeight;
    const visita = raiz => raiz.querySelectorAll('*').forEach(el => {
      if (getComputedStyle(el).position === 'fixed') {
        const r = el.getBoundingClientRect();
        const cabecalho = r.top <= 1 && r.width >= larg * 0.9 && r.height > 0 && r.height < alt * 0.35;
        if (!cabecalho) el.style.setProperty('display', 'none', 'important');
      }
      if (el.shadowRoot) visita(el.shadowRoot);
    });
    visita(document.body);
    /* <dialog> aberto fica numa camada própria, acima de tudo */
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    /* pop-up costuma travar a rolagem do body; a foto sairia cortada */
    [document.documentElement, document.body].forEach(el => {
      if (getComputedStyle(el).overflowY === 'hidden') el.style.setProperty('overflow', 'visible', 'important');
    });
  });
}

/* O esqueleto de carregamento do tema (.placeholder-fade, na Nuvemshop) pulsa em
   branco por cima dos botões, e o clique nem percebe. Na foto, o botão saía
   apagado ou desbotado, conforme o instante. Vai numa regra de CSS, e não em cada
   elemento, porque o tema cria outro quando um preço muda. */
async function apagaEsqueletos(page) {
  await page.addStyleTag({ content: '.placeholder-fade{display:none!important}' });
  await page.evaluate(() => {
    document.getAnimations().forEach(a => {
      const alvo = a.effect && a.effect.target;
      const tempo = a.effect && a.effect.getComputedTiming();
      if (!alvo || !tempo || tempo.iterations !== Infinity) return;
      if (/placeholder|skeleton/i.test(String(alvo.className))) alvo.style.setProperty('display', 'none', 'important');
    });
  });
}

/* espera as imagens chegarem; quem não chegar em 25 s vai no aviso */
function esperaImagens(page) {
  return page.evaluate(async () => {
    const imgs = Array.prototype.slice.call(document.images);
    await Promise.race([
      Promise.all(imgs.map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; }))),
      new Promise(r => setTimeout(r, 25000))
    ]);
    return {
      altura: document.documentElement.scrollHeight,
      imagens: imgs.length,
      /* só a que aparece: imagem vazia de carrinho escondido e slide fora da tela não contam */
      falhas: imgs.filter(i => {
        if (!i.currentSrc || !i.complete || i.naturalWidth) return false;
        const r = i.getBoundingClientRect();
        return r.width > 0 && r.right > 0 && r.left < window.innerWidth;
      }).length,
      pendentes: imgs.filter(i => !i.complete).length
    };
  });
}

/* A página inteira, tela por tela: rola, fotografa o que está à vista e emenda.
   A foto "além da tela" do navegador (o fullPage do Playwright, a captureBeyondViewport)
   não serve aqui: sem janela, ele só pinta parte do que está longe da tela. A Colado
   saía com botões desbotados e a Vilaz com a grade cheia de buracos, e os estilos
   calculados diziam que estava tudo certo.
   A densidade é 2, menos em página muito alta: a imagem final não pode passar de
   ~16 mil px de altura. As densidades da lista dão um número inteiro de pixels por
   tela, para a emenda não aparecer. */
async function fotoInteira(page, cdp, destino) {
  const { larg, alt, total } = await page.evaluate(() => ({
    larg: window.innerWidth, alt: window.innerHeight, total: document.documentElement.scrollHeight
  }));
  const densidade = [2, 1.5, 1, 0.75, 0.5].find(d => total * d <= 16000) || 0.5;

  /* O que ainda está andando termina agora: foto entrando em fade saía pela metade,
     com uma faixa na emenda (a história do Engenho, no Empório). E o que não tem fim,
     como a faixa de texto que corre, para onde está. */
  const assenta = async () => {
    await page.evaluate(() => {
      document.getAnimations().forEach(a => {
        const tempo = a.effect && a.effect.getComputedTiming();
        if (!tempo) return;
        try { if (tempo.iterations === Infinity) a.pause(); else a.finish(); } catch (e) { /* segue */ }
      });
    });
    await page.waitForTimeout(100);
  };
  const fotoDaTela = async y => (await cdp.send('Page.captureScreenshot', {
    format: 'png',
    /* a densidade vai no recorte: sem ele, a foto sai em 1x, seja qual for o aparelho */
    clip: { x: 0, y, width: larg, height: alt, scale: densidade }
  })).data;

  /* Os relógios da página param: o carrossel automático que não é Swiper (o da VITAL)
     trocava de slide bem na hora da foto, e os dois saíam sobrepostos. Vale também
     para pop-up com hora marcada. */
  await page.evaluate(() => {
    const ultimo = window.setTimeout(() => {}, 0);
    for (let i = 1; i <= ultimo; i++) { window.clearTimeout(i); window.clearInterval(i); }
  });

  /* a primeira tela, com o cabeçalho, e a marca de onde ela termina */
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(450);
  await apagaFlutuantes(page);
  await assenta();
  await page.evaluate(() => {
    const meio = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 2);
    window.__emenda = { el: meio, y: meio ? meio.getBoundingClientRect().top + window.scrollY : 0 };
  });
  const telas = [{ y: 0, data: await fotoDaTela(0) }];

  /* O cabeçalho fixo fica só na primeira tela; repetido, ele sairia a cada emenda.
     Roda de novo a cada tela porque muito tema só torna o cabeçalho fixo depois que
     a página rola (Elementor, Shopify): foi o que repetiu o da Atuale e o da FAOL. */
  const soltaFixos = () => page.evaluate(() => {
    /* entra também em componente fechado (shadow DOM): é onde mora muito pop-up de
       captura de e-mail, que aparece com hora marcada, como o da VITAL */
    const visita = raiz => raiz.querySelectorAll('*').forEach(el => {
      const p = getComputedStyle(el).position;
      if (p === 'fixed') {
        /* sem transição: no tema Ipanema o cabeçalho sumia devagar, e a foto pegava
           o fantasma dele no meio do caminho */
        el.style.setProperty('transition', 'none', 'important');
        el.style.setProperty('animation', 'none', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
      } else if (p === 'sticky') {
        /* sem o recuo: ele só vale grudado. Solto, empurrava a coluna do produto para
           cima da seção seguinte (Empório, Bella Caza) */
        el.style.setProperty('position', 'relative', 'important');
        el.style.setProperty('top', 'auto', 'important');
        el.style.setProperty('bottom', 'auto', 'important');
      }
      if (el.shadowRoot) visita(el.shadowRoot);
    });
    visita(document.body);
    /* <dialog> aberto fica numa camada própria, acima de tudo */
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    /* pop-up costuma travar a rolagem do body */
    [document.documentElement, document.body].forEach(el => {
      if (getComputedStyle(el).overflowY === 'hidden') el.style.setProperty('overflow', 'visible', 'important');
    });
  });
  await soltaFixos();
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(600);
  await soltaFixos();

  /* Muita loja esconde a barra de aviso do topo assim que a página rola, e tudo sobe
     junto: na Vilaz, 30px, que viravam degrau e faixa branca nas emendas. A marca da
     primeira tela diz quanto subiu, e daí em diante toda tela desce esse tanto. */
  const subiu = await page.evaluate(() => {
    const m = window.__emenda;
    const d = m.el ? Math.round(m.y - (m.el.getBoundingClientRect().top + window.scrollY)) : 0;
    /* mais que isso não é a barra de aviso: é a marca que caiu em algo que se mexe */
    return Math.abs(d) > 200 ? 0 : d;
  });
  let y = alt - subiu;
  let fim = await page.evaluate(() => document.documentElement.scrollHeight);
  while (y < fim) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await page.waitForTimeout(450);
    await soltaFixos();
    await assenta();
    const real = await page.evaluate(() => window.scrollY);
    telas.push({ y: real + subiu, data: await fotoDaTela(real) });
    y += alt;
    fim = await page.evaluate(() => document.documentElement.scrollHeight);
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  /* a emenda é feita num canvas, numa página em branco à parte */
  const ultima = telas[telas.length - 1];
  const mesa = await page.context().browser().newPage();
  try {
    await mesa.evaluate(([w, h]) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      window.__mesa = c;
    }, [Math.round(larg * densidade), Math.round((ultima.y + alt) * densidade)]);
    for (const t of telas) {
      await mesa.evaluate(async ([data, yPx]) => {
        const i = new Image();
        i.src = 'data:image/png;base64,' + data;
        await i.decode();
        window.__mesa.getContext('2d').drawImage(i, 0, yPx);
      }, [t.data, Math.round(t.y * densidade)]);
    }
    const pronta = await mesa.evaluate(() => window.__mesa.toDataURL('image/png').split(',')[1]);
    fs.writeFileSync(destino, Buffer.from(pronta, 'base64'));
  } finally {
    await mesa.close();
  }
}

async function fotografa(contexto, url, base, comArquivo, limpeza, aparelho) {
  const page = await contexto.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForLoadState('load', { timeout: 45000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

    /* Página que declara largura fixa (o Wix: width=320) é desenhada nessa largura e
       ampliada até encher a tela. A foto desfazia a ampliação, e a The Hound saía
       cortada. A janela vira essa largura: dá o mesmo desenho, sem precisar ampliar. */
    const fixa = await page.evaluate(() => (window.visualViewport.scale > 1.01
      ? { width: window.innerWidth, height: Math.round(window.visualViewport.height) } : null));
    if (fixa) {
      await page.setViewportSize(fixa);
      await page.waitForTimeout(800);
    }

    let info = await preparaPagina(page);
    if (limpeza) {
      await limpeza(page, { aparelho, url });
      info = await esperaImagens(page);
    }
    await apagaEsqueletos(page);
    await page.waitForTimeout(1200);

    const cdp = await contexto.newCDPSession(page);
    /* o arquivo vem antes da foto, que esconde o cabeçalho fixo a partir da segunda tela */
    if (comArquivo) {
      const { data } = await cdp.send('Page.captureSnapshot', { format: 'mhtml' });
      fs.writeFileSync(base + '.mhtml', data);
    }
    await fotoInteira(page, cdp, base + '.png');
    return Object.assign(info, { status: resp ? resp.status() : 0, final: page.url() });
  } finally {
    await page.close();
  }
}

(async () => {
  const args = process.argv.slice(2);
  const opcoes = args.filter(a => a.startsWith('--'));
  const livres = args.filter(a => !a.startsWith('--'));
  const id = livres[0];
  if (!id) {
    console.error('Uso: node captura-previa.js <id> ["Nome=/caminho/" ...] [--so=celular] [--sem-arquivo] [--url=https://...]');
    process.exit(1);
  }

  const projeto = leDados().filter(p => p.id === id)[0];
  const opUrl = opcoes.filter(o => o.startsWith('--url='))[0];
  const baseUrl = opUrl ? opUrl.slice(6) : (projeto && projeto.url);
  if (!baseUrl) {
    console.error('Sem endereço para "' + id + '": ele não está no dados.js. Passe --url=https://...');
    process.exit(1);
  }

  /* quais páginas: as dos argumentos > as que o projeto já tem > só a home */
  let paginas = livres.slice(1).map(a => {
    const i = a.indexOf('=');
    if (i < 1) { console.error('Página sem o formato "Nome=/caminho/": ' + a); process.exit(1); }
    return { nome: a.slice(0, i), arquivo: semAcento(a.slice(0, i)), url: a.slice(i + 1) };
  });
  if (!paginas.length && projeto && projeto.previa && projeto.previa.paginas) {
    paginas = projeto.previa.paginas.map(p => ({ nome: p.nome, arquivo: p.arquivo, url: p.url }));
  }
  if (!paginas.length) paginas = [{ nome: 'Início', arquivo: 'inicio', url: '/' }];

  /* O Git Bash reescreve "Nome=/caminho/" para o caminho da pasta dele, e a
     captura sairia de uma página do disco sem ninguém perceber. No PowerShell
     isso não acontece; no Git Bash, rode com MSYS_NO_PATHCONV=1 na frente. */
  paginas.forEach(p => {
    if (!/^https?:$/.test(new URL(p.url, baseUrl).protocol)) {
      console.error('Caminho estranho em "' + p.nome + '": ' + p.url + '\nNo Git Bash, rode com MSYS_NO_PATHCONV=1 na frente.');
      process.exit(1);
    }
  });

  const { chromium, devices } = carregaPlaywright();

  /* 390 de largura e 2x: as mesmas medidas das capturas feitas à mão no Chrome.
     O descritor do iPhone traz userAgent, toque e isMobile; a loja responde
     como responderia a um celular de verdade. */
  const todos = {
    celular: Object.assign({}, devices['iPhone 12 Pro'], { deviceScaleFactor: 2 }),
    computador: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }
  };
  const opSo = opcoes.filter(o => o.startsWith('--so='))[0];
  const aparelhos = opSo ? [opSo.slice(5)] : Object.keys(todos);
  const comArquivo = opcoes.indexOf('--sem-arquivo') === -1;

  const opLimpeza = opcoes.filter(o => o.startsWith('--limpeza='))[0];
  const limpeza = opLimpeza ? require(path.resolve(opLimpeza.slice(10))) : null;

  /* a versão limpa mora ao lado da real, e a real nunca é sobrescrita por ela */
  const data = hoje();
  const pasta = path.join(__dirname, '_previas', id, data + (limpeza ? '-limpa' : ''));
  fs.mkdirSync(pasta, { recursive: true });

  const browser = await abreNavegador(chromium);
  let problemas = 0;
  try {
    for (const aparelho of aparelhos) {
      if (!todos[aparelho]) { console.error('Aparelho desconhecido: ' + aparelho); process.exit(1); }
      const contexto = await browser.newContext(Object.assign({}, todos[aparelho], { locale: 'pt-BR' }));
      for (const p of paginas) {
        const url = new URL(p.url, baseUrl).href;
        const base = path.join(pasta, p.arquivo + '-' + aparelho);
        try {
          const r = await fotografa(contexto, url, base, comArquivo, limpeza, aparelho);
          const mb = (fs.statSync(base + '.png').size / 1048576).toFixed(1);
          const avisos = [];
          if (r.status !== 200) avisos.push('status ' + r.status);
          if (new URL(r.final).pathname !== new URL(url).pathname) avisos.push('foi parar em ' + r.final);
          if (r.falhas) avisos.push(r.falhas + ' imagem(ns) quebrada(s)');
          if (r.pendentes) avisos.push(r.pendentes + ' imagem(ns) sem carregar');
          if (avisos.length) problemas++;
          console.log('  ' + (p.arquivo + '-' + aparelho).padEnd(38) + String(r.altura).padStart(6) + ' px  ' +
                      mb.padStart(5) + ' MB' + (avisos.length ? '   << ' + avisos.join('; ') : ''));
        } catch (e) {
          problemas++;
          console.log('  ' + (p.arquivo + '-' + aparelho).padEnd(38) + ' FALHOU: ' + e.message.split('\n')[0]);
        }
      }
      await contexto.close();
    }
  } finally {
    await browser.close();
  }

  /* junta com o que já foi capturado hoje: uma segunda rodada só acrescenta */
  const arquivoJson = path.join(pasta, 'previa.json');
  const anterior = fs.existsSync(arquivoJson) ? JSON.parse(fs.readFileSync(arquivoJson, 'utf8')).paginas : [];
  const novas = anterior.filter(a => !paginas.some(p => p.arquivo === a.arquivo)).concat(paginas);
  fs.writeFileSync(arquivoJson, JSON.stringify({ id, data, base: baseUrl, limpa: !!limpeza, paginas: novas }, null, 2));

  console.log('\nCru em ' + path.relative(__dirname, pasta) + (problemas ? '  (' + problemas + ' com aviso: olhe as fotos)' : ''));
})().catch(e => { console.error(e); process.exit(1); });

/* ==========================================================================
   render.js — Studio Cassa

   O QUE MORA AQUI: só a MONTAGEM de HTML a partir dos arrays do dados.js —
   selo, faixa de logos, serviços, processo, órbita do hero, portfólio em
   parede curva, outras plataformas, citações, depoimentos, posts, grade do
   portfólio e página de caso. Mais o htmlModal(p), que devolve o miolo do
   modal como texto.

   O QUE NÃO MORA AQUI: nenhum addEventListener. Todo comportamento — giro
   da órbita, rolagem do portfólio, abrir/fechar do modal, troca de aba,
   filtro da grade, nav, menu, contadores, canvas — está no site.js, como
   manda a §6.

   Este arquivo só DEFINE. Quem manda montar é o site.js, no arranque, para
   que a ordem seja uma só e esteja escrita num lugar só.

   Depende de window.SC (definido no site.js): SC.WHATSAPP e SC.ligarZaps.
   Carrega por <script> normal, sem type="module", para não quebrar em file://.
   ========================================================================== */
window.SCRender = (function () {
  'use strict';

  /* Constantes e utilidades que vivem no site.js. Preenchido em montarTudo(),
     e não aqui: este arquivo carrega ANTES do site.js, então window.SC ainda
     não existe no momento em que esta linha roda. */
  var SC = {};

  /* ----------------------------------------------------------------------
     caminho(src) — prefixo de profundidade para todo asset que este arquivo
     injeta.

     Os caminhos do dados.js são relativos à RAIZ ("assets/img/..."). Uma
     página dentro de blog/ resolveria isso como "/blog/assets/img/..." e
     daria 404. Cada página declara a própria profundidade em
     <html data-base="../">, e todo src injetado passa por aqui.

     Não mexe em data:, http(s):, // nem em caminho que já começa com / —
     esses já são absolutos e não dependem de onde a página está.
     ---------------------------------------------------------------------- */
  function base() {
    return document.documentElement.getAttribute('data-base') || '';
  }

  function caminho(src) {
    var s = String(src || '');
    if (!s) return s;
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(s)) return s;
    return base() + s;
  }

  /* ----------------------------------------------------------------------
     selo() — os pontos do site que exibem o selo leem o objeto SELO do
     dados.js. Nenhum deles escreve o texto no HTML. Para trocar o que o selo
     diz, mexe-se no dados.js e em nada mais.
     ---------------------------------------------------------------------- */
  function selo() {
    var pontos = document.querySelectorAll('[data-selo]');
    if (!pontos.length) return;

    var s = (typeof SELO !== 'undefined') ? SELO : null;

    Array.prototype.forEach.call(pontos, function (el) {
      if (!s || !s.ativo || !s.texto) { el.remove(); return; }

      /* O conteúdo do selo é montado aqui, inteiro. O HTML só marca o LUGAR
         com [data-selo] e não escreve nem o texto, nem a estrela, nem a
         imagem — senão ligar o selo exigiria editar oito arquivos. */
      var miolo = s.imagem
        ? '<img data-selo-img src="' + esc(caminho(s.imagem)) + '" alt="" height="18">'
        : estrelaSelo();
      miolo += '<span data-selo-texto>' + esc(s.texto) + '</span>';

      var alvo = el;

      /* Com link, o ponto do selo PRECISA virar <a>: <p> não é clicável.
         Trocamos o nó no lugar, preservando classe e atributos de marcação. */
      if (s.link && el.tagName !== 'A') {
        alvo = document.createElement('a');
        alvo.className = el.className;
        alvo.setAttribute('data-selo', '');
        el.parentNode.replaceChild(alvo, el);
      }
      /* E sem link, um <a> vira <p> de volta — o selo pode deixar de ser
         clicável sem que ninguém precise mexer no HTML. */
      if (!s.link && el.tagName === 'A') {
        alvo = document.createElement('p');
        alvo.className = el.className;
        alvo.setAttribute('data-selo', '');
        el.parentNode.replaceChild(alvo, el);
      }

      if (s.link) {
        alvo.setAttribute('href', s.link);
        alvo.setAttribute('target', '_blank');
        alvo.setAttribute('rel', 'noopener');
      }

      alvo.innerHTML = miolo;
      alvo.hidden = false;
    });
  }

  /* a estrela só aparece quando NÃO há imagem de selo */
  function estrelaSelo() {
    return '<svg class="badge__estrela" width="13" height="13" viewBox="0 0 12 12"' +
           ' aria-hidden="true" focusable="false"><path fill="currentColor"' +
           ' d="M6 0l1.1 3.6L10.8 3 8.4 6l2.4 3-3.7-.6L6 12l-1.1-3.6L1.2 9l2.4-3-2.4-3 3.7.6z"/>' +
           '</svg>';
  }


  /* ----------------------------------------------------------------------
     servicos() — abas + cards, montados a partir de SERVICOS do dados.js.
     As abas saem dos valores de `aba` que de fato existem, na ordem em que
     aparecem — não há lista de abas escrita na mão em lugar nenhum. Na tela
     elas são as palavras grandes da seção; para o leitor de tela continuam
     sendo abas: role=tablist, setas, Home/End, aria-selected, roving
     tabindex.
     ---------------------------------------------------------------------- */
  function servicos() {
    var caixa = document.querySelector('[data-servicos]');
    if (!caixa) return;

    var lista = (typeof SERVICOS !== 'undefined') ? SERVICOS : [];
    if (!lista.length) {                       /* sem serviço, sem seção */
      var secao = caixa.closest('.secao');
      if (secao) secao.remove();
      return;
    }

    var abas = [];
    lista.forEach(function (s) {
      if (s.aba && abas.indexOf(s.aba) === -1) abas.push(s.aba);
    });

    var tira    = caixa.querySelector('.abas__tira');
    var paineis = caixa.querySelector('.abas__paineis');

    tira.innerHTML = abas.map(function (a, i) {
      return '<button class="aba" type="button" role="tab" id="aba-' + i + '"' +
             ' aria-controls="painel-' + i + '" aria-selected="' + (i === 0) + '"' +
             ' tabindex="' + (i === 0 ? 0 : -1) + '">' + esc(a) + '</button>';
    }).join('');

    paineis.innerHTML = abas.map(function (a, i) {
      var daAba = lista.filter(function (s) { return s.aba === a; });
      /* o painel acompanha quantos serviços a aba tem: dois lado a lado,
         um sozinho ocupa a coluna */
      var colunas = Math.min(daAba.length, 2);

      var cards = daAba.map(function (s) {
        var itens = (s.itens || []).map(function (it) {
          return '<li>' + esc(it) + '</li>';
        }).join('');

        var msg = 'Olá, Gabriel! Vim pelo site e quero falar sobre ' + s.nome + '.';

        /* `destaque` é um rótulo sobre o MEU posicionamento ("Meu carro-chefe"),
           não sobre demanda de mercado. Quem escreve o texto é o dados.js.
           Vem logo DEPOIS do nome: rótulo em cima de título é o vício que a
           identidade nova tirou. */
        var dest = s.destaque
          ? '<p class="servico__destaque">' + esc(s.destaque) + '</p>' : '';

        return '<article class="servico' + (s.destaque ? ' servico--destaque' : '') + '">' +
                 '<h3>' + esc(s.nome) + '</h3>' +
                 dest +
                 '<p class="servico__dor">&ldquo;' + esc(s.dor) + '&rdquo;</p>' +
                 '<ul class="lista-check">' + itens + '</ul>' +
                 '<p class="servico__orcamento" data-i18n="serv.orcamento">' +
                   'Sob orçamento · resposta no mesmo dia</p>' +
                 '<a class="btn btn--tinta" data-zap="' + esc(msg) + '"' +
                 ' href="https://wa.me/' + SC.WHATSAPP + '">' + esc(s.cta) + '</a>' +
               '</article>';
      }).join('');

      return '<div class="abas__painel cards--' + colunas + '" role="tabpanel"' +
             ' id="painel-' + i + '" aria-labelledby="aba-' + i + '"' +
             (i === 0 ? '' : ' hidden') + '>' + cards + '</div>';
    }).join('');

    /* os CTAs recém-criados ainda não passaram por SC.ligarZaps().
       Quem liga o teclado e a troca de aba é o site.js. */
    SC.ligarZaps();
  }

  /* ----------------------------------------------------------------------
     processo() — os passos saem de PROCESSO do dados.js, numa <ol> de
     verdade. O número que aparece na tela é o contador do CSS, e não o
     campo `n` do dados.js (o "zero-um"): a ordem já é a da lista. data-passo é o
     índice que o anel do site.js acende.
     ---------------------------------------------------------------------- */
  function processo() {
    var ol = document.querySelector('[data-processo]');
    if (!ol) return;

    var passos = (typeof PROCESSO !== 'undefined') ? PROCESSO : [];
    if (!passos.length) {
      var secao = ol.closest('.secao');
      if (secao) secao.remove();
      return;
    }

    ol.innerHTML = passos.map(function (p, i) {
      return '<li class="passo rv" data-passo="' + i + '" data-atraso="' + Math.min(i, 3) * 60 + '">' +
               '<h3>' + esc(p.titulo) + '</h3>' +
               '<p>' + esc(p.texto) + '</p>' +
             '</li>';
    }).join('');
  }


  /* ======================================================================
     PROJETOS — as duas travas do dados.js, num lugar só.

     Trava 1: nada é impresso sem status concluído + url + capa + logo.
              "citacao" é a exceção: precisa só de url, porque não tem card.
     Trava 2: `bloqueio` com qualquer texto esconde o projeto mesmo completo.
              É a loja pronta cujo domínio ainda aponta para a plataforma
              antiga — publicar o card mandaria o visitante para a loja que
              eu substituí.

     Toda seção de projeto passa por aqui. Não existe segunda regra.
     ====================================================================== */
  function todosProjetos() {
    return (typeof PROJETOS !== 'undefined') ? PROJETOS : [];
  }

  function temPrevia(p) {
    return !!(p.previa && p.previa.paginas && p.previa.paginas.length);
  }

  /* `semLink`: a loja saiu do ar ou mudou demais depois da entrega. Nenhum botão
     leva até ela, e o que fica é a prévia. */
  function temLink(p) {
    return !!p.url && !p.semLink;
  }

  function projetoVisivel(p) {
    if (p.bloqueio) return false;
    if (p.status !== 'concluido') return false;
    /* loja que saiu do ar continua no site se a prévia foi salva */
    if (!p.url && !temPrevia(p)) return false;
    /* "outras" e "citacao" não têm foto: precisam só do endereço */
    if (p.exibicao === 'citacao' || p.exibicao === 'outras') return true;
    return !!(p.capa && p.logo);
  }

  function projetosPor(exibicao) {
    return todosProjetos().filter(projetoVisivel).filter(function (p) {
      return p.exibicao === exibicao;
    });
  }

  /* projetos que ganham card: destaque (home + portfólio) e grade (portfólio) */
  function projetosComCard() {
    return todosProjetos().filter(projetoVisivel).filter(function (p) {
      return p.exibicao === 'destaque' || p.exibicao === 'grade';
    });
  }

  /* "Nuvemshop · Ipanema" — o dado conferido que sustenta o posicionamento */
  function pastilha(p) {
    return [p.plataforma, p.tema].filter(Boolean).join(' · ');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Card em retrato (2:3) da grade do portfolio.html: a foto ocupa o card
     inteiro, colorida, com o logo do cliente em branco embaixo.
     `semLegenda` tira nome e pastilha de baixo do card; hoje ninguém usa,
     mas fica para um card que dispense legenda. */
  function cardProjeto(p, semLegenda) {
    var pas = pastilha(p);
    return '<article class="projeto">' +
             '<button class="projeto__abrir" type="button" data-projeto="' + esc(p.id) + '"' +
             ' aria-label="Ver o projeto ' + esc(p.nome) + '">' +
               '<img class="projeto__capa" src="' + esc(caminho(p.capa)) + '"' +
               ' alt="" width="800" height="1200" loading="lazy" decoding="async">' +
               '<span class="projeto__marca">' +
                 '<img src="' + esc(caminho(p.logo)) + '" alt="" width="160" height="60"' +
                 ' loading="lazy" decoding="async">' +
               '</span>' +
             '</button>' +
             (semLegenda ? '' :
             '<div class="projeto__pe">' +
               '<h3>' + esc(p.nome) + '</h3>' +
               (pas ? '<p class="pastilha">' + esc(pas) + '</p>' : '') +
               (p.tipo ? '<p class="projeto__tipo">' + esc(p.tipo) + '</p>' : '') +
             '</div>') +
           '</article>';
  }

  /* ----------------------------------------------------------------------
     logosConfianca() — a faixa "Marcas que já confiaram". Projeto sem logo
     não entra, e se não sobrar nenhum a faixa inteira some. Nada de logo
     placeholder. Serve às duas faixas da página (hero e prova social).
     Os logos saem na cor da marca: com `logoCor` no dados.js, o arquivo
     colorido; sem ele, o `logo` (que é branco) vira silhueta preta no CSS
     — que é a cor das marcas pretas e o jeito de mostrar um logo branco
     no papel.
     ---------------------------------------------------------------------- */
  function logosConfianca() {
    var faixas = document.querySelectorAll('[data-logos]');
    if (!faixas.length) return;

    var vistos = {};
    var comLogo = todosProjetos().filter(projetoVisivel).filter(function (p) {
      if (!p.logo) return false;
      if (vistos[p.logo]) return false;
      vistos[p.logo] = true;
      return true;
    });

    Array.prototype.forEach.call(faixas, function (faixa) {
      if (!comLogo.length) { faixa.remove(); return; }

      var limite = parseInt(faixa.getAttribute('data-logos-max'), 10) || comLogo.length;
      faixa.querySelector('.confianca__logos').innerHTML =
        comLogo.slice(0, limite).map(function (p) {
          var cor = p.logoCor ? ' class="logo--cor"' : '';
          return '<img src="' + esc(caminho(p.logoCor || p.logo)) + '"' + cor + ' alt="' + esc(p.nome) +
                 '" width="160" height="60" loading="lazy" decoding="async">';
        }).join('');
      faixa.hidden = false;
    });
  }

  /* a seta ↗ dos links de loja e dos cartões — um desenho só */
  function seta(classe, tam) {
    return '<svg class="' + classe + '" width="' + tam + '" height="' + tam + '" viewBox="0 0 16 16"' +
           ' aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor"' +
           ' stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"' +
           ' d="M4 12L12 4M5 4h7v7"/></svg>';
  }

  /* ----------------------------------------------------------------------
     orbita() — os cartões que giram em volta do nome, no hero: um por loja
     "destaque" visível, todos no mesmo padrão — fundo preto e logo branco.
     Pedido dele em 25/10/2026; antes a órbita alternava foto e logo. As
     fotos das lojas ficam para a galeria, logo abaixo.
     data-indice é a posição da loja no portfólio — o site.js rola até ela
     no clique. Sem loja nenhuma, a órbita sai e o nome fica sozinho.
     ---------------------------------------------------------------------- */
  function orbita() {
    var caixa = document.querySelector('[data-orbita]');
    if (!caixa) return;

    var lojas = projetosPor('destaque');
    if (!lojas.length) { caixa.remove(); return; }

    caixa.innerHTML = lojas.map(function (p, i) {
      return '<div class="orbita__item orbita__item--logo" data-indice="' + i + '">' +
               '<img src="' + esc(caminho(p.logo)) + '" alt="" width="160" height="60" decoding="async">' +
             '</div>';
    }).join('');
  }

  /* ----------------------------------------------------------------------
     evidencia() — o portfólio da home: um cartão por loja "destaque"
     visível. Quem põe os cartões na parede curva e os faz passar com a
     rolagem é o site.js; aqui só se monta.
     A capa vai em data-src, não em src: o site.js só a carrega quando a
     peça chega perto da frente. A galeria mora logo abaixo do hero, e com
     src + loading="lazy" o navegador baixaria as 11 capas (~1,6 MB) já na
     abertura da página.
     Com `capaGaleria` (o cartão desenhado da marca), é ele que entra, e a
     peça ganha .peca--cartao: o cartão tem canto arredondado próprio.
     Sem loja nenhuma, a seção sai, e todo link que apontava para
     #portfolio passa a apontar para portfolio.html — senão o "Portfólio"
     do menu e o "Ver os projetos" do hero virariam âncora morta.
     ---------------------------------------------------------------------- */
  function evidencia() {
    var secao = document.querySelector('[data-evidencia]');
    if (!secao) return;

    var lojas = projetosPor('destaque');
    if (!lojas.length) {
      secao.remove();
      Array.prototype.forEach.call(document.querySelectorAll('a[href="#portfolio"]'), function (a) {
        a.setAttribute('href', 'portfolio.html');
      });
      return;
    }

    secao.querySelector('.evidencia__trilho').innerHTML = lojas.map(function (p, i) {
      var meta = [p.tipo, pastilha(p), p.segmento].filter(Boolean).map(esc).join(' · ');
      return '<article class="peca' + (p.capaGaleria ? ' peca--cartao' : '') + '" data-peca="' + i + '">' +
               '<button class="peca__abrir" type="button" data-projeto="' + esc(p.id) + '"' +
               ' aria-label="Ver o projeto ' + esc(p.nome) + '">' +
                 '<img class="peca__capa" data-src="' + esc(caminho(p.capaGaleria || p.capa)) + '"' +
                 ' alt="" width="800" height="1200" decoding="async">' +
               '</button>' +
               '<div class="peca__legenda">' +
                 '<h3 class="peca__nome">' + esc(p.nome) + '</h3>' +
                 (meta ? '<p class="peca__meta">' + meta + '</p>' : '') +
                 seta('peca__seta', 28) +
               '</div>' +
             '</article>';
    }).join('');

    var total = secao.querySelector('[data-evidencia-total]');
    if (total) total.textContent = (lojas.length < 10 ? '0' : '') + lojas.length;
    secao.style.setProperty('--n', lojas.length);
    secao.hidden = false;
  }

  /* ----------------------------------------------------------------------
     outras() — "Shopify e outras plataformas". Lojas fora da Nuvemshop, em
     linhas, abaixo do link para o portfólio completo: não disputam atenção
     com a parede de lojas Nuvemshop. Sem foto: nome, plataforma
     (conferida), o que foi feito e o link da loja.
     Sem nenhuma loja visível, o bloco inteiro sai.
     ---------------------------------------------------------------------- */
  function outras() {
    var caixas = document.querySelectorAll('[data-outras]');
    if (!caixas.length) return;

    var lista = projetosPor('outras');
    /* o primeiro com emDestaque (e a home salva no celular) vira o cartão de
       destaque onde houver vaga para ele — hoje, só na home */
    var destaque = lista.filter(function (p) {
      return p.emDestaque && temPrevia(p) && p.previa.paginas[0].celular;
    })[0] || null;

    Array.prototype.forEach.call(caixas, function (caixa) {
      /* Remove só o próprio [data-outras]: na home ele é um bloco da seção
         "todos"; no portfolio.html, um bloco dentro da seção da grade. */
      if (!lista.length) { caixa.remove(); return; }

      var itens = lista;
      var vaga = caixa.querySelector('[data-outras-destaque]');
      if (vaga && destaque) {
        vaga.innerHTML = htmlDestaque(destaque);
        vaga.hidden = false;
        itens = lista.filter(function (p) { return p !== destaque; });
      }

      caixa.querySelector('.outras__lista').innerHTML = itens.map(function (p) {
        var det = [pastilha(p), p.tipo, p.segmento, p.resumo].filter(Boolean).map(esc).join(' · ');
        var miolo = '<span class="outra__nome">' + esc(p.nome) + '</span>' +
                    (det ? '<span class="outra__det">' + det + '</span>' : '') +
                    seta('outra__seta', 22);
        /* com prévia, a linha abre o projeto aqui dentro; sem ela, leva à loja */
        return '<li class="outra">' +
                 (temPrevia(p)
                   ? '<button class="outra__abrir" type="button" data-projeto="' + esc(p.id) + '"' +
                     ' aria-label="Ver o projeto ' + esc(p.nome) + '">' + miolo + '</button>'
                   : temLink(p)
                     ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener"' +
                       ' aria-label="' + esc(p.nome) + ' — ver no ar (abre em nova aba)">' + miolo + '</a>'
                     : '<span class="outra__abrir">' + miolo + '</span>') +
               '</li>';
      }).join('');

      caixa.hidden = false;
    });
  }

  /* os botões do fim do caso — iguais no modal e no projeto.html */
  function acoesProjeto(p) {
    return '<div class="modal__acoes">' +
             (temLink(p)
               ? '<a class="btn btn--tinta" href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
                 'Ver loja no ar' + seta('seta', 15) + '</a>'
               : '') +
             '<a class="link-sub" data-zap="Olá, Gabriel! Vi o projeto ' + esc(p.nome) +
             ' no site e quero algo parecido." href="https://wa.me/' + SC.WHATSAPP +
             '">Quero algo parecido</a>' +
           '</div>';
  }

  /* ----------------------------------------------------------------------
     A PRÉVIA — a loja congelada, para ser vista aqui dentro mesmo que ela
     mude ou saia do ar. Vem do `previa` do dados.js: páginas (Início, Produto…)
     e, em cada uma, quantas partes o celular e o computador têm.

     Cada página é uma imagem inteira, fatiada em partes de 2400 de altura:
     assets/img/previa/<id>/<arquivo>-<aparelho>-<k>.jpg. Só a primeira parte
     vem em src; as outras, em data-src, e o site.js põe cada uma quando a tela
     chega perto dela.

     Aqui só se monta. Quem troca a página e o aparelho é o site.js.
     ---------------------------------------------------------------------- */
  var LARGURA_PARTE = { celular: 500, computador: 1200 };
  var ICONE_APARELHO = {
    celular: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
             '<rect x="4.25" y="1.25" width="7.5" height="13.5" rx="1.75" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
             '<path d="M7.25 12.25h1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    computador: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
                '<rect x="1.25" y="2.25" width="13.5" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
                '<path d="M5.5 14.25h5M8 11.5v2.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
  };

  /* `preguica`: a primeira também espera a tela chegar perto (o celular do
     cartão de destaque mora longe do topo da página; o do modal, não) */
  function partesPrevia(p, pagina, aparelho, alt, preguica) {
    var total = pagina[aparelho] || 0;
    var base = 'assets/img/previa/' + p.id + '/' + pagina.arquivo + '-' + aparelho + '-';
    var medidas = ' width="' + LARGURA_PARTE[aparelho] + '" height="2400"';
    var lazy = preguica ? ' loading="lazy"' : '';
    var imgs = '';
    for (var k = 1; k <= total; k++) {
      var src = esc(caminho(base + k + '.jpg'));
      imgs += k === 1
        ? '<img src="' + src + '" alt="' + alt + '"' + medidas + lazy + ' decoding="async">'
        : '<img data-src="' + src + '" alt=""' + medidas + ' decoding="async">';
    }
    return imgs;
  }

  /* "colado.art.br", para a barra de endereço desenhada */
  function dominio(url) {
    return String(url || '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/.*$/, '');
  }

  /* o quadro de um aparelho, com a página dentro: o celular desenhado ou a
     janela do navegador. A tela é uma região que rola sozinha — roda do
     mouse, dedo ou setas do teclado (tabindex). A barrinha é a de rolagem do
     iPhone, desenhada: aparece enquanto se rola. */
  function htmlPalco(p, indice, aparelho) {
    var pagina = p.previa.paginas[indice];
    var nome = esc(p.nome);
    var titulo = esc(pagina.nome);
    var imgs = partesPrevia(p, pagina, aparelho,
      titulo + ' de ' + nome + ' no ' + aparelho + ', do topo ao rodapé', false);
    var barra = '<span class="aparelho__barra" aria-hidden="true"></span>';

    if (aparelho === 'computador') {
      return '<div class="janela">' +
               '<div class="janela__topo" aria-hidden="true">' +
                 '<span class="janela__botoes"><i></i><i></i><i></i></span>' +
                 '<span class="janela__endereco">' + esc(dominio(p.url)) + '</span>' +
               '</div>' +
               '<div class="janela__tela">' +
                 '<div class="janela__rolagem" data-previa-tela tabindex="0" role="region"' +
                 ' aria-label="Computador com a loja ' + nome + ': ' + titulo + '">' + imgs + '</div>' +
                 barra +
               '</div>' +
             '</div>';
    }
    return '<div class="aparelho__corpo">' +
             '<div class="aparelho__tela">' +
               '<div class="aparelho__rolagem" data-previa-tela tabindex="0" role="region"' +
               ' aria-label="Celular com a loja ' + nome + ': ' + titulo + '">' + imgs + '</div>' +
               barra +
             '</div>' +
           '</div>';
  }

  /* "outubro de 2026" */
  function mesAno(iso) {
    var d = new Date(String(iso) + 'T12:00:00');
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  /* A frase embaixo da prévia. Nas lojas no ar, diz que a prévia é uma foto
     datada: depois da entrega a loja é do cliente, e o que está no ar pode ser
     outra coisa. Com `aviso`, não há frase aqui: ele já explica, em cima. */
  function legendaPrevia(p) {
    if (p.aviso) return '';
    if (!temLink(p)) return 'Prévia da loja como foi entregue.';
    var quando = mesAno(p.previa.data);
    return (quando ? 'Prévia salva em ' + quando + '. ' : '') + 'A loja no ar pode ter mudado desde então.';
  }

  /* a prévia inteira: o aviso da loja que encerrou, botões das páginas, botões
     do aparelho (cada grupo só aparece se houver o que escolher), o quadro e a
     legenda */
  function htmlPrevia(p) {
    var paginas = p.previa.paginas;
    var legenda = legendaPrevia(p);
    var aparelho = paginas[0].celular ? 'celular' : 'computador';
    var algumComputador = paginas.some(function (g) { return g.computador; });
    var algumCelular = paginas.some(function (g) { return g.celular; });

    var botoesPagina = paginas.length < 2 ? '' :
      '<div class="previa__grupo" role="group" aria-label="Páginas da loja">' +
        paginas.map(function (g, i) {
          return '<button class="filtro" type="button" data-previa-pagina="' + i + '"' +
                 ' aria-pressed="' + (i === 0) + '">' + esc(g.nome) + '</button>';
        }).join('') +
      '</div>';

    /* só o ícone, com o nome para o leitor de tela: assim os dois botões cabem
       na mesma linha das páginas, e sobra altura para a loja */
    var botoesAparelho = !(algumCelular && algumComputador) ? '' :
      '<div class="previa__grupo previa__aparelhos" role="group" aria-label="Aparelho">' +
        ['celular', 'computador'].map(function (a) {
          var rotulo = a === 'celular' ? 'Ver no celular' : 'Ver no computador';
          return '<button class="filtro" type="button" data-previa-aparelho="' + a + '"' +
                 ' aria-pressed="' + (a === aparelho) + '"' + (paginas[0][a] ? '' : ' disabled') +
                 ' aria-label="' + rotulo + '" title="' + rotulo + '"' +
                 ' data-i18n="previa.' + a + '" data-i18n-attr="aria-label">' + ICONE_APARELHO[a] + '</button>';
        }).join('') +
      '</div>';

    return '<figure class="previa" data-previa="' + esc(p.id) + '" data-previa-aparelho-atual="' + aparelho + '">' +
             (p.aviso ? '<p class="previa__aviso">' + esc(p.aviso) + '</p>' : '') +
             (botoesPagina || botoesAparelho
               ? '<div class="previa__controles">' + botoesPagina + botoesAparelho + '</div>' : '') +
             '<div class="previa__palco" data-previa-palco>' + htmlPalco(p, 0, aparelho) + '</div>' +
             '<figcaption class="previa__legenda rotulo">' +
               '<span class="aparelho__dica">' +
                 '<svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
                   '<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"' +
                   ' stroke-linejoin="round" d="M8 2v12M4.5 5.5L8 2l3.5 3.5M4.5 10.5L8 14l3.5-3.5"/></svg>' +
                 '<span data-i18n="previa.dica">Role a tela</span>' +
               '</span>' +
               (legenda ? '<span class="previa__data">' + legenda + '</span>' : '') +
             '</figcaption>' +
           '</figure>';
  }

  /* O cartão de destaque da lista "outras", embaixo do título: o mesmo
     celular, mas a home rola sozinha, devagar (o site.js anda com ela) —
     nada de rolar pela roda aqui, ou quem desce a página com o cursor em
     cima ficaria preso rolando a loja inteira. Clicar no celular ou em
     "Ver o projeto" abre o modal, onde ela rola à vontade. */
  function htmlDestaque(p) {
    var meta = [p.plataforma, p.tipo, p.segmento].filter(Boolean)
      .map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('');
    return '<article class="destaque" data-destaque>' +
             '<div class="destaque__aparelho" data-projeto="' + esc(p.id) + '" aria-hidden="true">' +
               '<div class="aparelho__corpo">' +
                 '<div class="aparelho__tela">' +
                   '<div class="aparelho__rolagem">' + partesPrevia(p, p.previa.paginas[0], 'celular', '', true) + '</div>' +
                 '</div>' +
               '</div>' +
             '</div>' +
             '<div class="destaque__texto">' +
               '<p class="destaque__rotulo rotulo" data-i18n="outras.destaque">Em destaque</p>' +
               '<h3 class="destaque__nome">' + esc(p.nome) + '</h3>' +
               (meta ? '<ul class="destaque__meta">' + meta + '</ul>' : '') +
               /* o nome da loja vai só para o leitor de tela, fora do
                  data-i18n: o texto visível se traduz, o nome não */
               '<div class="destaque__acoes">' +
                 '<button class="btn btn--tinta" type="button" data-projeto="' + esc(p.id) + '">' +
                   '<span data-i18n="outras.verProjeto">Ver o projeto</span>' +
                   '<span class="so-leitor"> ' + esc(p.nome) + '</span>' +
                 '</button>' +
                 (temLink(p)
                   ? '<a class="link-sub" href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
                     '<span data-i18n="outras.noAr">Ver loja no ar</span>' +
                     '<span class="so-leitor"> ' + esc(p.nome) + ' (abre em nova aba)</span>' +
                     '</a>'
                   : '') +
               '</div>' +
             '</div>' +
           '</article>';
  }

  /* ----------------------------------------------------------------------
     htmlModal(p) — devolve o miolo do modal de um projeto, como texto.
     Só monta; quem abre, fecha, prende o foco e devolve o foco ao card de
     origem é o site.js. Com `previa`, ela entra logo abaixo da linha de
     dados, antes dos textos e dos botões.
     ---------------------------------------------------------------------- */
  function htmlModal(p) {
      var pas = pastilha(p);
      /* o tipo vai na linha de dados, debaixo do nome — e não num rótulo
         em cima dele */
      var h = '<h2 id="modal-titulo">' + esc(p.nome) + '</h2>';

      var meta = [];
      if (p.tipo) meta.push(esc(p.tipo));
      if (p.segmento) meta.push(esc(p.segmento));
      if (pas) meta.push(esc(pas));
      if (p.ano) meta.push(esc(p.ano));
      if (meta.length) h += '<p class="modal__meta">' + meta.join(' · ') + '</p>';

      if (temPrevia(p)) h += htmlPrevia(p);

      if (p.resumo)  h += '<p class="lead">' + esc(p.resumo) + '</p>';

      if (p.desafio) h += '<h3>O desafio</h3><p>' + esc(p.desafio) + '</p>';

      if (p.entrega && p.entrega.length) {
        h += '<h3>O que foi entregue</h3><ul class="lista-check">' +
             p.entrega.map(function (i) {
               return '<li>' + esc(i) + '</li>';
             }).join('') + '</ul>';
      }

      if (p.resultado) h += '<h3>Resultado</h3><p>' + esc(p.resultado) + '</p>';

      if (p.depoimento && p.depoimento.texto) {
        h += '<blockquote class="modal__depo">&ldquo;' + esc(p.depoimento.texto) +
             '&rdquo;<cite>' + esc(p.depoimento.autor) + '</cite></blockquote>';
      }

      if (p.imagens && p.imagens.length) {
        h += '<div class="modal__galeria">' + p.imagens.map(function (src, i) {
          return '<img src="' + esc(caminho(src)) + '" alt="' + esc(p.nome) + ' — imagem ' +
                 (i + 1) + '" width="1200" height="900" loading="lazy" decoding="async">';
        }).join('') + '</div>';
      }

      h += acoesProjeto(p);

      return h;
  }

  /* ----------------------------------------------------------------------
     citacoes() — "Também passaram por aqui". Sem card e sem imagem: nome,
     tipo e plataforma, em colunas. Dá volume sem roubar a atenção dos
     e-commerces, que é o que eu vendo.
     ---------------------------------------------------------------------- */
  function citacoes() {
    var caixa = document.querySelector('[data-citacoes]');
    if (!caixa) return;

    var lista = projetosPor('citacao');
    if (!lista.length) { caixa.remove(); return; }

    caixa.querySelector('.citacoes__lista').innerHTML = lista.map(function (p) {
      var detalhe = [p.tipo, p.plataforma].filter(Boolean).join(' · ');
      var miolo = '<span class="citacao__nome">' + esc(p.nome) + '</span>' +
                  (detalhe ? '<span class="citacao__det">' + esc(detalhe) + '</span>' : '');
      return temLink(p)
        ? '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + miolo + '</a></li>'
        : '<li>' + miolo + '</li>';
    }).join('');

    caixa.hidden = false;
  }

  /* ----------------------------------------------------------------------
     depoimentos() — avatar com as iniciais (não invento foto de cliente),
     nome, segmento, estrelas e o texto. Array vazio remove a seção.
     ---------------------------------------------------------------------- */
  function depoimentos() {
    var caixa = document.querySelector('[data-depoimentos]');
    if (!caixa) return;

    var lista = (typeof DEPOIMENTOS !== 'undefined') ? DEPOIMENTOS : [];
    lista = lista.filter(function (d) { return d && d.nome && d.texto; });

    if (!lista.length) {
      var secao = caixa.closest('.secao');
      if (secao) secao.remove(); else caixa.remove();
      return;
    }

    /* a grade acompanha quantos depoimentos existem, como nas abas */
    var grade = caixa.querySelector('.cards');
    grade.className = 'cards cards--' + Math.min(lista.length, 3);

    grade.innerHTML = lista.map(function (d) {
      var ini = d.nome.trim().split(/\s+/).slice(0, 2)
                  .map(function (n) { return n.charAt(0); }).join('').toUpperCase();
      var nota = Math.max(0, Math.min(5, d.nota || 5));

      return '<article class="card depo">' +
               '<div class="depo__topo">' +
                 '<span class="depo__avatar" aria-hidden="true">' + esc(ini) + '</span>' +
                 '<div><p class="depo__nome">' + esc(d.nome) + '</p>' +
                 (d.segmento ? '<p class="depo__seg">' + esc(d.segmento) + '</p>' : '') +
                 '</div>' +
               '</div>' +
               '<p class="depo__estrelas" aria-label="' + nota + ' de 5">' +
                 estrelas(nota) + '</p>' +
               '<p class="depo__texto">&ldquo;' + esc(d.texto) + '&rdquo;</p>' +
               (d.audio ? '<audio controls preload="none" src="' + esc(caminho(d.audio)) +
                          '">Seu navegador não toca áudio.</audio>' : '') +
             '</article>';
    }).join('');

    caixa.hidden = false;
  }

  function estrelas(n) {
    var s = '';
    for (var i = 0; i < 5; i++) {
      s += '<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"' +
           ' focusable="false" class="estrela' + (i < n ? '' : ' estrela--off') + '">' +
           '<path fill="currentColor" d="M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8 3.8 14l.8-4.7L1.2 6l4.7-.7z"/>' +
           '</svg>';
    }
    return s;
  }

  /* ----------------------------------------------------------------------
     portfolioGrade() — a grade de portfolio.html, com filtros por tipo.
     Os filtros saem dos tipos que DE FATO existem entre os projetos
     visíveis: não há lista de filtros escrita na mão.
     ---------------------------------------------------------------------- */
  function portfolioGrade() {
    var caixa = document.querySelector('[data-grade]');
    if (!caixa) return;

    var lista = projetosComCard();
    var grade = caixa.querySelector('.grade-projetos');
    var tira  = caixa.querySelector('[data-filtros]');
    var vazio = document.querySelector('[data-grade-vazia]');

    if (!lista.length) {
      caixa.hidden = true;
      if (vazio) vazio.hidden = false;
      return;
    }
    if (vazio) vazio.remove();

    var tipos = [];
    lista.forEach(function (p) {
      if (p.tipo && tipos.indexOf(p.tipo) === -1) tipos.push(p.tipo);
    });

    /* Com um tipo só, a barra seria "Todos · E-commerce completo", os dois
       com o mesmo número: filtro que não filtra. Ela só aparece com dois
       tipos ou mais — e volta sozinha quando houver. */
    if (tipos.length < 2) tira.remove();
    else tira.innerHTML = ['Todos'].concat(tipos).map(function (t, i) {
      return '<button class="filtro" type="button" data-filtro="' + esc(t) + '"' +
             ' aria-pressed="' + (i === 0) + '">' + esc(t) +
             '<span class="filtro__n">' +
               (i === 0 ? lista.length
                        : lista.filter(function (p) { return p.tipo === t; }).length) +
             '</span></button>';
    }).join('');

    grade.innerHTML = lista.map(function (p) {
      return '<div class="grade-projetos__item" data-tipo="' + esc(p.tipo || '') + '">' +
             cardProjeto(p) + '</div>';
    }).join('');

    caixa.hidden = false;   /* quem liga o clique do filtro é o site.js */
  }

  /* ----------------------------------------------------------------------
     paginaProjeto() — projeto.html?id=<slug>. Lê o id da URL sobre PROJETOS.
     Id inexistente, escondido ou "citacao" (que não tem página) cai no
     aviso, nunca numa página meio montada.
     ---------------------------------------------------------------------- */
  function paginaProjeto() {
    var alvo = document.querySelector('[data-projeto-pagina]');
    if (!alvo) return;

    var id = new URLSearchParams(window.location.search).get('id');
    var p  = todosProjetos().filter(function (x) { return x.id === id; })[0];

    var naoAchou = document.querySelector('[data-projeto-vazio]');

    /* "citacao" e "outras" não têm página de caso: não têm foto nem história */
    if (!p || !projetoVisivel(p) || p.exibicao === 'citacao' || p.exibicao === 'outras') {
      alvo.remove();
      if (naoAchou) naoAchou.hidden = false;
      document.title = 'Projeto não encontrado — Studio Cassa';

      /* sem projeto não há conteúdo próprio: essa versão da página não deve
         ser indexada. Com projeto, a página fica indexável normalmente. */
      var m = document.createElement('meta');
      m.setAttribute('name', 'robots');
      m.setAttribute('content', 'noindex, follow');
      document.head.appendChild(m);
      return;
    }
    if (naoAchou) naoAchou.remove();

    /* Título, descrição, canonical E as tags sociais — todas juntas. Deixar
       as sociais na versão genérica faria a prévia de qualquer case
       compartilhado dizer "Projeto não encontrado". */
    var titulo = p.nome + ' — Studio Cassa';
    var desc   = (p.resumo || p.desafio ||
                 ('Projeto ' + p.tipo + ' em ' + p.plataforma + '.')).slice(0, 155);
    var url    = 'https://studiocassa.com.br/projeto.html?id=' + encodeURIComponent(p.id);

    document.title = titulo;

    function meta(sel, valor) {
      var el = document.querySelector(sel);
      if (el) el.setAttribute('content', valor);
    }
    meta('meta[name="description"]', desc);
    meta('meta[property="og:title"]', titulo);
    meta('meta[property="og:description"]', desc);
    meta('meta[property="og:url"]', url);
    meta('meta[name="twitter:title"]', titulo);
    meta('meta[name="twitter:description"]', desc);

    var canon = document.querySelector('link[rel="canonical"]');
    if (canon) canon.setAttribute('href', url);

    /* A imagem de compartilhamento continua sendo a OG padrão (1200x630): a
       capa agora é retrato 2:3, e WhatsApp e Facebook cortam para paisagem —
       o logo, que fica embaixo da foto, seria o primeiro a sumir. */

    var pas = pastilha(p);
    var meta = [p.tipo, p.segmento, pas, p.ano].filter(Boolean).map(esc).join(' · ');

    var h = '<h1>' + esc(p.nome) + '</h1>' +
            (meta ? '<p class="modal__meta">' + meta + '</p>' : '') +
            (p.resumo ? '<p class="lead">' + esc(p.resumo) + '</p>' : '') +
            '<img class="projeto__hero" src="' + esc(caminho(p.capa)) + '" alt="Loja ' +
              esc(p.nome) + '" width="800" height="1200" fetchpriority="high" decoding="async">';

    if (temPrevia(p)) h += htmlPrevia(p);

    if (p.desafio) h += '<h2>O desafio</h2><p>' + esc(p.desafio) + '</p>';

    if (p.entrega && p.entrega.length) {
      h += '<h2>O que foi entregue</h2><ul class="lista-check">' +
           p.entrega.map(function (i) {
             return '<li>' + esc(i) + '</li>';
           }).join('') + '</ul>';
    }
    if (p.resultado) h += '<h2>Resultado</h2><p>' + esc(p.resultado) + '</p>';

    if (p.depoimento && p.depoimento.texto) {
      h += '<blockquote class="modal__depo">&ldquo;' + esc(p.depoimento.texto) +
           '&rdquo;<cite>' + esc(p.depoimento.autor) + '</cite></blockquote>';
    }
    if (p.imagens && p.imagens.length) {
      h += '<div class="modal__galeria">' + p.imagens.map(function (src, i) {
        return '<img src="' + esc(caminho(src)) + '" alt="' + esc(p.nome) + ' — imagem ' +
               (i + 1) + '" width="1200" height="900" loading="lazy" decoding="async">';
      }).join('') + '</div>';
    }

    h += acoesProjeto(p);

    alvo.innerHTML = h;
    alvo.hidden = false;

    /* BreadcrumbList só existe quando a página de fato existe */
    var bc = document.querySelector('[data-breadcrumb]');
    if (bc) {
      bc.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início',
            item: 'https://studiocassa.com.br/' },
          { '@type': 'ListItem', position: 2, name: 'Portfólio',
            item: 'https://studiocassa.com.br/portfolio.html' },
          { '@type': 'ListItem', position: 3, name: p.nome }
        ]
      }, null, 2);
    }
  }


  /* ----------------------------------------------------------------------
     posts() — cards de artigo, a partir de POSTS.
     Serve a dois lugares: o bloco da home (hoje comentado, §15b) e a grade
     de blog.html. `data-posts-base` existe porque blog/<slug>.html fica numa
     subpasta: de lá o caminho é "", da raiz é "blog/". Nada de caminho
     absoluto, que quebraria se o Pages servir em subpasta.
     ---------------------------------------------------------------------- */
  function posts() {
    var caixas = document.querySelectorAll('[data-posts]');
    if (!caixas.length) return;

    var lista = (typeof POSTS !== 'undefined') ? POSTS : [];
    lista = lista.filter(function (p) { return p && p.slug && p.titulo; });

    Array.prototype.forEach.call(caixas, function (caixa) {
      if (!lista.length) {
        var vazio = document.querySelector('[data-posts-vazio]');
        if (vazio) vazio.hidden = false;
        caixa.remove();
        return;
      }

      var base  = caixa.getAttribute('data-posts-base') || 'blog/';
      var limite = parseInt(caixa.getAttribute('data-posts-max'), 10) || lista.length;

      caixa.className = 'cards cards--' + Math.min(lista.length, 3);
      caixa.innerHTML = lista.slice(0, limite).map(function (p) {
        var meta = [p.data ? dataPtBr(p.data) : '', p.leitura].filter(Boolean).join(' · ');
        return '<article class="card post">' +
                 (p.categoria ? '<span class="pastilha">' + esc(p.categoria) + '</span>' : '') +
                 '<h3><a href="' + esc(base + p.slug) + '.html">' + esc(p.titulo) + '</a></h3>' +
                 (p.resumo ? '<p>' + esc(p.resumo) + '</p>' : '') +
                 (meta ? '<p class="post__meta">' + esc(meta) + '</p>' : '') +
               '</article>';
      }).join('');
      caixa.hidden = false;
    });
  }

  function dataPtBr(iso) {
    var d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  /* ----------------------------------------------------------------------
     A ordem de montagem. O site.js chama isto uma vez, no arranque.
     ---------------------------------------------------------------------- */
  function montarTudo() {
    SC = window.SC || {};
    posts();
    selo();
    logosConfianca();
    servicos();
    processo();
    orbita();
    evidencia();
    citacoes();
    outras();
    depoimentos();
    portfolioGrade();
    paginaProjeto();
  }

  /* O que o site.js precisa para ligar o comportamento. */
  return {
    montarTudo:    montarTudo,
    htmlModal:     htmlModal,
    htmlPalco:     htmlPalco,
    projetoPorId:  function (id) {
      return todosProjetos().filter(function (p) { return p.id === id; })[0];
    },
    projetoVisivel: projetoVisivel
  };
})();

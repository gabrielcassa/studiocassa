/* ==========================================================================
   i18n.js — Studio Cassa
   O site sai só em português. O inglês está preparado, não ligado.

   PARA LIGAR O INGLÊS, TRÊS PASSOS E SÓ:
     1. traduzir as chaves dentro de DICIONARIO.en (a lista é idêntica à do pt);
     2. somar 'en' em IDIOMAS_ATIVOS;
     3. nada mais — o seletor aparece sozinho quando houver 2 idiomas.

   COMO FUNCIONA
     Todo texto visível do HTML carrega data-i18n="secao.chave".
     O HTML já está escrito em português, então com o idioma em 'pt' esta
     função NÃO toca no DOM: o HTML é a fonte da verdade do português e não
     existe risco de o dicionário sair de sincronia com a página.
     O dicionário pt existe completo porque é ele que serve de espelho para a
     tradução e de rede de segurança: chave que falta no 'en' cai no 'pt'.

     data-i18n       → troca o texto (textContent)
     data-i18n-html  → troca o conteúdo com marcação (para título com <em>)
     data-i18n-attr  → troca um atributo. Ex.: data-i18n-attr="aria-label"

   O que NUNCA recebe data-i18n: texto que vem do dados.js (nome de cliente,
   segmento, plataforma). Nome de loja não se traduz.
   ========================================================================== */

var IDIOMAS_ATIVOS = ['pt'];
var IDIOMA_PADRAO  = 'pt';

var DICIONARIO = {

  pt: {
    /* --- nav ---------------------------------------------------------- */
    'nav.tagline':        'lojas Nuvemshop sob medida',
    'nav.sobre':          'Sobre',
    'nav.servicos':       'Serviços',
    'nav.processo':       'Como funciona',
    'nav.portfolio':      'Portfólio',
    'nav.contato':        'Contato',
    'nav.cta':            'Falar no WhatsApp',
    /* rótulo neutro: com aria-expanded="true" o leitor anunciaria
       "Abrir o menu, expandido", que é contraditório */
    'nav.menuRotulo':     'Menu',
    'nav.pular':          'Ir para o conteúdo',

    /* --- 4. marquee (texto visível, logo traduzível) -------------------- */
    'mq.1':               'Nuvemshop',
    'mq.2':               'migração de plataforma',
    'mq.3':               'página de produto',
    'mq.4':               'tema Ipanema',
    'mq.5':               'CSS customizado',
    'mq.6':               'landing page',
    'mq.7':               'otimização de loja no ar',
    'mq.8':               'tema Flex',
    'mq.9':               'e-commerce sob medida',

    /* --- hero --------------------------------------------------------- */
    'hero.h1':            'Loja Nuvemshop feita <em>sob medida</em>',
    'hero.texto':         'A gente constrói, migra e melhora loja na Nuvemshop desde 2024. São 10 e-commerces completos entregues — cada um com a cara da marca dele, não a do tema.',
    'hero.cta1':          'Quero minha loja',
    'hero.cta2':          'Ver portfólio',
    'hero.confianca':     'Marcas que já confiaram',

    'hero.n1':            '10',
    'hero.r1':            'e-commerces completos',
    'hero.n2':            '19',
    /* espaço fixo antes de "ar": sem ele a palavra cai sozinha na última
       linha no celular */
    'hero.r2':            'otimizações em lojas e sites já no ar',
    'hero.n3':            '+50',
    'hero.r3':            'páginas de produto exclusivas para best sellers',

    /* --- 3. sobre ----------------------------------------------------- */
    'sobre.rotulo':       'Quem faz',
    'sobre.h2':           'Uma pessoa só. E isso é <em>a vantagem</em>.',
    'sobre.p1':           'Me chamo Gabriel Cassa. Desde 2024 eu construo loja na Nuvemshop — do zero, ou migrando de uma plataforma que já não dava conta. Comecei mexendo no CSS de tema pronto e acabei fazendo loja inteira.',
    'sobre.p2':           'Trabalho sozinho de propósito. Quem responde no WhatsApp é quem desenha, quem escreve o código e quem entrega. Não tem repasse para terceiro, e você não precisa explicar seu negócio três vezes.',
    'sobre.cta1':         'Ver portfólio',

    /* --- 5. essência -------------------------------------------------- */
    'essencia.rotulo':    'Essência',
    'essencia.h2':        'O que eu faço quando <em>ninguém está olhando</em>.',
    'essencia.c1r':       'Missão',
    'essencia.c1t':       'Tirar a loja do template',
    'essencia.c1p':       'Fazer loja com a cara da marca, não a cara do tema. Cada projeto sai com decisão de design tomada para aquele negócio, e não copiada do anterior.',
    'essencia.c2r':       'Visão',
    'essencia.c2t':       'Ser a primeira ligação',
    'essencia.c2p':       'Que quem vende online pense em mim antes de pensar em plataforma — porque o problema quase nunca é a plataforma, é como ela foi montada.',
    'essencia.c3r':       'Valores',
    'essencia.c3t':       'Combinado escrito',
    'essencia.c3p':       'Escopo por escrito, com o que entra e o que não entra. Prazo dito na frente. Se alguma coisa atrasar, você fica sabendo por mim primeiro.',

    /* --- 6. a plataforma ---------------------------------------------- */
    'plat.rotulo':        'A plataforma',
    'plat.h2':            'Por que eu construo <em>na Nuvemshop</em>.',
    'plat.apoio':         'Dá para fazer loja bonita em qualquer lugar. O que muda é o que sobra para você depois que eu entrego.',
    'plat.r1t':           'O tema aceita código',
    'plat.r1p':           'Dá para editar o tema por dentro. É isso que permite página de produto exclusiva e layout que não parece o do vizinho.',
    'plat.r2t':           'O painel é para o lojista',
    'plat.r2p':           'Você cadastra produto, troca banner e vê pedido sem me chamar. Entrego com treinamento em vídeo para não depender de mim no dia a dia.',
    'plat.r3t':           'Migrar não é recomeçar',
    'plat.r3p':           'Produto, categoria e cliente vêm junto, e as URLs antigas são redirecionadas — o que você já construiu no Google não vai embora.',

    /* --- 8. prova de números ------------------------------------------ */
    'num.rotulo':         'Números',
    'num.h2':             'Sem estimativa. Só o que <em>já está no ar</em>.',
    'num.r4':             'landing pages',
    'num.data':           'Conferido em setembro de 2026',

    /* --- 9. serviços -------------------------------------------------- */
    'serv.rotulo':        'Serviços',
    'serv.h2':            'Escolha pelo problema, não <em>pelo pacote</em>.',
    'serv.apoio':         'Me diga em que pé está a sua loja hoje. O resto a gente ajusta na conversa.',
    'serv.orcamento':     'Sob orçamento · resposta no mesmo dia',

    /* --- 10. como funciona -------------------------------------------- */
    'proc.rotulo':        'Como funciona',
    'proc.h2':            'Sete passos. Nenhum <em>improviso</em>.',
    'proc.apoio':         'Do primeiro "oi" no WhatsApp até você tocando a loja sozinho.',

    /* --- 11. portfólio ------------------------------------------------ */
    'port.rotulo':        'Portfólio',
    'port.h2':            'Loja de verdade, <em>no ar agora</em>.',
    'port.apoio':         'Cada card abre o caso: o que o cliente tinha antes, o que eu entreguei e o endereço para você conferir.',
    'port.antes':         'Projeto anterior',
    'port.depois':        'Próximo projeto',
    'port.todos':         'Ver todos os projetos',
    'port.grupo':         'Projetos em destaque',
    'port.tambem':        'Também passaram por aqui',
    'port.marcas':        'Marcas que passaram por aqui',

    /* --- 11b. shopify e outras plataformas ----------------------------- */
    'outras.rotulo':      'Shopify e outras plataformas',
    'outras.h2':          'A Nuvemshop é a casa, <em>não a única</em>.',
    'outras.apoio':       'Quando a loja já roda em outra plataforma, eu trabalho onde ela está.',

    /* --- 13. depoimentos ---------------------------------------------- */
    'depo.rotulo':        'Depoimentos',
    'depo.h2':            'Quem já passou por isso <em>conta melhor</em>.',

    /* --- modal --------------------------------------------------------- */
    'modal.fechar':       'Fechar',

    /* --- páginas internas ---------------------------------------------- */
    'mig.inicio':         'Início',
    'portp.h1':           'Tudo que eu <em>já coloquei no ar</em>.',
    'portp.apoio':        'A plataforma de cada endereço foi conferida no HTML da loja, uma a uma. O que está escrito no card é o que o site serve hoje.',
    'portp.projetos':     'Projetos',
    'portp.vazioT':       'As fotos ainda não subiram',
    'portp.vazioP':       'As lojas existem e estão no ar — o que falta é a foto e o logo de cada uma. Se quiser ver agora, eu mando os endereços.',
    'portp.vazioCta':     'Pedir o portfólio no WhatsApp',
    'proj.vazioT':        'Projeto não encontrado',
    'proj.vazioP':        'Esse endereço não corresponde a nenhum projeto publicado. Pode ser um link antigo, ou um projeto que ainda não está no ar.',
    'proj.vazioCta':      'Ver o portfólio',

    /* --- 15. blog (bloco da home está comentado — §15b) ---------------- */
    'blog.rotulo':        'Blog',
    'blog.h1':            'O que eu aprendo <em>fazendo</em>.',
    'blog.h2':            'O que eu aprendo <em>fazendo</em>.',
    'blog.apoio':         'Texto sobre e-commerce escrito por quem constrói, não por quem só opina.',
    'blog.todos':         'Ver todos os artigos',
    'blog.artigos':       'Artigos',
    'blog.vazioT':        'Ainda não há artigo publicado',
    'blog.vazioP':        'Assim que o primeiro texto sair, ele aparece aqui.',

    /* --- 16. contato final --------------------------------------------- */
    'cta.rotulo':         'Contato',
    'cta.h2':             'Sua loja não vai <em>se construir sozinha</em>.',
    'cta.apoio':          'Me conta em que pé está: ideia no papel, loja parada ou loja vendendo que podia vender mais. Eu respondo no mesmo dia.',
    'cta.botao':          'Chamar no WhatsApp',
    'cta.pagina':         'Outras formas de falar comigo',

    /* --- contato.html --------------------------------------------------- */
    'cont.h1':            'Fala comigo <em>direto</em>.',
    'cont.apoio':         'Não tem formulário, não tem atendente e não tem fila. Você me manda mensagem e quem responde sou eu.',
    'cont.zapT':          'WhatsApp',
    'cont.zapD':          'O caminho mais rápido. É por aqui que eu toco os projetos.',
    'cont.mailT':         'E-mail',
    'cont.instaT':        'Instagram',
    'cont.h2a':           'Horário',
    'cont.horarioObs':    'Mensagem fora desse horário eu respondo no próximo dia útil.',
    'cont.h2b':           'Onde eu estou',
    'cont.local':         'São João del-Rei · MG',
    'cont.localObs':      'Atendo o Brasil inteiro. Tudo é feito a distância, com reunião por chamada.',
    'cont.h2c':           'Adianta o lado',
    'cont.adianta':       'Se já souber, me diga isto na primeira mensagem:',
    'cont.a1':            'O que você vende e para quem',
    'cont.a2':            'Se já tem loja no ar, e em qual plataforma',
    'cont.a3':            'Se já tem domínio comprado',
    'cont.a4':            'Qual o prazo que você tem em mente',

    /* --- 404.html -------------------------------------------------------- */
    'e404.h1':            'Essa página <em>não existe</em>.',
    'e404.apoio':         'Pode ser um link antigo ou um endereço digitado errado. O site inteiro cabe nos links abaixo.',
    'e404.cta1':          'Voltar ao início',

    /* --- rodapé ------------------------------------------------------- */
    'rodape.sobre':       'Lojas Nuvemshop feitas sob medida, de São João del-Rei para o Brasil inteiro.',
    'rodape.navegar':     'Navegar',
    'rodape.servicos':    'Serviços',
    'rodape.falar':       'Falar comigo',
    'rodape.whatsapp':    'WhatsApp',
    'rodape.instagram':   'Instagram',
    'rodape.email':       'E-mail',
    'rodape.horario':     'Seg a sex, 9h às 18h',
    'rodape.s1':          'E-commerce completo',
    'rodape.s2':          'Migração de plataforma',
    'rodape.s3':          'Página de produto',
    'rodape.s4':          'Landing page',
    'rodape.local':       'São João del-Rei · MG',
    'rodape.direitos':    'Todos os direitos reservados.',

    /* --- flutuantes --------------------------------------------------- */
    'flut.whatsapp':      'Falar no WhatsApp',
    'flut.topo':          'Voltar ao topo',
    'flut.zapPadrao':     'Olá, Gabriel! Vim pelo site e quero falar sobre um projeto.'
  },

  /* Vazio de propósito. Traduzir as mesmas chaves do pt acima. */
  en: {}
};

/* ------------------------------------------------------------------------ */
function idiomaAtual() {
  var salvo = null;
  try { salvo = localStorage.getItem('cassa-idioma'); } catch (e) { salvo = null; }
  if (salvo && IDIOMAS_ATIVOS.indexOf(salvo) !== -1) return salvo;
  return IDIOMA_PADRAO;
}

function traduzir(lang) {
  /* Em português o HTML já está certo — não se mexe no DOM. */
  if (lang === IDIOMA_PADRAO) {
    document.documentElement.lang = 'pt-BR';
    return;
  }

  var dic  = DICIONARIO[lang] || {};
  var base = DICIONARIO[IDIOMA_PADRAO];

  Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
    var chave = el.getAttribute('data-i18n');
    var texto = dic[chave] || base[chave];       /* chave faltando cai no pt */
    if (texto === undefined) return;

    var attr = el.getAttribute('data-i18n-attr');
    if (attr) el.setAttribute(attr, texto);
    else if (el.hasAttribute('data-i18n-html')) el.innerHTML = texto;
    else el.textContent = texto;
  });

  document.documentElement.lang = (lang === 'en') ? 'en' : lang;
}

function trocarIdioma(lang) {
  if (IDIOMAS_ATIVOS.indexOf(lang) === -1) return;
  try { localStorage.setItem('cassa-idioma', lang); } catch (e) { /* modo anônimo */ }
  traduzir(lang);
  montarSeletor();
}

/* O seletor só é impresso quando existe mais de um idioma ativo. Com
   IDIOMAS_ATIVOS = ['pt'] ele nem chega a existir no DOM. */
function montarSeletor() {
  var caixa = document.querySelector('[data-idiomas]');
  if (!caixa) return;

  if (IDIOMAS_ATIVOS.length < 2) { caixa.hidden = true; caixa.innerHTML = ''; return; }

  var atual = idiomaAtual();
  caixa.innerHTML = IDIOMAS_ATIVOS.map(function (l) {
    return '<button type="button" data-lang="' + l + '" aria-pressed="' +
           (l === atual) + '">' + l.toUpperCase() + '</button>';
  }).join('');
  caixa.hidden = false;

  Array.prototype.forEach.call(caixa.querySelectorAll('[data-lang]'), function (b) {
    b.addEventListener('click', function () { trocarIdioma(b.getAttribute('data-lang')); });
  });
}

function iniciarI18n() {
  traduzir(idiomaAtual());
  montarSeletor();
}

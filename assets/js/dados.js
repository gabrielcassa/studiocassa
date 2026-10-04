/* ==========================================================================
   dados.js — Studio Cassa
   Fonte única de conteúdo do site.

   PLATAFORMA CONFERIDA buscando o HTML de cada URL e procurando a assinatura
   de cada plataforma (mitiendanube/tiendanube, cdn.shopify.com, tcdn.com.br,
   iset, lojaintegrada, wp-content). Primeira conferência em 15/09/2026;
   todas as lojas abaixo com URL foram conferidas de novo em 04/10/2026.
   O campo `plataforma` é o que o endereço REALMENTE serve — não o contratado.

   COMO COMPLETAR
     capa → assets/img/portfolio/<id>-capa.jpg   RETRATO 800x1200 (2:3)
            Foto de marca — produto, loja, gente —, não print da home: o card
            do carrossel é vertical e mostra a foto inteira. Pode ser colorida;
            o site deixa em preto e branco e a cor volta no hover.
            Gerar com:  .\prepara-imagens.ps1 -Aplicar
     logo → assets/img/logos/<id>.png             (fundo transparente — idem)
     segmento, ano, resumo, desafio, entrega
     resultado → SÓ com número real. Sem número, deixa "".

   ONDE CADA PROJETO APARECE  (campo `exibicao`)
     "destaque" → carrossel da home + grade do portfolio.html.
                  Só os melhores, e só Nuvemshop. É a vitrine.
     "grade"    → só na grade de portfolio.html, com card completo.
     "outras"   → seção "Shopify e outras plataformas", na home e no
                  portfolio.html. Sem foto: nome, plataforma e link.
     "citacao"  → lista compacta "Também passaram por aqui". Hoje vazia.

   LOJAS_FEITAS, depois de PROJETOS, é outra coisa: registro de loja
   Nuvemshop já feita que NÃO aparece no site.

   TRÊS TRAVAS — um projeto só aparece se passar pelas três
     1. status:"concluido". Com "andamento", não aparece em lugar nenhum.
     2. url + capa + logo preenchidos. "outras" e "citacao" precisam só de url.
        Faltando algo, o card não existe — não há card quebrado no site.
     3. `bloqueio` vazio. Com texto, o projeto some mesmo completo: é a loja
        pronta cujo domínio ainda aponta para a plataforma antiga. Apagar o
        texto libera.
   ========================================================================== */

/* "15 lojas Nuvemshop no ar" = lojas Nuvemshop DISTINTAS, no ar e conferidas
   em 04/10/2026, em que ele trabalhou — construídas, migradas ou melhoradas.
   As 15 estão neste arquivo:
     no site (PROJETOS, concluído) .... Quero Melancia, Fazenda Giori, Colado,
                                        Livraria Shalom Adonai, Ideal Forma,
                                        EA Labs, GIORNI                     7
     em andamento (PROJETOS) .......... Café Serra Gerais — o endereço já
                                        serve Nuvemshop                     1
     só registro (LOJAS_FEITAS) ....... Casa Rigo, Zanelli, Flora, Galerie Du
                                        Parfum, VL Dicas, Aventtura X,
                                        Miscigenazo                         7
   A conta é de trabalho feito, não de vitrine: as de LOJAS_FEITAS contam
   mesmo fora do site.
   Era 13 em 15/09; subiu para 15 quando Quero Melancia e Shalom Adonai
   viraram. Quando NeuroCapsule e GA Equestre virarem, vai para 17. */
const SELO = {
  ativo:  true,
  texto:  "15 lojas Nuvemshop no ar",
  imagem: "",
  link:   ""
};

const PROJETOS = [

  /* =====================================================================
     CARROSSEL — OS MELHORES. Lista fechada por ele em 04/10/2026, nesta
     ordem. Todas conferidas no ar em Nuvemshop em 04/10/2026.
     ===================================================================== */

  /* Era migração em voo; o domínio virou para a Nuvemshop — bloqueio liberado. */
  { id:"quero-melancia", nome:"Quero Melancia", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Moda feminina", ano:"",
    url:"https://www.queromelancia.com.br/", capa:"", logo:"",
    resumo:"", desafio:"Migração vinda da Tray.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Loja inteira, confirmado por ele em 04/10/2026 — antes estava como
     Página de produto. */
  { id:"fazenda-giori", nome:"Fazenda Giori", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Flex", segmento:"Café especial", ano:"",
    url:"https://giori.farm/", capa:"", logo:"",
    resumo:"Loja completa, com melhoria de CRO e páginas de produto.", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Loja inteira, confirmado por ele em 04/10/2026 — antes estava como
     Otimização. Junta os dois registros antigos (loja + manutenção). */
  { id:"colado", nome:"Colado", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Flex", segmento:"", ano:"",
    url:"https://www.colado.art.br/", capa:"", logo:"",
    resumo:"Loja completa e contrato de manutenção do e-commerce.", desafio:"Migração vinda da Shopify.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Era migração em voo; o domínio virou para a Nuvemshop — bloqueio liberado.
     Em 15/09 o domínio ainda servia WordPress: daí o desafio. */
  { id:"shalom-adonai", nome:"Livraria Shalom Adonai", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Livraria", ano:"",
    url:"https://livrariashalomadonai.com.br/", capa:"", logo:"",
    resumo:"", desafio:"Migração vinda do WordPress.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ideal-forma", nome:"Ideal Forma", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Amazonas", segmento:"", ano:"",
    url:"https://www.idealforma.shop/", capa:"", logo:"",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* =====================================================================
     ⏳ CARROSSEL — AINDA NÃO PRONTAS. Já estão com exibicao:"destaque";
     quem segura é o status:"andamento".

     PARA ENTRAR NO CARROSSEL: trocar para status:"concluido", ter url,
     capa e logo — e apagar o `bloqueio`, onde houver.
     ===================================================================== */

  { id:"neurocapsule", nome:"NeuroCapsule", tipo:"E-commerce completo", status:"andamento", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Brasília", segmento:"Suplementos", ano:"",
    url:"https://loja.neurocapsule.com.br/", capa:"", logo:"",
    bloqueio:"domínio ainda responde WordPress (conferido em 04/10/2026) — apagar quando apontar para a Nuvemshop",
    resumo:"", desafio:"E-commerce completo mais todas as páginas de produto.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ga-equestre", nome:"GA Equestre", tipo:"E-commerce completo", status:"andamento", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Equitação", ano:"",
    url:"https://www.gaequestre.com.br/", capa:"", logo:"",
    bloqueio:"domínio ainda responde iSet (conferido em 04/10/2026) — apagar quando apontar para a Nuvemshop",
    resumo:"", desafio:"Migração vinda da iSet, com estruturação de automações.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Falta o endereço. */
  { id:"romance-enxovais", nome:"Romance Enxovais", tipo:"E-commerce completo", status:"andamento", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Cama, mesa e banho", ano:"",
    url:"", capa:"", logo:"",
    resumo:"", desafio:"Migração vinda da Octopus. Marca no mercado desde 1994.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Juntou os dois registros antigos (página de produto + otimização). O
     endereço já serve Nuvemshop; ele considera o projeto ainda não concluído.
     CONFERIR O TIPO quando fechar. */
  { id:"cafe-serra-gerais", nome:"Café Serra Gerais", tipo:"Página de produto", status:"andamento", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Café especial", ano:"",
    url:"https://serragerais.com.br/", capa:"", logo:"",
    resumo:"", desafio:"", entrega:["2 páginas de produto", "Melhorias de layout e implementações"], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Falta o endereço e a plataforma. */
  { id:"bella-caza-decor", nome:"Bella Caza Decor", tipo:"E-commerce completo", status:"andamento", exibicao:"destaque",
    plataforma:"", tema:"", segmento:"Decoração", ano:"",
    url:"", capa:"", logo:"",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Falta o endereço. */
  { id:"croche-vitoria", nome:"Crochê Vitória", tipo:"E-commerce completo", status:"andamento", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Decoração em crochê", ano:"",
    url:"", capa:"", logo:"",
    resumo:"", desafio:"Migração vinda da Yampi. Fabricante de Ibitinga desde 1987.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* =====================================================================
     SÓ NA GRADE DO PORTFOLIO.HTML — fora do carrossel.
     Lojas completas que não entraram na lista dos melhores de 04/10/2026.
     ===================================================================== */

  { id:"ea-labs", nome:"EA Labs Nutrition", tipo:"E-commerce completo", status:"concluido", exibicao:"grade",
    plataforma:"Nuvemshop", tema:"Brasília", segmento:"Suplementos", ano:"",
    url:"https://easuplementos.com/", capa:"", logo:"",
    resumo:"", desafio:"Migração vinda da Shopify.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"giorni", nome:"GIORNI", tipo:"E-commerce completo", status:"concluido", exibicao:"grade",
    plataforma:"Nuvemshop", tema:"", segmento:"", ano:"",
    url:"https://giornioficial.com.br/", capa:"", logo:"",
    resumo:"Loja Nuvemshop construída do zero.", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* =====================================================================
     SHOPIFY E OUTRAS PLATAFORMAS — seção própria, abaixo do carrossel.
     Plataforma conferida no endereço em 04/10/2026. Glaucia Goulart roda
     em Tray, não em Shopify: por isso a seção não se chama só "Shopify".
     FAOL entrou aqui por ser loja Shopify, como a VITAL.
     ===================================================================== */

  { id:"vital", nome:"VITAL", tipo:"Otimização", status:"concluido", exibicao:"outras",
    plataforma:"Shopify", tema:"", segmento:"Suplementos", ano:"",
    url:"https://bevital.com.br/", capa:"", logo:"",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"glaucia-goulart", nome:"Glaucia Goulart Bolsas", tipo:"Otimização", status:"concluido", exibicao:"outras",
    plataforma:"Tray", tema:"", segmento:"Bolsas no atacado", ano:"",
    url:"https://www.glauciagoulartbolsas.com.br/", capa:"", logo:"",
    resumo:"Implementação de layout.", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"faol-apicultura", nome:"FAOL Apicultura", tipo:"Otimização", status:"concluido", exibicao:"outras",
    plataforma:"Shopify", tema:"Glozin", segmento:"Apicultura", ano:"",
    url:"https://faolapicultura.com.br/", capa:"", logo:"",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} }

  /* Fora do site por decisão dele em 04/10/2026 — o foco é só loja Nuvemshop
     completa:
       - as lojas NUVEMSHOP desse corte foram para LOJAS_FEITAS, logo abaixo,
         como registro, sem aparecer no site;
       - as demais saíram deste arquivo: Just Leve, Numa Chocolates, ARZ Home
         Design, Toledo Reservatórios, Life NT, Luna Confecções, Atuale,
         Pátio Matosinhos, Two Beats, New Capelli, MBS Purificadores, Fraktal
         Softwares, No Glamour, Real Conforto e Dolce Affetto. Os registros
         completos estão no histórico do git (commit a6e23c2). */

];

/* ==========================================================================
   LOJAS_FEITAS — REGISTRO. NÃO APARECE NO SITE.

   Lojas Nuvemshop em que ele trabalhou e que ficam fora do portfólio, por
   decisão dele em 04/10/2026. Nenhum código do site lê esta lista — de
   propósito: ela existe como registro e para sustentar a conta do SELO.
   Todas conferidas no ar em Nuvemshop em 04/10/2026.

   Para uma loja voltar ao site, mova o registro para PROJETOS e complete o
   formato de lá (status, exibicao, capa, logo…).
   ========================================================================== */
const LOJAS_FEITAS = [
  { id:"casa-rigo",         nome:"Casa Rigo",                   tipo:"Otimização", plataforma:"Nuvemshop", tema:"",                     segmento:"",                      url:"https://casarigo.com/" },
  { id:"zanelli-coffee",    nome:"Zanelli Coffee",              tipo:"Otimização", plataforma:"Nuvemshop", tema:"",                     segmento:"Café especial",         url:"https://loja.zanellicoffee.com/" },
  { id:"flora-brinquedos",  nome:"Flora Brinquedos Educativos", tipo:"Otimização", plataforma:"Nuvemshop", tema:"",                     segmento:"Brinquedos educativos", url:"https://florabrinquedoseducativos.com.br/" },
  { id:"galerie-du-parfum", nome:"Galerie Du Parfum",           tipo:"Otimização", plataforma:"Nuvemshop", tema:"",                     segmento:"Perfumaria",            url:"https://www.galerieduparfum.com.br/" },
  { id:"vl-dicas-de-rica",  nome:"VL Dicas de Rica",            tipo:"Otimização", plataforma:"Nuvemshop", tema:"Ipanema Casa e Decor", segmento:"Decants de perfume",    url:"https://vldicasderica.lojavirtualnuvem.com.br/" },
  { id:"aventturax",        nome:"Aventtura X",                 tipo:"Otimização", plataforma:"Nuvemshop", tema:"",                     segmento:"",                      url:"https://www.aventturax.com.br/" },
  { id:"miscigenazo",       nome:"Miscigenazo",                 tipo:"Otimização", plataforma:"Nuvemshop", tema:"",                     segmento:"",                      url:"https://miscigenazo.com.br/" }
];

const DEPOIMENTOS = [
  // { nome:"", segmento:"", nota:5, texto:"", audio:"" }
];

const SERVICOS = [
  { aba:"Loja virtual", nome:"E-commerce completo",
    destaque:"Meu carro-chefe",
    dor:"Quero vender online e não sei por onde começar",
    itens:["Layout desenhado com a identidade da marca",
           "Configuração de pagamento, frete e impostos",
           "Domínio próprio e SSL ativo",
           "Organização de menus, categorias e páginas",
           "Treinamento em vídeo com acesso vitalício"],
    cta:"Quero uma loja completa" },

  { aba:"Loja virtual", nome:"Migração de plataforma",
    dor:"Minha loja está numa plataforma que me trava",
    itens:["Migração de produtos, categorias e clientes",
           "Redirecionamento das URLs antigas para não perder Google",
           "Layout refeito na plataforma nova",
           "Conferência item a item antes de virar a chave"],
    cta:"Quero migrar minha loja" },

  { aba:"Otimização", nome:"Melhoria de CRO",
    dor:"Tenho visita mas não tenho venda",
    itens:["Revisão do caminho do cliente até o carrinho",
           "Ajuste de layout, banners e blocos de confiança",
           "Correção do que quebra no celular",
           "Ganho de velocidade de carregamento"],
    cta:"Quero otimizar minha loja" },

  { aba:"Otimização", nome:"Página de produto de best seller",
    dor:"Meu produto campeão tem a mesma página de todos os outros",
    itens:["Página exclusiva para o produto que mais vende",
           "Conteúdo que responde a objeção de compra",
           "Prova social e comparativo",
           "Feita para funcionar no celular primeiro"],
    cta:"Quero uma página de produto exclusiva" },

  { aba:"Site", nome:"Landing page",
    dor:"Preciso de uma página para captar cliente",
    itens:["Uma página, seções ilimitadas",
           "Design personalizado",
           "Botão de WhatsApp e formulário",
           "SEO básico e publicação no seu domínio"],
    cta:"Quero uma landing page" }
];

const PROCESSO = [
  { n:"01", titulo:"Conversa",        texto:"A gente conversa pelo WhatsApp e eu entendo o que seu negócio precisa antes de falar de valor." },
  { n:"02", titulo:"Proposta",        texto:"Mando o escopo por escrito, com o que entra, o que não entra e o prazo." },
  { n:"03", titulo:"Briefing",        texto:"Reunião para levantar sua marca, seus produtos e seu cliente. Suas respostas guiam o projeto inteiro." },
  { n:"04", titulo:"Materiais",       texto:"Você me envia fotos, textos e logo. Quanto mais completo, mais rápido anda." },
  { n:"05", titulo:"Domínio",         texto:"O domínio é comprado por você. Eu mando as instruções e configuro o apontamento." },
  { n:"06", titulo:"Desenvolvimento", texto:"Eu construo e te mostro. Você tem 2 rodadas de revisão para ajustar." },
  { n:"07", titulo:"Entrega",         texto:"Site no ar e treinamento em vídeo para você tocar sozinho depois." }
];

/* O blog está CONSTRUÍDO e DESLIGADO (§15b). Este é o post modelo: existe
   para que o layout, o JSON-LD e o card já estejam prontos.

   PARA PUBLICAR O BLOG:
     1. tirar o <meta name="robots" content="noindex, nofollow"> de blog.html
        e de cada arquivo em blog/;
     2. descomentar o bloco marcado "BLOG:" no index.html;
     3. somar as URLs ao sitemap.xml e o link ao menu e ao rodapé.
   Nada de reescrever seção. */
const POSTS = [
  { slug:      "migrar-de-plataforma-sem-perder-o-google",
    categoria: "Migração",
    titulo:    "Migrar de plataforma sem perder o Google",
    resumo:    "O medo de todo lojista que troca de plataforma é sumir da busca. Dá para não sumir — e o trabalho é quase todo antes de virar a chave.",
    data:      "2026-09-16",
    leitura:   "3 min" }
];

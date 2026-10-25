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
            Foto de marca — produto, loja, gente —, não print da home e sem
            texto gravado: a peça da galeria é vertical e mostra a foto
            inteira, em cor. O script faz junto a <id>-mini.jpg (hoje sem
            uso: a órbita do hero é só de logos).
            Gerar com:  .\prepara-imagens.ps1 -Aplicar
     logo → assets/img/logos/<id>.png             (fundo transparente — idem)
            O site mostra todo logo como SILHUETA de uma cor: logo colorido
            com fundo próprio (adesivo, selo) vira borrão — precisa de uma
            versão de uma cor, como a da Crochê Vitória.
     logoCor → assets/img/logos/cor/<id>.png      (opcional — só a faixa
            "Marcas que já confiaram" usa) o logo na cor da marca. Sem ele, a
            faixa mostra o `logo` branco como silhueta preta: serve às marcas
            pretas e às que só têm logo branco.
     segmento, ano, resumo, desafio, entrega
     resultado → SÓ com número real. Sem número, deixa "".

   ONDE CADA PROJETO APARECE  (campo `exibicao`)
     "destaque" → galeria da home ("Loja de verdade, no ar agora."), órbita
                  do hero + grade do portfolio.html.
                  Só os melhores, e só Nuvemshop. É a vitrine.
     "grade"    → só na grade de portfolio.html, com card completo.
     "outras"   → lista "A Nuvemshop é a casa, não a única." na home e
                  "Shopify e outras plataformas" no portfolio.html. Sem foto:
                  nome, plataforma e link.
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

/* "22 lojas Nuvemshop no ar" = lojas Nuvemshop DISTINTAS, no ar e conferidas,
   em que ele trabalhou — construídas, migradas ou melhoradas.
   As 22 estão neste arquivo:
     PROJETOS, concluído .............. Empório Século XVIII, Quero Melancia,
                                        Fazenda Giori, Colado, NeuroCapsule,
                                        GA Equestre, Romance Enxovais, Café
                                        Serra Gerais, Bella Caza Decor,
                                        Crochê Vitória, Vilaz, EA Labs,
                                        GIORNI                             13
     só registro (LOJAS_FEITAS) ....... Livraria Shalom Adonai, Ideal Forma,
                                        Casa Rigo, Zanelli, Flora, Galerie
                                        Du Parfum, VL Dicas, Aventtura X,
                                        Miscigenazo                         9
   A conta é de trabalho feito, não de vitrine: as de LOJAS_FEITAS contam
   mesmo fora do site.
   Era 13 em 15/09; 15 quando Quero Melancia e Shalom Adonai viraram; 16 com
   a entrada do Empório Século XVIII em 05/10/2026; 18 quando NeuroCapsule e
   GA Equestre viraram, conferido em 22/10/2026; 21 com Vilaz, Crochê Vitória
   e Bella Caza Decor, endereços passados por ele e conferidos em 24/10/2026;
   22 com a Romance Enxovais, conferida em 25/10/2026 (a Café Serra Gerais
   já contava desde antes, como "em andamento"). */
const SELO = {
  ativo:  true,
  texto:  "22 lojas Nuvemshop no ar",
  imagem: "",
  link:   ""
};

const PROJETOS = [

  /* =====================================================================
     GALERIA DA HOME — OS MELHORES (era o carrossel), na ordem em que
     aparecem. Lista fechada por ele em 04/10/2026; em 05/10/2026 o Empório
     Século XVIII entrou em primeiro e a Ideal Forma saiu; em 22/10/2026 a
     Shalom Adonai saiu e NeuroCapsule e GA Equestre entraram; em 24 e
     25/10/2026 ele mandou a lista de 11 lojas nesta ordem, com capa e logo
     de cada uma (os logos brancos e as capas 800x1200 são dele). Todas
     conferidas no ar em Nuvemshop em 25/10/2026.
     ===================================================================== */

  /* Melhor projeto, junto com a Quero Melancia — entrou em 05/10/2026, em
     primeiro. A loja se apresenta como "Empório Século XVIII" (nome do site,
     alt do logo e og:title); o domínio é cachacaseculoxviii.com.br.
     Nuvemshop e tema Ipanema conferidos no código da página em 05/10/2026. */
  { id:"cachaca-seculo-xviii", nome:"Empório Século XVIII", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Cachaça", ano:"",
    url:"https://cachacaseculoxviii.com.br/", capa:"assets/img/portfolio/cachaca-seculo-xviii-capa.jpg", logo:"assets/img/logos/cachaca-seculo-xviii.png",
    logoCor:"assets/img/logos/cor/cachaca-seculo-xviii.png",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Era migração em voo; o domínio virou para a Nuvemshop — bloqueio liberado. */
  { id:"quero-melancia", nome:"Quero Melancia", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Moda feminina", ano:"",
    url:"https://www.queromelancia.com.br/", capa:"assets/img/portfolio/quero-melancia-capa.jpg", logo:"assets/img/logos/quero-melancia.png",
    logoCor:"assets/img/logos/cor/quero-melancia.png",
    resumo:"", desafio:"Migração vinda da Tray.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Loja inteira, confirmado por ele em 04/10/2026 — antes estava como
     Página de produto. */
  { id:"fazenda-giori", nome:"Fazenda Giori", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Flex", segmento:"Café especial", ano:"",
    url:"https://giori.farm/", capa:"assets/img/portfolio/fazenda-giori-capa.jpg", logo:"assets/img/logos/fazenda-giori.png",
    resumo:"Loja completa, com melhoria de CRO e páginas de produto.", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Loja inteira, confirmado por ele em 04/10/2026 — antes estava como
     Otimização. Junta os dois registros antigos (loja + manutenção). */
  { id:"colado", nome:"Colado", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Flex", segmento:"", ano:"",
    url:"https://www.colado.art.br/", capa:"assets/img/portfolio/colado-capa.jpg", logo:"assets/img/logos/colado.png",
    resumo:"Loja completa e contrato de manutenção do e-commerce.", desafio:"Migração vinda da Shopify.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Migração que virou: em 22/10/2026 os DNS públicos (Google, Cloudflare)
     já mandam o domínio para a Nuvemshop — bloqueio liberado. Alguns
     provedores ainda guardavam o endereço antigo do WordPress em cache.
     Tema conferido direto no servidor da Nuvemshop: Ipanema (estava como
     Brasília). Capa e logo chegaram em 25/10/2026. */
  { id:"neurocapsule", nome:"NeuroCapsule", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Suplementos", ano:"",
    url:"https://loja.neurocapsule.com.br/", capa:"assets/img/portfolio/neurocapsule-capa.jpg", logo:"assets/img/logos/neurocapsule.png",
    logoCor:"assets/img/logos/cor/neurocapsule.png",
    resumo:"", desafio:"E-commerce completo mais todas as páginas de produto.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Migração que virou em 22/10/2026 — bloqueio liberado. O endereço passou
     a ser o domínio sem "www": é o principal configurado na Nuvemshop, e o
     "www" ainda caía no iSet antigo em parte dos provedores. Capa e logo
     chegaram em 25/10/2026. */
  { id:"ga-equestre", nome:"GA Equestre", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Equitação", ano:"",
    url:"https://gaequestre.com.br/", capa:"assets/img/portfolio/ga-equestre-capa.jpg", logo:"assets/img/logos/ga-equestre.png",
    resumo:"", desafio:"Migração vinda da iSet, com estruturação de automações.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Esperava o endereço desde 04/10/2026; passado por ele em 25/10/2026.
     Nuvemshop e tema Ipanema conferidos no código da página no mesmo dia. */
  { id:"romance-enxovais", nome:"Romance Enxovais", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Cama, mesa e banho", ano:"",
    url:"https://romanceenxovais.com.br/", capa:"assets/img/portfolio/romance-enxovais-capa.jpg", logo:"assets/img/logos/romance-enxovais.png",
    resumo:"", desafio:"Migração vinda da Octopus. Marca no mercado desde 1994.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Juntou os dois registros antigos (página de produto + otimização).
     Entrou na galeria em 25/10/2026, na lista que ele mandou. Era
     "Página de produto"; virou loja completa, confirmado por ele em
     25/10/2026: o e-commerce foi refeito, com troca de tema e o layout
     todo melhorado. A capa dele passa de 200 KB: sai com -Qualidade 70
     (168 KB). */
  { id:"cafe-serra-gerais", nome:"Café Serra Gerais", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Café especial", ano:"",
    url:"https://serragerais.com.br/", capa:"assets/img/portfolio/cafe-serra-gerais-capa.jpg", logo:"assets/img/logos/cafe-serra-gerais.png",
    resumo:"E-commerce novo, com troca de tema e o layout todo refeito.", desafio:"", entrega:["2 páginas de produto", "Melhorias de layout e implementações"], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Esperava endereço e plataforma desde 04/10/2026; endereço passado por
     ele em 24/10/2026. Nuvemshop e tema Ipanema conferidos no código da
     página no mesmo dia. */
  { id:"bella-caza-decor", nome:"Bella Caza Decor", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Decoração", ano:"",
    url:"https://bellacazadecor.com.br/", capa:"assets/img/portfolio/bella-caza-decor-capa.jpg", logo:"assets/img/logos/bella-caza-decor.png",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Esperava o endereço desde 04/10/2026; passado por ele em 24/10/2026.
     Nuvemshop e tema Ipanema conferidos no código da página no mesmo dia.
     Logo: a versão de uma cor feita do original em 24/10/2026 — o adesivo
     amarelo vira borrão na silhueta do site; quando ele mandar um logo
     branco, é só trocar. A capa dele cabe no teto na qualidade padrão. */
  { id:"croche-vitoria", nome:"Crochê Vitória", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Decoração em crochê", ano:"",
    url:"https://www.crochevitoria.com.br/", capa:"assets/img/portfolio/croche-vitoria-capa.jpg", logo:"assets/img/logos/croche-vitoria.png",
    logoCor:"assets/img/logos/cor/croche-vitoria.png",
    resumo:"", desafio:"Migração vinda da Yampi. Fabricante de Ibitinga desde 1987.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Endereço passado por ele em 24/10/2026. Nuvemshop e tema Amazonas
     conferidos no código da página no mesmo dia. Loja completa, confirmado
     por ele em 25/10/2026. */
  { id:"vilaz", nome:"Vilaz", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Amazonas", segmento:"Moda feminina", ano:"",
    url:"https://www.usevilaz.com.br/", capa:"assets/img/portfolio/vilaz-capa.jpg", logo:"assets/img/logos/vilaz.png",
    logoCor:"assets/img/logos/cor/vilaz.png",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Saíram da vitrine (então carrossel) por decisão dele e foram para
     LOJAS_FEITAS, como registro: Ideal Forma em 05/10/2026 e Livraria
     Shalom Adonai em 22/10/2026. */

  /* =====================================================================
     ⏳ GALERIA — AINDA NÃO PRONTAS. Ficam aqui com exibicao:"destaque" e
     status:"andamento" até fechar. Hoje vazia: as que esperavam (Romance
     Enxovais, Café Serra Gerais, Bella Caza Decor e Crochê Vitória)
     entraram em 24 e 25/10/2026.

     PARA ENTRAR NA GALERIA: trocar para status:"concluido", ter url,
     capa e logo — e apagar o `bloqueio`, onde houver.
     ===================================================================== */

  /* =====================================================================
     SÓ NA GRADE DO PORTFOLIO.HTML — fora da galeria da home.
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
     SHOPIFY E OUTRAS PLATAFORMAS — lista própria, abaixo do "Ver todos os
     projetos". Plataforma conferida no endereço em 04/10/2026. Glaucia
     Goulart roda em Tray, não em Shopify: por isso a seção não se chama só
     "Shopify". FAOL entrou aqui por ser loja Shopify, como a VITAL.
     Em 25/10/2026 entraram, na frente, os sites completos que ele fez fora
     da Nuvemshop, na ordem em que ele mandou; plataforma conferida no
     código de cada página no mesmo dia.
     ===================================================================== */

  /* Loja de artigos para cachorro e gato, no Reino Unido. */
  { id:"the-hound-emporium", nome:"The Hound Emporium", tipo:"E-commerce completo", status:"concluido", exibicao:"outras",
    plataforma:"Wix", tema:"", segmento:"Pet shop", ano:"",
    url:"https://www.thehoundemporium.com/", capa:"", logo:"",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Voltou em 25/10/2026 como site completo (antes estava como otimização,
     sem endereço). Enxovais e quarto de bebê. */
  { id:"dolce-affetto", nome:"Dolce Affetto", tipo:"E-commerce completo", status:"concluido", exibicao:"outras",
    plataforma:"Tray", tema:"", segmento:"Enxoval de bebê", ano:"",
    url:"https://www.dolceaffetto.com.br/", capa:"", logo:"",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Voltou em 25/10/2026 como site completo (antes estava como landing
     page). O endereço abre como "Toledo Reservatórios Metálicos". */
  { id:"toledo-reservatorios", nome:"Toledo Reservatórios", tipo:"Site completo", status:"concluido", exibicao:"outras",
    plataforma:"WordPress", tema:"", segmento:"Reservatórios metálicos", ano:"",
    url:"https://xn--toledoreservatrios-31b.com.br/", capa:"", logo:"",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Voltou em 25/10/2026 como site completo (antes estava como otimização). */
  { id:"atuale-odontologia", nome:"Atuale Odontologia Integrada", tipo:"Site completo", status:"concluido", exibicao:"outras",
    plataforma:"WordPress", tema:"", segmento:"Odontologia", ano:"",
    url:"https://atualeodontologiaintegrada.com.br/", capa:"", logo:"",
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

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
         Design, Life NT, Luna Confecções, Pátio Matosinhos, Two Beats, New
         Capelli, MBS Purificadores, Fraktal Softwares, No Glamour e Real
         Conforto. Os registros completos estão no histórico do git (commit
         a6e23c2). Toledo Reservatórios, Atuale e Dolce Affetto, que também
         tinham saído, voltaram em 25/10/2026 como sites completos, lá em
         cima. */

];

/* ==========================================================================
   LOJAS_FEITAS — REGISTRO. NÃO APARECE NO SITE.

   Lojas Nuvemshop em que ele trabalhou e que ficam fora do portfólio, por
   decisão dele em 04/10, 05/10 e 22/10/2026. Nenhum código do site lê esta lista — de
   propósito: ela existe como registro e para sustentar a conta do SELO.
   Todas conferidas no ar em Nuvemshop em 04/10/2026.

   Para uma loja voltar ao site, mova o registro para PROJETOS e complete o
   formato de lá (status, exibicao, capa, logo…).
   ========================================================================== */
const LOJAS_FEITAS = [
  { id:"shalom-adonai",     nome:"Livraria Shalom Adonai",      tipo:"E-commerce completo", plataforma:"Nuvemshop", tema:"Ipanema",  segmento:"Livraria",                      url:"https://livrariashalomadonai.com.br/" },
  { id:"ideal-forma",      nome:"Ideal Forma",                 tipo:"E-commerce completo", plataforma:"Nuvemshop", tema:"Amazonas", segmento:"Moda fitness e praia feminina", url:"https://www.idealforma.shop/" },
  { id:"casa-rigo",        nome:"Casa Rigo",                   tipo:"Otimização", plataforma:"Nuvemshop", tema:"",                     segmento:"",                      url:"https://casarigo.com/" },
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

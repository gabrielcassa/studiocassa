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
            texto gravado: o card do portfólio é vertical e mostra a foto
            inteira, em cor. O script faz junto a <id>-mini.jpg (hoje sem
            uso: a órbita do hero é só de logos).
            Gerar com:  .\prepara-imagens.ps1 -Aplicar
     capaGaleria → assets/img/portfolio/<id>-cartao.png   (opcional) o cartão
            desenhado da marca, 600x900 (2:3). HOJE SEM USO: desde 03/11/2026
            a galeria "Loja de verdade" usa como capa a própria loja (a
            prévia da home, no notebook e no celular). O campo e os arquivos
            ficam, caso a galeria volte aos cartões.
     previa → (opcional, e o normal) a loja congelada, que rola no celular e na
            janela do computador, no modal e no projeto.html. Quem escreve é o
            prepara-imagens.ps1 -Aplicar, a partir das capturas do
            captura-previa.js; não se edita à mão:
              previa:{data:"2026-10-30",paginas:[{nome:"Início",arquivo:"inicio",
                      url:"/",celular:5,computador:4}]}
            celular e computador dizem em quantas partes a página foi fatiada
            (assets/img/previa/<id>/inicio-celular-1.jpg…).
            REGRA: a prévia é a foto da loja como foi entregue. Só muda com o
            aviso de que houve alteração nela; sozinha, nunca. Ver "A prévia" no
            README.
     semLink:true → (opcional) a loja saiu do ar, ou mudou tanto que não
            representa mais o trabalho: some todo botão que leva até ela, e fica
            a prévia. Tira do site um "Ver loja no ar" morto ou enganoso.
     aviso → (opcional, com semLink) a frase que explica, logo acima da prévia:
            é o que se lê primeiro ao abrir o modal.
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
                  Só os melhores, e só Nuvemshop. É a vitrine. Loja que encerrou
                  continua aqui: o card fica, e o aviso no modal explica.
     "grade"    → só na grade de portfolio.html, com card completo.
     "outras"   → lista "A Nuvemshop é a casa, não a única." na home e
                  "Shopify e outras plataformas" no portfolio.html. Sem foto:
                  nome, plataforma e o link da loja; com prévia, a linha abre o
                  projeto aqui dentro.
                  Com emDestaque:true (e a home salva no celular), o projeto
                  sai da lista da home e vira o cartão de destaque embaixo
                  do título, com a home dele rolando num celular. Vale o
                  primeiro marcado. No portfolio.html ele segue na lista.
     "citacao"  → lista compacta "Também passaram por aqui". Hoje vazia.
     "produto"  → seção "Um produto. Uma página só dele.", na home e no
                  portfolio.html: um celular por loja, com a primeira página
                  rolando sozinha; o clique abre o modal com as outras. Precisa
                  só do `previa`: não tem card nem página de caso, e não mexe na
                  conta do selo. O id leva o prefixo ppp-, porque a mesma loja
                  pode estar também na galeria ou em LOJAS_FEITAS.

   LOJAS_FEITAS, depois de PROJETOS, é outra coisa: registro de loja
   Nuvemshop já feita que NÃO aparece no site.

   TRÊS TRAVAS — um projeto só aparece se passar pelas três
     1. status:"concluido". Com "andamento", não aparece em lugar nenhum.
     2. url + capa + logo preenchidos. "outras" e "citacao" precisam só de url.
        Sem url, vale a prévia: loja que saiu do ar não some do site.
        Faltando algo, o card não existe — não há card quebrado no site.
     3. `bloqueio` vazio. Com texto, o projeto some mesmo completo: é a loja
        pronta cujo domínio ainda aponta para a plataforma antiga. Apagar o
        texto libera.
   ========================================================================== */

/* "21 lojas Nuvemshop no ar" = lojas Nuvemshop DISTINTAS, no ar e conferidas,
   em que ele trabalhou — construídas, migradas ou melhoradas.
   As 21 estão neste arquivo:
     PROJETOS, concluído .............. Empório Século XVIII, Quero Melancia,
                                        Fazenda Giori, NeuroCapsule,
                                        GA Equestre, Romance Enxovais, Café
                                        Serra Gerais, Bella Caza Decor,
                                        Crochê Vitória, Vilaz, EA Labs,
                                        GIORNI                             12
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
   já contava desde antes, como "em andamento"); 21 sem a Colado, que encerra as
   vendas em poucos dias (aviso de 30/10/2026): ela saiu da conta antes de
   fechar, porque o selo diz "no ar". */
const SELO = {
  ativo:  true,
  texto:  "21 lojas Nuvemshop no ar",
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
    url:"https://cachacaseculoxviii.com.br/", capa:"assets/img/portfolio/cachaca-seculo-xviii-capa.jpg", capaGaleria:"assets/img/portfolio/cachaca-seculo-xviii-cartao.png", logo:"assets/img/logos/cachaca-seculo-xviii.png",
    logoCor:"assets/img/logos/cor/cachaca-seculo-xviii.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:6,computador:3}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Era migração em voo; o domínio virou para a Nuvemshop — bloqueio liberado. */
  { id:"quero-melancia", nome:"Quero Melancia", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Moda feminina", ano:"",
    url:"https://www.queromelancia.com.br/", capa:"assets/img/portfolio/quero-melancia-capa.jpg", capaGaleria:"assets/img/portfolio/quero-melancia-cartao.png", logo:"assets/img/logos/quero-melancia.png",
    logoCor:"assets/img/logos/cor/quero-melancia.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:13,computador:8}]},
    resumo:"", desafio:"Migração vinda da Tray.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Loja inteira, confirmado por ele em 04/10/2026 — antes estava como
     Página de produto. */
  { id:"fazenda-giori", nome:"Fazenda Giori", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Flex", segmento:"Café especial", ano:"",
    url:"https://giori.farm/", capa:"assets/img/portfolio/fazenda-giori-capa.jpg", capaGaleria:"assets/img/portfolio/fazenda-giori-cartao.png", logo:"assets/img/logos/fazenda-giori.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:4,computador:3}]},
    resumo:"Loja completa, com melhoria de CRO e páginas de produto.", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Loja inteira, confirmado por ele em 04/10/2026 — antes estava como
     Otimização. Junta os dois registros antigos (loja + manutenção).
     A marca encerra as vendas em poucos dias, depois de uma queima de estoque.
     Pedido de 30/10/2026: o projeto não pode sair do site. Por isso a
     prévia, a versão limpa da captura de 31/10 (sem a campanha de despedida);
     a real está em _previas/colado/2026-10-31/. Pedido de 31/10/2026: o card
     continua na galeria da home, mesmo com o título "no ar agora", e quem abre
     lê o aviso, sem link para a loja. */
  { id:"colado", nome:"Colado", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque", semLink:true,
    aviso:"A loja finalizou as operações. Esta prévia mostra como ela estava no ar.",
    plataforma:"Nuvemshop", tema:"Flex", segmento:"", ano:"",
    url:"https://www.colado.art.br/", capa:"assets/img/portfolio/colado-capa.jpg", capaGaleria:"assets/img/portfolio/colado-cartao.png", logo:"assets/img/logos/colado.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:3,computador:3},{nome:"Lambe-lambe",arquivo:"lambe-lambe",url:"/produtos/kit-lambe-lambe-fragmentos-esmeralda-colagem-decorativo-estiloso-arte-brasileira/",celular:4,computador:2},{nome:"Quadro",arquivo:"quadro",url:"/produtos/quadro-a3-carranca/",celular:4,computador:2},{nome:"Sobre",arquivo:"sobre",url:"/sobre-a-colado/",celular:3,computador:1},{nome:"Como aplicar",arquivo:"como-aplicar",url:"/como-aplicar/",celular:2,computador:1}]},
    resumo:"Loja completa e contrato de manutenção do e-commerce.", desafio:"Migração vinda da Shopify.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Migração que virou: em 22/10/2026 os DNS públicos (Google, Cloudflare)
     já mandam o domínio para a Nuvemshop — bloqueio liberado. Alguns
     provedores ainda guardavam o endereço antigo do WordPress em cache.
     Tema conferido direto no servidor da Nuvemshop: Ipanema (estava como
     Brasília). Capa e logo chegaram em 25/10/2026. */
  { id:"neurocapsule", nome:"NeuroCapsule", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Suplementos", ano:"",
    url:"https://loja.neurocapsule.com.br/", capa:"assets/img/portfolio/neurocapsule-capa.jpg", capaGaleria:"assets/img/portfolio/neurocapsule-cartao.png", logo:"assets/img/logos/neurocapsule.png",
    logoCor:"assets/img/logos/cor/neurocapsule.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:4,computador:3}]},
    resumo:"", desafio:"E-commerce completo mais todas as páginas de produto.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Migração que virou em 22/10/2026 — bloqueio liberado. O endereço passou
     a ser o domínio sem "www": é o principal configurado na Nuvemshop, e o
     "www" ainda caía no iSet antigo em parte dos provedores. Capa e logo
     chegaram em 25/10/2026. */
  { id:"ga-equestre", nome:"GA Equestre", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Equitação", ano:"",
    url:"https://gaequestre.com.br/", capa:"assets/img/portfolio/ga-equestre-capa.jpg", capaGaleria:"assets/img/portfolio/ga-equestre-cartao.png", logo:"assets/img/logos/ga-equestre.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:5,computador:3}]},
    resumo:"", desafio:"Migração vinda da iSet, com estruturação de automações.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Esperava o endereço desde 04/10/2026; passado por ele em 25/10/2026.
     Nuvemshop e tema Ipanema conferidos no código da página no mesmo dia. */
  { id:"romance-enxovais", nome:"Romance Enxovais", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Cama, mesa e banho", ano:"",
    url:"https://romanceenxovais.com.br/", capa:"assets/img/portfolio/romance-enxovais-capa.jpg", capaGaleria:"assets/img/portfolio/romance-enxovais-cartao.png", logo:"assets/img/logos/romance-enxovais.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:6,computador:4}]},
    resumo:"", desafio:"Migração vinda da Octopus. Marca no mercado desde 1994.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Juntou os dois registros antigos (página de produto + otimização).
     Entrou na galeria em 25/10/2026, na lista que ele mandou. Era
     "Página de produto"; virou loja completa, confirmado por ele em
     25/10/2026: o e-commerce foi refeito, com troca de tema e o layout
     todo melhorado. A capa dele passa de 200 KB: sai com -Qualidade 70
     (168 KB). */
  { id:"cafe-serra-gerais", nome:"Café Serra Gerais", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Café especial", ano:"",
    url:"https://serragerais.com.br/", capa:"assets/img/portfolio/cafe-serra-gerais-capa.jpg", capaGaleria:"assets/img/portfolio/cafe-serra-gerais-cartao.png", logo:"assets/img/logos/cafe-serra-gerais.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:5,computador:3}]},
    resumo:"E-commerce novo, com troca de tema e o layout todo refeito.", desafio:"", entrega:["2 páginas de produto", "Melhorias de layout e implementações"], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Esperava endereço e plataforma desde 04/10/2026; endereço passado por
     ele em 24/10/2026. Nuvemshop e tema Ipanema conferidos no código da
     página no mesmo dia. */
  { id:"bella-caza-decor", nome:"Bella Caza Decor", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Decoração", ano:"",
    url:"https://bellacazadecor.com.br/", capa:"assets/img/portfolio/bella-caza-decor-capa.jpg", capaGaleria:"assets/img/portfolio/bella-caza-decor-cartao.png", logo:"assets/img/logos/bella-caza-decor.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:5,computador:3}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Esperava o endereço desde 04/10/2026; passado por ele em 24/10/2026.
     Nuvemshop e tema Ipanema conferidos no código da página no mesmo dia.
     Logo: a versão de uma cor feita do original em 24/10/2026 — o adesivo
     amarelo vira borrão na silhueta do site; quando ele mandar um logo
     branco, é só trocar. A capa dele cabe no teto na qualidade padrão. */
  { id:"croche-vitoria", nome:"Crochê Vitória", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Decoração em crochê", ano:"",
    url:"https://www.crochevitoria.com.br/", capa:"assets/img/portfolio/croche-vitoria-capa.jpg", capaGaleria:"assets/img/portfolio/croche-vitoria-cartao.jpg", logo:"assets/img/logos/croche-vitoria.png",
    logoCor:"assets/img/logos/cor/croche-vitoria.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:5,computador:3}]},
    resumo:"", desafio:"Migração vinda da Yampi. Fabricante de Ibitinga desde 1987.", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Endereço passado por ele em 24/10/2026. Nuvemshop e tema Amazonas
     conferidos no código da página no mesmo dia. Loja completa, confirmado
     por ele em 25/10/2026. */
  { id:"vilaz", nome:"Vilaz", tipo:"E-commerce completo", status:"concluido", exibicao:"destaque",
    plataforma:"Nuvemshop", tema:"Amazonas", segmento:"Moda feminina", ano:"",
    url:"https://www.usevilaz.com.br/", capa:"assets/img/portfolio/vilaz-capa.jpg", capaGaleria:"assets/img/portfolio/vilaz-cartao.png", logo:"assets/img/logos/vilaz.png",
    logoCor:"assets/img/logos/cor/vilaz.png",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:6,computador:3}]},
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
     Sem prévia, por decisão de 31/10/2026.
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
     projetos". Plataforma conferida no endereço em 04/10/2026. Dolce Affetto
     roda em Tray, não em Shopify: por isso a seção não se chama só
     "Shopify". FAOL entrou aqui por ser loja Shopify, como a VITAL.
     Em 25/10/2026 entraram, na frente, os sites completos que ele fez fora
     da Nuvemshop, na ordem em que ele mandou; plataforma conferida no
     código de cada página no mesmo dia.
     ===================================================================== */

  /* Loja de artigos para cachorro e gato, no Reino Unido. */
  { id:"the-hound-emporium", nome:"The Hound Emporium", tipo:"E-commerce completo", status:"concluido", exibicao:"outras",
    plataforma:"Wix", tema:"", segmento:"Pet shop", ano:"",
    url:"https://www.thehoundemporium.com/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:5,computador:2}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Voltou em 25/10/2026 como site completo (antes estava como otimização,
     sem endereço). Enxovais e quarto de bebê. */
  { id:"dolce-affetto", nome:"Dolce Affetto", tipo:"E-commerce completo", status:"concluido", exibicao:"outras",
    plataforma:"Tray", tema:"", segmento:"Enxoval de bebê", ano:"",
    url:"https://www.dolceaffetto.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:5,computador:3}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Voltou em 25/10/2026 como site completo (antes estava como otimização). */
  { id:"atuale-odontologia", nome:"Atuale Odontologia Integrada", tipo:"Site completo", status:"concluido", exibicao:"outras",
    plataforma:"WordPress", tema:"", segmento:"Odontologia", ano:"",
    url:"https://atualeodontologiaintegrada.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:4,computador:2}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Em destaque na lista da home, pedido dele em 27/10/2026: cartão com a
     home da loja rolando num celular, embaixo do título da seção (Shopify,
     tema "Speed"). Home recapturada em 28/10/2026, já com a Black Friday,
     no primeiro slide do carrossel do topo. Projeto ativo: a Black Friday é
     ajuste do próprio estúdio (confirmado em 31/10/2026), não alteração do
     cliente. */
  { id:"vital", nome:"VITAL", tipo:"Otimização", status:"concluido", exibicao:"outras", emDestaque:true,
    plataforma:"Shopify", tema:"", segmento:"Suplementos", ano:"",
    url:"https://bevital.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:7,computador:4}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* A prévia no computador passa do teto de 350 KB por parte: sai com
     -QualidadeCelular 65 (338 KB). */
  { id:"faol-apicultura", nome:"FAOL Apicultura", tipo:"Otimização", status:"concluido", exibicao:"outras",
    plataforma:"Shopify", tema:"Glozin", segmento:"Apicultura", ano:"",
    url:"https://faolapicultura.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Início",arquivo:"inicio",url:"/",celular:5,computador:3}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* =====================================================================
     PÁGINAS DE PRODUTO — pedido em 31/10/2026: uma seção só para as
     páginas personalizadas, feitas para converter o produto herói. Um celular
     por loja, nesta ordem; dentro de cada uma, as páginas na ordem do `previa`.
     Links e plataformas conferidos no ar em 31/10/2026.
     Três lojas entram com a linha inteira, não com o catálogo: no Empório,
     todas as cachaças (kits com taça e copo inclusive; copos, taças, doce e
     queijos não); na Fazenda Giori, todos os cafés e chás (xícaras e roupas
     não); na NeuroCapsule, tudo menos os 2 livros e os 2 kits de sachê.
     Na Zanelli, o Kit Mantiqueira da lista recebida dá 404: não entrou.
     ===================================================================== */
  { id:"ppp-cachaca", nome:"Empório Século XVIII", tipo:"Páginas de produto", status:"concluido", exibicao:"produto",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Cachaça", ano:"",
    url:"https://cachacaseculoxviii.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Rótulo Azul 700ml",arquivo:"rotulo-azul-700ml",url:"/produtos/seculo-xviii-rotulo-azul/",celular:8,computador:4},{nome:"Rótulo Vermelho 700ml",arquivo:"rotulo-vermelho-700ml",url:"/produtos/seculo-xviii-rotulo-vermelho/",celular:9,computador:5},{nome:"Rótulo Azul 200ml",arquivo:"rotulo-azul-200ml",url:"/produtos/seculo-xviii-rotulo-azul-200ml-8fkq7/",celular:8,computador:4},{nome:"Rótulo Vermelho 200ml",arquivo:"rotulo-vermelho-200ml",url:"/produtos/seculo-xviii-rotulo-vermelho-200ml-zmos2/",celular:9,computador:5},{nome:"Rótulo Azul 50ml",arquivo:"rotulo-azul-50ml",url:"/produtos/seculo-xviii-rotulo-azul-50ml-1smm4/",celular:8,computador:4},{nome:"Rótulo Vermelho 50ml",arquivo:"rotulo-vermelho-50ml",url:"/produtos/seculo-xviii-rotulo-vermelha-50ml-1iczz/",celular:9,computador:5},{nome:"Rótulo Azul 200ml com taça",arquivo:"rotulo-azul-200ml-com-taca",url:"/produtos/seculo-xviii-rotulo-azul-1-taca-4esi7/",celular:8,computador:4},{nome:"Kit Azul 700ml e 2 taças",arquivo:"kit-azul-700ml-e-2-tacas",url:"/produtos/kit-seculo-xviii-rotulo-vermelho-700ml-2-tacas-1p9ct/",celular:8,computador:4},{nome:"Kit Azul 700ml e 4 copos",arquivo:"kit-azul-700ml-e-4-copos",url:"/produtos/kit-seculo-xviii-rotulo-azul-700ml-4-copos-1qomy/",celular:8,computador:4},{nome:"Kit Vermelho 700ml e 2 taças",arquivo:"kit-vermelho-700ml-e-2-tacas",url:"/produtos/kit-seculo-xviii-rotulo-vermelho-700ml-2-tacas-14b6b/",celular:9,computador:4},{nome:"Kit Vermelho 700ml e 4 copos",arquivo:"kit-vermelho-700ml-e-4-copos",url:"/produtos/kit-seculo-xviii-rotulo-vermelho-700ml-4-copos-1onve/",celular:9,computador:4},{nome:"Kit Vermelho 200ml e 2 copos",arquivo:"kit-vermelho-200ml-e-2-copos",url:"/produtos/kit-seculo-xviii-rotulo-vermelho-200ml-2-copos-aad7w/",celular:9,computador:5},{nome:"Kit Vermelho 50ml e copo",arquivo:"kit-vermelho-50ml-e-copo",url:"/produtos/kit-seculo-xviii-rotulo-vermelho-50ml-1-copo-uto2q/",celular:9,computador:5},{nome:"Santo Grau Coronel Xavier Chaves",arquivo:"santo-grau-coronel-xavier-chaves",url:"/produtos/santo-grau-coronel-xavier-chaves/",celular:3,computador:2}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ppp-brizoe", nome:"Brizoe Store", tipo:"Páginas de produto", status:"concluido", exibicao:"produto",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Moda feminina", ano:"",
    url:"https://brizoe.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Blazer Blair",arquivo:"blazer-blair",url:"/produtos/blazer-feminino-alfaiataria-transpassado-blair/",celular:6,computador:4},{nome:"Camisa Laura",arquivo:"camisa-laura",url:"/produtos/camisa-feminina-100-algodao-laura/",celular:6,computador:3},{nome:"Blusa Serena",arquivo:"blusa-serena",url:"/produtos/blusa-canelada-feminina-serena/",celular:6,computador:3},{nome:"Conjunto Zoe",arquivo:"conjunto-zoe",url:"/produtos/conjunto-feminino-zoe-viscose-pedras/",celular:6,computador:3}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ppp-neurocapsule", nome:"NeuroCapsule", tipo:"Páginas de produto", status:"concluido", exibicao:"produto",
    plataforma:"Nuvemshop", tema:"Ipanema", segmento:"Suplementos", ano:"",
    url:"https://loja.neurocapsule.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Kit Cérebro Blindado",arquivo:"kit-cerebro-blindado",url:"/produtos/kit-cerebro-blindado/",celular:12,computador:7},{nome:"Kit Memória",arquivo:"kit-memoria",url:"/produtos/kit-memoria/",celular:12,computador:7},{nome:"Kit Memória + Clareza Mental",arquivo:"kit-memoria-clareza-mental",url:"/produtos/kit-memoria-clareza-mental/",celular:11,computador:7},{nome:"Kit Enxaqueca",arquivo:"kit-enxaqueca",url:"/produtos/kit-enxaqueca/",celular:10,computador:6},{nome:"Kit Enxaqueca + Queda Capilar",arquivo:"kit-enxaqueca-queda-capilar",url:"/produtos/kit-enxaqueca-queda-capilar/",celular:11,computador:7},{nome:"Kit Enxaqueca + Falta de Memória",arquivo:"kit-enxaqueca-falta-de-memoria",url:"/produtos/kit-enxaqueca-memoria/",celular:13,computador:7},{nome:"Kit Queda Capilar + Fadiga + Enxaqueca",arquivo:"kit-queda-capilar-fadiga-enxaqueca",url:"/produtos/kit-queda-capilar-fadiga-enxaqueca/",celular:13,computador:7},{nome:"Kit Reset Feminino",arquivo:"kit-reset-feminino",url:"/produtos/reset_feminino_oferta/",celular:13,computador:7},{nome:"Fog Mind",arquivo:"fog-mind",url:"/produtos/fog-mind/",celular:9,computador:6},{nome:"TreoMind",arquivo:"treomind",url:"/produtos/treomind/",celular:9,computador:5},{nome:"Creat Memory",arquivo:"creat-memory",url:"/produtos/creat-memory/",celular:9,computador:5},{nome:"Femme Q10 Power",arquivo:"femme-q10-power",url:"/produtos/femme-q10-power/",celular:9,computador:6},{nome:"Enxaquecon 10ml",arquivo:"enxaquecon-10ml",url:"/produtos/enxaquecon/",celular:9,computador:6},{nome:"Enxaquecon 5ml",arquivo:"enxaquecon-5ml",url:"/produtos/enxaquecon-5ml/",celular:9,computador:6},{nome:"Juice Full Protein 900g",arquivo:"juice-full-protein-900g",url:"/produtos/juice-full-protein-900g/",celular:10,computador:6},{nome:"Explosion Pré-Workout 180g",arquivo:"explosion-pre-workout-180g",url:"/produtos/explosion-pre-workout/",celular:9,computador:6}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ppp-real-conforto", nome:"Real Conforto", tipo:"Páginas de produto", status:"concluido", exibicao:"produto",
    plataforma:"Nuvemshop", tema:"Amazonas", segmento:"Enxoval de bebê", ano:"",
    url:"https://www.realconforto.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Kit Cogumelo e Borboletas",arquivo:"kit-2-toalhas-estampa-1",url:"/produtos/kit-2-toalhas-de-banho-bebe-soft-tres-camadas-tecido-fralda-capuz-grande-105x85cm-100-algodao-11ff7/",celular:8,computador:5},{nome:"Kit Animais e Ursinho",arquivo:"kit-2-toalhas-estampa-2",url:"/produtos/kit-2-toalhas-de-banho-bebe-soft-tres-camadas-tecido-fralda-capuz-grande-105x85cm-100-algodao-ybrqp/",celular:8,computador:5},{nome:"Kit Esporte e Dino",arquivo:"kit-2-toalhas-estampa-3",url:"/produtos/kit-2-toalhas-de-banho-bebe-soft-tres-camadas-tecido-fralda-capuz-grande-105x85cm-100-algodao-17s5p/",celular:8,computador:5},{nome:"Soft Dengo Girafinha",arquivo:"soft-dengo-girafinha",url:"/produtos/toalha-de-banho-soft-dengo-85x85cm-para-bebe-com-capuz-girafinha-neutra-unissex-100-algodao-minasrey/",celular:9,computador:5},{nome:"Papi Baby Cogumelo",arquivo:"papi-baby-cogumelo",url:"/produtos/toalhao-de-banho-soft-premium-papi-baby-com-capuz-estampado-105m-x-85cm-100-algodao-encanto-cogumelo/",celular:8,computador:5},{nome:"Papi Baby Esporte Xadrez",arquivo:"papi-baby-esporte-xadrez",url:"/produtos/toalhao-de-banho-soft-premium-papi-baby-com-capuz-estampado-105m-x-85cm-100-algodao-esporte-xadrez/",celular:8,computador:5}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ppp-fazenda-giori", nome:"Fazenda Giori", tipo:"Páginas de produto", status:"concluido", exibicao:"produto",
    plataforma:"Nuvemshop", tema:"Flex", segmento:"Café especial", ano:"",
    url:"https://giori.farm/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Café Grãos 500g",arquivo:"cafe-graos-500g",url:"/produtos/cafe-biogiori-graos-500g/",celular:7,computador:4},{nome:"Café Grãos 250g",arquivo:"cafe-graos-250g",url:"/produtos/cafe-biogiori-graos-250g/",celular:7,computador:4},{nome:"Café Grãos 500g, lata",arquivo:"cafe-graos-500g-lata",url:"/produtos/cafe-biogiori-graos-500g-lata/",celular:7,computador:4},{nome:"Torrado e Moído 500g",arquivo:"torrado-e-moido-500g",url:"/produtos/cafe-robusta-especial-organico-e-biodinamico-torrado-e-moido-500g1/",celular:7,computador:4},{nome:"Torrado e Moído 250g",arquivo:"torrado-e-moido-250g",url:"/produtos/cafe-biogiori-torrado-e-moido-250g/",celular:7,computador:4},{nome:"BioCoffee Box 250g",arquivo:"biocoffee-box-250g",url:"/produtos/cafe-biogiori-torrado-e-moido-250g-biocoffee-box/",celular:7,computador:4},{nome:"Drip Coffee, kit 12 unidades",arquivo:"drip-coffee-kit-12-unidades",url:"/produtos/drip-coffee-kit-12unidades/",celular:8,computador:4},{nome:"Chá da Flor do Café 10g",arquivo:"cha-da-flor-do-cafe-10g",url:"/produtos/cha-da-flor-do-cafe-biogiori-10g/",celular:7,computador:4},{nome:"Keishr, chá de casca de café",arquivo:"keishr-cha-de-casca-de-cafe",url:"/produtos/keishr-biogiori-cha-de-casca-de-cafe-30g/",celular:7,computador:4}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ppp-numa", nome:"Numa Chocolates", tipo:"Página de produto", status:"concluido", exibicao:"produto",
    plataforma:"Shopify", tema:"", segmento:"Chocolates", ano:"",
    url:"https://www.numachocolates.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Kit degustação",arquivo:"kit-degustacao",url:"/products/kit-degustacao-numa",celular:5,computador:3}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  /* Plataforma não identificada no código da página: fica sem. */
  { id:"ppp-f2-frutas", nome:"F2 Frutas", tipo:"Páginas de produto", status:"concluido", exibicao:"produto",
    plataforma:"", tema:"", segmento:"Frutas congeladas", ano:"",
    url:"https://www.f2frutas.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Morango",arquivo:"morango",url:"/morango-dose",celular:9,computador:4},{nome:"Frutas Vermelhas",arquivo:"frutas-vermelhas",url:"/frutas-vermelhas-dose",celular:9,computador:4}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ppp-verde-de-origem", nome:"Verde de Origem", tipo:"Páginas de produto", status:"concluido", exibicao:"produto",
    plataforma:"Tray", tema:"", segmento:"Produtos naturais", ano:"",
    url:"https://www.verdedeorigem.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Cápsulas + Pomada Artesanal",arquivo:"capsulas-pomada-artesanal",url:"/kit-capsulas-e-pomadas/barbatimao-kit-300-capsulas-1-pomada-artesanal-60g-tratamento-hpv-acne-cicatrizante",celular:7,computador:4},{nome:"Kit Completo de Barbatimão",arquivo:"kit-completo-de-barbatimao",url:"/kit-capsulas-sabonetes-pomada/barbatimao-kit-1-pomada-artesanal-2-sabonetes-naturais-100-capsulas-tratamento-hpv-acne-cicatrizante",celular:7,computador:4},{nome:"Kit 3 Pomadas + 2 Sabonetes + 300 Cápsulas",arquivo:"kit-3-pomadas-2-sabonetes-300-capsulas",url:"/kit-capsulas-sabonetes-pomada/barbatimao-kit-3-pomadas-artesanais-2-sabonetes-naturais-300-capsulas-tratamento-hpv-acne-cicatrizante",celular:7,computador:4},{nome:"Kit 3 Pomadas + 3 Sabonetes",arquivo:"kit-3-pomadas-3-sabonetes",url:"/kit-sabonetes-e-pomadas-artesanais/barbatimao-kit-3-pomadas-artesanais-3-sabonetes-naturais-tratamento-hpv-acne-cicatrizante",celular:7,computador:4},{nome:"Kit 2 Pomadas + 2 Sabonetes",arquivo:"kit-2-pomadas-2-sabonetes",url:"/kit-sabonetes-e-pomadas-artesanais/barbatimao-kit-2-pomadas-artesanais-2-sabonetes-naturais-tratamento-hpv-acne-cicatrizante",celular:7,computador:4}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ppp-zanelli", nome:"Zanelli Coffee", tipo:"Página de produto", status:"concluido", exibicao:"produto",
    plataforma:"Nuvemshop", tema:"", segmento:"Café especial", ano:"",
    url:"https://loja.zanellicoffee.com/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Reserva do Produtor",arquivo:"reserva-do-produtor",url:"/produtos/cafe-reserva-do-produtor-zanelli-coffee-nanolote-garrafa-150g-1bxur/",celular:4,computador:3}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} },

  { id:"ppp-luna", nome:"Luna", tipo:"Páginas de produto", status:"concluido", exibicao:"produto",
    plataforma:"Tray", tema:"", segmento:"Moda íntima", ano:"",
    url:"https://www.luna.com.br/", capa:"", logo:"",
    previa:{data:"2026-10-31",paginas:[{nome:"Kit de Calcinhas Tradicional",arquivo:"kit-de-calcinhas-tradicional",url:"/menina/bebe-infantil-juvenil/kit-c-calcinhas-tradicional",celular:8,computador:4},{nome:"Kit Xô Dermatite",arquivo:"kit-xo-dermatite",url:"/mais-vendidos/kit-xo-dermatite-calcinhas-antialergicos-infantil--100-algodao",celular:10,computador:5}]},
    resumo:"", desafio:"", entrega:[], resultado:"", imagens:[], depoimento:{autor:"",texto:""} }

  /* Fora do site por decisão dele em 04/10/2026 — o foco é só loja Nuvemshop
     completa:
       - as lojas NUVEMSHOP desse corte foram para LOJAS_FEITAS, logo abaixo,
         como registro, sem aparecer no site;
       - as demais saíram deste arquivo: Just Leve, Numa Chocolates, ARZ Home
         Design, Life NT, Luna Confecções, Pátio Matosinhos, Two Beats, New
         Capelli, MBS Purificadores, Fraktal Softwares, No Glamour e Real
         Conforto. Os registros completos estão no histórico do git (commit
         a6e23c2). Atuale e Dolce Affetto, que também tinham saído, voltaram
         em 25/10/2026 como sites completos, lá em cima.
     Toledo Reservatórios (WordPress, tinha voltado com elas) e Glaucia Goulart
     Bolsas (Tray) saíram em 31/10/2026, a pedido: não agregam. Os
     registros e as partes da prévia da Toledo estão no commit a07486f. */

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

  /* na primeira aba desde 03/11/2026, a pedido (antes ficava em Otimização) */
  { aba:"Loja virtual", nome:"Páginas de produto para best sellers",
    dor:"Meus produtos que mais vendem têm a mesma página de todos os outros",
    itens:["Uma página exclusiva para cada best seller",
           "Conteúdo que responde à objeção de compra",
           "Prova social e comparativo",
           "Feita para funcionar no celular primeiro"],
    cta:"Quero uma página exclusiva" },

  { aba:"Otimização", nome:"Melhoria de CRO",
    dor:"Tenho visita mas não tenho venda",
    itens:["Revisão do caminho do cliente até o carrinho",
           "Ajuste de layout, banners e blocos de confiança",
           "Correção do que quebra no celular",
           "Ganho de velocidade de carregamento"],
    cta:"Quero otimizar minha loja" },

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

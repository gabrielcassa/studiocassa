# Studio Cassa — studiocassa.com.br

Site estático. HTML + CSS + JavaScript puro, sem build, sem npm, sem framework.
Para trabalhar nele basta abrir a pasta e editar. Para ver, abra o `index.html`
direto no navegador — funciona por `file://`, sem servidor.


> ## ⚠ MODO RASCUNHO — o site está fora do Google de propósito
>
> Enquanto ele vive em `gabrielcassa.github.io/studiocassa/`, as 7 páginas estão
> com `noindex, nofollow` e o `CNAME` está desativado. Isso é deliberado: dá para
> ver o site no ar, trabalhar melhorias e estudar o mercado sem que o Google
> indexe um rascunho — e sem que um domínio ainda não registrado derrube tudo.
>
> **Para publicar de verdade, na ordem:**
>
> 1. Registrar `studiocassa.com.br` no registro.br.
> 2. `git mv CNAME.desativado CNAME`
> 3. Apagar o bloco marcado `RASCUNHO` (o comentário + a linha `meta robots`) de
>    `index.html`, `portfolio.html`, `contato.html` e `projeto.html`. Achar com:
>    `grep -rn RASCUNHO *.html`
>    Não mexer no `noindex` de `404.html`, `blog.html` e do post — esses continuam
>    fora do índice de propósito.
> 4. No DNS: 4 registros `A` do apex para 185.199.108.153, .109.153, .110.153 e
>    .111.153, mais `CNAME www → gabrielcassa.github.io`.
> 5. Em Settings → Pages, marcar **Enforce HTTPS** (o certificado pode levar 24h).
> 6. Só então rodar o PageSpeed Insights.
>
> Enquanto o CNAME estiver desativado, `canonical`, `og:url` e o `sitemap.xml`
> continuam apontando para `studiocassa.com.br`. Está certo assim: eles descrevem
> onde o site VAI morar, e o `noindex` impede que isso confunda algum buscador
> nesse meio-tempo.

---

## Se você só quer fazer UMA coisa

| Quero… | Mexa só em… |
|---|---|
| Adicionar ou editar um projeto | `assets/js/dados.js` + as imagens |
| Pôr uma loja pronta na galeria da home | `assets/js/dados.js`: `status:"concluido"` |
| Liberar uma loja que migrou | `assets/js/dados.js`, campo `bloqueio` |
| Tirar uma loja Nuvemshop do site sem perder o registro | mover para `LOJAS_FEITAS`, no `dados.js` |
| Atualizar a prévia de uma loja em que mexi | ver "A prévia" |
| Uma loja saiu do ar | `dados.js`: `semLink:true` e `aviso`; ver "A prévia" |
| Trocar o selo do hero/rodapé | `assets/js/dados.js`, objeto `SELO` |
| Trocar um texto do site | o próprio HTML **e** `assets/js/i18n.js` |
| Trocar fontes ou cores | ver "Identidade visual (provisória)" |
| Trocar o WhatsApp ou o Instagram | `assets/js/site.js`, constantes no topo |
| Publicar o blog | ver "Ligar o blog" |

---

## Os arquivos

```
index.html            landing principal
portfolio.html        grade de projetos + filtros
projeto.html          página de um caso; lê ?id= da URL
contato.html
blog.html             construído e DESLIGADO
blog/<slug>.html      idem
404.html
CNAME                 só o domínio
robots.txt  sitemap.xml
prepara-imagens.ps1   trata as fotos, as logos e as prévias
captura-previa.js     fotografa a loja como ela está agora (nenhuma página usa)
assets/
  css/base.css        tokens, reset, tipografia, utilitários
  css/site.css        seções e componentes
  js/dados.js         TODO o conteúdo: SELO, PROJETOS, SERVICOS, PROCESSO, POSTS
  js/render.js        monta HTML a partir do dados.js — nenhum evento aqui
  js/site.js          comportamento: abertura, nav, menu, órbita, galeria,
                      anel, nuvem, modal, abas, filtros
  js/i18n.js          dicionário pt completo + en vazio
  img/portfolio/      capas    <id>-capa.jpg   800x1200, retrato
                      minis    <id>-mini.jpg   360x540, hoje sem uso (ver abaixo)
                      cartões  <id>-cartao.png 600x900, os da galeria da home
                               (o cartão com foto vai em .jpg)
  img/previa/<id>/    <pagina>-<aparelho>-N.jpg  a loja congelada, em partes
  img/logos/          logos    <id>.png        fundo transparente
  img/og/             imagem de compartilhamento
  favicon/
```

**`render.js` e `site.js` são dois arquivos por separação de responsabilidade**,
não por peso: o navegador baixa os dois de qualquer jeito. `render.js` só produz
HTML; todo `addEventListener` está no `site.js`.

---

## Adicionar um projeto

1. Salve uma **foto da marca** em `_prints/<id>.jpg` e a logo em
   `_logos/<id>.png`. O `<id>` é o `id` do projeto no `dados.js`, sem acento e
   com hífen.

   A foto é de marca — produto, loja, gente —, **não print da home** e sem
   texto gravado: a peça da galeria da home é vertical e mostra a foto
   inteira, em cor. Pode já vir pronta em 800×1200, como as capas de
   25/10/2026: o script só recodifica.

   O `logo` é o **branco**, transparente: é ele que aparece nos cartões
   escuros (a órbita do hero, que é só de logos — fundo preto, logo
   branco —, a galeria e a página do projeto). Logo colorido com fundo
   próprio (adesivo, selo) vira borrão ali — precisa de uma versão de uma cor.

   A faixa **"Marcas que já confiaram"** mostra cada marca na cor dela: com
   o campo `logoCor` no `dados.js` (arquivo em `assets/img/logos/cor/<id>.png`,
   100px de altura), entra o logo colorido; sem ele, o branco vira silhueta
   preta — certo para as marcas pretas e para quem só tem logo branco.

   A galeria **"Loja de verdade"** mostra o cartão desenhado de cada marca
   (campo `capaGaleria`, arquivo `assets/img/portfolio/<id>-cartao.png`,
   600×900, cantos arredondados de 32px já no PNG). Sem cartão, ela usa a
   `capa`. O portfólio e a página de cada projeto seguem com a foto.
   Cartão com **foto** vai em JPG (`<id>-cartao.jpg`, até 200 KB), como o
   da Crochê Vitória: em PNG, a foto passa de 900 KB. Ele pode vir de canto
   reto, porque a galeria arredonda no CSS com o mesmo raio de 32px.

   Na entrega, salve também a **prévia**, com a loja ainda como você a deixou:
   `node captura-previa.js <id>`. Ver "A prévia".
2. Rode na raiz:

   ```powershell
   .\prepara-imagens.ps1 -Aplicar
   ```

   Ele gera `assets/img/portfolio/<id>-capa.jpg` em **retrato 800×1200**, a
   miniatura `<id>-mini.jpg` (360×540) e `assets/img/logos/<id>.png`, e com
   `-Aplicar` já escreve os caminhos no `dados.js`. A miniatura era a foto que
   girava no hero; desde 25/10/2026 a órbita é só de logos e o site não a usa
   mais — o script segue gerando, para a foto poder voltar sem refazer
   imagem. Foto mais alta que 2:3 perde o fim de baixo
   (`-Deslocamento 200` desce o corte); mais larga perde as laterais. Se uma
   capa passar de **200 KB** ele avisa na tela — quando avisar, rode de novo
   com `-Qualidade 70` (a da Café Serra Gerais só cabe assim).
3. Confira o card na home, em `portfolio.html` e em `projeto.html?id=<id>`.
4. Some a URL do projeto ao `sitemap.xml` (tem um comentário lá explicando).

As pastas `_prints/`, `_logos/` e `_previas/` estão no `.gitignore`: o cru não é publicado.

### Por que um projeto pode não aparecer

São **três travas**, todas no `dados.js`:

1. **`status:"concluido"`.** Com `"andamento"`, o projeto não aparece em lugar
   nenhum. É assim que as lojas ainda não prontas esperam na fila da galeria:
   já estão com `exibicao:"destaque"`, e entram no dia em que o status mudar.
2. **`url` + `capa` + `logo`.** Faltando um, o card não existe — de propósito,
   para não haver card quebrado. `"outras"` e `"citacao"` precisam só de `url`,
   porque não têm foto. Sem `url`, vale a prévia: loja que saiu do ar não some.
3. **`bloqueio` vazio.** Com qualquer texto, o projeto some **mesmo completo**.
   É a loja pronta cujo domínio ainda aponta para a plataforma antiga: publicar
   o card antes da virada mandaria o visitante para a loja que você substituiu.
   **Para liberar, apague o texto do `bloqueio`.**

O campo `exibicao` decide onde o projeto aparece:

- `"destaque"` → galeria em profundidade da home ("Loja de verdade, no ar
  agora."), órbita do hero **e** grade do portfólio. Só os melhores, e só
  Nuvemshop. Loja com `semLink` não entra: o título da seção diz "no ar agora".
- `"grade"` → só na grade de `portfolio.html`.
- `"outras"` → lista **"A Nuvemshop é a casa, não a única."**, embaixo do
  "Ver todos os projetos" da home, e **"Shopify e outras plataformas"**, no
  fim do `portfolio.html`. Linha sem foto: nome, plataforma, tipo e link; com
  prévia, a linha abre o projeto aqui dentro em vez de levar à loja.
  Os sites completos feitos fora da Nuvemshop (Wix, Tray, WordPress) vêm
  primeiro. Com **`emDestaque:true`** (e a home salva no celular, no
  `previa`), o projeto sai da lista da home e vira o **cartão de
  destaque** embaixo do título: a home da loja rolando sozinha num celular,
  com "Ver o projeto" (abre o modal) e "Ver loja no ar". É um cartão só: com
  dois marcados, vale o primeiro da lista. No `portfolio.html` ele continua
  na lista. Hoje é a VITAL.
- `"citacao"` → lista compacta "Também passaram por aqui". Hoje não tem
  nenhuma.

**`LOJAS_FEITAS`**, logo depois de `PROJETOS`, não é uma exibição: é o
**registro** das lojas Nuvemshop que você fez e decidiu não mostrar. Nenhum
código do site lê essa lista, e ela ajuda a sustentar a conta do selo ("N
lojas Nuvemshop no ar" — a conta loja por loja está no comentário acima do
`SELO`). Para uma loja voltar ao site, mova o registro para `PROJETOS` e
complete os campos de lá.

Enquanto nenhum `"destaque"` tiver foto, a galeria da home sai inteira, o hero
fica sem a órbita, e os links para `#portfolio` passam a levar ao
`portfolio.html` — para não sobrar uma seção só com o título.

Os filtros de `portfolio.html` são gerados dos `tipo` que de fato existem entre
os projetos visíveis — não há lista de filtros escrita à mão — e só aparecem
com **dois tipos ou mais**. Hoje todas as lojas com card são "E-commerce
completo", então a barra de filtros não aparece.

---

## A prévia

**Depois da entrega, a loja é do cliente.** O banner muda, a promoção entra, o tema
é trocado, a loja fecha, e nada disso avisa. Por isso o site mostra a loja como você
entregou, e não como ela está hoje. O modal e o `projeto.html` mostram páginas
inteiras da loja, que rolam dentro de um celular ou de uma janela de navegador:
são fotos, guardadas aqui, que continuam de pé mesmo que a loja suma.

**A regra:** a prévia só muda quando você disser que mexeu na loja. Nada aqui
olha a loja sozinho. Quem segue com você é atualizado a cada alteração; quem não
segue fica congelado como foi entregue.

### Salvar ou atualizar

```powershell
# 1. fotografa: só a home, ou as páginas que você escolher
node captura-previa.js <id>
node captura-previa.js <id> "Início=/" "Produto=/produtos/um-produto/" "Sobre=/sobre/"

# 2. fatia e escreve o previa no dados.js
.\prepara-imagens.ps1 -So <id> -Aplicar
```

Rodar sem páginas recaptura as que a loja já tem. O nome antes do `=` é o que
aparece no botão da prévia. No Git Bash, ponha `MSYS_NO_PATHCONV=1` na frente do
`node` (o script recusa o caminho errado, se você esquecer). Se o Windows recusar o
segundo comando ("a execução de scripts foi desabilitada"), rode
`powershell -ExecutionPolicy Bypass -File .\prepara-imagens.ps1 -So <id> -Aplicar`.

O cru fica em `_previas/<id>/<data>/`, fora do git e do site: a página inteira em
PNG e um `.mhtml`, com um `previa.json` dizendo quais páginas foram capturadas. A
referência é o PNG: o `.mhtml` abre sem internet, mas sem as fontes da loja e com
diferenças de estilo.
**Faça cópia dessa pasta.** De loja que fechou, ela é o único original. Cada dia tem
a sua pasta e uma nunca apaga a outra (no mesmo dia, a nova escreve por cima), então
dá para voltar a uma captura mais antiga:
`.\prepara-imagens.ps1 -So <id> -Usar 2026-10-31 -Aplicar`.

Captura feita à mão também vale: no Chrome, F12 → ícone de celular → iPhone 12 Pro →
menu ⋮ → *Capture full size screenshot*. Salve como
`_previas/<id>/<data>/inicio-celular.png`, com um `previa.json` copiado de uma captura
anterior da loja. Foi assim que entraram as homes de celular de 26 e 28/10/2026.

O script fotografa a loja tela por tela e emenda, sem pop-up, cookies e WhatsApp
flutuante, com os carrosséis no primeiro slide e as imagens deles carregadas. No
lugar de vídeo do YouTube, entra a capa dele. O que ele não resolve: a foto mostra a
loja de hoje, com a promoção que estiver no ar, então **olhe a foto antes de publicar**.

No fim, ele avisa o que estranhou (`status`, imagem quebrada, página que redirecionou).

### Quando a loja já mudou

Se o cliente pôs campanha na loja, fotografá-la congelaria a campanha. Ainda dá
para tirar a foto certa enquanto a loja existe: `--limpeza=_previas/<id>/limpeza.js`
acerta a página no navegador da captura, e a loja de verdade não muda. Sai numa
pasta `<data>-limpa`, ao lado da real, e tem preferência sobre ela. O exemplo é
`_previas/colado/limpeza.js`, que volta a Colado ao estado de antes da despedida
com os banners e os títulos originais. Isso é uma reconstrução: confira o resultado.
Esse arquivo mora no `_previas/`, fora do git, junto do cru da loja.

Para usar a captura real em vez da limpa: `.\prepara-imagens.ps1 -So colado -Usar
2026-10-31 -Aplicar`. Quem decide as páginas é o `previa.json` da pasta: a real da
Colado tem 20, então apague de lá as que não devem virar botão.

### Quando a loja sai do ar

No `dados.js`, ponha `semLink:true` (todo botão que leva à loja some) e um `aviso`
com a frase que aparece embaixo da prévia. Tire a loja de `"destaque"`, porque o
título da galeria diz "no ar agora", e refaça a conta do selo. Foi o que se fez com a
Colado em 30/10/2026.

---

## O selo

```js
const SELO = { ativo: true, texto: "…", imagem: "", link: "" };
```

Os **9 pontos** do site que mostram o selo (hero, seção de números, e o rodapé de
cada página) leem só esse objeto. O HTML de cada ponto é um `<p data-selo>` vazio.

- `imagem: ""` → mostra uma estrela ✦ e o `texto`.
- `imagem: "assets/img/…"` → troca a estrela pela imagem.
- `link: "…"` → o ponto **vira um `<a>`** clicável. Apagar o link faz voltar a `<p>`.

Caminho de imagem é sempre relativo à **raiz**; o `render.js` ajusta a
profundidade sozinho (é o que o `data-base="../"` no `<html>` das páginas de
`blog/` resolve).

---

## Trocar texto

O português mora no HTML; o `i18n.js` é o espelho para tradução. **Mudou um texto
visível, mude nos dois** — senão o dia em que o inglês entrar o site volta à
versão antiga. A chave está no próprio elemento, em `data-i18n`.

---

## Identidade visual (provisória)

Fontes e cores seguem a referência [anubi.io](https://anubi.io/) até as
definitivas chegarem. Tudo sai de tokens no topo do `assets/css/base.css`; o
resto do CSS só lê os tokens.

**Cores.** `--papel*` (fundos claros), `--tinta`, `--mid` e `--light` (textos),
`--marca*` (o azul), `--escuro*` (as seções escuras) e `--risco-*` (os rabiscos
do hero). O comentário no topo do `base.css` tem a tabela de contraste de cada
par em uso: trocou uma cor, refaça a conta do par — texto corrido pede 4,5:1.

**Fontes.** São quatro papéis:

| token | hoje | onde |
|---|---|---|
| `--fonte-titulo` | Epilogue 500 | títulos |
| `--fonte-texto` | Bricolage Grotesque 400 e 500 | texto, botões |
| `--fonte-rotulo` | IBM Plex Mono 400 | rótulos pequenos, contadores |
| `--fonte-marca` | Archivo larga (125%) 900 | só o nome: hero, rodapé, "SC" e o 404 |

Trocar uma fonte = mudar o token **e** o `<link>` do Google Fonts no `<head>`
das 7 páginas, com os mesmos pesos. A Archivo vem recortada só nas letras de
"STUDIO CASSA" (`&text=STUDIO%20CA` no link; no `404.html`, também `40`), o que
a deixa com pouco mais de 1 KB: se o nome ou a fonte do nome mudar, mude o
`text=` junto.

A cor da barra do navegador no celular é o `<meta name="theme-color">`, também
nas 7 páginas.

---

## Movimento

- **Abertura:** a cortina roda uma vez por sessão (marca `cassa-abertura` no
  `sessionStorage`).
- **Órbita do hero:** uma volta a cada 80 s. O botão **"Pausar movimento"**
  existe porque nada pode se mexer sozinho por mais de 5 s sem um jeito de
  parar (WCAG 2.2.2). A escolha fica no navegador da pessoa
  (`cassa-movimento` no `localStorage`).
- **Galeria "Loja de verdade":** só anda com a rolagem.
- **Anel do "Como funciona":** gira só até a estação do passo que está sendo
  lido, e para.
- **Nuvem "nuvemshop":** os pontos formam a palavra em ~2 s e param; depois só
  se mexem com o cursor ou o dedo.
- **Rabisco do cursor** (`rabiscoCursor()` no `site.js`): um traço fino que
  segue o mouse e some em ~1 s, nas cores dos rabiscos do site (azul, laranja,
  amarelo), trocando de cor a cada ~7 s. Mora num canvas **atrás** de todo o
  conteúdo e só nasce no papel livre: não passa por texto, link, botão,
  imagem, desenho nem cartão (fica a ~10 px de qualquer um). Rolar não risca.
  Só com mouse — no celular não existe — e o "Pausar movimento" vale para ele
  também. Para o traço aparecer nas seções escuras, o fundo delas está num
  `::before` atrás do canvas (`.secao--escura` no `base.css`).
- **Prévia do projeto:** a página inteira da loja, até o fim do rodapé, rola
  dentro do aparelho com a roda do mouse, o dedo ou as setas do teclado (Home e
  End vão ao topo e ao fim); chegando ao fim, a rolagem não passa para a página.
  Uma barrinha fina, a do iPhone, aparece enquanto se rola e mostra quanto falta.
  Ao abrir no modal, a tela do celular desce um pouco e volta, uma vez, para
  mostrar que rola. O quadro encolhe para título, prévia e botões caberem juntos
  na janela (classes `.aparelho__corpo` e `.janela`; `.celular` é o mockup do
  "Resultado real", ainda comentado). No computador, o painel do modal alarga de
  720 para 1040px.
- **Cartão de destaque** da lista "A Nuvemshop é a casa, não a única."
  (`destaqueCelular()` no `site.js`): a home da loja desce sozinha dentro do
  celular, devagar (36 px/s, a constante `VEL`), para 2,5 s no rodapé, volta
  ao topo e recomeça — uma volta da VITAL leva ~2,5 min. Para com o mouse
  andando em cima do celular (a página passando por baixo de um mouse
  parado não conta), com o foco do teclado no cartão, com o modal aberto e
  com o "Pausar movimento". A roda do mouse e o dedo em cima dele rolam a
  **página**, nunca a loja: quem desce o site não fica preso ali. Para
  rolar a loja à mão, o clique no celular abre o modal.

Tudo para quando sai da tela. Com **"reduzir movimento"** ligado no sistema,
nada se mexe: sem cortina, sem rabisco, sem a espiada do celular, cartão de
destaque parado no topo da loja, órbita parada e a galeria vira uma grade
comum.

---

## Ligar o blog

Hoje ele está pronto e fora do ar. Para publicar:

1. apague o `<meta name="robots" content="noindex, nofollow">` de `blog.html` e
   de cada arquivo em `blog/`;
2. descomente o bloco marcado `BLOG:` no `index.html`;
3. some as URLs ao `sitemap.xml` e o link ao menu e ao rodapé.

O post que está lá é um **modelo** — leia antes de publicar, porque sai com a sua
assinatura.

---

## Publicar no GitHub Pages

Só na primeira vez:

```bash
git init
git add .
git commit -m "Site do Studio Cassa"
git branch -M main
git remote add origin https://github.com/gabrielcassa/<repo>.git
git push -u origin main
```

Depois: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
Sem Actions — o Pages serve estático direto.

No DNS do domínio:

| tipo | nome | valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `gabrielcassa.github.io` |

Depois marque **Enforce HTTPS** no Settings → Pages. O certificado pode levar até
24h; se a opção estiver cinza, é só esperar o DNS propagar.

Publicações seguintes: `git add . && git commit -m "..." && git push`.

---

## Orçamento de peso

O que decide a velocidade do site são as **imagens**, não o código.

| item | hoje | teto |
|---|---|---|
| CSS + JS (soma dos gzip) | 66,43 KB | 45 KB, informativo |
| cada capa | 85 a 187 KB | **200 KB** |
| primeira dobra | ~243 KB | 600 KB |
| cada parte da prévia no celular | até 162 KB, só ao chegar nela | **200 KB** |
| cada parte da prévia no computador | até 338 KB, só ao chegar nela | **350 KB** |

O CSS + JS passou do teto informativo com a órbita, a galeria em profundidade,
o anel e a nuvem (antes do redesign eram 39,23 KB). A primeira dobra subiu de
185 KB porque o hero agora carrega os logos das lojas, um cartão por loja.
Quando a órbita tinha fotos, eram as minis (as capas inteiras estourariam os
600 KB); hoje ela é só de logos, ~10 KB cada.

A galeria "Loja de verdade" vem logo depois do hero, então as capas grandes
dela **não** podem ir com `src` (o navegador baixaria as 11, ~1,6 MB, na
abertura): vão em `data-src`, e o `site.js` só carrega a peça da frente e as
duas de cada lado, depois que a pessoa começa a rolar até a galeria.

Os logos da órbita ficam acima da dobra; os da faixa de marcas, depois da
galeria. O script os gera com **100px de altura** — perto do dobro do maior
tamanho em que o site mostra um logo (60px, na faixa de marcas), nítido em tela
retina. Com 200px, como era antes, os cinco somavam 206 KB; com 100px, os onze
somam ~98 KB.

Meça o CSS/JS pela **soma dos gzip individuais**, não pelos bytes em disco e não
juntando os arquivos antes de comprimir — o navegador baixa cada um separado.

```bash
for f in assets/css/*.css assets/js/*.js; do
  printf "%-22s %5.2f KB gz\n" "$f" $(gzip -9c "$f" | wc -c | awk '{print $1/1024}')
done
```

Nunca comprima nome de classe nem tire comentário para caber: o repositório é a
fonte, e legibilidade vale mais que 1 KB.

---

## Limitações conhecidas

- **Quando o inglês for ligado, três coisas continuam em português:** as mensagens
  do WhatsApp (estão escritas à mão no `data-zap` de cada HTML; a chave
  `flut.zapPadrao` existe no dicionário e ninguém a lê), o corpo do artigo do
  blog (o `<main>` do post não tem `data-i18n`) e o que o modal monta ao abrir,
  prévia inclusive: a tradução roda uma vez, no arranque da página.
- **Não existe formulário de contato.** Site estático precisaria de um serviço de
  terceiro, e a página de contato funciona pelo WhatsApp. Se um dia entrar um
  formulário, ele vai precisar de uma página de agradecimento — a antiga
  `obrigado.html` foi removida porque era inalcançável e dizia "recebi sua
  mensagem" para quem nunca mandou nada.
- **A seção "Resultado real" (vídeo) está no HTML, comentada**, esperando um vídeo
  ou um print de loja. O CSS do mockup de celular já está pronto.

---

## Rodar um servidor local

Não é obrigatório — o site abre por `file://`. Mas se quiser:

```powershell
# Windows, sem instalar nada
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add('http://localhost:8000/')
```

Mais simples: a extensão **Live Server** do VS Code, botão direito no
`index.html` → *Open with Live Server*.

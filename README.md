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
| Trocar fontes ou cores | ver "Identidade visual" |
| Pôr a assinatura no rodapé de uma loja | ver "Assinatura nas lojas" |
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
  marca/              o logo e a assinatura das lojas, em SVG (e a
                      assinatura também em PNG); ver "Identidade visual"
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
  Nuvemshop. Loja que encerrou continua aqui, com o aviso no modal.
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
- `"produto"` → seção **"Um produto. Uma página só dele."**, depois de "Marcas que
  já confiaram" na home e no fim do `portfolio.html`: um celular por loja, com a
  primeira página rolando sozinha; o clique abre o modal com as outras. Precisa só
  do `previa`, não tem card nem `projeto.html`, e não mexe na conta do selo. O id
  leva o prefixo `ppp-`, porque a loja pode estar também na galeria ou em
  `LOJAS_FEITAS`. A ordem do `dados.js` é a ordem da fileira, e a ordem do `previa`
  é a das páginas. Para trocar a página que aparece no celular, ponha-a em primeiro.
  Para acrescentar uma, rode a captura só dela e confira a ordem no `previa.json`.
  Para tirar uma, apague-a do `previa.json` e rode `prepara-imagens.ps1 -So <id>
  -Aplicar`: cortar só no `dados.js` faz a página voltar na próxima rodada.

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
aparece no botão da prévia. Com muitas páginas ou nomes longos (mais de 60 letras
somadas), os botões viram um seletor, com anterior e próxima do lado. No Git Bash, ponha `MSYS_NO_PATHCONV=1` na frente do
`node` (o script recusa o caminho errado, se você esquecer). Se o Windows recusar o
segundo comando ("a execução de scripts foi desabilitada"), rode
`powershell -ExecutionPolicy Bypass -File .\prepara-imagens.ps1 -So <id> -Aplicar`.

O cru fica em `_previas/<id>/<data>/`, fora do git e do site: a página inteira em
PNG e um `.mhtml`, com um `previa.json` dizendo quais páginas foram capturadas. A
referência é o PNG: o `.mhtml` abre sem internet, mas sem as fontes da loja e com
diferenças de estilo. `--sem-arquivo` pula o `.mhtml`. Página muito alta sai em
folhas (`.folha2.png`, `.folha3.png`…), porque uma imagem não passa de 16 mil px; o
`prepara-imagens` as lê em sequência. As capturas de antes de 31/10/2026 perdiam
nitidez nesse caso, e só melhoram se a loja for recapturada.
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
com a frase que aparece logo acima da prévia, e refaça a conta do selo. O card fica
onde estava, mesmo na galeria cujo título diz "no ar agora": quem abre lê o aviso.
Foi o que se fez com a Colado em 31/10/2026.

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

## Identidade visual

**O logo é uma gaveta:** "CASSA" em cinco compartimentos de uma gaveta
vermelha, com o puxador embaixo do meio, e "studio" em mono ao lado (ou em
cima, na versão compacta). *Cassa*, em italiano, é o caixa da loja, e também
caixa, caixote. Os arquivos estão em `assets/marca/`, com as letras já em
desenho: nenhum depende de fonte carregada.

| arquivo | onde o site usa |
|---|---|
| `studio-cassa-horizontal.svg` | nav e hero, a partir de 760px |
| `studio-cassa-compacta.svg` | hero, no celular |
| `studio-cassa-gaveta.svg` | nav no celular e rodapé das 7 páginas |
| `gaveta-404.svg` | o número do `404.html`, com os dígitos na Plex Mono |
| `assinatura-branca.svg`, `assinatura-preta.svg` e os PNGs @2x e @3x | o rodapé das lojas (ver "Assinatura nas lojas") |

O favicon (`assets/favicon/`) é o compartimento do C com o puxador, num
desenho próprio, mais grosso, para se ler em 16px. A imagem de
compartilhamento (`assets/img/og/og-image.png`, 1200×630) leva a compacta
sobre o papel e não traz o domínio, que ainda não está registrado.

**Regras do logo:**

- área de proteção: a altura de uma letra da gaveta, livre em volta de tudo;
- tamanho mínimo, em altura: horizontal 28px, compacta 48px, gaveta 18px e
  símbolo 32px (abaixo disso, só o favicon);
- não esticar, não tirar o puxador e não trocar as cores de lugar: moldura e
  puxador em vermelho, letras em tinta (ou tudo numa cor só, branca ou tinta).

O manual completo, com a construção, a paleta e os contrastes, é o
`_marca/fase2/marca.html`.

**Cores.** As da marca são tinta `#161310`, papel `#F5F1E8`, vermelho
`#CF2C15` e branco. O papel é o fundo das peças (imagem de compartilhamento,
foto de perfil); o site continua no papel claro de antes. No site, o vermelho
fica só no logo, no favicon e no `<meta name="theme-color">` (a cor da barra
do navegador no celular, nas 7 páginas): não vira texto nem fundo de seção.

O resto sai de tokens no topo do `assets/css/base.css`; o CSS só lê os tokens.
`--papel*` (fundos claros), `--tinta` (a mesma da marca), `--mid` e `--light`
(textos), `--marca*` (o azul: link, item ativo e foco), `--escuro*` (as seções
escuras) e `--risco-*` (os rabiscos, em azul e amarelo; o laranja saiu, porque
brigava com o vermelho do logo). O comentário no topo do `base.css` tem a
tabela de contraste de cada par em uso: trocou uma cor, refaça a conta do par
— texto corrido pede 4,5:1.

**Fontes.** São três papéis no site:

| token | fonte | onde |
|---|---|---|
| `--fonte-titulo` | Epilogue 500 | títulos |
| `--fonte-texto` | Bricolage Grotesque 400 e 500 | texto, botões |
| `--fonte-rotulo` | IBM Plex Mono 400 | rótulos pequenos, contadores |

As letras do logo (Alfa Slab One no "CASSA" e IBM Plex Mono 500 no "studio")
vêm em desenho dentro dos SVGs. A Alfa Slab One só existe ali: não é fonte de
título nem de texto. Trocar uma fonte do site = mudar o token **e** o `<link>`
do Google Fonts no `<head>` das 7 páginas, com os mesmos pesos.

**Refazer os arquivos da marca** (mudou uma cor ou uma medida do desenho):
rode `node _marca/fase2/gerador/exporta.js` da raiz, com
`NPMROOT="$(npm root -g)"` (os PNGs saem pelo Edge). Ele reescreve
`assets/marca/`, o favicon e a imagem de compartilhamento. O gerador, as fontes
(licença OFL) e o manual moram em `_marca/`, que fica fora do git: guarde uma
cópia dessa pasta.

---

## Assinatura nas lojas

"Loja feita pelo studio" seguido da gaveta, no rodapé das lojas que eu
entrego. **Em quais lojas ela entra é decisão minha, loja por loja.** Fica
perto do "criado com Nuvemshop" e na escala dele: a gaveta com 22px de altura
e o texto em 12px, na fonte da própria loja (o trecho usa `font-family:
inherit`). Chama atenção pelo desenho, não pelo tamanho.

- **Cor:** branca (`#FFFFFF`) em rodapé escuro, preta (`#161310`) em rodapé
  claro. Em rodapé de cor média, a que der mais contraste; o manual tem a
  conta das nove lojas testadas, todas acima de 4,5:1.
- **Frase:** "Loja feita pelo studio" é a padrão. Também servem "Site feito
  pelo studio", "Desenvolvido pelo studio" e "Feito pelo studio": troque o
  texto do `<span>`.
- **Link:** abre em nova aba (`target="_blank" rel="noopener"`), para não
  tirar o comprador da loja, e leva `?ref=LOJA`. Troque `LOJA` pelo nome da
  loja sem acento nem espaço, o mesmo `id` do `dados.js` (ex.:
  `cachaca-seculo-xviii`), para medir quando houver analytics.
- **O endereço é `studiocassa.com.br`, que ainda não está registrado:** até
  ele entrar no ar, o link não abre nada. Cole a assinatura depois do
  registro; se colar antes com o endereço do GitHub Pages, vai ter de trocar
  de novo em cada loja.

**Nuvemshop:** Editar layout → Rodapé → Selos → **HTML personalizado**. Cole o
trecho inteiro. O campo aceita até 50.000 caracteres, com HTML e estilo, e
recusa `<script>`; o trecho tem 3 KB e nenhum script. Ele não passa pelo CSS
personalizado do tema, que descartaria o `fill` do desenho. **Trocar de layout
apaga o campo**, e a Nuvemshop não guarda histórico: mudou o layout, cole de
novo.

**Shopify e Tray:** ainda sem passo a passo. O trecho é HTML com todo o estilo
inline e sem `<script>`, então serve em qualquer campo de rodapé que aceite
HTML. Se o campo só aceitar imagem, use `assets/marca/assinatura-branca@2x.png`
(ou a preta) com 22px de altura e o link por fora; se só aceitar texto, a
versão só texto.

O SVG vai embutido no trecho, e não como imagem servida por este site, de
propósito: assim a assinatura não depende do endereço do site, que vai mudar,
nem de ele estar no ar.

O trecho, na versão branca (para a preta, troque `#FFFFFF` por `#161310`):

```html
<!-- Studio Cassa · assinatura no rodapé (branca, para rodapé escuro).
Nuvemshop: Editar layout > Rodapé > Selos > HTML personalizado. Cole o bloco inteiro.
Troque LOJA pelo nome da loja (ex.: cachaca-seculo-xviii). Para outra cor, troque #FFFFFF.
Para outra frase (Site feito pelo studio, Desenvolvido pelo studio, Feito pelo studio), troque o texto do <span>. -->
<a href="https://studiocassa.com.br/?ref=LOJA" target="_blank" rel="noopener" aria-label="Loja feita pelo Studio Cassa (abre em nova aba)" style="display:inline-flex;align-items:center;gap:6px;color:#FFFFFF;font-family:inherit;font-size:12px;font-weight:400;font-style:normal;line-height:1;letter-spacing:0;text-transform:none;text-decoration:none;white-space:nowrap;vertical-align:middle"><span>Loja feita pelo studio</span><svg viewBox="0 0 460 136" width="74.4" height="22" aria-hidden="true" focusable="false" style="display:block;flex:none;width:74.4px;height:22px;max-width:none;position:relative;top:2px;overflow:visible"><path style="fill:currentColor" d="M0 0H460V118H0ZM9 9V109H93V9ZM98.5 9V109H182.5V9ZM188 9V109H272V9ZM277.5 9V109H361.5V9ZM367 9V109H451V9ZM258 112.6V118A28 18 0 0 1 202 118V112.6ZM29.9 57.5Q29.9 31.6 55.1 31.6Q61.2 31.6 66.5 33.1Q71.7 34.6 74.3 36.4L74.3 52.4L58.9 52.4L58.9 47.8Q58.9 45.4 57.8 44.2Q56.7 43 54.5 43Q52.3 43 51.2 44.2Q50.1 45.4 50.1 47.8L50.1 67.2Q50.1 69.6 51.2 70.8Q52.3 72 54.5 72Q56.7 72 57.8 70.8Q58.9 69.6 58.9 67.2L58.9 62L74.3 62L74.3 78.6Q71.6 80.4 66.5 81.9Q61.3 83.4 55.3 83.4Q43.1 83.4 36.5 77.2Q29.9 71.1 29.9 57.5ZM163.1 72L165.6 72L165.6 82.5L140.4 82.5L140.4 72L144.3 72L143.3 66.8L134.5 66.8L133.5 72L137.4 72L137.4 82.5L115.4 82.5L115.4 72L117.9 72L128.8 32.5L152.2 32.5ZM135.9 60L141.8 60L139.2 47.2L138.6 47.2ZM209.4 79.9L209.4 67.2L223.6 67.2Q223.6 69.2 224.5 70.1Q225.4 71 227.8 71Q229.7 71 230.6 70.4Q231.5 69.8 231.5 68.6Q231.5 67.5 230.6 66.8Q229.8 66 227.8 65.3L222.2 63.3Q215.1 60.6 212 57Q208.9 53.3 208.9 47.1Q208.9 39.5 213.8 35.6Q218.8 31.6 230.4 31.6Q236 31.6 241 32.7Q245.9 33.8 248.9 35.7L248.9 47.2L236 47.2Q236 44 232.1 44Q230.1 44 229.3 44.5Q228.5 45 228.5 46.2Q228.5 47.3 229.5 47.9Q230.4 48.6 232.5 49.3L238.1 51.2Q244.9 53.5 248 57.2Q251.1 60.9 251.1 66.9Q251.1 75 245.6 79.2Q240.2 83.4 229.6 83.4Q223.4 83.4 217.9 82.3Q212.4 81.3 209.4 79.9ZM298.9 79.9L298.9 67.2L313.1 67.2Q313.1 69.2 314 70.1Q314.9 71 317.3 71Q319.2 71 320.1 70.4Q321 69.8 321 68.6Q321 67.5 320.1 66.8Q319.3 66 317.3 65.3L311.7 63.3Q304.6 60.6 301.5 57Q298.4 53.3 298.4 47.1Q298.4 39.5 303.3 35.6Q308.3 31.6 319.9 31.6Q325.5 31.6 330.5 32.7Q335.4 33.8 338.4 35.7L338.4 47.2L325.5 47.2Q325.5 44 321.6 44Q319.6 44 318.8 44.5Q318 45 318 46.2Q318 47.3 319 47.9Q319.9 48.6 322 49.3L327.6 51.2Q334.4 53.5 337.5 57.2Q340.6 60.9 340.6 66.9Q340.6 75 335.1 79.2Q329.7 83.4 319.1 83.4Q312.9 83.4 307.4 82.3Q301.9 81.3 298.9 79.9ZM431.6 72L434.1 72L434.1 82.5L408.9 82.5L408.9 72L412.8 72L411.8 66.8L403 66.8L402 72L405.9 72L405.9 82.5L383.9 82.5L383.9 72L386.4 72L397.3 32.5L420.7 32.5ZM404.4 60L410.3 60L407.7 47.2L407.1 47.2Z"/></svg></a>
```

A versão só texto, para campo que não aceita SVG nem imagem:

```html
Loja feita pelo <a href="https://studiocassa.com.br/?ref=LOJA" target="_blank" rel="noopener">Studio Cassa</a>
```

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
  segue o mouse e some em ~1 s, nas cores dos rabiscos do site (azul e
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
  celular, devagar (54 px/s, a constante `VEL`), para 2,5 s no rodapé, volta
  ao topo e recomeça — uma volta da VITAL leva ~2 min. Para com o mouse
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
| CSS + JS (soma dos gzip) | 72,77 KB | 45 KB, informativo |
| cada capa | 85 a 187 KB | **200 KB** |
| primeira dobra | ~243 KB | 600 KB |
| cada parte da prévia no celular | até 162 KB, só ao chegar nela | **200 KB** |
| cada parte da prévia no computador | até 338 KB, só ao chegar nela | **350 KB** |

O CSS + JS passou do teto informativo com a órbita, a galeria em profundidade,
o anel e a nuvem (antes do redesign eram 39,23 KB). A marca nova quase não
mexeu nele: o logo entra como `<img>` de SVG, de 1 a 2 KB em gzip cada, e a
nav e o hero dividem o mesmo arquivo; a Archivo, que vinha do Google Fonts,
saiu. A primeira dobra subiu de
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

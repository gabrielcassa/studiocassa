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
prepara-imagens.ps1   trata as fotos e as logos
assets/
  css/base.css        tokens, reset, tipografia, utilitários
  css/site.css        seções e componentes
  js/dados.js         TODO o conteúdo: SELO, PROJETOS, SERVICOS, PROCESSO, POSTS
  js/render.js        monta HTML a partir do dados.js — nenhum evento aqui
  js/site.js          comportamento: abertura, nav, menu, órbita, galeria,
                      anel, nuvem, modal, abas, filtros
  js/i18n.js          dicionário pt completo + en vazio
  img/portfolio/      capas    <id>-capa.jpg   800x1200, retrato
                      minis    <id>-mini.jpg   360x540, as que giram no hero
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
   inteira, em cor, e uma miniatura dela gira na órbita do hero. Pode já vir
   pronta em 800×1200, como as capas de 25/10/2026: o script só recodifica.

   O `logo` é o **branco**, transparente: é ele que aparece nos cartões
   escuros (órbita, galeria, página do projeto). Logo colorido com fundo
   próprio (adesivo, selo) vira borrão ali — precisa de uma versão de uma cor.

   A faixa **"Marcas que já confiaram"** mostra cada marca na cor dela: com
   o campo `logoCor` no `dados.js` (arquivo em `assets/img/logos/cor/<id>.png`,
   100px de altura), entra o logo colorido; sem ele, o branco vira silhueta
   preta — certo para as marcas pretas e para quem só tem logo branco.
2. Rode na raiz:

   ```powershell
   .\prepara-imagens.ps1 -Aplicar
   ```

   Ele gera `assets/img/portfolio/<id>-capa.jpg` em **retrato 800×1200**, a
   miniatura `<id>-mini.jpg` (360×540, a da órbita) e `assets/img/logos/<id>.png`,
   e com `-Aplicar` já escreve os caminhos no `dados.js`. A miniatura não entra
   no `dados.js`: o site a acha pelo nome da capa, e sem ela usa a capa inteira
   (funciona, só pesa mais). Foto mais alta que 2:3 perde o fim de baixo
   (`-Deslocamento 200` desce o corte); mais larga perde as laterais. Se uma
   capa passar de **200 KB** ele avisa na tela — quando avisar, rode de novo
   com `-Qualidade 70` (a da Café Serra Gerais só cabe assim).
3. Confira o card na home, em `portfolio.html` e em `projeto.html?id=<id>`.
4. Some a URL do projeto ao `sitemap.xml` (tem um comentário lá explicando).

As pastas `_prints/` e `_logos/` estão no `.gitignore`: o cru não é publicado.

### Por que um projeto pode não aparecer

São **três travas**, todas no `dados.js`:

1. **`status:"concluido"`.** Com `"andamento"`, o projeto não aparece em lugar
   nenhum. É assim que as lojas ainda não prontas esperam na fila da galeria:
   já estão com `exibicao:"destaque"`, e entram no dia em que o status mudar.
2. **`url` + `capa` + `logo`.** Faltando um, o card não existe — de propósito,
   para não haver card quebrado. `"outras"` e `"citacao"` precisam só de `url`,
   porque não têm foto.
3. **`bloqueio` vazio.** Com qualquer texto, o projeto some **mesmo completo**.
   É a loja pronta cujo domínio ainda aponta para a plataforma antiga: publicar
   o card antes da virada mandaria o visitante para a loja que você substituiu.
   **Para liberar, apague o texto do `bloqueio`.**

O campo `exibicao` decide onde o projeto aparece:

- `"destaque"` → galeria em profundidade da home ("Loja de verdade, no ar
  agora."), órbita do hero **e** grade do portfólio. Só os melhores, e só
  Nuvemshop.
- `"grade"` → só na grade de `portfolio.html`.
- `"outras"` → lista **"A Nuvemshop é a casa, não a única."**, embaixo do
  "Ver todos os projetos" da home, e **"Shopify e outras plataformas"**, no
  fim do `portfolio.html`. Linha sem foto: nome, plataforma, tipo e link.
  Os sites completos feitos fora da Nuvemshop (Wix, Tray, WordPress) vêm
  primeiro.
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

Tudo para quando sai da tela. Com **"reduzir movimento"** ligado no sistema,
nada se mexe: sem cortina, órbita parada e a galeria vira uma grade comum.

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
| CSS + JS (soma dos gzip) | 53,23 KB | 45 KB, informativo |
| cada capa | 85 a 187 KB | **200 KB** |
| primeira dobra | ~378 KB | 600 KB |

O CSS + JS passou do teto informativo com a órbita, a galeria em profundidade,
o anel e a nuvem (antes do redesign eram 39,23 KB). A primeira dobra subiu de
185 KB porque o hero agora carrega miniaturas e logos das lojas: por isso as
minis existem, e por isso, **a partir de 6 lojas, cada uma entra na órbita uma
vez só** — foto e logo alternados (com 11, são 6 minis e 5 logos). Com foto e
logo de todas, as 11 lojas passariam dos 600 KB.

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

- **Quando o inglês for ligado, duas coisas continuam em português:** as mensagens
  do WhatsApp (estão escritas à mão no `data-zap` de cada HTML; a chave
  `flut.zapPadrao` existe no dicionário e ninguém a lê) e o corpo do artigo do
  blog (o `<main>` do post não tem `data-i18n`).
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

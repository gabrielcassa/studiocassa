# =============================================================================
#  prepara-imagens.ps1 — Studio Cassa
#
#  Pega os prints crus que voce salvou e devolve as capas do portfolio no
#  tamanho exato que o site espera, com o nome certo: RETRATO 800x1200 (2:3),
#  porque a peca da galeria da home e vertical (mudou em 04/10/2026; antes
#  era 1200x900 paisagem). Use foto de marca, nao print da home, e sem texto
#  gravado — a peca mostra a foto inteira, em cor. Capa que ja chega pronta
#  em 800x1200 so e recodificada.
#
#  COMO USAR
#    1. Na raiz do repositorio, crie a pasta  _prints
#    2. Salve uma foto de cada loja la dentro (de marca: produto, loja, gente),
#       nomeada com o id do projeto no dados.js. Ex.: quero-melancia.jpg
#       Foto mais alta que 2:3 encaixa pela largura e perde o fim de baixo
#       (use -Deslocamento para descer o corte); mais larga encaixa pela
#       altura e perde as laterais, centralizada.
#    3. Rode:      .\prepara-imagens.ps1
#       Para ja escrever os caminhos no dados.js:
#                  .\prepara-imagens.ps1 -Aplicar
#
#  MINIS: toda capa ganha tambem assets/img/portfolio/<id>-mini.jpg, 360x540.
#         Era a foto que girava na orbita do topo da home (as capas inteiras
#         estourariam o teto de 600 KB da primeira dobra). Desde 25/10/2026 a
#         orbita e so de logos e o site nao usa as minis; elas seguem sendo
#         feitas para a foto poder voltar. Capa sem mini (ou com mini mais
#         velha que ela) ganha uma nova a cada rodada.
#
#  LOGOS: mesma ideia, pasta  _logos , PNG com fundo transparente.
#         Saem em assets/img/logos/<id>.png com 100px de altura: o dobro do
#         maior tamanho em que o site mostra um logo (48px no card), nitido
#         em tela retina. Era 200px ate 05/10/2026 — pesava ate 4x mais sem
#         ganhar nitidez, porque logo pequeno so era ampliado.
#
#  PREVIAS: a loja congelada, que o site mostra no celular e no computador.
#         Quem captura e o captura-previa.js, em _previas\<id>\<data>\. Aqui
#         cada pagina sai FATIADA, com 2400 de altura por parte:
#         assets/img/previa/<id>/<arquivo>-<aparelho>-1.jpg, -2.jpg...
#         O celular tem 500 de largura e o computador, 1200. O site carrega cada
#         parte so quando a tela chega perto dela (uma pagina inteira numa imagem
#         so passaria de 1 MB). Com -Aplicar ele escreve o previa no dados.js.
#         Vale a captura MAIS NOVA de cada loja: ela diz quais paginas existem,
#         e cada foto vem da pasta mais nova que a tenha. A -limpa de um dia passa
#         na frente da real do mesmo dia. Para ficar numa captura mais antiga:
#                  .\prepara-imagens.ps1 -So colado -Usar 2026-10-31 -Aplicar
#         Parte de celular acima de 200 KB ou de computador acima de 350 KB, ele
#         avisa: rode com -QualidadeCelular 65.
#
#  -So <id> faz so a previa daquela loja, sem tocar em capa nem logo.
#
#  Precisa so do Windows (System.Drawing). Nao instala nada.
# =============================================================================

param(
  [string]$Raiz     = ".",
  [int]$Largura     = 800,
  [int]$Altura      = 1200,
  [int]$AlturaLogo  = 100,
  [int]$Qualidade   = 82,
  [int]$QualidadeCelular = 72,
  [int]$Deslocamento = 0,   # px para descer o corte, se o topo do print for feio
  [string]$So       = "",   # so esta loja (o id do dados.js)
  [string]$Usar     = "",   # a captura de _previas\<id>\ a usar, em vez da mais nova
  [switch]$Aplicar
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$pastaPrints = Join-Path $Raiz '_prints'
$pastaPrevias = Join-Path $Raiz '_previas'
$pastaLogos  = Join-Path $Raiz '_logos'
$saidaCapas  = Join-Path $Raiz 'assets\img\portfolio'
$saidaLogos  = Join-Path $Raiz 'assets\img\logos'
$saidaPrevias = Join-Path $Raiz 'assets\img\previa'
$dadosJs     = Join-Path $Raiz 'assets\js\dados.js'
if (-not (Test-Path $dadosJs)) { $dadosJs = Join-Path $Raiz 'dados.js' }

foreach ($d in @($saidaCapas, $saidaLogos, $saidaPrevias)) {
  if (-not (Test-Path $d)) { $null = New-Item -ItemType Directory -Path $d -Force }
}

$codecJpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
            Where-Object { $_.MimeType -eq 'image/jpeg' }
$paramsJpg = New-Object System.Drawing.Imaging.EncoderParameters(1)
$paramsJpg.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                        [System.Drawing.Imaging.Encoder]::Quality, [long]$Qualidade)
# a mini aparece pequena e girando: 80 basta, e nao segue o -Qualidade da capa
$paramsMini = New-Object System.Drawing.Imaging.EncoderParameters(1)
$paramsMini.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                        [System.Drawing.Imaging.Encoder]::Quality, [long]80)
$paramsPrevia = New-Object System.Drawing.Imaging.EncoderParameters(1)
$paramsPrevia.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                        [System.Drawing.Imaging.Encoder]::Quality, [long]$QualidadeCelular)

function Redimensiona-Capa($origem, $destino) {
  $img = [System.Drawing.Image]::FromFile($origem)
  try {
    $escala = $Largura / $img.Width
    $alturaFonte = [Math]::Min([int]($Altura / $escala), $img.Height)
    $topo = [Math]::Min($Deslocamento, [Math]::Max(0, $img.Height - $alturaFonte))

    $bmp = New-Object System.Drawing.Bitmap($Largura, $Altura)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.Clear([System.Drawing.Color]::White)

      if ($img.Height * $escala -ge $Altura) {
        # print alto: encaixa pela largura e corta o topo
        $dest = New-Object System.Drawing.Rectangle(0, 0, $Largura, $Altura)
        $src  = New-Object System.Drawing.Rectangle(0, $topo, $img.Width, $alturaFonte)
      } else {
        # print largo e baixo: encaixa pela altura e centraliza
        $escala2 = $Altura / $img.Height
        $larguraFonte = [int]($Largura / $escala2)
        $esq = [int](($img.Width - $larguraFonte) / 2)
        $dest = New-Object System.Drawing.Rectangle(0, 0, $Largura, $Altura)
        $src  = New-Object System.Drawing.Rectangle($esq, 0, $larguraFonte, $img.Height)
      }
      $g.DrawImage($img, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
    } finally { $g.Dispose() }

    $bmp.Save($destino, $codecJpg, $paramsJpg)
    $bmp.Dispose()
  } finally { $img.Dispose() }
}

function Gera-Mini($capa, $mini) {
  $img = [System.Drawing.Image]::FromFile($capa)
  try {
    # a capa ja sai em 2:3; a mini so encolhe, sem novo corte
    $bmp = New-Object System.Drawing.Bitmap(360, 540)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.DrawImage($img, 0, 0, 360, 540)
    } finally { $g.Dispose() }
    $bmp.Save($mini, $codecJpg, $paramsMini)
    $bmp.Dispose()
  } finally { $img.Dispose() }
}

function Redimensiona-Logo($origem, $destino) {
  $img = [System.Drawing.Image]::FromFile($origem)
  try {
    $escala = $AlturaLogo / $img.Height
    $w = [int]($img.Width * $escala)
    $bmp = New-Object System.Drawing.Bitmap($w, $AlturaLogo,
             [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.Clear([System.Drawing.Color]::Transparent)
      $g.DrawImage($img, 0, 0, $w, $AlturaLogo)
    } finally { $g.Dispose() }
    $bmp.Save($destino, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
  } finally { $img.Dispose() }
}

# Fatia a pagina inteira em partes de 2400 de altura (a ultima, menor) e devolve
# o peso de cada uma. No celular, 500px de largura: a tela do aparelho tem ~250px,
# nitida em tela retina; ~1870px de pagina por parte. No computador, 1200px: a
# janela do modal tem ate ~950px; ~2880px de pagina por parte.
function Fatia-Pagina($origem, $prefixo, $largura) {
  $img = [System.Drawing.Image]::FromFile($origem)
  $partes = @()
  try {
    $parteFonte = 2400 * $img.Width / $largura          # altura de cada parte na captura
    $n = [Math]::Ceiling($img.Height / $parteFonte)
    # sem isto o bicubico puxa a cor de fora da imagem e escurece a borda
    $atributos = New-Object System.Drawing.Imaging.ImageAttributes
    $atributos.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    try {
      for ($k = 1; $k -le $n; $k++) {
        $topo = [int][Math]::Round(($k - 1) * $parteFonte)
        $fim = [int][Math]::Min([Math]::Round($k * $parteFonte), $img.Height)
        $altura = [int][Math]::Round(($fim - $topo) * $largura / $img.Width)
        $bmp = New-Object System.Drawing.Bitmap($largura, $altura)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        try {
          $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
          $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
          $dest = New-Object System.Drawing.Rectangle(0, 0, $largura, $altura)
          $g.DrawImage($img, $dest, 0, $topo, $img.Width, ($fim - $topo), [System.Drawing.GraphicsUnit]::Pixel, $atributos)
        } finally { $g.Dispose() }
        $destino = "$prefixo-$k.jpg"
        $bmp.Save($destino, $codecJpg, $paramsPrevia)
        $bmp.Dispose()
        $partes += [int]((Get-Item $destino).Length / 1KB)
      }
    } finally { $atributos.Dispose() }
  } finally { $img.Dispose() }
  return ,$partes
}

# ---------------------------------------------------------------- capas ----
$feitos = @{}
$capas = 0
$pesoCapas = 0
if (Test-Path $pastaPrints) {
  Get-ChildItem $pastaPrints -Include *.png,*.jpg,*.jpeg -Recurse | ForEach-Object {
    $id = $_.BaseName.ToLower()
    if ($So) { return }   # -So e so a previa: a capa pode ter saido com outra -Qualidade
    $destino = Join-Path $saidaCapas "$id-capa.jpg"
    Redimensiona-Capa $_.FullName $destino
    $kb = [int]((Get-Item $destino).Length / 1KB)
    # O peso da pagina e decidido pelas capas, nao pelo CSS/JS: 14 capas a 250 KB
    # sao 3,5 MB contra 36 KB de codigo. 200 KB por capa e o teto util.
    $aviso = if ($kb -gt 200) { "  << ACIMA DE 200 KB - baixe -Qualidade" } else { "" }
    $script:pesoCapas += $kb
    Write-Host ("  capa  {0,-26} {1}x{2}  {3} KB{4}" -f $id, $Largura, $Altura, $kb, $aviso)
    $feitos[$id] = @{ capa = "assets/img/portfolio/$id-capa.jpg" }
    $capas++
  }
} else { Write-Host "  (pasta _prints nao existe — pulei as capas)" }

# ---------------------------------------------------------------- minis ----
$minis = 0
Get-ChildItem $saidaCapas -Filter '*-capa.jpg' -ErrorAction SilentlyContinue | ForEach-Object {
  if ($So) { return }
  $mini = Join-Path $saidaCapas ($_.Name -replace '-capa\.jpg$', '-mini.jpg')
  if ((Test-Path $mini) -and ((Get-Item $mini).LastWriteTime -ge $_.LastWriteTime)) { return }
  Gera-Mini $_.FullName $mini
  Write-Host ("  mini  {0,-26} 360x540  {1} KB" -f ($_.BaseName -replace '-capa$', ''), [int]((Get-Item $mini).Length / 1KB))
  $minis++
}

# ---------------------------------------------------------------- logos ----
$logos = 0
if (Test-Path $pastaLogos) {
  Get-ChildItem $pastaLogos -Include *.png,*.jpg,*.jpeg -Recurse | ForEach-Object {
    $id = $_.BaseName.ToLower()
    if ($So) { return }
    $destino = Join-Path $saidaLogos "$id.png"
    Redimensiona-Logo $_.FullName $destino
    Write-Host ("  logo  {0,-26} altura {1}px" -f $id, $AlturaLogo)
    if (-not $feitos.ContainsKey($id)) { $feitos[$id] = @{} }
    $feitos[$id].logo = "assets/img/logos/$id.png"
    $logos++
  }
} else { Write-Host "  (pasta _logos nao existe — pulei os logos)" }

# -------------------------------------------------------------- previas ----
$previas = 0
if (Test-Path $pastaPrevias) {
  Get-ChildItem $pastaPrevias -Directory | ForEach-Object {
    $id = $_.Name
    if ($So -and $id -ne $So) { return }

    # em ordem de nome: e a ordem das datas, com a -limpa logo depois da real do dia
    $capturas = @(Get-ChildItem $_.FullName -Directory | Sort-Object Name |
                  Where-Object { Test-Path (Join-Path $_.FullName 'previa.json') })
    if ($Usar) {
      $ate = [array]::IndexOf(@($capturas | ForEach-Object { $_.Name }), $Usar)
      if ($ate -lt 0) { throw "$id nao tem a captura $Usar em _previas\$id" }
      $capturas = @($capturas[0..$ate])
    }
    if ($capturas.Count -eq 0) { return }

    $maisNova = $capturas[$capturas.Count - 1]
    $json = Get-Content (Join-Path $maisNova.FullName 'previa.json') -Raw -Encoding UTF8 | ConvertFrom-Json

    # as partes da captura anterior saem antes: a nova pode ter menos paginas
    $pastaSaida = Join-Path $saidaPrevias $id
    if (Test-Path $pastaSaida) { Get-ChildItem $pastaSaida -Filter '*.jpg' | Remove-Item -Force }
    else { $null = New-Item -ItemType Directory -Path $pastaSaida -Force }

    $paginas = @()
    foreach ($pagina in $json.paginas) {
      $campos = 'nome:"' + $pagina.nome + '",arquivo:"' + $pagina.arquivo + '",url:"' + $pagina.url + '"'
      foreach ($aparelho in @(@('celular', 500, 200), @('computador', 1200, 350))) {
        # a foto da pasta mais nova que a tenha
        $cru = $null
        for ($c = $capturas.Count - 1; $c -ge 0 -and -not $cru; $c--) {
          $tentativa = Join-Path $capturas[$c].FullName ($pagina.arquivo + '-' + $aparelho[0] + '.png')
          if (Test-Path $tentativa) { $cru = $tentativa }
        }
        if (-not $cru) { continue }
        $prefixo = Join-Path $pastaSaida ($pagina.arquivo + '-' + $aparelho[0])
        $partes = Fatia-Pagina $cru $prefixo $aparelho[1]
        $maior = ($partes | Measure-Object -Maximum).Maximum
        $soma = ($partes | Measure-Object -Sum).Sum
        $aviso = if ($maior -gt $aparelho[2]) { "  << PARTE ACIMA DE $($aparelho[2]) KB - baixe -QualidadeCelular" } else { "" }
        Write-Host ("  previa {0,-22} {1,-24} {2,2} parte(s), {3,5} KB no todo, maior {4} KB{5}" -f $id, ($pagina.arquivo + '-' + $aparelho[0]), $partes.Count, $soma, $maior, $aviso)
        $campos += ',' + $aparelho[0] + ':' + $partes.Count
      }
      # pagina sem foto em aparelho nenhum nao vira botao
      if ($campos -match ',(celular|computador):\d+') { $paginas += '{' + $campos + '}' }
      else { Write-Host ("  previa {0,-22} {1}: sem foto, ficou de fora" -f $id, $pagina.arquivo) }
    }
    if ($paginas.Count -eq 0) { return }
    if (-not $feitos.ContainsKey($id)) { $feitos[$id] = @{} }
    $feitos[$id].previa = 'previa:{data:"' + ($maisNova.Name -replace '-limpa$', '') + '",paginas:[' + ($paginas -join ',') + ']}'
    $previas++
  }
}

Write-Host ""
Write-Host "$capas capa(s), $minis mini(s), $logos logo(s) e $previas previa(s) gerados."
if ($capas -gt 0) { Write-Host ("Peso somado das capas: {0} KB (media {1} KB). Orcamento: 200 KB por capa." -f $pesoCapas, [int]($pesoCapas/$capas)) }

# ------------------------------------------------- escreve no dados.js ----
if ($Aplicar -and (Test-Path $dadosJs)) {
  $txt = [System.IO.File]::ReadAllText($dadosJs, [System.Text.Encoding]::UTF8)
  $mudou = 0
  foreach ($id in $feitos.Keys) {
    foreach ($campo in @('capa','logo')) {
      if (-not $feitos[$id].ContainsKey($campo)) { continue }
      $valor = $feitos[$id][$campo]
      # Troca campo:"" pelo caminho, apenas dentro do bloco daquele id.
      # O (?:(?!id:")[\s\S])*? impede o casamento de atravessar para o projeto
      # seguinte quando o campo deste ja esta preenchido — senao a segunda
      # rodada sobrescreve a imagem do vizinho.
      $padrao = '(\{\s*id:"' + [regex]::Escape($id) + '"(?:(?!id:")[\s\S])*?)' + $campo + ':""'
      $novo = '${1}' + $campo + ':"' + $valor + '"'
      $antes = $txt
      $txt = [regex]::Replace($txt, $padrao, $novo)
      if ($txt -ne $antes) { $mudou++ }
    }
    # o previa muda a cada captura nova: troca a linha se ja existe, ou entra
    # logo antes do resumo:, dentro do bloco daquele id
    if ($feitos[$id].ContainsKey('previa')) {
      $linha = $feitos[$id].previa
      $bloco = '(\{\s*id:"' + [regex]::Escape($id) + '"(?:(?!id:")[\s\S])*?)'
      $antes = $txt
      if ([regex]::IsMatch($txt, $bloco + 'previa:\{[^\r\n]*\},')) {
        $txt = [regex]::Replace($txt, $bloco + 'previa:\{[^\r\n]*\},', '${1}' + $linha + ',')
      } else {
        $txt = [regex]::Replace($txt, $bloco + 'resumo:', '${1}' + $linha + ",`r`n    resumo:")
      }
      if ($txt -ne $antes) { $mudou++ }
    }
  }
  [System.IO.File]::WriteAllText($dadosJs, $txt, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "$mudou campo(s) preenchidos em $dadosJs"
}

# ------------------------------------------------------- o que ainda falta --
if (Test-Path $dadosJs) {
  $txt = [System.IO.File]::ReadAllText($dadosJs, [System.Text.Encoding]::UTF8)
  $blocos = [regex]::Matches($txt, '(?s)\{\s*id:"(?<id>[^"]+)".*?depoimento:')
  $faltando = @()
  foreach ($b in $blocos) {
    $id = $b.Groups['id'].Value
    $falta = @()
    if ($b.Value -match 'url:""')  { $falta += 'url' }
    if ($b.Value -match 'capa:""') { $falta += 'capa' }
    if ($b.Value -match 'logo:""') { $falta += 'logo' }
    if ($falta.Count -gt 0) { $faltando += ("  {0,-26} falta: {1}" -f $id, ($falta -join ', ')) }
  }
  Write-Host ""
  Write-Host "PROJETOS QUE AINDA NAO APARECEM NO SITE ($($faltando.Count) de $($blocos.Count)):"
  $faltando
}

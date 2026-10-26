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
#  CELULAR: a home da loja que rola dentro do celular, no modal do projeto.
#         Capture a pagina inteira no formato celular: no Chrome, F12 > icone
#         de celular > iPhone 12 Pro (390 de largura) > menu de tres pontos >
#         "Capture full size screenshot". Feche antes pop-up e aviso de
#         cookies. Salve em  _prints\celular\<id>.png  e rode o script.
#         Sai em assets/img/portfolio/<id>-celular.jpg, 500px de largura, com
#         as 3 primeiras telas (o resto da pagina e cortado; -TelasCelular
#         muda). Passou de 200 KB, ele avisa: rode com -QualidadeCelular 65.
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
  [double]$TelasCelular  = 3,   # quantas telas de celular da home entram
  [int]$Deslocamento = 0,   # px para descer o corte, se o topo do print for feio
  [switch]$Aplicar
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$pastaPrints = Join-Path $Raiz '_prints'
# subpasta das capturas de celular: fica de fora do laco das capas
$pastaCelular = Join-Path $pastaPrints 'celular'
$celularCompleta = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($pastaCelular)
$pastaLogos  = Join-Path $Raiz '_logos'
$saidaCapas  = Join-Path $Raiz 'assets\img\portfolio'
$saidaLogos  = Join-Path $Raiz 'assets\img\logos'
$dadosJs     = Join-Path $Raiz 'assets\js\dados.js'
if (-not (Test-Path $dadosJs)) { $dadosJs = Join-Path $Raiz 'dados.js' }

foreach ($d in @($saidaCapas, $saidaLogos)) {
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
$paramsCelular = New-Object System.Drawing.Imaging.EncoderParameters(1)
$paramsCelular.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
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

function Gera-Celular($origem, $destino) {
  $img = [System.Drawing.Image]::FromFile($origem)
  try {
    # 500px de largura (o celular do modal tem ~250px: nitido em tela retina)
    # e no maximo -TelasCelular telas de 390x844 de altura: com 4, as capturas
    # de loja passavam de 200 KB; com 3, ficam entre ~130 e ~190 KB
    $largura = 500
    $alturaFonte = [Math]::Min($img.Height, [int]($img.Width * $TelasCelular * 844 / 390))
    $altura = [int]($alturaFonte * $largura / $img.Width)
    $bmp = New-Object System.Drawing.Bitmap($largura, $altura)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    # sem isto o bicubico puxa a cor de fora da imagem e escurece a borda
    $atributos = New-Object System.Drawing.Imaging.ImageAttributes
    $atributos.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $dest = New-Object System.Drawing.Rectangle(0, 0, $largura, $altura)
      $g.DrawImage($img, $dest, 0, 0, $img.Width, $alturaFonte, [System.Drawing.GraphicsUnit]::Pixel, $atributos)
    } finally { $g.Dispose(); $atributos.Dispose() }
    $bmp.Save($destino, $codecJpg, $paramsCelular)
    $bmp.Dispose()
  } finally { $img.Dispose() }
}

# ---------------------------------------------------------------- capas ----
$feitos = @{}
$capas = 0
$pesoCapas = 0
if (Test-Path $pastaPrints) {
  Get-ChildItem $pastaPrints -Include *.png,*.jpg,*.jpeg -Recurse |
  Where-Object { -not $_.FullName.StartsWith($celularCompleta + '\', [System.StringComparison]::OrdinalIgnoreCase) } |
  ForEach-Object {
    $id = $_.BaseName.ToLower()
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
    $destino = Join-Path $saidaLogos "$id.png"
    Redimensiona-Logo $_.FullName $destino
    Write-Host ("  logo  {0,-26} altura {1}px" -f $id, $AlturaLogo)
    if (-not $feitos.ContainsKey($id)) { $feitos[$id] = @{} }
    $feitos[$id].logo = "assets/img/logos/$id.png"
    $logos++
  }
} else { Write-Host "  (pasta _logos nao existe — pulei os logos)" }

# -------------------------------------------------------------- celular ----
$celulares = 0
if (Test-Path $pastaCelular) {
  Get-ChildItem $pastaCelular -Include *.png,*.jpg,*.jpeg -Recurse | ForEach-Object {
    $id = $_.BaseName.ToLower()
    $destino = Join-Path $saidaCapas "$id-celular.jpg"
    Gera-Celular $_.FullName $destino
    $kb = [int]((Get-Item $destino).Length / 1KB)
    $aviso = if ($kb -gt 200) { "  << ACIMA DE 200 KB - baixe -QualidadeCelular" } else { "" }
    Write-Host ("  celular {0,-24} 500px  {1} KB{2}" -f $id, $kb, $aviso)
    if (-not $feitos.ContainsKey($id)) { $feitos[$id] = @{} }
    $feitos[$id].celular = "assets/img/portfolio/$id-celular.jpg"
    $celulares++
  }
}

Write-Host ""
Write-Host "$capas capa(s), $minis mini(s), $logos logo(s) e $celulares celular(es) gerados."
if ($capas -gt 0) { Write-Host ("Peso somado das capas: {0} KB (media {1} KB). Orcamento: 200 KB por capa." -f $pesoCapas, [int]($pesoCapas/$capas)) }

# ------------------------------------------------- escreve no dados.js ----
if ($Aplicar -and (Test-Path $dadosJs)) {
  $txt = [System.IO.File]::ReadAllText($dadosJs, [System.Text.Encoding]::UTF8)
  $mudou = 0
  foreach ($id in $feitos.Keys) {
    foreach ($campo in @('capa','logo','celular')) {
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

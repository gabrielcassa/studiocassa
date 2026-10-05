# =============================================================================
#  prepara-imagens.ps1 — Studio Cassa
#
#  Pega os prints crus que voce salvou e devolve as capas do portfolio no
#  tamanho exato que o site espera, com o nome certo: RETRATO 800x1200 (2:3),
#  porque o card do carrossel e vertical (mudou em 04/10/2026; antes era
#  1200x900 paisagem). Use foto de marca, nao print da home — o card mostra
#  a foto inteira. Pode ser colorida: o site deixa em preto e branco.
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
#  LOGOS: mesma ideia, pasta  _logos , PNG com fundo transparente.
#         Saem em assets/img/logos/<id>.png com 100px de altura: o dobro do
#         maior tamanho em que o site mostra um logo (48px no card), nitido
#         em tela retina. Era 200px ate 05/10/2026 — pesava ate 4x mais sem
#         ganhar nitidez, porque logo pequeno so era ampliado.
#
#  Precisa so do Windows (System.Drawing). Nao instala nada.
# =============================================================================

param(
  [string]$Raiz     = ".",
  [int]$Largura     = 800,
  [int]$Altura      = 1200,
  [int]$AlturaLogo  = 100,
  [int]$Qualidade   = 82,
  [int]$Deslocamento = 0,   # px para descer o corte, se o topo do print for feio
  [switch]$Aplicar
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$pastaPrints = Join-Path $Raiz '_prints'
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

# ---------------------------------------------------------------- capas ----
$feitos = @{}
$capas = 0
$pesoCapas = 0
if (Test-Path $pastaPrints) {
  Get-ChildItem $pastaPrints -Include *.png,*.jpg,*.jpeg -Recurse | ForEach-Object {
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

Write-Host ""
Write-Host "$capas capa(s) e $logos logo(s) gerados."
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

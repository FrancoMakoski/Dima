param([switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$sourceRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$projectRoot = [IO.Path]::GetFullPath((Join-Path $sourceRoot '..'))
$targetRoot = [IO.Path]::GetFullPath((Join-Path $projectRoot 'Web 1.0'))
$distRoot = Join-Path $sourceRoot 'dist'
$expectedRemote = 'https://github.com/FrancoMakoski/dmitry-kazakov-psicolog.git'
if ((git -C $targetRoot remote get-url origin) -ne $expectedRemote) { throw 'Destino Git incorrecto.' }
if ((git -C $targetRoot branch --show-current) -ne 'main') { throw 'El destino debe estar en main.' }
if (git -C $targetRoot status --porcelain) { throw 'El destino tiene cambios: revisarlos antes de sincronizar.' }
git -C $targetRoot fetch origin
if ($LASTEXITCODE -ne 0) { throw 'No se pudo actualizar origin.' }
if ((git -C $targetRoot rev-parse HEAD) -ne (git -C $targetRoot rev-parse origin/main)) { throw 'main y origin/main difieren.' }

Push-Location $sourceRoot
try {
  if (!$SkipBuild) {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Build fallido.' }
  }
  & node scripts/verify-build.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Verificacion de dist fallida.' }
} finally { Pop-Location }

$releaseStamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
$releaseDir = Join-Path $projectRoot "Verificaciones\$releaseStamp-migracion-3.0"
New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null
$before = git -C $targetRoot rev-parse HEAD
$archivePath = Join-Path $releaseDir 'produccion-anterior.zip'
git -C $targetRoot archive --format=zip "--output=$archivePath" HEAD
if ($LASTEXITCODE -ne 0) { throw 'No se pudo respaldar produccion.' }

$keep = @('.gitignore', '.hostinger.json', 'package.json', 'push-dima.bat', 'README.md')
$files = @(Get-ChildItem -LiteralPath $distRoot -File -Recurse -Force)
$manifest = @{}
foreach ($item in $files) {
  $relative = [IO.Path]::GetRelativePath($distRoot, $item.FullName).Replace('\', '/')
  $manifest[$relative] = (Get-FileHash -LiteralPath $item.FullName -Algorithm SHA256).Hash
}
$removed = @()
foreach ($tracked in (git -C $targetRoot ls-files)) {
  if (($keep -contains $tracked) -or $manifest.ContainsKey($tracked)) { continue }
  $destination = [IO.Path]::GetFullPath((Join-Path $targetRoot $tracked))
  if (!$destination.StartsWith($targetRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Ruta fuera del destino.' }
  if (Test-Path -LiteralPath $destination -PathType Leaf) {
    Remove-Item -LiteralPath $destination
    $removed += $tracked
  }
}
foreach ($item in $files) {
  $relative = [IO.Path]::GetRelativePath($distRoot, $item.FullName)
  $destination = [IO.Path]::GetFullPath((Join-Path $targetRoot $relative))
  if (!$destination.StartsWith($targetRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Ruta fuera del destino.' }
  New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
  Copy-Item -LiteralPath $item.FullName -Destination $destination -Force
  if ((Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $item.FullName -Algorithm SHA256).Hash) { throw "Copia distinta: $relative" }
}
$result = [ordered]@{
  preparedAt = (Get-Date).ToString('o')
  source = $sourceRoot
  sourceCommit = (git -C $sourceRoot rev-parse HEAD)
  previousProductionCommit = $before
  target = $targetRoot
  files = $manifest
  removedLegacyFiles = $removed
  published = $false
}
$result | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $releaseDir 'release-manifest.json') -Encoding utf8
Write-Output "Preparado y verificado: $releaseDir"
Write-Output 'Revisar git diff del destino, crear commit, hacer push y verificar Hostinger/dominio. Este script no publica.'

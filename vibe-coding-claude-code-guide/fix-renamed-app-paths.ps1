$ErrorActionPreference = 'Stop'

$logPath = 'D:\workspace\ai-agent-lab\vibe-coding-claude-code-guide\fix-renamed-app-paths.log'
Start-Transcript -LiteralPath $logPath -Force | Out-Null

try {
  $principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
  if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Please run this script as administrator.'
  }

  $oldToolName = -join ([char[]](0xB3C4, 0xAD6C))
  $oldEtcName = -join ([char[]](0xAE30, 0xD0C0))
  $oldTool = 'D:\' + $oldToolName + '\'
  $oldEtc = 'D:\' + $oldEtcName + '\'
  $newTool = 'D:\tool\'
  $newEtc = 'D:\etc\'

  function Replace-OldPath {
    param([string]$Value)
    if ($null -eq $Value) { return $Value }
    return $Value.Replace($oldTool, $newTool).Replace($oldEtc, $newEtc)
  }

  function Update-RegistryTree {
    param([Microsoft.Win32.RegistryKey]$Root)

    foreach ($valueName in $Root.GetValueNames()) {
      $kind = $Root.GetValueKind($valueName)
      $value = $Root.GetValue($valueName, $null, [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
      if ($value -is [string]) {
        $newValue = Replace-OldPath $value
        if ($newValue -ne $value) {
          $displayName = if ($valueName -eq '') { '(Default)' } else { $valueName }
          Write-Host "Registry: $($Root.Name) [$displayName]"
          $Root.SetValue($valueName, $newValue, $kind)
        }
      }
    }

    foreach ($subName in $Root.GetSubKeyNames()) {
      try {
        $subKey = $Root.OpenSubKey($subName, $true)
        if ($null -ne $subKey) {
          Update-RegistryTree $subKey
          $subKey.Close()
        }
      } catch {
        Write-Host "Skipped registry key: $($Root.Name)\$subName"
      }
    }
  }

  Write-Host 'Updating Docker service ImagePath ...'
  Set-ItemProperty -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Services\com.docker.service' -Name ImagePath -Value '"D:\tool\Docker\Docker\com.docker.service"'

  Write-Host 'Updating registry values under HKLM\SOFTWARE\Classes ...'
  $classes = [Microsoft.Win32.Registry]::LocalMachine.OpenSubKey('SOFTWARE\Classes', $true)
  Update-RegistryTree $classes
  $classes.Close()

  Write-Host 'Updating registry values under HKLM\SOFTWARE\WOW6432Node\Classes ...'
  $wowClasses = [Microsoft.Win32.Registry]::LocalMachine.OpenSubKey('SOFTWARE\WOW6432Node\Classes', $true)
  if ($null -ne $wowClasses) {
    Update-RegistryTree $wowClasses
    $wowClasses.Close()
  }

  Write-Host 'Updating selected app registry keys ...'
  foreach ($path in @('HKLM:\SOFTWARE\Bandizip')) {
    if (Test-Path -LiteralPath $path) {
      $key = Get-Item -LiteralPath $path
      foreach ($prop in (Get-ItemProperty -LiteralPath $path).PSObject.Properties) {
        if ($prop.Name -like 'PS*') { continue }
        if ($prop.Value -is [string]) {
          $newValue = Replace-OldPath $prop.Value
          if ($newValue -ne $prop.Value) {
            Write-Host "Registry: $path [$($prop.Name)]"
            Set-ItemProperty -LiteralPath $path -Name $prop.Name -Value $newValue
          }
        }
      }
    }
  }

  Write-Host 'Updating shortcuts ...'
  $shell = New-Object -ComObject WScript.Shell
  $linkRoots = @(
    [Environment]::GetFolderPath('Desktop'),
    [Environment]::GetFolderPath('CommonDesktopDirectory'),
    [Environment]::GetFolderPath('StartMenu'),
    [Environment]::GetFolderPath('CommonStartMenu')
  )
  Get-ChildItem $linkRoots -Recurse -Filter *.lnk -ErrorAction SilentlyContinue | ForEach-Object {
    $shortcut = $shell.CreateShortcut($_.FullName)
    $changed = $false

    $newTarget = Replace-OldPath $shortcut.TargetPath
    if ($newTarget -ne $shortcut.TargetPath) {
      $shortcut.TargetPath = $newTarget
      $changed = $true
    }

    $newWorking = Replace-OldPath $shortcut.WorkingDirectory
    if ($newWorking -ne $shortcut.WorkingDirectory) {
      $shortcut.WorkingDirectory = $newWorking
      $changed = $true
    }

    $newIcon = Replace-OldPath $shortcut.IconLocation
    if ($newIcon -ne $shortcut.IconLocation) {
      $shortcut.IconLocation = $newIcon
      $changed = $true
    }

    if ($changed) {
      Write-Host "Shortcut: $($_.FullName)"
      $shortcut.Save()
    }
  }

  Write-Host 'Done.'
} finally {
  Stop-Transcript | Out-Null
}

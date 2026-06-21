$ErrorActionPreference = 'Stop'

$workspace = 'D:\workspace\ai-agent-lab\vibe-coding-claude-code-guide'
$logPath = Join-Path $workspace 'fix-old-drive-path-registry.log'
Start-Transcript -LiteralPath $logPath -Force | Out-Null

try {
  $principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
  if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Please run this script as administrator.'
  }

  # Build Korean folder names from Unicode code points so Windows PowerShell 5.1
  # does not misread this script when loaded with a legacy code page.
  $oldToolName = -join ([char[]](0xB3C4, 0xAD6C))
  $oldEtcName = -join ([char[]](0xAE30, 0xD0C0))

  $replacements = @(
    @{ Old = 'D:\' + $oldToolName + '\'; New = 'D:\tool\' },
    @{ Old = 'D:\' + $oldToolName; New = 'D:\tool' },
    @{ Old = 'D:\' + $oldEtcName + '\'; New = 'D:\etc\' },
    @{ Old = 'D:\' + $oldEtcName; New = 'D:\etc' }
  )

  function Convert-PathValue {
    param([string]$Value)

    if ($null -eq $Value) {
      return $Value
    }

    $result = $Value
    foreach ($replacement in $replacements) {
      $result = $result.Replace($replacement.Old, $replacement.New)
    }
    return $result
  }

  function Update-RegistryKey {
    param([Microsoft.Win32.RegistryKey]$Key)

    foreach ($valueName in $Key.GetValueNames()) {
      try {
        $kind = $Key.GetValueKind($valueName)
        $value = $Key.GetValue($valueName, $null, [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)

        if ($value -is [string]) {
          $newValue = Convert-PathValue $value
          if ($newValue -ne $value) {
            $displayName = if ($valueName -eq '') { '(Default)' } else { $valueName }
            Write-Host "REG_SZ: $($Key.Name) [$displayName]"
            Write-Host "  OLD: $value"
            Write-Host "  NEW: $newValue"
            $Key.SetValue($valueName, $newValue, $kind)
          }
        } elseif ($value -is [string[]]) {
          $changed = $false
          $newItems = foreach ($item in $value) {
            $newItem = Convert-PathValue $item
            if ($newItem -ne $item) {
              $changed = $true
            }
            $newItem
          }

          if ($changed) {
            $displayName = if ($valueName -eq '') { '(Default)' } else { $valueName }
            Write-Host "REG_MULTI_SZ: $($Key.Name) [$displayName]"
            $Key.SetValue($valueName, [string[]]$newItems, $kind)
          }
        }
      } catch {
        Write-Host "Skipped value: $($Key.Name) [$valueName] - $($_.Exception.Message)"
      }
    }
  }

  function Update-RegistryTree {
    param([Microsoft.Win32.RegistryKey]$Root)

    if ($null -eq $Root) {
      return
    }

    Update-RegistryKey $Root

    foreach ($subName in $Root.GetSubKeyNames()) {
      $subKey = $null
      try {
        $subKey = $Root.OpenSubKey($subName, $true)
        if ($null -ne $subKey) {
          Update-RegistryTree $subKey
        }
      } catch {
        Write-Host "Skipped key: $($Root.Name)\$subName - $($_.Exception.Message)"
      } finally {
        if ($null -ne $subKey) {
          $subKey.Close()
        }
      }
    }
  }

  $targets = @(
    @{ Hive = [Microsoft.Win32.Registry]::CurrentUser; Path = '' },
    @{ Hive = [Microsoft.Win32.Registry]::LocalMachine; Path = 'SOFTWARE' },
    @{ Hive = [Microsoft.Win32.Registry]::LocalMachine; Path = 'SYSTEM\CurrentControlSet\Services' },
    @{ Hive = [Microsoft.Win32.Registry]::LocalMachine; Path = 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment' }
  )

  foreach ($target in $targets) {
    $label = if ($target.Path -eq '') { $target.Hive.Name } else { "$($target.Hive.Name)\$($target.Path)" }
    Write-Host "Scanning $label ..."
    $root = if ($target.Path -eq '') {
      $target.Hive
    } else {
      $target.Hive.OpenSubKey($target.Path, $true)
    }

    try {
      Update-RegistryTree $root
    } finally {
      if ($target.Path -ne '' -and $null -ne $root) {
        $root.Close()
      }
    }
  }

  Write-Host 'Done.'
} finally {
  Stop-Transcript | Out-Null
}

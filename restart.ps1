@(3000, 5173, 5174) | ForEach-Object {
  $port = $_
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object {
      try { Stop-Process -Id $_ -Force -ErrorAction Stop; "killed $_ on $port" } catch {}
    }
}

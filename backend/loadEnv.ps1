$envVars = Get-Content .env
foreach ($line in $envVars) {
    if ($line -match "^(.*?)=(.*)$") {
        Set-Item -Path env:\$matches[1] -Value $matches[2]
    }
}

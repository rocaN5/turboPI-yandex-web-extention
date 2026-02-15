Add-Type -AssemblyName PresentationFramework

# ---------------- CONFIG ----------------
$repoOwner = "rocaN5"
$repoName  = "turboPI-yandex-web-extention"
$branch    = "main"

# 🔥 НАДЁЖНЫЙ ПУТЬ
$rootPath = [Environment]::CurrentDirectory
$manifestPath = Join-Path $rootPath "manifest.json"

# ---------------- UI ----------------
$xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="TurboPI Updater"
        Height="400"
        Width="430"
        WindowStartupLocation="CenterScreen"
        ResizeMode="NoResize"
        Background="#121212">

    <Grid Margin="20">
        <Border Background="#171717"
                BorderBrush="#2d2d2d"
                BorderThickness="1"
                CornerRadius="12"
                Padding="20">

            <StackPanel>

                <TextBlock Text="TurboPI Extension"
                           FontSize="20"
                           Foreground="#ffcc00"
                           Margin="0,0,0,15"/>

                <TextBlock x:Name="LocalText"
                           Foreground="White"
                           Margin="0,0,0,5"/>

                <TextBlock x:Name="LocalDevText"
                           Foreground="Gray"
                           Margin="0,0,0,10"/>

                <TextBlock x:Name="RemoteText"
                           Foreground="White"
                           Margin="0,0,0,5"/>

                <TextBlock x:Name="RemoteDevText"
                           Foreground="Gray"
                           Margin="0,0,0,15"/>

                <ProgressBar x:Name="ProgressBar"
                             Height="16"
                             Margin="0,0,0,15"
                             Minimum="0"
                             Maximum="100"/>

                <TextBlock x:Name="StatusText"
                           Foreground="Gray"
                           Margin="0,0,0,15"/>

                <StackPanel Orientation="Horizontal"
                            HorizontalAlignment="Right">

                    <Button x:Name="UpdateButton"
                            Content="Обновить"
                            Width="110"
                            Margin="0,0,10,0"
                            Background="#ffcc00"
                            Foreground="Black"
                            Padding="8"
                            BorderBrush="#2d2d2d"/>

                    <Button x:Name="ExitButton"
                            Content="Выйти"
                            Width="80"
                            Background="#2d2d2d"
                            Foreground="White"
                            Padding="8"
                            BorderBrush="#2d2d2d"/>

                </StackPanel>

            </StackPanel>

        </Border>
    </Grid>
</Window>
"@

$reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]$xaml)
$window = [Windows.Markup.XamlReader]::Load($reader)

$LocalText      = $window.FindName("LocalText")
$LocalDevText   = $window.FindName("LocalDevText")
$RemoteText     = $window.FindName("RemoteText")
$RemoteDevText  = $window.FindName("RemoteDevText")
$ProgressBar    = $window.FindName("ProgressBar")
$StatusText     = $window.FindName("StatusText")
$UpdateButton   = $window.FindName("UpdateButton")
$ExitButton     = $window.FindName("ExitButton")

# ---------------- FUNCTIONS ----------------
function Get-LocalManifest {

    if (-not (Test-Path $manifestPath)) {
        return $null
    }

    try {
        return Get-Content $manifestPath -Raw | ConvertFrom-Json
    }
    catch {
        return $null
    }
}

function Get-RemoteManifest {

    try {
        $url = "https://raw.githubusercontent.com/$repoOwner/$repoName/$branch/manifest.json"
        return Invoke-RestMethod $url -UseBasicParsing
    }
    catch {
        return $null
    }
}

function Normalize-VersionName($v) {
    # Убираем -closed-beta и прочее для сравнения
    return ($v -split "-")[0]
}

function Start-Update {

    try {

        $UpdateButton.IsEnabled = $false
        $StatusText.Text = "Загрузка..."
        $ProgressBar.Value = 20

        $zipUrl  = "https://github.com/$repoOwner/$repoName/archive/refs/heads/$branch.zip"
        $tempZip = Join-Path $env:TEMP "turboPI_update.zip"
        $tempDir = Join-Path $env:TEMP "turboPI_update"

        if (Test-Path $tempZip) { Remove-Item $tempZip -Force }
        if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }

        Invoke-WebRequest $zipUrl -OutFile $tempZip -UseBasicParsing
        $ProgressBar.Value = 50

        Expand-Archive $tempZip -DestinationPath $tempDir -Force
        $ProgressBar.Value = 75

        $source = Join-Path $tempDir "$repoName-$branch"

        Copy-Item "$source\*" $rootPath -Recurse -Force

        Remove-Item $tempZip -Force
        Remove-Item $tempDir -Recurse -Force

        $ProgressBar.Value = 100
        $StatusText.Text = "Обновление завершено"

        [System.Windows.MessageBox]::Show("Обновление успешно установлено.","Готово")
        $window.Close()
    }
    catch {
        $StatusText.Text = "Ошибка обновления"
        [System.Windows.MessageBox]::Show($_.Exception.Message,"Ошибка")
        $UpdateButton.IsEnabled = $true
    }
}

# ---------------- INIT ----------------
$localManifest  = Get-LocalManifest
$remoteManifest = Get-RemoteManifest

if (-not $localManifest) {
    $LocalText.Text = "manifest.json не найден"
    $UpdateButton.IsEnabled = $false
}
else {

    $LocalText.Text    = "Версия: $($localManifest.version)"
    $LocalDevText.Text = "Dev: $($localManifest.version_name)"
}

if (-not $remoteManifest) {
    $RemoteText.Text = "Ошибка подключения к GitHub"
    $UpdateButton.IsEnabled = $false
}
else {

    $RemoteText.Text    = "GitHub версия: $($remoteManifest.version)"
    $RemoteDevText.Text = "GitHub Dev: $($remoteManifest.version_name)"
}

# 🔥 Сравнение по version_name
if ($localManifest -and $remoteManifest) {

    $localCompare  = Normalize-VersionName $localManifest.version_name
    $remoteCompare = Normalize-VersionName $remoteManifest.version_name

    if ([version]$remoteCompare -le [version]$localCompare) {
        $UpdateButton.IsEnabled = $false
        $StatusText.Text = "Установлена актуальная версия"
    }
}

$UpdateButton.Add_Click({ Start-Update })
$ExitButton.Add_Click({ $window.Close() })

$window.ShowDialog() | Out-Null

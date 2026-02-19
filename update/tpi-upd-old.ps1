Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName System.Windows.Forms  # для DoEvents

# ---------------- SYSTEM ----------------
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'SilentlyContinue'

# ---------------- CONFIG ----------------
$repoOwner = "rocaN5"
$repoName  = "turboPI-yandex-web-extention"
$branch    = "main"

# ---------------- PATHS ----------------
$rootPath     = [System.AppDomain]::CurrentDomain.BaseDirectory
$manifestPath = Join-Path $rootPath "manifest.json"
$iconPath     = Join-Path $rootPath "img\piTurboIcon.png"

# ---------------- UI ----------------
$xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="TurboPI Updater"
        Height="600"
        Width="500"
        WindowStartupLocation="CenterScreen"
        ResizeMode="NoResize"
        Background="#121212">

    <Window.Resources>
        <Style x:Key="ModernButton" TargetType="Button">
            <Setter Property="Foreground" Value="White"/>
            <Setter Property="Background" Value="#2d2d2d"/>
            <Setter Property="BorderBrush" Value="#2d2d2d"/>
            <Setter Property="BorderThickness" Value="1"/>
            <Setter Property="Padding" Value="12,8"/>
            <Setter Property="MinHeight" Value="38"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="FontWeight" Value="Bold"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border x:Name="Border"
                                Background="{TemplateBinding Background}"
                                BorderBrush="{TemplateBinding BorderBrush}"
                                BorderThickness="1"
                                CornerRadius="12"
                                Padding="{TemplateBinding Padding}">
                            <ContentPresenter HorizontalAlignment="Center"
                                            VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="Border"
                                        Property="Background"
                                        Value="#3a3a3a"/>
                            </Trigger>
                            <Trigger Property="IsPressed" Value="True">
                                <Setter TargetName="Border"
                                        Property="Background"
                                        Value="#1f1f1f"/>
                            </Trigger>
                            <Trigger Property="IsEnabled" Value="False">
                                <Setter Property="Opacity" Value="0.5"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>

        <Style x:Key="PrimaryButton"
               TargetType="Button"
               BasedOn="{StaticResource ModernButton}">
            <Setter Property="Background" Value="#ffcc00"/>
            <Setter Property="Foreground" Value="Black"/>
            <Style.Triggers>
                <Trigger Property="IsMouseOver" Value="True">
                    <Setter Property="Background" Value="#ffd633"/>
                </Trigger>
                <Trigger Property="IsPressed" Value="True">
                    <Setter Property="Background" Value="#e6b800"/>
                </Trigger>
                <Trigger Property="IsEnabled" Value="False">
                    <Setter Property="Background" Value="#666666"/>
                    <Setter Property="Foreground" Value="#999999"/>
                </Trigger>
            </Style.Triggers>
        </Style>
    </Window.Resources>

    <Grid Margin="20">
        <Border Background="#171717"
                BorderBrush="#2d2d2d"
                BorderThickness="1"
                CornerRadius="16"
                Padding="25">

            <StackPanel>
                <!-- Заголовок с иконкой -->
                <StackPanel Orientation="Horizontal" 
                           HorizontalAlignment="Center" 
                           Margin="0,0,0,20">
                    <Image Source="$iconPath" 
                           Width="150" 
                           Height="150" 
                           Margin="0,0,15,0"/>
                    <TextBlock Text="TurboPI Extension"
                               FontSize="28"
                               FontWeight="Bold"
                               Foreground="#ffcc00"
                               VerticalAlignment="Center"/>
                </StackPanel>

                <!-- Информация о версиях -->
                <Border Background="#1e1e1e"
                        CornerRadius="12"
                        Padding="15"
                        Margin="0,0,0,20">
                    <StackPanel>
                        <TextBlock Foreground="#ffcc00" 
                                   FontSize="14" 
                                   FontWeight="Bold" 
                                   Text="УСТАНОВЛЕННАЯ ВЕРСИЯ:" 
                                   Margin="0,0,0,5"/>
                        
                        <Grid Margin="0,0,0,10">
                            <Grid.ColumnDefinitions>
                                <ColumnDefinition Width="Auto"/>
                                <ColumnDefinition Width="*"/>
                            </Grid.ColumnDefinitions>
                            <Grid.RowDefinitions>
                                <RowDefinition Height="Auto"/>
                                <RowDefinition Height="Auto"/>
                            </Grid.RowDefinitions>
                            
                            <TextBlock Grid.Row="0" Grid.Column="0" 
                                       Text="Версия: " 
                                       Foreground="#999999" 
                                       Margin="0,0,10,5"/>
                            <TextBlock Grid.Row="0" Grid.Column="1" 
                                       x:Name="LocalVersion" 
                                       Foreground="White" 
                                       FontWeight="Bold"
                                       Margin="0,0,0,5"/>
                            
                            <TextBlock Grid.Row="1" Grid.Column="0" 
                                       Text="Версия разработки: " 
                                       Foreground="#999999" 
                                       Margin="0,0,10,0"/>
                            <TextBlock Grid.Row="1" Grid.Column="1" 
                                       x:Name="LocalVersionName" 
                                       Foreground="White" 
                                       FontWeight="Bold"/>
                        </Grid>

                        <TextBlock Foreground="#ffcc00" 
                                   FontSize="14" 
                                   FontWeight="Bold" 
                                   Text="ДОСТУПНАЯ ВЕРСИЯ:" 
                                   Margin="0,10,0,5"/>
                        
                        <Grid>
                            <Grid.ColumnDefinitions>
                                <ColumnDefinition Width="Auto"/>
                                <ColumnDefinition Width="*"/>
                            </Grid.ColumnDefinitions>
                            <Grid.RowDefinitions>
                                <RowDefinition Height="Auto"/>
                                <RowDefinition Height="Auto"/>
                            </Grid.RowDefinitions>
                            
                            <TextBlock Grid.Row="0" Grid.Column="0" 
                                       Text="Версия: " 
                                       Foreground="#999999" 
                                       Margin="0,0,10,5"/>
                            <TextBlock Grid.Row="0" Grid.Column="1" 
                                       x:Name="RemoteVersion" 
                                       Foreground="White" 
                                       FontWeight="Bold"
                                       Margin="0,0,0,5"/>
                            
                            <TextBlock Grid.Row="1" Grid.Column="0" 
                                       Text="Версия разработки: " 
                                       Foreground="#999999" 
                                       Margin="0,0,10,0"/>
                            <TextBlock Grid.Row="1" Grid.Column="1" 
                                       x:Name="RemoteVersionName" 
                                       Foreground="White" 
                                       FontWeight="Bold"/>
                        </Grid>
                    </StackPanel>
                </Border>

                <ProgressBar x:Name="ProgressBar"
                             Height="18"
                             Margin="0,0,0,10"
                             Minimum="0"
                             Maximum="100"
                             Value="0"
                             Foreground="#ffcc00"
                             Background="#2d2d2d"/>

                <TextBlock x:Name="StatusText"
                           Foreground="Gray"
                           FontSize="14" 
                           FontWeight="Bold" 
                           TextAlignment="center"
                           Margin="0,0,0,15"/>

                <!-- Кнопки по центру -->
                <StackPanel Orientation="Horizontal"
                            HorizontalAlignment="Center"
                            Margin="0,0,0,15">
                    <Button x:Name="UpdateButton"
                            Content="ОБНОВИТЬ"
                            Width="130"
                            Height="40"
                            Margin="0,0,10,0"
                            Style="{StaticResource PrimaryButton}"/>
                    <Button x:Name="ExitButton"
                            Content="ЗАКРЫТЬ"
                            Width="130"
                            Height="40"
                            Style="{StaticResource ModernButton}"/>
                </StackPanel>

                <!-- Статус обновления -->
                <TextBlock x:Name="UpdateStatusText"
                           FontWeight="Bold"
                           FontSize="14"
                           TextAlignment="Center"
                           HorizontalAlignment="Center"
                           Text="Проверка обновлений..."/>

            </StackPanel>

        </Border>
    </Grid>
</Window>
"@

$reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]$xaml)
$window = [Windows.Markup.XamlReader]::Load($reader)

# Получаем элементы управления
$LocalVersion        = $window.FindName("LocalVersion")
$LocalVersionName    = $window.FindName("LocalVersionName")
$RemoteVersion       = $window.FindName("RemoteVersion")
$RemoteVersionName   = $window.FindName("RemoteVersionName")
$ProgressBar         = $window.FindName("ProgressBar")
$StatusText          = $window.FindName("StatusText")
$UpdateStatusText    = $window.FindName("UpdateStatusText")
$UpdateButton        = $window.FindName("UpdateButton")
$ExitButton          = $window.FindName("ExitButton")

# ---------------- VERSION PARSER ----------------
function Parse-Version($v) {
    if (-not $v) { return @{ Major=0; Minor=0; Patch=0; Dev=0 } }

    $dev = 0
    if ($v -match "_dev(\d+)") {
        $dev = [int]$Matches[1]
        $v   = $v.Split("_")[0]
    }

    $parts = $v.Split(".")
    return @{
        Major = if ($parts.Count -ge 1) { [int]$parts[0] } else { 0 }
        Minor = if ($parts.Count -ge 2) { [int]$parts[1] } else { 0 }
        Patch = if ($parts.Count -ge 3) { [int]$parts[2] } else { 0 }
        Dev   = $dev
    }
}

# ---------------- DOWNLOAD WITH REAL PROGRESS ----------------
function Download-File($url, $destination) {
    $request  = [System.Net.HttpWebRequest]::Create($url)
    $response = $request.GetResponse()
    $total    = $response.ContentLength
    
    $startTime = Get-Date
    $stream   = $response.GetResponseStream()
    $file     = [System.IO.File]::Create($destination)

    $buffer = New-Object byte[] 8192
    $read   = 0
    $sum    = 0

    while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
        $file.Write($buffer, 0, $read)
        $sum += $read

        if ($total -gt 0) {
            $percent = [math]::Round(($sum / $total) * 100, 0)
            $ProgressBar.Value = $percent
            
            $elapsed = (Get-Date) - $startTime
            $downloadedMB = [math]::Round($sum / 1MB, 2)
            $totalMB = [math]::Round($total / 1MB, 2)
            
            # Защита от деления на ноль в начале загрузки
            if ($percent -gt 0) {
                $totalSeconds = $elapsed.TotalSeconds * (100 / $percent)
                $remainingSeconds = $totalSeconds - $elapsed.TotalSeconds
                if ($remainingSeconds -lt 0) { $remainingSeconds = 0 }
                $remainingTime = [timespan]::FromSeconds($remainingSeconds)
                $timeString = "{0:hh}:{0:mm}:{0:ss}" -f $remainingTime
            } else {
                $timeString = "--:--:--"
            }
            
            $StatusText.Text = "Осталось: $timeString | Загружено: ${downloadedMB}MB / ${totalMB}MB"
            
            # Принудительно обновляем интерфейс и обрабатываем сообщения
            $window.Dispatcher.Invoke([Action]{}, [System.Windows.Threading.DispatcherPriority]::Render)
            [System.Windows.Forms.Application]::DoEvents()
        }
    }

    $file.Close()
    $stream.Close()
    $response.Close()
}

# ---------------- UPDATE ----------------
function Start-Update {
    try {
        $UpdateButton.IsEnabled = $false
        $ProgressBar.Value = 0
        $StatusText.Text = "Начинаем обновление..."
        $UpdateStatusText.Text = ""

        $zipUrl  = "https://github.com/$repoOwner/$repoName/archive/refs/heads/$branch.zip"
        $tempZip = Join-Path $env:TEMP "turboPI_update.zip"
        $tempDir = Join-Path $env:TEMP "turboPI_update"

        Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
        Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

        Download-File $zipUrl $tempZip

        $StatusText.Text = "Распаковка..."
        $ProgressBar.Value = 100

        Expand-Archive $tempZip -DestinationPath $tempDir -Force

        $source  = Join-Path $tempDir "$repoName-$branch"
        $exePath = [System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName
        $exeName = [System.IO.Path]::GetFileName($exePath)

        $batchFile = Join-Path $env:TEMP "turboPI_updater.cmd"

        $batchContent = @"
@echo off
timeout /t 2 /nobreak > nul
taskkill /IM "$exeName" /F > nul 2>&1
xcopy "$source\*" "$rootPath\" /E /Y /Q > nul
start "" "$exePath"
rd /s /q "$tempDir"
del "$tempZip"
del "%~f0"
"@

        Set-Content $batchFile $batchContent -Encoding ASCII
        Start-Process $batchFile -WindowStyle Hidden

        $window.Close()
    }
    catch {
        $StatusText.Text = "Ошибка обновления: $_"
        $UpdateButton.IsEnabled = $true
        $UpdateStatusText.Text = "Ошибка при обновлении!"
        $UpdateStatusText.Foreground = "#FF4444"
    }
}

# ---------------- INIT ----------------
function Get-LocalManifest {
    if (Test-Path $manifestPath) {
        try { return Get-Content $manifestPath -Raw | ConvertFrom-Json }
        catch { return $null }
    }
    return $null
}

function Get-RemoteManifest {
    try {
        $url = "https://raw.githubusercontent.com/$repoOwner/$repoName/$branch/manifest.json"
        return Invoke-RestMethod $url -UseBasicParsing
    }
    catch { return $null }
}

$local  = Get-LocalManifest
$remote = Get-RemoteManifest

if ($local) {
    $LocalVersion.Text = $local.version
    $LocalVersionName.Text = $local.version_name
}

if ($remote) {
    $RemoteVersion.Text = $remote.version
    $RemoteVersionName.Text = $remote.version_name
}

if ($local -and $remote) {
    $l = Parse-Version $local.version_name
    $r = Parse-Version $remote.version_name

    if (
        $r.Major -gt $l.Major -or
        ($r.Major -eq $l.Major -and $r.Minor -gt $l.Minor) -or
        ($r.Major -eq $l.Major -and $r.Minor -eq $l.Minor -and $r.Patch -gt $l.Patch) -or
        ($r.Major -eq $l.Major -and $r.Minor -eq $l.Minor -and $r.Patch -eq $l.Patch -and $r.Dev -gt $l.Dev)
    ) {
        $UpdateStatusText.Text = "Доступно обновление !"
        $UpdateStatusText.Foreground = "#4CAF50"
        $UpdateButton.IsEnabled = $true
        $StatusText.Text = "Доступна новая версия!"
        $StatusText.Foreground = "#4CAF50"
    }
    else {
        $UpdateStatusText.Text = "Обновлений нет"
        $UpdateStatusText.Foreground = "#ffcc00"
        $UpdateButton.IsEnabled = $false
        $StatusText.Text = "Установлена актуальная версия"
        $StatusText.Foreground = "#ffcc00"
    }
} elseif (-not $remote) {
    $UpdateStatusText.Text = "Не удалось проверить обновления"
    $UpdateStatusText.Foreground = "#FF4444"
    $StatusText.Text = "Ошибка подключения к GitHub"
        $StatusText.Foreground = "#FF4444"
}

$UpdateButton.Add_Click({ Start-Update })
$ExitButton.Add_Click({ $window.Close() })

$window.ShowDialog() | Out-Null
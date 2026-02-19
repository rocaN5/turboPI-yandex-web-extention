Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName PresentationCore

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
$exePath      = [System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName
$exeName      = [System.IO.Path]::GetFileName($exePath)
$desktopPath  = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopPath "TurboPI Updater.lnk"

# ---------------- CREATE SHORTCUT ----------------
function Create-Shortcut {
    try {
        if (-not (Test-Path $shortcutPath)) {
            $shell = New-Object -ComObject WScript.Shell
            $shortcut = $shell.CreateShortcut($shortcutPath)
            $shortcut.TargetPath = $exePath
            $shortcut.Description = "TurboPI Extension Updater"
            $shortcut.WorkingDirectory = $rootPath
            
            if (Test-Path $exePath) {
                $shortcut.IconLocation = "$exePath,0"
            }
            
            $shortcut.Save()
        }
    }
    catch {
        # Игнорируем ошибки создания ярлыка
    }
}

Create-Shortcut

# ---------------- UI ----------------
$xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="TurboPI Updater"
        Height="720"
        Width="500"
        WindowStartupLocation="CenterScreen"
        ResizeMode="NoResize"
        Background="#121212"
        Topmost="True">

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

                <!-- Детальный прогресс -->
                <Border Background="#1e1e1e"
                        CornerRadius="12"
                        Padding="15"
                        Margin="0,0,0,20">
                    <StackPanel>
                        <TextBlock x:Name="CurrentOperationText"
                                   Foreground="#ffcc00"
                                   FontSize="12"
                                   FontWeight="Bold"
                                   Text="Ожидание..."
                                   Margin="0,0,0,5"/>
                        
                        <ProgressBar x:Name="ProgressBar"
                                     Height="18"
                                     Margin="0,0,0,8"
                                     Minimum="0"
                                     Maximum="100"
                                     Value="0"
                                     Foreground="#ffcc00"
                                     Background="#2d2d2d"/>
                        
                        <TextBlock x:Name="ProgressDetailsText"
                                   Foreground="#999999"
                                   FontSize="11"
                                   TextAlignment="Center"
                                   Text="0%"/>
                    </StackPanel>
                </Border>

                <TextBlock x:Name="StatusText"
                           Foreground="Gray"
                           FontSize="16" 
                           FontWeight="Bold" 
                           TextAlignment="Center"
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

                <!-- Информация о разработчике -->
                <StackPanel Orientation="Horizontal"
                            HorizontalAlignment="Center"
                            Margin="0,10,0,0">
                    <TextBlock Text="Разработчик: "
                               Foreground="#e8e8e8"
                               FontSize="12"
                               VerticalAlignment="Center"/>
                    <TextBlock x:Name="DeveloperLink"
                               Text="@sheva_r6"
                               Foreground="#ffcc00"
                               FontSize="12"
                               FontWeight="Bold"
                               Cursor="Hand"
                               VerticalAlignment="Center"/>
                </StackPanel>
            </StackPanel>
        </Border>
    </Grid>
</Window>
"@

$reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]$xaml)
try {
    $window = [Windows.Markup.XamlReader]::Load($reader)
}
catch {
    [System.Windows.Forms.MessageBox]::Show("Ошибка загрузки интерфейса: $_", "Ошибка", "OK", "Error")
    exit
}

# Получаем элементы управления
$LocalVersion        = $window.FindName("LocalVersion")
$LocalVersionName    = $window.FindName("LocalVersionName")
$RemoteVersion       = $window.FindName("RemoteVersion")
$RemoteVersionName   = $window.FindName("RemoteVersionName")
$ProgressBar         = $window.FindName("ProgressBar")
$CurrentOperationText= $window.FindName("CurrentOperationText")
$ProgressDetailsText = $window.FindName("ProgressDetailsText")
$StatusText          = $window.FindName("StatusText")
$UpdateButton        = $window.FindName("UpdateButton")
$ExitButton          = $window.FindName("ExitButton")
$DeveloperLink       = $window.FindName("DeveloperLink")

# Проверяем, что все элементы найдены
if (-not $ProgressBar -or -not $UpdateButton) {
    [System.Windows.Forms.MessageBox]::Show("Не удалось загрузить элементы интерфейса", "Ошибка", "OK", "Error")
    exit
}

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

# ---------------- SMOOTH PROGRESS ----------------
function Update-SmoothProgress {
    param($TargetPercent, $Operation, $Details)
    
    $currentValue = $ProgressBar.Value
    
    # Плавно анимируем изменение процентов
    while ($currentValue -lt $TargetPercent) {
        $currentValue += [Math]::Min(2, $TargetPercent - $currentValue)
        
        $window.Dispatcher.Invoke([Action]{
            $ProgressBar.Value = $currentValue
            $ProgressDetailsText.Text = "$([Math]::Round($currentValue, 0))%"
            if ($Operation) { $CurrentOperationText.Text = $Operation }
            if ($Details) { $StatusText.Text = $Details }
        }, [System.Windows.Threading.DispatcherPriority]::Normal)
        
        Start-Sleep -Milliseconds 20
        [System.Windows.Forms.Application]::DoEvents()
    }
    
    # Финальное обновление
    $window.Dispatcher.Invoke([Action]{
        $ProgressBar.Value = $TargetPercent
        $ProgressDetailsText.Text = "$TargetPercent%"
    }, [System.Windows.Threading.DispatcherPriority]::Normal)
}

# ---------------- DOWNLOAD WITH PROGRESS ----------------
function Download-File {
    param($url, $destination)
    
    # Получаем размер файла
    try {
        $request = [System.Net.HttpWebRequest]::Create($url)
        $request.Method = "HEAD"
        $response = $request.GetResponse()
        $totalBytes = $response.ContentLength
        $response.Close()
    }
    catch {
        $totalBytes = 0
    }
    
    # Создаем WebClient
    $webClient = New-Object System.Net.WebClient
    
    # Регистрируем событие прогресса
    $webClient.add_DownloadProgressChanged({
        $percent = [math]::Round(($_.BytesReceived / $_.TotalBytesToReceive) * 100, 0)
        $downloadedMB = [math]::Round($_.BytesReceived / 1MB, 2)
        $totalMB = [math]::Round($_.TotalBytesToReceive / 1MB, 2)
        
        $window.Dispatcher.Invoke([Action]{
            # Плавно обновляем прогресс
            $currentValue = $ProgressBar.Value
            $step = [Math]::Max(1, $percent - $currentValue)
            
            for ($i = 1; $i -le $step; $i++) {
                $newValue = $currentValue + $i
                $ProgressBar.Value = $newValue
                $ProgressDetailsText.Text = "$newValue%"
                $CurrentOperationText.Text = "Скачивание обновления..."
                $StatusText.Text = "Загружено: ${downloadedMB}MB / ${totalMB}MB"
                
                Start-Sleep -Milliseconds 5
                [System.Windows.Forms.Application]::DoEvents()
            }
        }, [System.Windows.Threading.DispatcherPriority]::Normal)
    })
    
    try {
        Update-SmoothProgress -TargetPercent 0 -Operation "Скачивание обновления..." -Details "Подключение к GitHub..."
        $webClient.DownloadFile($url, $destination)
    }
    finally {
        $webClient.Dispose()
    }
}

# ---------------- UPDATE ----------------
function Start-Update {
    try {
        $window.Dispatcher.Invoke([Action]{
            $UpdateButton.IsEnabled = $false
            $ExitButton.IsEnabled = $false
        })
        
        Update-SmoothProgress -TargetPercent 0 -Operation "Подготовка..." -Details "Начинаем обновление..."

        $zipUrl  = "https://github.com/$repoOwner/$repoName/archive/refs/heads/$branch.zip"
        $tempZip = Join-Path $env:TEMP "turboPI_update.zip"
        $tempDir = Join-Path $env:TEMP "turboPI_update"

        Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
        Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

        # Скачивание с прогрессом
        Download-File $zipUrl $tempZip

        # Распаковка с прогрессом
        Update-SmoothProgress -TargetPercent 100 -Operation "Распаковка..." -Details "Извлечение файлов..."
        
        # Создаем директорию и распаковываем
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        
        # Используем Shell.Application для распаковки
        $shell = New-Object -ComObject Shell.Application
        $zip = $shell.NameSpace($tempZip)
        $dest = $shell.NameSpace($tempDir)
        
        # Копируем файлы
        $items = $zip.Items()
        $totalItems = $items.Count
        $currentItem = 0
        
        foreach ($item in $items) {
            $dest.CopyHere($item, 0x14)
            $currentItem++
            $percent = if ($totalItems -gt 0) { [math]::Round(($currentItem / $totalItems) * 100, 0) } else { 100 }
            Update-SmoothProgress -TargetPercent $percent -Operation "Распаковка..." -Details "Извлечение файлов... $percent%"
            Start-Sleep -Milliseconds 20
        }

        $source = Join-Path $tempDir "$repoName-$branch"

        # Создание bat файла для обновления
        $batchFile = Join-Path $env:TEMP "turboPI_updater.cmd"
        $batchContent = @"
@echo off
chcp 65001 > nul
timeout /t 2 /nobreak > nul
taskkill /IM "$exeName" /F > nul 2>&1
xcopy "$source\*" "$rootPath\" /E /Y /Q > nul
start "" "$exePath"
rd /s /q "$tempDir"
del "$tempZip"
del "%~f0"
"@

        Set-Content $batchFile $batchContent -Encoding ASCII
        
        # Финальная анимация
        for ($i = 90; $i -le 100; $i += 2) {
            Update-SmoothProgress -TargetPercent $i -Operation "Завершение..." -Details "Обновление готово к установке... $i%"
            Start-Sleep -Milliseconds 30
        }
        
        Update-SmoothProgress -TargetPercent 100 -Operation "Завершение..." -Details "Обновление готово к установке!"
        Start-Process $batchFile -WindowStyle Hidden

        $window.Dispatcher.Invoke([Action]{ $window.Close() })
    }
    catch {
        $window.Dispatcher.Invoke([Action]{
            $StatusText.Text = "Ошибка обновления: $_"
            $StatusText.Foreground = "#FF4444"
            $UpdateButton.IsEnabled = $true
            $ExitButton.IsEnabled = $true
            Update-SmoothProgress -TargetPercent 0 -Operation "Ошибка" -Details $_
        })
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

# Загружаем данные
$local  = Get-LocalManifest
$remote = Get-RemoteManifest

# Обновляем UI
if ($local) {
    $LocalVersion.Text = $local.version
    $LocalVersionName.Text = $local.version_name
}

if ($remote) {
    $RemoteVersion.Text = $remote.version
    $RemoteVersionName.Text = $remote.version_name
}

# Простое сравнение - если version_name отличаются, значит есть обновление
if ($local -and $remote) {
    if ($local.version_name -ne $remote.version_name) {
        $StatusText.Text = "Доступна новая версия!"
        $StatusText.Foreground = "#ccff00"
        $UpdateButton.IsEnabled = $true
    }
    else {
        $StatusText.Text = "Обновлений нет !"
        $StatusText.Foreground = "#2bff00"
        $UpdateButton.IsEnabled = $false
    }
} elseif (-not $remote) {
    $StatusText.Text = "Ошибка подключения"
    $StatusText.Foreground = "#FF4444"
}

# ---------------- EVENTS ----------------
$UpdateButton.Add_Click({ Start-Update })
$ExitButton.Add_Click({ $window.Close() })

# Обработчик клика по ссылке разработчика
$DeveloperLink.Add_MouseLeftButtonDown({
    Start-Process "https://rocan5.github.io/contacts/"
})

$window.ShowDialog() | Out-Null
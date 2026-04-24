# 精简部署脚本：只保留图片文件
$deploy = "c:\Users\lithos\Desktop\portfolio\goodent-deploy"
$projectsDir = "$deploy\public\projects"

Write-Output "=== 开始清理 public/projects ==="

$totalBefore = (Get-ChildItem $projectsDir -Recurse -File | Measure-Object Length -Sum).Sum / 1MB
Write-Output "清理前大小: $([Math]::Round($totalBefore, 1)) MB"
$fileCountBefore = (Get-ChildItem $projectsDir -Recurse -File).Count

# 删除非图片文件（保留 .png .jpg .jpeg .gif .svg）
$imageExtensions = @('.png', '.jpg', '.jpeg', '.gif', '.svg')
Get-ChildItem $projectsDir -Recurse -File | ForEach-Object {
    $ext = $_.Extension.ToLower()
    if ($imageExtensions -notcontains $ext) {
        Remove-Item $_.FullName -Force
    }
}

# 清理空目录
do {
    $emptyDirs = Get-ChildItem $projectsDir -Recurse -Directory | Where-Object { 
        @(Get-ChildItem $_.FullName -Recurse -File).Count -eq 0 
    }
    foreach ($dir in $emptyDirs) { Remove-Item $dir.FullName -Force -Recurse }
} while ($emptyDirs.Count -gt 0)

$totalAfter = (Get-ChildItem $projectsDir -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum / 1MB
$fileCountAfter = (Get-ChildItem $projectsDir -Recurse -File -ErrorAction SilentlyContinue).Count

Write-Output ""
Write-Output "=== 清理结果 ==="
Write-Output "清理前: $fileCountBefore 个文件, $([Math]::Round($totalBefore, 1)) MB"
Write-Output "清理后: $fileCountAfter 个文件, $([Math]::Round($totalAfter, 1)) MB"
Write-Output "减少: $($fileCountBefore - $fileCountAfter) 个文件, 减少约 $([Math]::Round($totalBefore - $totalAfter, 1)) MB"

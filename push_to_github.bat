@echo off
chcp 65001 >nul
title AI Video Monitor - Push to GitHub

echo ========================================
echo   推送代码到 GitHub
echo ========================================
echo.
echo 正在打开 Git Bash...
echo.

REM 使用短路径名避免空格问题
start "" "C:\PROGRA~1\Git\git-bash.exe" --cd="d:\Qwork\ai-video-monitor-github" -c "git push -u origin main; echo.; echo 按任意键退出...; pause >nul"

echo.
echo Git Bash 已打开，请在弹出的窗口中完成 GitHub 登录
echo.
pause

@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在打包单文件，请稍候...
node build-single.mjs
if errorlevel 1 (
  echo.
  echo 打包失败。若提示找不到 node，请先安装 Node.js：https://nodejs.org
  pause
  exit /b 1
)
echo 完成！轻量 index.html 已生成，请把整个文件夹 push 到 GitHub。
pause

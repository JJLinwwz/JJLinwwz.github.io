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
echo 完成！请把 index.html 上传 Netlify，或本地双击打开。
pause

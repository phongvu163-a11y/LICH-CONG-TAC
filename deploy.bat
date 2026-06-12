@echo off
title Trien khai he thong Lich Cong Tac
color 0b
echo =======================================================================
echo   KICH HOAT DONG BO HOA VA TRIEN KHAI LICH CONG TAC LEN RENDER
echo =======================================================================
echo.
echo [1/4] Dang kiem tra trang thai Git local...
git status
echo.
echo [2/4] Dang stage cac tap tin thay doi...
git add .
echo.
echo [3/4] Dang ghi nhan commit phien ban moi...
git commit -m "Cap nhat phien ban he thong va tich hop Render Deploy"
echo.
echo [4/4] Dang day code len GitHub repository (main)...
echo (Luu y: Hanh dong nay se tu dong kich hoat Render bat dau xay dung lai he thong)
echo.
git push -u origin main --force
echo.
echo =======================================================================
echo   HOAN THANH CONG VIEC!
echo   * Code da duoc cap nhat len repository GitHub.
echo   * Render se bat dau build va deploy he thong trong vai phut.
echo   * URL hoat dong: https://lich-cong-tac.onrender.com
echo =======================================================================
echo.
pause

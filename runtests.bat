@set THISDIR=%~dp0
@copy "%THISDIR%\ThirdParty\imvu.node.js" "%THISDIR%\ThirdParty\imvujs\out\imvu.node.js"
@node --harmony "%THISDIR%\ThirdParty\imvujs\bin\node-runner.js" "%THISDIR%\tests.js"
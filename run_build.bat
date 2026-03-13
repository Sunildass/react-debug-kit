cd packages/react-layout-debugger
rmdir /s /q dist
npx tsc > build_output.txt 2>&1
dir dist >> build_output.txt

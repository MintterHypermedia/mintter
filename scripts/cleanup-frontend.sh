rm yarn.lock \; 2>/dev/null || true 
find . -type d -name "node_modules" -exec rm -r {} \; 2>/dev/null || true 
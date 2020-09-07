echo 'Checking front-end node dependencies...'
if [ ! -d "./node_modules" ]; then
  echo 'Running npm install...'
  npm install
fi

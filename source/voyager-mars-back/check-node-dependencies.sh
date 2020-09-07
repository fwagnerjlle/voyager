echo 'Checking back-end node dependencies...'
echo ${USER}
if [ ! -d "./node_modules" ]; then
  echo 'Running npm install...'
  npm install
fi

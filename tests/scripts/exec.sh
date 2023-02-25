if [[ $(git status --porcelain) ]]; then
  echo "Remove untracked files or uncommitted changes"
  exit 1
fi

npm run build --sourceMap
cd tests/projects/kitchensink
node --enable-source-maps ../../../bin/viject.js

npm install
npm test run

git clean -df
git reset --hard

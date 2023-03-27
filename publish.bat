
git add --all
git commit -m "update"

call npm version patch

git push --all --prune

call npm publish

exit
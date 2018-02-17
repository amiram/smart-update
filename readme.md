# smart-update

Update npm packages after git merge/pull only if dependencies were changed.

## Background

Suppose you did "git pull" and your package.json was changed. You'll probably want to run `npm update`. However, you'd like to do it only if the `dependencies` or `devDependencies` sections were changed. This package will examine also the content of the dependencies and compare the old and new ones.

Use [husky](https://www.npmjs.com/package/husky) to connect the scripts to git hooks.

## Usage:

1. npm i husky @amiram/smart-update --save-dev
2. Add scripts in package.json

<pre>
"postmerge": "smart-update",
"postrewrite": "smart-update",
</pre>

3. Do `git pull` or `git merge`

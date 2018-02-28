# smart-update

Update npm packages after git merge/pull only if dependencies were changed.

## Background

Many projects use [husky](https://www.npmjs.com/package/husky) to update node_modules after getting changes from git. This way you can be sure that your node_modules are updated if a team member changed dependecies.

The simple way to do it is:
1. `npm i husky --save-dev`
2. Add scripts in package.json
   
   <pre>
   "postmerge": "npm update",
   "postrewrite": "npm update",
   </pre>

3. Do `git pull` or `git merge [branch]`

This may slow down your git commands a little bit. However, imagine you have many repos and you want to update all of them, this might take a huge amount of time.

A possible solution is to check if the package.json file has changed. You can do it with a simple shell script. The problem with this solution is that package.json might changed but not the dependencies in it. The most common change is the version which can be change in any ci build.

### The best solution - check dependencies

This package is comparing the dependencies and devDependencies parts inside current and previous package.json (before the git command) and run `npm update` only if something has changed.

Command `git diff-tree` is used to get both versions of package.json.

### Usage

The steps are almost identical to the ones above:

1. `npm i husky @amiram/smart-update --save-dev`
2. Add scripts in package.json
   
   <pre>
   "postmerge": "smart-update",
   "postrewrite": "smart-update",
   </pre>

3. Do `git pull` or `git merge [branch]`
 
Now there are 3 possible scenarios:

1. package.json wasn't changed. Output:
    <pre>
    diff-tree output:
    No changes to dependencies detected
    </pre>
2. package.json was changed but dependencies or devDependencies weren't. Output: 
    <pre>
    diff-tree output: :100644 100644 b286d076e1dc147c009d404ad1ac85e773f9f23e 17045962950b8024768bb5844617b9968285c8c4 M	package.json
    Source version: b286d076e1dc147c009d404ad1ac85e773f9f23e
    Current version: 17045962950b8024768bb5844617b9968285c8c4
    Source has 8 dependencies, 17 dev dependencies
    Current has 8 dependencies, 17 dev dependencies
    No changes to dependencies detected
    </pre>
3. dependencies or devDependencies were changed. Output:
    <pre>
    diff-tree output: :100644 100644 b286d076e1dc147c009d404ad1ac85e773f9f23e 17045962950b8024768bb5844617b9968285c8c4 M	package.json
    Source version: b286d076e1dc147c009d404ad1ac85e773f9f23e
    Current version: 17045962950b8024768bb5844617b9968285c8c4
    Source has 7 dependencies, 17 dev dependencies
    Current has 8 dependencies, 17 dev dependencies
    Found differences in dependencies. Running npm update
    [npm update output]
    </pre>
    
 **important:** the package is also checking the versions of the dependencies, so npm update may run even if the total amount of dependencies in the output looks equal but the versions are different.
 
 
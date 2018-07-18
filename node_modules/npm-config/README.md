# npm-config
Use npm for configuration.

## Motivation

The location of configuration settings gets scattered on projects of any size. 

Keeping track of different values between development, staging, production, et. al. environment is a pain. Which files should be `.gitignore`d? Is YAML still cool? Or only JSON? How about XML?

`npm` provides some nice answers for us out of the box. Let's use that instead!

## Usage

**IMPORTANT:** `npm` config settings are available to `node` applications only when run as `npm run <command>`. These commands are found in `package.json` inside the `scripts` object.

First, add some configuration settings to `package.json`:

```json
...
{
  "config":
    "development": { "color": "red" },
    "staging": { "color": "blue" },
    "production": { "color": "green" }
}
...
```

Write a script that reads these settings:

```js
// colors.js
var env = process.env.NODE_ENV || 'development'
  , config = require('npm-config')
  , color = config(env, color) // red
;
```
Add the script to `package.json`:

```json
...
{
  "scripts": { "colors": "node colors.js" }
}
...
```

And run it:

```
$ npm run colors
```

How about those pesky .gitignore files? Let `npm`s config handle that, too:

```bash
$ npm set development:database:password my_secret_password
```

```json
{
  "scripts": { 
    "colors": "node colors.js",
    "example": "node -p "console.log(require(\"npm-config\")(\"development\", \"database\",\"password\"));"
  }
}
```

```
$ npm run example
```

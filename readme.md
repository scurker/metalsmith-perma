# metalsmith-perma

`metalsmith-perma` is an alternative to [`metalsmith-permalinks`](https://github.com/segmentio/metalsmith-permalinks) for applying permalinks to your static content.

## Installation

With [npm](https://www.npmjs.com/):

```bash
npm install metalsmith-perma
```

With [yarn](https://yarnpkg.com):

```bash
yarn add metalsmith-perma
```

## Usage

```js
var metalsmith = require('metalsmith');
var permalinks = require('metalsmith-perma');

metalsmith(__dirname)
  .use(permalinks({
    pattern: ':title'
  }));
```

*metalsmith-perma* uses [slugify](https://github.com/simov/slugify) for converting patterns to permalinks. You can pass options to slugify with an `options` parameter:

```js
metalsmith.use(permalinks({
  pattern: ':title'.
  options: {
    replacement: '-', // replace spaces with replacement
    remove: null,     // regex to remove characters
    lower: true       // result in lower case
  }
}));
```

Slugify `options` defaults to `{ lower: true }`, but you can view a [full list of options](https://github.com/simov/slugify#options).


### Dates

Dates are formatted using [date-fns/format](https://date-fns.org/docs/format).

```js
metalsmith.use(permalinks({
  pattern: ':date/:title',
  date: 'YYYY'
}));
```

### Overriding Permalinks

Permalinks can be defined in the metalsmith pipeline, or in frontmatter.

```yaml
---
title: Page Title
permalink: custom-path/to/:title
---
```

### Skipping Permalinks

Permalinks can be skipped in individual files by including `permalink: false`.

```yaml
---
title: Page Title
permalink: false
---
```

## License

[MIT](/license)
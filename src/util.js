const paramsRegex = /:(\w+)/g;

/**
 * Parses a string, returning the pattern matches as { pattern, key }
 * @param {string} pattern
 */
function parse(pattern) {
  let match
    , matches = [];

  // eslint-disable-next-line no-cond-assign
  while(match = paramsRegex.exec(pattern)) {
    let [ pattern, key ] = match;
    matches.push({ pattern, key });
  }

  return matches;
}

/**
 * Normalizes options into a single set of configurations
 * @param {object|array|string} options
 */
function normalizeOptions(options = []) {
  if(typeof options === 'string') {
    options = { pattern: options };
  }

  if(!Array.isArray(options)) {
    options = [options];
  }

  if(Array.isArray(options)) {
    options = options.map(x => typeof x === 'string' ? { pattern: x }: x);
  }

  return options;
}

/**
 * Replaces parameterized values (:name) in a path string (/path/to/:name)
 * @param {string} path
 * @param {obj} data
 */
function replaceParams(path, data = {}) {
  let params = parse(path);

  params.forEach(match => {
    let { pattern, key } = match
      , value = data[key] || null;

    path = path.replace(pattern, value);
  });

  return path;
}

export {
  parse,
  normalizeOptions,
  replaceParams
};
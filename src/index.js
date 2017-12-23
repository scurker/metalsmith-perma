import deepEqual from 'deep-equal';
import minimatch from 'minimatch';
import slug from 'slugify';
import { dirname } from 'path';
import { format } from 'date-fns';
import { normalizeOptions, replaceParams } from './util';

// Set Timezone for date-fns since dates are always UTC
process.env['TZ'] = 'UTC';

function matches(match, data) {
  if(!match || typeof match !== 'object') return false;

  let keys = Object.keys(match);
  for(let n = 0; n < keys.length; n++) {
    let key = keys[n];
    if(!deepEqual(match[key], data[key])) {
      return false;
    }
  }

  return true;
}

export default function(opts) {

  let defaultOptions = {
    match: null,
    extension: 'html',
    pattern: '',
    date: 'YYYY/MM/DD',
    options: { lower: true, remove: /[!$'"*+,;=?%]/ }
  };
  let normalizedOptions = normalizeOptions(opts).map(x => Object.assign({}, defaultOptions, x));

  const defaultMatch = normalizedOptions.find(o => !!o.default)
    || normalizedOptions.find(o => !o.match)
    || defaultOptions;

  return function(files) {
    Object.keys(files)
      .forEach(file => {

        let matchedOptions = normalizedOptions.find(o => matches(o.match, files[file]));

        let {
          extension,
          pattern,
          date,
          collections,
          options
        } = matchedOptions || defaultMatch;

        if(!minimatch(file, `**/*.${extension}`) || !pattern) {
          let data = files[file];
          if(file.endsWith(extension)) {
            data.path = dirname(file);
          } else {
            data.path = file;
          }
          return;
        }

        let data = files[file]
          , clonedData = Object.assign({}, data)
          , { permalink } = data
          , path
          , sluggedPath;

        if(permalink === false) return;

        if(typeof permalink === 'string') {
          pattern = permalink;
        }

        // Convert date values to formatted strings
        Object.keys(clonedData)
          .forEach(key => {
            let value = clonedData[key];
            if(value instanceof Date) {
              clonedData[key] = format(value, date);
            }
          });

        path = replaceParams(pattern, clonedData);

        sluggedPath = (path.split(/[\\/]/) || []).map(segment => slug(segment, options)).join('/');

        // Include path for reference
        data.path = sluggedPath;

        // Replace with new slugged path
        files[`${sluggedPath}/index.html`] = files[file];
        delete files[file];
      });
  };
}
import minimatch from 'minimatch';
import slug from 'slugify';
import { format } from 'date-fns';
import { normalizeOptions, replaceParams } from './util';

// Set Timezone for date-fns since dates are always UTC
process.env['TZ'] = 'UTC';

export default function(opts) {

  let normalizedOptions = normalizeOptions(opts).map(x => (
    Object.assign({
      match: null,
      extension: 'html',
      pattern: '',
      date: 'YYYY/MM/DD',
      options: { lower: true }
    }, x)
  ));

  // Need to determine default match, but just use the first in the array
  let [ defaultMatch ] = normalizedOptions;

  return function(files) {
    Object.keys(files)
      .forEach(file => {

        let {
          extension,
          pattern,
          date,
          collections,
          options
        } = defaultMatch;

        if(!minimatch(file, `**/*.${extension}`)) {
          return;
        }

        let data = files[file]
          , { permalink } = data
          , path
          , sluggedPath;

        if(permalink === false) return;

        if(typeof permalink === 'string') {
          pattern = permalink;
        }

        // Convert date values to formatted strings
        Object.keys(data)
          .forEach(key => {
            let value = data[key];
            if(value instanceof Date) {
              data[key] = format(value, date);
            }
          });

        path = replaceParams(pattern, data);

        sluggedPath = (path.split(/[\\/]/) || []).map(segment => slug(segment, options)).join('/');

        // Include path for reference
        data.path = sluggedPath;

        // Replace with new slugged path
        files[`${sluggedPath}/index.html`] = files[file];
        delete files[file];
      });
  };
}
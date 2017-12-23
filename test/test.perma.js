// importing regenerator-runtime is not ideal, babel does not seem to recognize
// "target": { "node": "current "} with env variables. This can likely be removed
// in the upgrade to babel 7
import 'regenerator-runtime/runtime';
import { promisify } from 'util';
import path from 'path';
import test from 'ava';
import rimraf from 'rimraf';
import _dirEqual from 'assert-dir-equal';
import _metalsmith from 'metalsmith';
import perma from '../src/index';

let metalsmith = p => {
  let m = _metalsmith(path.resolve(__dirname, `./fixtures/${p}`)).destination(`build`);
  return new Proxy(m, {
    get(target, name) {
      if(name === 'build') {
        return promisify(m.build);
      } else {
        return target[name];
      }
    }
  });
};
let dirEqual = (p1, p2) => _dirEqual(path.resolve(__dirname, './fixtures/', p1), path.resolve(__dirname, './fixtures', p2));

test.afterEach.always(async () => {
  let rimrafAsync = promisify(rimraf);
  await rimrafAsync(path.resolve(__dirname, `./fixtures/*/build`));
});

test('should replace patterns', async t => {
  await metalsmith('pattern')
    .use(perma({ pattern: ':title' }))
    .build();

  t.notThrows(() => dirEqual('pattern/build', 'pattern/expected'));
});

test('should accept shorthand patterns', async t => {
  await metalsmith('shorthand-pattern')
    .use(perma(':title'))
    .build();

  t.notThrows(() => dirEqual('shorthand-pattern/build', 'shorthand-pattern/expected'));
});

test('should set date', async t => {
  await metalsmith('date')
    .use(perma({ pattern: ':date/:title' }))
    .build();

  t.notThrows(() => dirEqual('date/build', 'date/expected'));
});

test('should set custom date', async t => {
  await metalsmith('custom-date')
    .use(perma({ pattern: ':date/:title', date: 'YY/MM' }))
    .build();

  t.notThrows(() => dirEqual('custom-date/build', 'custom-date/expected'));
});

test('should handle accents', async t => {
  await metalsmith('accents')
    .use(perma({ pattern: ':title '}))
    .build();

  t.notThrows(() => dirEqual('accents/build', 'accents/expected'));
});

test('should handle unicode', async t => {
  await metalsmith('unicode')
    .use(perma({ pattern: ':title '}))
    .build();

  t.notThrows(() => dirEqual('unicode/build', 'unicode/expected'));
});

test('should ignore permalink: false in frontmatter', async t => {
  await metalsmith('permalink-false')
    .use(perma({ pattern: ':title '}))
    .build();

  t.notThrows(() => dirEqual('permalink-false/build', 'permalink-false/expected'));
});

test.skip('should match metadata', async t => {
  await metalsmith('match-metadata')
    .use(perma([
      {
        match: { foo: 123 },
        pattern: 'foo/:title'
      },
      {
        match: { bar: 456 },
        pattern: 'bar/:title'
      }
    ]))
    .build();

  t.notThrows(() => dirEqual('match-metadata/build', 'match-metadata/expected'));
});

test.todo('should set default pattern');

test('should allow frontmatter to override permalinks', async t => {
  await metalsmith('permalink-frontmatter')
    .use(perma({ pattern: ':title '}))
    .build();

  t.notThrows(() => dirEqual('permalink-frontmatter/build', 'permalink-frontmatter/expected'));
});
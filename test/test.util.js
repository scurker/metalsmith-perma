import test from 'ava';
import { parse, normalizeOptions, replaceParams } from '../src/util';

test('should return matches', t => {
  t.deepEqual(parse(':foo/:bar'), [{ pattern: ':foo', key: 'foo' }, { pattern: ':bar', key: 'bar' }]);
});

test('should return normalized options when options is a string', t => {
  t.deepEqual(normalizeOptions(':title'), [{ pattern: ':title' }]);
});

test('should return normalized options when options is an object', t => {
  t.deepEqual(normalizeOptions({ foo: 'bar' }), [{ foo: 'bar' }]);
});

test('should return normalized options when options is an array', t => {
  t.deepEqual(normalizeOptions([':title', { foo: 'bar' }]), [{ pattern: ':title' }, { foo: 'bar' }]);
});

test('should replace params', t => {
  t.is(replaceParams(':title', { title: 'this is a title' }), 'this is a title');
});

test('should replace only nested params', t => {
  t.is(replaceParams('posts/:title', { title: 'some title' }), 'posts/some title');
});
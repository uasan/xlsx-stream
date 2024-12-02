export const BUFFER_LENGTH = 131072;
export const BUFFER_MAX_LENGTH = 268435456;

export function noop() {}

export const { isArray } = Array;
export const isObject = value => value !== null && typeof value === 'object';

export const escapeXML = data =>
  String(data)
    .replaceAll('&', '&amp;')
    .replaceAll('>', '&gt;')
    .replaceAll('<', '&lt;')
    .replaceAll("'", '&apos;')
    .replaceAll('"', '&quot;');

// Type declarations for the bun test framework used in project spec files
declare module 'bun:test' {
  export const describe: typeof import('node:test')['describe'];
  export const it: typeof import('node:test')['it'];
  export const test: typeof import('node:test')['it'];
  export const expect: typeof import('node:test')['expect'];
  export const beforeEach: typeof import('node:test')['beforeEach'];
  export const afterEach: typeof import('node:test')['afterEach'];
  // Add any additional globals needed by your tests here.
}

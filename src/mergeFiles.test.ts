import { expect, test } from "vitest";

import { mergeFiles } from "./mergeFiles";

test("mergeFiles correctly merges TypeScript files and removes duplicate imports", () => {
  const files = [
    {
      name: "sum.ts",
      content: `
type SumResult = number;

export const sum = (a: number, b: number): number => a + b;
      `,
    },
    {
      name: "sum-multiply.ts",
      content: `
import { sum } from './sum';

export const sumMultiply = (multiplyBy: number, a: number, b: number) => multiplyBy * sum(a, b);
      `,
    },
    {
      name: "log-sum-multiply.ts",
      content: `
import { sumMultiply } from './sum-multiply';

console.log(sumMultiply(3, 1, 2))
      `,
    },
  ];

  const expected = `
type SumResult = number;

export const sum = (a: number, b: number): number => a + b;

export const sumMultiply = (multiplyBy: number, a: number, b: number) => multiplyBy * sum(a, b);

console.log(sumMultiply(3, 1, 2))
  `.trim();

  const result = mergeFiles(files);
  expect(result.trim()).toBe(expected);
});

test("mergeFiles handles empty files and files without imports", () => {
  const files = [
    {
      name: "empty.ts",
      content: "",
    },
    {
      name: "constants.ts",
      content: `
export const PI = 3.14159;
export const E = 2.71828;
      `,
    },
    {
      name: "math.ts",
      content: `
import { PI, E } from './constants';

export const circleArea = (radius: number) => PI * radius * radius;
export const exponential = (x: number) => E ** x;
      `,
    },
  ];

  const expected = `
export const PI = 3.14159;
export const E = 2.71828;

export const circleArea = (radius: number) => PI * radius * radius;
export const exponential = (x: number) => E ** x;
  `.trim();

  const result = mergeFiles(files);
  expect(result.trim()).toBe(expected);
});

test("mergeFiles handles library imports correctly", () => {
  const files = [
    {
      name: "utils.ts",
      content: `
import { debounce } from 'lodash';

export const debouncedFunction = debounce(() => {
  console.log('Debounced!');
}, 1000);
      `,
    },
    {
      name: "app.ts",
      content: `
import { debouncedFunction } from './utils';

debouncedFunction();
      `,
    },
  ];

  const expected = `
import { debounce } from 'lodash';

export const debouncedFunction = debounce(() => {
  console.log('Debounced!');
}, 1000);

debouncedFunction();
  `.trim();

  const result = mergeFiles(files);
  expect(result.trim()).toBe(expected);
});

test("mergeFiles handles various export types correctly", () => {
  const files = [
    {
      name: "utils.ts",
      content: `
import { debounce } from 'lodash';

export const constValue = 42;

export function regularFunction() {
  console.log('This is a regular function');
}

export async function asyncFunction() {
  return await Promise.resolve('This is an async function');
}

export class ExampleClass {
  constructor(private name: string) {}

  greet() {
    console.log(\`Hello, \${this.name}!\`);
  }
}

export const debouncedFunction = debounce(() => {
  console.log('Debounced!');
}, 1000);
      `,
    },
    {
      name: "app.ts",
      content: `
import { constValue, regularFunction, asyncFunction, ExampleClass, debouncedFunction } from './utils';

console.log(constValue);
regularFunction();
asyncFunction().then(console.log);
const example = new ExampleClass('World');
example.greet();
debouncedFunction();
      `,
    },
  ];

  const expected = `
import { debounce } from 'lodash';

export const constValue = 42;

export function regularFunction() {
  console.log('This is a regular function');
}

export async function asyncFunction() {
  return await Promise.resolve('This is an async function');
}

export class ExampleClass {
  constructor(private name: string) {}

  greet() {
    console.log(\`Hello, \${this.name}!\`);
  }
}

export const debouncedFunction = debounce(() => {
  console.log('Debounced!');
}, 1000);

console.log(constValue);
regularFunction();
asyncFunction().then(console.log);
const example = new ExampleClass('World');
example.greet();
debouncedFunction();
  `.trim();

  const result = mergeFiles(files);
  expect(result.trim()).toBe(expected);
});

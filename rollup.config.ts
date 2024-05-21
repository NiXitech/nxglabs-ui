import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import { readdir, access } from 'node:fs/promises';
import pkg from './package.json' assert { type: 'json' };
import { statSync } from 'node:fs';

const externalDeps = Object.keys(pkg.dependencies || {});

const resolve = (filePath: string) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, filePath);
};

const input = 'index.ts';
const output = 'index.js';
const dtsOutput = 'index.d.ts';
const outDir = 'dist';
const componentDirPath = 'src/components';
const ioList: { input: string; output: string; outputDts: string }[] = [];

const componentDir = resolve(componentDirPath);
await access(componentDir);
const componentDirFs = await readdir(componentDir);
componentDirFs.forEach((file) => {
  const fileStat = statSync(resolve(`${componentDir}/${file}`));
  if (fileStat.isDirectory()) {
    ioList.push({
      input: resolve(`${componentDir}/${file}/${input}`),
      output: resolve(`${outDir}/${file}/${output}`),
      outputDts: resolve(`${outDir}/${file}/${dtsOutput}`),
    });
  }
});

const getPlugins = () => {
  return [
    typescript({
      tsconfig: resolve('./tsconfig.json'),
    }),
  ];
};

const esmConfigs = ioList.map(({ input, output }) => {
  return defineConfig({
    input: input,
    external: externalDeps,
    output: [
      {
        file: output,
        format: 'esm',
      },
    ],
    plugins: getPlugins().concat([
      terser({
        output: {
          ascii_only: true,
        },
      }),
    ]),
  });
});

const dtsConfigs = ioList.map(({ input, outputDts }) => {
  return defineConfig({
    input: input,
    output: {
      file: outputDts,
      format: 'esm',
    },
    plugins: getPlugins().concat([dts()]),
  });
});

export default [...esmConfigs, ...dtsConfigs];

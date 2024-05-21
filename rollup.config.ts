import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import path from 'node:path';
import { fileURLToPath } from 'url';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

// import pkg from "./package.json" assert { type: "json" };

// const externalDeps = Object.keys(pkg.dependencies || {});

const resolve = (filePath: string) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, filePath);
};

const input = 'index.ts';
const output = 'index.js';
const dtsOutput = 'index.d.ts';
const outDir = 'dist';

const packagePath = './packages';
const packageNames = ['core', 'request'];

const esmRollupConfig = packageNames.map((name) => ({
  input: resolve(`${packagePath}/${name}/${input}`),
  output: resolve(`${packagePath}/${name}/${outDir}/${output}`),
}));

const dtsRollupConfig = packageNames.map((name) => ({
  input: resolve(`${packagePath}/${name}/${input}`),
  output: resolve(`${packagePath}/${name}/${outDir}/${dtsOutput}`),
}));

const getPlugins = () => {
  return [
    typescript({
      tsconfig: resolve('./tsconfig.json'),
    }),
  ];
};

const esmConfigs = esmRollupConfig.map((config) =>
  defineConfig({
    input: config.input,
    // external: externalDeps,
    output: [
      {
        file: config.output,
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
  }),
);

const dtsConfigs = dtsRollupConfig.map((config) =>
  defineConfig({
    input: config.input,
    output: {
      file: config.output,
      format: 'esm',
    },
    plugins: getPlugins().concat([dts()]),
  }),
);

export default [...esmConfigs, ...dtsConfigs];

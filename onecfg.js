import {
  editorconfig,
  eslint,
  git,
  github,
  jest,
  node,
  npm,
  prettier,
  swc,
  typescript,
  vscode,
  wallaby,
} from '@onecfg/standard';
import {mergeContent, writeFiles} from 'onecfg';

const target = `es2022`;

writeFiles(
  ...editorconfig(),
  ...eslint(),
  ...git(),
  ...github(),
  ...jest(),
  ...node({nodeVersion: `18`}),
  ...npm(),
  ...prettier(),
  ...swc({target}),
  ...typescript({target, emit: true}),
  ...vscode({includeFilesInExplorer: false}),
  ...wallaby(),

  mergeContent(jest.configFile, {clearMocks: true}),
  mergeContent(npm.packageFile, {scripts: {postci: `size-limit`}}),

  mergeContent(prettier.configFile, {
    overrides: [
      {files: `*.test.ts`, options: {printWidth: 120}},
      {files: `*.test.tsx`, options: {printWidth: 120}},
    ],
  }),

  mergeContent(swc.configFile, {jsc: {parser: {tsx: true}}}),
  ...typescript.mergeCompilerOptions({jsx: `react`}),
);

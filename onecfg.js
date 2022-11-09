import {
  editorconfig,
  eslint,
  git,
  github,
  jest,
  node,
  npm,
  prettier,
  snugjs,
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
  ...snugjs(),
  ...swc({target}),
  ...typescript({target, emit: true}),
  ...vscode({includeFilesInExplorer: false}),
  ...wallaby(),

  mergeContent(npm.packageFile, {scripts: {postci: `size-limit`}}),

  mergeContent(prettier.configFile, {
    overrides: [
      {files: `*.test.ts`, options: {printWidth: 120}},
      {files: `*.test.tsx`, options: {printWidth: 120}},
    ],
  }),
);

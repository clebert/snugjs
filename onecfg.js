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

  mergeContent(npm.packageFile, {scripts: {postci: `size-limit`}}),

  mergeContent(swc.configFile, {
    jsc: {
      parser: {tsx: true},
      transform: {react: {pragma: `h`, pragmaFrag: `Fragment`}},
    },
  }),

  ...typescript.mergeCompilerOptions({
    jsx: `react`,
    jsxFactory: `h`,
    jsxFragmentFactory: `Fragment`,
  }),
);

import {
  editorconfig,
  eslint,
  git,
  github,
  node,
  npm,
  prettier,
  typescript,
  vscode,
} from '@onecfg/standard';
import {mergeContent, writeFiles} from 'onecfg';

const target = `es2022`;

writeFiles(
  ...editorconfig(),
  ...eslint(),
  ...git(),
  ...github(),
  ...node({nodeVersion: `18`}),
  ...npm(),
  ...prettier(),
  ...typescript({target, emit: true}),
  ...vscode({includeFilesInExplorer: false}),

  mergeContent(npm.packageFile, {scripts: {postci: `size-limit`}}),
);

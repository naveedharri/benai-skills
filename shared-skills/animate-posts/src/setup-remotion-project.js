/**
 * @file setup-remotion-project.js
 * @description Sets up a minimal Remotion project structure for rendering
 */

import fs from 'fs/promises';
import path from 'path';

export async function setupRemotionProject(tempDir, compositionPath) {
  const compositionName = path.basename(compositionPath, '.jsx');

  // Create package.json
  const packageJson = {
    "name": "remotion-renderer",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "render": "remotion render"
    },
    "dependencies": {
      "react": "^18.0.0",
      "remotion": "^4.0.0"
    }
  };

  await fs.writeFile(
    path.join(tempDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create src directory
  const srcDir = path.join(tempDir, 'src');
  await fs.mkdir(srcDir, { recursive: true });

  // Copy composition to src
  const compositionContent = await fs.readFile(compositionPath, 'utf-8');
  await fs.writeFile(path.join(srcDir, `${compositionName}.jsx`), compositionContent);

  // Create index.ts that registers the composition
  const indexContent = `import { Composition } from 'remotion';
import { ${compositionName} } from './${compositionName}.jsx';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="${compositionName}"
        component={${compositionName}}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
`;

  await fs.writeFile(path.join(srcDir, 'index.tsx'), indexContent);

  return srcDir;
}

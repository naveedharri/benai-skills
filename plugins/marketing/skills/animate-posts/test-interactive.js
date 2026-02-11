/**
 * Test script for interactive animation workflow
 */

import { createAnimationPreview, startPreviewServer, exportFinalAnimation, stopPreviewServer } from './src/interactive-animator.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  const imagePath = '/Users/prabhakaranmuthu/Downloads/BEN AI/1767178087308.jpeg';

  console.log('🎨 Interactive Animation Creator\n');
  console.log('Image:', imagePath);
  console.log('Output: 720x720, 10 seconds, optimized for social media\n');

  // Step 1: Get animation instructions
  const instructions = await question('How would you like the animation to look? (e.g., "slow zoom in", "pan right", "pulse effect"): ');

  // Step 2: Create preview
  const preview = await createAnimationPreview(imagePath, instructions, {
    width: 720,
    height: 720,
    duration: 10
  });

  console.log('\n📊 Preview Details:');
  console.log(`   Size: ${preview.size}`);
  console.log(`   Resolution: ${preview.resolution}`);
  console.log(`   Duration: ${preview.duration}`);
  console.log(`   FPS: ${preview.fps}`);

  // Step 3: Start preview server
  console.log('\n🌐 Starting preview server...');
  const url = await startPreviewServer(3000);
  console.log(`\n✨ Preview ready! Open in browser:\n`);
  console.log(`   ${url}\n`);

  // Open in browser automatically
  const { exec } = await import('child_process');
  exec(`open "${url}"`);

  // Step 4: Iteration loop
  let satisfied = false;
  while (!satisfied) {
    const action = await question('\nWhat would you like to do? (edit/export/cancel): ');

    if (action.toLowerCase() === 'export') {
      satisfied = true;
      const outputDir = await question('Export to which folder? (press Enter for Downloads): ');
      const finalDir = outputDir.trim() || '/Users/prabhakaranmuthu/Downloads/BEN AI';

      console.log('\n📦 Exporting final animation...');
      const result = await exportFinalAnimation(finalDir, 'life-wheel-animated-final.gif');

      console.log(`\n✅ Exported successfully!`);
      console.log(`   Location: ${result.path}`);
      console.log(`   Size: ${result.size}`);

      stopPreviewServer();
      rl.close();

    } else if (action.toLowerCase() === 'edit') {
      const newInstructions = await question('\nDescribe the changes you want: ');

      // Recreate with new instructions
      const newPreview = await createAnimationPreview(imagePath, newInstructions, {
        width: 720,
        height: 720,
        duration: 10
      });

      // Restart server to show new preview
      await startPreviewServer(3000);
      console.log(`\n✨ Updated preview is ready! Refresh your browser: ${url}\n`);

    } else if (action.toLowerCase() === 'cancel') {
      console.log('\n❌ Cancelled. Preview server stopped.');
      stopPreviewServer();
      rl.close();
      satisfied = true;
    } else {
      console.log('Invalid option. Please choose: edit, export, or cancel');
    }
  }

  process.exit(0);
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  stopPreviewServer();
  process.exit(1);
});

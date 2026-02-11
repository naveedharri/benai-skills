import { createSimpleAnimation } from './src/simple-animator.js';

const imagePath = '/Users/prabhakaranmuthu/Downloads/BEN AI/1767178087308.jpeg';
const outputPath = '/tmp/animate-posts-simple';

console.log('Starting simple animation...');

try {
  const result = await createSimpleAnimation(imagePath, outputPath, {
    width: 1080,
    height: 1080,
    duration: 10
  });
  console.log('\n✅ Success!');
  console.log('Output:', result);
} catch (error) {
  console.error('❌ Error:', error.message);
}

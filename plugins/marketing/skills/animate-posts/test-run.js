import { animatePost } from './src/index.js';

const config = {
  imagePath: '/Users/prabhakaranmuthu/Downloads/BEN AI/1767178087308.jpeg',
  aspectRatio: '1:1',
  animationMode: 'auto',
  customPreferences: '',
  outputPath: '/tmp/animate-posts-output'
};

console.log('Starting animation with config:', config);

try {
  const result = await animatePost(config);
  console.log('Success!', result);
} catch (error) {
  console.error('Error:', error);
  console.error('Stack:', error.stack);
}

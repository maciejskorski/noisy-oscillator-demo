import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace 'stochastic-oscillator' with your actual repository name
export default defineConfig({
  base: '/noisy-oscillator-demo/',  
  plugins: [react()]
});
import React from 'react';
import SineOscillator from './components/SineOscillator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
        Sine Oscillator with Stochastic Perturbations
        </h1>
        <SineOscillator />
      </div>
    </div>
  );
}

export default App;
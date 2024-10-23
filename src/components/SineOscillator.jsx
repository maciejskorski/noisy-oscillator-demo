import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const SineOscillator = () => {
  const [data, setData] = useState([]);
  const [samplingPoints, setSamplingPoints] = useState([]);
  const [bitSequence, setBitSequence] = useState([]);
  const [diffusionRate, setDiffusionRate] = useState([0.2]);
  const [frequency, setFrequency] = useState([1]);
  const brownianPhase = useRef(0);
  
  useEffect(() => {
    const generateData = () => {
      const points = 400;
      const maxTime = 20;
      const period = 1 / frequency[0];
      const numSamples = Math.floor(maxTime / period) + 1;
      const newData = [];
      const newSamplingPoints = [];
      const newBits = [];
      
      brownianPhase.current += (Math.random() - 0.5) * diffusionRate[0];
      
      for (let i = 0; i < points; i++) {
        const t = (i / points) * maxTime;
        const localNoise = (Math.random() - 0.5) * 0.1 * diffusionRate[0];
        const yPerturbed = Math.sin(2 * Math.PI * frequency[0] * t + brownianPhase.current + localNoise);
        const yReference = Math.sin(2 * Math.PI * frequency[0] * t);
        
        newData.push({
          t: t,
          yPerturbed: yPerturbed.toFixed(3),
          yReference: yReference.toFixed(3)
        });
      }

      for (let i = 0; i < numSamples && i * period <= maxTime; i++) {
        const t = i * period;
        if (t <= maxTime) {
          const localNoise = (Math.random() - 0.5) * 0.1 * diffusionRate[0];
          const y = Math.sin(2 * Math.PI * frequency[0] * t + brownianPhase.current + localNoise);
          newBits.push(y > 0 ? 1 : 0);
          newSamplingPoints.push({
            t: t,
            samplingDot: 0
          });
        }
      }
      
      setData(newData);
      setSamplingPoints(newSamplingPoints);
      setBitSequence(newBits);
    };

    generateData();
    const interval = setInterval(generateData, 50);
    return () => clearInterval(interval);
  }, [diffusionRate, frequency]);

  const ticks = Array.from({ length: 11 }, (_, i) => i * 2);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Sine Oscillator with Natural Period Sampling (T = 1/f)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <LineChart 
            width={800} 
            height={300} 
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="t" 
              label={{ value: 'Time (s)', position: 'bottom' }}
              ticks={ticks}
              domain={[0, 20]}
              type="number"
              allowDataOverflow={false}
            />
            <YAxis 
              domain={[-1.2, 1.2]} 
              label={{ value: 'amplitude', angle: -90, position: 'left' }} 
            />
            <Tooltip 
              formatter={(value, name) => [value, name === 'yPerturbed' ? 'Perturbed' : 'Reference']}
              labelFormatter={(label) => `Time: ${Number(label).toFixed(2)}s`}
            />
            <ReferenceLine y={0} stroke="#000" strokeWidth={1.5} />
            <Line 
              data={data}
              type="monotone" 
              dataKey="yReference" 
              stroke="#94a3b8"
              strokeDasharray="5 5"
              dot={false} 
              isAnimationActive={false}
              strokeWidth={1.5}
            />
            <Line 
              data={data}
              type="monotone" 
              dataKey="yPerturbed" 
              stroke="#2563eb" 
              dot={false} 
              isAnimationActive={false}
              strokeWidth={1.5}
            />
            <Line 
              data={samplingPoints}
              dataKey="samplingDot"
              stroke="none"
              dot={{
                fill: '#ff0000',
                r: 3,
                strokeWidth: 1,
                stroke: '#ff0000'
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg mb-6 font-mono">
          <div className="text-sm font-medium mb-2">
            Binary Sequence (sampled at t = 0, T, 2T, ... where T = 1/f = {(1/frequency[0]).toFixed(2)}s):
          </div>
          <div className="break-all">
            {bitSequence.join('')}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Sequence length: {bitSequence.length} bits (sampling at t = 0, T, 2T, ... ≤ 20s)
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Diffusion Rate: {diffusionRate[0].toFixed(2)}
            </label>
            <Slider
              value={diffusionRate}
              onValueChange={setDiffusionRate}
              min={0}
              max={1}
              step={0.01}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Frequency (f): {frequency[0].toFixed(1)} Hz
            </label>
            <Slider
              value={frequency}
              onValueChange={setFrequency}
              min={0.1}
              max={3}
              step={0.1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SineOscillator;

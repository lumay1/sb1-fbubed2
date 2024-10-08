import React, { useState, useEffect, useCallback } from 'react';
import { Plane, Zap } from 'lucide-react';
import Game from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8 flex items-center">
        飞机大战 <Plane className="ml-2" />
      </h1>
      <Game />
    </div>
  );
}

export default App;
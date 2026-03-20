import React, { useEffect, useState } from 'react';

export default function WelcomeScreen({ onStart }) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      onClick={onStart}
    >
      {/* Background decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

      {/* Logo / Brand */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="text-8xl mb-2">🍔</div>

        <div className="text-center">
          <h1 className="text-6xl font-black text-white tracking-tight">
            Quick<span className="text-orange-500">Bite</span>
          </h1>
          <p className="text-gray-400 text-xl mt-2 font-medium tracking-widest uppercase">
            Fast Food Kiosk
          </p>
        </div>

        {/* Divider */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full my-4" />

        {/* Touch to Start */}
        <div
          className={`mt-4 px-16 py-6 rounded-3xl text-2xl font-bold text-white border-2 border-orange-500 transition-all duration-700 ${
            pulse
              ? 'bg-orange-500 shadow-lg shadow-orange-500/50 scale-105'
              : 'bg-orange-500/20 shadow-none scale-100'
          }`}
        >
          👆 Touch to Start
        </div>

        <p className="text-gray-500 text-lg mt-6">
          Order here • Skip the line
        </p>

        {/* Emoji food row */}
        <div className="flex gap-6 text-4xl mt-4 opacity-60">
          <span>🍟</span>
          <span>🥤</span>
          <span>🍦</span>
          <span>🥧</span>
        </div>
      </div>
    </div>
  );
}

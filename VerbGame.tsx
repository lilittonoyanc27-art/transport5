import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Environment, 
  ContactShadows, 
  PresentationControls,
  Text,
  Center,
  Cloud,
  Stars
} from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { BALLOON_CHALLENGES } from './verbData';
import { Trophy, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Play, Mountain, Compass } from 'lucide-react';
import * as THREE from 'three';

// 3D Mountain Environment Piece
function MountainPiece({ position, scale, color }: { position: [number, number, number], scale: [number, number, number], color: string }) {
  return (
    <mesh position={position} scale={scale}>
      <coneGeometry args={[1, 2, 4]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

// 3D Adventurer
function Adventurer({ position, color, name, isWalking, targetZ }: { position: [number, number, number], color: string, name: string, isWalking: boolean, targetZ: number }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (group.current) {
      if (isWalking) {
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, delta * 2);
        group.current.position.y = position[1] + Math.abs(Math.sin(state.clock.getElapsedTime() * 10)) * 0.1;
      } else {
        group.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      }
    }
  });

  return (
    <group ref={group} position={position}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 0.6, 4, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 0.1, -0.3]}>
           <boxGeometry args={[0.4, 0.5, 0.2]} />
           <meshStandardMaterial color="#422006" />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.08, 0.65, 0.2]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.08, 0.65, 0.2]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <Text
          position={[0, 1.1, 0]}
          fontSize={0.2}
          color="#1e293b"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
        >
          {name}
        </Text>
      </Float>
    </group>
  );
}

function AdventureScene({ turn, isWalking, targetZ }: { turn: string, isWalking: boolean, targetZ: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <PresentationControls speed={1.2} global zoom={0.8} polar={[-0.1, Math.PI / 4]}>
        <group position={[0, -1, 0]}>
          {/* Path */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[6, 30]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.9} />
          </mesh>

          {/* Mountains in background */}
          <MountainPiece position={[-8, 2, -15]} scale={[5, 10, 5]} color="#475569" />
          <MountainPiece position={[8, 1, -12]} scale={[4, 8, 4]} color="#334155" />
          <MountainPiece position={[-4, 0, -10]} scale={[3, 6, 3]} color="#1e293b" />

          {/* Characters */}
          <Adventurer 
            position={[-1, 0.5, 8]} 
            color="#3b82f6" 
            name="Գոռ" 
            isWalking={turn === 'gor' && isWalking}
            targetZ={targetZ}
          />
          <Adventurer 
            position={[1, 0.5, 8]} 
            color="#ec4899" 
            name="Գայանե" 
            isWalking={turn === 'gayane' && isWalking}
            targetZ={targetZ}
          />

          {/* Destination Markers */}
          <group position={[0, 0, -10]}>
             <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[2, 2, 0.2, 32]} />
                <meshStandardMaterial color="#ca8a04" />
             </mesh>
             <Text position={[0, 1, 0]} fontSize={0.5} color="white">
                FINISH
             </Text>
          </group>
        </group>
      </PresentationControls>

      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.2} far={10} color="#000000" />
      <Environment preset="night" />
    </>
  );
}

export default function VerbGame() {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'finished'>('lobby');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({ gor: 0, gayane: 0 });
  const [turn, setTurn] = useState<'gor' | 'gayane'>('gor');
  const [selectedVal, setSelectedVal] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [targetZ, setTargetZ] = useState(8);

  const currentChallenge = BALLOON_CHALLENGES[currentIdx];

  const handleSelect = (val: string) => {
    if (showFeedback || isWalking || gameState !== 'playing') return;
    setSelectedVal(val);
    
    if (val === currentChallenge.correctAnswer) {
      setIsWalking(true);
      // Move forward slightly on each correct answer
      setTargetZ(prev => prev - 1.5);
    } else {
      setShowFeedback(true);
    }
  };

  // When walking animation finishes (manual timer or distance check simplified)
  useEffect(() => {
    if (isWalking) {
      const timer = setTimeout(() => {
        setIsWalking(false);
        setShowFeedback(true);
        setScores(prev => ({ ...prev, [turn]: prev[turn] + 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isWalking, turn]);

  const nextChallenge = () => {
    setShowFeedback(false);
    setSelectedVal(null);
    if (currentIdx < BALLOON_CHALLENGES.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTurn(prev => prev === 'gor' ? 'gayane' : 'gor');
    } else {
      setGameState('finished');
    }
  };

  const resetGame = () => {
    setScores({ gor: 0, gayane: 0 });
    setCurrentIdx(0);
    setGameState('lobby');
    setTurn('gor');
    setSelectedVal(null);
    setShowFeedback(false);
    setTargetZ(8);
  };

  if (gameState === 'lobby') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-24 text-center space-y-12">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
           <div className="w-32 h-32 sm:w-40 sm:h-40 bg-indigo-600 rounded-[3rem] mx-auto flex items-center justify-center text-white shadow-2xl rotate-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 blur-xl translate-y-10" />
              <Mountain size={60} className="relative z-10 text-indigo-100 sm:size-80" />
           </div>
           <h2 className="text-4xl sm:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">
             Adventure <br/> <span className="text-indigo-600">Mountain</span>
           </h2>
           <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm sm:text-lg px-4">Օգնիր Գոռին և Գայանեին հասնել գագաթին</p>
        </motion.div>
        <button onClick={() => setGameState('playing')} className="bg-slate-900 text-white px-8 py-5 sm:px-12 sm:py-6 rounded-full font-black uppercase text-lg sm:text-xl italic tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto">
          <Play fill="white" /> Սկսել Արշավը
        </button>
      </div>
    );
  }

  if (gameState === 'finished') {
    const winner = scores.gor > scores.gayane ? 'Գոռ' : scores.gayane > scores.gor ? 'Գայանե' : 'Ոչ-ոքի';
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-24 text-center space-y-12">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
           <Trophy className="mx-auto text-yellow-500" size={80} sm:size={100} />
           <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">
             {winner === 'Ոչ-ոքի' ? 'Միասին հասաք!' : `${winner}ը Հասավ Գագաթին`}
           </h2>
           <div className="flex justify-center gap-6 sm:gap-8 bg-white p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl border border-slate-50">
              <div className="text-center"><p className="text-blue-600 font-black uppercase text-[8px] sm:text-[10px]">Գոռ</p><p className="text-3xl sm:text-4xl font-black italic">{scores.gor}</p></div>
              <div className="w-px h-10 sm:h-12 bg-slate-100 self-center" />
              <div className="text-center"><p className="text-rose-600 font-black uppercase text-[8px] sm:text-[10px]">Գայանե</p><p className="text-3xl sm:text-4xl font-black italic">{scores.gayane}</p></div>
           </div>
        </motion.div>
        <button onClick={resetGame} className="bg-slate-900 text-white px-8 py-5 sm:px-10 sm:py-5 rounded-full font-black uppercase italic tracking-widest flex items-center gap-4 mx-auto shadow-2xl transition-all">
          <RefreshCw /> Նորից խաղալ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-8 space-y-6">
       {/* Scoreboard */}
       <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 px-1 no-scrollbar">
          <div className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 shrink-0 transition-all ${turn === 'gor' ? 'bg-blue-50 border-blue-200 shadow-lg scale-105' : 'bg-white border-transparent'}`}>
             <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[10px] sm:text-xs">G</div>
                <div><p className="text-[7px] sm:text-[8px] font-black uppercase text-slate-400 text-left">Գոռ</p><p className="text-base sm:text-lg font-black italic text-slate-900">{scores.gor} ճիշտ</p></div>
             </div>
          </div>
          <div className="text-center shrink-0">
             <span className="text-sm sm:text-lg font-black italic text-slate-900 leading-none">ՓՈՒԼ {currentIdx + 1}/10</span>
          </div>
          <div className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 shrink-0 transition-all ${turn === 'gayane' ? 'bg-rose-50 border-rose-200 shadow-lg scale-105' : 'bg-white border-transparent'}`}>
             <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-black text-[10px] sm:text-xs">G</div>
                <div><p className="text-[7px] sm:text-[8px] font-black uppercase text-slate-400 text-left">Գայանե</p><p className="text-base sm:text-lg font-black italic text-slate-900">{scores.gayane} ճիշտ</p></div>
             </div>
          </div>
       </div>

       {/* 3D Visualizer */}
       <div className="h-[280px] sm:h-[500px] bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-inner relative overflow-hidden">
          <Canvas shadows camera={{ position: [0, 5, 12], fov: 40 }}>
             <Suspense fallback={null}>
                <AdventureScene turn={turn} isWalking={isWalking} targetZ={targetZ} />
             </Suspense>
          </Canvas>
          {/* Question Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-xl text-center pointer-events-none px-4 z-10">
             <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/50 space-y-1">
                <h3 className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">
                   {currentChallenge.question.replace('___', '______')}
                </h3>
                <p className="text-slate-400 font-bold italic tracking-wide text-xs sm:text-base">{currentChallenge.translation}</p>
             </div>
          </div>
       </div>

       {/* Options */}
       {!showFeedback && !isWalking && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pb-8">
            {currentChallenge.options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(opt)} className="group bg-white p-5 sm:p-7 rounded-[2rem] shadow-lg border-2 border-slate-100 hover:border-indigo-500 transition-all text-center space-y-1 active:scale-95 touch-manipulation">
                 <p className="text-[8px] font-black uppercase text-slate-400 group-hover:text-indigo-500">Ընտիր տարբերակը</p>
                 <p className="text-xl sm:text-2xl font-black italic text-slate-800">{opt}</p>
              </button>
            ))}
         </motion.div>
       )}

       {/* Feedback */}
       <AnimatePresence mode="wait">
          {showFeedback && (
             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className={`p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-white relative overflow-hidden ${selectedVal === currentChallenge.correctAnswer ? 'bg-indigo-600' : 'bg-rose-500'}`}>
                <div className="shrink-0 flex items-center justify-center bg-white/20 p-4 rounded-3xl">
                   {selectedVal === currentChallenge.correctAnswer ? <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16" /> : <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16" />}
                </div>
                <div className="space-y-2 sm:space-y-3 text-center sm:text-left flex-1">
                   <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] opacity-70">{selectedVal === currentChallenge.correctAnswer ? 'Կեցցե՛ս, առաջ' : 'Փորձիր նորից'}</p>
                   <p className="text-xl sm:text-4xl font-black italic uppercase tracking-tighter leading-tight">
                      Պատասխանն է: <span className="bg-white/20 px-4 py-1 rounded-2xl">{currentChallenge.correctAnswer}</span>
                   </p>
                   <p className="text-white/60 font-bold italic text-xs sm:text-sm">{currentChallenge.translation}</p>
                </div>
                <button 
                  onClick={nextChallenge} 
                  className="bg-white text-slate-900 px-8 py-4 sm:px-10 sm:py-5 rounded-full font-black uppercase italic text-sm sm:text-base tracking-widest hover:scale-110 active:scale-95 transition-all flex items-center gap-4 shadow-xl whitespace-nowrap"
                >
                  Հաջորդը <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}

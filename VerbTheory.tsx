import React from 'react';
import { motion } from 'motion/react';
import { VERB_DATA } from './verbData';
import { Info, Book, Zap, Layers } from 'lucide-react';

export default function VerbTheory() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
      {/* Intro */}
      <section className="space-y-8">
        <div className="border-l-8 border-rose-500 pl-6">
          <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">
            Սկսել և Ավարտել <br/>
            <span className="text-rose-500 font-black">Empezar, Comenzar, Terminar</span>
          </h2>
        </div>

        <div className="grid gap-6">
           <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0 shadow-lg">
                 <Zap size={28} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black italic uppercase tracking-tight">Empezar vs Comenzar</h3>
                 <p className="text-slate-600 font-bold italic leading-relaxed">
                   Երկուսն էլ նշանակում են <span className="text-rose-600 underline decoration-rose-200">«սկսել»</span>։ 
                   <span className="font-black text-slate-900 px-1">Empezar</span>-ը ավելի շատ է օգտագործվում խոսակցական լեզվում, 
                   իսկ <span className="font-black text-slate-900 px-1">Comenzar</span>-ը՝ մի փոքր ավելի պաշտոնական է։
                 </p>
                 <div className="bg-rose-50/50 p-4 rounded-xl border-l-4 border-rose-400">
                    <p className="text-sm font-black text-rose-800 uppercase tracking-widest italic">Կարևոր է!</p>
                    <p className="text-slate-600 font-bold italic">Երկուսն էլ անկանոն են. «E» տառը դառնում է «IE»:</p>
                 </div>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex items-start gap-6 text-white">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 shadow-xl border border-emerald-500/30">
                 <Layers size={28} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black italic uppercase tracking-tight text-emerald-400">Terminar</h3>
                 <p className="text-white/60 font-bold italic leading-relaxed">
                   Նշանակում է <span className="text-white underline decoration-emerald-500">«ավարտել»</span> կամ <span className="text-white underline decoration-emerald-500">«վերջացնել»</span>։ 
                   Սա կանոնավոր բայ է և խոնարհվում է ինչպես սովորական -AR բայերը։
                 </p>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Conjugation Tables */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
           <div className="w-16 h-16 bg-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-indigo-600 shadow-xl rotate-6">
              <Book size={32} />
           </div>
           <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Բայերի Խոնարհումը</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {VERB_DATA.map((verb, idx) => (
             <motion.div 
               key={verb.verb}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               whileHover={{ y: -5 }}
               className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden group"
             >
                <div className={`px-8 py-8 flex flex-col gap-1 transition-colors ${verb.type.includes('Անկանոն') ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">{verb.type}</span>
                   <h4 className="text-3xl font-black italic uppercase tracking-tighter">{verb.verb}</h4>
                   <span className="text-sm font-bold italic opacity-70 border-t border-white/20 pt-2 mt-2">{verb.translation}</span>
                </div>
                <div className="p-8 space-y-4">
                   {verb.conjugations.map(conj => (
                     <div key={conj.person} className="flex justify-between items-center group/row">
                        <span className="text-slate-400 font-black italic uppercase text-[10px] tracking-widest group-hover/row:text-slate-900 transition-colors">{conj.person}</span>
                        <span className={`text-lg font-black italic transition-all ${conj.word.includes('ie') ? 'text-rose-600 scale-110' : 'text-slate-900'}`}>{conj.word}</span>
                     </div>
                   ))}
                </div>
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
}

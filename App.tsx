import React, { useState, useRef, useEffect } from 'react';
import { performIstikhara } from './services/geminiService';
import { IstikharaResponse, IstikharaResultType, ViewState } from './types';
import OrnamentalBorder from './components/OrnamentalBorder';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('LANDING');
  const [intention, setIntention] = useState<string>('');
  const [result, setResult] = useState<IstikharaResponse | null>(null);
  
  // Audio ref for effect (optional silent conceptual placeholder)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    setViewState('INTENTION');
  };

  const handlePerformIstikhara = async () => {
    setViewState('LOADING');
    try {
      const data = await performIstikhara(intention);
      setResult(data);
      // Simulate a small delay for dramatic effect if API is too fast
      setTimeout(() => {
        setViewState('RESULT');
      }, 1500);
    } catch (e) {
      console.error(e);
      // Return to landing on critical error
      setViewState('LANDING');
      alert("خطایی در ارتباط رخ داد. لطفا دوباره تلاش کنید.");
    }
  };

  const handleReset = () => {
    setIntention('');
    setResult(null);
    setViewState('LANDING');
  };

  // Helper to get color based on result
  const getResultColor = (type?: IstikharaResultType) => {
    switch (type) {
      case IstikharaResultType.GOOD: return 'text-green-700';
      case IstikharaResultType.BAD: return 'text-red-700';
      case IstikharaResultType.MODERATE: return 'text-amber-600';
      default: return 'text-islamic-base';
    }
  };

  const getResultBg = (type?: IstikharaResultType) => {
    switch (type) {
        case IstikharaResultType.GOOD: return 'bg-green-100 border-green-300';
        case IstikharaResultType.BAD: return 'bg-red-100 border-red-300';
        case IstikharaResultType.MODERATE: return 'bg-amber-100 border-amber-300';
        default: return 'bg-gray-100';
      }
  }

  return (
    <div className="min-h-screen w-full bg-islamic-dark bg-arabesque relative flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-islamic-base/80 to-islamic-dark/95 pointer-events-none z-0"></div>
      
      {/* Decorative top header */}
      <div className="absolute top-6 z-20 w-full text-center">
        <h1 className="text-islamic-gold text-2xl md:text-3xl font-quran drop-shadow-md">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</h1>
      </div>

      <div className="relative z-10 w-full max-w-lg transition-all duration-500 ease-in-out">
        
        {/* VIEW: LANDING */}
        {viewState === 'LANDING' && (
          <OrnamentalBorder className="animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-8 py-8">
              <div className="w-32 h-32 mx-auto bg-islamic-base rounded-full flex items-center justify-center shadow-inner border-4 border-islamic-gold">
                 <svg className="w-16 h-16 text-islamic-cream" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l-5.5 9h11L12 2zm0 3.8l2.6 4.2h-5.2L12 5.8zM4 14h16v2H4v-2zm0 4h16v2H4v-2z"/>
                    <path d="M19 10V8h-2V6H7v2H5v2h2v2h10v-2h2z" opacity=".3"/>
                 </svg>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-islamic-base mb-2">نور الاستخاره</h2>
                <p className="text-gray-600 leading-relaxed">
                  با توسل به کلام الله مجید، برای تصمیمات مهم زندگی خود طلب خیر کنید.
                </p>
              </div>

              <button 
                onClick={handleStart}
                className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 bg-islamic-base rounded-full hover:bg-islamic-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-gold shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <span>نیت کنید</span>
                <svg className="w-5 h-5 mr-2 -ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </OrnamentalBorder>
        )}

        {/* VIEW: INTENTION FORM */}
        {viewState === 'INTENTION' && (
           <OrnamentalBorder className="animate-in slide-in-from-bottom duration-500">
             <div className="space-y-6">
               <div className="text-center">
                 <h3 className="text-xl font-bold text-islamic-base">نیت خود را مشخص کنید</h3>
                 <p className="text-sm text-gray-500 mt-2">
                   می‌توانید نیت خود را بنویسید تا تفسیر دقیق‌تری دریافت کنید، یا با دلی پاک بر دکمه استخاره کلیک کنید.
                 </p>
               </div>

               <div className="relative">
                 <textarea
                   value={intention}
                   onChange={(e) => setIntention(e.target.value)}
                   placeholder="مثلاً: آیا انجام معامله خرید خانه به صلاح است؟"
                   className="w-full h-32 p-4 bg-islamic-cream border-2 border-islamic-base/20 rounded-xl focus:border-islamic-gold focus:ring-1 focus:ring-islamic-gold outline-none resize-none text-islamic-dark placeholder-gray-400"
                 />
                 <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                   {intention.length} کاراکتر
                 </div>
               </div>

               <div className="flex flex-col gap-3">
                 <button 
                   onClick={handlePerformIstikhara}
                   disabled={false} 
                   className="w-full py-3 bg-islamic-gold hover:bg-islamic-accent text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center"
                 >
                   <span className="text-lg">انجام استخاره</span>
                 </button>
                 <button 
                   onClick={handleReset}
                   className="text-gray-500 hover:text-islamic-dark text-sm"
                 >
                   بازگشت
                 </button>
               </div>
             </div>
           </OrnamentalBorder>
        )}

        {/* VIEW: LOADING */}
        {viewState === 'LOADING' && (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        )}

        {/* VIEW: RESULT */}
        {viewState === 'RESULT' && result && (
            <OrnamentalBorder className="animate-in zoom-in duration-700">
              <div className="space-y-6 text-center">
                
                {/* Result Header */}
                <div className={`py-2 px-4 rounded-full inline-block border ${getResultBg(result.resultType)}`}>
                  <span className={`font-bold text-xl ${getResultColor(result.resultType)}`}>
                    {result.briefResult}
                  </span>
                </div>

                {/* Quran Verse */}
                <div className="py-6 border-b border-islamic-gold/20">
                   <div className="font-quran text-3xl md:text-4xl text-islamic-dark leading-loose mb-4 px-2" dir="rtl">
                     {result.arabicText}
                   </div>
                   <p className="text-islamic-base font-quran text-lg flex items-center justify-center gap-2 opacity-80">
                     <span>﴿سوره {result.surahName} - آیه {result.verseNumber}﴾</span>
                   </p>
                </div>

                {/* Translation */}
                <div className="bg-islamic-cream p-4 rounded-lg border border-islamic-gold/10">
                   <p className="text-gray-700 italic leading-relaxed">
                     "{result.persianTranslation}"
                   </p>
                </div>

                {/* Interpretation */}
                <div className="text-right space-y-2">
                  <h4 className="font-bold text-islamic-base border-b border-gray-200 pb-2 mb-2">تفسیر و توصیه:</h4>
                  <p className="text-gray-800 leading-7 text-justify text-sm md:text-base">
                    {result.interpretation}
                  </p>
                </div>

                <button 
                   onClick={handleReset}
                   className="w-full py-3 mt-4 border-2 border-islamic-base text-islamic-base font-bold rounded-xl hover:bg-islamic-base hover:text-white transition-colors"
                 >
                   استخاره جدید
                 </button>
              </div>
            </OrnamentalBorder>
        )}

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-islamic-cream/40 text-xs">
        طراحی شده با هوش مصنوعی برای تقرب به قرآن
      </div>
    </div>
  );
};

export default App;
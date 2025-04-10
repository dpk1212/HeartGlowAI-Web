import React from 'react';

const ComingSoonCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-heartglow-charcoal to-heartglow-deepgray text-white p-8 rounded-xl shadow-lg mb-12 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl border border-gray-800">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-heartglow-pink/10 to-heartglow-violet/10 rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-tr from-heartglow-indigo/10 to-heartglow-violet/10 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-heartglow-pink/20 to-heartglow-violet/20 rounded-lg flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-heartglow-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-heartglow-offwhite to-heartglow-pink bg-clip-text text-transparent">
            Coming Soon: "Feel This For Me"
          </h2>
        </div>
        
        <p className="text-gray-300 mb-8 ml-16 leading-relaxed">
          Send anonymous emotional requests to your connections, letting them respond with heartfelt messages when you need them most.
        </p>
        
        <div className="ml-16 flex flex-wrap gap-3">
          <div className="text-sm font-medium bg-heartglow-indigo/20 border border-heartglow-indigo/30 px-4 py-2 rounded-full flex items-center">
            <span className="w-2 h-2 bg-heartglow-pink rounded-full mr-2 animate-pulse"></span>
            In Development
          </div>
          
          <div className="text-sm font-medium bg-heartglow-deepgray/40 px-4 py-2 rounded-full border border-gray-700">
            Available in Premium Plan
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonCard; 
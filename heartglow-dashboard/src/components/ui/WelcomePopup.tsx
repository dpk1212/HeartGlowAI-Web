import React from 'react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close when clicking the backdrop
    >
      <div 
        className="bg-gray-800 dark:bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 max-w-md w-full mx-4 text-white transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        style={{ animationFillMode: 'forwards' }} // Keep final state of animation
      >
        <style jsx>{`
          @keyframes fade-in-scale {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fade-in-scale {
            animation: fade-in-scale 0.3s ease-out forwards;
          }
        `}</style>
        
        <h2 className="text-2xl font-semibold text-center mb-4 text-heartglow-pink">
          Find the Right Words, Effortlessly
        </h2>
        
        <p className="text-gray-300 dark:text-gray-400 mb-6 text-center text-base leading-relaxed">
          Do you ever struggle to express yourself clearly, especially in important relationships? Misunderstandings can happen easily, leading to frustration and distance.
        </p>
        
        <p className="text-gray-300 dark:text-gray-400 mb-6 text-center text-base leading-relaxed">
          HeartGlow AI is here to help. We combine emotional intelligence insights with AI assistance to help you communicate authentically, navigate difficult conversations with grace, and build stronger, more meaningful connections.
        </p>

        <p className="text-gray-300 dark:text-gray-400 mb-8 text-center text-base font-medium">
           Ready to transform your communication?
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-heartglow-pink hover:bg-fuchsia-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-opacity-50"
          >
            Let's Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup; 
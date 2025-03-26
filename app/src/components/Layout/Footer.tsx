import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">HeartGlowAI</h3>
            <p className="mt-2 text-sm text-gray-600">
              Empowering relationships through AI-powered communication.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="mailto:support@heartglowai.com" className="text-sm text-gray-600 hover:text-primary">
                  support@heartglowai.com
                </a>
              </li>
              <li>
                <a href="https://twitter.com/heartglowai" className="text-sm text-gray-600 hover:text-primary">
                  @heartglowai
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} HeartGlowAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 
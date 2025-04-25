import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn Button
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn Card
import { CheckCircle } from 'lucide-react'; // Icon for benefits

interface UpgradePromptProps {
  onUpgradeClick: () => void; // Function to call when upgrade button is clicked
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ onUpgradeClick }) => {
  return (
    <div className="flex justify-center items-center w-full px-4 sm:px-8 my-4"> {/* Centering container */}
      <Card className="max-w-md w-full bg-gradient-to-br from-[#2A2A45]/90 to-[#1F1F35]/90 border border-[#3A3A5C]/40 shadow-xl text-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-lg font-semibold text-center">
            Ready to Go Deeper?
          </CardTitle>
          <CardDescription className="text-sm text-gray-300/80 text-center mt-1">
            Looks like you're making real progress. To get the most out of HeartGlow, personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="text-center mb-4">
             <p className="text-sm font-medium text-gray-200 mb-2">Want to track this conversation, save insights, and get relationship-specific support?</p>
             <p className="text-sm text-gray-300/90">Create a Connection — and let HeartGlow remember what matters most.</p>
          </div>
          
          <div className="border-t border-[#3A3A5C]/40 pt-4 space-y-2">
            <p className="text-sm font-semibold text-center text-gray-200 mb-2">Unlock Premium to:</p>
            <ul className="space-y-1.5 text-xs text-gray-300/90">
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0" /> Save your messages & insights</li>
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0" /> Get guidance tailored to real people</li>
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0" /> See your emotional growth over time</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center bg-[#1A1A2E]/50 pt-4 pb-5 px-5">
          <Button 
            className="w-full bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 border border-white/10 font-semibold"
            onClick={onUpgradeClick}
          >
            Upgrade to Premium – $4.99/month
          </Button>
          <p className="text-[10px] text-gray-400/80 mt-2">Cancel anytime · Encrypted & private</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpgradePrompt; 
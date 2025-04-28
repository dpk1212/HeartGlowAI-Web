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
            Unlock the Full HeartGlow Library — And Never Feel Stuck Again.
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="text-center mb-4 space-y-2 text-sm text-gray-300/90">
            <p>
              Right now, you're glimpsing what's possible.<br/>
              Upgrade to HeartGlow Premium and get unlimited access to every guide, every emotional framework, and every future breakthrough we create.
            </p>
            <p>
              No more feeling stuck, lost for words, or second-guessing what to say.<br/>
              You'll have proven emotional tools at your fingertips — every time it matters most.
            </p>
            <p className="text-xs text-gray-400/80 pt-1">
              Plus: Save your connections and track your emotional growth over time. Your conversations, your insights — always secure, always yours.
            </p>
          </div>
          
          <div className="border-t border-[#3A3A5C]/40 pt-4 space-y-2">
            <p className="text-sm font-semibold text-center text-gray-200 mb-2">What You Unlock:</p>
            <ul className="space-y-1.5 text-xs text-gray-300/90">
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Unlimited access to all HeartGlow Guides, Frameworks, and Tools</li>
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Early access to every new release we build</li>
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Save your conversations, insights, and emotional milestones</li>
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Personalize HeartGlow to your real relationships</li>
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Build emotional clarity, not just today — but for life</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center bg-[#1A1A2E]/50 pt-4 pb-5 px-5">
          <Button 
            className="w-full bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 border border-white/10 font-semibold"
            onClick={onUpgradeClick}
          >
            Get Unlimited Access – $4.99/month
          </Button>
          <p className="text-[10px] text-gray-400/80 mt-2">Cancel anytime. Private, Encrypted, and Always Growing.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpgradePrompt; 
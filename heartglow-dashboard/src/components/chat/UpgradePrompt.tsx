import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, LockKeyhole, Star } from 'lucide-react'; // Added LockKeyhole, Star

interface UpgradePromptProps {
  onUpgradeClick: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ onUpgradeClick }) => {
  return (
    <div className="flex justify-center items-center w-full px-4 sm:px-8 my-4">
      <Card className="max-w-md w-full bg-gradient-to-br from-[#2A2A45]/90 to-[#1F1F35]/90 border border-[#3A3A5C]/40 shadow-xl text-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-5 text-center"> {/* Adjusted padding, centered */}
           <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-heartglow-pink/20 to-heartglow-violet/20">
             <LockKeyhole className="w-6 h-6 text-heartglow-pink" /> {/* Added Icon */}
           </div>
          <CardTitle className="text-xl font-semibold">
            Unlock Your Full Potential with HeartGlow Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="text-center mb-5 space-y-2 text-sm text-gray-300/90">
            <p>
              Right now, you're glimpsing what's possible. Upgrade to get unlimited access to every guide, framework, and future breakthrough we create.
            </p>
            <p>
              No more feeling stuck or lost for words — gain the clarity and confidence to connect deeply.
            </p>
          </div>

          {/* --- Social Proof Placeholder --- */}
          <div className="mb-5 px-3 py-2.5 bg-white/5 rounded-lg border border-white/10 text-center">
            <div className="flex justify-center mb-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-xs italic text-gray-300/80">
              "This genuinely helped me say things I've avoided for years."
            </p>
            {/* <p className="text-[10px] text-gray-400/70 mt-0.5">- Real User Feedback</p> */}
          </div>
          {/* --- End Social Proof --- */}

          <div className="border-t border-[#3A3A5C]/40 pt-4 space-y-2">
            <p className="text-sm font-semibold text-center text-gray-200 mb-3">What You Unlock:</p>
            <ul className="space-y-1.5 text-xs text-gray-300/90">
              {/* List items slightly simplified */}
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Unlimited Guides, Frameworks & Tools</li>
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Early Access to New Releases</li>
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Save Conversations & Milestones</li>
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Personalize to Your Relationships</li>
              <li className="flex items-start"><CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400/80 flex-shrink-0 mt-0.5" /> Build Lasting Emotional Clarity</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center bg-[#1A1A2E]/50 pt-4 pb-5 px-5">
          <Button
            className="w-full bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 border border-white/10 font-semibold text-base py-3 h-auto" /* Adjusted size/padding */
            onClick={onUpgradeClick}
          >
            Unlock Premium Now – $4.99/month
          </Button>
          <p className="text-[10px] text-gray-400/80 mt-2">Cancel anytime. Private, Encrypted, and Always Growing.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpgradePrompt; 
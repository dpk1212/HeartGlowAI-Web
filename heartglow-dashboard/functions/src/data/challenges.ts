// File: heartglow-dashboard/functions/src/data/challenges.ts

export type ChallengeCriteriaType =
  | 'sendMessage' // Send a message to someone
  | 'sendMessageToMultiple' // Send messages to a specific number of people
  | 'receiveMessage' // Not used yet, but maybe future?
  | 'completeJournal' // Complete a journal prompt
  | 'other'; // For custom/manual tracking if needed

export interface ChallengeCriteria {
  type: ChallengeCriteriaType;
  value: number | string; // e.g., for 'sendMessageToMultiple', value is the number. For 'sendMessage', might be recipient category (e.g., 'friend', 'family') - TBD
  description?: string; // Optional clearer description for display
}

export interface ChallengeDefinition {
  id: string; // Unique ID (e.g., "appreciation_1", "reconnect_3_weekly") - used as Firestore doc ID
  name: string; // Short display name (e.g., "Monthly Gratitude")
  description: string; // Longer description shown to user
  promptExample?: string; // Example message/prompt if applicable
  icon: string; // Icon identifier (e.g., "HeartIcon", "SparkleIcon") - needs mapping on frontend
  category: 'Appreciation' | 'Reconnection' | 'Emotional Expression' | 'Apology & Repair' | 'Encouragement' | 'Reflection & Depth' | 'Everyday Care';
  originalType: 'daily' | 'weekly' | 'milestone' | 'evergreen'; // Original classification
  rewardXP: number; // Experience points awarded
  rewardUnlock?: string; // Optional: identifier for feature/cosmetic unlocked
  isActive: boolean; // Whether the challenge is currently available
  criteria: ChallengeCriteria; // How to complete the challenge
}


export const challengesData: ChallengeDefinition[] = [
  // --- Appreciation ---
  {
    id: 'appreciation_1',
    name: 'Thank someone who helped you this month',
    description: 'Send a genuine message of thanks to someone who made a difference for you recently.',
    promptExample: `Hey [Name], just wanted to say thanks again for helping me with [Task] last week. Really appreciate you!`,
    icon: 'GiftIcon',
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'general' }
  },
  {
    id: 'appreciation_2',
    name: "Appreciate someone's unnoticed effort",
    description: 'Recognize someone for the effort they put in, especially if it often goes unnoticed.',
    promptExample: `Hi [Name], I noticed how much work you put into [Project/Situation]. Just wanted you to know it doesn't go unseen and I really appreciate it.`,
    icon: 'EyeIcon',
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'observation' }
  },
  {
    id: 'appreciation_3',
    name: 'Send gratitude to a mentor or teacher',
    description: 'Reach out to someone who taught you something valuable (formally or informally).',
    icon: 'AcademicCapIcon',
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'mentor' }
  },
   {
    id: 'appreciation_4',
    name: 'Thank someone from your past',
    description: 'Think of someone from years ago who had a positive impact and send them a message.',
    icon: 'RewindIcon',
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'past_contact' }
  },
  {
    id: 'appreciation_5',
    name: 'Appreciate a friend for emotional support',
    description: 'Tell a friend how much their support means to you, especially during a specific time.',
    icon: 'UserGroupIcon',
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'friend_support' }
  },
  {
    id: 'appreciation_6',
    name: 'Recognize a coworker for their energy',
    description: 'Acknowledge a colleague whose attitude or presence makes work better.',
    icon: 'BriefcaseIcon',
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'coworker' }
  },
  {
    id: 'appreciation_7_milestone',
    name: 'Thank 3 people for who they are — not what they do',
    description: 'Milestone: Send messages to three different people appreciating their intrinsic qualities.',
    icon: 'StarIcon',
    category: 'Appreciation',
    originalType: 'milestone',
    rewardXP: 50,
    rewardUnlock: 'AppreciationBadge',
    isActive: true,
    criteria: { type: 'sendMessageToMultiple', value: 3, description: 'intrinsic_quality' }
  },
  {
    id: 'appreciation_8',
    name: 'Highlight a trait you admire in someone',
    description: 'Tell someone a specific positive trait you see in them (e.g., kindness, resilience, creativity).',
    icon: 'SunIcon',
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'trait_admiration' }
  },
  {
    id: 'appreciation_9',
    name: 'Surprise "you matter" message',
    description: 'Send an unexpected message simply letting someone know they matter to you.',
    icon: 'ChatBubbleLeftRightIcon',
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'mattering' }
  },
  {
    id: 'appreciation_10',
    name: "Write a message to someone who's always shown up",
    description: "Acknowledge someone's consistent presence and support in your life.",
    icon: 'UserIcon', // Placeholder - consider a better icon
    category: 'Appreciation',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'consistent_support' }
  },

  // --- Reconnection ---
  {
    id: 'reconnect_1',
    name: 'Reach out to an old friend',
    description: `Send a simple "hello" or "thinking of you" to a friend you haven't spoken to in a while.`,
    icon: 'UserGroupIcon',
    category: 'Reconnection',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'old_friend' }
  },
  {
    id: 'reconnect_2',
    name: 'Message someone after 6+ months',
    description: "Break the silence with someone you haven't connected with in over six months.",
    icon: 'ClockIcon',
    category: 'Reconnection',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'long_time_no_see' }
  },
  {
    id: 'reconnect_3_weekly',
    name: "Reconnect with 2 people you\'ve lost touch with",
    description: 'Weekly Goal: Reach out to two different people you miss connecting with.',
    icon: 'CalendarDaysIcon',
    category: 'Reconnection',
    originalType: 'weekly',
    rewardXP: 25,
    isActive: true,
    criteria: { type: 'sendMessageToMultiple', value: 2, description: 'lost_touch' }
  },
  {
    id: 'reconnect_4',
    name: 'Text a distant family member',
    description: "Send a quick message to a family member you don't see or talk to often.",
    icon: 'HomeIcon',
    category: 'Reconnection',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'distant_family' }
  },
  {
    id: 'reconnect_5',
    name: 'Send a "thinking of you" message',
    description: 'Let someone know they crossed your mind, with no expectation of a long chat.',
    icon: 'EnvelopeIcon',
    category: 'Reconnection',
    originalType: 'daily', // Could be daily
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'thinking_of_you' }
  },
   {
    id: 'reconnect_6',
    name: "Reopen contact gently with someone",
    description: "Send a low-pressure message to someone you've drifted from, acknowledging the time passed.",
    icon: 'ChatBubbleLeftEllipsisIcon',
    category: 'Reconnection',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'gentle_reopen' }
  },
  {
    id: 'reconnect_7',
    name: 'Break the ice after a falling out',
    description: 'If appropriate, send a simple, non-demanding message to test the waters after a disagreement.',
    icon: 'PaperAirplaneIcon',
    category: 'Reconnection',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'post_conflict_icebreaker' }
  },
  {
    id: 'reconnect_8',
    name: 'Reignite a thread from the past',
    description: 'Reference a past conversation or shared interest in a message to an old contact.',
    icon: 'ArrowPathRoundedSquareIcon',
    category: 'Reconnection',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'past_thread' }
  },
  {
    id: 'reconnect_9_milestone',
    name: 'Share a memory with 3 different people',
    description: 'Milestone: Send a message to three different people sharing a positive memory you have with them.',
    icon: 'CameraIcon',
    category: 'Reconnection',
    originalType: 'milestone',
    rewardXP: 50,
    rewardUnlock: 'ReconnectionBadge',
    isActive: true,
    criteria: { type: 'sendMessageToMultiple', value: 3, description: 'shared_memory' }
  },
  {
    id: 'reconnect_10',
    name: "Say you still care, even if things changed",
    description: 'Let someone know you still value the connection, even if the relationship dynamic has shifted.',
    icon: 'HeartIcon',
    category: 'Reconnection',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'caring_despite_change' }
  },

  // --- Emotional Expression ---
  {
    id: 'expression_1',
    name: `Say "I love you" to someone unexpected`,
    description: 'Express love or deep appreciation to someone you care about but might not say it to often (friend, family).',
    icon: 'HeartIcon',
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'express_love_platonic' }
  },
  {
    id: 'expression_2_milestone',
    name: 'Tell 3 people what they truly mean to you',
    description: 'Milestone: Articulate the specific, meaningful impact three different people have had on your life.',
    icon: 'SpeakerWaveIcon',
    category: 'Emotional Expression',
    originalType: 'milestone',
    rewardXP: 60,
    rewardUnlock: 'ExpressionBadge',
    isActive: true,
    criteria: { type: 'sendMessageToMultiple', value: 3, description: 'meaningful_impact' }
  },
  {
    id: 'expression_3',
    name: 'Share something vulnerable',
    description: 'With someone you trust, share a feeling, struggle, or experience that feels a bit vulnerable.',
    icon: 'LockOpenIcon',
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'share_vulnerability' } // Could also be journal?
  },
  {
    id: 'expression_4',
    name: "Reveal something you've held in",
    description: "Share a thought or feeling you've been hesitant to express to someone relevant.",
    icon: 'ChatBubbleBottomCenterTextIcon',
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'reveal_held_thought' }
  },
  {
    id: 'expression_5',
    name: "Reflect on someone's impact",
    description: 'Tell someone specifically how their actions or words positively affected you.',
    icon: 'ArrowsPointingInIcon', // Placeholder
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'reflect_impact' }
  },
  {
    id: 'expression_6',
    name: 'Say something difficult kindly',
    description: 'Address a slightly difficult topic or feeling with someone, focusing on kindness and clarity.',
    icon: 'HandThumbUpIcon', // Placeholder
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'difficult_kindly' }
  },
  {
    id: 'expression_7',
    name: 'Ask a deep emotional question',
    description: `Ask someone you're close with a question that invites deeper reflection or sharing (e.g., "What's bringing you joy lately?", "How are you really feeling?").`,
    icon: 'QuestionMarkCircleIcon',
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'deep_question' }
  },
  {
    id: 'expression_8',
    name: "Tell someone you're proud of them",
    description: "Express genuine pride in someone's accomplishment, effort, or personal growth.",
    icon: 'TrophyIcon',
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'express_pride' }
  },
  {
    id: 'expression_9',
    name: 'Admit a fear to someone close',
    description: 'Share a current fear or anxiety with a trusted friend or family member.',
    icon: 'FaceFrownIcon', // Placeholder
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'admit_fear' }
  },
  {
    id: 'expression_10',
    name: "Mirror someone's emotional strength back to them",
    description: 'Acknowledge and affirm the emotional strength you see in someone, especially if they are struggling.',
    icon: 'SparklesIcon',
    category: 'Emotional Expression',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'mirror_strength' }
  },

  // --- Apology & Repair ---
  {
    id: 'apology_1',
    name: 'Send a sincere apology',
    description: 'Offer a genuine apology for something, big or small, taking responsibility.',
    icon: 'ReceiptRefundIcon', // Placeholder
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'sincere_apology' }
  },
  {
    id: 'apology_2_milestone',
    name: 'Repair 2 relationships that feel unfinished',
    description: 'Milestone: Take a step towards repair (apology, clarification, check-in) in two different relationships with unresolved tension.',
    icon: 'WrenchScrewdriverIcon',
    category: 'Apology & Repair',
    originalType: 'milestone',
    rewardXP: 70,
    rewardUnlock: 'RepairBadge',
    isActive: true,
    criteria: { type: 'sendMessageToMultiple', value: 2, description: 'relationship_repair_step' }
  },
  {
    id: 'apology_3',
    name: 'Apologize for emotional distance',
    description: "Acknowledge if you've been distant and apologize if it may have hurt someone.",
    icon: 'ArrowsRightLeftIcon',
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'apology_distance' }
  },
  {
    id: 'apology_4',
    name: 'Acknowledge past hurt you caused',
    description: 'If appropriate, acknowledge a past instance where your actions caused hurt, even if you apologized before.',
    icon: 'ArchiveBoxXMarkIcon', // Placeholder
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 25,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'acknowledge_past_hurt' }
  },
  {
    id: 'apology_5',
    name: "Validate someone's experience",
    description: "After a conflict or misunderstanding, send a message validating the other person's feelings or perspective.",
    icon: 'CheckBadgeIcon',
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'validate_experience' }
  },
  {
    id: 'apology_6',
    name: 'Reopen a tough conversation',
    description: "Gently suggest revisiting a difficult conversation that was left unresolved, if you feel ready.",
    icon: 'ArrowUturnLeftIcon',
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'reopen_tough_convo' }
  },
  {
    id: 'apology_7',
    name: `Say "I'm sorry" with no defense`,
    description: 'Practice offering a simple, direct apology without adding "but..." or explanations.',
    icon: 'ShieldExclamationIcon', // Placeholder
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'apology_no_defense' }
  },
  {
    id: 'apology_8',
    name: 'Ask someone how they really felt',
    description: 'After an interaction that might have been tense, ask the other person how they experienced it.',
    icon: 'ChatBubbleLeftRightIcon',
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'ask_how_felt' }
  },
  {
    id: 'apology_9',
    name: 'Text a soft opening after conflict',
    description: 'Send a gentle, non-demanding message to reconnect after a disagreement has cooled down.',
    icon: 'PaperAirplaneIcon', // Re-use
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'soft_opening_post_conflict' }
  },
  {
    id: 'apology_10',
    name: 'Offer peace to an unresolved connection',
    description: "Send a message expressing a desire for peace or goodwill, even if full reconciliation isn't possible.",
    icon: 'ScaleIcon', // Placeholder
    category: 'Apology & Repair',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'offer_peace' }
  },

  // --- Encouragement ---
  {
    id: 'encourage_1',
    name: "Uplift someone who's struggling",
    description: 'Send a message of support and encouragement to someone going through a hard time.',
    icon: 'ArrowUpCircleIcon',
    category: 'Encouragement',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'support_struggling' }
  },
  {
    id: 'encourage_2_weekly',
    name: 'Encourage 3 people going through something',
    description: 'Weekly Goal: Reach out with specific encouragement to three different people facing challenges.',
    icon: 'LifebuoyIcon',
    category: 'Encouragement',
    originalType: 'weekly',
    rewardXP: 30,
    isActive: true,
    criteria: { type: 'sendMessageToMultiple', value: 3, description: 'encourage_challenged' }
  },
  {
    id: 'encourage_3',
    name: "Celebrate someone's small win",
    description: 'Acknowledge and celebrate a small accomplishment or positive step someone has made.',
    icon: 'PartyPopperIcon', // Requires mapping/library
    category: 'Encouragement',
    originalType: 'evergreen',
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'celebrate_small_win' }
  },
  {
    id: 'encourage_4',
    name: "Remind someone of their strength",
    description: 'Point out a specific strength you see in someone, especially if they are feeling down.',
    icon: 'BoltIcon',
    category: 'Encouragement',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'remind_strength' }
  },
  {
    id: 'encourage_5',
    name: `Send a "You've got this" message`,
    description: 'Offer simple, confident encouragement to someone facing a task or challenge.',
    icon: 'HandThumbUpIcon',
    category: 'Encouragement',
    originalType: 'daily', // Could be daily
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'you_got_this' }
  },
  {
    id: 'encourage_6',
    name: "Affirm someone's growth journey",
    description: 'Acknowledge the effort and progress someone is making on their personal growth path.',
    icon: 'ArrowTrendingUpIcon',
    category: 'Encouragement',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'affirm_growth' }
  },
  {
    id: 'encourage_7',
    name: "Compliment someone's effort, not outcome",
    description: 'Praise the hard work or process someone put in, regardless of the final result.',
    icon: 'AdjustmentsHorizontalIcon', // Placeholder
    category: 'Encouragement',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'compliment_effort' }
  },
  {
    id: 'encourage_8',
    name: "Cheer a friend's new chapter",
    description: 'Send excitement and support to a friend starting something new (job, move, relationship).',
    icon: 'RocketLaunchIcon',
    category: 'Encouragement',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'cheer_new_chapter' }
  },
  {
    id: 'encourage_9',
    name: 'Send hype before a big day',
    description: 'Text someone some encouragement and positive energy before an important event (interview, presentation, exam).',
    icon: 'MegaphoneIcon',
    category: 'Encouragement',
    originalType: 'evergreen',
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'pre_event_hype' }
  },
  {
    id: 'encourage_10',
    name: "Acknowledge someone quietly doing the work",
    description: 'Recognize someone who contributes consistently without seeking the spotlight.',
    icon: 'LightBulbIcon',
    category: 'Encouragement',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'acknowledge_quiet_work' }
  },

  // --- Reflection & Depth ---
  {
    id: 'reflect_1',
    name: "Ask someone how they've changed this year",
    description: 'Invite reflection by asking someone close about their personal evolution recently.',
    icon: 'BeakerIcon', // Placeholder
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'ask_about_change' }
  },
  {
    id: 'reflect_2_milestone',
    name: 'Reflect with 2 people on your shared growth',
    description: 'Milestone: Have conversations with two different people about how your relationship or shared experiences have shaped you both.',
    icon: 'UserGroupIcon', // Re-use
    category: 'Reflection & Depth',
    originalType: 'milestone',
    rewardXP: 60,
    rewardUnlock: 'ReflectionBadge',
    isActive: true,
    criteria: { type: 'sendMessageToMultiple', value: 2, description: 'reflect_shared_growth' }
  },
  {
    id: 'reflect_3',
    name: `Ask: "What do you wish I understood better?"`,
    description: 'In a safe relationship, ask someone what they wish you understood more deeply about them.',
    icon: 'KeyIcon',
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'ask_for_understanding' }
  },
  {
    id: 'reflect_4',
    name: "Tell someone what you've learned from them",
    description: "Share a specific lesson or insight you've gained from knowing someone.",
    icon: 'AcademicCapIcon', // Re-use
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'share_learned_lesson' }
  },
  {
    id: 'reflect_5',
    name: "Share how you've emotionally grown",
    description: 'Talk about a recent area of emotional growth or self-awareness with someone you trust.',
    icon: 'ArrowUpOnSquareIcon', // Placeholder
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'share_emotional_growth' } // Or journal?
  },
  {
    id: 'reflect_6',
    name: 'Explore a belief or value in dialogue',
    description: 'Have a conversation with someone about a core belief or value, exploring different perspectives.',
    icon: 'ChatBubbleOvalLeftEllipsisIcon',
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'explore_belief_dialogue' } // Hard to track
  },
  {
    id: 'reflect_7',
    name: "Talk about an internal shift you've experienced",
    description: 'Share an internal change in perspective, feeling, or understanding with a close connection.',
    icon: 'ArrowsPointingOutIcon', // Placeholder
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'share_internal_shift' }
  },
  {
    id: 'reflect_8',
    name: "Ask for honest feedback with openness",
    description: "Invite constructive feedback from someone you trust about a specific area, signaling you're open to hearing it.",
    icon: 'AdjustmentsVerticalIcon', // Placeholder
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'ask_honest_feedback' }
  },
  {
    id: 'reflect_9',
    name: 'Compare your past vs. present self with a friend',
    description: "Reflect with a friend on how you've both changed since you first met or since a certain time.",
    icon: 'ClockIcon', // Re-use
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'compare_past_present' }
  },
  {
    id: 'reflect_10',
    name: "Share an insight about yourself with someone close",
    description: 'Verbalize a recent self-insight or realization with a trusted person in your life.',
    icon: 'PuzzlePieceIcon',
    category: 'Reflection & Depth',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'share_self_insight' }
  },

  // --- Everyday Care ---
  {
    id: 'care_1',
    name: 'Check in with a friend today',
    description: `Send a simple "How are you doing?" or "Checking in" message to a friend.`,
    icon: 'ChatBubbleLeftIcon',
    category: 'Everyday Care',
    originalType: 'daily',
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'daily_check_in_friend' }
  },
  {
    id: 'care_2_weekly',
    name: 'Check in with 3 people this week',
    description: 'Weekly Goal: Make a point to check in on three different people throughout the week.',
    icon: 'CalendarIcon',
    category: 'Everyday Care',
    originalType: 'weekly',
    rewardXP: 20,
    isActive: true,
    criteria: { type: 'sendMessageToMultiple', value: 3, description: 'weekly_check_in' }
  },
  {
    id: 'care_3',
    name: 'Send a "just because" message',
    description: 'Text someone something nice, funny, or interesting just because you thought of them.',
    icon: 'SparklesIcon', // Re-use
    category: 'Everyday Care',
    originalType: 'daily',
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'just_because' }
  },
  {
    id: 'care_4',
    name: `Ask: "How can I support you right now?"`,
    description: 'Offer open-ended support to someone who might be going through something.',
    icon: 'QuestionMarkCircleIcon', // Re-use
    category: 'Everyday Care',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'offer_support_ask' }
  },
  {
    id: 'care_5',
    name: 'Text someone with zero pressure to reply',
    description: `Send a warm message explicitly stating they don't need to respond (e.g., "No need to reply, just thinking of you!").`,
    icon: 'EnvelopeOpenIcon',
    category: 'Everyday Care',
    originalType: 'evergreen',
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'no_pressure_reply' }
  },
  {
    id: 'care_6',
    name: "Offer help before it's asked for",
    description: "If you see a friend might need help with something specific, offer it proactively.",
    icon: 'GiftIcon', // Re-use
    category: 'Everyday Care',
    originalType: 'evergreen',
    rewardXP: 15,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'proactive_help_offer' } // Or 'other' if action based
  },
  {
    id: 'care_7',
    name: "Let someone know you're here if needed",
    description: "Send a simple reminder to someone that you're available if they need support.",
    icon: 'PhoneIcon',
    category: 'Everyday Care',
    originalType: 'evergreen',
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'here_if_needed' }
  },
  {
    id: 'care_8',
    name: 'Send a message on a difficult day (e.g., anniversary, birthday)',
    description: "Remember a friend's challenging day and send a supportive message.",
    icon: 'CalendarDaysIcon', // Re-use
    category: 'Everyday Care',
    originalType: 'evergreen',
    rewardXP: 10,
    isActive: true,
    criteria: { type: 'sendMessage', value: 'difficult_day_support' }
  },
  {
    id: 'care_9_milestone',
    name: 'Commit to 5 days of check-ins',
    description: 'Milestone: Check in with at least one person each day for 5 days straight.',
    icon: 'CheckCircleIcon',
    category: 'Everyday Care',
    originalType: 'milestone',
    rewardXP: 50,
    rewardUnlock: 'CareBadge',
    isActive: true,
    criteria: { type: 'other', value: 5, description: '5_consecutive_days_check_in' } // Needs custom tracking logic
  },
  {
    id: 'care_10',
    name: "Leave a kind comment on social instead of silent scrolling",
    description: "Engage positively by leaving a kind or thoughtful comment on someone's post.",
    icon: 'ChatBubbleBottomCenterTextIcon', // Re-use
    category: 'Everyday Care',
    originalType: 'daily',
    rewardXP: 5,
    isActive: true,
    criteria: { type: 'other', value: 'social_media_comment' } // Hard to track automatically
  }
]; 
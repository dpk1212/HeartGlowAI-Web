/**
 * Message Flow Functionality
 * This file handles all interactions for the message type selection and flow screens
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Setting up message flow event listeners");
    
    // Message type selection
    let selectedType = null;
    let selectedScenario = null;
    
    const messageTypeCards = document.querySelectorAll('.message-type-card');
    const nextBtn = document.getElementById('next-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const messageFlowScreen = document.getElementById('message-flow-screen');
    const backToTypesBtn = document.getElementById('back-to-types-btn');
    const selectedTypeIcon = document.getElementById('selected-type-icon');
    const selectedTypeText = document.getElementById('selected-type-text');
    const scenarioCards = document.querySelectorAll('.scenario-card');
    const createMessageBtn = document.getElementById('create-message-btn');
    const generatorScreen = document.getElementById('generator-screen');
    
    console.log("Message type cards found:", messageTypeCards.length);
    console.log("Next button found:", nextBtn !== null);
    
    // Add click listeners to message type cards
    messageTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log("Card clicked:", this.getAttribute('data-type'));
            
            // Remove selected class from all cards
            messageTypeCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Store the selected type
            selectedType = this.getAttribute('data-type');
            
            // Update selected type display in flow screen
            if (selectedTypeText && selectedTypeIcon) {
                selectedTypeText.textContent = this.querySelector('.type-title').textContent;
                selectedTypeIcon.textContent = this.querySelector('.type-icon').textContent;
            
                // Update example message based on selection
                updateExampleMessage(selectedType);
            }
            
            // Show next button
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
            }
        });
    });
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log("Next button clicked with selected type:", selectedType);
            
            if (selectedType) {
                welcomeScreen.classList.remove('active');
                messageFlowScreen.classList.add('active');
                
                // Update scenario cards based on selected type
                updateScenarioCards(selectedType);
            }
        });
    }
    
    // Back button click
    if (backToTypesBtn) {
        backToTypesBtn.addEventListener('click', function() {
            console.log("Back button clicked");
            
            messageFlowScreen.classList.remove('active');
            welcomeScreen.classList.add('active');
        });
    }
    
    // Scenario card selection
    if (scenarioCards.length > 0) {
        scenarioCards.forEach(card => {
            card.addEventListener('click', function() {
                console.log("Scenario card clicked:", this.getAttribute('data-scenario'));
                
                // Remove selected class from all cards
                scenarioCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Store selected scenario
                selectedScenario = this.getAttribute('data-scenario');
                
                // Update example message based on scenario
                updateExampleForScenario(selectedType, selectedScenario);
            });
        });
    }
    
    // Create message button click
    if (createMessageBtn) {
        createMessageBtn.addEventListener('click', function() {
            console.log("Create message button clicked with type:", selectedType, "scenario:", selectedScenario);
            prefillAndNavigateToGenerator(selectedType, selectedScenario);
        });
    }
    
    // Function to update scenario cards based on message type
    function updateScenarioCards(type) {
        console.log("Updating scenario cards for type:", type);
        
        const scenarioCards = document.querySelectorAll('.scenario-card');
        
        if (!scenarioCards || scenarioCards.length === 0) {
            console.log("No scenario cards found to update");
            return;
        }
        
        if (type === 'romantic') {
            scenarioCards[0].querySelector('h3').textContent = 'Reconnect after distance';
            scenarioCards[0].querySelector('p').textContent = 'Express care after time apart';
            
            scenarioCards[1].querySelector('h3').textContent = 'Show appreciation';
            scenarioCards[1].querySelector('p').textContent = 'Let them know their impact';
            
            scenarioCards[2].querySelector('h3').textContent = 'Express that you miss them';
            scenarioCards[2].querySelector('p').textContent = 'Share your feelings genuinely';
        } 
        else if (type === 'professional') {
            scenarioCards[0].querySelector('h3').textContent = 'Networking follow-up';
            scenarioCards[0].querySelector('p').textContent = 'Maintain professional connection';
            
            scenarioCards[1].querySelector('h3').textContent = 'Thank a colleague';
            scenarioCards[1].querySelector('p').textContent = 'Professional appreciation';
            
            scenarioCards[2].querySelector('h3').textContent = 'Request mentorship';
            scenarioCards[2].querySelector('p').textContent = 'Ask for guidance respectfully';
        }
        else if (type === 'personal') {
            scenarioCards[0].querySelector('h3').textContent = 'Rebuild a friendship';
            scenarioCards[0].querySelector('p').textContent = 'Bridge the gap after time';
            
            scenarioCards[1].querySelector('h3').textContent = 'Check in on someone';
            scenarioCards[1].querySelector('p').textContent = 'Show you care without pressure';
            
            scenarioCards[2].querySelector('h3').textContent = 'Apologize sincerely';
            scenarioCards[2].querySelector('p').textContent = 'Make amends genuinely';
        }
        
        // Reset selection
        scenarioCards.forEach(card => card.classList.remove('selected'));
        selectedScenario = null;
    }
    
    // Function to update example message based on type
    function updateExampleMessage(type) {
        console.log("Updating example message for type:", type);
        
        const exampleText = document.getElementById('example-message-text');
        const insightsList = document.querySelector('.example-insights ul');
        const toneSpan = document.querySelector('.example-tone');
        
        if (!exampleText || !insightsList || !toneSpan) {
            console.log("Example message elements not found");
            return;
        }
        
        if (type === 'romantic') {
            exampleText.textContent = "I've been thinking about you lately. The little things keep reminding me of our time together, and I realized I never properly expressed how much you mean to me. I miss the way you always knew how to make me laugh.";
            
            toneSpan.textContent = "Sincere • Balanced";
            
            insightsList.innerHTML = `
                <li>Opens with honest feelings without pressure</li>
                <li>Provides specific context for why you're reaching out</li>
                <li>Expresses appreciation in a sincere, specific way</li>
                <li>Leaves room for their response without expectations</li>
            `;
        }
        else if (type === 'professional') {
            exampleText.textContent = "I wanted to thank you for your support during the recent project. Your insights on the market research significantly impacted our strategic direction, and I appreciate you taking the time to share your expertise. It's been valuable working with you.";
            
            toneSpan.textContent = "Professional • Appreciative";
            
            insightsList.innerHTML = `
                <li>Clearly states the purpose upfront</li>
                <li>Provides specific details rather than generic praise</li>
                <li>Acknowledges their time and expertise</li>
                <li>Maintains professional tone while being genuine</li>
            `;
        }
        else if (type === 'personal') {
            exampleText.textContent = "Hey! I realized it's been a while since we caught up, and I've been wondering how you're doing. I remembered our conversation about your new job and was hoping to hear how it's going. Would love to reconnect whenever you have time.";
            
            toneSpan.textContent = "Friendly • Considerate";
            
            insightsList.innerHTML = `
                <li>Casual, warm opening that feels natural</li>
                <li>Shows you remember details from their life</li>
                <li>Expresses genuine interest in their wellbeing</li>
                <li>Offers to reconnect without pressure</li>
            `;
        }
    }
    
    // Function to update example for specific scenario
    function updateExampleForScenario(type, scenario) {
        console.log("Updating example for type:", type, "scenario:", scenario);
        
        const exampleText = document.getElementById('example-message-text');
        const insightsList = document.querySelector('.example-insights ul');
        const toneSpan = document.querySelector('.example-tone');
        
        if (!exampleText || !insightsList || !toneSpan) {
            console.log("Example message elements not found");
            return;
        }
        
        if (type === 'romantic' && scenario === 'reconnect') {
            exampleText.textContent = "It feels like it's been forever since we really talked. I've missed our conversations and the way you always had a different perspective on things. I'd love to catch up and hear what's been happening in your world lately.";
            
            toneSpan.textContent = "Warm • Inviting";
            
            insightsList.innerHTML = `
                <li>Acknowledges the time apart without blame</li>
                <li>Highlights specific qualities you appreciate</li>
                <li>Expresses genuine interest in their life</li>
                <li>Invites reconnection without pressure</li>
            `;
        }
        else if (type === 'romantic' && scenario === 'appreciation') {
            exampleText.textContent = "I was just thinking about how you remembered my favorite book and found that special edition for me. It's those thoughtful moments that make me appreciate you so much. You notice the little things that matter, and it means the world to me.";
            
            toneSpan.textContent = "Appreciative • Specific";
            
            insightsList.innerHTML = `
                <li>Mentions a specific action they took</li>
                <li>Explains why it was meaningful to you</li>
                <li>Shows how their actions affect you emotionally</li>
                <li>Focuses on gratitude without expectations</li>
            `;
        }
        else if (type === 'romantic' && scenario === 'missing') {
            exampleText.textContent = "There was a song playing today that immediately made me think of you. It brought back memories of our time together, and I realized how much I miss your presence in my life. Your smile, your laugh - they've left such an impression on me.";
            
            toneSpan.textContent = "Heartfelt • Genuine";
            
            insightsList.innerHTML = `
                <li>Uses a specific trigger/memory as context</li>
                <li>Shares the emotional impact of the memory</li>
                <li>Mentions specific traits that are missed</li>
                <li>Expresses feelings without being overwhelming</li>
            `;
        }
        else if (type === 'professional' && scenario === 'reconnect') {
            exampleText.textContent = "I hope this message finds you well. It's been some time since our paths crossed at the industry conference, and I've been following your company's recent developments with interest. I'd love to reconnect and perhaps schedule a brief call to discuss potential collaboration opportunities.";
            
            toneSpan.textContent = "Professional • Strategic";
            
            insightsList.innerHTML = `
                <li>References your last interaction specifically</li>
                <li>Shows you've maintained interest in their work</li>
                <li>Offers a clear reason for reconnecting</li>
                <li>Suggests a specific next step</li>
            `;
        }
        // Add more scenario combinations as needed
    }
    
    // Function to prefill generator and navigate
    function prefillAndNavigateToGenerator(type, scenario) {
        console.log("Prefilling and navigating to generator with type:", type, "scenario:", scenario);
        
        // Get references to generator screen elements
        const relationshipSelect = document.getElementById('relationship');
        const scenarioInput = document.getElementById('scenario');
        
        if (!relationshipSelect || !scenarioInput) {
            console.log("Generator form elements not found");
            return;
        }
        
        // Navigate to generator screen
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        
        if (generatorScreen) {
            generatorScreen.classList.add('active');
        }
        
        // Prefill form based on selections
        if (type === 'romantic') {
            relationshipSelect.value = 'Romantic Partner';
            
            if (scenario === 'reconnect') {
                scenarioInput.value = "I want to reconnect with my partner after we've been distant";
            }
            else if (scenario === 'appreciation') {
                scenarioInput.value = "I want to express appreciation for something thoughtful my partner did";
            }
            else if (scenario === 'missing') {
                scenarioInput.value = "I want to tell my partner how much I miss them";
            }
            else {
                scenarioInput.value = "I want to express my feelings to my romantic partner";
            }
        } 
        else if (type === 'professional') {
            relationshipSelect.value = 'Professional';
            
            if (scenario === 'reconnect') {
                scenarioInput.value = "I want to reconnect with a former colleague or business contact";
            }
            else if (scenario === 'appreciation') {
                scenarioInput.value = "I want to thank a colleague for their help on a project";
            }
            else if (scenario === 'missing') {
                scenarioInput.value = "I want to request mentorship or guidance from a professional contact";
            }
            else {
                scenarioInput.value = "I need to write a professional message to a colleague";
            }
        }
        else if (type === 'personal') {
            relationshipSelect.value = 'Friend';
            
            if (scenario === 'reconnect') {
                scenarioInput.value = "I want to rebuild a friendship after losing touch";
            }
            else if (scenario === 'appreciation') {
                scenarioInput.value = "I want to check in on a friend I haven't spoken to in a while";
            }
            else if (scenario === 'missing') {
                scenarioInput.value = "I need to apologize to a friend for something I did";
            }
            else {
                scenarioInput.value = "I want to reach out to a friend";
            }
        }
    }
}); 
// Learn button functionality for Perplexity API testing
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the Learn button
  const learnButton = document.getElementById('learn-btn');
  if (learnButton) {
    learnButton.addEventListener('click', async () => {
      try {
        // Change button appearance
        learnButton.disabled = true;
        learnButton.innerHTML = '<span class="new-conversation-icon">⏳</span> Testing...';
        
        // Test prompt
        const testPrompt = "What are three benefits of emotional intelligence in relationships?";
        
        // Call Perplexity API
        const result = await callPerplexityAPI(testPrompt);
        
        // Show simple alert with success or failure
        if (result && result.choices && result.choices[0]) {
          alert("✅ Perplexity API Test Successful!\n\nResponse: " + result.choices[0].message.content);
        } else {
          alert("❌ API returned empty or invalid response");
        }
      } catch (error) {
        // Show error
        alert("❌ Perplexity API Test Failed: " + error.message);
        console.error("Perplexity test error:", error);
      } finally {
        // Reset button
        learnButton.disabled = false;
        learnButton.innerHTML = '<span class="new-conversation-icon">🧠</span> Learn';
      }
    });
  }
}); 
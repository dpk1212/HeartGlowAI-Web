function goToLearningScreen() { console.log("LEARN BUTTON CLICKED!"); const homeScreen = document.getElementById("home-screen"); const learningScreen = document.getElementById("learning-screen"); if (homeScreen && learningScreen) { homeScreen.classList.remove("active"); homeScreen.style.display = "none"; learningScreen.style.display = "flex"; learningScreen.classList.add("active"); } else { alert("Navigation failed: Screens not found"); } }

// Add event listener when this script loads
document.addEventListener('DOMContentLoaded', function() {
  const backToHomeBtn = document.getElementById('back-to-home-from-learning');
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', function() {
      const homeScreen = document.getElementById("home-screen");
      const learningScreen = document.getElementById("learning-screen");
      
      if (homeScreen && learningScreen) {
        learningScreen.classList.remove("active");
        learningScreen.style.display = "none";
        homeScreen.style.display = "flex";
        homeScreen.classList.add("active");
      }
    });
  }
  
  // Add event listeners for question links
  const questionLinks = document.querySelectorAll('.question-link');
  questionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const question = this.getAttribute('data-question');
      if (question) {
        const learningSearch = document.querySelector('.learning-search');
        if (learningSearch) {
          learningSearch.value = question;
          // In a real implementation, this would trigger a search/API call
          alert('This feature will search for: ' + question);
        }
      }
    });
  });
});

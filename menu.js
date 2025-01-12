function startGame() {
    window.location.href = "index.html";  // Redirecționează către pagina jocului la apăsarea butonului "Play Game "
  }
   
   // Afișarea creditelor
function showCredits() {
    const creditsContainer = document.getElementById('creditsContainer');
    creditsContainer.style.display = 'block'; 
}

// Ascunderea creditelor
function hideCredits() {
    const creditsContainer = document.getElementById('creditsContainer');
    creditsContainer.style.display = 'none';
}


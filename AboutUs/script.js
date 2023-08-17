document.addEventListener("DOMContentLoaded", function () {
    const pdfViewer = document.getElementById("pdfViewer");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
  
    let currentPage = 1;
    const totalPages = pdfViewer.contentDocument ? pdfViewer.contentDocument.body.children.length : 0;
  
    function goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        pdfViewer.contentWindow.scrollTo(0, pdfViewer.contentDocument.body.children[pageNumber - 1].offsetTop);
        currentPage = pageNumber;
      }
    }
  
    prevButton.addEventListener("click", function () {
      goToPage(currentPage - 1);
    });
  
    nextButton.addEventListener("click", function () {
      goToPage(currentPage + 1);
    });
  });
  

  function toggleSidePanel() {
    const sidePanel = document.getElementById('sidePanel');
    const toggleIcon = document.getElementById('toggleBtn');

    if (sidePanel.style.display === 'none' || sidePanel.style.display === '') {
        sidePanel.style.display = 'block';
        toggleIcon.classList.replace('fas fa-bars fa-2x', 'fas fa-times fa-2x');
    } else {
        sidePanel.style.display = 'none';
        toggleIcon.classList.replace('fas fa-times fa-2x', 'fas fa-bars fa-2x');
    }
}
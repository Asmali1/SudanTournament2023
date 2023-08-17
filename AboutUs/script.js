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
  
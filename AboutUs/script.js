
  // Utility function to format a single digit number with a leading zero
function formatWithLeadingZero(number) {
    return number < 10 ? '0' + number : number;
}

function redirectToYelp() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            window.location.href = `https://www.yelp.com/search?find_desc=Halal&find_loc=${latitude},${longitude}`;
        }, function(error) {
            // Geolocation failed for some reason, use default address
            redirectToDefaultAddress();
        });
    } else {
        // Geolocation not supported, use default address
        redirectToDefaultAddress();
    }
}

function redirectToDefaultAddress() {
    const defaultAddress = "6490 Dublin Park Drive";
    window.location.href = `https://www.yelp.com/search?find_desc=Halal&find_loc=${encodeURIComponent(defaultAddress)}`;
}
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

document.getElementById('openSidePanel').addEventListener('click', toggleSidePanel);
document.getElementById('toggleBtn').addEventListener('click', toggleSidePanel);
// Function to handle side panel toggling
function toggleSidePanel() {
    const sidePanel = document.getElementById('sidePanel');
    const toggleIcon = document.getElementById('toggleBtn');
    if (sidePanel.style.display === 'none' || sidePanel.style.display === '') {
        sidePanel.style.display = 'block';
        toggleIcon.classList.remove('fas fa-bars fa-2x'); // remove bars icon
        toggleIcon.classList.add('fas fa-times fa-2x');    // add times (X) icon
    } else {
        sidePanel.style.display = 'none';
        toggleIcon.classList.remove('fas fa-times fa-2x'); // remove times icon
        toggleIcon.classList.add('fas fa-bars fa-2x');    // add bars icon
    }
}

document.getElementById('openSidePanel').addEventListener('click', toggleSidePanel);
document.getElementById('toggleBtn').addEventListener('click', toggleSidePanel);


// Convert 24-hour format to 12-hour format with EDT
function convertTo12Hour(time) {
    let [hours, minutes] = time.split(':');
    let AMorPM = +hours < 12 ? 'AM' : 'PM';
    if (+hours > 12) hours -= 12;
    return `${hours}:${minutes} ${AMorPM} EDT`;
}
let currentData = null;
let currentDayIndex;

// Utility function to format a single digit number with a leading zero
function formatWithLeadingZero(number) {
    return number < 10 ? '0' + number : number;
}
const currentDateObj = new Date();
const currentYear = currentDateObj.getFullYear();
const currentMonth = currentDateObj.getMonth() + 1; 
const currentDate = currentDateObj.getDate();

// Navigate between days
// ... (Your existing JavaScript before this point) ...

// Modified navigateDay function to include fade animations
function navigateDay(direction, data) {
    const prayerTimesSection = document.getElementById('prayer-times-section');
    prayerTimesSection.classList.add('fadeOut');

    setTimeout(() => {
        currentDayIndex += direction;

        // Hide or show buttons based on current index
        document.getElementById('prev-day').style.display = currentDayIndex === 0 ? 'none' : 'inline-block';
        document.getElementById('next-day').style.display = currentDayIndex === 29 ? 'none' : 'inline-block';  // Assuming a maximum of 30 days

        displayPrayerTimesForDay(currentDayIndex, data);
        prayerTimesSection.classList.remove('fadeOut');
        prayerTimesSection.classList.add('fadeIn');

        setTimeout(() => {
            prayerTimesSection.classList.remove('fadeIn');
        }, 500);
    }, 500);
}

// ... (Rest of your JavaScript) ...

const desiredPrayerTimes = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

// Display prayer times for a given day
function displayPrayerTimesForDay(index, data) {
    let day = data.data[index];
    let timingsHtml = `<h4>${day.date.readable}</h4><table>`;
    for (const prayer of desiredPrayerTimes) {
        let time = day.timings[prayer];
        let formattedTime = convertTo12Hour(time.split(' ')[0]); // Remove any extra info after the time (like "(EDT)")
        timingsHtml += `<tr><td>${prayer}:</td><td>${formattedTime}</td></tr>`;
    }
    timingsHtml += "</table>";
    document.getElementById('prayer-times-section').innerHTML = timingsHtml;
}
const apiURL = `http://api.aladhan.com/v1/calendarByAddress/${currentYear}/${currentMonth}?address=6400 Dublin Park Drive, Dublin OH&method=2`;

// Fetching prayer times from the API and displaying them
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        currentData = data;

        // Find the index corresponding to today's date in EDT
        const todayFormatted = `${formatWithLeadingZero(currentDate)} ${currentDateObj.toLocaleString('default', { month: 'short' })} ${currentYear}`;
        currentDayIndex = currentData.data.findIndex(day => day.date.readable === todayFormatted);

        displayPrayerTimesForDay(currentDayIndex, currentData);
    });
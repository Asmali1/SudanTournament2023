
// --- Utility Functions ---

// Utility function to format a single digit number with a leading zero
function formatWithLeadingZero(number) {
    return number < 10 ? '0' + number : number;
}

// Convert 24-hour format to 12-hour format with EDT
// Convert 24-hour format to 12-hour format with EST
function convertTo12Hour(time) {
    let [hours, minutes] = time.split(':');
    let AMorPM = +hours < 12 ? 'AM' : 'PM';
    if (+hours > 12) hours -= 12;
    return `${hours}:${minutes} ${AMorPM} EST`;  // Change EDT to EST
}

function shortMonthToFull(monthShort) {
    const months = {
        "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April",
        "May": "May", "Jun": "June", "Jul": "July", "Aug": "August",
        "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"
    };
    return months[monthShort] || monthShort;  // If not found, return the original short form
}

// --- UI Functions ---

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

function navigateDay(direction, data) {
    if (countdownInterval) {
        clearInterval(countdownInterval);  // Clear the countdown whenever navigating days.
    }
    const prayerTimesSection = document.getElementById('prayer-times-section');
    prayerTimesSection.classList.add('fadeOut');

    setTimeout(() => {
        currentDayIndex += direction;
        document.getElementById('prev-day').style.display = currentDayIndex === 0 ? 'none' : 'inline-block';
        document.getElementById('next-day').style.display = currentDayIndex === 29 ? 'none' : 'inline-block';  // Assuming a max of 30 days
        displayPrayerTimesForDay(currentDayIndex, data);
        prayerTimesSection.classList.remove('fadeOut').classList.add('fadeIn');
        setTimeout(() => {
            prayerTimesSection.classList.remove('fadeIn');
        }, 500);
    }, 500);
}

function displayPrayerTimesForDay(index, data) {
    const day = data.data[index];
    const dateParts = day.date.readable.split(" ");
    const formattedDate = `${shortMonthToFull(dateParts[1])} ${dateParts[0]}, ${dateParts[2]}`;
    const now = new Date();
    let nextPrayerTime = null;
    let nextPrayerName = "";
    
    for (const prayer of desiredPrayerTimes) {
        const time = day.timings[prayer].split(' ')[0]; // Get the time without conversion
        const [prayerHour, prayerMinute] = time.split(":").map(num => parseInt(num, 10));
        const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), prayerHour, prayerMinute);

        if (!nextPrayerTime && now < prayerDate) {
            nextPrayerTime = prayerDate;
            nextPrayerName = prayer;
        }
    }

    // If no prayer time found for the current day, consider Fajr of the next day
    if (!nextPrayerTime && index + 1 < data.data.length) {
        const tomorrow = data.data[index + 1];
        const time = convertTo12Hour(tomorrow.timings["Fajr"].split(' ')[0]).split(" ")[0];
        const prayerHour = parseInt(time.split(":")[0]);
        const prayerMinute = parseInt(time.split(":")[1]);
        nextPrayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, prayerHour, prayerMinute);
        nextPrayerName = "Fajr";
    }

    if (nextPrayerTime) {
        if (countdownInterval) {
            clearInterval(countdownInterval);  // Clear the existing countdown if any.
        }

        countdownInterval = setInterval(() => {
            const now = new Date();
            let diff = nextPrayerTime - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            diff %= (1000 * 60 * 60);
            const minutes = Math.floor(diff / (1000 * 60));
            diff %= (1000 * 60);
            const seconds = Math.floor(diff / 1000);
            // const translatedNext = translations[currentLanguage]["Next"] || "Next";
            // const translatedPrayerName = translations[currentLanguage][nextPrayerName] || nextPrayerName;
            // document.getElementById("prayer-countdown").innerText = `${translatedNext} ${translatedPrayerName}: ${formatWithLeadingZero(hours)}:${formatWithLeadingZero(minutes)}:${formatWithLeadingZero(seconds)}`;
            document.getElementById("prayer-countdown").innerText = `${nextPrayerName} in: ${formatWithLeadingZero(hours)}:${formatWithLeadingZero(minutes)}:${formatWithLeadingZero(seconds)}`;

                        
            if (diff <= 0) {
                // The prayer time has passed, so refresh the display.
                displayPrayerTimesForDay(currentDayIndex, currentData);
            }
        }, 1000);
    }

    let timingsHtml = `<h4>${formattedDate}</h4><table>`;
    for (const prayer of desiredPrayerTimes) {
        const time = day.timings[prayer];
        const formattedTime = convertTo12Hour(time.split(' ')[0]);
        timingsHtml += `<tr><td>${prayer}:</td><td>${formattedTime}</td></tr>`;
    }
    timingsHtml += "</table>";


    document.getElementById('prayer-times-section').innerHTML = timingsHtml;
}


// --- Initialization ---

document.getElementById('openSidePanel').addEventListener('click', toggleSidePanel);
document.getElementById('toggleBtn').addEventListener('click', toggleSidePanel);

const currentDateObj = new Date();
const currentYear = currentDateObj.getFullYear();
const currentMonth = currentDateObj.getMonth() + 1;
const currentDate = currentDateObj.getDate();
let currentData = null;
let currentDayIndex;
let countdownInterval; // Global declaration
let nextPrayerTime = null;
let nextPrayerName = "";

const desiredPrayerTimes = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

const apiURL = `http://api.aladhan.com/v1/calendarByAddress/${currentYear}/${currentMonth}?address=6400 Dublin Park Drive, Dublin OH&method=2`;
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        currentData = data;
        const todayFormatted = `${formatWithLeadingZero(currentDate)} ${currentDateObj.toLocaleString('default', { month: 'short' })} ${currentYear}`;
        currentDayIndex = currentData.data.findIndex(day => day.date.readable === todayFormatted);
        displayPrayerTimesForDay(currentDayIndex, currentData);
    });

if (!countdownInterval) {
    countdownInterval = setInterval(() => {
        const now = new Date();
        if (nextPrayerTime) {
            let diff = nextPrayerTime - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            diff %= (1000 * 60 * 60);
            const minutes = Math.floor(diff / (1000 * 60));
            diff %= (1000 * 60);
            const seconds = Math.floor(diff / 1000);
            document.getElementById("prayer-countdown").innerText = `Next ${nextPrayerName}: ${formatWithLeadingZero(hours)}:${formatWithLeadingZero(minutes)}:${formatWithLeadingZero(seconds)}`;
        }
    }, 1000);
}

document.getElementById("footerYear").textContent = new Date().getFullYear();

let currentLanguage = "en";  // initial state

const translations = {
    "en": {
        "Fajr": "الفجر",
        "Sunrise": "الشروق",
        "Dhuhr": "الظهر",
        "Asr": "العصر",
        "Maghrib": "المغرب",
        "Isha": "العشاء",
        "STSS ANNUAL TOURNAMENT": "بطولة ستس السنوية",
        "Welcome to the Ohio Sudanese American Soccer Federation Webpage.": "مرحبًا بك في صفحة الاتحاد السوداني الأمريكي لكرة القدم في أوهايو.",
        "Visit us to know more": "زورونا لمعرفة المزيد",
        "Prayer Times": "أوقات الصلاة",
        "Previous": "السابق",
        "Next": "التالي",
        "MAP": "الخريطة",
        "FIELDS": "الملاعب",
        "SCHEDULE": "الجدول",
        "GALLERY": "الصور",
        "ABOUT US": "عنا"
    },
    "ar": {
        "الفجر": "Fajr",
        "الشروق": "Sunrise",
        "الظهر": "Dhuhr",
        "العصر": "Asr",
        "المغرب": "Maghrib",
        "العشاء": "Isha",
        "بطولة ستس السنوية": "STSS ANNUAL TOURNAMENT",
        "مرحبًا بك في صفحة الاتحاد السوداني الأمريكي لكرة القدم في أوهايو.": "Welcome to the Ohio Sudanese American Soccer Federation Webpage.",
        "زورونا لمعرفة المزيد": "Visit us to know more",
        "أوقات الصلاة": "Prayer Times",
        "السابق": "Previous",
        "التالي": "Next",
        "الخريطة": "MAP",
        "الملاعب": "FIELDS",
        "الجدول": "SCHEDULE",
        "الصور": "GALLERY",
        "عنا": "ABOUT US"
    }
};

function translateContent() {
    const langMap = translations[currentLanguage];

    // Translate nav links
    const navLinks = document.querySelectorAll('.nav-links ul li a');
    navLinks.forEach(link => {
        link.textContent = langMap[link.textContent] || link.textContent;
    });

    // Translate header content
    document.querySelector('.text-box h1').textContent = langMap[document.querySelector('.text-box h1').textContent] || document.querySelector('.text-box h1').textContent;
    document.querySelector('.text-box p').textContent = langMap[document.querySelector('.text-box p').textContent] || document.querySelector('.text-box p').textContent;
    document.querySelector('.hero-btn').textContent = langMap[document.querySelector('.hero-btn').textContent] || document.querySelector('.hero-btn').textContent;

    // Translate Prayer Times heading
    const prayerTimesTitle = document.querySelector('.prayer-times-content h1 span');
    prayerTimesTitle.textContent = langMap[prayerTimesTitle.textContent] || prayerTimesTitle.textContent;

    // Translate the prayer times table content
    const prayerTimesTable = document.querySelector('#prayer-times-section table');
    if (prayerTimesTable) {
        const rows = prayerTimesTable.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells && cells.length > 0) {
                cells[0].textContent = langMap[cells[0].textContent.replace(':', '')] + ":";
            }
        });
    }

document.getElementById('translateBtn').addEventListener('click', translateContent);

    // Translate navigation buttons
    const navButtons = document.querySelectorAll('.navigation-buttons button');
    navButtons.forEach(button => {
        button.textContent = langMap[button.textContent] || button.textContent;
    });

    // Toggle language for next call
    currentLanguage = currentLanguage === "en" ? "ar" : "en";
}


document.getElementById('translateBtn').addEventListener('click', translateContent);


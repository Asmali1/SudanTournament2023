const apiUrl = 'http://api.aladhan.com/v1/calendarByAddress/2023/9?address=6400%20Dublin%20Park%20Drive,%20Dublin%20OH&method=2';

let currentIndex = 0;

const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const suffix = hours >= 12 ? 'PM (EDT)' : 'AM (EDT)';
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }
    return `${hours}:${minutes} ${suffix}`;
};

const currentDate = new Date();
const currentDay = currentDate.getDate();
currentIndex = currentDay - 1;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.code === 200 && data.status === "OK" && data.data && data.data.length > 0) {
            const tablesContainer = document.getElementById("tablesContainer");
            data.data.forEach(day => {
                const table = `
                    <table>
                        <thead>
                            <tr>
                                <th colspan="9">${day.date.readable}</th>
                            </tr>
                            <tr>
                                <th>Fajr</th>
                                <th>Sunrise</th>
                                <th>Dhuhr</th>
                                <th>Asr</th>
                                <th>Sunset</th>
                                <th>Maghrib</th>
                                <th>Isha</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${convertTo12HourFormat(day.timings.Fajr.split(" ")[0])}</td>
                                <td>${convertTo12HourFormat(day.timings.Sunrise.split(" ")[0])}</td>
                                <td>${convertTo12HourFormat(day.timings.Dhuhr.split(" ")[0])}</td>
                                <td>${convertTo12HourFormat(day.timings.Asr.split(" ")[0])}</td>
                                <td>${convertTo12HourFormat(day.timings.Sunset.split(" ")[0])}</td>
                                <td>${convertTo12HourFormat(day.timings.Maghrib.split(" ")[0])}</td>
                                <td>${convertTo12HourFormat(day.timings.Isha.split(" ")[0])}</td>
                            </tr>
                        </tbody>
                    </table>
                `;
                tablesContainer.innerHTML += table;
            });

            tablesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

            document.getElementById("prevButton").addEventListener("click", () => {
                currentIndex = Math.max(currentIndex - 1, 0);
                tablesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            });

            document.getElementById("nextButton").addEventListener("click", () => {
                currentIndex = Math.min(currentIndex + 1, data.data.length - 1);
                tablesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            });
        } else {
            console.error("Failed to fetch prayer times");
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

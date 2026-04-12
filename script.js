let btn = document.getElementById("btn");
let result = document.getElementById("result");
let historyDiv = document.getElementById("history");

let apiKey = "f729887986e9c7a8aa25ac64972b4b5e"; // 

loadHistory();

btn.addEventListener("click", getWeather);

document.getElementById("city").addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeather();
});

async function getWeather() {
    let city = document.getElementById("city").value;

    if (city === "") {
        result.innerHTML = "⚠️ Enter city name";
        return;
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        result.innerHTML = " Loading...";

        let response = await fetch(url);
        let data = await response.json();
        console.log(data)

        if (data.cod != 200) {
            result.innerHTML = "❌ City not found";
            return;
        }

        saveHistory(city);

        let icon = getWeatherIcon(data.weather[0].main);

        result.innerHTML = `
            <h3><i class="fa-solid fa-location-dot"></i> ${data.name}</h3>

            <div style="font-size:50px;">${icon}</div>

            <h1>${data.main.temp}°C</h1>
            <p>${data.weather[0].description}</p>

            <div class="details">
                <div>
                    <i class="fa-solid fa-droplet"></i>
                    <p>${data.main.humidity}%</p>
                </div>

                <div>
                    <i class="fa-solid fa-wind"></i>
                    <p>${data.wind.speed} m/s</p>
                </div>

                <div>
                    <i class="fa-solid fa-temperature-half"></i>
                    <p>${data.main.feels_like}°C</p>
                </div>
            </div>
        `;

    } catch (error) {
        result.innerHTML = " Error fetching data";
    }
}

// 🔥 Dynamic Weather Icons
function getWeatherIcon(condition) {
    switch (condition) {
        case "Clear": return "☀️";
        case "Clouds": return "☁️";
        case "Rain": return "🌧️";
        case "Drizzle": return "🌦️";
        case "Thunderstorm": return "⛈️";
        case "Snow": return "❄️";
        default: return "🌍";
    }
}

// Save history
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("history", JSON.stringify(history));
    }

    loadHistory();
}

// Load history
function loadHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    historyDiv.innerHTML = "<b>Recent:</b><br>";

    history.forEach(city => {
        historyDiv.innerHTML += `<span onclick="quickSearch('${city}')">${city}</span>`;
    });
}

// Quick search
function quickSearch(city) {
    document.getElementById("city").value = city;
    getWeather();
}
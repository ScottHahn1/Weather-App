import {search, weatherDetails, hourlyWeatherDetails, iconDiv, feelsLike, humidity, windSpeed, dateTime} from './domElements.js'
const hourArr = []
const dateTimeArr = []

async function getCurrentData() {
    let location = search.value
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=20a668db8e8042ee8d84be64a18dcb23&units=metric`)
    const data = await response.json()
    return `${data.name} \n \n ${data.weather[0].description} \n \n ${Math.round(data.main.temp)} \xB0C \n ${data.weather[0].icon}`
}

async function getCurrentExtraData() {
    let location = search.value
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=20a668db8e8042ee8d84be64a18dcb23&units=metric`)
    const data = await response.json()
    return `${Math.round(data.main.feels_like)} \xB0C ${data.main.humidity}% ${Math.round(data.wind.speed * 3.6)} km/h`; 
}

async function getDefaultData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Cape Town&APPID=20a668db8e8042ee8d84be64a18dcb23&units=metric`)
    const data = await response.json()
    return `${data.name} \n \n ${data.weather[0].description} \n \n ${Math.round(data.main.temp)} \xB0C \n ${data.weather[0].icon}`
}

async function getExtraDefaultData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Cape Town&APPID=20a668db8e8042ee8d84be64a18dcb23&units=metric`)
    const data = await response.json()
    return `${Math.round(data.main.feels_like)} \xB0C ${data.main.humidity}% ${Math.round(data.wind.speed * 3.6)} km/h`
}

async function getHourlyData() {
    let location = search.value
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=20a668db8e8042ee8d84be64a18dcb23&units=metric`)
    const data = await response.json()
    const latitude = data.coord.lat
    const longitude = data.coord.lon
    addHourlyTemperature(latitude, longitude)
}

async function getDefaultHourlyData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Cape Town&APPID=20a668db8e8042ee8d84be64a18dcb23&units=metric`)
    const data = await response.json()
    const latitude = data.coord.lat
    const longitude = data.coord.lon
    addHourlyTemperature(latitude, longitude)
}

getDefaultHourlyData()

function setDateTime() {
    const string = dateTimeArr.toString().split(' ').slice(0, 5).join(' ')
    dateTimeArr.pop()
    dateTime.innerText = string
}

async function addHourlyTemperature(latitude, longitude) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=20a668db8e8042ee8d84be64a18dcb23&units=metric`)
    const data = await response.json()
    setHours(data.timezone_offset)
    setDateTime()

    for (let i = 0; i < 8; i++) {
        hourArr[i].innerHTML += `${Math.round(data.hourly[i].temp)} \xB0C`
        addIconsHourlyDay(data.hourly[i].weather[0].icon, i)
        addIconsHourlyNight(data.hourly[i].weather[0].icon, i)
    }
}

function addCurrentData() {
    async function retriveAll() {
        let results = await Promise.all(([getCurrentData(), getCurrentExtraData()]))
        const dataSplit = results[0].split(' ');
        dataSplit.pop()
        const dataString = dataSplit.join(' ')
        weatherDetails.innerText = dataString
        
        const dataSliced = results[0].split(' ').slice(-1)
        addIconsDay(dataSliced)
        addIconsNight(dataSliced)        

        const extraDataSplit = results[1].split(' ')
        feelsLike.innerText = `${extraDataSplit[0]}  ${extraDataSplit[1]}`
        humidity.innerText = extraDataSplit[2]
        windSpeed.innerText = `${extraDataSplit[3]}  ${extraDataSplit[4]}`
    }
    retriveAll()
}

function addDefaultData() {
    async function retriveAllDefault() {
        let results = await Promise.all([getDefaultData(), getExtraDefaultData()])
        const dataSplit = results[0].split(' ')
        dataSplit.pop()
        const dataString = dataSplit.join(' ')
        weatherDetails.innerText = dataString

        const dataSliced = results[0].split(' ').slice(-1)
        addIconsDay(dataSliced)
        addIconsNight(dataSliced)

        const extraDataSplit = results[1].split(' ')
        feelsLike.innerText = `${extraDataSplit[0]}  ${extraDataSplit[1]}`
        humidity.innerText = extraDataSplit[2]
        windSpeed.innerText = `${extraDataSplit[3]}  ${extraDataSplit[4]}`
    }
    retriveAllDefault()
}

addDefaultData()

function setHours(timezoneOffset) {
    const date = new Date()
    const localTime = date.getTime()
    const localOffset = date.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const time = utc + (1000 * timezoneOffset)
    const newDate = new Date(time)
    dateTimeArr.push(newDate)
    let hours = newDate.getHours()

    for (let i = 0; i < 8; i++) {
        hourArr[i].innerText = `${hours++}:00 \n`
        if (hours === 24) {
            hours = 0
        }
    }
}

function hourlyDivs() {
    for (let i = 0; i < 8; i++) {
        const divs = document.createElement('div')
        divs.classList.add(`hour-div-${i}`)
        hourlyWeatherDetails.append(divs)
        hourArr.push(divs)
    }
}

hourlyDivs()

search.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        addCurrentData()
        getHourlyData()
        search.value = ''
        iconDiv.innerHTML = ''
    }
})

function addIconsDay(icon) {
    let img = new Image()
   
    switch (icon[0]) {
        case '01d':
            img.src = 'http://openweathermap.org/img/wn/01d@2x.png'
            iconDiv.append(img)
            break

        case '02d':
            img.src = 'http://openweathermap.org/img/wn/02d@2x.png'
            iconDiv.append(img)
            break

        case '03d':
            img.src = 'http://openweathermap.org/img/wn/03d@2x.png'
            iconDiv.append(img)
            break

        case '04d':
            img.src = 'http://openweathermap.org/img/wn/04d@2x.png'
            iconDiv.append(img)
            break

        case '09d':
            img.src = 'http://openweathermap.org/img/wn/09d@2x.png'
            iconDiv.append(img)
            break

        case '10d':
            img.src = 'http://openweathermap.org/img/wn/10d@2x.png'
            iconDiv.append(img)
            break

        case '11d':
            img.src = 'http://openweathermap.org/img/wn/11d@2x.png'
            iconDiv.append(img)
            break

        case '13d':
            img.src = 'http://openweathermap.org/img/wn/13d@2x.png'
            iconDiv.append(img)
            break

        case '50d':
            img.src = 'http://openweathermap.org/img/wn/50d@2x.png'
            iconDiv.append(img)
            break
    }
}

function addIconsNight(icon) {
    let img = new Image()
   
    switch (icon[0]) {
        case '01n':
            img.src = 'http://openweathermap.org/img/wn/01n@2x.png'
            iconDiv.append(img)
            break

        case '02n':
            img.src = 'http://openweathermap.org/img/wn/02n@2x.png'
            iconDiv.append(img)
            break

        case '03':
            img.src = 'http://openweathermap.org/img/wn/03n@2x.png'
            iconDiv.append(img)
            break

        case '04n':
            img.src = 'http://openweathermap.org/img/wn/04n@2x.png'
            iconDiv.append(img)
            break

        case '09n':
            img.src = 'http://openweathermap.org/img/wn/09n@2x.png'
            iconDiv.append(img)
            break

        case '10n':
            img.src = 'http://openweathermap.org/img/wn/10n@2x.png'
            iconDiv.append(img)
            break

        case '11n':
            img.src = 'http://openweathermap.org/img/wn/11n@2x.png'
            iconDiv.append(img)
            break

        case '13n':
            img.src = 'http://openweathermap.org/img/wn/13n@2x.png'
            iconDiv.append(img)
            break

        case '50n':
            img.src = 'http://openweathermap.org/img/wn/50n@2x.png'
            iconDiv.append(img)
            break
    }
}

function addIconsHourlyDay(icon, i) {
    let img = new Image()

    switch (icon) {
        case '01d':
            img.src = 'http://openweathermap.org/img/wn/01d@2x.png'
            hourArr[i].append(img)
            break

        case '02d':
            img.src = 'http://openweathermap.org/img/wn/02d@2x.png'
            hourArr[i].append(img)
            break

        case '03d':
            img.src = 'http://openweathermap.org/img/wn/03d@2x.png'
            hourArr[i].append(img)
            break

        case '04d':
            img.src = 'http://openweathermap.org/img/wn/04d@2x.png'
            hourArr[i].append(img)
            break

        case '09d':
            img.src = 'http://openweathermap.org/img/wn/09d@2x.png'
            hourArr[i].append(img)
            break

        case '10d':
            img.src = 'http://openweathermap.org/img/wn/10d@2x.png'
            hourArr[i].append(img)
            break

        case '11d':
            img.src = 'http://openweathermap.org/img/wn/11d@2x.png'
            hourArr[i].append(img)
            break

        case '13d':
            img.src = 'http://openweathermap.org/img/wn/13d@2x.png'
            hourArr[i].append(img)
            break

        case '50d':
            img.src = 'http://openweathermap.org/img/wn/50d@2x.png'
            hourArr[i].append(img)
            break
    }
}

function addIconsHourlyNight(icon, i) {
    let img = new Image()

    switch (icon) {
        case '01n':
            img.src = 'http://openweathermap.org/img/wn/01n@2x.png'
            hourArr[i].append(img)
            break

        case '02n':
            img.src = 'http://openweathermap.org/img/wn/02n@2x.png'
            hourArr[i].append(img)
            break

        case '03n':
            img.src = 'http://openweathermap.org/img/wn/03n@2x.png'
            hourArr[i].append(img)
            break

        case '04n':
            img.src = 'http://openweathermap.org/img/wn/04n@2x.png'
            hourArr[i].append(img)
            break

        case '09n':
            img.src = 'http://openweathermap.org/img/wn/09n@2x.png'
            hourArr[i].append(img)
            break

        case '10n':
            img.src = 'http://openweathermap.org/img/wn/10n@2x.png'
            hourArr[i].append(img)
            break

        case '11n':
            img.src = 'http://openweathermap.org/img/wn/11n@2x.png'
            hourArr[i].append(img)
            break

        case '13n':
            img.src = 'http://openweathermap.org/img/wn/13n@2x.png'
            hourArr[i].append(img)
            break

        case '50n':
            img.src = 'http://openweathermap.org/img/wn/50n@2x.png'
            hourArr[i].append(img)
            break
    }
}
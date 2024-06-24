let activeAlarm = null;
let alarmRingtone = document.getElementById('alarm-ringtone');
let isRinging = false;
let snoozeTimeout = null;
let snoozeAndOffDiv = null;

// To Display the current time and update time
function updateTime() {
    const displayTime = document.getElementById('display-time');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formatHrs = hours % 12 || 12;
    const formatMins = minutes < 10 ? '0' + minutes : minutes;
    const formatSecs = seconds < 10 ? '0' + seconds : seconds;
    displayTime.innerText = `${formatHrs}:${formatMins}:${formatSecs} ${ampm}`;
}

setInterval(updateTime, 1000);

const alarms = [];

// To set the alarm in column grids Inputs
document.getElementById('set-alarm').addEventListener('click', () => {
    const hr = document.getElementById('alarm-hr').value;
    const min = document.getElementById('alarm-min').value;
    const sec = document.getElementById('alarm-sec').value;
    const ampm = document.getElementById('alarm-ampm').value;
    if (validateTime(hr, min, sec)) {
        const alarmTime = `${hr.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')} ${ampm}`;
        alarms.push(alarmTime);
        displayAlarms();
    } else {
        alert('Please enter a valid time to set the alarm.');
    }
});

// Validate time such that hours is not more than 12 and minutes and seconds not more 59
function validateTime(hr, min, sec) {
    const hour = parseInt(hr, 10);
    const minute = parseInt(min, 10);
    const second = parseInt(sec, 10);
    if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
        return false;
    }
    if (hour < 1 || hour > 12) {
        return false;
    }
    if (minute < 0 || minute >= 60) {
        return false;
    }
    if (second < 0 || second >= 60) {
        return false;
    }
    return true;
}

// Display list of Alarms set
function displayAlarms() {
    const alarmList = document.getElementById('alarms');
    alarmList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const alarmElement = document.createElement('li');
        alarmElement.classList.add('list-group-item');
        alarmElement.innerHTML = `
            ${alarm}
            <button class="btn btn-danger btn-sm" onclick="deleteAlarm(${index})">Delete</button>
        `;
        alarmList.appendChild(alarmElement);
    });
}

// Delete alarm on click of delete button
function deleteAlarm(index) {
    alarms.splice(index, 1);
    displayAlarms();
}

// Check and ring the alarm if set time is equal to current time
function checkAlarms() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formatHrs = (hours % 12 || 12).toString().padStart(2, '0');
    const formatMins = minutes.toString().padStart(2, '0');
    const formatSecs = seconds.toString().padStart(2, '0');
    const currentTime = `${formatHrs}:${formatMins}:${formatSecs} ${ampm}`;
    if (alarms.includes(currentTime) && !activeAlarm) {
        activeAlarm = currentTime;
        startAlarm();
        alert('Alarm ringing!');
        showSnoozeAndOffOptions();
    }
}

// Start ringing the alarm
function startAlarm() {
    if (!isRinging) {
        isRinging = true;
        alarmRingtone.loop = true;
        alarmRingtone.play();
    }
}

// Stop ringing the alarm
function stopAlarm() {
    if (isRinging) {
        isRinging = false;
        alarmRingtone.pause();
        alarmRingtone.currentTime = 0;
        alarmRingtone.loop = false;
    }
}

// For showing buttons of snooze and off
function showSnoozeAndOffOptions() {
    const div = document.createElement('div');
    div.innerHTML = `<button class="btn btn-primary" onclick="snoozeAlarm()">Snooze</button>
        <button class="btn btn-danger" onclick="offAlarm()">Off</button>`;
    document.body.appendChild(div);
    snoozeAndOffDiv = div;
}

// For removing buttons of snooze and off
function removeSnoozeAndOffOptions() {
    if (snoozeAndOffDiv) {
        document.body.removeChild(snoozeAndOffDiv);
        snoozeAndOffDiv = null; 
    }
}

// Snooze the Alarm
function snoozeAlarm() {
    if (activeAlarm) {
        const snoozeDuration = 3 * 60 * 1000; // Snooze for 3 minutes
        snoozeTimeout = setTimeout(() => {
            activeAlarm = null;
            startAlarm();
            alert('Alarm ringing!');
            showSnoozeAndOffOptions();
        }, snoozeDuration);
        stopAlarm();
        removeSnoozeAndOffOptions();
    }
}

// Off the Alarm
function offAlarm() {
    activeAlarm = null;
    stopAlarm();
    removeSnoozeAndOffOptions();
}

setInterval(checkAlarms, 1000);
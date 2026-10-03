import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/styles.css';

const elements = {
  dateInput: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let countdownId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate) {
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      userSelectedDate = null;
      elements.startButton.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }

    userSelectedDate = selectedDate;
    elements.startButton.disabled = false;
  },
};

flatpickr(elements.dateInput, options);

elements.startButton.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  elements.startButton.disabled = true;
  elements.dateInput.disabled = true;
  countdownId = setInterval(updateTimer, 1000);
  updateTimer();
});

function updateTimer() {
  const remainingTime = Math.max(userSelectedDate.getTime() - Date.now(), 0);
  const { days, hours, minutes, seconds } = convertMs(remainingTime);

  elements.days.textContent = addLeadingZero(days);
  elements.hours.textContent = addLeadingZero(hours);
  elements.minutes.textContent = addLeadingZero(minutes);
  elements.seconds.textContent = addLeadingZero(seconds);

  if (remainingTime === 0) {
    clearInterval(countdownId);
    countdownId = null;
    userSelectedDate = null;
    elements.dateInput.disabled = false;
    elements.startButton.disabled = true;
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

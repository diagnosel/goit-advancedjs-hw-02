import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/styles.css';

const form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
        return;
      }

      reject(delay);
    }, delay);
  });

  promise
    .then((value) => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${value}ms`,
        position: 'topRight',
      });
    })
    .catch((value) => {
      iziToast.error({
        message: `❌ Rejected promise in ${value}ms`,
        position: 'topRight',
      });
    });

  event.currentTarget.reset();
});

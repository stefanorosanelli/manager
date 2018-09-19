/**
 * Datepicker vue directive
 *
 */

import flatpickr from 'flatpickr/dist/flatpickr.min';
import 'flatpickr/dist/flatpickr.min.css';

const dateTimePickerOptions = {
    enableTime: true,
    altInput: true,
    dateFormat: 'Z',
    altFormat: 'F j, Y - H:i',
    animate: false,
    time_24hr: true,
};

const datepickerOptions = {
    enableTime: false,
    dateFormat: 'Z',
    altInput: true,
    altFormat: 'F j, Y',
    animate: false,
    time_24hr: true,
};

export default {
    install(Vue) {
        Vue.directive('datepicker', {
            /**
             * create flatpicker instance when element is inserted
             *
             * @param {Object} element DOM object
             */
            inserted (element, dir, vueEl) {
                let options = datepickerOptions;

                if (vueEl.data && vueEl.data.attrs && vueEl.data.attrs.time === 'true') {
                    options = dateTimePickerOptions;
                }

                try {
                    let datePicker = flatpickr(element, options);

                    let clearButton = document.createElement('span');
                    clearButton.classList.add('clear-button');
                    clearButton.innerHTML = '&times;';
                    clearButton.addEventListener('click', () => {
                        datePicker.clear();
                    });

                    element.parentElement.appendChild(clearButton);
                } catch (err) {
                    console.error(err);
                }
            },
        })
    }
}

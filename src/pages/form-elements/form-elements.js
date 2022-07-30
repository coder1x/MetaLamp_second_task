import TextField from '@com/text-field/TextField';
import DateDropDown from '@com/date-dropdown/DateDropDown.js';
import DropDown from '@com/dropdown/DropDown.js';

(() => {
  const className = '.js-form-elements';
  const formElements = document.querySelector(className);

  if (!formElements) {
    return;
  }

  const textFieldEmail = formElements.querySelector(`${className}__text-field-email`);
  const textFieldMasked = formElements.querySelector(`${className}__text-field-date`);
  const guest = formElements.querySelector(`${className}__guest`);
  const dateDropdown = formElements.querySelector(`${className}__date-dropdown`);
  const filterDate = formElements.querySelector(`${className}__filter-date`);
  const rooms = formElements.querySelector(`${className}__rooms`);

  new DropDown(
    guest.firstElementChild,
  );

  new DropDown(
    rooms.firstElementChild,
  );

  new DateDropDown(
    dateDropdown.firstElementChild,
  );

  new DateDropDown(
    filterDate.firstElementChild,
  );

  new TextField({
    element: textFieldEmail,
    type: 'email',
  });

  new TextField({
    element: textFieldMasked,
    type: 'date',
  });
})();

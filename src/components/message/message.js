import './message.scss';

function handleClose(event) {
  event.target.parentElement.remove();
}

function handleKeydownClose(event) {
  const { key } = event;
  if (key === 'Escape') {
    event.preventDefault();
    event.target.parentElement.remove();
  }
}

function message(text) {
  const selector = 'message-toxin';

  const popunder = document.querySelector(`.${selector}`);

  if (popunder) return false;

  const wrap = document.createElement('article');
  wrap.classList.add(selector);
  const close = document.createElement('button');
  close.innerText = '✖';
  close.classList.add(`${selector}__close`);
  const paragraph = document.createElement('p');
  paragraph.innerText = text;
  paragraph.classList.add(`${selector}__text`);

  wrap.appendChild(close);
  wrap.appendChild(paragraph);

  const body = document.querySelector('body');
  body.appendChild(wrap);

  close.focus();

  close.addEventListener('click', handleClose);
  close.addEventListener('keydown', handleKeydownClose);

  return true;
}

export default message;

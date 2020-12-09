'use strict';

const BACKEND_URL = `http://localhost:8081`;

// eslint-disable-next-line no-undef
const deleteCommentButton = document.querySelectorAll(`.comment-card__delete`);
// eslint-disable-next-line no-undef
const deleteAnnouncementButton = document.querySelectorAll(`.ticket-card__del`);

const onDeleteButton = (buttons, element) => {
  for (let delButton of buttons) {
    delButton.addEventListener(`click`, (evt) => {
      const elementId = evt.target.getAttribute(`data-${element}Id`);
      // eslint-disable-next-line no-undef
      fetch(`${BACKEND_URL}/api/${element}s/delete/${elementId}`, {
        mode: `cors`,
        headers: {
          'Access-Controw-Allow-Origin': `*`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isDelete) {
            // eslint-disable-next-line no-undef
            location.reload();
          }
        })
        .catch((err) => console.error(err));
    });
  }
};

onDeleteButton(deleteCommentButton, `comment`);
onDeleteButton(deleteAnnouncementButton, `offer`);

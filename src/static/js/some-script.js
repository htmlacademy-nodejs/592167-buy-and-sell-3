'use strict';

const BACKEND_URL = `http://localhost:8081`;

// eslint-disable-next-line no-undef
const deleteCommentButton = document.querySelectorAll(`.comment-card__delete`);

for (let delButton of deleteCommentButton) {
  delButton.addEventListener(`click`, (evt) => {
    const commentId = evt.target.getAttribute(`data-commentId`);
    // eslint-disable-next-line no-undef
    fetch(`${BACKEND_URL}/api/comments/delete/${commentId}`, {
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

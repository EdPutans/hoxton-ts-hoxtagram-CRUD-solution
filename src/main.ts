// write your code here

const MAIN_URL = "http://localhost:3000/";

const getPicture = () => {
  fetch(MAIN_URL + "images")
    .then((resp) => resp.json())
    .then(renderCards);
};

const renderCards = (cardsArr) => {
  for (const card of cardsArr) {
    renderCard(card);
  }
};

const renderCard = (card) => {
  const mainContainer = document.querySelector(".image-container");

  mainContainer?.children[0].after(createCard(card));
};

//submitting a post

const addPost = (formInput) => {
  const image = formInput.image.value;
  const title = formInput.title.value;

  fetch(MAIN_URL + "images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, image, likes: 0 })
  })
    .then((resp) => resp.json())
    .then(renderCard);
};

//submitting a like

const addLike = (likesSpan, cardId) => {
  const newLikes = Number(likesSpan.innerText) + 1;
  fetch(MAIN_URL + "images/" + cardId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then((resp) => resp.json())
    .then((card) => (likesSpan.innerText = card.likes));
};

//submitting a comment

const addComment = (input, cardId, commentsSection) => {
  const comment = input.value;
  fetch(MAIN_URL + "comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ imageId: cardId, content: comment })
  })
    .then((resp) => resp.json())
    .then((commentObj) =>
      commentsSection.append(createCommentItem(commentObj))
    );
};

//Create card component
const createCard = (card) => {
  const mainSection = createImageSection(card);
  const commentsSection = createCardComments(card);
  const commentForm = createCommentForm(card.id, commentsSection);

  mainSection.append(commentsSection, commentForm);

  return mainSection;
};

const createImageSection = (card) => {
  const mainDiv = document.createElement("div");
  const likesDiv = document.createElement("div");
  const h2 = document.createElement("h2");
  const img = document.createElement("img");
  const likesSpan = document.createElement("span");
  const likesButton = document.createElement("button");

  mainDiv.className = "image-card";

  h2.className = "title";
  h2.innerText = card.title;

  img.className = "image";
  img.src = card.image;

  likesDiv.className = "likes-section";
  likesSpan.className = "likes";
  likesSpan.innerText = card.likes;

  likesButton.className = "like-button";
  likesButton.innerText = "♥";
  likesButton.addEventListener("click", () => addLike(likesSpan, card.id));

  likesDiv.append(likesSpan, likesButton);
  mainDiv.append(h2, img, likesDiv);

  return mainDiv;
};

const createCardComments = (card) => {
  const commentsList = document.createElement("ul");
  commentsList.className = "comments";

  if (!card.comments) {
    return commentsList;
  }

  for (const comment of card.comments) {
    commentsList.append(createCommentItem(comment));
  }

  return commentsList;
};

const createCommentItem = (comment) => {
  const commentItem = document.createElement("li");
  commentItem.innerText = comment.content;

  return commentItem;
};

const createCommentForm = (cardId, commentsSection) => {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const button = document.createElement("button");

  form.className = "comment-form";

  input.className = "comment-input";
  input.setAttribute("name", "comment");
  input.setAttribute("placeholder", "Add a comment...");

  button.className = "comment-button";
  button.setAttribute("type", "submit");
  button.innerText = "Post";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    //@ts-ignore
    addComment(event.target.comment, cardId, commentsSection);
    input.value = "";
  });

  form.append(input, button);

  return form;
};

const run = () => {
  const postForm = document.querySelector(".comment-form.image-card");

  getPicture();

  //@ts-ignore
  postForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    addPost(ev.target);
  });
};

window.addEventListener("DOMContentLoaded", run);

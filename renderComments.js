import { postData, fetchData } from "./api.js";

const addBtn = document.querySelector('.add-form-button');
const commentsEl = document.querySelector('.comments');
let isFirstLoad = true;
const loadingScreen = document.querySelector('.loading-screen');
let load = false;
const loadingComment = document.querySelector('.loading-comment');
const formEl = document.querySelector('.add-form');


export const renderComments = (comments) => {
  const commentHtml = comments.map((comment, index) => {
    return ` <li class="comment" data-commentindex="${index}" data-name="${comment.name}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <textarea class="edit-textarea ${comment.isEdit? "": "hidden"}" data-inputIndex=${index}>${comment.text}</textarea>

          <div class="comment-text ${!comment.isEdit? "": "hidden"}"${comment.text}">${comment.text}</div>
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <button class="edit-button" data-index=${index}>${comment.isEdit ? 'Save': 'Edit'}</button>
            <span class="likes-counter">${comment.likes}</span>
           <button class="like-button ${comment.isLiked ? "active" : ""} ${comment.isLikeLoading ? "loading" : ""}" data-index=${index}></button>
          </div>
        </div>
      </li>`;
}).join("");
commentsEl.innerHTML = commentHtml;

if (isFirstLoad) {
  loadingScreen.style.display = 'none';
  isFirstLoad = false;
}

load = false;
if (!load) {
  loadingComment.style.display = 'none';
  formEl.style.display = "flex";
}


const likeBtn = document.querySelectorAll('.like-button');
likeBtn.forEach(button => {
  button.addEventListener('click', function (e) {
    e.stopPropagation();
    const index = e.currentTarget.dataset.index;
    comments[index].isLikeLoading = true;
    renderComments(comments)
    delay(2000)
    .then(() => {
      comments[index].isLiked = !comments[index].isLiked;
      comments[index].likes += comments[index].isLiked? +1 : -1;
      comments[index].isLikeLoading = false;
      renderComments(comments);
    })
     
  });
})
}

addBtn.addEventListener('click', async (e, comments) => {
  e.preventDefault();
  await postData()
  comments = await fetchData(isFirstLoad);
  renderComments(comments)

});


function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}
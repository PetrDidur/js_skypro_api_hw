const commentsEl = document.querySelector('.comments');
const addBtn = document.querySelector('.add-form-button');
const formEl = document.querySelector('.add-form');
const nameInputEl = document.querySelector('.add-form-name');
const textInputEl = document.querySelector('.add-form-text');
const loadingScreen = document.querySelector('.loading-screen');
const loadingComment = document.querySelector('.loading-comment');

let comments = [];
let isFirstLoad = true;
let load = false;
let clickLoading = true;

const getTime = (date) => {
   const dateObject = new Date(date);

   const formattedDate = dateObject.toLocaleDateString("ru-RU", {
     day: '2-digit',
     month: '2-digit',
     year: '2-digit'
   });
   
   const formattedTime = dateObject.toLocaleTimeString("ru-RU", {
     hour: '2-digit',
     minute: '2-digit'
   });
   
   const formattedDateTime = `${formattedDate} ${formattedTime}`;
   return formattedDateTime;
}

const fetchData = async(loading=false) => {
  if (isFirstLoad) {
    loadingScreen.style.display = 'flex';
  }

   const response = await fetch("https://wedev-api.sky.pro/api/v1/petr_didur/comments", {
    method: "GET"
   })
   const responseData = await response.json();
   return responseData.comments.map(createCommentObject);     
}

const createCommentObject = (el) => ({
  name: el.author.name,
  text: el.text,
  date: getTime(el.date),
  likes: el.likes,
  isLiked: false,
  isLikeLoading: false
})

const postData = async(load=true) => {
if (textInputEl.value === "" || nameInputEl.value === "") {
  return;
}
  if (load) {
    loadingComment.style.display = "block";
    formEl.style.display = "none";
  }

  await fetch('https://wedev-api.sky.pro/api/v1/petr_didur/comments',
    {
      method: "POST",
      body: JSON.stringify({
        text: textInputEl.value,
        name: nameInputEl.value,
        date: new Date(),
        isLiked: false,
        isLikeLoading: false
      })
    },
  )
  textInputEl.value = "",
  nameInputEl.value = ""
}  


const renderComments = (comments) => {
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
        delay(2000).then(() => {
          comments[index].isLiked = !comments[index].isLiked;
          comments[index].likes += comments[index].isLiked? +1 : -1;
          comments[index].isLikeLoading = false;
          renderComments(comments);
        })
          
      });
    })
}

addBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  await postData()
  comments = await fetchData(true);
  renderComments(comments)

});

const init = async () => {
  comments = await fetchData();
  renderComments(comments)
}

// Функция для имитации запросов в API
// Не смотрите особо на внутренности, мы разберемся с этим позже
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}



init();








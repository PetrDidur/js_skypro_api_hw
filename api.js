import  getTime from "./getTime.js";

const nameInputEl = document.querySelector('.add-form-name');
const textInputEl = document.querySelector('.add-form-text');
const loadingComment = document.querySelector('.loading-comment');
const formEl = document.querySelector('.add-form');


export const fetchData = async(isFirstLoad) => {
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

export const postData = async(load=true, retryCount = 1) => {
  if (textInputEl.value === "" || nameInputEl.value === "") {
    return;
  }
  
    if (!navigator.onLine) { // Проверка на наличие интернет-соединения
      alert('Нет соединения с интернетом. Попробуйте позже.');
      return;
    }
    if (load) {
      loadingComment.style.display = "block";
      formEl.style.display = "none";
    }
    try {
      const response = await fetch('https://wedev-api.sky.pro/api/v1/petr_didur/comments',
      {
        method: "POST",
        body: JSON.stringify({
          text: textInputEl.value,
          name: nameInputEl.value,
          date: new Date(),
          isLiked: false,
          isLikeLoading: false,
        })
      },
    )
      if(response.status === 400) {
        throw new Error("Неверный формат данных или имя короче трех символов")
      }
  
      if(response.status === 500) {
        throw new Error("Сломался сервер попробуйте позже")
      }
      textInputEl.value = "",
      nameInputEl.value = ""
  } catch(error) {
  
    if(error.message.includes('сервер')) {
      if(retryCount > 0) {
        alert(`Попытка ${2 - retryCount + 1}: повторная отправка данных...`);
        return postData(load, retryCount - 1);  // Повторная попытка
      } else {
        alert('Сервер недоступен, попробуйте позже')
      }
    }     
    } finally {
      loadingComment.style.display = 'none';
      formEl.style.display = 'flex';
    }
    
  }  
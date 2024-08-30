import { fetchData } from "./api.js";
import { renderComments } from "./renderComments.js";

let comments = [];

const init = async () => {
  comments = await fetchData(false);
  renderComments(comments)
}

init();








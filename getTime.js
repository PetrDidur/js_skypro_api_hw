

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
export default getTime
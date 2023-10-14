const url = 'https://jsonplaceholder.typicode.com/users';


fetch(url).

.then((response) => {
   return response.json();
})
   .then((data) => {
    console.log(data)
   })
.catch ((error) => {
    console.log('hatalı cevap geldi')
})
});
console.log(data);
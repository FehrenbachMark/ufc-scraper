console.log("js initialized");
let date = document.getElementById('date');
date.innerText = new Date().toDateString();

// console log curretn date and time
console.log(new Date().toDateString());

console.log(new Date().toLocaleTimeString());
console.log(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));







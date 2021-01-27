// const getJSON = function(url) {
//     const promise = new Promise(function(resolve, reject) {
//         const handler = function() {
//             if(this.readState !== 4) {
//                 return;
//             }
//             if(this.status === 200) {
//                 resolve(this.response);
//             } else {
//                 reject(new Error(this.statusText));
//             }
//         }
//         const clent = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
//         client.open("GET", url);
//         clent.onreadyStatechange = handler;
//         clent.responseType = "json";
//         client.setRequestHeader("Accept", "application/json");
//         client.send();
//     })
// }

// const p1 = new Promise(function (resolve, reject) {
//     setTimeout(() => reject(new Error('fail')), 3000)
// })

// const p2 = new Promise(function (resolve, reject) {
//     setTimeout(() => resolve(p1), 1000)
// })

// p2.then(result => console.log(result)).catch(error => console.log(error));

// setTimeout(()=>{
//     console.log(5)
// },0)
// new Promise((resolve, reject) => {
//     setTimeout(()=>{
//         console.log(4)
//     },0)
//     resolve(2);
//     console.log(1)
// }).then(r => {
//     console.log(r);
// })
// console.log(3)


// new Promise((resolve, reject) => {
//     reject(1);
// }).then((resolve, reject) => {
//     // console.log('====')
//     reject(console.log('reject'))
// })

// const someAsyncThing = function() {
//     return new Promise(function(resolve, reject) {
//         resolve(x + 2)
//     })
// }

// someAsyncThing().then(function() {
//     console.log('everything is great');
// })

// setTimeout(() => console.log(123), 2000);

// const p1 = new Promise((resolve, reject) => {
//     resolve('hello');
// })
// .then(res => res)
// .catch(e => e)

// const p2 = new Promise((resolve, reject) => {
//     throw new Error('报错了');
// })
// .then(res => res)
// .catch(e => e)

// Promise.all([p1, p2])
// .then(res => console.log(res))
// .catch(e => console.log(e))

// const resolved = Promise.resolve(42)
// const rejected = Promise.reject(-1)

// const allSettledPromise = Promise.allSettled([resolved, rejected]);

// allSettledPromise.then((status) => {
//     console.log(status);
// })

const preloadImage = function(path) {
    return new Promise(function(resolve, reject) {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = path;
    })
}
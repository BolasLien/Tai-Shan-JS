// 預設匯入
// 匯入時名字可以不一樣
// import apple from './export.js'
// let number = apple(1, 2)
// console.log(number)

// 具名匯入
// 匯入時變數名稱必須一樣
// import * as exp from './export.js'
// console.log(exp);

// 預設和具名同時匯入
import apple, { a } from './export.js'
console.log(apple);
console.log(a);
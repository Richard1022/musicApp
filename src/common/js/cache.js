const SEARCH_LENGTH = 15;//存储长度限制15
export const searchKey = '__searchKey';//存储键值

//util functions:
function insertQueryArr(arr, val, compare, maxLen) {
    //声明存储关键字索引
    let index = arr.findIndex(compare); // findIndex parameters must compareFunctions
    if (index === 0) { // 如果要存储的值在当前数组中有,并且在第一个
        return
    }
    if (index > 0) { // 如果有,并且不再第一个,则将其位置移到第一个
        arr.splice(index, 1);
        arr.unshift(val);
    }
    if (index < 0) { //如果没有,添加到第一个,并做边界判断
        arr.unshift(val);
        if (maxLen && arr.length > SEARCH_LENGTH) {
            arr.pop();
        }
    }
}
//序列化反序列化 
function serialize(arr) {
    return JSON.stringify(arr);
}

export function saveSearchCache(query) { //存储搜索关键字
    //获取localstorage存储值
    let searchTxtArr = localStorage.getItem(searchKey) === null ? [] : JSON.parse(localStorage.getItem(searchKey));
    // console.log(searchTxtArr,'testType')  getitem为string,需要做json序列化
    //调用工具函数 合理排序存储历史
    insertQueryArr(searchTxtArr, query, (item) => { return item === query }, SEARCH_LENGTH);
    //json序列化
    searchTxtArr = serialize(searchTxtArr);
    localStorage.setItem(searchKey, searchTxtArr);
    return searchTxtArr;
}

export function initialSearchKey() {
   return localStorage.getItem(searchKey) === null ? [] : JSON.parse(localStorage.getItem(searchKey));
}
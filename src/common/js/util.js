export function getRandomInt(max,min){
    return Math.floor(min+Math.random()*(max-min+1));
}
export function shuffleArr(arr){
    let copyArr=arr.slice(0); //创建副本 不修改原数组
    for(let i=0;i<copyArr.length;i++){ //循环遍历数组
        let j=getRandomInt(i,0); //获取0~i之间的随机整数
        let cacheVal=copyArr[i]; //暂存 随机index 引用值
        copyArr[i]=copyArr[j];  //当前遍历index 和 遍历范围内的随机Index 交换
        copyArr[j]=cacheVal;
    };
    return copyArr;
}

export function getRandomInt(max,min){
    return Math.floor(min+Math.random()*(max-min+1));
}
export function shuffleArr(arr){
    for(let i=0;i<arr.length;i++){ //循环遍历数组
        let j=getRandomInt(i,0); //获取0~i之间的随机整数
        let cacheVal=arr[i]; //暂存 随机index 引用值
        arr[i]=arr[j];  //当前遍历index 和 遍历范围内的随机Index 交换
        arr[j]=cacheVal;
    };
    return arr;
}

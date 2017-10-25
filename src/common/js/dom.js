export function addClass(el, className) {
    if (hasClass(el, className)) {  //有当前cls return 
        return;
    }
    let newClass = el.className.split(" ");//cls按 空格 分割成数组 
    newClass.push(className);
    el.className =newClass.join(" ");
};

export function hasClass(el, className) {  //判断是否有class
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
};

export function getData(el,name,newVal){
    let prefix='data-';
    name=prefix+name;
    if(newVal){
        return el.setAttribute(name,newVal);
    }else{
        return el.getAttribute(name);
    }

}

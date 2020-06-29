var timer=Math.round(new Date());
function setCookie(name,value){
    document.cookie = name + "="+ escape (value);
}
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function stimer(){
    timer=Math.round(new Date())
}
function st(t){
    if((t.substr(0,4).toUpperCase()!='FAIL')&&(t.replace(/ /g,'')!='')&&(t.substr(0,27)!='/*\n *Processed By JSDec in ')){
        t='/*\n *Processed By JSDec in '+String(((Math.round(new Date())-timer)/1000).toFixed(2))+'s\n *JSDec - JSDec.js.org\n*/\n'+t
    }
    document.getElementById("encres").value=t;
}
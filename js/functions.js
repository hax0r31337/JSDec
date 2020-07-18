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
    if((t.substr(0,4).toUpperCase()!='FAIL')&&(t.replace(/ /g,'')!='')&&(t.substr(0,27)!='/*\n *Progcessed By JSDec in')){
        t='/*\n *Progcessed By JSDec in '+String(((Math.round(new Date())-timer)/1000).toFixed(2))+'s\n *JSDec - JSDec.js.org\n */\n'+t
    }
    document.getElementById("encres").value=t;
}
switch (getCookie("lang")){
    case "zh_cn":
        var thislang={nowlang:"中文(简体)",tools:"功能",jsdecode:"JS解码",about:"关于",updlog:"更新日志",gh:"Github",decresult:"破解结果",inputsth:"请粘贴js文件",copyres:"复制结果",downres:"下载结果",upload:"上传文件",startdec:"开始破解",clearres:"清除输入框",prores:"优化结果",help:"帮助",enc:["自动识别","美化","UglifyJS","Eval(包含packer)","AAEncode","JJEncode","JSF*ck","sojson v4","sojson高级版","JavaScript Obfuscator(普通版)","列表混淆变量名","sojson v5(默认配置)","jsjiami v6(默认配置)"],p:{beautify:"美化",uglify1:"Uglify-名称",uglify2:"Uglify-优化"},updlogs:{upd18:"重写多语言架构<br>修复bug<br>性能优化",upd17:"修复bug<br>支持破解Sojson v5和jsjiami v6的默认配置<br>优化js-obfuscator破解的破解成功率",upd16:"修复bug<br>UI优化<br>加入自动识别js混淆类型,UglifyJS专项处理",upd15:"修复bug<br>支持UglifyJS处理<br>UI优化",upd14:"UI优化<br>修复bug<br>支持破解JS-obfuscator普通版",upd13:"支持破解Sojson v4及Sojson高级版<br>多语言支持",upd12:"性能优化<br>支持上传文件",upd11:"修复bug<br>支持美化js，破解JSF*ck，一键美化破解结果",upd10:"第一个版本，支持eval/aaencode/jjencode的js解密"},al:{t:""/*,warning:true*/}};
        break;
    case "en_us":
        var thislang={nowlang:"EN(US)",tools:"Tools",jsdecode:"JS Decode",about:"About",updlog:"Update Logs",gh:"Github",decresult:"Decode Result",inputsth:"Plz paste your js code in the textarea.",copyres:"Copy Result",downres:"Download Result",clearres:"Clear Textarea",upload:"Upload",startdec:"Decode",prores:"Progcess Result",help:"help",enc:["Auto Scan","Beautify","UglifyJS","Eval(packer)","AAEncode","JJEncode","JSF*ck","sojson v4","sojson Premium","JavaScript Obfuscator(Default)","list names","sojson v5(Default)","jsjiami v6(Default)"],p:{beautify:"Beautify",uglify1:"Uglify-names",uglify2:"Uglify-Better",uglify3:"Uglify-Properties"},updlogs:{upd18:"Update Multi-Language Support<br>fix bugs<br>Performance optimization",upd17:"fix bugs<br>Sojson v5(default) and jsjiami v6(default) supported<br>upgraded js-obfuscator decode success rate",upd16:"fix bugs<br>UI Update<br>added Auto Scan js encode type,UglifyJS detail progcess",upd15:"fix bugs<br>UglifyJS progcess supported<br>UI Update",upd14:"UI Update<br>fix bugs<br>supported JS-obfuscator default",upd13:"Sojson v4 and Sojson Premium decode supported<br>Multi Language supported",upd12:"optimization<br>Supported upload",upd11:"fix bugs<br>JS_Beautify and decode JSF*ck supported",upd10:"first version<br>eval/aaencode/jjencode decode supported"},al:{t:""/*,warning:true*/}};
        break;
    case "zh_tw":
        var thislang={nowlang:"中文(繁體)",tools:"功能",jsdecode:"JS解碼",about:"關於",updlog:"更新日誌",gh:"Github",decresult:"破解結果",inputsth:"請貼上js文件",copyres:"複製結果",downres:"下載結果",upload:"上傳文件",startdec:"開始破解",clearres:"清除輸入框",prores: "優化結果",help:"使用手冊",enc:["自動識別","美化","UglifyJS","Eval(包含packer)","AAEncode","JJEncode","JSF*ck", "sojson v4","sojson高級版","JavaScript Obfuscator(普通版)","列表混淆變量名","sojson v5(默認配置)","jsjiami v6(默認配置)"],p:{beautify :"美化",uglify1:"Uglify-名稱",uglify2:"Uglify-優化"},updlogs:{upd18:"重寫多語言架構<br>修復bug<br>性能優化",upd17:"修復bug<br>支援破解Sojson v5和jsjiami v6的默認配置<br>優化js-obfuscator破解的破解成功率",upd16:"修復bug<br>UI優化<br>加入自動識別js混淆類型,UglifyJS專項處理",upd15:"修復bug<br>支援UglifyJS處理<br>UI優化",upd14:"UI優化<br>修復bug<br>支援破解JS-obfuscator普通版" ,upd13:"支援破解Sojson v4及Sojson高級版<br>多語言支援",upd12:"性能優化<br>支援上傳文件",upd11:"修復bug<br>支援美化js，破解JSF*ck，一鍵美化破解結果",upd10:"第一個版本，支援eval/aaencode/jjencode的js解密"},al:{t:""/*,warning:true*/}};
        break;
    default:
        switch (navigator.language.toLowerCase()){
            case 'zh-cn':
                setCookie("lang=zh_cn;")
                break;
            case 'en-uk':
            case 'en-us':
            default:
                setCookie("lang=en_us;")
                break;
            case 'zh-hk':
            case 'zh-hant':
            case 'zh-tw':
                setCookie("lang=zh_tw;")
                break;
        }
        location.reload(true)
}
var Wlangs=[
    {title:"中文(简体)",onc:function(){setCookie("lang=zh_cn;");location.reload(true)}},
    {title:"中文(繁體)",onc:function(){setCookie("lang=zh_tw;");location.reload(true)}},
    {title:"EN(US)",onc:function(){setCookie("lang=en_us;");location.reload(true)}}
],
updlist=[
    {ver:'v1.8',date:'2020-07-18',tell:thislang.updlogs.upd18},
    {ver:'v1.7',date:'2020-07-06',tell:thislang.updlogs.upd17},
    {ver:'v1.6',date:'2020-06-24',tell:thislang.updlogs.upd16},
    {ver:'v1.5',date:'2020-06-23',tell:thislang.updlogs.upd15},
    {ver:'v1.4',date:'2020-06-22',tell:thislang.updlogs.upd14},
    {ver:'v1.3',date:'2020-06-19',tell:thislang.updlogs.upd13},
    {ver:'v1.2',date:'2020-06-18',tell:thislang.updlogs.upd12},
    {ver:'v1.1',date:'2020-06-17',tell:thislang.updlogs.upd11},
    {ver:'v1.0',date:'2020-06-17',tell:thislang.updlogs.upd10},
];
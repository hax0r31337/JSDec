function autoscan(jsf){
	function checklist(f){
		if((f.indexOf(",")!=-1)&&(f.indexOf("=")!=-1)&&(f.indexOf("[")!=-1)&&(f.indexOf("]")!=-1)&&(f.indexOf("var ")!=-1)){return true}
	}
	if(jsf.indexOf("['sojson.v4']")!=-1){return decsojson4(jsf)}
	else if(jsf.indexOf("var __encode ='sojson.com")!=-1){return decsojsonp(jsf)}
    else if(jsf.indexOf("var encode_version = 'sojson.v5',")!=-1){return dec_sojsonv5_default(jsf)}
    else if(jsf.indexOf("'jsjiami.com.v6'")!=-1){return dec_jsjiamiv6_default(jsf)}
	else if(jsf.indexOf("'];(function(_0x")!=-1){return obdec_default(jsf)}
	else if(checklist(jsf.substring(0,jsf.indexOf(";")))){return dec_list(jsf)}
	else if(jsf.substring(0,100).replace(/ /g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\[/g,"").replace(/\]/g,"").replace(/\+/g,"").replace(/!/g,"")==""){return decjsf(jsf)}
	else if(jsf.substring(0,50).indexOf("eval")!=-1){return uneval(jsf)}
	var jstmp=aadecode(jsf)
	if(jstmp!="Failed!\nGiven code is not encoded as aaencode."){return jstmp}
	jstmp=jjdecode(jsf)
	if(jstmp!="Failed!\nGiven code is not encoded as jjencode."){return jstmp}
	return "Failed!\nAuto-Scan Failed."
}
function uneval(jsf) {
    var s=jsf.indexOf("eval"),f=jsf.lastIndexOf(")");
    eval("jsf=String"+jsf.substring(s+4,f+1))
    return jsf
}
function decsojson4(jsf) {
    var head="['sojson.v4']"
    if(jsf.indexOf(head)==-1){return "Failed!\nGiven code is not encoded as Sojson v4."}
    args=jsf.substring(240,jsf.length-58).split(/[a-zA-Z]{1,}/)
    var str="";
    for(var i=0;i<args.length;i++){
        str+=String.fromCharCode(args[i])
    }
    return str
}
function obdec_default(jsf,thr1=false,throwederror='') {
    var ojs=jsf,spljs;
    try{
        function sandbox() {
        function th(){
           var s=head2.split("")
           if(head2.indexOf(head1)==-1){return;}
           else{
               var c=head2.substring(head2.indexOf(head1),head2.length);
                var jstmp=c.substring(0,c.indexOf("')")+2)
                try{eval("var countn="+jstmp)}
                catch(e){var jstmp2=c.substring(c.indexOf("')")+2,c.length);jstmp=jstmp+jstmp2.substring(0,jstmp2.indexOf("')")+2);eval("var countn="+jstmp);}
                head2=head2.replace(jstmp,"'"+countn.replace(/\n/g,'\\n').replace(/'/g,'\\\'')+"'")
               th()
           }
        }
            eval(head3);
            th();return;
        }
        if(jsf.indexOf("));var")!=-1){var indf=jsf.indexOf("));var");spljs='));var'}
        else if(jsf.indexOf(")); var")!=-1){var indf=jsf.indexOf(")); var");spljs=')); var'}
        else if(jsf.indexOf("));\nvar")!=-1){var indf=jsf.indexOf("));\nvar");spljs='));\nvar'}
        else{throw 'Cannot Found function.'}
        var head1,head2=jsf.substring(indf+3,jsf.length),head3=head2.substring(head2.indexOf(")")+1,head2.length).split(""),c=0,pos,ch=-1;
        for(var i=0;i<head3.length;i++){
            if(head3[i]=="{"){c++;if(ch==-1){ch=0}}
            else if(head3[i]=="}"){c--}
            if(c==0&&ch==0){ch=1;pos=i;}
        }
        head1=head2.substring(4,head2.indexOf("=")).replace(/ /g,'');
        head3=jsf.substring(0,pos+head2.indexOf(")")+6+indf);
        head2=jsf.substring(pos+head2.indexOf(")")+6+indf,jsf.length)
        sandbox(head2)
        return head2
    }catch(e){
        if(thr1==false){return obdec_default(ojs.replace(spljs,'));\tvar'),true,e);}
        else{return 'Failed!\nthrowed1:'+throwederror+'\nthrowed2:'+e}
    }
}
function dec_sojsonv5_default(jsf) {
    if(jsf.indexOf('sojson.v5\',')==-1){return 'Failed\nNot Encoded as sojsonv5'}
    else{
    jsf=jsf.substring(jsf.indexOf('sojson.v5\',')+12,jsf.length)
    jsf='var '+jsf.substring(jsf.indexOf(',   ')+2,jsf.length)
    var js=obdec_default(jsf);
    return js.substring(0,js.indexOf('(function(_0x'));
    }
}
function dec_jsjiamiv6_default(jsf) {
    var js=obdec_default(jsf);
    return js.substring(0,js.lastIndexOf(';'));
}
function dec_list(jsf){
    if(!((jsf.indexOf(",")!=-1)&&(jsf.indexOf("=")!=-1)&&(jsf.indexOf("[")!=-1)&&(jsf.indexOf("]")!=-1)&&(jsf.indexOf("var ")!=-1))){throw 'Type Error!'}
    var result,name;
	function th(){
    	var s=result.split("")
    	if(result.indexOf(name)==-1){return;}
    	else{
            var c=result.substring(result.indexOf(name),result.length);
            var jstmp=c.substring(0,c.indexOf("]")+1)
    	    eval("var countn="+jstmp)
	        result=result.replace(jstmp,"'"+countn.replace(/\n/g,'\\n').replace(/'/g,'\\\'')+"'")
        	th()
    	}
	}
    name=jsf.substring(4,jsf.indexOf("="))
    eval(jsf.substring(0,jsf.indexOf(";")+1))
    result=jsf.substring(jsf.indexOf(";")+1,jsf.length)
    th()
    return result
}
function decsojsonp(jsf) {
    if(jsf.indexOf("var __encode ='sojson.com")==-1){return "Failed!\nGiven code is not encoded as Sojson Primium."}
    jsf=jsf.substring(jsf.indexOf(');var _')+2,jsf.lastIndexOf("(function(_0x"))
    return dec_list(jsf);
}
function aadecode(text){
    var evalPreamble = "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
    var decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
    var evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
    var decodePostamble = ") ());";
    text = text.replace(/^\s*/, "").replace(/\s*$/, "");
    if (/^\s*$/.test(text)){return "";}
    if (text.lastIndexOf(evalPreamble) < 0) {return "Failed!\nGiven code is not encoded as aaencode.";}
    if (text.lastIndexOf(evalPostamble) != text.length - evalPostamble.length) {return "Failed!\nGiven code is not encoded as aaencode.";}
    var decodingScript = text.replace(evalPreamble, decodePreamble).replace(evalPostamble, decodePostamble);
    return eval(decodingScript);
}
function jjdecode(t) {
    var jjvalue=""
    t.replace(/^\s+|\s+$/g, "");
    var startpos;
    var endpos;
    var gv;
    var gvl;
    if (t.indexOf("\"\'\\\"+\'+\",") == 0){
        startpos = t.indexOf('$$+"\\""+') + 8;
        endpos = t.indexOf('"\\"")())()');
        gv = t.substring((t.indexOf('"\'\\"+\'+",') + 9), t.indexOf("=~[]"));
        gvl = gv.length;
    } else {
        gv = t.substr(0, t.indexOf("="));
        gvl = gv.length;
        startpos = t.indexOf('"\\""+') + 5;
        endpos = t.indexOf('"\\"")())()');
    }
    if (startpos == endpos) {
        alert("No data !");
        return;
    }
    var data = t.substring(startpos, endpos);
    var b = ["___+", "__$+", "_$_+", "_$$+", "$__+", "$_$+", "$$_+", "$$$+", "$___+", "$__$+", "$_$_+", "$_$$+", "$$__+", "$$_$+", "$$$_+", "$$$$+"];
    var str_l = "(![]+\"\")[" + gv + "._$_]+";
    var str_o = gv + "._$+";
    var str_t = gv + ".__+";
    var str_u = gv + "._+";
    var str_hex = gv + ".";
    var str_s = '"';
    var gvsig = gv + ".";
    var str_quote = '\\\\\\"';
    var str_slash = '\\\\\\\\';
    var str_lower = "\\\\\"+";
    var str_upper = "\\\\\"+" + gv + "._+";
    var str_end = '"+';
    while (data != "") {
        if (0 == data.indexOf(str_l)) {
            data = data.substr(str_l.length);
            jjvalue+="l"
            continue;
        } else if (0 == data.indexOf(str_o)) {
            data = data.substr(str_o.length);
            jjvalue+="o"
            continue;
        } else if (0 == data.indexOf(str_t)) {
            data = data.substr(str_t.length);
            jjvalue+="t"
            continue;
        } else if (0 == data.indexOf(str_u)) {
            data = data.substr(str_u.length);
            jjvalue+="u"
            continue;
        }
        if (0 == data.indexOf(str_hex)) {
            data = data.substr(str_hex.length);
            var i = 0;
            for (i = 0; i < b.length; i++) {
                if (0 == data.indexOf(b[i])) {
                    data = data.substr((b[i]).length);
                    jjvalue+=i.toString(16)
                    break;
                }
            }
            continue;
        }
        if (0 == data.indexOf(str_s)) {
            data = data.substr(str_s.length);
            if (0 == data.indexOf(str_upper)){
                data = data.substr(str_upper.length);
                var ch_str = "";
                for (j = 0; j < 2; j++){
                    if (0 == data.indexOf(gvsig)) {
                        data = data.substr(gvsig.length);
                        for (k = 0; k < b.length; k++){
                            if (0 == data.indexOf(b[k])) {
                                data = data.substr(b[k].length);
                                ch_str += k.toString(16) + "";
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
                jjvalue+=String.fromCharCode(parseInt(ch_str, 16))
                continue;
            } else if (0 == data.indexOf(str_lower)){
                data = data.substr(str_lower.length);
                var ch_str = "";
                var ch_lotux = ""
                var temp = "";
                var b_checkR1 = 0;
                for (j = 0; j < 3; j++) {
                    if (j > 1){
                        if (0 == data.indexOf(str_l)) {
                            data = data.substr(str_l.length);
                            ch_lotux = "l";
                            break;
                        } else if (0 == data.indexOf(str_o)) {
                            data = data.substr(str_o.length);
                            ch_lotux = "o";
                            break;
                        } else if (0 == data.indexOf(str_t)) {
                            data = data.substr(str_t.length);
                            ch_lotux = "t";
                            break;
                        } else if (0 == data.indexOf(str_u)) {
                            data = data.substr(str_u.length);
                            ch_lotux = "u";
                            break;
                        }
                    }
                    if (0 == data.indexOf(gvsig)) {
                        temp = data.substr(gvsig.length);
                        for (k = 0; k < 8; k++){
                            if (0 == temp.indexOf(b[k])) {
                                if (parseInt(ch_str + k + "", 8) > 128) {
                                    b_checkR1 = 1;
                                    break;
                                }
                                ch_str += k + "";
                                data = data.substr(gvsig.length);
                                data = data.substr(b[k].length);
                                break;
                            }
                        }
                        if (1 == b_checkR1) {
                            if (0 == data.indexOf(str_hex)){
                                data = data.substr(str_hex.length);
                                var i = 0;
                                for (i = 0; i < b.length; i++) {
                                    if (0 == data.indexOf(b[i])) {
                                        data = data.substr((b[i]).length);
                                        ch_lotux = i.toString(16);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
                jjvalue+=String.fromCharCode(parseInt(ch_str, 8)) + ch_lotux
                continue;
            } else{
                var match = 0;
                var n;
                while (true) {
                    n = data.charCodeAt(0);
                    if (0 == data.indexOf(str_quote)) {
                        data = data.substr(str_quote.length);
                        jjvalue+='"'
                        match += 1;
                        continue;
                    } else if (0 == data.indexOf(str_slash)) {
                        data = data.substr(str_slash.length);
                        jjvalue+='\\'
                        match += 1;
                        continue;
                    } else if (0 == data.indexOf(str_end)){
                        if (match == 0) {
                            alert("+ no match S block: " + data);
                            return;
                        }
                        data = data.substr(str_end.length);
                        break;
                    } else if (0 == data.indexOf(str_upper)){
                        if (match == 0) {
                            alert("no match S block n>128: " + data);
                            return;
                        }
                        data = data.substr(str_upper.length);
                        var ch_str = "";
                        var ch_lotux = "";
                        for (j = 0; j < 10; j++) {
                            if (j > 1) {
                                if (0 == data.indexOf(str_l)) {
                                    data = data.substr(str_l.length);
                                    ch_lotux = "l";
                                    break;
                                } else if (0 == data.indexOf(str_o)) {
                                    data = data.substr(str_o.length);
                                    ch_lotux = "o";
                                    break;
                                } else if (0 == data.indexOf(str_t)) {
                                    data = data.substr(str_t.length);
                                    ch_lotux = "t";
                                    break;
                                } else if (0 == data.indexOf(str_u)) {
                                    data = data.substr(str_u.length);
                                    ch_lotux = "u";
                                    break;
                                }
                            }
                            if (0 == data.indexOf(gvsig)) {
                                data = data.substr(gvsig.length);
                                for (k = 0; k < b.length; k++){
                                    if (0 == data.indexOf(b[k])) {
                                        data = data.substr(b[k].length);
                                        ch_str += k.toString(16) + "";
                                        break;
                                    }
                                }
                            } else {
                                break;
                            }
                        }
                        jjvalue+=String.fromCharCode(parseInt(ch_str, 16))
                        break;
                    } else if (0 == data.indexOf(str_lower)){
                        if (match == 0) {
                            alert("no match S block n<128: " + data);
                            return;
                        }
                        data = data.substr(str_lower.length);
                        var ch_str = "";
                        var ch_lotux = ""
                        var temp = "";
                        var b_checkR1 = 0;
                        for (j = 0; j < 3; j++) {
                            if (j > 1){
                                if (0 == data.indexOf(str_l)) {
                                    data = data.substr(str_l.length);
                                    ch_lotux = "l";
                                    break;
                                } else if (0 == data.indexOf(str_o)) {
                                    data = data.substr(str_o.length);
                                    ch_lotux = "o";
                                    break;
                                } else if (0 == data.indexOf(str_t)) {
                                    data = data.substr(str_t.length);
                                    ch_lotux = "t";
                                    break;
                                } else if (0 == data.indexOf(str_u)) {
                                    data = data.substr(str_u.length);
                                    ch_lotux = "u";
                                    break;
                                }
                            }                
                            if (0 == data.indexOf(gvsig)) {
                                temp = data.substr(gvsig.length);
                                for (k = 0; k < 8; k++) {
                                    if (0 == temp.indexOf(b[k])) {
                                        if (parseInt(ch_str + k + "", 8) > 128) {
                                            b_checkR1 = 1;
                                            break;
                                        }
                                        ch_str += k + "";
                                        data = data.substr(gvsig.length);
                                        data = data.substr(b[k].length);
                                        break;
                                    }
                                }
                                if (1 == b_checkR1) {
                                    if (0 == data.indexOf(str_hex)){
                                        data = data.substr(str_hex.length);
                                        var i = 0;
                                        for (i = 0; i < b.length; i++) {
                                            if (0 == data.indexOf(b[i])) {
                                                data = data.substr((b[i]).length);
                                                ch_lotux = i.toString(16);
                                                break;
                                            }
                                        }
                                    }
                                }
                            } else {
                                break;
                            }
                        }
                        jjvalue+=String.fromCharCode(parseInt(ch_str, 8)) + ch_lotux
                        break;
                    } else if ((0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || (0x5b <= n && n <= 0x60) || (0x7b <= n && n <= 0x7f)) {
                        jjvalue+=data.charAt(0)
                        data = data.substr(1);
                        match += 1;
                    }
                }
                continue;
            }
        }
        break;
    }
    if(jjvalue!=""){return jjvalue;}
    else{return "Failed!\nGiven code is not encoded as jjencode."}
}
function decjsf(js) {
    function patternCreator(prefix, postfix) {
        replacedPrefix = prefix.replace(/[\[\]\(\)\+\!]/g, '\\$&');
        replacedPostfix = postfix.replace(/[\[\]\(\)\+\!]/g, '\\$&');
        return replacedPrefix + '(.*)' + replacedPostfix;
    }
    function isMatching(string, pattern) {
        var result = string.match(new RegExp(pattern));
        if (result) return result[1];
        return null;
    }
    function decodejsf() {
        var prefix = '[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(![]+[])[!+[]+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((!![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+!+[]]+(+[![]]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]+(+(!+[]+!+[]+!+[]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(+![]+([]+[])[([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(+![]+[![]]+([]+[])[([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]]](!+[]+!+[]+!+[]+[!+[]+!+[]])+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]])()(';
        var postfix = ')';
        var result = isMatching(code, patternCreator(prefix, postfix));
        if (result) {
            code = eval(result);
            return;
        }
        prefix = '[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(![]+[])[!+[]+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]](';
        postfix = ')()';
        result = isMatching(code, patternCreator(prefix, postfix));
        if (result) {
            code = eval(result);
            return;
        }
        prefix = '[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]](';
        postfix = ')()';
        result = isMatching(code, patternCreator(prefix, postfix));
        if (result) {
            code = eval(result);
            return;
        }
        code = eval(code);
    }
    try{var code = js;decodejsf();return code}
    catch(e){return "Failed\n"+e}
}
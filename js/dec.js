function autoscan(jsf){
	function checklist(f){
		if((f.indexOf(",")!=-1)&&(f.indexOf("=")!=-1)&&(f.indexOf("[")!=-1)&&(f.indexOf("]")!=-1)&&(f.indexOf("var ")!=-1)){return true}
	}
	if(jsf.indexOf("sojson.v4")!=-1){return decsojson4(jsf)}
	else if(jsf.indexOf("var __encode ='sojson.com")!=-1){return decsojsonp(jsf)}
	else if(jsf.indexOf("'];(function(_0x")!=-1){return obdec_default(jsf)}
	else if(checklist(jsf.substring(0,jsf.indexOf(";")))){return dec_list(jsf)}
	else if(jsf.substring(0,100).replace(/ /g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\[/g,"").replace(/\]/g,"").replace(/\+/g,"").replace(/!/g,"")==""){return decjsf(jsf)}
	else if(jsf.substring(0,50).indexOf("eval")!=-1){return uneval(jsf)}
	var jstmp=aadecode(jsf)
	if(jstmp!="Failed!\nGiven code is not encoded as aaencode."){return jstmp}
	jstmp=jjdecode(jsf)
	if(jstmp!="Failed!\nGiven code is not encoded as jjencode."){return jstmp}
	return "Auto-Scan Failed."
}
function uneval(jsf) {
try{
var s=jsf.indexOf("eval"),f=jsf.lastIndexOf(")");
eval("jsf=String"+jsf.substring(s+4,f+1))
}catch(e){
    return "Failed\n"+e
}
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
function obdec_default(jsf) {
    if(jsf.indexOf('_0x')==-1){return "Failed!\nGiven code is not encoded as JS-Obfuscator.";}
    function sandbox(cjs,bjs,name) {
    function th(js,n){
        var s=js.split("")
        if(js.indexOf(n)==-1){result=js;return;}
        else{
            var c=js.indexOf(n)+n.length;
            while(true){
                c++;
                if(s[c]==")"){
                    break;
                }
            }
            var jstmp=js.substring(js.indexOf(n),c+1)
            eval("var countn="+jstmp)
            js=js.replace(jstmp,"'"+countn+"'")
            th(js,n)
        }
    }
        eval(cjs);
        th(bjs,name);return;
    }
    var head1,result,head2=jsf.substring(jsf.indexOf("));var")+3,jsf.length),head3=head2.substring(head2.indexOf(")")+1,head2.length).split(""),c=0,pos,ch=false;
    for(var i=0;i<head3.length;i++){
        if(head3[i]=="{"){c++}
        else if(head3[i]=="}"){c--}
        if(c==0&&ch==false){ch=true;pos=i;}
    }
    head1=head2.substring(4,head2.indexOf("="));
    head3=jsf.substring(0,pos+head2.indexOf(")")+6+jsf.indexOf("));var"));
    head2=jsf.substring(pos+head2.indexOf(")")+6+jsf.indexOf("));var"),jsf.length)
    sandbox(head3,head2,head1)
    return result
}
function dec_list(jsf){
    var result,name,jsfile;
	function th(js,n){
    	var s=js.split("")
    	if(js.indexOf(n)==-1){result=js;return;}
    	else{
        	var c=js.indexOf(n)+n.length;
        	while(true){
            	c++;
            	if(s[c]=="]"){
                	break;
            	}
        	}
        	var jstmp=js.substring(js.indexOf(n),c+1)
    	    eval("var countn="+jstmp)
	        js=js.replace(jstmp,"'"+countn+"'")
        	th(js,n)
    	}
	}
    name=jsf.substring(4,jsf.indexOf("="))
    eval(jsf.substring(0,jsf.indexOf(";")+1))
    jsfile=jsf.substring(jsf.indexOf(";")+1,jsf.length)
    th(jsfile,name)
    return result
}
function decsojsonp(jsf) {
    function th(js,n,sz){
        var s=js.split("")
        if(js.indexOf(n)==-1){result=js;return}
        else{
           var c=js.indexOf(n)+n.length;
           while(true){
               c++;
               if(s[c]=="]"){
                    break;
                }
           }
            var jstmp=js.substring(js.indexOf(n),c+1),count=jstmp.substring(jstmp.indexOf('['),c+1)
            eval("var countn=sz"+count)
            js=js.replace(jstmp,"'"+countn+"'")
            th(js,n,sz)
        }
    }
    var head="var __encode ='sojson.com",result;
    if(jsf.indexOf(head)==-1){return "Failed!\nGiven code is not encoded as Sojson Primium."}
    jsf=jsf.substring(327,jsf.lastIndexOf("(function(_0x"))
    var sz=[],szn=jsf.substring(4,jsf.indexOf("="))
    eval(jsf.substring(0,jsf.indexOf(";")))
    var jsfi=jsf.substring(jsf.indexOf(";")+1,jsf.length)
    eval("for(var i=0;i<"+szn+".length-5;i++){sz[i]="+szn+"[i]}")
    th(jsfi,szn,sz)
    return result;
}
function aadecode(text){
    var evalPreamble = "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
    var decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
    var evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
    var decodePostamble = ") ());";
    text = text.replace(/^\s*/, "").replace(/\s*$/, "");
    if (/^\s*$/.test(text)) {
        return "";
    }
    if (text.lastIndexOf(evalPreamble) < 0) {
        return "Failed!\nGiven code is not encoded as aaencode.";
    }
    if (text.lastIndexOf(evalPostamble) != text.length - evalPostamble.length) {
        return "Failed!\nGiven code is not encoded as aaencode.";
    }

    var decodingScript = text.replace(evalPreamble, decodePreamble).replace(evalPostamble, decodePostamble);
    return eval(decodingScript);
}
function jjdecode(t) {
    //clean it
    var jjvalue=""
    t.replace(/^\s+|\s+$/g, "");

    var startpos;
    var endpos;
    var gv;
    var gvl;

    if (t.indexOf("\"\'\\\"+\'+\",") == 0) //palindrome check
    {
        //locate jjcode
        startpos = t.indexOf('$$+"\\""+') + 8;
        endpos = t.indexOf('"\\"")())()');

        //get gv
        gv = t.substring((t.indexOf('"\'\\"+\'+",') + 9), t.indexOf("=~[]"));
        gvl = gv.length;
    } else {
        //get gv
        gv = t.substr(0, t.indexOf("="));
        gvl = gv.length;

        //locate jjcode
        startpos = t.indexOf('"\\""+') + 5;
        endpos = t.indexOf('"\\"")())()');
    }

    if (startpos == endpos) {
        alert("No data !");
        return;
    }

    //start decoding
    var data = t.substring(startpos, endpos);

    //hex decode string
    var b = ["___+", "__$+", "_$_+", "_$$+", "$__+", "$_$+", "$$_+", "$$$+", "$___+", "$__$+", "$_$_+", "$_$$+", "$$__+", "$$_$+", "$$$_+", "$$$$+"];

    //lotu
    var str_l = "(![]+\"\")[" + gv + "._$_]+";
    var str_o = gv + "._$+";
    var str_t = gv + ".__+";
    var str_u = gv + "._+";

    //0123456789abcdef
    var str_hex = gv + ".";

    //s
    var str_s = '"';
    var gvsig = gv + ".";

    var str_quote = '\\\\\\"';
    var str_slash = '\\\\\\\\';

    var str_lower = "\\\\\"+";
    var str_upper = "\\\\\"+" + gv + "._+";

    var str_end = '"+'; //end of s loop

    while (data != "") {
        //l o t u
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

        //0123456789abcdef
        if (0 == data.indexOf(str_hex)) {
            data = data.substr(str_hex.length);

            //check every element of hex decode string for a match 
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

        //start of s block
        if (0 == data.indexOf(str_s)) {
            data = data.substr(str_s.length);

            //check if "R
            if (0 == data.indexOf(str_upper)) // r4 n >= 128
            {
                data = data.substr(str_upper.length); //skip sig
                var ch_str = "";
                for (j = 0; j < 2; j++) //shouldn't be more than 2 hex chars
                {
                    //gv + "."+b[ c ]               
                    if (0 == data.indexOf(gvsig)) {
                        data = data.substr(gvsig.length); //skip gvsig  
                        for (k = 0; k < b.length; k++) //for every entry in b
                        {
                            if (0 == data.indexOf(b[k])) {
                                data = data.substr(b[k].length);
                                ch_str += k.toString(16) + "";
                                break;
                            }
                        }
                    } else {
                        break; //done
                    }
                }

                jjvalue+=String.fromCharCode(parseInt(ch_str, 16))
                continue;
            } else if (0 == data.indexOf(str_lower)) //r3 check if "R // n < 128
            {
                data = data.substr(str_lower.length); //skip sig
                var ch_str = "";
                var ch_lotux = ""
                var temp = "";
                var b_checkR1 = 0;
                for (j = 0; j < 3; j++) //shouldn't be more than 3 octal chars
                {

                    if (j > 1) //lotu check
                    {
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

                    //gv + "."+b[ c ]                           
                    if (0 == data.indexOf(gvsig)) {
                        temp = data.substr(gvsig.length);
                        for (k = 0; k < 8; k++) //for every entry in b octal
                        {
                            if (0 == temp.indexOf(b[k])) {
                                if (parseInt(ch_str + k + "", 8) > 128) {
                                    b_checkR1 = 1;
                                    break;
                                }

                                ch_str += k + "";
                                data = data.substr(gvsig.length); //skip gvsig
                                data = data.substr(b[k].length);
                                break;
                            }
                        }

                        if (1 == b_checkR1) {
                            if (0 == data.indexOf(str_hex)) //0123456789abcdef
                            {
                                data = data.substr(str_hex.length);

                                //check every element of hex decode string for a match 
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
                        break; //done
                    }
                }

                jjvalue+=String.fromCharCode(parseInt(ch_str, 8)) + ch_lotux
                continue; //step out of the while loop
            } else //"S ----> "SR or "S+
            {

                // if there is, loop s until R 0r +
                // if there is no matching s block, throw error
                var match = 0;
                var n;

                //searching for mathcing pure s block
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
                    } else if (0 == data.indexOf(str_end)) //reached end off S block ? +
                    {
                        if (match == 0) {
                            alert("+ no match S block: " + data);
                            return;
                        }
                        data = data.substr(str_end.length);

                        break; //step out of the while loop
                    } else if (0 == data.indexOf(str_upper)) //r4 reached end off S block ? - check if "R n >= 128
                    {
                        if (match == 0) {
                            alert("no match S block n>128: " + data);
                            return;
                        }

                        data = data.substr(str_upper.length); //skip sig
                        var ch_str = "";
                        var ch_lotux = "";
                        for (j = 0; j < 10; j++) //shouldn't be more than 10 hex chars
                        {

                            if (j > 1) //lotu check
                            {
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

                            //gv + "."+b[ c ]               
                            if (0 == data.indexOf(gvsig)) {
                                data = data.substr(gvsig.length); //skip gvsig
                                for (k = 0; k < b.length; k++) //for every entry in b
                                {
                                    if (0 == data.indexOf(b[k])) {
                                        data = data.substr(b[k].length);
                                        ch_str += k.toString(16) + "";
                                        break;
                                    }
                                }
                            } else {
                                break; //done
                            }
                        }

                        jjvalue+=String.fromCharCode(parseInt(ch_str, 16))
                        break; //step out of the while loop
                    } else if (0 == data.indexOf(str_lower)) //r3 check if "R // n < 128
                    {
                        if (match == 0) {
                            alert("no match S block n<128: " + data);
                            return;
                        }

                        data = data.substr(str_lower.length); //skip sig
                        var ch_str = "";
                        var ch_lotux = ""
                        var temp = "";
                        var b_checkR1 = 0;
                        for (j = 0; j < 3; j++) //shouldn't be more than 3 octal chars
                        {

                            if (j > 1) //lotu check
                            {
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

                            //gv + "."+b[ c ]                           
                            if (0 == data.indexOf(gvsig)) {
                                temp = data.substr(gvsig.length);
                                for (k = 0; k < 8; k++) //for every entry in b octal
                                {
                                    if (0 == temp.indexOf(b[k])) {
                                        if (parseInt(ch_str + k + "", 8) > 128) {
                                            b_checkR1 = 1;
                                            break;
                                        }

                                        ch_str += k + "";
                                        data = data.substr(gvsig.length); //skip gvsig
                                        data = data.substr(b[k].length);
                                        break;
                                    }
                                }

                                if (1 == b_checkR1) {
                                    if (0 == data.indexOf(str_hex)) //0123456789abcdef
                                    {
                                        data = data.substr(str_hex.length);

                                        //check every element of hex decode string for a match 
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
                                break; //done
                            }
                        }

                        jjvalue+=String.fromCharCode(parseInt(ch_str, 8)) + ch_lotux
                        break; //step out of the while loop
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
        var prefix = '[][' + JSFuck.encode('fill') + ']' + '[' + JSFuck.encode('constructor') + ']' + '(' + JSFuck.encode('return eval') + ')()(';
        var postfix = ')';
        var result = isMatching(code, patternCreator(prefix, postfix));

        if (result) {
            code = eval(result);
            return;
        }

        prefix = '[][' + JSFuck.encode('fill') + ']' + '[' + JSFuck.encode('constructor') + '](';
        postfix = ')()';
        result = isMatching(code, patternCreator(prefix, postfix));

        if (result) {
            code = eval(result);
            return;
        }

        prefix = '[][' + JSFuck.encode('filter') + ']' + '[' + JSFuck.encode('constructor') + '](';
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
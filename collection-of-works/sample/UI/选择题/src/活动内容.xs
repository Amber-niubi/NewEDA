{"formatVersion":1,"fsms":[{"variables":[{"name":"图片","type":"FSM","export":true},{"name":"背景位置","type":"Number","export":true}],"startState":0,"states":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_event\" id=\"v;O,]ULZkm[`Hi,knqOu\" x=\"16\" y=\"8\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"Start\" style=\"event_blocks\"></mutation><next><block type=\"local_variable_create\" id=\"KzY;+={5Jt.4S!q!@MW8\"><mutation>%5B%7B%22name%22:%22UI%22,%22type%22:%22FSM%22,%22blockId%22:%22KzY;+=%7B5Jt.4S!q!@MW8%22%7D%5D</mutation><field name=\"NAME\">UI</field><value name=\"VALUE\"><block type=\"fsm_create\" id=\"/#8Ov6nOg4hQFUCegI`g\"><field name=\"FSM\">UI.UI系统</field></block></value><next><block type=\"change_state\" id=\"0BZLO.#I5,hS4u$JCMOL\"><field name=\"VALUE\">运行</field></block></next></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"初始化"},{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_event\" id=\"{3{B31S7V-r~NF:uv)8*\" x=\"780\" y=\"0\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"Start\" style=\"event_blocks\"></mutation><next><block type=\"local_variable_create\" id=\"8[5;-k3~tu1v%{9Oy8{N\"><mutation>%5B%7B%22name%22:%22UI%22,%22type%22:%22FSM%22,%22blockId%22:%228%5B5;-k3~tu1v%25%7B9Oy8%7BN%22%7D%5D</mutation><field name=\"NAME\">UI</field><value name=\"VALUE\"><block type=\"fsm_create\" id=\"ggK]X0|]^(3W-uUCvqB3\"><field name=\"FSM\">UI.UI系统</field></block></value><next><block type=\"local_variable_create\" id=\"9QMO4VpMuYlkX8MO-w{M\"><mutation>%5B%7B%22name%22:%22%E5%9B%BE%E7%89%87%22,%22type%22:%22FSM%22,%22blockId%22:%229QMO4VpMuYlkX8MO-w%7BM%22%7D%5D</mutation><field name=\"NAME\">图片</field><value name=\"VALUE\"><block type=\"fsm_create\" id=\"2q}[ZzAe|`qaFd~yi2tP\"><field name=\"FSM\">UI.图片</field></block></value><next><block type=\"local_variable_create\" id=\"a1En!Qi*7$kid24O/P,E\"><mutation>%5B%7B%22name%22:%22%E6%8C%89%E9%92%AE%22,%22type%22:%22FSM%22,%22blockId%22:%22a1En!Qi*7$kid24O/P,E%22%7D%5D</mutation><field name=\"NAME\">按钮</field><value name=\"VALUE\"><block type=\"fsm_create\" id=\"}58fX+X)b%EVrg2]iECT\"><field name=\"FSM\">UI.按钮</field></block></value><next><block type=\"fsm_variables_set\" id=\"PucpFh-Xqc,vt~KON*}e\"><field name=\"VAR\">背景位置</field><value name=\"VALUE\"><block type=\"math_number\" id=\"Odcfolu~DeXh(SnkYL@?\"><field name=\"NUM\">0</field></block></value><next><block type=\"fsm_send_message\" id=\"qrzo@R4iF}Hc^I:N5:HQ\"><field name=\"TITLE\">文件名</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"@)rI-Nu,?f63W,Ai1jj*\"><field name=\"VAR\">图片</field></block></value><value name=\"ARG\"><block type=\"empty_provider\" id=\"l0p$z#9-1FelKI16jF@y\"><mutation>{\"parentType\":\"Canvas2d_drawImage2\",\"argName\":\"imageFileName\"}</mutation><field name=\"VALUE\">树林.png</field></block></value><next><block type=\"fsm_send_message\" id=\"+/N65##|/6l}:mML=Eb1\"><field name=\"TITLE\">坐标X</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"X19l*|UFw*bd:^dn$-XA\"><field name=\"VAR\">图片</field></block></value><value name=\"ARG\"><block type=\"fsm_variables_get\" id=\".C*pcqUnmqJHdOokQjY!\"><field name=\"VAR\">背景位置</field></block></value><next><block type=\"fsm_send_message\" id=\"RthJ:A?nk=Vqe0lNDjCE\"><field name=\"TITLE\">坐标Y</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"P4.f#jhPVJ0bFSZfG0bM\"><field name=\"VAR\">图片</field></block></value><value name=\"ARG\"><block type=\"math_number\" id=\".RhO%iHjc$t_aQN2Jx`}\"><field name=\"NUM\">0</field></block></value><next><block type=\"fsm_send_message\" id=\"M(%uTcLYmHs6CZ9VV=%j\"><field name=\"TITLE\">高度</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"YkD!NAx[ixXaOFx08c2U\"><field name=\"VAR\">图片</field></block></value><value name=\"ARG\"><block type=\"native_call\" id=\"0jw*!NG_5RYVVY5LYVtr\"><mutation>%7B%22func%22:%7B%22name%22:%22Canvas2d_height%22,%22args%22:%5B%5D,%22returnType%22:%7B%22name%22:%22Integer%22,%22$__type%22:%22StructFieldType%22%7D,%22signature%22:%22Canvas2d_height()SInteger;%22,%22fullname%22:%22Canvas2d_height%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:27,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation></block></value><next><block type=\"fsm_send_message\" id=\"#e^/4}PqwSwqYoBI7:Bx\"><field name=\"TITLE\">宽度</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"D#vF4t!}VBx[HeZi0+,O\"><field name=\"VAR\">图片</field></block></value><value name=\"ARG\"><block type=\"ub_math_arithmetic\" id=\",^Tb?8IH2V;Gd[,6i`k}\"><field name=\"OP\">MULTIPLY</field><value name=\"A\"><shadow type=\"math_number\" id=\"*sIHy9QVFQYGMu}h?|sP\"><field name=\"NUM\">1.4</field></shadow></value><value name=\"B\"><shadow type=\"math_number\" id=\"?^w6P]H:^Y]P1yd;7{]O\"><field name=\"NUM\">1</field></shadow><block type=\"native_call\" id=\"`Poq4!t9?jhGT!YVyiT/\"><mutation>%7B%22func%22:%7B%22name%22:%22Canvas2d_height%22,%22args%22:%5B%5D,%22returnType%22:%7B%22name%22:%22Integer%22,%22$__type%22:%22StructFieldType%22%7D,%22signature%22:%22Canvas2d_height()SInteger;%22,%22fullname%22:%22Canvas2d_height%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:27,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation></block></value></block></value><next><block type=\"fsm_variables_set\" id=\"=Z,0iYXv0q_P9RFdNN{n\"><field name=\"VAR\">图片</field><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"?)c!G!koIS*1[z;!pFm+\"><field name=\"VAR\">图片</field></block></value><next><block type=\"fsm_send_message\" id=\"L3nH|3_tWnc=xI1#qwT]\"><field name=\"TITLE\">背景图片</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"{Nn,rpiwI7}k[VOUrt?k\"><field name=\"VAR\">按钮</field></block></value><value name=\"ARG\"><block type=\"empty_provider\" id=\"q/`.SH|I0wC4/BcS``9F\"><mutation>{\"parentType\":\"Canvas2d_drawImage2\",\"argName\":\"imageFileName\"}</mutation><field name=\"VALUE\">road-1072823_960_720.jpg</field></block></value><next><block type=\"state_variables_set\" id=\"/=Zk@=2]?.s*SawEW^xR\"><field name=\"VAR\">按钮</field><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"NNr8[WHfgXC9EGUkUXa=\"><field name=\"VAR\">按钮</field></block></value><next><block type=\"fsm_send_message\" id=\"YFE$)%FOIzS500@FjjUb\"><field name=\"TITLE\">监听</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"W.^qQQfbY#K/`zHTN@EV\"><field name=\"VAR\">按钮</field></block></value><value name=\"ARG\"><block type=\"variables_self\" id=\"~Qq4VxfZz,Q?(hgd7ST]\"></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block><block type=\"on_message\" id=\"S;9N.XqtMb#(%%!k=@K2\" x=\"1342\" y=\"0\"><field name=\"VALUE\">移动</field><next><block type=\"fsm_variables_set\" id=\"=;Xm5zyC6fslC1jI5lY`\"><field name=\"VAR\">背景位置</field><value name=\"VALUE\"><block type=\"ub_math_arithmetic\" id=\"u?JLGysT*Z3z/q}J^01H\"><field name=\"OP\">MINUS</field><value name=\"A\"><shadow type=\"math_number\" id=\"yDt,#xK*5Z_l~YaT_?GO\"><field name=\"NUM\">1</field></shadow><block type=\"fsm_variables_get\" id=\"t,o:Adv.jt_DS53ew_cM\"><field name=\"VAR\">背景位置</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"wF6=G#6GW[JigQLph.%{\"><field name=\"NUM\">4</field></shadow></value></block></value><next><block type=\"fsm_send_message\" id=\"4gq}@/RZRzo[N6zF^6~7\"><field name=\"TITLE\">坐标X</field><value name=\"FSM\"><block type=\"fsm_variables_get\" id=\"R#le;:Sr1%Y63;z1js=D\"><field name=\"VAR\">图片</field></block></value><value name=\"ARG\"><block type=\"fsm_variables_get\" id=\"vT:x[#`55gbiW0r,$9Yl\"><field name=\"VAR\">背景位置</field></block></value><next><block type=\"fsm_send_message_after_millisecond\" id=\"/av:A27Ia9{vB}2AX.ZN\"><field name=\"TITLE\">移动</field><value name=\"WAIT_MILLISECOND\"><shadow type=\"math_integer\" id=\"`%Zq`YgECI4#Pq}biWxy\"><field name=\"NUM\">100</field></shadow></value><value name=\"FSM\"><block type=\"variables_self\" id=\"p.SX7_P}|+,!^WlDKk}q\"></block></value></block></next></block></next></block></next></block><block type=\"fsm_send_message_after_millisecond\" id=\"?)/P;~!wfE~of),#sr,5\" x=\"2036\" y=\"416\"><field name=\"TITLE\">移动</field><value name=\"WAIT_MILLISECOND\"><shadow type=\"math_integer\" id=\"_+vqNbKQX1]rEmc2!hZ8\"><field name=\"NUM\">500</field></shadow></value><value name=\"FSM\"><block type=\"variables_self\" id=\"QoWZ:5Z19zxv-(T#ltw#\"></block></value></block><block type=\"on_message_primary\" id=\"uw4:MRc5lJJ9y_$J!Ugp\" x=\"1643\" y=\"457\"><field name=\"VALUE\">按钮点击</field><field name=\"TYPE\">String</field><next><block type=\"text_print\" id=\"/R$4_0qroe,ceWj;lDFP\"><value name=\"TEXT\"><shadow type=\"text\" id=\"T4b|,Yi0R9nH[eqgQ@|W\"><field name=\"TEXT\">text</field></shadow><block type=\"received_message_arg\" id=\"#y3glm0x.?-NohRPiBr7\"><field name=\"TYPE\">String</field></block></value><next><block type=\"fsm_send_message\" id=\"}fOG[*u4XgF76[g7k5SD\"><field name=\"TITLE\">删除</field><value name=\"FSM\"><block type=\"state_variables_get\" id=\"k.NolYIO|3IgDx}dvb`2\"><field name=\"VAR\">按钮</field></block></value><next><block type=\"local_variable_create\" id=\"){Yb/wd=WRtx-oGXXj5P\"><mutation>%5B%7B%22name%22:%22%E5%8A%A8%E7%94%BB%22,%22type%22:%22FSM%22,%22blockId%22:%22)%7BYb/wd=WRtx-oGXXj5P%22%7D%5D</mutation><field name=\"NAME\">动画</field><value name=\"VALUE\"><block type=\"fsm_create\" id=\"RBC[:|?+9HP25jQP%ssM\"><field name=\"FSM\">UI.单程动画</field></block></value><next><block type=\"fsm_send_message\" id=\"/,$reiELUB#b.M|897uW\"><field name=\"TITLE\">目标</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"S,Hl0d@:mRb0K3-z|nYZ\"><field name=\"VAR\">动画</field></block></value><value name=\"ARG\"><block type=\"fsm_variables_get\" id=\".$D@[?:P~z2G1h{h}(5?\"><field name=\"VAR\">图片</field></block></value><next><block type=\"fsm_send_message\" id=\"~Hq~/y8N+9Uo}lwzr]h_\"><field name=\"TITLE\">属性名称</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"]}aC/k9pIT%EjFS9)aW$\"><field name=\"VAR\">动画</field></block></value><value name=\"ARG\"><block type=\"text\" id=\"c[qHX)_Sg^Vl+nl)]Ki;\"><field name=\"TEXT\">坐标X</field></block></value><next><block type=\"fsm_send_message\" id=\".g,241oAh.?,zJPULZ?J\"><field name=\"TITLE\">每帧变化</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"Bn]?OE,Zv7|RNCZnLL*]\"><field name=\"VAR\">动画</field></block></value><value name=\"ARG\"><block type=\"math_number\" id=\"9~OPF146HPgrb)TvYyDA\"><field name=\"NUM\">-4</field></block></value><next><block type=\"fsm_send_message\" id=\",9aYqVs;|{13.x*]-!#w\"><field name=\"TITLE\">初始值</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"sU@vvjxnD8$,?;CfG1SA\"><field name=\"VAR\">动画</field></block></value><value name=\"ARG\"><block type=\"fsm_variables_get\" id=\"nK=T`@5dB3,2[rJ`O6jX\"><field name=\"VAR\">背景位置</field></block></value><next><block type=\"fsm_send_message\" id=\"*w9CiluXY+%pln28DKj~\"><field name=\"TITLE\">结束值</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"A.H0Jji^vb54$%Go9cAN\"><field name=\"VAR\">动画</field></block></value><value name=\"ARG\"><block type=\"math_number\" id=\"LmHkRoS4q]:w~.G@BI+f\"><field name=\"NUM\">-300</field></block></value><next><block type=\"fsm_send_message\" id=\"_uQ!KzF)tsu1kL|d}|Pu\"><field name=\"TITLE\">回调目标</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"8L|],Sdz?dYl:|VKHEy!\"><field name=\"VAR\">动画</field></block></value><value name=\"ARG\"><block type=\"variables_self\" id=\":_{.?(CpN|vp0xU7^h{,\"></block></value><next><block type=\"fsm_send_message\" id=\"Z)Q%!lX3=ez$8)Y=7~~3\"><field name=\"TITLE\">回调消息</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"n!T(Wmyp?3KDgmyQW;BO\"><field name=\"VAR\">动画</field></block></value><value name=\"ARG\"><block type=\"text\" id=\"xd;lsx85XT|/)5JN%E;R\"><field name=\"TEXT\">动画完成</field></block></value><next><block type=\"fsm_send_message\" id=\"2l(}n_~Tk=0AbVOg0b{7\"><field name=\"TITLE\">名称</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"kIaq[}E#.dPUZK_~E%$)\"><field name=\"VAR\">动画</field></block></value><value name=\"ARG\"><block type=\"text\" id=\"o3FQ@VF:Tg3Ns6KzLZTb\"><field name=\"TEXT\">背景</field></block></value><next><block type=\"fsm_send_message\" id=\":LBlt0[0-+gLMrH.Et[|\"><field name=\"TITLE\">开始</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"G+cDN-5jpc;#d{~2%srH\"><field name=\"VAR\">动画</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block><block type=\"on_message_primary\" id=\"6cQtCbztJgsq);PeyMCi\" x=\"2066\" y=\"652\"><field name=\"VALUE\">动画完成</field><field name=\"TYPE\">String</field><next><block type=\"text_print\" id=\"s]P/)Y_c/jN`(a`Jtot]\"><value name=\"TEXT\"><shadow type=\"text\" id=\"$%-@KaeeYkmAjm0[skFq\"><field name=\"TEXT\">text</field></shadow><block type=\"received_message_arg\" id=\"by~`|rs+b=]}$`Kl?Ea{\"><field name=\"TYPE\">String</field></block></value><next><block type=\"fsm_send_message\" id=\"cTkDw:%CA0Exr@,|`nXq\"><field name=\"TITLE\">删除</field><value name=\"FSM\"><block type=\"fsm_variables_get\" id=\"cgkr=U_#].6RaGzjG}:{\"><field name=\"VAR\">图片</field></block></value></block></next></block></next></block></xml>","comment":"状态","variables":[{"name":"按钮","type":"FSM","export":true}],"type":"state","name":"测试"},{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_event\" id=\"h:FnuFss`fe=Rh#h~48m\" x=\"16\" y=\"8\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"Start\" style=\"event_blocks\"></mutation><next><block type=\"local_variable_create\" id=\"#JvW*:.;K9PVo0v*=jmR\"><mutation>%5B%7B%22name%22:%22%E4%BD%9C%E5%93%81%22,%22type%22:%22FSM%22,%22blockId%22:%22#JvW*:.;K9PVo0v*=jmR%22%7D%5D</mutation><field name=\"NAME\">作品</field><value name=\"VALUE\"><block type=\"fsm_create\" id=\"%LaH;83D0-:Lb[=ARL#b\"><field name=\"FSM\">学生制作.开始</field></block></value></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"运行"}],"function":[],"comment":"状态机","type":"fsm","name":"开始"}],"structs":[],"functions":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"></xml>","comment":"函数","type":"function","name":"函数"}],"depends":["学生制作","UI"],"type":"src","typeLimit":"","comment":"","env":[],"name":"活动内容"}
{"formatVersion":1,"fsms":[{"variables":[{"name":"输入内容","type":"String","export":true}],"startState":0,"states":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_event\" id=\"@GVEU2u1uz*qjno%zH4V\" x=\"0\" y=\"0\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"keyup\" style=\"event_blocks\" argtype=\"String\"></mutation><next><block type=\"controls_if\" id=\"^,N^v+@|tcBazM3:2Mgj\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"lq{n=+~mW6GD~SZtQj6K\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"math_integer\" id=\"0*2#muKNEy-nXF{LX;?,\"><field name=\"NUM\">1</field></block></value><value name=\"B\"><block type=\"text_length\" id=\"0GtO@MK[M76LZ!u5/n{A\"><value name=\"VALUE\"><block type=\"received_message_arg\" id=\"E_7a:rLvZP|hGRu9S.)4\"><field name=\"TYPE\">String</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"fsm_variables_set\" id=\"{Ger,~^sh5/u[{0yU}$W\"><field name=\"VAR\">输入内容</field><value name=\"VALUE\"><block type=\"text_join\" id=\"#xR`MCC|aInH0r~R_qw5\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"fsm_variables_get\" id=\"csdY)6CeC:~g`|P+8=oJ\"><field name=\"VAR\">输入内容</field></block></value><value name=\"ADD1\"><block type=\"received_message_arg\" id=\"2?3RTAx21dE.8*wm`R2w\"><field name=\"TYPE\">String</field></block></value></block></value><next><block type=\"controls_if\" id=\";8c9`cT:)`vhj%=$XMIL\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"61CGi4}r8LHGPJ29^a)N\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"math_integer\" id=\"M0kuxtC[KdN%Eo/cV5,*\"><field name=\"NUM\">25</field></block></value><value name=\"B\"><block type=\"text_length\" id=\")G)0ou.E:v0CfGoD(-uW\"><value name=\"VALUE\"><block type=\"fsm_variables_get\" id=\"jO0Khw(3{fE):T/i[kJ!\"><field name=\"VAR\">输入内容</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"fsm_variables_set\" id=\"{Nf4B*[sjNljbs@]$_Xi\"><field name=\"VAR\">输入内容</field><value name=\"VALUE\"><block type=\"text_getSubstring\" id=\"~Er2[Ho@3DPf|,R0-*JY\"><mutation at1=\"true\" at2=\"true\"></mutation><field name=\"WHERE1\">FROM_START</field><field name=\"WHERE2\">FROM_START</field><value name=\"STRING\"><block type=\"fsm_variables_get\" id=\".2b#H:36hYlIRN3EZYCp\"><field name=\"VAR\">输入内容</field></block></value><value name=\"AT1\"><block type=\"math_integer\" id=\"yYTGRO[%.6_[MPmkVwk+\"><field name=\"NUM\">2</field></block></value><value name=\"AT2\"><block type=\"math_integer\" id=\"gL*p}Iy9}?F#uB+@MNV{\"><field name=\"NUM\">26</field></block></value></block></value></block></statement><next><block type=\"fsm_broadcast_message\" id=\"ZSOqsqEC(l$Yy$h[V-Gc\"><field name=\"TITLE\">输入字符</field><value name=\"ARG\"><block type=\"received_message_arg\" id=\"1u05udIPEhrzgl:C|dwk\"><field name=\"TYPE\">String</field></block></value></block></next></block></next></block></statement></block></next></block><block type=\"on_message\" id=\"FA?+*1,v2n-@y,A3:S:z\" x=\"1186\" y=\"0\"><field name=\"VALUE\">绘制</field><next><block type=\"native_call\" id=\"EDf$H#m5GomY!p}`@sD*\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22Colour%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22colour%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_setFillStyleColor%22,%22signature%22:%22Canvas2d_setFillStyleColor(SColour;)v%22,%22fullname%22:%22Canvas2d_setFillStyleColor%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:2,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"colour\"><block type=\"colour_picker\" id=\"*Tqo~}yfltxn/uaFO_c~\"><field name=\"COLOUR\">#000000</field></block></value><next><block type=\"native_call\" id=\")_.zqgh7]FnO?s=}5Z75\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22String%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22text%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22x%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22y%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_fillText%22,%22signature%22:%22Canvas2d_fillText(SString;,SNumber;,SNumber;)v%22,%22fullname%22:%22Canvas2d_fillText%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:4,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"text\"><block type=\"fsm_variables_get\" id=\"F07%]0uz(+X]nW@p;Lqv\"><field name=\"VAR\">输入内容</field></block></value><value name=\"x\"><block type=\"math_integer\" id=\"z;u~LqC|yMwqA48OKa_*\"><field name=\"NUM\">10</field></block></value><value name=\"y\"><block type=\"math_integer\" id=\"s#t#=8q3~bGtVLf~fk]g\"><field name=\"NUM\">50</field></block></value></block></next></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"获取输入"}],"function":[],"comment":"状态机","type":"fsm","name":"字符输入"},{"variables":[],"startState":0,"states":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_message_primary\" id=\"t|hkLq]C;8Q8w|:B96Hm\" x=\"0\" y=\"0\"><field name=\"VALUE\">输入字符</field><field name=\"TYPE\">String</field><next><block type=\"controls_if\" id=\"mfH(KA9R|HNo4G2]Y|O,\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"^`#ll}yK~oarm9+QpTqN\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"z[:]YKoMf;+*#IWhA!7J\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"text\" id=\"qbFg!BWrjkmH@tGDd?8W\"><field name=\"TEXT\"> </field></block></value><value name=\"B\"><block type=\"received_message_arg\" id=\"cFtKEkt{sCTMZRF{b1P8\"><field name=\"TYPE\">String</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"S)#G2-rl4K?vA.PDu~x#\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"text\" id=\"fs=62:.uiyXj(4@%N:+]\"><field name=\"TEXT\">.</field></block></value><value name=\"B\"><block type=\"received_message_arg\" id=\"-@QkqGvEA+*+`L}|tC]T\"><field name=\"TYPE\">String</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"#a(={F;]N}jNWkbJybY@\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"_yTjT.4O])R#Pzp^N*%d\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"text_length\" id=\"XH,=kMCDp.wP7KvJ`v]x\"><value name=\"VALUE\"><block type=\"state_variables_get\" id=\"r7r7#:hEAh%y59*C`Nc3\"><field name=\"VAR\">当前单词</field></block></value></block></value><value name=\"B\"><block type=\"math_integer\" id=\"@}B-O$`xQ*Qg)Q0wP7G5\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"text_print\" id=\"0B9QikSUR*o]elap[K2c\"><value name=\"TEXT\"><shadow type=\"text\" id=\"yi,QclJYpC;{g$wF~[{8\"><field name=\"TEXT\">text</field></shadow><block type=\"state_variables_get\" id=\"!UEEyYC![V_sa9Wn_La:\"><field name=\"VAR\">当前单词</field></block></value><next><block type=\"fsm_broadcast_message\" id=\"XxbP~2JE0(L34rx^o3ev\"><field name=\"TITLE\">输入单词</field><value name=\"ARG\"><block type=\"state_variables_get\" id=\"nC;R5C~c[.CQ!Q~BsgtT\"><field name=\"VAR\">当前单词</field></block></value></block></next></block></statement><next><block type=\"state_variables_set\" id=\"yJ#R]p,`B^`@xgXfoG2+\"><field name=\"VAR\">当前单词</field><value name=\"VALUE\"><block type=\"text\" id=\"c)Q4bVnmK{FDYjFYRXI{\"><field name=\"TEXT\"></field></block></value></block></next></block></statement><statement name=\"ELSE\"><block type=\"state_variables_set\" id=\"w5=Mu=wM?gw=r`rq6+zk\"><field name=\"VAR\">当前单词</field><value name=\"VALUE\"><block type=\"text_join\" id=\"W9=!xl^|.XGnktP7N/i*\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"state_variables_get\" id=\"X#?`?+9~)E*XQ-8QQB|Y\"><field name=\"VAR\">当前单词</field></block></value><value name=\"ADD1\"><block type=\"received_message_arg\" id=\"s^|Ea*^sPpR{|QY65v]I\"><field name=\"TYPE\">String</field></block></value></block></value></block></statement></block></next></block><block type=\"on_message\" id=\"Vxo2j-Te_QJsUm|wY4bJ\" x=\"736\" y=\"0\"><field name=\"VALUE\">绘制</field><next><block type=\"native_call\" id=\"a:hUVwl73`Az@8/cZtgn\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22Colour%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22colour%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_setFillStyleColor%22,%22signature%22:%22Canvas2d_setFillStyleColor(SColour;)v%22,%22fullname%22:%22Canvas2d_setFillStyleColor%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:2,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"colour\"><block type=\"colour_picker\" id=\"?e8sBfc)7}-^w3+iFNAl\"><field name=\"COLOUR\">#000000</field></block></value><next><block type=\"native_call\" id=\"-J6Vc%{AH+a;bn=^5l@-\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22String%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22text%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22x%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22y%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_fillText%22,%22signature%22:%22Canvas2d_fillText(SString;,SNumber;,SNumber;)v%22,%22fullname%22:%22Canvas2d_fillText%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:4,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"text\"><block type=\"text_join\" id=\"E+io5`m$%5h{rG?,5F4J\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"71DqR2VC-WfEf6KO|4N.\"><field name=\"TEXT\">当前单词：</field></block></value><value name=\"ADD1\"><block type=\"state_variables_get\" id=\"|I73?Eu|C-ddyJh/xCnr\"><field name=\"VAR\">当前单词</field></block></value></block></value><value name=\"x\"><block type=\"math_integer\" id=\"/;g4:fN;`d?-gdZU[x3p\"><field name=\"NUM\">10</field></block></value><value name=\"y\"><block type=\"math_integer\" id=\"incvF*[kKD~MZnyPxOnV\"><field name=\"NUM\">156</field></block></value></block></next></block></next></block></xml>","comment":"状态","variables":[{"name":"当前单词","type":"String","export":true}],"type":"state","name":"获取输入"}],"function":[],"comment":"状态机","type":"fsm","name":"单词分割"},{"variables":[{"name":"第一长","type":"String","export":true},{"name":"第二长","type":"String","export":true}],"startState":0,"states":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_event\" id=\"n7pf}FG{qXFDJF/:ew1z\" x=\"0\" y=\"0\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"Start\" style=\"event_blocks\"></mutation><next><block type=\"fsm_variables_set\" id=\"6[P$K=8GH^q3m+jx2X|2\"><field name=\"VAR\">第一长</field><value name=\"VALUE\"><block type=\"text\" id=\"xCL}A:xVi}0?~__?4s1v\"><field name=\"TEXT\"></field></block></value><next><block type=\"fsm_variables_set\" id=\"DLe~bjL+yx3WQ;ULOWae\"><field name=\"VAR\">第二长</field><value name=\"VALUE\"><block type=\"text\" id=\"G;TJ1doM-t]Ar;Q*^]R{\"><field name=\"TEXT\"></field></block></value></block></next></block></next></block><block type=\"on_message_primary\" id=\"2tj|sW8R}ds*L3fh=O?0\" x=\"360\" y=\"0\"><field name=\"VALUE\">输入单词</field><field name=\"TYPE\">String</field><next><block type=\"controls_if\" id=\"ZmSEZkZ+t{/ui+%.nDS`\"><mutation elseif=\"2\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"%D:120722UpG~x?2~!G-\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"text_length\" id=\"Eiln:t]5gg$XVVcS{,gj\"><value name=\"VALUE\"><block type=\"received_message_arg\" id=\"7FG]V?ii%/:JDd%6P2=*\"><field name=\"TYPE\">String</field></block></value></block></value><value name=\"B\"><block type=\"text_length\" id=\"C]NyTjtyfR06RZIL$8FT\"><value name=\"VALUE\"><block type=\"fsm_variables_get\" id=\"W9YG$]a9O_glw38nHt4d\"><field name=\"VAR\">第一长</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"fsm_variables_set\" id=\"u@8lUC6-b2nT%@_(//ij\"><field name=\"VAR\">第二长</field><value name=\"VALUE\"><block type=\"fsm_variables_get\" id=\"MQfFZJEn[|rXWQw?AQRE\"><field name=\"VAR\">第一长</field></block></value><next><block type=\"fsm_variables_set\" id=\"=z^^;M%1^Q*~0JU,7l4$\"><field name=\"VAR\">第一长</field><value name=\"VALUE\"><block type=\"received_message_arg\" id=\"O1.45I)-hm1y$XPU@K}l\"><field name=\"TYPE\">String</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"s9P:`{Sw8*nWN~1q{.6#\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"received_message_arg\" id=\"%XAb;{=bg9^*f0Eo[U=9\"><field name=\"TYPE\">String</field></block></value><value name=\"B\"><block type=\"fsm_variables_get\" id=\"4e`~igqPL%4}cGXS3H.j\"><field name=\"VAR\">第一长</field></block></value></block></value><statement name=\"DO1\"><block type=\"text_print\" id=\"-@lCJg0EVAv`7;pM_o5s\"><value name=\"TEXT\"><shadow type=\"text\" id=\"9,j*3r!_1GULyCb^9_H:\"><field name=\"TEXT\">1</field></shadow></value></block></statement><value name=\"IF2\"><block type=\"logic_compare\" id=\"^Vr6.UNK-hgI(55)f3R)\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"text_length\" id=\"%Hw4,iwzOBWURfT!fAO~\"><value name=\"VALUE\"><block type=\"received_message_arg\" id=\")Fp7v)M=Z1C#!bg3^TnP\"><field name=\"TYPE\">String</field></block></value></block></value><value name=\"B\"><block type=\"text_length\" id=\"u^=`;QZyI`68rdNV7,(p\"><value name=\"VALUE\"><block type=\"fsm_variables_get\" id=\"znvxp),)^get$!-.R94n\"><field name=\"VAR\">第二长</field></block></value></block></value></block></value><statement name=\"DO2\"><block type=\"text_print\" id=\"6:=S?_vMKPt76s|(uD(u\"><value name=\"TEXT\"><shadow type=\"text\" id=\"|voW@C4LccjY=T7w0~QN\"><field name=\"TEXT\">2</field></shadow></value><next><block type=\"fsm_variables_set\" id=\"_*L1tp89$6~m*GbV-6jS\"><field name=\"VAR\">第二长</field><value name=\"VALUE\"><block type=\"received_message_arg\" id=\"?+@unbzJ)H@OqZ;a9dsV\"><field name=\"TYPE\">String</field></block></value></block></next></block></statement><next><block type=\"text_print\" id=\"BXNDEj)3tPgmx_8E~jX4\"><value name=\"TEXT\"><shadow type=\"text\" id=\"/NOkdhzvyik}up`V9~Hx\"><field name=\"TEXT\">3</field></shadow></value></block></next></block></next></block><block type=\"on_message\" id=\"Sxs1R~pQ%cc+Hjs~}{SL\" x=\"1049\" y=\"0\"><field name=\"VALUE\">绘制</field><next><block type=\"native_call\" id=\"PCCSp^[tCK6;e=R}1J=w\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22Colour%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22colour%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_setFillStyleColor%22,%22signature%22:%22Canvas2d_setFillStyleColor(SColour;)v%22,%22fullname%22:%22Canvas2d_setFillStyleColor%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:2,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"colour\"><block type=\"colour_picker\" id=\",SM6[[j70[Jq~!zG@k84\"><field name=\"COLOUR\">#000000</field></block></value><next><block type=\"native_call\" id=\"u4F9Fs8wX5HD`,$5r(Rm\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22String%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22text%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22x%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22y%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_fillText%22,%22signature%22:%22Canvas2d_fillText(SString;,SNumber;,SNumber;)v%22,%22fullname%22:%22Canvas2d_fillText%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:4,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"text\"><block type=\"text_join\" id=\"u+eP?`[mb^5Ug!:dF[DB\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"3h/VcXM154fim]zf;Svm\"><field name=\"TEXT\">第一长单词：</field></block></value><value name=\"ADD1\"><block type=\"fsm_variables_get\" id=\"LjOuJ|`F5FI.[8b37KM-\"><field name=\"VAR\">第一长</field></block></value></block></value><value name=\"x\"><block type=\"math_integer\" id=\"O7`%Hip5$k]g.bKxffNf\"><field name=\"NUM\">10</field></block></value><value name=\"y\"><block type=\"math_integer\" id=\"#W-!f0pABoZ@J@T!BOcC\"><field name=\"NUM\">200</field></block></value><next><block type=\"native_call\" id=\"F_0qE+e$Q-{nxGe#+K1O\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22String%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22text%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22x%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22y%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_fillText%22,%22signature%22:%22Canvas2d_fillText(SString;,SNumber;,SNumber;)v%22,%22fullname%22:%22Canvas2d_fillText%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:4,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"text\"><block type=\"text_join\" id=\"2tgD/,;t+#iU[8fj5b1k\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"svBo-I:rPa/MsD[=b@]6\"><field name=\"TEXT\">第二长单词：</field></block></value><value name=\"ADD1\"><block type=\"fsm_variables_get\" id=\"of.Vb17w]z~K,s`*Aj]w\"><field name=\"VAR\">第二长</field></block></value></block></value><value name=\"x\"><block type=\"math_integer\" id=\"p}|*X],ucxO]Uk4TY.Sw\"><field name=\"NUM\">10</field></block></value><value name=\"y\"><block type=\"math_integer\" id=\"QsiB[cSLk}f_Mg*3Q=[%\"><field name=\"NUM\">250</field></block></value></block></next></block></next></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"状态"}],"function":[],"comment":"状态机","type":"fsm","name":"长度记录"},{"variables":[{"name":"统计词","type":"String","export":true}],"startState":0,"states":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_message_primary\" id=\"^pGX:V6NHi$.wO|HP]jN\" x=\"16\" y=\"126\"><field name=\"VALUE\">统计词</field><field name=\"TYPE\">String</field><next><block type=\"fsm_variables_set\" id=\"N]jCu,ogU~2pO*S)-Ana\"><field name=\"VAR\">统计词</field><value name=\"VALUE\"><block type=\"received_message_arg\" id=\"}FmO=9+2[Agf^K8,WF!_\"><field name=\"TYPE\">String</field></block></value><next><block type=\"change_state\" id=\"jni/E4@ghqiD4RNFmdg`\"><field name=\"VALUE\">统计</field></block></next></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"等待设定统计词"},{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_message_primary\" id=\"N)qQGOHmls1]?8v4iPkU\" x=\"0\" y=\"0\"><field name=\"VALUE\">输入单词</field><field name=\"TYPE\">String</field><next><block type=\"controls_if\" id=\"V^tAURkW2l(RqyWM[;H_\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"i`nts3@%d%-YD_-L9Rco\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"fsm_variables_get\" id=\".I@;;K=Pgy-hM^EiDdrL\"><field name=\"VAR\">统计词</field></block></value><value name=\"B\"><block type=\"received_message_arg\" id=\"w0$p:$a4hx;lL2BeU/]]\"><field name=\"TYPE\">String</field></block></value></block></value><statement name=\"DO0\"><block type=\"state_variables_set\" id=\"O2hOl3h.F%o|`=UmB/+s\"><field name=\"VAR\">次数</field><value name=\"VALUE\"><block type=\"ub_math_arithmetic\" id=\"aDke`jWQ=ulJknniag_3\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"math_integer\" id=\"$IL96k5KZ+jYp$kw;iR%\"><field name=\"NUM\">1</field></block></value><value name=\"B\"><block type=\"state_variables_get\" id=\"*kMas|`4atTA$/idUd6!\"><field name=\"VAR\">次数</field></block></value></block></value></block></statement></block></next></block><block type=\"on_message\" id=\"4ju(UaJjx}SkjtAu61=`\" x=\"614\" y=\"0\"><field name=\"VALUE\">绘制</field><next><block type=\"native_call\" id=\"KuL}lHJzd(H!owj)oaH;\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22Colour%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22colour%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_setFillStyleColor%22,%22signature%22:%22Canvas2d_setFillStyleColor(SColour;)v%22,%22fullname%22:%22Canvas2d_setFillStyleColor%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:2,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"colour\"><block type=\"colour_picker\" id=\"Rer+y[r2}u`2eCr4zQ_%\"><field name=\"COLOUR\">#000000</field></block></value><next><block type=\"native_call\" id=\"~0(vys.S+M3Wu=O_8q`M\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22String%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22text%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22x%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22y%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_fillText%22,%22signature%22:%22Canvas2d_fillText(SString;,SNumber;,SNumber;)v%22,%22fullname%22:%22Canvas2d_fillText%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:4,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"text\"><block type=\"text_join\" id=\"L2}?H+.C1TKyI%{-pFlm\"><mutation items=\"4\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\".)-iD_uD/#4bK=TD5C@k\"><field name=\"TEXT\">统计词</field></block></value><value name=\"ADD1\"><block type=\"fsm_variables_get\" id=\"[6*SgHfTL/N[_NYUn5(T\"><field name=\"VAR\">统计词</field></block></value><value name=\"ADD2\"><block type=\"text\" id=\"O@S%=a7f83%[N6VWpqKR\"><field name=\"TEXT\">次数：</field></block></value><value name=\"ADD3\"><block type=\"state_variables_get\" id=\"E~NI|%X/rHR]/^Mh3k16\"><field name=\"VAR\">次数</field></block></value></block></value><value name=\"x\"><block type=\"math_integer\" id=\"z7]gY9wLhyUBZf;`lG`F\"><field name=\"NUM\">10</field></block></value><value name=\"y\"><block type=\"math_integer\" id=\"KF`Zzqr9#g[.E%DDr=c*\"><field name=\"NUM\">300</field></block></value></block></next></block></next></block></xml>","comment":"状态","variables":[{"name":"次数","type":"Number","export":true}],"type":"state","name":"统计"}],"function":[],"comment":"状态机","type":"fsm","name":"单词次数统计"}],"structs":[],"functions":[],"depends":[],"type":"src","typeLimit":"","comment":"","env":[],"name":"字符流处理","SN":"kx3zj4ld-1pjg1vetfyp","collected":["<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"fsm_variables_set\" id=\"{Ger,~^sh5/u[{0yU}$W\"><field name=\"VAR\">输入内容</field><value name=\"VALUE\"><block type=\"text_join\" id=\"#xR`MCC|aInH0r~R_qw5\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"fsm_variables_get\" id=\"csdY)6CeC:~g`|P+8=oJ\"><field name=\"VAR\">输入内容</field></block></value><value name=\"ADD1\"><block type=\"received_message_arg\" id=\"2?3RTAx21dE.8*wm`R2w\"><field name=\"TYPE\">String</field></block></value></block></value><next><block type=\"controls_if\" id=\";8c9`cT:)`vhj%=$XMIL\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"61CGi4}r8LHGPJ29^a)N\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"math_integer\" id=\"M0kuxtC[KdN%Eo/cV5,*\"><field name=\"NUM\">15</field></block></value><value name=\"B\"><block type=\"text_length\" id=\")G)0ou.E:v0CfGoD(-uW\"><value name=\"VALUE\"><block type=\"fsm_variables_get\" id=\"jO0Khw(3{fE):T/i[kJ!\"><field name=\"VAR\">输入内容</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"fsm_variables_set\" id=\"{Nf4B*[sjNljbs@]$_Xi\"><field name=\"VAR\">输入内容</field><value name=\"VALUE\"><block type=\"text_getSubstring\" id=\"~Er2[Ho@3DPf|,R0-*JY\"><mutation at1=\"true\" at2=\"true\"></mutation><field name=\"WHERE1\">FROM_START</field><field name=\"WHERE2\">FROM_START</field><value name=\"STRING\"><block type=\"fsm_variables_get\" id=\".2b#H:36hYlIRN3EZYCp\"><field name=\"VAR\">输入内容</field></block></value><value name=\"AT1\"><block type=\"math_integer\" id=\"yYTGRO[%.6_[MPmkVwk+\"><field name=\"NUM\">2</field></block></value><value name=\"AT2\"><block type=\"math_integer\" id=\"gL*p}Iy9}?F#uB+@MNV{\"><field name=\"NUM\">16</field></block></value></block></value></block></statement><next><block type=\"fsm_broadcast_message\" id=\"ZSOqsqEC(l$Yy$h[V-Gc\"><field name=\"TITLE\">输入字符</field><value name=\"ARG\"><block type=\"received_message_arg\" id=\"1u05udIPEhrzgl:C|dwk\"><field name=\"TYPE\">String</field></block></value></block></next></block></next></block>","<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"on_message\" id=\"FA?+*1,v2n-@y,A3:S:z\"><field name=\"VALUE\">绘制</field><next><block type=\"native_call\" id=\"EDf$H#m5GomY!p}`@sD*\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22Colour%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22colour%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_setFillStyleColor%22,%22signature%22:%22Canvas2d_setFillStyleColor(SColour;)v%22,%22fullname%22:%22Canvas2d_setFillStyleColor%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:2,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"colour\"><block type=\"colour_picker\" id=\"*Tqo~}yfltxn/uaFO_c~\"><field name=\"COLOUR\">#000000</field></block></value><next><block type=\"native_call\" id=\")_.zqgh7]FnO?s=}5Z75\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22String%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22text%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22x%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22y%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_fillText%22,%22signature%22:%22Canvas2d_fillText(SString;,SNumber;,SNumber;)v%22,%22fullname%22:%22Canvas2d_fillText%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:4,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"text\"><block type=\"fsm_variables_get\" id=\"F07%]0uz(+X]nW@p;Lqv\"><field name=\"VAR\">输入内容</field></block></value><value name=\"x\"><block type=\"math_integer\" id=\"z;u~LqC|yMwqA48OKa_*\"><field name=\"NUM\">10</field></block></value><value name=\"y\"><block type=\"math_integer\" id=\"s#t#=8q3~bGtVLf~fk]g\"><field name=\"NUM\">50</field></block></value></block></next></block></next></block>","<block xmlns=\"https://developers.google.com/blockly/xml\" type=\"on_message\" id=\"Vxo2j-Te_QJsUm|wY4bJ\"><field name=\"VALUE\">绘制</field><next><block type=\"native_call\" id=\"a:hUVwl73`Az@8/cZtgn\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22Colour%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22colour%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_setFillStyleColor%22,%22signature%22:%22Canvas2d_setFillStyleColor(SColour;)v%22,%22fullname%22:%22Canvas2d_setFillStyleColor%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:2,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"colour\"><block type=\"colour_picker\" id=\"?e8sBfc)7}-^w3+iFNAl\"><field name=\"COLOUR\">#000000</field></block></value><next><block type=\"native_call\" id=\"-J6Vc%{AH+a;bn=^5l@-\"><mutation xmlns=\"\">%7B%22func%22:%7B%22args%22:%5B%7B%22type%22:%7B%22name%22:%22String%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22text%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22x%22,%22$__type%22:%22StructField%22%7D,%7B%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22name%22:%22y%22,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22name%22:%22Canvas2d_fillText%22,%22signature%22:%22Canvas2d_fillText(SString;,SNumber;,SNumber;)v%22,%22fullname%22:%22Canvas2d_fillText%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:4,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"text\"><block type=\"text_join\" id=\"E+io5`m$%5h{rG?,5F4J\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"71DqR2VC-WfEf6KO|4N.\"><field name=\"TEXT\">当前单词：</field></block></value><value name=\"ADD1\"><block type=\"state_variables_get\" id=\"|I73?Eu|C-ddyJh/xCnr\"><field name=\"VAR\">当前单词</field></block></value></block></value><value name=\"x\"><block type=\"math_integer\" id=\"/;g4:fN;`d?-gdZU[x3p\"><field name=\"NUM\">10</field></block></value><value name=\"y\"><block type=\"math_integer\" id=\"incvF*[kKD~MZnyPxOnV\"><field name=\"NUM\">156</field></block></value></block></next></block></next></block>"]}
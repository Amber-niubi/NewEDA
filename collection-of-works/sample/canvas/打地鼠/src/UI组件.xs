{"formatVersion":1,"fsms":[{"variables":[{"name":"x","type":"Number","export":true},{"name":"y","type":"Number","export":true},{"name":"高","type":"Number","export":true},{"name":"宽","type":"Number","export":true},{"name":"图片","type":"String","export":true},{"name":"目标","type":"FSM","export":true},{"name":"名称","type":"String","export":true}],"startState":0,"states":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_message_struct\" id=\"jrr^TPi!K*tFO]46]#}P\" x=\"56\" y=\"54\"><field name=\"VALUE\">初始化</field><field name=\"TYPE\">UI组件.图标按钮</field><next><block type=\"fsm_variables_set\" id=\"co@m_n`SuaVSQGj(rwI#\"><field name=\"VAR\">x</field><value name=\"VALUE\"><block type=\"struct_get_field\" id=\"~Y6e!`x6@#!|yCBb+ru~\"><field name=\"FIELD\">UI组件.图标按钮:x/Number</field><value name=\"DATA\"><block type=\"received_message_arg\" id=\"vx:eT*S6#R9CMl?NA0hx\"><field name=\"TYPE\">UI组件.图标按钮</field></block></value></block></value><next><block type=\"fsm_variables_set\" id=\"Jf|SsVH*[,w.4g#b(i6T\"><field name=\"VAR\">y</field><value name=\"VALUE\"><block type=\"struct_get_field\" id=\"SEz].p.cHd4*J{gf}#(n\"><field name=\"FIELD\">UI组件.图标按钮:y/Number</field><value name=\"DATA\"><block type=\"received_message_arg\" id=\"j;ia5#ROhu4c_P4x`=B*\"><field name=\"TYPE\">UI组件.图标按钮</field></block></value></block></value><next><block type=\"fsm_variables_set\" id=\"|m~N%*K@_8-yrKO9eyiL\"><field name=\"VAR\">图片</field><value name=\"VALUE\"><block type=\"struct_get_field\" id=\"z[]%au/mV3t:y:`d~X[h\"><field name=\"FIELD\">UI组件.图标按钮:图片名称/String</field><value name=\"DATA\"><block type=\"received_message_arg\" id=\"cBzWCZ.gRwJabMKhh67.\"><field name=\"TYPE\">UI组件.图标按钮</field></block></value></block></value><next><block type=\"fsm_variables_set\" id=\"Yo#87hZg!Cq1DZJ?A(Jz\"><field name=\"VAR\">高</field><value name=\"VALUE\"><block type=\"struct_get_field\" id=\"N,$xv{;jo`5M+=-+f6r@\"><field name=\"FIELD\">UI组件.图标按钮:高度/Number</field><value name=\"DATA\"><block type=\"received_message_arg\" id=\"_!uWw}o6$t9`Fqkp.t)t\"><field name=\"TYPE\">UI组件.图标按钮</field></block></value></block></value><next><block type=\"fsm_variables_set\" id=\")Klt?$T5Jjp%dAE.Vx}X\"><field name=\"VAR\">宽</field><value name=\"VALUE\"><block type=\"struct_get_field\" id=\"9~N9E*)aQn_EKfH$0A!R\"><field name=\"FIELD\">UI组件.图标按钮:宽度/Number</field><value name=\"DATA\"><block type=\"received_message_arg\" id=\"|.wl0+U2o5~KrWxv]YyP\"><field name=\"TYPE\">UI组件.图标按钮</field></block></value></block></value><next><block type=\"fsm_variables_set\" id=\";dvJ2J5wP;;B=@xz0X%j\"><field name=\"VAR\">名称</field><value name=\"VALUE\"><block type=\"struct_get_field\" id=\"5*`XyR2FuNR6=lSvixC_\"><field name=\"FIELD\">UI组件.图标按钮:按钮名称/String</field><value name=\"DATA\"><block type=\"received_message_arg\" id=\"[d|Y6q[[YU-4}yYB$7n`\"><field name=\"TYPE\">UI组件.图标按钮</field></block></value></block></value><next><block type=\"fsm_variables_set\" id=\"N15KwaZeFk;1*bQ2?`?!\"><field name=\"VAR\">目标</field><value name=\"VALUE\"><block type=\"struct_get_field\" id=\"VAdf.j:cf)#P)LCmNXY_\"><field name=\"FIELD\">UI组件.图标按钮:目标/FSM</field><value name=\"DATA\"><block type=\"received_message_arg\" id=\"#T!8DEr]WD/~(2-v4fY+\"><field name=\"TYPE\">UI组件.图标按钮</field></block></value></block></value><next><block type=\"change_state\" id=\"m172KcXBBIEjp9GN.=6n\"><field name=\"VALUE\">有效</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"初始化"},{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"typed_procedures\" id=\"OWMlqnlM~zE+*(Qp69ME\" x=\"0\" y=\"0\"><mutation xmlns=\"\">%5B%5D</mutation><field name=\"NAME\">刷新UI</field><next><block type=\"native_call\" id=\"J+pZGKb8v]cJN!sIG$aa\"><mutation xmlns=\"\">%7B%22func%22:%7B%22name%22:%22Canvas2d_drawImage4%22,%22args%22:%5B%7B%22name%22:%22imageFileName%22,%22type%22:%7B%22name%22:%22String%22,%22$__type%22:%22StructFieldType%22%7D,%22$__type%22:%22StructField%22%7D,%7B%22name%22:%22DestX%22,%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22$__type%22:%22StructField%22%7D,%7B%22name%22:%22DestY%22,%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22$__type%22:%22StructField%22%7D,%7B%22name%22:%22DestWidth%22,%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22$__type%22:%22StructField%22%7D,%7B%22name%22:%22DestHeight%22,%22type%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:null,%22signature%22:%22Canvas2d_drawImage4(SString;,SNumber;,SNumber;,SNumber;,SNumber;)v%22,%22fullname%22:%22Canvas2d_drawImage4%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:32,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"imageFileName\"><shadow type=\"empty_provider\" id=\"mB:A3Z?W5B#(Ur)3sw@w\"><mutation xmlns=\"\">{\"parentType\":\"Canvas2d_drawImage4\",\"argName\":\"imageFileName\",\"checkType\":\"String\"}</mutation><field name=\"VALUE\">蹦蹦吹牛.png</field></shadow><block type=\"fsm_variables_get\" id=\"(hMrJ~H!1R09hvL?+;b#\"><field name=\"VAR\">图片</field></block></value><value name=\"DestX\"><shadow type=\"math_number\" id=\"3(iRSK5ny*U`Hpa+?}Fh\"><field name=\"NUM\">0</field></shadow><block type=\"fsm_variables_get\" id=\"/okfgkZi?eI`sN^$aMlD\"><field name=\"VAR\">x</field></block></value><value name=\"DestY\"><shadow type=\"math_number\" id=\"fNAc)*NZ1;hrzUnXn0UZ\"><field name=\"NUM\">0</field></shadow><block type=\"fsm_variables_get\" id=\"f%ign@:T|,_[,UI;{%={\"><field name=\"VAR\">y</field></block></value><value name=\"DestWidth\"><shadow type=\"math_number\" id=\"Bb-q]crB2?G/?j{I@Zls\"><field name=\"NUM\">200</field></shadow><block type=\"fsm_variables_get\" id=\"N4RZi4]p/W0l%o^gDS]#\"><field name=\"VAR\">宽</field></block></value><value name=\"DestHeight\"><shadow type=\"math_number\" id=\"|eq[U5?ivhycUU*u~/d9\"><field name=\"NUM\">200</field></shadow><block type=\"fsm_variables_get\" id=\"9kNumXHJeJ:XeI)9@{JK\"><field name=\"VAR\">高</field></block></value></block></next></block><block type=\"on_event\" id=\"[VG_#/D);Oxn5iNseO{`\" x=\"351\" y=\"0\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"touchstart\" style=\"event_blocks\" argtype=\"Vector2\"></mutation><next><block type=\"local_variable_create\" id=\":4sL9FnUr=lu];FCLRL1\"><mutation xmlns=\"\">%5B%7B%22name%22:%22x%22,%22type%22:%22Number%22,%22blockId%22:%22:4sL9FnUr=lu%5D;FCLRL1%22%7D%5D</mutation><field name=\"NAME\">x</field><value name=\"VALUE\"><block type=\"native_call\" id=\"e`=+az2~eP^_6%Ww%J$N\"><mutation xmlns=\"\">%7B%22func%22:%7B%22name%22:%22Vector2_x%22,%22args%22:%5B%7B%22name%22:%22vector2%22,%22type%22:%7B%22name%22:%22Vector2%22,%22$__type%22:%22StructFieldTypeNative%22%7D,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22signature%22:%22Vector2_x(SVector2;)SNumber;%22,%22fullname%22:%22Vector2_x%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:25,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"vector2\"><block type=\"received_message_arg\" id=\"dRp^1Mo;27/Q*plK(gUv\"><field name=\"TYPE\">Vector2</field></block></value></block></value><next><block type=\"local_variable_create\" id=\"T)8iOX6JjL.+c/wJO3$?\"><mutation xmlns=\"\">%5B%7B%22name%22:%22y%22,%22type%22:%22Number%22,%22blockId%22:%22T)8iOX6JjL.+c/wJO3$?%22%7D%5D</mutation><field name=\"NAME\">y</field><value name=\"VALUE\"><block type=\"native_call\" id=\"]_j+k/2n|lLqK)=L/q08\"><mutation xmlns=\"\">%7B%22func%22:%7B%22name%22:%22Vector2_y%22,%22args%22:%5B%7B%22name%22:%22vector2%22,%22type%22:%7B%22name%22:%22Vector2%22,%22$__type%22:%22StructFieldTypeNative%22%7D,%22$__type%22:%22StructField%22%7D%5D,%22returnType%22:%7B%22name%22:%22Number%22,%22$__type%22:%22StructFieldType%22%7D,%22signature%22:%22Vector2_y(SVector2;)SNumber;%22,%22fullname%22:%22Vector2_y%22,%22scope%22:%22global%22,%22libHash%22:%22canvas2d%22,%22libIndex%22:26,%22libName%22:%22canvas2d%22,%22$__type%22:%22FunctionDef%22%7D,%22ignoreReturnValue%22:false%7D</mutation><value name=\"vector2\"><block type=\"received_message_arg\" id=\";gV}BcrRTmt=-=os2wm3\"><field name=\"TYPE\">Vector2</field></block></value></block></value><next><block type=\"local_variable_create\" id=\"PS1uud@El+^#;4T{9CZ+\"><mutation xmlns=\"\">%5B%7B%22name%22:%22x%E5%9C%A8%E8%8C%83%E5%9B%B4%E5%86%85%22,%22type%22:%22Boolean%22,%22blockId%22:%22PS1uud@El+%5E#;4T%7B9CZ+%22%7D%5D</mutation><field name=\"NAME\">x在范围内</field><value name=\"VALUE\"><block type=\"logic_operation\" id=\"K@YOywG+9J}?KGgYZ5OO\"><field name=\"OP\">AND</field><value name=\"A\"><block type=\"logic_compare\" id=\"=pg9z06rR-vP)yC}_R=*\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"local_variable_get\" id=\"]Q7;H_^|LYn0]L)45;]y\"><field name=\"VAR\">x</field></block></value><value name=\"B\"><block type=\"fsm_variables_get\" id=\"CT$VSAs_OyifeGY;-zg,\"><field name=\"VAR\">x</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"I7[+dMJs%mz.][jQG=2C\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"local_variable_get\" id=\"m/nm^TyF7K)n5Y2HXGZ;\"><field name=\"VAR\">x</field></block></value><value name=\"B\"><block type=\"ub_math_arithmetic\" id=\"[`kH1WwaxaVW)Lojfh@d\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"fsm_variables_get\" id=\"`j59zRl*=I@j[#%iOfs=\"><field name=\"VAR\">x</field></block></value><value name=\"B\"><block type=\"fsm_variables_get\" id=\"q_ba2tyH%KI#4|BX@@Rk\"><field name=\"VAR\">宽</field></block></value></block></value></block></value></block></value><next><block type=\"local_variable_create\" id=\"TMZLVx(r7Y{J;tjp^64[\"><mutation xmlns=\"\">%5B%7B%22name%22:%22y%E5%9C%A8%E8%8C%83%E5%9B%B4%E5%86%85%22,%22type%22:%22Boolean%22,%22blockId%22:%22TMZLVx(r7Y%7BJ;tjp%5E64%5B%22%7D%5D</mutation><field name=\"NAME\">y在范围内</field><value name=\"VALUE\"><block type=\"logic_operation\" id=\"agz]zDFdMqpC!|jue_Jb\"><field name=\"OP\">AND</field><value name=\"A\"><block type=\"logic_compare\" id=\"*0qm3i/-d?9uFKF)n|TG\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"local_variable_get\" id=\"69a{F8T:D12$9vSs[S+Z\"><field name=\"VAR\">y</field></block></value><value name=\"B\"><block type=\"fsm_variables_get\" id=\"#7yif-D.bS)1n/!B:w@P\"><field name=\"VAR\">y</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"$X`5bG.68`lMsaAayfdK\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"local_variable_get\" id=\"56|n3mqVs?X-017IB%^:\"><field name=\"VAR\">y</field></block></value><value name=\"B\"><block type=\"ub_math_arithmetic\" id=\"5XUx{ExJIu=w0E7vL$x/\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"fsm_variables_get\" id=\"64`Faw.8p`A%hH+Z4pYd\"><field name=\"VAR\">y</field></block></value><value name=\"B\"><block type=\"fsm_variables_get\" id=\"K|(!f,4`Nygbih[2(X]6\"><field name=\"VAR\">高</field></block></value></block></value></block></value></block></value><next><block type=\"controls_if\" id=\"J@_)H7#~D;*VXlpGXy!a\"><value name=\"IF0\"><block type=\"logic_operation\" id=\"G_YZJ~o*MEuSMx{wg!Rn\"><field name=\"OP\">AND</field><value name=\"A\"><block type=\"local_variable_get\" id=\"Q#c*}=4QM9@eG4_NOU^Z\"><field name=\"VAR\">x在范围内</field></block></value><value name=\"B\"><block type=\"local_variable_get\" id=\"-!9GY?iMQ]g`*([BQJNo\"><field name=\"VAR\">y在范围内</field></block></value></block></value><statement name=\"DO0\"><block type=\"fsm_send_message\" id=\":AG$6Pv}518=^`qN#U%E\"><field name=\"TITLE\">按钮按下</field><value name=\"FSM\"><block type=\"fsm_variables_get\" id=\"hjZ/~Js`iF,D,n3*Ad]+\"><field name=\"VAR\">目标</field></block></value><value name=\"ARG\"><block type=\"fsm_variables_get\" id=\"mt}@-${Au4Da6U-H:RZc\"><field name=\"VAR\">名称</field></block></value></block></statement></block></next></block></next></block></next></block></next></block></next></block><block type=\"on_message_primary\" id=\"(/*d^a2hZ_CjR/EX3X(u\" x=\"1713\" y=\"0\"><field name=\"VALUE\">x</field><field name=\"TYPE\">Number</field><next><block type=\"fsm_variables_set\" id=\"4RB}5d_k=gHCh.3VGo@V\"><field name=\"VAR\">x</field><value name=\"VALUE\"><block type=\"received_message_arg\" id=\"}-`h;8PO8(65q8Idr$D8\"><field name=\"TYPE\">Number</field></block></value></block></next></block><block type=\"on_message_primary\" id=\"I.W.c:D[()NcFk;]@F_s\" x=\"2141\" y=\"0\"><field name=\"VALUE\">y</field><field name=\"TYPE\">Number</field><next><block type=\"fsm_variables_set\" id=\"DiyraUWQyzF@Dwj]F(7O\"><field name=\"VAR\">y</field><value name=\"VALUE\"><block type=\"received_message_arg\" id=\"KG_NO@,0;i}SVovK:w`1\"><field name=\"TYPE\">Number</field></block></value></block></next></block><block type=\"on_message\" id=\"o0-ekhOs[-~`rifT)9IF\" x=\"2570\" y=\"0\"><field name=\"VALUE\">刷新UI</field><next><block type=\"typed_procedure_call\" id=\"Gc?gh9r@@1Hm?81W_5FY\"><mutation xmlns=\"\">%7B%22returnType%22:null,%22args%22:%5B%5D%7D</mutation><field name=\"MODULE\"></field><field name=\"METHOD\">刷新UI</field></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"有效"},{"code":"","comment":"状态","variables":[],"type":"state","name":"无效"}],"function":[],"comment":"状态机","type":"fsm","name":"图标按钮"},{"variables":[],"startState":0,"states":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_event\" id=\"~p~}uGR7g0`o_fE9G6q.\" x=\"227\" y=\"102\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"Start\" style=\"event_blocks\"></mutation><next><block type=\"fsm_send_message\" id=\"zzaix6G*5]F9.7]V]rNn\"><field name=\"TITLE\">刷新</field><value name=\"FSM\"><block type=\"variables_self\" id=\"5F.s9;dEqyH66y@znD#g\"></block></value></block></next></block><block type=\"on_message\" id=\"x0pF9LP]Y`0n$vlA_UT|\" x=\"233\" y=\"303\"><field name=\"VALUE\">刷新</field><next><block type=\"fsm_broadcast_message\" id=\";EhXc7h$r;5?giSGC/_1\"><field name=\"TITLE\">刷新UI</field><next><block type=\"fsm_send_message_after_millisecond\" id=\"(YZDv}eQ)V:[K_)kUB9y\"><field name=\"TITLE\">刷新</field><value name=\"WAIT_MILLISECOND\"><block type=\"math_integer\" id=\"qkv:XDAfR^Zc/67r@|?M\"><field name=\"NUM\">60</field></block></value><value name=\"FSM\"><block type=\"variables_self\" id=\"$#:QPmRQ]BnId`-b/8MA\"></block></value></block></next></block></next></block><block type=\"on_message\" id=\"-@bJ{EHmV/%U^bUy![9x\" x=\"219\" y=\"471\"><field name=\"VALUE\">禁用</field><next><block type=\"change_state\" id=\"d]g)L+~%0,;#fTP{fKpl\"><field name=\"VALUE\">无效</field></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"有效"},{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_message\" id=\"0=jP@Nh-l0_b0,n~5ujv\" x=\"16\" y=\"8\"><field name=\"VALUE\">启用</field><next><block type=\"change_state\" id=\"ew:P{k_!tUG8Ym]R[E!h\"><field name=\"VALUE\">有效</field></block></next></block></xml>","comment":"状态","variables":[],"type":"state","name":"无效"}],"function":[],"comment":"状态机","type":"fsm","name":"UI系统"}],"structs":[{"variables":[],"startState":0,"states":[],"function":[],"comment":"状态机","type":"fsm","name":"数据结构","code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"struct\" id=\"D4U2^hw,RF];02O,L(%=\" x=\"148\" y=\"47\"><field name=\"NAME\">图标按钮</field><statement name=\"FIELDS\"><block type=\"struct_field\" id=\"ru9^PsASOST~T[)CkAv|\"><field name=\"NAME\">按钮名称</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"0P..KBzBlpXIUE33@[c#\"><field name=\"TYPE\">String</field></block></value><next><block type=\"struct_field\" id=\"kQ!~e^.PxJB(D43rW?s)\"><field name=\"NAME\">图片名称</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"6k5kQ,LYNJ.hf97Upz*8\"><field name=\"TYPE\">String</field></block></value><next><block type=\"struct_field\" id=\"7Fyo/729HKJG3^^WgqIk\"><field name=\"NAME\">高度</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"Ytrq5?o/L$?Vks6K7o(W\"><field name=\"TYPE\">Number</field></block></value><next><block type=\"struct_field\" id=\"1z$n/f}BTaA4|_}tT+E%\"><field name=\"NAME\">宽度</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"EiK%Y3Ca!Y]IuQ;3kFe:\"><field name=\"TYPE\">Number</field></block></value><next><block type=\"struct_field\" id=\"IHqch*GSMFlZ|J)+A95x\"><field name=\"NAME\">x</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"ei~PMm^R|.B*2qQ^!wat\"><field name=\"TYPE\">Number</field></block></value><next><block type=\"struct_field\" id=\"9lzzj#a=]4RvgK$UyYX1\"><field name=\"NAME\">y</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"5v$tHLdx#/{Jrg7l)A64\"><field name=\"TYPE\">Number</field></block></value><next><block type=\"struct_field\" id=\"E%I(~_~Mk0kWnT+f?2sh\"><field name=\"NAME\">目标</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"FU*Sdldpn$[cC:gFpa~p\"><field name=\"TYPE\">FSM</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>"}],"functions":[{"code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"typed_procedures\" id=\"oDmjzG;!3s8!OLzQUIOd\" x=\"16\" y=\"8\"><mutation xmlns=\"\">%5B%7B%22name%22:%22%E5%9B%BE%E7%89%87%22,%22type%22:%22String%22,%22blockId%22:%22oDmjzG;!3s8!OLzQUIOd%22%7D,%7B%22name%22:%22x%22,%22type%22:%22Number%22,%22blockId%22:%22oDmjzG;!3s8!OLzQUIOd%22%7D,%7B%22name%22:%22y%22,%22type%22:%22Number%22,%22blockId%22:%22oDmjzG;!3s8!OLzQUIOd%22%7D,%7B%22name%22:%22%E5%AE%BD%22,%22type%22:%22Number%22,%22blockId%22:%22oDmjzG;!3s8!OLzQUIOd%22%7D,%7B%22name%22:%22%E9%AB%98%22,%22type%22:%22Number%22,%22blockId%22:%22oDmjzG;!3s8!OLzQUIOd%22%7D,%7B%22name%22:%22%E5%90%8D%E7%A7%B0%22,%22type%22:%22String%22,%22blockId%22:%22oDmjzG;!3s8!OLzQUIOd%22%7D,%7B%22name%22:%22%E7%9B%AE%E6%A0%87%22,%22type%22:%22FSM%22,%22blockId%22:%22oDmjzG;!3s8!OLzQUIOd%22%7D%5D</mutation><field name=\"NAME\">创建图标按钮</field><value name=\"RETURN\"><block type=\"struct_base_type\" id=\"[?DkjL5==41DBFK,OYk(\"><field name=\"TYPE\">FSM</field></block></value><statement name=\"ARGS\"><block type=\"struct_field\" id=\"Urv}H6GEM2ZHB{^a;#5U\"><field name=\"NAME\">图片</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"!$%c`^uf2%77Au.l.=GE\"><field name=\"TYPE\">String</field></block></value><next><block type=\"struct_field\" id=\"MQK-;Tg+/3%HTY_P$qB$\"><field name=\"NAME\">x</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"t).t^7HwI=Zk(eT+(atq\"><field name=\"TYPE\">Number</field></block></value><next><block type=\"struct_field\" id=\"HMuGB`@B$gfs,IQ[?)1?\"><field name=\"NAME\">y</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"@)pgYc428cDb=6|avu)3\"><field name=\"TYPE\">Number</field></block></value><next><block type=\"struct_field\" id=\"5)[63?XHG2-g{LNN#)0A\"><field name=\"NAME\">宽</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\",M$MtUclGaSfD~+?Ay,;\"><field name=\"TYPE\">Number</field></block></value><next><block type=\"struct_field\" id=\"g3S]*)CGz{Z/_s%fCo9j\"><field name=\"NAME\">高</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"Aa6`l0g1|im[vMkErH]a\"><field name=\"TYPE\">Number</field></block></value><next><block type=\"struct_field\" id=\"Qa(T5XgSk-s~EE]^LlPv\"><field name=\"NAME\">名称</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"Wab(7^.n?/_`4keRrLJ)\"><field name=\"TYPE\">String</field></block></value><next><block type=\"struct_field\" id=\"2k6o~wF7`U,O7F@5E6nt\"><field name=\"NAME\">目标</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"KM=9jkrOE%!]Ye5@uKos\"><field name=\"TYPE\">FSM</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement><next><block type=\"local_variable_create\" id=\"%MZ~liZ7P@3v:k#5yORc\"><mutation xmlns=\"\">%5B%7B%22name%22:%22%E6%8C%89%E9%92%AE%22,%22type%22:%22FSM%22,%22blockId%22:%22%25MZ~liZ7P@3v:k#5yORc%22%7D%5D</mutation><field name=\"NAME\">按钮</field><value name=\"VALUE\"><block type=\"fsm_create\" id=\"``Z.oR~LhJZ%Ik^8{.oq\"><field name=\"FSM\">UI组件.图标按钮</field></block></value><next><block type=\"local_variable_create\" id=\"Qo/FOLhEYkxZtp$)Z=1L\"><mutation xmlns=\"\">%5B%7B%22name%22:%22%E6%8C%89%E9%92%AE%E4%BF%A1%E6%81%AF%22,%22type%22:%22UI%E7%BB%84%E4%BB%B6.%E5%9B%BE%E6%A0%87%E6%8C%89%E9%92%AE%22,%22blockId%22:%22Qo/FOLhEYkxZtp$)Z=1L%22%7D%5D</mutation><field name=\"NAME\">按钮信息</field><value name=\"VALUE\"><block type=\"struct_new\" id=\"%j/v)9`0Ap1%FPu(gM}Q\"><field name=\"TYPE\">UI组件.图标按钮</field></block></value><next><block type=\"struct_set_field\" id=\",WWnRbdz+iZss9qO-1Ba\"><field name=\"FIELD\">UI组件.图标按钮:图片名称/String</field><value name=\"DATA\"><block type=\"local_variable_get\" id=\"y=BuZ]dZn~vcq8GhFH7%\"><field name=\"VAR\">按钮信息</field></block></value><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"RMi6Y4Ajs+jI1(s(*oJ/\"><field name=\"VAR\">图片</field></block></value><next><block type=\"struct_set_field\" id=\"x:cW?Uo+_gC}V:K$FS{2\"><field name=\"FIELD\">UI组件.图标按钮:高度/Number</field><value name=\"DATA\"><block type=\"local_variable_get\" id=\"HduGEd9]j^rDS!6ga]es\"><field name=\"VAR\">按钮信息</field></block></value><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"t!%H!*zuMLIxqE-g8be4\"><field name=\"VAR\">高</field></block></value><next><block type=\"struct_set_field\" id=\"wWwK!rIDS_@75hJs;9q}\"><field name=\"FIELD\">UI组件.图标按钮:宽度/Number</field><value name=\"DATA\"><block type=\"local_variable_get\" id=\")Z9sml;k*M{G,yviPTP9\"><field name=\"VAR\">按钮信息</field></block></value><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"6q~/rCB/?RHg:Ff$V8f%\"><field name=\"VAR\">宽</field></block></value><next><block type=\"struct_set_field\" id=\"$TQB3QmxR^S[`DN;UJ@+\"><field name=\"FIELD\">UI组件.图标按钮:x/Number</field><value name=\"DATA\"><block type=\"local_variable_get\" id=\";XfB~QuT-+|aN3K.}l1L\"><field name=\"VAR\">按钮信息</field></block></value><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"t)DqJGS3Z8Gbm.ZXi31g\"><field name=\"VAR\">x</field></block></value><next><block type=\"struct_set_field\" id=\"f^wxfX1m;Z]m)nH]S9ST\"><field name=\"FIELD\">UI组件.图标按钮:y/Number</field><value name=\"DATA\"><block type=\"local_variable_get\" id=\"Q8x1}k4kcUI:f#aULF9q\"><field name=\"VAR\">按钮信息</field></block></value><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"Jh1Lz`!9i6v?Oi0#D2dH\"><field name=\"VAR\">y</field></block></value><next><block type=\"struct_set_field\" id=\",M6:U*vv@bUJaAc4o7D2\"><field name=\"FIELD\">UI组件.图标按钮:目标/FSM</field><value name=\"DATA\"><block type=\"local_variable_get\" id=\"j9XOk5N~Z,[oeN]%Y@jT\"><field name=\"VAR\">按钮信息</field></block></value><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"e+Zl;=Z:/)e0op3rhx;u\"><field name=\"VAR\">目标</field></block></value><next><block type=\"struct_set_field\" id=\"37;w9j$(p:=X(qlvB_YK\"><field name=\"FIELD\">UI组件.图标按钮:按钮名称/String</field><value name=\"DATA\"><block type=\"local_variable_get\" id=\"@FBI4v=cF~[^YM:l)qsT\"><field name=\"VAR\">按钮信息</field></block></value><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"9Wx{EE/@6Ene:g~jNDFi\"><field name=\"VAR\">名称</field></block></value><next><block type=\"fsm_send_message\" id=\"~*]$/Gej3Cn166OgfO{D\"><field name=\"TITLE\">初始化</field><value name=\"FSM\"><block type=\"local_variable_get\" id=\"|olRODSD|(!,OU^^{O;v\"><field name=\"VAR\">按钮</field></block></value><value name=\"ARG\"><block type=\"local_variable_get\" id=\"O7:k%%:y~;Z=fJTR5g7{\"><field name=\"VAR\">按钮信息</field></block></value><next><block type=\"method_return\" id=\"LRs$c+o/1e^VA|Im@AXr\"><mutation xmlns=\"\">%5B%22FSM%22%5D</mutation><value name=\"VALUE\"><block type=\"local_variable_get\" id=\"FJN;nz(;^J`CV):QpdrD\"><field name=\"VAR\">按钮</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>","comment":"函数","type":"function","name":"UI"}],"depends":[],"type":"src","typeLimit":"","comment":"","env":[],"name":"UI组件"}
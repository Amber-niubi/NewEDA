{"formatVersion":1,"fsms":[{"variables":[],"startState":0,"states":[{"type":"state","code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_event\" id=\"Q,4v.W@m7+fM6~e5%~|?\" x=\"149\" y=\"87\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"Start\" style=\"event_blocks\"></mutation><next><block type=\"text_print\" id=\"zW_x|7~)I-R]1Zdu+nVf\"><value name=\"TEXT\"><shadow type=\"text\" id=\"TbDFW}?L@`pK@f2EiNmK\"><field name=\"TEXT\">开始-敌人</field></shadow></value><next><block type=\"state_variables_set\" id=\"(!/am$/SVHBIj{^55t-N\"><field name=\"VAR\">d</field><value name=\"VALUE\"><block type=\"struct_load_from_dataset\" id=\"]}NsS%M9*#Q;lZ{]e~n!\"><field name=\"TYPE\">战斗.敌人</field><value name=\"ID\"><block type=\"math_integer\" id=\"8QALxtRsJ.?zkCTldO;q\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"text_print\" id=\"Z-sqd=uW6pXhY;^uz+VU\"><value name=\"TEXT\"><shadow type=\"text\" id=\"c}*nE|LZ$f#kW;~^l}yo\"><field name=\"TEXT\">开始-敌人</field></shadow><block type=\"struct_get_field\" id=\"bt)cPtB.dX-1Q.a~tq#O\"><field name=\"FIELD\">战斗.敌人:id/Integer</field><value name=\"DATA\"><block type=\"state_variables_get\" id=\"!HYu.Uvj~R@51y.brJ;K\"><field name=\"VAR\">d</field></block></value></block></value><next><block type=\"text_print\" id=\"[i27m{|3LFa@%kTfd{Bd\"><value name=\"TEXT\"><shadow type=\"text\" id=\"7B.UL21vKAik:A?{)}X4\"><field name=\"TEXT\">开始-敌人</field></shadow><block type=\"struct_get_field\" id=\"cetQvPuUUpo?aaQ7TK@5\"><field name=\"FIELD\">战斗.敌人:名称/String</field><value name=\"DATA\"><block type=\"state_variables_get\" id=\"]cRI=;a=gY7KrSl3jkcy\"><field name=\"VAR\">d</field></block></value></block></value><next><block type=\"text_print\" id=\"948dV#1]82HBVqlo?w7Y\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">开始-敌人</field></shadow><block type=\"struct_get_field\" id=\"j1dc~B/BVlFWm=bH`sSp\"><field name=\"FIELD\">战斗.敌人:属性/战斗.属性</field><value name=\"DATA\"><block type=\"state_variables_get\" id=\"X6Ewq/YaTw@]yXHSw`+q\"><field name=\"VAR\">d</field></block></value></block></value><next><block type=\"struct_set_field\" id=\"_K;d)m7z}8B|Pp=;J|9h\"><field name=\"FIELD\">战斗.敌人:名称/String</field><value name=\"DATA\"><block type=\"state_variables_get\" id=\"g/PhYRx)d#a3b0L--O)4\"><field name=\"VAR\">d</field></block></value><value name=\"VALUE\"><block type=\"text\" id=\"*qQL`uJ.Vp+925UjfL{(\"><field name=\"TEXT\">大熊猫</field></block></value><next><block type=\"state_variables_set\" id=\"l~O*xPh]]D}+a5nt`,X:\"><field name=\"VAR\">d1</field><value name=\"VALUE\"><block type=\"struct_load_from_dataset\" id=\"s6!S%vO#tVdFHinE!?hb\"><field name=\"TYPE\">战斗.敌人</field><value name=\"ID\"><block type=\"math_integer\" id=\"hmE4H/g!z8]Snvj}-:ub\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"text_print\" id=\"Uvz`39QPvW::mJ[}og1.\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">开始-敌人</field></shadow><block type=\"struct_get_field\" id=\"_v*~DWBknHq+BGDe@edl\"><field name=\"FIELD\">战斗.敌人:名称/String</field><value name=\"DATA\"><block type=\"state_variables_get\" id=\"$Q5zHGcf}-tJ[|oEKSR?\"><field name=\"VAR\">d1</field></block></value></block></value><next><block type=\"text_print\" id=\"0c;8ku7~Q#ZHTMj#a#:_\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">开始-敌人</field></shadow><block type=\"struct_get_field\" id=\"MG6V7*(IjWNhA*M8QZD-\"><field name=\"FIELD\">战斗.敌人:名称/String</field><value name=\"DATA\"><block type=\"state_variables_get\" id=\"nxK6|dKzIL8i$5/7@+Id\"><field name=\"VAR\">d</field></block></value></block></value><next><block type=\"change_state\" id=\"5`*~{rhAvh0D$}9-Tr#y\"><field name=\"VALUE\">状态_1</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>","comment":"状态","variables":[{"name":"d","type":"战斗.敌人","export":true},{"name":"aa","type":"Integer","export":true},{"name":"d1","type":"战斗.敌人","export":true}],"name":"状态"},{"type":"state","code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"on_event\" id=\"VqIKK1$KhM?9jo~z:Bd3\" x=\"16\" y=\"10\"><mutation xmlns=\"http://www.w3.org/1999/xhtml\" eventname=\"Start\" style=\"event_blocks\"></mutation></block></xml>","comment":"状态","variables":[],"name":"状态_1"}],"function":[],"comment":"状态机","name":"游戏逻辑_1","type":"fsm"}],"structs":[{"type":"struct","code":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"struct\" id=\"X^bQR%uoPJNml#UFi@*:\" x=\"0\" y=\"0\"><field name=\"NAME\">敌人</field><statement name=\"FIELDS\"><block type=\"struct_field\" id=\"!iWvrTqn!XF`D?6nCwqm\"><field name=\"NAME\">id</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"%9rLYa0{!ONVy`GN(R|m\"><field name=\"TYPE\">Integer</field></block></value><next><block type=\"struct_field\" id=\"96tcc(NNx^OTe;k^@,-F\"><field name=\"NAME\">名称</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\":(6pxwC*Ay|O7?/oDyM^\"><field name=\"TYPE\">String</field></block></value><next><block type=\"struct_field\" id=\"fXtD=[FQK1(oh0h?)uWi\"><field name=\"NAME\">属性</field><value name=\"TYPE\"><block type=\"struct_structs\" id=\"o~qn[`TGMb^o!%2$r})n\"><field name=\"TYPE\">战斗.属性</field></block></value></block></next></block></next></block></statement></block><block type=\"struct\" id=\"EvJ!+wWs:j2;B:Q:5TO(\" x=\"0\" y=\"141\"><field name=\"NAME\">属性</field><statement name=\"FIELDS\"><block type=\"struct_field\" id=\")VyBhvir7.DA;!u!L@AU\"><field name=\"NAME\">id</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"wST]:Vhk3gTr}gdiyB~Q\"><field name=\"TYPE\">Integer</field></block></value><next><block type=\"struct_field\" id=\"6lIT8jJd}hD;E*%l!}lz\"><field name=\"NAME\">初始生命值</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"w~ukuNmVi94SlKRq-JyS\"><field name=\"TYPE\">Integer</field></block></value></block></next></block></statement></block><block type=\"struct\" id=\"X;i:a|smyZR%9Nx9;9?i\" x=\"0\" y=\"251\"><field name=\"NAME\">关卡</field><statement name=\"FIELDS\"><block type=\"struct_field\" id=\":X}FF[4uiCbxINA^LQ.y\"><field name=\"NAME\">关卡id</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"i^@X37|s$7tDzKL(KI}x\"><field name=\"TYPE\">Integer</field></block></value><next><block type=\"struct_field\" id=\"j6P6mmD4w9j2CN{i#hok\"><field name=\"NAME\">关卡名称</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"23h/6+-sJ(;P}+xci$*C\"><field name=\"TYPE\">String</field></block></value><next><block type=\"struct_field\" id=\"%%TcGnwT}WDWec5EcRCa\"><field name=\"NAME\">位置</field><value name=\"TYPE\"><block type=\"struct_integer_map\" id=\";kO6=H[1CxU=.1S){?Ft\"><value name=\"TYPE\"><block type=\"struct_structs\" id=\",bK?+]trn@)L3CqSiPq,\"><field name=\"TYPE\">战斗.敌人配置</field></block></value></block></value></block></next></block></next></block></statement></block><block type=\"struct\" id=\"|YEbC;!S1BW8B2yK}Uu6\" x=\"0\" y=\"403\"><field name=\"NAME\">敌人配置</field><statement name=\"FIELDS\"><block type=\"struct_field\" id=\"B}8@H=^sSVnlE8b87(JS\"><field name=\"NAME\">自增id</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"*IEQ)M*.,VKmjx?Dn~-`\"><field name=\"TYPE\">Integer</field></block></value><next><block type=\"struct_field\" id=\",Ci)C6e`[Ea6b8LhW}2i\"><field name=\"NAME\">战斗.关卡</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"u];Q~Nw95f.4M-f:m,uJ\"><field name=\"TYPE\">Integer</field></block></value><next><block type=\"struct_field\" id=\"QA=A2I9,Bj,q|*9#`YCJ\"><field name=\"NAME\">敌人</field><value name=\"TYPE\"><block type=\"struct_structs\" id=\"pdRsv]#dSwp[vcvJ^8OB\"><field name=\"TYPE\">战斗.敌人</field></block></value><next><block type=\"struct_field\" id=\"IOIej$?%ljWXx,;+g?dv\"><field name=\"NAME\">等级</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"##0_uie+N?$4#;VT500N\"><field name=\"TYPE\">Integer</field></block></value><next><block type=\"struct_field\" id=\"oD1@J4/A@sx7!Y!z|Z]G\"><field name=\"NAME\">位置</field><value name=\"TYPE\"><block type=\"struct_base_type\" id=\"h3_98T9IN{]9vcsVp6ZW\"><field name=\"TYPE\">Integer</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></xml>","comment":"数据","name":"数据结构"}],"functions":[],"depends":[],"type":"src","typeLimit":"","comment":"","env":[],"name":"战斗","SN":"kseklqw0-hvoe7z57e3"}
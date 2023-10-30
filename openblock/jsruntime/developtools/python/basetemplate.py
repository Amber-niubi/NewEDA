#!/usr/bin/python
# -*- coding: UTF-8 -*-
#TEMPLATE_HEADER_START
#!/usr/bin/python
# -*- coding: UTF-8 -*-
# openblock.py
# version:0.1

#TEMPLATE_HEADER_END

#TEMPLATE_LIBRARY_START
import time
class VMInterruptException(Exception):
    pass

class ChangeStateException(VMInterruptException):
    pass

class FSMDestroyException(VMInterruptException):
    pass
class VMDestroyException(Exception):
    pass
class VMPausedException(Exception):
    def __init__(self,msg):
        self.message = msg
        self.stack = []

class OBUtils:
    @staticmethod
    def searchInsertPosition(list,compFunc) -> int:
        for i,v in enumerate(list):
            if(compFunc(v,i)):
                return i-1
        return -1

    @staticmethod
    def notNone(objLst,argLst,callbackA,callbackB=None) -> None:
        for obj in objLst:
            if obj is None:
                if callbackB is not None:
                    callbackB()
                return
        callbackA(objLst,argLst)

class VM:
    vmid=0
    def __init__(self,config={}):
        self.fsmid=0
        self.id=VM.vmid
        VM.vmid+=1
        self.logLevel = 5
        self.paused = None
        self.pausing = False
        self.Running = []
        self.RunningByID = {}
        self.Pending = []
        if('Output' not in config):
            config["Output"] = print
        if 'setTimeout' not in config:
            config["setTimeout"] = self.makeSetTimeout()
        self.config = config
        pass

    def makeSetTimeout(self):
        self.timers = []
        # cpython 3.3+
        if hasattr(time, 'monotonic'):
            self.timerFunc = time.monotonic
            self.timerScale = 1000
        # cpython 3.3-
        if hasattr(time, 'clock'):
            self.timerFunc = time.clock
            self.timerScale = 1000
        # micropython
        if hasattr(time, 'ticks_ms'):
            self.timerFunc = time.ticks_ms
            self.timerScale = 1
        # openBrother
        if hasattr(time, 'tick_ms'):
            self.timerFunc = time.tick_ms
            self.timerScale = 1
        return VM._setTimeout

    def _setTimeout(self,func,delay_ms):
        now = int(self.timerFunc()*self.timerScale)
        time = now + delay_ms
        t = time,func
        if(len(self.timers)==0):
            self.timers.append(t)
        elif(len(self.timers)==1):
            if(time<self.timers[0][0]):
                self.timers.append(t)
            else:
                self.timers.insert(0,t)
        else:
            idx = OBUtils.searchInsertPosition(self.timers,lambda v,i:t[0]>v[0])
            self.timers.insert(idx,t)
        pass


    def __str__(self):
        return type(self).__name__+':'+str(self.id)

    def pause(self):
        self.pausing=True
    
    def isRunning(self):
        return not self.paused
    
    def AddFSM(self,fsm,st,ofun):
        if(fsm == None):
            return None
        fsm.id=self.fsmid
        self.fsmid+=1
        self.Running.append(fsm)
        self.RunningByID[fsm.id]=fsm
        return fsm

    def AddPendingFSM(self,fsm):
        self.Pending.append(fsm)

    def getFsmByID(self,fsmID):
        return self.RunningByID[fsmID]

    def update(self):
        if(not self.isRunning()):
            return False
        try:
            self._HandlePendingFSM()
            if(self.timers is not None and len(self.timers)>0):
                now = int(self.timerFunc()*self.timerScale)
                while len(self.timers)>0:
                    t = self.timers[0]
                    if t[0] <= now:
                        self.timers.pop(0)
                        t[1]()
                    else:
                        break
        except VMPausedException as vmp:
            self.paused = vmp
            raise vmp
        except VMDestroyException as vmd:
            raise vmd
        return True
    
    def DestroyFSM(self,fsm)->None:
        pass

    def _HandlePendingFSM(self):
        while len(self.Pending)>0:
            fsm = self.Pending.pop(0)
            if fsm is not None:
                fsm.HandleAllMessages()

    def Schedule(self,millisecond, callback):
        self.config["setTimeout"](self,callback,millisecond)

class FSM:
    def __init__(self,vm,startState,st=None,ofun=None) -> None:
        self.Running = True
        self.OnDestroyedCallbacks=[]
        self.StateStack=[]
        self.Inbox=[]
        self.PrioritizedInbox=[]
        self.id=-1
        self.vm=vm
        vm.AddFSM(self,st,ofun)
        self.ChangeState(startState,None)
        
    def OnDestroyed(self,f):
        self.OnDestroyedCallbacks.append(f)
        
    def OffDestroyed(self,f):
        try:
            self.OnDestroyedCallbacks.remove(f)
        except ValueError:
            pass

    def Destroy(self):
        #self.VariableGroup = None
        self.CurrentState = None
        self.Inbox.clear()
        self.StateStack.clear()
        self.PrioritizedInbox.clear()
        self.vm.DestroyFSM(self)
        self.Running = False
        for f in self.OnDestroyedCallbacks:
            f(self)

    def __str__(self):
        return self.vm.__str__()+"/"+type(self).__name__+":"+str(self.id)

    def HandleAllMessages(self):
        if (self.CurrentState is None) :
            return
        
        while len(self.PrioritizedInbox)>0 or len(self.Inbox)>0:
            while len(self.PrioritizedInbox)>0:
                msg = self.PrioritizedInbox.pop(0)
                msg.Handle(self.CurrentState)
            
            if len(self.Inbox)>0:
                msg = self.Inbox.pop(0)
                msg.Handle(self.CurrentState)


    def PostPrioritizedMessage(self,msg) :
        if (self.PrioritizedInbox is None) :
            return
        
        self.PrioritizedInbox.append(msg)
        self.vm.AddPendingFSM(self)
        
    def PostMessage(self,msg) :
        if (not self.Running) :
            return
        
        if (self.Inbox is None) :
            return
        
        self.Inbox.append(msg)
        self.vm.AddPendingFSM(self)


    def ChangeState(self,nextStateClass, ofun):
        if (self.vm is None):
            return
        self.CurrentState = nextStateClass(self)
        self.PostPrioritizedMessage( EventMessage("Start", None, None, self))

    def PushState(self,nextStateName, f) :
        self.StateStack.append(self.CurrentState)
        self.ChangeState(nextStateName, f)

    def PopState(self,f) :
        self.CurrentState = self.StateStack.pop()
        self.PostPrioritizedMessage( EventMessage("Restore", None, None, self))


class State:
    def __init__(self,fsm) -> None:
        self.fsm=fsm

    def __str__(self):
        return self.fsm.__str__() +'/'+type(self).__name__

    def HandleMessage(self,umsg):
        funcname = 'messagehandler_'+umsg.name+'_'+umsg.argType
        func = getattr(self,funcname,None)
        if func is not None:
            func(umsg)
        pass

    def HandleEvent(self,emsg):
        funcname = 'eventhandler_'+emsg.name+'_'+emsg.argType
        func = getattr(self,funcname,None)
        if func is not None:
            func(emsg)
        pass


class OBStructValue:
    pass

class Message:
    def __init__(self,name, arg=None, argType=None, sender=None):
        self.name = name
        self.arg = arg
        self.argType = type(arg).__name__ if argType is None else argType.__name__
        if self.argType == 'OBStructValue':
            self.argType = arg.Def.Name
            if ( not arg.isReadOnly()):
                self.arg = arg.deepClone(True, [])
        self.sender = sender

    def GetArgType(self):
        return self.argType

    def __str__(self) -> str:
        return type(self).__name__+':'+self.name+'('+self.argType+')'

class EventMessage(Message): 
    def Handle(self , state):
        try :
            state.HandleEvent(self)
        except VMInterruptException:
            pass

class UserMessage (Message): 
    def Handle(self,state) :
        try :
            state.HandleMessage(self)
        except VMInterruptException:
            pass
#TEMPLATE_LIBRARY_END

'''
#TEMPLATE_IMPORT_START
import LIBNAME
#TEMPLATE_IMPORT_END
'''

#TEMPLATE_MODULE_HEADER_START
# MODULE
#TEMPLATE_MODULE_HEADER_END

#TEMPLATE_FSM_HEADER_START
class MODULE_FSMNAME(FSM):
    def __init__(self,vm,st=None,ofun=None) -> None:
        super(MODULE_FSMNAME,self).__init__(vm,MODULE_FSMNAME_STATENAME,st,ofun)
#TEMPLATE_FSM_HEADER_END

#TEMPLATE_FSM_VAR_START
        self.USR_VAR="VALUE"
#TEMPLATE_FSM_VAR_END

#TEMPLATE_FSM_TAIL_START
        pass
#TEMPLATE_FSM_TAIL_END

#TEMPLATE_STATE_HEADER_START
class MODULE_FSMNAME_STATENAME(State):
    def __init__(self, fsm) -> None:
        super().__init__(fsm)
#TEMPLATE_STATE_HEADER_END

#TEMPLATE_STATE_VAR_START
        self.USR_VAR="VALUE"
#TEMPLATE_STATE_VAR_END

#TEMPLATE_STATE_TAIL_START
        pass
#TEMPLATE_STATE_TAIL_END

#TEMPLATE_STATE_EVENT_HEADER_START
    def eventhandler_EVENTNAME_ARGTYPE(self,emsg):
#TEMPLATE_STATE_EVENT_HEADER_END

#TEMPLATE_LOCAL_VARIABLE_START
        USR_VAR="VALUE"
#TEMPLATE_LOCAL_VARIABLE_END

        '''
#TEMPLATE_INST_FUNCCALL_START
        FUNCCALL
#TEMPLATE_INST_FUNCCALL_END
'''

#TEMPLATE_STATE_EVENT_TAIL_START
        pass
#TEMPLATE_STATE_EVENT_TAIL_END


#TEMPLATE_STATE_MSG_HEADER_START
    def messagehandler_MEGTITLE_ARGTYPE(self,emsg):
#TEMPLATE_STATE_MSG_HEADER_END

#TEMPLATE_STATE_MSG_TAIL_START
        pass
#TEMPLATE_STATE_MSG_TAIL_END

    def eventhandler_Start_NoneType(self,emsg):
        '''
#TEMPLATE_INST_LOG_START
        self.fsm.vm.config["Output"](EXPR)
#TEMPLATE_INST_LOG_END
        '''
        '''
#TEMPLATE_INST_FSMSendMessageWait_START
        OBUtils.notNone([TARGET,TITLE],[BODY,WAIT],lambda ol,al:self.fsm.vm.Schedule(al[1],lambda:ol[0].PostMessage(UserMessage(ol[1],al[0],None,self.fsm))))
#TEMPLATE_INST_FSMSendMessageWait_END
        '''
        '''
#TEMPLATE_INST_FSMSendMessage_START
        OBUtils.notNone([TARGET,TITLE],[BODY],lambda ol,al:ol[0].PostMessage(UserMessage(ol[1],al[0],None,self.fsm)))
#TEMPLATE_INST_FSMSendMessage_END
        '''
        print(emsg)

    def messagehandler_测试_NoneType(self,emsg):
        print(emsg)
        print(emsg.arg)

    def messagehandler_测试_str(self,emsg):
        print(emsg)
        print(emsg.arg)

    def messagehandler_测试_int(self,emsg):
        print(emsg)
        print(emsg.arg)


class MODULE_FSM1_STATE1(State):
    def __init__(self, fsm) -> None:
        super().__init__(fsm)
        self.USR_VAR="VALUE"
        pass
'''
#TEMPLATE_RUN_START
vm = VM()
fsm = MODULE_FSMNAME(vm)
while True:
    time.sleep(0.000001)
    vm.update()
#TEMPLATE_RUN_END
'''

#TEMPLATE_INIT_START
#TEMPLATE_INIT_END

vm = VM()
fsm = MODULE_FSMNAME(vm)
fsm.PostMessage(UserMessage("测试","测试开始",None,None))
fsm.PostMessage(UserMessage("测试",None,None,None))
fsm.PostMessage(UserMessage("测试",15,None,None))
fsm.PostMessage(UserMessage("测试",True,None,None))
fsm.PostMessage(UserMessage("测试","测试成功",str,None))
print(fsm)
print(fsm.CurrentState)
for i in range(10):
    vm.update()

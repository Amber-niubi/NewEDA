
# @license
# Copyright 2021 Du Tian Wei
# SPDX-License-Identifier: Apache-2.0
# 
# openblock.py
# version:0.1

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


class VM:
    vmid=0
    def __init__(self):
        self.fsmid=0
        self.id=VM.vmid
        VM.vmid+=1
        self.logLevel = 5
        self.paused = None
        self.pausing = False
        self.Running = []
        self.RunningByID = {}
        self.Pending = []
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
        except VMPausedException as vmp:
            self.paused = vmp
            raise vmp
        except VMDestroyException as vmd:
            raise vmd
        return True

    def _HandlePendingFSM(self):
        while len(self.Pending)>0:
            fsm = self.Pending.pop(0)
            if fsm is not None:
                fsm.HandleAllMessages()

class FSM:
    def __init__(self,vm,startState,st=None,ofun=None) -> None:
        self.Running = True
        self.OnDestroyedCallbacks=[]
        self.StateStack = []
        self.Inbox = []
        self.PrioritizedInbox = []
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
        self.VariableGroup = None
        self.CurrentState = None
        self.Inbox.length = 0
        self.StateStack.length = 0
        self.PrioritizedInbox = []
        self.vm.DestroyFSM(self)
        self.Running = False
        for f in self.OnDestroyedCallback:
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
        self.argType = type(arg).__name__ if argType is None else argType.__name__
        self.sender = sender
        if ( isinstance(arg,OBStructValue) and not arg.isReadOnly()):
            self.arg = arg.deepClone(True, [])
        else:
            self.arg = arg

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

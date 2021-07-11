start -> template | template __ module

linear -> __ module | null

2Branches ->  _ "(" innerModule ")" _ "(" innerModule ")" 

3Branches -> _ "(" innerModule ")" _ "(" innerModule ")" _ "(" innerModule ")"

innerModule -> _ module _ | _

_ -> [ ]:*

__ -> " " 

# Insert position of new templates or modules

template -> 
    "BasicTemplate" |
    "OnStartTemplate" |
    "OnPauseTemplate"

module ->
    "ImeiSource" linear |
    "AliasingSanitizerBridge" linear |
    "AsyncTaskBridge" linear |
    "ArraySanitizerBridge" linear |
    "BluetoothDetectionBridge" linear |
    "ButtonCallbackBridge" linear |
    "DatacontainerBridge" linear |
    "IccGlobalFieldBridge" linear |
    "ListCloneBridge" linear |
    "Obfuscation1Bridge" linear |
    "Obfuscation2Bridge" linear |
    "PauseResumeLifecycleBridge" linear |
    "PublicApiPointBridge" linear |
    "Reflection1Bridge" linear |
    "ReflectionMethod1Bridge" linear |
    "ReflectionMethod1NonSink" linear |
    "SimpleIccBridge" linear |
    "SimpleRecursionBridge" linear |
    "SimpleSanitizationBridge" linear |
    "SimpleUnreachableBridge" linear |
    "SmsSink" linear |
    "ImplicitSmsSink" linear |
    "LogSink" linear |
    "ListBridge" linear |
    "AppendToStringBridge" linear |
    "ArrayBridge" linear |
    "ArrayExampleBridge" linear |
    "StringBufferBridge" linear |
    "RandomIfElseBridge" 2Branches



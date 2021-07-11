// "BasicTemplate ImeiSource RandomIfElseBridge ( SmsSink ) ( LogSink )"
const tmc = {
    config: 'BasicTemplate ImeiSource RandomIfElseBridge ( SmsSink ) ( LogSink )',
    unobfuscated: true,
    uncompiled: true,
    afterParsing: {
        module: 'ImeiSource',
        children: [
            {
                module: 'RandomIfElseBridge',
                children: [
                    { module: 'SmsSink', children: [] },
                    { module: 'LogSink', children: [] }
                ]
            }
        ]
    },
    afterPreprocessing: {
        module: 'ImeiSource',
        children: [
            {
                module: 'RandomIfElseBridge',
                children: [
                    {
                        module: 'SmsSink',
                        children: [],
                        parentId: 1,
                        childId: 0,
                        type: 'SINK',
                        flows: [
                            {
                                className: '',
                                methodSignature: '',
                                statementSignature: 'android.telephony.SmsManager: void sendTextMessage(java.lang.String,java.lang.String,java.lang.String,android.app.PendingIntent,android.app.PendingIntent)',
                                leaking: true,
                                reachable: true
                            }
                        ],
                        id: 2
                    },
                    {
                        module: 'LogSink',
                        children: [],
                        parentId: 1,
                        childId: 1,
                        type: 'SINK',
                        flows: [
                            {
                                className: '',
                                methodSignature: '',
                                statementSignature: 'android.util.Log: int i(java.lang.String,java.lang.String)',
                                leaking: true,
                                reachable: true
                            }
                        ],
                        id: 3
                    }
                ],
                parentId: 0,
                childId: 0,
                type: 'BRIDGE',
                flows: [
                    {
                        className: '',
                        methodSignature: '',
                        statementSignature: '',
                        leaking: true,
                        reachable: true
                    },
                    {
                        className: '',
                        methodSignature: '',
                        statementSignature: '',
                        leaking: true,
                        reachable: true
                    }
                ],
                id: 1
            }
        ],
        type: 'SOURCE',
        flows: [
            {
                className: '',
                methodSignature: '',
                statementSignature: 'android.telephony.TelephonyManager: java.lang.String getDeviceId()',
                leaking: true,
                reachable: true
            }
        ],
        id: 0
    },
    afterFlowProcessing: {
        module: 'ImeiSource',
        children: [
            {
                module: 'RandomIfElseBridge',
                children: [
                    {
                        module: 'SmsSink',
                        children: [],
                        parentId: 1,
                        childId: 0,
                        type: 'SINK',
                        flows: [
                            {
                                className: 'MainActivity',
                                methodSignature: 'void onCreate(android.os.Bundle)',
                                statementSignature: 'android.telephony.SmsManager: void sendTextMessage(java.lang.String,java.lang.String,java.lang.String,android.app.PendingIntent,android.app.PendingIntent)',
                                leaking: true,
                                reachable: true
                            }
                        ],
                        id: 2
                    },
                    {
                        module: 'LogSink',
                        children: [],
                        parentId: 1,
                        childId: 1,
                        type: 'SINK',
                        flows: [
                            {
                                className: 'MainActivity',
                                methodSignature: 'void onCreate(android.os.Bundle)',
                                statementSignature: 'android.util.Log: int i(java.lang.String,java.lang.String)',
                                leaking: true,
                                reachable: true
                            }
                        ],
                        id: 3
                    }
                ],
                parentId: 0,
                childId: 0,
                type: 'BRIDGE',
                flows: [
                    {
                        className: 'MainActivity',
                        methodSignature: 'void onCreate(android.os.Bundle)',
                        statementSignature: '',
                        leaking: true,
                        reachable: true
                    },
                    {
                        className: 'MainActivity',
                        methodSignature: 'void onCreate(android.os.Bundle)',
                        statementSignature: '',
                        leaking: true,
                        reachable: true
                    }
                ],
                id: 1
            }
        ],
        type: 'SOURCE',
        flows: [
            {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.TelephonyManager: java.lang.String getDeviceId()',
                leaking: true,
                reachable: true
            }
        ],
        id: 0
    },
    sourceSinkConnections: [
        {
            from: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.TelephonyManager: java.lang.String getDeviceId()',
                leaking: true,
                reachable: true,
                id: 0
            },
            to: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.SmsManager: void sendTextMessage(java.lang.String,java.lang.String,java.lang.String,android.app.PendingIntent,android.app.PendingIntent)',
                leaking: true,
                reachable: true,
                id: 2
            }
        },
        {
            from: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.TelephonyManager: java.lang.String getDeviceId()',
                leaking: true,
                reachable: true,
                id: 0
            },
            to: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.util.Log: int i(java.lang.String,java.lang.String)',
                leaking: true,
                reachable: true,
                id: 3
            }
        }
    ],
    allConnections: [
        {
            from: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.TelephonyManager: java.lang.String getDeviceId()',
                leaking: true,
                reachable: true,
                id: 0
            },
            to: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.SmsManager: void sendTextMessage(java.lang.String,java.lang.String,java.lang.String,android.app.PendingIntent,android.app.PendingIntent)',
                leaking: true,
                reachable: true,
                id: 2
            }
        },
        {
            from: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.TelephonyManager: java.lang.String getDeviceId()',
                leaking: true,
                reachable: true,
                id: 0
            },
            to: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.util.Log: int i(java.lang.String,java.lang.String)',
                leaking: true,
                reachable: true,
                id: 3
            }
        }
    ]
};


module.exports = tmc;
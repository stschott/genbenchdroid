// "BasicTemplate RandomIfElseBridge ( ) ( ImeiSource SmsSink )"
const tmc = {
    config: 'BasicTemplate RandomIfElseBridge ( ) ( ImeiSource SmsSink )',
    unobfuscated: true,
    uncompiled: true,
    afterParsing: {
        module: 'RandomIfElseBridge',
        children: [
            { module: 'empty', children: [] },
            {
                module: 'ImeiSource',
                children: [{ module: 'SmsSink', children: [] }]
            }
        ]
    },
    afterPreprocessing: {
        module: 'RandomIfElseBridge',
        children: [
            { module: 'empty', children: [], parentId: 0, childId: 0 },
            {
                module: 'ImeiSource',
                children: [
                    {
                        module: 'SmsSink',
                        children: [],
                        parentId: 2,
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
                        id: 3
                    }
                ],
                parentId: 0,
                childId: 1,
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
                id: 2
            }
        ],
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
        id: 0
    },
    afterFlowProcessing: {
        module: 'RandomIfElseBridge',
        children: [
            { module: 'empty', children: [], parentId: 0, childId: 0 },
            {
                module: 'ImeiSource',
                children: [
                    {
                        module: 'SmsSink',
                        children: [],
                        parentId: 2,
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
                        id: 3
                    }
                ],
                parentId: 0,
                childId: 1,
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
                id: 2
            }
        ],
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
                id: 2
            },
            to: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.SmsManager: void sendTextMessage(java.lang.String,java.lang.String,java.lang.String,android.app.PendingIntent,android.app.PendingIntent)',
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
                id: 2
            },
            to: {
                className: 'MainActivity',
                methodSignature: 'void onCreate(android.os.Bundle)',
                statementSignature: 'android.telephony.SmsManager: void sendTextMessage(java.lang.String,java.lang.String,java.lang.String,android.app.PendingIntent,android.app.PendingIntent)',
                leaking: true,
                reachable: true,
                id: 3
            }
        }
    ]
};


module.exports = tmc;
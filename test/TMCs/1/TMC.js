// "BasicTemplate ImeiSource ArrayExampleBridge SmsSink"
const tmc = {
    config: 'BasicTemplate ImeiSource ArrayExampleBridge SmsSink',
    unobfuscated: true,
    uncompiled: true,

    afterParsing: {
        module: 'ImeiSource',
        children: [
            {
                module: 'ArrayExampleBridge',
                children: [{ module: 'SmsSink', children: [] }]
            }
        ]
    },

    afterPreprocessing: {
        module: 'ImeiSource',
        children: [
            {
                module: 'ArrayExampleBridge',
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
                module: 'ArrayExampleBridge',
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
        }
    ]
};

module.exports = tmc;
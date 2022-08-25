class FlowProcessor {
    templateClassName = '';
    templateMethodSignature = '';

    constructor(template) {
        this.templateClassName = template.className;
        this.templateMethodSignature = template.methodSignature;
    }

    processFlows(ref, leaking = true, reachable = true, className=this.templateClassName, methodSignature=this.templateMethodSignature) {
        let currentLeaking = leaking;
        let currentReachable = reachable;
        if (!!ref && ref.module !== 'empty') {
            ref.flows?.forEach(flow => {
                if (!flow.className) {
                    flow.className = className;
                }
                if (!flow.methodSignature) {
                    flow.methodSignature = methodSignature;
                }

                if (reachable && !flow.reachable) {
                    currentReachable = false;
                }
                if (leaking && !flow.leaking) {
                    currentLeaking = false;
                }
                if (currentReachable && ref.type.toLowerCase() === 'source') {
                    currentLeaking = flow.leaking;
                } 
                
                flow.reachable = currentReachable;
                flow.leaking = currentLeaking;
            });
        }

        ref.children.forEach((child, idx) => {
            if (child.module !== 'empty') {
                this.processFlows(child, ref.flows[idx].leaking, ref.flows[idx].reachable, ref.flows[idx].className, ref.flows[idx].methodSignature);
            }
        });
    }
    
    getSourceSinkConnections(ref, connections = [], sources = [], idx = 0) {
        let currentSources = [...sources];
        if (!!ref && ref.module != 'empty') {
            // sanitization
            if (currentSources.length > 0 && !ref.flows[0].leaking) {
                // need to create new object, as manipulation of old one will change module in other branches
                currentSources[currentSources.length - 1] = {
                    ...currentSources[currentSources.length - 1],
                    leaking: false
                };
            }

            if (ref.type && ref.type.toLowerCase() === 'source') {
                currentSources.push({ ...ref.flows[0], id: ref.id });
            } else if (ref.type && ref.type.toLowerCase() === 'sink' && currentSources.length > 0) {
                // changed idx to 0
                currentSources.forEach((source, id) => {
                    // only the last source of the branch leaks data
                    let pathLeaking = false;
                    if (id === (currentSources.length - 1)) {
                        pathLeaking = ref.flows[0].leaking && source.leaking;
                    } 
                    connections.push({ from: source, to: { ...ref.flows[0], id: ref.id, leaking: pathLeaking } });
                });
            }

            ref.children.forEach((child, idx) => {
                this.getSourceSinkConnections(child, connections, currentSources, idx);
            });
        }
        
        return connections;
    }

    getAllConnections(ref, connections = [], parentFlow = null) {
        if (!!ref) {
            if (parentFlow && ref.flows && ref.flows.length > 0) {
                ref.flows.forEach(flow => {
                    if (flow.statementSignature) {
                        // only the last source of the branch leaks data
                        let pathLeaking = parentFlow.leaking && flow.leaking;
                        if (ref.type.toLowerCase() === 'source') {
                            pathLeaking = false;
                        }
                        connections.push({ from: parentFlow, to: { ...flow, id: ref.id, leaking: pathLeaking } });
                    }
                });
            }

            ref.children.forEach((child, idx) => {
                let parentFlowNew = ref.flows[idx].statementSignature ? { ...ref.flows[idx], id: ref.id } : parentFlow;
                if (parentFlow && ref.type.toLowerCase() !== 'source') {
                    parentFlowNew = {
                        ...parentFlowNew,
                        leaking: parentFlow.leaking && ref.flows[idx].leaking
                    };
                }
                
                this.getAllConnections(child, connections, parentFlowNew);
            });
        }
        
        return connections;
    }
}

module.exports = FlowProcessor;
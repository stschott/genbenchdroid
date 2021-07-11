const util = require('util');

const parseTree = (config) => {
    const moduleConfiguration = [...config];
    let tree = {
        module: moduleConfiguration[0],
        children: []
    };

    _clearTodos(tree, moduleConfiguration.slice(1));
    _checkChildren(tree);

    return tree;

}

const BFS = (ref, callback) => {
    let counter = 0;
    let q = [];
    let explored = new Set();
    q.push(ref);

    explored.add(ref);

    while (q.length > 0) {
        let t = q.shift();

        callback(t, counter);
        counter++;
        t.children.filter(n => !explored.has(n)).forEach(n => {
            explored.add(n);
            q.push(n);
        });
    }
};

const logTree = (tree) => {
    console.log(util.inspect(tree, false, null, true));
};

const _assignDepth = (ref, depth) => {
    if (ref.children) {
        ref.depth = depth;
        ref.children.forEach(child => {
            _assignDepth(child, depth+1);
        });
    }
} 


const _clearTodos = (ref, config) => {
    let parenCounter = 0;
    let startIndex = -1;
    for (let i = 0; i < config.length; i++) {

        if (config[i] === '(' && config[i+1] === ')' && parenCounter === 0) {
            ref.todos ? ref.todos.push(['empty']) : ref.todos = [['empty']];
            i++;
            continue;
        }

        if (config[i] === 'empty') {
            ref.children.push({ module: 'empty', children: [] });
        } else if (config[i] !== '(' && config[i] !== ')' && startIndex === -1) {
            ref.children.push({ module: config[i], children: [] });
            ref = ref.children[ref.children.length-1];
        } else if (config[i] === '(') {
            parenCounter++;
            if (startIndex === -1) {
                startIndex = i;
            }
        } else if (config[i] === ')') {
            parenCounter--;
            if (parenCounter === 0 && startIndex !== -1) {
                ref.todos ? ref.todos.push(config.slice(startIndex+1, i)) : ref.todos = [config.slice(startIndex+1, i)];
                startIndex = -1;
            }
        } 
    }
};

const _checkChildren = (ref) => {
    // check provdided reference for remaining todos
    if (ref.todos && ref.todos.length > 0) {
        ref.todos.forEach(todo => {
            _clearTodos(ref, todo);
        });
        delete ref.todos;
        if (ref.children.length > 0 && ref.children.filter(item => item.todos && item.todos.length > 0)) {
            _checkChildren(ref);
        }
    }

    // check children afterwards
    ref.children.forEach(child => {
        if (child.children.length > 0) {
            _checkChildren(child);
        }  

        if (child.todos && child.todos.length > 0) {
            child.todos.forEach(todo => {
                _clearTodos(child, todo);
            });
            delete child.todos;
            if (child.children.length > 0 && child.children.filter(item => item.todos && item.todos.length > 0)) {
                _checkChildren(child);
            }
        }
    });
};

module.exports = {
    parseTree,
    BFS,
    logTree
};

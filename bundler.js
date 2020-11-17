const fs = require('fs');
const babylon = require('babylon');
const path = require('path');
const traverse = require('babel-traverse').default;
const babel = require('babel-core');

let ModuleID = 0;

const createAsset = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');

    const ast = babylon.parse(content, {
        sourceType: 'module',
    })

    const dependencies = [];


    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            dependencies.push(node.source.value);
        },
    });

    ModuleID += 1;
    const id = `js_${ModuleID}`;
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['env'],
    });

    return {
        id,
        filename,
        dependencies,
        code,
    };
};

const createGraph = (entry) => {
    const mainAsset = createAsset(entry);

    const queue = [mainAsset];

    for (const asset of queue) {
        const dirname = path.dirname(asset.filename);

        asset.mapping = {};

        asset.dependencies.forEach((relativePath) => {
            const absolutePath = path.join(dirname, relativePath);

            const child = createAsset(absolutePath);

            asset.mapping[relativePath] = child.id;

            queue.push(child);
        });
    }

    return queue;
}

const bundle = (graph) => {

    let modules = '';


    graph.forEach((mod) => {
        modules += `${mod.id}: [
            function (require, module, exports) {
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)},
        ],`
    })

    const result = `
        (function (modules) {
            function require(id) {
                const [fn, map] = modules[id];

                function localRequire(relativePath) {
                    return require(map[relativePath]);
                }

                const module = {
                    exports: {}
                };

                fn(localRequire, module, module.exports);

                return module.exports;
            }
            require('js_1');
        })({${modules}});
    `;

    return result;
}

const graph = createGraph('./test/entry.js');
const result = bundle(graph);

console.log(result);
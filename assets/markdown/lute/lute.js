'use strict';

const WASM_URL = '/assets/markdown/lute/lute.wasm';
let wasm;

async function _luteinit() {
    const go = new Go(); // Defined in wasm_exec.js

    await WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then((obj)=>{
        wasm = obj.instance;
        go.run(wasm);
    })

    console.log(go.importObject);
    console.log('wasm loaded');
}

const luteinit = _luteinit();


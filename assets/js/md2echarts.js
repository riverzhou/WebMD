"use strict";

let showInfo = document.getElementById("debug-info");

function printf(info) {
    showInfo.value += `${info}\n`;
    showInfo.scrollTop = showInfo.scrollHeight;
}

function renderEchartsList(codeBlock){
    printf(`total echart block number ${codeBlock.length}`);
    for (let i = 0; i < codeBlock.length; i++) {
        let bincode;
        let block = codeBlock[i];

        if (block.tagName != "CODE"){
            continue;
        }

        try {
            bincode = JSON5.parse(block.innerHTML);
        } catch (e) {
            printf(block.innerHTML);
            printf(e);
            continue;
        }

        let canvas = document.createElement("div");
        canvas.className = "echarts-canvas";
        block.parentNode.parentNode.insertBefore(canvas,block.parentNode);

        try {
            echarts.init(canvas).setOption(bincode);
            block.parentNode.style.display = "none";
        } catch (e) {
            block.parentNode.parentNode.removeChild(canvas);
            printf(e);
        }

        printf(`render echarts ${i} ok!`)
    }
}

function renderEcharts() {
    let codeBlock = document.getElementsByClassName("language-echart");
    renderEchartsList(codeBlock);
    let codeBlock2 = document.getElementsByClassName("language-echarts");
    renderEchartsList(codeBlock2);
}

renderEcharts();

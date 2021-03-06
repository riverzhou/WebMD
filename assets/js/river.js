'use strict';

let btnNew = document.getElementById('btnNew');
let btnLoad = document.getElementById('btnLoad');
let btnSave = document.getElementById('btnSave');
let btnSaveAs = document.getElementById('btnSaveAs');
let btnView = document.getElementById('btnView');
let btnDebug = document.getElementById('btnDebug');
let article = document.getElementById('article-text');
let divCM = document.getElementById('codemirror');

let app = {
    appName: "K.I.S.S Editor",
    Type: "md",
};

let pickerOpts = {
    types: [
        {
            description: 'Markdown',
            accept: {
                'text/plain': ['.md']
            }
        },
        {
            description: 'HTML',
            accept: {
                'text/html': ['.html']
            }
        },
        {
            description: 'JSON',
            accept: {
                'text/json': ['.json']
            }
        },
    ],
    excludeAcceptAllOption: true,
    multiple: false
};

let turnOpts = {
    headingStyle: 'atx',
    hr: '---',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
}
let turn = new TurndownService();
turn.remove('style');
turn.remove('script');

btnDebug.onclick = function () {
    let debugArea = document.getElementById("debug-info");
    if (debugArea.style.display != "none") {
        debugArea.style.display = "none";
    } else {
        debugArea.style.display = "inline-block";
    }
}

btnNew.onclick = async function () {
    printf('btn New');
    app.Text = ''
    app.FileHandle = undefined;
    app.FileName = '';
    app.Type = '';
    app.Modified = false;
    app.Focus = true;
    document.title = app.appName;
    article.innerHTML = app.Text;
}

btnLoad.onclick = async function () {
    printf('btn Load');

    let fileHandle;
    let file;

    try {
        fileHandle = await window.showOpenFilePicker(pickerOpts).then((handles) => handles[0]);
    } catch (ex) {
        if (ex.name === 'AbortError') {
            printf("用户放弃读文件");
            return;
        }
        const msg = 'An error occured trying to open the file.';
        printf(msg + ex);
    }

    if (!fileHandle) {
        return;
    }
    printf('开始加载文件');

    file = await fileHandle.getFile();

    printf('加载文件完成');

    try {
        app.Text = await file.text();
        app.FileHandle = fileHandle;
        app.FileName = file.name;
        app.Type = file.name.split('.').pop();
        app.Modified = false;
        app.Focus = true;
    } catch (ex) {
        const msg = `An error occured reading ${app.FileName}`;
        printf(msg + ex);
    }

    printf(`文件类型 ${app.Type}`);
    if (app.Type == "html" || app.Type == 'htm' || app.Type == "shtml") {
        app.Text = turn.turndown(app.Text);
    }

    document.title = app.FileName;

    cm.dispatch({
        changes: { from: 0, to: cm.state.doc.length, insert: app.Text }
    });
}

btnSave.onclick = async function () {
    printf('btn Save')
    if (app.FileHandle) {
        return;
    }
    printf('btn Save, no Current File, use SaveAs')

    let fileHandle;

    try {
        fileHandle = await window.showSaveFilePicker(pickerOpts).then((handles) => handles[0]);;
    } catch (ex) {
        if (ex.name === 'AbortError') {
            printf("用户放弃写文件");
            return;
        }
        const msg = 'An error occured trying to open the file.';
        printf(msg + ex);
    }

    if (!fileHandle) {
        return;
    }
}

btnSaveAs.onclick = async function () {
    printf('btn SaveAs')

    let fileHandle;

    try {
        fileHandle = await window.showSaveFilePicker(pickerOpts).then((handles) => handles[0]);;
    } catch (ex) {
        if (ex.name === 'AbortError') {
            printf("用户放弃写文件");
            return;
        }
        const msg = 'An error occured trying to open the file.';
        printf(msg + ex);
    }

    if (!fileHandle) {
        return;
    }
}

btnView.onclick = async function () {
    printf('btn View');
    if (article.style.display != "none") {
        article.style.display = "none";
        divCM.style.display = "block";
        return;
    }

    article.style.display = "block";
    divCM.style.display = "none";

    app.Text = cm.state.doc.toString();

    if (app.Type == "md" || app.Type == "json") {
        article.innerHTML = Md2Html(app.Text);
        Prism.highlightAll();
        renderEcharts();
    } else if (app.Type == "html" || app.Type == 'htm' || app.Type == "shtml") {
        app.Text = turn.turndown(app.Text);
        article.innerHTML = Md2Html(app.Text);
        Prism.highlightAll();
        renderEcharts();
    } else if (app.Type == 'txt' || app.Type == "text") {
        article.innerHTML = `<pre>${app.Text}</pre>`;
    }
}

document.title = app.appName;

cm.dispatch({
    changes: { from: 0, to: cm.state.doc.length, insert: "# I am K.I.S.S Markdown\n" }
});

article.style.display = "none";
divCM.style.display = "block";

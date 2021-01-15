'use strict';

let btnNew = document.getElementById('btnNew');
let btnLoad = document.getElementById('btnLoad');
let btnSave = document.getElementById('btnSave');
let btnSaveAs = document.getElementById('btnSaveAs');
let btnView = document.getElementById('btnView');
let article = document.getElementById('article-text');

let app = {
    appName: 'River Editor',
};

btnNew.onclick = async function (e) {
    printf('btn New');
    app.Text = ''
    app.FileHandle = undefined;
    app.FileName = '';
    app.Modified = false;
    app.Focus = true;
    article.innerHTML = app.Text;
}

btnLoad.onclick = async function (e) {
    printf('btn Load');

    let fileHandle;
    let file;

    try {
        fileHandle = await window.showOpenFilePicker().then((handles) => handles[0]);
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
        app.Modified = false;
        app.Focus = true;
    } catch (ex) {
        const msg = `An error occured reading ${app.FileName}`;
        printf(msg + ex);
    }

    article.innerHTML = app.Text;
}

btnSave.onclick = async function (e) {
    printf('btn Save')
    if (app.FileHandle) {
        return;
    }
    printf('btn Save, no Current File, use SaveAs')

    let fileHandle;

    try {
        fileHandle = await window.showSaveFilePicker().then((handles) => handles[0]);;
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

btnSaveAs.onclick = async function (e) {
    printf('btn SaveAs')

    let fileHandle;

    try {
        fileHandle = await window.showSaveFilePicker().then((handles) => handles[0]);;
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

btnView.onclick = async function (e) {
    printf('btn View');
}

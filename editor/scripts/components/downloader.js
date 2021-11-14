'use strict';

import {getReferenceCode, getTikzCode} from "./load.js";

//======================================================================================================================

const download = (text, filename = "figure.tex") => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// =====================================================================================================================

const makeFileContent = () => {
    return `%Your reference code for the next loading is:\n%Note! There is a percentage sign at the beginning of the line!\n\n%${getReferenceCode()}\n\n` +
        `%Your TikZ code is as follows:\n${getTikzCode()}\n\n` +
        `%File was created at ${new Date().toLocaleString().replace(',', '')}`
}

// =====================================================================================================================

export {
    makeFileContent,
    download
}

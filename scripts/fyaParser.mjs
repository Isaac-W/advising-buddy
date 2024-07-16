import * as pdfjs from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

export async function parsePdf(file) {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(pdfData).promise;
    const numPages = pdf.numPages;
    
    const pages = [];
    // for (let i = 1; i <= numPages; i++) {
    //     const page = await pdf.getPage(i);
    //     pages.push(await getText(page));
    // }
    await getText(await pdf.getPage(7));
}

async function getText(page) {
    const textContent = await page.getTextContent();
    const textBoxes = getTextBoxes(textContent);
    console.log(textBoxes);

    let lines = [];
    let lastY = Infinity;

    for (let item of textContent.items) {
        const y = item.transform[5];
        let text = item.str;
        
        console.log(`x: ${item.transform[4]}, y: ${y}, h: ${item.height}, text: ${text}`);
        
        // Check if top of text is above last text
        if (y + item.height >= lastY) {
            lines[lines.length - 1] += text;
        } else {
            lines.push(text);
        }

        // Update lastY based on whether the current text item has an EOL
        if (item.hasEOL) {
            lastY = Infinity;
        } else {
            lastY = y;
        }
    }

    // Remove blank lines
    lines = lines.filter(line => line.trim().length > 0);

    console.log(lines.join("\n"));
    return lines;
}

function getTextBoxes(textContent) {
    const textBoxes = [];
    
    for (let item of textContent.items) {
        const x = item.transform[4];
        const y = item.transform[5];
        const width = item.width;
        const height = item.height;
        textBoxes.push({
            text: item.str,
            x,
            y,
            width,
            height,
            top: y + height,
            right: x + width,
            bottom: y,
            left: x,
            hasEOL: item.hasEOL,
        });
    }

    return sortTextBoxes(textBoxes);
}

function sortTextBoxes(textBoxes) {
    return textBoxes.sort((a, b) => {
        if (a.top >= b.bottom && a.bottom <= b.top) { // Are they on the same line?
            return a.x - b.x; // Sort left to right
        }
        return b.y - a.y; // Sort top to bottom
    });
}

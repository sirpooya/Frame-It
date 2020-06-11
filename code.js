// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
var Size = 0;
for (const node of figma.currentPage.selection) {
    var curSize = 0;
    if (node.width > node.height)
        curSize = node.width;
    else
        curSize = node.height;
    if (curSize > Size)
        Size = curSize;
}
figma.showUI(__html__);
figma.ui.postMessage(Size);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-frame') {
        // const nodes: SceneNode[] = [];
        // for (let i = 0; i < msg.count; i++) {
        // const rect = figma.createRectangle();
        // rect.x = i * 150;
        // rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
        // figma.currentPage.appendChild(rect);
        // nodes.push(rect);
        // }
        // figma.currentPage.selection = nodes;
        // figma.viewport.scrollAndZoomIntoView(nodes);
        for (const node of figma.currentPage.selection) {
            if ("opacity" in node) {
                const frame = figma.createFrame();
                var size = msg.count;
                frame.resize(size, size);
                frame.x = node.x;
                frame.y = node.y;
                frame.appendChild(node);
                frame.name = node.name;
                node.y = (size - node.height) / 2;
                node.x = (size - node.width) / 2;
                // frame.findChild()
            }
        }
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};

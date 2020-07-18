// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
var newSize = 0;

// Globarl Function: Calculate size even after rotation
function sizeAfterRotation(size, degrees) {
  degrees = degrees % 180;
  if (degrees < 0) { degrees = 180 + degrees; }
  if (degrees >= 90) { size = [ size[1], size[0] ]; degrees = degrees - 90; }
  if (degrees === 0) { return size; }
  const radians = degrees * Math.PI / 180;
  const width = (size[0] * Math.cos(radians)) + (size[1] * Math.sin(radians));
  const height = (size[0] * Math.sin(radians)) + (size[1] * Math.cos(radians));
  return [ width, height ];
}

// Close Function: writing for Read-only properties
function clone(val) {
  return JSON.parse(JSON.stringify(val))
}

function deselectNode(page: PageNode) {
    page.selection = [];
}

function selectNode(page: PageNode , node: SceneNode) {
  // Don't forget to check that something is selected!
  // if (node.children.length > 0) {
    // page.selection = [node.children[0]]
    console.log(node);
  // }

  // Only Selelct a this Node
  // page.selection = [node];

  console.log(page.selection);
  
}

selectNode(figma.currentPage, node);

for (const node of figma.currentPage.selection) {
    var curSize = 0;
    var rotatedSize = sizeAfterRotation([ node.width, node.height ], node.rotation);
    // console.log(Math.round(rotatedSize[0])+" & "+Math.round(rotatedSize[1]));
    if (rotatedSize[0] > rotatedSize[1]) curSize = rotatedSize[0]; else curSize = rotatedSize[1];
    if (curSize > newSize) newSize = curSize;
    // console.log(newSize);
}

figma.showUI(__html__);
figma.ui.postMessage(Math.round(newSize));

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
        const fills = clone(frame.fills);
        fills[0].visible = false;
        frame.fills = fills;

        frame.x = node.x;
        frame.y = node.y;
        frame.appendChild(node);
        frame.name = node.name;
        
        var rotatedSize = sizeAfterRotation([ node.width, node.height ], node.rotation);
        node.x = (size-rotatedSize[0]) / 2;
        node.y = (size-rotatedSize[1]) / 2; // T0D0 2 : fix aligning for rotated layers
        
        // frame.findChild() // T0D0 1 : fix desection
        // selectNode(figma.currentPage, frame);

      }

    }
      
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.

  figma.closePlugin();
};

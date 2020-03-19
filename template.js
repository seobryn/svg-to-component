const DOM = require("jsdom").JSDOM;
module.exports = function GenerateFile(config) {
  const content = PrepareContent(config.content);
  return `
<template>
  ${content.template}
</template>
<script>
  export default {
  name: "${config.name.toLowerCase()}",
    props: {
      color: {
        type: Array,
        default: ()=>([${content.defaultColor.map(element => {
          return element ? `"${element}"` : "";
        })}])
      },
      width:{
        type: String,
        default:''
      },
      height:{
        type: String,
        default:''
      }
    }
  }
</script>`;
};

function PrepareContent(contentFile) {
  let output = {
    defaultColor: [],
    template: ""
  };
  let content = new DOM(contentFile).window.document.body;

  content = fixChildren(content, output);
  output.template = content.innerHTML;

  return output;
}

function fixChildren(content, output) {
  for (let count = 0; count < content.children.length; count++) {
    let currentItem = content.children.item(count);

    if (currentItem.nodeName.toLowerCase() === "path") {
      if (currentItem.getAttribute("fill")) {
        const posibleColor = output.defaultColor.indexOf(
          currentItem.getAttribute("fill")
        );
        if (posibleColor === -1) {
          output.defaultColor.push(currentItem.getAttribute("fill"));
          currentItem.setAttribute(
            ":fill",
            `color[${output.defaultColor.length - 1}]`
          );
        } else {
          currentItem.setAttribute(":fill", `color[${posibleColor}]`);
        }
        currentItem.removeAttribute("fill");
      }
      
      if (currentItem.getAttribute("stroke")) {
        const posibleColor = output.defaultColor.indexOf(
          currentItem.getAttribute("stroke")
        );
        if (posibleColor === -1) {
          output.defaultColor.push(currentItem.getAttribute("stroke"));
          currentItem.setAttribute(
            ":stroke",
            `color[${output.defaultColor.length - 1}]`
          );
        } else {
          currentItem.setAttribute(":stroke", `color[${posibleColor}]`);
        }
        currentItem.removeAttribute("stroke");
      }
    } else if (
      currentItem.nodeName.toLowerCase() === "g" ||
      currentItem.nodeName.toLowerCase() === "mask" ||
      currentItem.nodeName.toLowerCase() === "svg"
    ) {
      currentItem = fixChildren(currentItem, output);
    }
  }
  return content;
}

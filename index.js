const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

const filePath = path.join(__dirname, "example/App.jsx");
const code = fs.readFileSync(filePath, "utf8");

const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx"]
});

let componentCounter = 1;
const MIN_LINES = 50; 

traverse(ast, {
  JSXElement(nodePath) {
    
    const parentIsJSX = nodePath.parent.type === "JSXElement";
    if (parentIsJSX) return;

    const { start, end } = nodePath.node.loc;
    const lineCount = end.line - start.line + 1;
    if (lineCount < MIN_LINES) return;

    //component name generation
    let componentName;
    if (nodePath.parentPath.isFunction()) {
      componentName = `${nodePath.parentPath.node.id.name}_Extracted${componentCounter++}`;
    } else if (nodePath.node.openingElement.name.type === "JSXIdentifier") {
      componentName = `${capitalize(nodePath.node.openingElement.name.name)}_Extracted${componentCounter++}`;
    } else {
      componentName = `ExtractedComponent${componentCounter++}`;
    }

    console.log(` recommend: ${componentName} (lines: ${lineCount})`);

    //making new component file
    const jsxCode = generator(nodePath.node).code;
    const componentCode = `
import React from 'react';

export default function ${componentName}() {
  return (
    ${jsxCode}
  );
}
`;
    fs.writeFileSync(path.join(__dirname, `${componentName}.jsx`), componentCode);
    console.log(` file ${componentName}.jsx has been created`);

   //change original code to use new component
    const replacement = parser.parse(`<${componentName} />`, {
      sourceType: "module",
      plugins: ["jsx"]
    }).program.body[0].expression;
    nodePath.replaceWith(replacement);

   //add import statement
    const importStatement = parser.parse(`import ${componentName} from './${componentName}';`, {
      sourceType: "module",
      plugins: ["jsx"]
    }).program.body[0];
    ast.program.body.unshift(importStatement);
  }
});

const { code: outputCode } = generator(ast, { quotes: "single" });
fs.writeFileSync(filePath, outputCode);
console.log("main file updated with new components");

// Helper function to capitalize component names
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

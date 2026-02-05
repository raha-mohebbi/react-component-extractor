const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

//test file path
const filePath = path.join(__dirname, "example/App.jsx");
let code = fs.readFileSync(filePath, "utf8");

//parsing the code to AST
const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx"]
});

//component counter for unique names
let componentCounter = 1;

traverse(ast, {
  JSXElement(nodePath) { 
    const parentIsJSX = nodePath.parent.type === "JSXElement";
    if (parentIsJSX) return;

    const { start, end } = nodePath.node.loc;
    const lineCount = end.line - start.line + 1;

    if (lineCount < 4) return;

    const componentName = `ExtractedComponent${componentCounter++}`;
    console.log(`💡 پیشنهاد: ${componentName} (lines: ${lineCount})`);

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
    console.log(`✅ فایل ${componentName}.jsx ساخته شد`);

    const replacement = parser.parse(`<${componentName} />`, {
      sourceType: "module",
      plugins: ["jsx"]
    }).program.body[0].expression;

    nodePath.replaceWith(replacement);

    const importStatement = parser.parse(`import ${componentName} from './${componentName}';`, {
      sourceType: "module",
      plugins: ["jsx"]
    }).program.body[0];

    ast.program.body.unshift(importStatement);
  }
});

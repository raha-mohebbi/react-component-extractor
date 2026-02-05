README.md (English)
# React Component Extractor

React Component Extractor is a **Node.js tool** that automatically scans your React project for large JSX blocks and extracts them into separate reusable components.  

If your React files grow too long and messy, this tool helps you:

- Detect large JSX blocks  
- Extract them into separate components  
- Replace the original JSX with `<ComponentName />` in the source file  
- Automatically add necessary imports  

---

## Features

- Automatic extraction of JSX blocks larger than a configurable threshold  
- Smart component naming based on the parent tag or function name  
- Works with real React projects and multiple files  
- Preserves the original JSX structure  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/react-component-extractor.git
cd react-component-extractor


Install dependencies:

npm install

Usage
1. Set the target file

Edit index.js and set the path to your React JSX file:

const filePath = "D:/my-react-project/src/App.jsx";

2. Run the tool
node index.js


The tool will detect large JSX blocks

Create separate component files for each block

Replace the JSX in the original file with <ComponentName />

Add necessary import statements

3. Configure minimum lines for extraction

In index.js:

const MIN_LINES = 50; // Extract JSX blocks longer than 50 lines

Example Output

Original file (App.jsx) after extraction:

import React from 'react';
import Div_Extracted1 from './Div_Extracted1';

export default function App() {
  return (
    <Div_Extracted1 />
  );
}


Extracted component (Div_Extracted1.jsx):

import React from 'react';

export default function Div_Extracted1() {
  return (
    <div>
      <h1>Hello</h1>
      <p>World</p>
    </div>
  );
}

Tips

Backup your files before running the tool on real projects

Adjust MIN_LINES to extract smaller JSX blocks if needed

Works great for large React projects to improve code readability and reusability

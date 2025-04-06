import React from 'react';

interface TerminalProps {
  code: string;
  title?: string;
}

export function Terminal({ code, title = "titan-ai-demo.js" }: TerminalProps) {
  // Function to apply syntax highlighting
  const highlightCode = (code: string) => {
    // Replace keywords with spans
    let highlighted = code
      .replace(/import|from|const|let|function|async|await|return|new|true|false|if|else/g, 
        match => `<span class="text-[#FF7EDB]">${match}</span>`)
      .replace(/\b([A-Za-z0-9_]+)\(/g, 
        (_, funcName) => `<span class="text-[#82AAFF]">${funcName}</span>(`)
      .replace(/'[^']*'|"[^"]*"|`[^`]*`/g, 
        match => `<span class="text-[#C3E88D]">${match}</span>`)
      .replace(/\/\/.*/g, 
        match => `<span class="text-[#676E95]">${match}</span>`);
    
    return highlighted;
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-2xl">
      <div className="bg-[#2A2A36] px-4 py-2 flex items-center">
        <div className="h-3 w-3 rounded-full bg-[#FF5F57] mr-1.5"></div>
        <div className="h-3 w-3 rounded-full bg-[#FEBC2E] mr-1.5"></div>
        <div className="h-3 w-3 rounded-full bg-[#28C840] mr-4"></div>
        <div className="text-xs text-gray-400">{title}</div>
      </div>
      <div className="bg-[#1E1E24] p-4 overflow-auto">
        <pre className="font-mono text-sm leading-relaxed text-[#E4E4E4]" 
          dangerouslySetInnerHTML={{ __html: highlightCode(code) }}>
        </pre>
      </div>
    </div>
  );
}

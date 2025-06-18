import React, { useEffect, useRef } from 'react';

interface NoteEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  placeholder?: string;
}

export default function NoteEditor({ 
  title, 
  content, 
  onTitleChange, 
  onContentChange, 
  placeholder = "Start writing..." 
}: NoteEditorProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = contentRef.current.scrollHeight + 'px';
    }
  }, [content]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 py-4 border-b border-gray-100">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          className="w-full text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
        />
      </div>
      
      <div className="flex-1 px-6 py-4">
        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full min-h-96 text-base text-gray-900 bg-transparent border-none outline-none resize-none placeholder-gray-400 leading-relaxed"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
        />
      </div>
    </div>
  );
}
import { Note } from '../types/Note';

export function exportNote(note: Note): void {
  const content = `${note.title}\n\n${note.content}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title || 'Untitled'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAllNotes(notes: Note[]): void {
  const content = notes.map(note => 
    `--- ${note.title || 'Untitled'} ---\n\n${note.content}\n\n`
  ).join('\n');
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'all-notes.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
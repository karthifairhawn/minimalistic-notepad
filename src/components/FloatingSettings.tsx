import React, { useState, useRef } from 'react';
import { Settings, Download, Upload, FileText, Files, X } from 'lucide-react';

interface FloatingSettingsProps {
  onExportCurrent: () => void;
  onExportAll: () => void;
  onImport: (file: File) => void;
  hasNotes: boolean;
}

export default function FloatingSettings({ onExportCurrent, onExportAll, onImport, hasNotes }: FloatingSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  const handleExportCurrent = () => {
    onExportCurrent();
    setIsOpen(false);
  };

  const handleExportAll = () => {
    onExportAll();
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Floating Settings Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:bg-gray-50"
          title="Settings"
        >
          {isOpen ? (
            <X size={18} className="text-gray-600" />
          ) : (
            <Settings size={18} className="text-gray-600 group-hover:rotate-90 transition-transform duration-200" />
          )}
        </button>

        {/* Settings Menu */}
        {isOpen && (
          <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={handleImportClick}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} />
              <span>Import Note</span>
            </button>
            
            {hasNotes && (
              <>
                <button
                  onClick={handleExportCurrent}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} />
                  <span>Export Current</span>
                </button>
                
                <button
                  onClick={handleExportAll}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Files size={16} />
                  <span>Export All Notes</span>
                </button>
              </>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </>
  );
}
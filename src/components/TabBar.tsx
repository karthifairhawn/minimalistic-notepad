import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Tab } from '../types/Note';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  onTabReorder: (fromIndex: number, toIndex: number) => void;
}

export default function TabBar({ 
  tabs, 
  activeTabId, 
  onTabClick, 
  onTabClose, 
  onNewTab, 
  onTabReorder 
}: TabBarProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [confirmClose, setConfirmClose] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onTabReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleCloseClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    setConfirmClose(tabId);
  };

  const confirmCloseTab = () => {
    if (confirmClose) {
      onTabClose(confirmClose);
      setConfirmClose(null);
    }
  };

  const cancelClose = () => {
    setConfirmClose(null);
  };

  return (
    <>
      <div className="flex items-center bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center min-w-0 max-w-48 group cursor-move transition-all duration-200 ${
                tab.id === activeTabId
                  ? 'bg-white border-b-2 border-black'
                  : 'bg-gray-50 hover:bg-gray-100 border-b border-gray-200'
              } ${
                draggedIndex === index ? 'opacity-50 scale-95' : ''
              } ${
                dragOverIndex === index && draggedIndex !== index 
                  ? 'border-l-2 border-blue-400' 
                  : ''
              }`}
            >
              <button
                onClick={() => onTabClick(tab.id)}
                className="flex-1 px-4 py-3 text-left truncate text-sm font-medium text-gray-900 min-w-0"
              >
                <span className="truncate">
                  {tab.title || 'Untitled'}
                  {tab.hasUnsavedChanges && <span className="ml-1 text-gray-500">•</span>}
                </span>
              </button>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => handleCloseClick(e, tab.id)}
                  className="p-1 mr-2 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onNewTab}
          className="flex items-center justify-center w-10 h-12 hover:bg-gray-100 transition-colors"
          title="New tab"
        >
          <Plus size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Confirmation Dialog */}
      {confirmClose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Close Tab?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to close this tab? Any unsaved changes will be automatically saved.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCloseTab}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Close Tab
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
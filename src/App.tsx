import React from 'react';
import { useNotes } from './hooks/useNotes';
import TabBar from './components/TabBar';
import NoteEditor from './components/NoteEditor';
import FloatingSettings from './components/FloatingSettings';
import { exportNote, exportAllNotes, importFromFile } from './utils/fileUtils';

function App() {
  const {
    tabs,
    activeTabId,
    activeTab,
    allNotes,
    createNewTab,
    closeTab,
    switchTab,
    updateTab,
    importNote,
    reorderTabs,
  } = useNotes();

  const handleExportCurrent = () => {
    if (activeTab) {
      const note = {
        id: activeTab.id,
        title: activeTab.title,
        content: activeTab.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      exportNote(note);
    }
  };

  const handleExportAll = () => {
    exportAllNotes(allNotes);
  };

  const handleImport = async (file: File) => {
    try {
      const content = await importFromFile(file);
      await importNote(content, file.name);
    } catch (error) {
      console.error('Failed to import file:', error);
    }
  };

  const handleTitleChange = (title: string) => {
    if (activeTab) {
      updateTab(activeTab.id, { title });
    }
  };

  const handleContentChange = (content: string) => {
    if (activeTab) {
      updateTab(activeTab.id, { content });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white relative">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={switchTab}
        onTabClose={closeTab}
        onNewTab={createNewTab}
        onTabReorder={reorderTabs}
      />
      
      {activeTab ? (
        <NoteEditor
          title={activeTab.title}
          content={activeTab.content}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          placeholder="Start writing your thoughts..."
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>No notes open. Create a new tab to start writing.</p>
        </div>
      )}

      <FloatingSettings
        onExportCurrent={handleExportCurrent}
        onExportAll={handleExportAll}
        onImport={handleImport}
        hasNotes={tabs.length > 0}
      />
    </div>
  );
}

export default App;
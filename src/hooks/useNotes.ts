import { useState, useEffect, useCallback } from 'react';
import { Note, Tab } from '../types/Note';
import * as db from '../utils/database';

export function useNotes() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [allNotes, setAllNotes] = useState<Note[]>([]);

  // Generate unique ID
  const generateId = () => `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create initial tab
  useEffect(() => {
    const createInitialTab = async () => {
      // Load existing notes from database
      const existingNotes = await db.getAllNotes();
      setAllNotes(existingNotes);

      if (existingNotes.length > 0) {
        // If there are existing notes, open the most recent one
        const mostRecent = existingNotes.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        
        const initialTab: Tab = {
          id: mostRecent.id,
          title: mostRecent.title,
          content: mostRecent.content,
          isActive: true,
          hasUnsavedChanges: false,
        };
        
        setTabs([initialTab]);
        setActiveTabId(initialTab.id);
      } else {
        // Create a new empty tab
        const initialTab: Tab = {
          id: generateId(),
          title: '',
          content: '',
          isActive: true,
          hasUnsavedChanges: false,
        };
        
        setTabs([initialTab]);
        setActiveTabId(initialTab.id);
      }
    };

    createInitialTab();
  }, []);

  // Auto-save functionality
  const saveTab = useCallback(async (tab: Tab) => {
    const note: Note = {
      id: tab.id,
      title: tab.title,
      content: tab.content,
      createdAt: allNotes.find(n => n.id === tab.id)?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await db.saveNote(note);
    
    // Update allNotes state
    setAllNotes(prev => {
      const existing = prev.find(n => n.id === note.id);
      if (existing) {
        return prev.map(n => n.id === note.id ? note : n);
      } else {
        return [...prev, note];
      }
    });

    // Mark tab as saved
    setTabs(prev => 
      prev.map(t => 
        t.id === tab.id 
          ? { ...t, hasUnsavedChanges: false }
          : t
      )
    );
  }, [allNotes]);

  // Update tab content
  const updateTab = useCallback((tabId: string, updates: Partial<Pick<Tab, 'title' | 'content'>>) => {
    setTabs(prev => 
      prev.map(tab => 
        tab.id === tabId 
          ? { ...tab, ...updates, hasUnsavedChanges: true }
          : tab
      )
    );
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    const timeouts: Record<string, NodeJS.Timeout> = {};

    tabs.forEach(tab => {
      if (tab.hasUnsavedChanges) {
        if (timeouts[tab.id]) {
          clearTimeout(timeouts[tab.id]);
        }
        
        timeouts[tab.id] = setTimeout(() => {
          saveTab(tab);
        }, 1000); // Auto-save after 1 second of inactivity
      }
    });

    return () => {
      Object.values(timeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [tabs, saveTab]);

  // Create new tab
  const createNewTab = useCallback(() => {
    const newTab: Tab = {
      id: generateId(),
      title: '',
      content: '',
      isActive: true,
      hasUnsavedChanges: false,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  // Close tab
  const closeTab = useCallback(async (tabId: string) => {
    const tabToClose = tabs.find(t => t.id === tabId);
    if (tabToClose?.hasUnsavedChanges) {
      await saveTab(tabToClose);
    }

    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== tabId);
      
      // If we're closing the active tab, switch to another one
      if (activeTabId === tabId && newTabs.length > 0) {
        const newActiveTab = newTabs[newTabs.length - 1];
        setActiveTabId(newActiveTab.id);
      }
      
      return newTabs;
    });
  }, [tabs, activeTabId, saveTab]);

  // Switch active tab
  const switchTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  // Reorder tabs
  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setTabs(prev => {
      const newTabs = [...prev];
      const [movedTab] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, movedTab);
      return newTabs;
    });
  }, []);

  // Open existing note in new tab
  const openNoteInTab = useCallback((note: Note) => {
    // Check if note is already open in a tab
    const existingTab = tabs.find(t => t.id === note.id);
    if (existingTab) {
      setActiveTabId(note.id);
      return;
    }

    const newTab: Tab = {
      id: note.id,
      title: note.title,
      content: note.content,
      isActive: true,
      hasUnsavedChanges: false,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs]);

  // Get current active tab
  const activeTab = tabs.find(t => t.id === activeTabId);

  // Import note
  const importNote = useCallback(async (content: string, filename: string) => {
    const lines = content.split('\n');
    const title = filename.replace(/\.(txt|md)$/, '') || lines[0] || 'Imported Note';
    
    const newTab: Tab = {
      id: generateId(),
      title: title,
      content: content,
      isActive: true,
      hasUnsavedChanges: true,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  return {
    tabs,
    activeTabId,
    activeTab,
    allNotes,
    createNewTab,
    closeTab,
    switchTab,
    updateTab,
    openNoteInTab,
    importNote,
    saveTab,
    reorderTabs,
  };
}
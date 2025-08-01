import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, Plus, Edit3, Trash2, Save, X, Sun, Moon, Palette } from 'lucide-react';

// Theme Configuration
const THEMES = {
  blue: { primary: 'blue', secondary: 'blue' },
  green: { primary: 'green', secondary: 'emerald' },
  purple: { primary: 'purple', secondary: 'violet' },
  red: { primary: 'red', secondary: 'rose' },
  orange: { primary: 'orange', secondary: 'amber' }
};

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('blue');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const changeTheme = (theme) => setCurrentTheme(theme);

  const getThemeClasses = () => {
    const theme = THEMES[currentTheme];
    const mode = isDarkMode ? 'dark' : 'light';
    
    return {
      // Primary colors
      primary: isDarkMode ? `bg-${theme.primary}-600` : `bg-${theme.primary}-500`,
      primaryHover: isDarkMode ? `hover:bg-${theme.primary}-700` : `hover:bg-${theme.primary}-600`,
      primaryText: `text-${theme.primary}-500`,
      primaryBorder: `border-${theme.primary}-500`,
      primaryFocus: `focus:ring-${theme.primary}-500 focus:border-${theme.primary}-500`,
      
      // Background colors
      background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
      cardBackground: isDarkMode ? 'bg-gray-800' : 'bg-white',
      inputBackground: isDarkMode ? 'bg-gray-700' : 'bg-white',
      
      // Text colors
      textPrimary: isDarkMode ? 'text-gray-100' : 'text-gray-800',
      textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      textPlaceholder: isDarkMode ? 'text-gray-500' : 'text-gray-400',
      
      // Border colors
      border: isDarkMode ? 'border-gray-600' : 'border-gray-200',
      borderLight: isDarkMode ? 'border-gray-700' : 'border-gray-300',
      
      // Hover states
      hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      cardHover: isDarkMode ? 'hover:bg-gray-750' : 'hover:shadow-md'
    };
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      currentTheme,
      toggleDarkMode,
      changeTheme,
      getThemeClasses,
      themes: Object.keys(THEMES)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utility Functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${month}/${day}/${year} ${time}`;
};

const generateId = () => Date.now() + Math.random();

// Custom Hooks
const useNotes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const sampleNotes = [
      {
        id: 1,
        title: 'Welcome to Notes',
        content: 'This is your first note! You can edit, delete, or create new notes. Try switching between light and dark modes!',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Shopping List',
        content: '• Milk\n• Bread\n• Eggs\n• Coffee\n• Vegetables',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    setNotes(sampleNotes);
  }, []);

  const createNote = (noteData) => {
    const note = {
      id: generateId(),
      title: noteData.title || 'Untitled',
      content: noteData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [note, ...prev]);
    return note;
  };

  const updateNote = (id, updates) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const searchNotes = (searchTerm) => {
    if (!searchTerm.trim()) return notes;
    const term = searchTerm.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    );
  };

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes
  };
};

// Components
const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes, getThemeClasses } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const themeClasses = getThemeClasses();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${themeClasses.hover} ${themeClasses.textMuted}`}
        title="Change theme"
      >
        <Palette size={20} />
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 top-12 ${themeClasses.cardBackground} ${themeClasses.border} border rounded-lg shadow-lg p-2 z-10`}>
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => {
                changeTheme(theme);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded capitalize transition-colors ${
                currentTheme === theme ? themeClasses.primary + ' text-white' : themeClasses.hover + ' ' + themeClasses.textPrimary
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = ({ onCreateNote }) => {
  const { isDarkMode, toggleDarkMode, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>My Notes</h1>
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${themeClasses.hover} ${themeClasses.textMuted}`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ searchTerm, onSearchChange, onCreateNote }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className="flex gap-3 mb-4">
      <div className="relative flex-1">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`} size={20} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${themeClasses.inputBackground} ${themeClasses.border} ${themeClasses.textPrimary} ${themeClasses.primaryFocus} focus:outline-none focus:ring-2`}
        />
      </div>
      <button
        onClick={onCreateNote}
        className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${themeClasses.primary} ${themeClasses.primaryHover}`}
      >
        <Plus size={20} />
        New Note
      </button>
    </div>
  );
};

const NoteForm = ({ note = null, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave({ title, content });
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className={`${themeClasses.cardBackground} rounded-lg border p-4 mb-4 ${themeClasses.border}`}>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full text-lg font-semibold border-b pb-1 transition-colors ${themeClasses.inputBackground} ${themeClasses.borderLight} ${themeClasses.primaryFocus} ${themeClasses.textPrimary} focus:outline-none`}
          autoFocus
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full min-h-24 border rounded p-2 transition-colors resize-none ${themeClasses.inputBackground} ${themeClasses.border} ${themeClasses.primaryFocus} ${themeClasses.textSecondary} focus:outline-none focus:ring-2`}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className={`px-3 py-1 transition-colors ${themeClasses.textMuted} hover:${themeClasses.textPrimary}`}
          >
            <X size={16} />
          </button>
          <button
            onClick={handleSave}
            className={`px-3 py-1 text-white rounded transition-colors flex items-center gap-1 ${themeClasses.primary} ${themeClasses.primaryHover}`}
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const handleSave = (updates) => {
    onUpdate(note.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <NoteForm
        note={note}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className={`${themeClasses.cardBackground} rounded-lg border p-4 transition-all ${themeClasses.border} ${themeClasses.cardHover}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-semibold truncate ${themeClasses.textPrimary}`}>
          {note.title}
        </h3>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className={`p-1 transition-colors ${themeClasses.textMuted} ${themeClasses.primaryText}`}
            title="Edit note"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className={`p-1 transition-colors ${themeClasses.textMuted} hover:text-red-500`}
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className={`text-sm mb-3 whitespace-pre-wrap line-clamp-3 ${themeClasses.textSecondary}`}>
        {note.content}
      </p>
      <p className={`text-xs ${themeClasses.textMuted}`}>
        Updated: {formatDate(note.updatedAt)}
      </p>
    </div>
  );
};

const NotesGrid = ({ notes, onUpdate, onDelete, searchTerm }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  if (notes.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className={`text-lg ${themeClasses.textMuted}`}>
          {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
        </p>
      </div>
    );
  }

  return (
    <>
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

const Footer = ({ noteCount }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className={`mt-8 text-center text-sm ${themeClasses.textMuted}`}>
      {noteCount} {noteCount === 1 ? 'note' : 'notes'} total
    </div>
  );
};

// Main App Component
const NoteTakingWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { notes, createNote, updateNote, deleteNote, searchNotes } = useNotes();
  const { getThemeClasses } = useTheme();
  
  const filteredNotes = searchNotes(searchTerm);
  const themeClasses = getThemeClasses();

  const handleCreateNote = (noteData) => {
    createNote(noteData);
    setIsCreating(false);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors ${themeClasses.background}`}>
      <Header onCreateNote={() => setIsCreating(true)} />
      
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateNote={() => setIsCreating(true)}
      />

      {isCreating && (
        <NoteForm
          onSave={handleCreateNote}
          onCancel={handleCancelCreate}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NotesGrid
          notes={filteredNotes}
          onUpdate={updateNote}
          onDelete={deleteNote}
          searchTerm={searchTerm}
        />
      </div>

      <Footer noteCount={notes.length} />
    </div>
  );
};

// App with Theme Provider
const App = () => {
  return (
    <ThemeProvider>
      <NoteTakingWidget />
    </ThemeProvider>
  );
};

export default App;
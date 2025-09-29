import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Note {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    // For now, we'll just initialize with empty notes since we removed the list endpoint
    setIsLoading(false);
  }, []);

  const handleCreateNote = async () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      const response = await notesAPI.createNote({ title: newTitle.trim() });
      const newNote = response.data.data.note;
      setNotes(prev => [...prev, newNote]);
      setNewTitle('');
      setShowCreate(false);
      toast.success('Note created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note._id !== noteId));
      toast.success('Note deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Unified Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-blue-500 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>

          {/* Welcome + Email */}
          <div className="rounded-xl border border-gray-300 p-6 bg-white shadow-md -mt-4 relative z-10">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Welcome, {user?.name}!</h2>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
          </div>

          {/* Create Note */}
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium text-lg shadow-sm hover:bg-blue-600 transition-colors"
          >
            {showCreate ? 'Close Creator' : 'Create Note'}
          </button>

          {/* Create Note Form - Single Input */}
          {showCreate && (
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!newTitle.trim()) {
                        toast.error('Please enter a title');
                        return;
                      }
                      setIsSaving(true);
                      try {
                        const response = await notesAPI.createNote({ title: newTitle.trim() });
                        const created = response?.data?.data?.note;
                        if (created) {
                          setNotes((prev) => [...prev, created]);
                        }
                        setNewTitle('');
                        setShowCreate(false);
                        toast.success('Note created');
                      } catch (err) {
                        toast.error('Failed to create note');
                      } finally {
                        setIsSaving(false);
                      }
                    } else if (e.key === 'Escape') {
                      setShowCreate(false);
                    }
                  }}
                  className="input flex-1 h-8 text-sm px-2 py-1"
                  placeholder="Enter note title"
                  disabled={isSaving}
                  maxLength={100}
                />
                <button
                  type="button"
                  disabled={isSaving}
                  className="btn-primary btn-sm"
                  onClick={handleCreateNote}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No notes yet. Create your first note!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div key={note._id} className="rounded-lg border border-gray-200 p-2 flex items-center justify-between shadow-md -mt-4 relative z-10">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {note.title || `Note ${index + 1}`}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

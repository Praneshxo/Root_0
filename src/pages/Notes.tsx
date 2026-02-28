import { useState, useEffect } from 'react';
import { Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Note {
  id: string;
  title: string;
  subject: string;
  preview_image_url: string;
  pdf_url: string;
}

// Mock notes data with generated preview images
const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Operating Systems Complete Notes',
    subject: 'OS',
    preview_image_url: '/images/notes/os-notes.png',
    pdf_url: 'https://example.com/os-notes.pdf'
  },
  {
    id: '2',
    title: 'DBMS Complete Notes',
    subject: 'DBMS',
    preview_image_url: '/images/notes/dbms-notes.png',
    pdf_url: 'https://example.com/dbms-notes.pdf'
  },
  {
    id: '3',
    title: 'Computer Networks Notes',
    subject: 'CN',
    preview_image_url: '/images/notes/networks-notes.png',
    pdf_url: 'https://example.com/cn-notes.pdf'
  },
  {
    id: '4',
    title: 'Data Structures & Algorithms',
    subject: 'DSA',
    preview_image_url: '/images/notes/dsa-notes.png',
    pdf_url: 'https://example.com/dsa-notes.pdf'
  },
  {
    id: '5',
    title: 'Object Oriented Programming',
    subject: 'OOP',
    preview_image_url: '/images/notes/oop-notes.png',
    pdf_url: 'https://example.com/oop-notes.pdf'
  },
  {
    id: '6',
    title: 'System Design Notes',
    subject: 'System Design',
    preview_image_url: '/images/notes/system-design-notes.png',
    pdf_url: 'https://example.com/system-design-notes.pdf'
  }
];

export default function Notes() {
  const { user } = useAuth();
  const [notes] = useState<Note[]>(MOCK_NOTES);
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarked'>('all');
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_note_bookmarks')
        .select('note_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const bookmarkedIds = new Set(data?.map(b => b.note_id) || []);
      setBookmarkedNotes(bookmarkedIds);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (noteId: string) => {
    if (!user) return;

    const isBookmarked = bookmarkedNotes.has(noteId);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('user_note_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('note_id', noteId);

        if (error) throw error;

        setBookmarkedNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteId);
          return newSet;
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('user_note_bookmarks')
          .insert({
            user_id: user.id,
            note_id: noteId
          });

        if (error) throw error;

        setBookmarkedNotes(prev => new Set([...prev, noteId]));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handlePreview = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const filteredNotes = activeTab === 'all'
    ? notes
    : notes.filter(note => bookmarkedNotes.has(note.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#4F0F93] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F13] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#111317]/80 backdrop-blur-xl">
        <div className="px-6 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Notes</h1>
            <p className="text-[#A0A0B0]">Comprehensive study materials for all subjects</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'all'
                ? 'border-[#4F0F93] text-white'
                : 'border-transparent text-[#A0A0B0] hover:text-white'
                }`}
            >
              All Notes
            </button>
            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'bookmarked'
                ? 'border-[#4F0F93] text-white'
                : 'border-transparent text-[#A0A0B0] hover:text-white'
                }`}
            >
              Bookmarked Notes
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-[#111317] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-800 transition-all group"
            >
              <div className="relative h-48 bg-zinc-800/50 overflow-hidden">
                <img
                  src={note.preview_image_url}
                  alt={note.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 text-xs font-medium bg-[#4F0F93]/90 text-white rounded-full">
                    {note.subject}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
                  {note.title}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(note.pdf_url)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-[#2C2C2C] text-white text-sm font-medium rounded-lg transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => toggleBookmark(note.id)}
                    className={`px-4 py-2 rounded-lg transition-all ${bookmarkedNotes.has(note.id)
                      ? 'bg-[#4F0F93] hover:bg-[#6312BA] text-white'
                      : 'bg-zinc-800/50 hover:bg-[#2C2C2C] text-[#A0A0B0]'
                      }`}
                  >
                    {bookmarkedNotes.has(note.id) ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#808090]">No notes found</p>
          </div>
        )}
      </div>
    </div>
  );
}

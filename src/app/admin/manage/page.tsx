'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Note {
  _id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
}

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
}

export default function ManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('documents');
  const [notes, setNotes] = useState<Note[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit states
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editUrl, setEditUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch notes
        const notesRes = await fetch('/api/notes');
        if (!notesRes.ok) throw new Error('Failed to fetch notes');
        const notesData = await notesRes.json();
        setNotes(notesData);

        // Fetch videos
        const videosRes = await fetch('/api/videos');
        if (!videosRes.ok) throw new Error('Failed to fetch videos');
        const videosData = await videosRes.json();
        setVideos(videosData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if user is authenticated and admin
  if (status === 'loading') {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!session || !session.user?.isAdmin) {
    // Show unauthorized message and redirect
    setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8" role="alert">
        <strong className="font-bold">Access Denied!</strong>
        <span className="block sm:inline"> Only authorized admin emails can access this page.</span>
        <p className="mt-2">Redirecting to home page...</p>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle note edit
  const startEditNote = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditDescription(note.description);
  };

  const cancelEditNote = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveNoteChanges = async () => {
    if (!editingNote) return;
    
    try {
      const response = await fetch(`/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update document');
      }
      
      const updatedNote = await response.json();
      
      // Update notes list
      setNotes(notes.map(note => 
        note._id === updatedNote._id ? updatedNote : note
      ));
      
      setSuccessMessage('Document updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      cancelEditNote();
    } catch (error) {
      console.error('Error updating document:', error);
      setError('Failed to update document. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // State for delete confirmation popup
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Handle note delete confirmation
  const confirmDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setShowDeleteNoteConfirm(true);
  };

  // Handle note delete
  const deleteNote = async () => {
    if (!noteToDelete) return;
    
    try {
      const response = await fetch(`/api/notes/${noteToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      
      // Remove from notes list
      setNotes(notes.filter(note => note._id !== noteToDelete));
      
      setSuccessMessage('Document deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Close the popup
      setShowDeleteNoteConfirm(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Failed to delete document. Please try again.');
      setTimeout(() => setError(''), 3000);
      
      // Close the popup
      setShowDeleteNoteConfirm(false);
      setNoteToDelete(null);
    }
  };

  // Handle video edit
  const startEditVideo = (video: Video) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description);
    setEditUrl(''); // We don't populate this by default
  };

  const cancelEditVideo = () => {
    setEditingVideo(null);
    setEditTitle('');
    setEditDescription('');
    setEditUrl('');
  };

  const saveVideoChanges = async () => {
    if (!editingVideo) return;
    
    try {
      const response = await fetch(`/api/videos/${editingVideo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          url: editUrl || undefined, // Only send if provided
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update video');
      }
      
      const updatedVideo = await response.json();
      
      // Update videos list
      setVideos(videos.map(video => 
        video._id === updatedVideo._id ? updatedVideo : video
      ));
      
      setSuccessMessage('Video updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      cancelEditVideo();
    } catch (error) {
      console.error('Error updating video:', error);
      setError('Failed to update video. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // State for delete confirmation popup
  const [showDeleteVideoConfirm, setShowDeleteVideoConfirm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  // Handle video delete confirmation
  const confirmDeleteVideo = (videoId: string) => {
    setVideoToDelete(videoId);
    setShowDeleteVideoConfirm(true);
  };

  // Handle video delete
  const deleteVideo = async () => {
    if (!videoToDelete) return;
    
    try {
      const response = await fetch(`/api/videos/${videoToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete video');
      }
      
      // Remove from videos list
      setVideos(videos.filter(video => video._id !== videoToDelete));
      
      setSuccessMessage('Video deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Close the popup
      setShowDeleteVideoConfirm(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      setError('Failed to delete video. Please try again.');
      setTimeout(() => setError(''), 3000);
      
      // Close the popup
      setShowDeleteVideoConfirm(false);
      setVideoToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Learning Materials</h1>
      
      {/* Delete Note Confirmation Popup */}
      {showDeleteNoteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-slideIn">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Delete Document</h3>
              <div className="h-1 w-16 bg-red-500 mx-auto my-3 rounded-full"></div>
              <p className="text-md text-gray-600 mt-3">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowDeleteNoteConfirm(false)} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={deleteNote} 
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Video Confirmation Popup */}
      {showDeleteVideoConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-slideIn">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Delete Video</h3>
              <div className="h-1 w-16 bg-red-500 mx-auto my-3 rounded-full"></div>
              <p className="text-md text-gray-600 mt-3">
                Are you sure you want to delete this video? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowDeleteVideoConfirm(false)} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={deleteVideo} 
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Delete Video
              </button>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Documents
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'videos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Videos
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'documents' ? (
        <div>
          {notes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No documents available yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {notes.map((note) => (
                <div key={note._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  {editingNote && editingNote._id === note._id ? (
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Edit Document</h3>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Description
                        </label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelEditNote}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveNoteChanges}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                      {note.description && (
                        <p className="text-gray-600 mb-4">{note.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mb-4">
                        Uploaded on {formatDate(note.createdAt)}
                      </p>
                      <div className="flex space-x-2">
                        <a
                          href={note.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>View</span>
                        </a>
                        <button
                          onClick={() => startEditNote(note)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => confirmDeleteNote(note._id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {videos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No videos available yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {videos.map((video) => (
                <div key={video._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  {editingVideo && editingVideo._id === video._id ? (
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Edit Video</h3>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          YouTube URL (Optional - leave blank to keep current video)
                        </label>
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Description
                        </label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelEditVideo}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveVideoChanges}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={video.url}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-64"
                        ></iframe>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                        {video.description && (
                          <p className="text-gray-600 mb-4">{video.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mb-4">
                          Uploaded on {formatDate(video.createdAt)}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditVideo(video)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => confirmDeleteVideo(video._id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
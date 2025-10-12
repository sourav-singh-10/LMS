'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function LMSPage() {
  const [activeTab, setActiveTab] = useState('documents');
  const [notes, setNotes] = useState<Note[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Learning Materials</h1>
      
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
              Documents
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'videos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Videos
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'documents' ? (
        <div>
          {notes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No documents available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note._id} className="bg-white shadow-md rounded-lg overflow-hidden">
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
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const modal = document.getElementById(`pdfModal-${note._id}`);
                          if (modal) modal.classList.remove('hidden');
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span>View</span>
                      </a>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        onClick={() => {
                          // Create a blob from the URL
                          fetch(note.url)
                            .then(response => response.blob())
                            .then(blob => {
                              // Create a blob URL
                              const blobUrl = URL.createObjectURL(blob);
                              
                              // Create a link element
                              const link = document.createElement('a');
                              link.href = blobUrl;
                              link.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                              
                              // Append to body, click and remove
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              
                              // Release the blob URL
                              setTimeout(() => {
                                URL.revokeObjectURL(blobUrl);
                              }, 100);
                            })
                            .catch(error => {
                              console.error('Download failed:', error);
                              alert('Download failed. Please try again.');
                            });
                        }}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Download</span>
                      </button>
                    </div>
                    
                    {/* PDF Modal */}
                    <div id={`pdfModal-${note._id}`} className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4 hidden">
                      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                        <div className="flex justify-between items-center p-4 border-b">
                          <h3 className="text-xl font-semibold">{note.title}</h3>
                          <button 
                            onClick={() => {
                              const modal = document.getElementById(`pdfModal-${note._id}`);
                              if (modal) modal.classList.add('hidden');
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                        <div className="p-4">
                          <iframe 
                            src={`${note.url}`}
                            width="100%" 
                            height="600px" 
                            title={`${note.title} Document Viewer`}
                            className="border rounded"
                            allowFullScreen
                          ></iframe>
                          <div className="mt-4 text-center">
                            <button 
                              onClick={() => {
                                // Create a blob from the URL
                                fetch(note.url)
                                  .then(response => response.blob())
                                  .then(blob => {
                                    // Create a blob URL
                                    const blobUrl = URL.createObjectURL(blob);
                                    
                                    // Create a link element
                                    const link = document.createElement('a');
                                    link.href = blobUrl;
                                    link.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                                    
                                    // Append to body, click and remove
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    
                                    // Release the blob URL
                                    setTimeout(() => {
                                      URL.revokeObjectURL(blobUrl);
                                    }, 100);
                                  })
                                  .catch(error => {
                                    console.error('Download failed:', error);
                                    alert('Download failed. Please try again.');
                                  });
                              }}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                              </svg>
                              Download {note.title}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {videos.map((video) => (
                <div key={video._id} className="bg-white shadow-md rounded-lg overflow-hidden">
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
                    <p className="text-sm text-gray-500">
                      Uploaded on {formatDate(video.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
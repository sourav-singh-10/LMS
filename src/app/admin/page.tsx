'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('documents');
  
  // Document upload state
  const [docTitle, setDocTitle] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docUploading, setDocUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Video upload state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);

  if (status === 'loading') {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!session || !session.user?.isAdmin) { // admin checki
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
  
  // Add navigation to manage page
  const goToManagePage = () => {
    router.push('/admin/manage');
  };

  // Handle document upload
  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!docTitle || !docFile) {
      alert('Please provide a title and select a file');
      return;
    }
    
    setDocUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', docTitle);
      formData.append('description', docDescription);
      formData.append('file', docFile);
      
      const response = await fetch('/api/notes', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      setDocTitle('');
      setDocDescription('');
      setDocFile(null);
      setSuccessMessage('Document uploaded successfully!');
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error uploading document:', error);
      setSuccessMessage('Failed to upload document. Please try again.');
      setUploadSuccess(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setDocUploading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoTitle || !videoUrl) {
      alert('Please provide a title and YouTube URL');
      return;
    }
    
    setVideoUploading(true);
    
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: videoTitle,
          url: videoUrl,
          description: videoDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload video');
      }
      
      setVideoTitle('');
      setVideoUrl('');
      setVideoDescription('');
      setSuccessMessage('Video uploaded successfully!');
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error uploading video:', error);
      setSuccessMessage('Failed to upload video. Please try again.');
      setUploadSuccess(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setVideoUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {successMessage && (
        <div className={`${uploadSuccess ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded relative mb-4`} role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      <div className="mb-6 flex justify-between items-center">
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
              Upload Documents
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'videos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Videos
            </button>
          </nav>
        </div>
        <button
          onClick={goToManagePage}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>Manage Content</span>
        </button>
      </div>
      
      {activeTab === 'documents' ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <form onSubmit={handleDocumentUpload}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                File (Any Document Type)
              </label>
              <div className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${docFile ? 'border-green-400 bg-green-50' : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'}`}>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="flex flex-col items-center justify-center">
                  {docFile ? (
                    <>
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-pulse">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-green-700">File Selected!</h3>
                      <p className="mt-2 text-sm text-green-600 font-medium">
                        {docFile.name}
                      </p>
                      <button 
                        type="button"
                        className="mt-4 inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        onClick={() => document.getElementById('file')?.click()}
                      >
                        Change File
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-blue-700">Upload Your Document</h3>
                      <p className="mt-2 text-sm text-blue-600">
                        Drag and drop a file here, or click the button below
                      </p>
                      <button 
                        type="button"
                        className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg"
                        onClick={() => document.getElementById('file')?.click()}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Click to Upload
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={docUploading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                {docUploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
          <form onSubmit={handleVideoUpload}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoTitle">
                Title
              </label>
              <input
                type="text"
                id="videoTitle"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoUrl">
                YouTube URL
              </label>
              <input
                type="url"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoDescription">
                Description
              </label>
              <textarea
                id="videoDescription"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={videoUploading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                {videoUploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
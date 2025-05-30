import React, { useCallback, useState } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
  files: File[];
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, files }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragError(null);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      const droppedFiles = Array.from(e.dataTransfer.files);
      const jsonFiles = droppedFiles.filter(file => file.type === 'application/json' || file.name.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        setDragError('Please upload JSON files only');
        return;
      }
      
      setDragError(null);
      onFileUpload(jsonFiles);
    },
    [onFileUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFiles = Array.from(e.target.files);
        const jsonFiles = selectedFiles.filter(file => file.type === 'application/json' || file.name.endsWith('.json'));
        
        if (jsonFiles.length === 0) {
          setDragError('Please upload JSON files only');
          return;
        }
        
        setDragError(null);
        onFileUpload(jsonFiles);
      }
    },
    [onFileUpload]
  );

  const removeFile = useCallback(
    (fileToRemove: File) => {
      const updatedFiles = files.filter(file => file !== fileToRemove);
      onFileUpload(updatedFiles);
    },
    [files, onFileUpload]
  );

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : dragError
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload
            size={36}
            className={`${
              isDragging ? 'text-blue-500' : dragError ? 'text-red-500' : 'text-gray-400'
            }`}
          />
          
          {dragError ? (
            <div className="flex items-center text-red-500">
              <AlertCircle size={16} className="mr-1" />
              <p>{dragError}</p>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700">
                Drag and drop your JSON files here
              </p>
              <p className="text-sm text-gray-500">or</p>
            </>
          )}
          
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Browse Files
            <input
              type="file"
              multiple
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">Accepts JSON files only</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
              >
                <div className="flex items-center">
                  <File size={18} className="text-blue-500 mr-2" />
                  <span className="text-gray-700 truncate max-w-xs">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
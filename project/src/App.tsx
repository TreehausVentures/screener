import React from 'react';
import { Upload, ArrowRight, FileDown, RefreshCw } from 'lucide-react';
import FileUploader from './components/FileUploader';
import DataPreview from './components/DataPreview';
import { processJSONFiles } from './utils/jsonProcessor';
import { downloadCSV } from './utils/csvGenerator';
import Header from './components/Header';

function App() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [jsonData, setJsonData] = React.useState<any[]>([]);
  const [csvData, setCsvData] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    setJsonData([]);
    setCsvData('');
    setError(null);
    
    if (uploadedFiles.length > 0) {
      setCurrentStep(2);
      processFiles(uploadedFiles);
    } else {
      setCurrentStep(1);
    }
  };

  const processFiles = async (filesToProcess: File[]) => {
    setIsLoading(true);
    try {
      const result = await processJSONFiles(filesToProcess);
      setJsonData(result);
      setCurrentStep(3);
      setError(null);
    } catch (err) {
      setError(`Error processing files: ${(err as Error).message}`);
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCSV = () => {
    if (jsonData.length === 0) {
      setError('No data to convert. Please upload JSON files first.');
      return;
    }

    setIsLoading(true);
    try {
      const csv = downloadCSV(jsonData);
      setCsvData(csv);
      setCurrentStep(4);
      setError(null);
    } catch (err) {
      setError(`Error generating CSV: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setFiles([]);
    setJsonData([]);
    setCsvData('');
    setCurrentStep(1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">JSON to CSV Converter</h2>
              
              {/* Step indicator */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>1</div>
                <ArrowRight size={16} className="text-gray-400" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>2</div>
                <ArrowRight size={16} className="text-gray-400" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>3</div>
                <ArrowRight size={16} className="text-gray-400" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>4</div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}

            {/* File upload */}
            <section className={`mb-8 ${currentStep !== 1 ? 'hidden sm:block' : 'block'}`}>
              <h3 className="text-xl font-medium text-gray-700 mb-4">Step 1: Upload JSON Files</h3>
              <FileUploader onFileUpload={handleFileUpload} files={files} />
            </section>

            {/* Data preview */}
            {(currentStep >= 2 && jsonData.length > 0) && (
              <section className="mb-8">
                <h3 className="text-xl font-medium text-gray-700 mb-4">Step 2: Preview Data</h3>
                <DataPreview data={jsonData} />
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={generateCSV}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    {isLoading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <FileDown size={18} />
                    )}
                    Generate CSV
                  </button>
                </div>
              </section>
            )}

            {/* CSV download */}
            {(currentStep >= 4 && csvData) && (
              <section className="mb-4">
                <h3 className="text-xl font-medium text-gray-700 mb-4">Step 3: Download CSV</h3>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="mb-4 text-gray-600">Your CSV file is ready for download</p>
                  <a
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`}
                    download="filtered_data.csv"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition-colors duration-200"
                  >
                    <FileDown size={20} />
                    Download CSV
                  </a>
                </div>
              </section>
            )}

            {/* Reset button (after download) */}
            {currentStep >= 4 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={resetApp}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <RefreshCw size={18} />
                  Convert Another File
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
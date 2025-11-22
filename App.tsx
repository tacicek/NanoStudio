import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { processImageRequest } from './services/geminiService';
import { GeneratedImage } from './types';
import { Wand2, Download, AlertCircle, Trash2, History, Image as ImageIcon } from 'lucide-react';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [inputImage, setInputImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (base64: string, mimeType: string) => {
    setInputImage({ data: base64, mimeType });
    setResult(null); // Clear previous result on new upload
    setError(null);
  };

  const handleClearImage = () => {
    setInputImage(null);
    setResult(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a text prompt describing the edit or image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generatedData = await processImageRequest(
        prompt,
        inputImage?.data,
        inputImage?.mimeType
      );
      setResult(generatedData);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = `data:${result.mimeType};base64,${result.data}`;
      link.download = `nanostudio-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resultSrc = result ? `data:${result.mimeType};base64,${result.data}` : null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Nano<span className="text-indigo-400">Studio</span>
            </h1>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Powered by Gemini 2.5 Flash Image
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left Column: Controls & Input */}
          <div className="flex flex-col space-y-6">
            
            {/* Step 1: Image Input */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200">1. Source Image (Optional)</h2>
                {inputImage && (
                   <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30">
                     Edit Mode
                   </span>
                )}
              </div>
              <ImageUploader 
                selectedImage={inputImage ? inputImage.data : null} 
                onImageSelected={handleImageSelected}
                onClear={handleClearImage}
              />
            </div>

            {/* Step 2: Prompt Input */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex-grow flex flex-col">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">2. Instructions</h2>
              <div className="relative flex-grow">
                <textarea
                  className="w-full h-full min-h-[120px] bg-slate-900/80 border border-slate-600 rounded-lg p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all text-lg"
                  placeholder={inputImage 
                    ? "Describe how you want to edit the image... (e.g., 'Add a neon glow effect', 'Turn the dog into a cat', 'Make it look like a sketch')" 
                    : "Describe the image you want to create... (e.g., 'A futuristic city on Mars with flying cars', 'A logo for a coffee shop')"}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3 text-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className={`
                  mt-6 w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center space-x-3 transition-all
                  ${isLoading || !prompt.trim()
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99]'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-6 h-6" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>{inputImage ? 'Edit Image' : 'Generate Image'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col h-full min-h-[500px] lg:min-h-0">
             <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-200">Result</h2>
                  {result && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleDownload}
                        className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-md text-sm transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-grow flex items-center justify-center bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700 relative overflow-hidden">
                  {isLoading ? (
                    <div className="flex flex-col items-center space-y-4 z-10">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-indigo-300 animate-pulse font-medium">Creating masterpiece...</p>
                    </div>
                  ) : resultSrc ? (
                    <img 
                      src={resultSrc} 
                      alt="Generated Result" 
                      className="max-w-full max-h-full object-contain rounded shadow-2xl"
                    />
                  ) : (
                    <div className="text-center p-8 text-slate-500">
                      <div className="inline-block p-4 bg-slate-800 rounded-full mb-4">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-lg">Ready to create</p>
                      <p className="text-sm mt-2">Upload an image and enter a prompt to get started.</p>
                    </div>
                  )}
                </div>
                
                {/* Tips Section */}
                {!result && !isLoading && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                        <h3 className="text-indigo-400 font-medium text-sm mb-2">Editing Tips</h3>
                        <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                          <li>Describe the change clearly ("Make the sky purple")</li>
                          <li>Reference objects in the image ("Remove the dog")</li>
                          <li>Try style changes ("Convert to watercolor")</li>
                        </ul>
                     </div>
                     <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                        <h3 className="text-indigo-400 font-medium text-sm mb-2">Generation Tips</h3>
                        <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                          <li>Be specific about lighting and mood</li>
                          <li>Mention art styles (Photorealistic, Anime, 3D)</li>
                          <li>Complex prompts work well with this model</li>
                        </ul>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
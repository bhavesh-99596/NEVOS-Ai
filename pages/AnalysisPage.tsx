import React, { useState, useCallback, useMemo, useRef } from 'react';
import { analyzeSkinImage } from '../services/geminiService';
import { AnalysisResult, Severity } from '../types';
import { UploadIcon } from '../components/icons/UploadIcon';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import ImageGuidelines from '../components/ImageGuidelines';
import { ExportIcon } from '../components/icons/ExportIcon';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

const AnalysisPage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { user } = useAuth();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setResult(null);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please select a valid image file (e.g., JPG, PNG, WEBP).");
      }
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageFile || !imagePreview || !user) {
      setError("Please select an image first and ensure you are logged in.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        if (base64String) {
          const analysisResult = await analyzeSkinImage(base64String, imageFile.type);
          setResult(analysisResult);

          const newAnalysisPayload = {
            user_id: user.id,
            image_preview: imagePreview,
            condition_name: analysisResult.conditionName,
            severity: analysisResult.severity,
            confidence: analysisResult.confidence,
            description: analysisResult.description,
            recommendation: analysisResult.recommendations.join('\n'), // Store recommendations as a single string
          };

          const { error: insertError } = await supabase.from('analyses').insert([newAnalysisPayload]);

          if (insertError) {
            console.error("Error saving analysis to Supabase:", insertError);
            setError("Could not save analysis result. Please try again.");
          }

        } else {
          throw new Error("Could not convert image to base64.");
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
          throw new Error("Error reading file.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };
  
  const handleDownloadReport = async () => {
    if (!resultsRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F8F5F2',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const imgWidth = pdfWidth - 20; // with margin
      const imgHeight = imgWidth / ratio;
      
      pdf.setFillColor(248, 245, 242); // #F8F5F2
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`NEVOS-Analysis-Report-${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (e) {
      console.error("Error generating PDF:", e);
      setError("Sorry, we couldn't generate the PDF report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const severityStyles = useMemo(() => ({
    [Severity.Normal]: { tag: 'bg-green-100 text-green-800', border: 'border-green-400' },
    [Severity.Mild]: { tag: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-400' },
    [Severity.Moderate]: { tag: 'bg-orange-100 text-orange-800', border: 'border-orange-400' },
    [Severity.Serious]: { tag: 'bg-red-100 text-red-800', border: 'border-red-500' },
    [Severity.Unknown]: { tag: 'bg-gray-100 text-gray-800', border: 'border-gray-400' },
  }), []);

  const predictionBarColor = (confidence: number) => {
    if (confidence > 70) return 'bg-red-500';
    if (confidence > 50) return 'bg-orange-500';
    if (confidence > 20) return 'bg-yellow-500';
    return 'bg-brand-primary';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-brand-heading">New Skin Analysis</h1>
        <p className="text-brand-text mt-1">Upload a clear, well-lit image of a skin lesion for AI analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <ImageGuidelines />
            
            <div 
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${dragOver ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-secondary bg-white hover:border-brand-primary'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-brand-text">
                    <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e.target.files)}
                    accept="image/*"
                />
            </div>

            {imagePreview && !result && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Image Preview</h3>
                    <img src={imagePreview} alt="Skin lesion preview" className="w-full rounded-md object-contain max-h-64" />
                </div>
            )}

            <button
                onClick={handleAnalyzeClick}
                disabled={!imageFile || isLoading}
                className="w-full flex justify-center items-center bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading && <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </button>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </div>

        <div className="space-y-4">
            {isLoading && (
                 <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col items-center justify-center text-gray-500">
                    <SpinnerIcon className="animate-spin h-10 w-10 text-brand-primary mb-4" />
                    <p className="font-semibold">Processing image...</p>
                    <p className="text-sm">This may take a moment.</p>
                </div>
            )}
            {!isLoading && !result && (
                <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center text-gray-500">
                    <p>Your analysis results will appear here.</p>
                </div>
            )}
            {result && (
                <div className="animate-fade-in space-y-4" >
                  <div ref={resultsRef} className="space-y-4 bg-brand-background p-4 rounded-lg">
                    {imagePreview && (
                        <div className={`p-1 border-2 ${(severityStyles[result.severity] || severityStyles.Unknown).border} rounded-lg`}>
                            <img src={imagePreview} alt="Analyzed" className="w-full rounded-md object-contain max-h-60 mx-auto" />
                        </div>
                    )}
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500">Top Result</h3>
                          <p className="text-2xl font-bold font-serif text-brand-heading">{result.conditionName}</p>
                          <p className="text-md font-semibold text-brand-text">Confidence: {result.confidence.toFixed(1)}%</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${(severityStyles[result.severity] || severityStyles.Unknown).tag}`}>
                          {result.severity} Risk
                        </span>
                      </div>
                      <p className="text-brand-text mt-2 text-sm">{result.description}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                      <h3 className="text-lg font-serif font-bold text-brand-heading mb-2">Recommendations</h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, i) => (
                           <li key={i} className="flex items-start space-x-2">
                            <CheckCircleIcon className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
                            <span className="text-brand-text text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                      <h3 className="text-lg font-serif font-bold text-brand-heading mb-3">All Predictions</h3>
                      <div className="space-y-2">
                        {result.allPredictions.map((pred, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-brand-text">{pred.name}</span>
                              <span className="font-semibold text-brand-text">{pred.confidence.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-brand-subtle rounded-full h-2">
                               <div className={`${predictionBarColor(pred.confidence)} h-2 rounded-full`} style={{ width: `${pred.confidence}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                     <div className="bg-orange-100 border-l-4 border-orange-400 text-orange-800 p-3 rounded-r-lg mt-2">
                        <p className="text-sm font-bold">Disclaimer</p>
                        <p className="text-xs">{result.disclaimer}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                      <button
                          onClick={handleDownloadReport}
                          disabled={isExporting}
                          className="w-full flex justify-center items-center bg-brand-heading text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-heading/90 transition-colors disabled:bg-gray-400"
                      >
                          {isExporting ? <SpinnerIcon className="animate-spin h-5 w-5 mr-2" /> : <ExportIcon className="h-5 w-5 mr-2" />}
                          {isExporting ? 'Generating PDF...' : 'Download Report'}
                      </button>
                  </div>

                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
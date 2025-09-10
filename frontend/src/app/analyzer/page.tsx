'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AnalysisResult {
  summary: string;
  context_match_warning?: string;
  flagged_clauses: {
    clause_text: string;
    risk_level: 'High' | 'Medium' | 'Low';
    explanation: string;
    recommendation: string;
  }[];
  overall_recommendation: string;
  error?: string;
}

export default function Analyzer() {
  const [step, setStep] = useState(1);
  const [context, setContext] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleContextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (context.trim()) {
      setStep(2);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('context', context);
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze document');
      }

      setAnalysis(data.analysis);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setContext('');
    setFile(null);
    setAnalysis(null);
    setError('');
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-red-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Low':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Document Analyzer
            </span>
          </h1>
          <p className="text-xl text-gray-300 mt-2">
            Upload your legal document and get AI-powered analysis of potentially problematic clauses
          </p>
        </div>

        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Progress Steps */}
          <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  1
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  step >= 1 ? 'text-white' : 'text-gray-500'
                }`}>Context</div>
              </div>
              <div className={`flex-grow mx-4 h-0.5 ${
                step >= 2 ? 'bg-blue-600' : 'bg-gray-700'
              }`}></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  2
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  step >= 2 ? 'text-white' : 'text-gray-500'
                }`}>Upload</div>
              </div>
              <div className={`flex-grow mx-4 h-0.5 ${
                step >= 3 ? 'bg-blue-600' : 'bg-gray-700'
              }`}></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  3
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  step >= 3 ? 'text-white' : 'text-gray-500'
                }`}>Results</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Context */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Provide Context</h2>
                <p className="text-gray-300 mb-6">
                  Help us understand your document better. What type of legal document is this? What are your concerns?
                </p>
                <form onSubmit={handleContextSubmit}>
                  <div className="mb-4">
                    <textarea
                      className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      rows={5}
                      placeholder="Example: This is an employment contract I'm considering signing. I'm concerned about non-compete clauses and intellectual property rights."
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 2: File Upload */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Upload Document</h2>
                <p className="text-gray-300 mb-6">
                  Upload your legal document in PDF format. We'll analyze it and identify potentially problematic clauses.
                </p>
                <form onSubmit={handleFileSubmit}>
                  <div className="mb-6">
                    <label className="block w-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors bg-gray-900/30">
                        {file ? (
                          <div className="text-center">
                            <p className="text-white font-medium">{file.name}</p>
                            <p className="text-gray-300 text-sm mt-1">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-500"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <p className="mt-1 text-sm text-gray-300">
                              Click to select a PDF file or drag and drop
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                          }
                        }}
                        required
                      />
                    </label>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!file || isAnalyzing}
                      className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                        !file || isAnalyzing
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-700 transition-colors'
                      }`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </div>
                      ) : (
                        'Analyze Document'
                      )}
                    </button>
                  </div>
                </form>
                {error && (
                  <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 3 && analysis && (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-100">Analysis Results</h2>
                  <button
                    onClick={handleReset}
                    className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    New Analysis
                  </button>
                </div>

                {/* Context Mismatch Warning */}
                {analysis.context_match_warning && (
                  <motion.div 
                    variants={itemVariants}
                    className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 mb-6"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8.257 3.099c.636-1.214 2.43-1.214 3.066 0l6.876 13.126c.61 1.166-.27 2.625-1.533 2.625H2.914c-1.263 0-2.143-1.459-1.533-2.625L8.257 3.099zM10 12a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h0a1 1 0 110 2h0a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-300">Context Mismatch Warning</h3>
                        <div className="mt-2 text-sm text-yellow-200">
                          <p>{analysis.context_match_warning}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Summary */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6"
                >
                  <h3 className="font-medium text-blue-300 mb-2">Summary</h3>
                  <p className="text-gray-300">{analysis.summary}</p>
                </motion.div>

                {/* Flagged Clauses */}
                <h3 className="font-medium text-gray-200 mb-3">Flagged Clauses</h3>
                {analysis && analysis.flagged_clauses && analysis.flagged_clauses.length === 0 ? (
                  <motion.div 
                    variants={itemVariants}
                    className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6"
                  >
                    <p className="text-green-300">No problematic clauses were identified.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {analysis && analysis.flagged_clauses && analysis.flagged_clauses.map((clause, index) => (
                      <motion.div 
                        key={index}
                        variants={itemVariants}
                        className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(clause.risk_level)} bg-gray-900`}>
                              {clause.risk_level} Risk
                            </span>
                          </div>
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Clause Text:</h4>
                            <div className="p-3 bg-gray-900 rounded border border-gray-700 text-gray-300 text-sm font-mono">
                              {clause.clause_text}
                            </div>
                          </div>
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Explanation:</h4>
                            <p className="text-gray-400 text-sm">{clause.explanation}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Recommendation:</h4>
                            <p className="text-gray-400 text-sm">{clause.recommendation}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Overall Recommendation */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-purple-900/20 border border-purple-800 rounded-lg p-4"
                >
                  <h3 className="font-medium text-purple-300 mb-2">Overall Recommendation</h3>
                  <p className="text-gray-300">{analysis.overall_recommendation}</p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

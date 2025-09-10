'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Provide Context',
      description: 'Tell us about your document and specific concerns. This helps our AI understand what to look for.',
      icon: (
        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      title: 'Upload Document',
      description: 'Upload your legal document in PDF format. We support contracts, agreements, terms of service, and more.',
      icon: (
        <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      title: 'Review Analysis',
      description: 'Our AI analyzes your document, identifying potential issues, risks, and important clauses you should be aware of. It provides explanations and recommendations.',
      icon: (
        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      question: 'What types of documents can I analyze?',
      answer: 'ClearClause can analyze various legal documents including employment contracts, NDAs, terms of service, privacy policies, rental agreements, and more. The system works best with text-based PDFs.'
    },
    {
      question: 'How accurate is the analysis?',
      answer: 'Our system leverages powerful open-source AI models and enhances their analysis with a legal definition lookup tool for greater accuracy. However, it is an automated tool and should not replace professional legal advice. Always consult a qualified attorney for critical matters.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. ClearClause is designed for privacy. It runs locally on your machine using open-source models via services like Ollama or LM Studio. Your documents are never uploaded to a third-party cloud service, ensuring complete confidentiality.'
    },
    {
      question: 'What AI models can I use?',
      answer: 'You can configure ClearClause to use a variety of open-source models, such as Llama, Mistral, or any other model compatible with Ollama or OpenAI-compatible APIs. This allows you to choose the best model for your needs.'
    },
    {
      question: 'What if I get a context mismatch warning?',
      answer: 'This warning appears if the document content seems to contradict the context you provided (e.g., you specified \"NDA\" but uploaded a lease). The AI will still analyze the document based on its actual content, but you may get better results by providing a more accurate context.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring' as const,
        stiffness: 100 
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Hero Section */}
      <motion.div 
        className="max-w-6xl mx-auto pt-10 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">How </span>
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">It Works</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            It&apos;s a simple, three-step process to get clarity on your legal documents. and identify potentially problematic clauses. Here&apos;s how to use our tool.
          </motion.p>
        </div>

        {/* How It Works Steps */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all hover:bg-gray-800/70"
            >
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {index + 1}. {step.title}
              </h3>
              <p className="text-gray-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Powered by Open-Source AI & Local Processing</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              ClearClause runs on state-of-the-art open-source language models (like Llama 3, Mistral, or any model you choose) hosted locally on your machine via Ollama or LM Studio. This ensures your documents remain private and secure.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Advanced Text Extraction</h3>
                <p className="text-gray-300 mb-4">
                  We use a robust dual-library approach with `pdfplumber` and `PyPDF2` to accurately extract text from your PDF documents, handling various layouts and formats effectively.
                </p>
                <p className="text-gray-400">
                  This ensures the AI receives clean, well-structured text for the most reliable analysis.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Intelligent Clause Analysis</h3>
                <p className="text-gray-300 mb-4">
                  The AI uses function calling to look up legal definitions with its `search_legal_definition` tool, ensuring precise interpretation of complex terms and providing you with more accurate explanations.
                </p>
                <p className="text-gray-400">
                  This combination of powerful language models and specialized tools allows for a nuanced and context-aware legal analysis.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Have questions about how ClearClause works? Find answers to common questions below.
            </p>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <h3 className="text-lg font-medium text-white mb-2">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Ready to analyze your document?</h2>
          <Link 
            href="/analyzer" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Get Started
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { knowledgeAPI } from "../services/knowledgeAPI";
import { Loader2 } from "lucide-react";

export default function TriviaModal({ isOpen, onClose, trivia }) {
  const [knowledgeArticle, setKnowledgeArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch knowledge article when trivia is an ID
  useEffect(() => {
    const fetchKnowledgeArticle = async () => {
      if (!trivia || typeof trivia !== 'string') return;
      
      // Check if it looks like an ID
      if (trivia.length === 24 || trivia.length === 12) {
        try {
          setLoading(true);
          setError(null);
          const article = await knowledgeAPI.getKnowledgeById(trivia);
          setKnowledgeArticle(article);
        } catch (err) {
          console.error('Error fetching knowledge article:', err);
          setError('Failed to load knowledge article');
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen && trivia) {
      fetchKnowledgeArticle();
    } else {
      setKnowledgeArticle(null);
      setError(null);
    }
  }, [isOpen, trivia]);

  if (!isOpen) return null;

  // If loading, show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading knowledge article...</span>
        </div>
      </div>
    );
  }

  // If we have a knowledge article from API
  if (knowledgeArticle) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className="relative bg-white rounded-2xl shadow-2xl
                     w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b bg-gradient-to-r from-purple-500 to-pink-600">
            <h2 className="text-xl font-semibold text-white">
              {knowledgeArticle.title}
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Content - Scrollable */}
          <div
            className="flex-1 px-8 py-6 overflow-y-auto
                       prose prose-base md:prose-lg max-w-none
                       text-gray-700"
            dangerouslySetInnerHTML={{
              __html: knowledgeArticle.content || ''
            }}
          />
        </div>
      </div>
    );
  }

  // If there's an error loading
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-8">
          <div className="flex items-center justify-between px-8 py-5 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Trivia</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Default: show trivia content directly (for inline HTML content)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl
                   w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
             Trivia
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          className="flex-1 px-8 py-6 overflow-y-auto
                     prose prose-base md:prose-lg max-w-none
                     text-gray-700"
          dangerouslySetInnerHTML={{
            __html: Array.isArray(trivia) ? trivia.join("") : trivia
          }}
        />

        {/* Footer */}
        {/* <div className="px-8 py-4 border-t text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm rounded-lg
                       bg-gray-100 hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
}

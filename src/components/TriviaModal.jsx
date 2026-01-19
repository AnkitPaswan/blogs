export default function TriviaModal({ isOpen, onClose, trivia }) {
  if (!isOpen) return null;

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
                   w-full max-w-3xl mx-4 max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b">
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

        {/* Content */}
        <div
          className="px-8 py-6 overflow-y-auto
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

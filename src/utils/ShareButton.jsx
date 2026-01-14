import { useState } from "react";
import { Share2, Copy, Check, X } from "lucide-react";

export default function ShareButton({ 
  url, 
  title, 
  size = "default", 
  showLabel = true,
  className = "" 
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  // Get the full URL
  const getShareUrl = () => {
    if (url) {
      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        return window.location.origin + url;
      }
      return url;
    }
    // Fallback to current page URL
    return window.location.href;
  };

  const shareUrl = getShareUrl();

  // Native Web Share API
  const handleNativeShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          text: title || "Check out this post!",
          url: shareUrl,
        });
        setShowDropdown(false);
      } catch (error) {
        // User cancelled or share failed
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // Fall back to dropdown menu
      setShowDropdown(true);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast(false);
        setCopied(false);
      }, 3000);
      
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Social media sharing
  const shareOnTwitter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title || "")}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShowDropdown(false);
  };

  const shareOnFacebook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
    setShowDropdown(false);
  };

  const shareOnWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title || ""}\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
    setShowDropdown(false);
  };

  const shareOnLinkedIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
    setShowDropdown(false);
  };

  // Icon size classes
  const iconSize = size === "small" ? "w-4 h-4" : size === "large" ? "w-6 h-6" : "w-5 h-5";
  const buttonPadding = size === "small" ? "p-1" : size === "large" ? "p-3" : "p-2";

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className={`
          ${buttonPadding}
          flex items-center justify-center
          text-gray-500 
          hover:text-blue-600 
          hover:bg-blue-50 
          rounded-lg 
          transition-all 
          duration-200
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500
        `}
        title="Share this post"
      >
        <Share2 className={iconSize} />
        {showLabel && <span className={`ml-1 ${size === "small" ? "text-xs" : "text-sm"}`}>Share</span>}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
          <div className="px-3 py-2 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700">Share via</h4>
          </div>
          
          <button
            onClick={shareOnTwitter}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <span className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold">𝕏</span>
            <span>Twitter (X)</span>
          </button>
          
          <button
            onClick={shareOnFacebook}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">f</span>
            <span>Facebook</span>
          </button>
          
          <button
            onClick={shareOnWhatsApp}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">💬</span>
            <span>WhatsApp</span>
          </button>
          
          <button
            onClick={shareOnLinkedIn}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <span className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">in</span>
            <span>LinkedIn</span>
          </button>
          
          <div className="border-t border-gray-100 my-2"></div>
          
          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <span>{copied ? "Copied!" : "Copy link"}</span>
          </button>
          
          <button
            onClick={() => setShowDropdown(false)}
            className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-gray-500" />
            </div>
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm">Link copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}


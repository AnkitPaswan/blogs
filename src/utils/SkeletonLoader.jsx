export function SkeletonLoader({ count = 4, className = "" }) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse"
        >
          {/* Top Row: Image + Title */}
          <div className="flex gap-4 mb-3">
            {/* Thumbnail skeleton */}
            <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />
            
            {/* Title skeleton */}
            <div className="flex-1">
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-4/5 bg-gray-200 rounded" />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4">
              <div className="h-4 w-8 bg-gray-200 rounded" />
              <div className="h-4 w-8 bg-gray-200 rounded" />
              <div className="h-4 w-6 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};


export function SkeletonLoaderForHome() {
  return (
    <div className="p-4 md:p-10 rounded-xl bg-gray-50">
      <div className="pr-0 sm:pr-16 md:pr-10">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-10" />

        {/* Trending Section Skeleton */}
        <div className="mb-14">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-5" />
          <div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse flex flex-col h-[260px] w-[88vw] xs:w-[92vw] sm:w-72 md:w-80 flex-shrink-0"
              >
                <div className="flex gap-4 mb-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded" />
                  <div className="h-3 w-4/5 bg-gray-200 rounded" />
                </div>
                <div className="mt-auto pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-8 bg-gray-200 rounded" />
                    <div className="h-4 w-8 bg-gray-200 rounded" />
                    <div className="h-4 w-6 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export function SkeletonLoaderForPostDetails(){
  return (<div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Post Header Skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Image Skeleton */}
            <div className="h-64 md:h-80 lg:h-96 bg-gray-200 animate-pulse" />

            {/* Content Skeleton */}
            <div className="p-6 md:p-8">
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Comments Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      );
} 

export function SkeletonLoaderForCategory(){
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden animate-pulse"
            >
              {/* Category Header Skeleton */}
              <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg" />
                  <div>
                    <div className="h-5 w-24 bg-white/20 rounded mb-1" />
                    <div className="h-3 w-20 bg-white/20 rounded" />
                  </div>
                </div>
              </div>

              {/* Category Content Skeleton */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded" />
                  <div className="h-3 w-4/5 bg-gray-200 rounded" />
                </div>

                {/* Actions Skeleton */}
                <div className="flex space-x-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
  )
};


export function SkeletonLoaderForPosts(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="group bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden shadow-sm animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="relative h-24 overflow-hidden bg-gray-200" />

          {/* Content */}
          <div className="p-3">
            {/* Title Skeleton */}
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />

            {/* Actions Skeleton */}
            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-gray-200 rounded-md" />
              <div className="flex-1 h-8 bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

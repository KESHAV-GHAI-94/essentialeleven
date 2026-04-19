import { Star, ShieldCheck, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  user?: { name: string };
  product?: any;
}

interface ProductReviewsProps {
  reviews?: Review[];
}

export function ProductReviews({ reviews = [] }: ProductReviewsProps) {
  // Aggregate data
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
     if (r.rating >= 1 && r.rating <= 5) {
        ratingCounts[r.rating as keyof typeof ratingCounts]++;
     }
  });

  return (
    <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-navy-100 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-8 border-b border-navy-100 pb-4">Customer Reviews</h2>
      
      {/* Top Level Stats */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mb-12">
        <div className="flex flex-col items-center justify-center text-center max-w-[200px]">
          <h3 className="text-6xl font-black text-navy-900">{averageRating}</h3>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-5 h-5 ${i <= parseFloat(averageRating) ? 'text-saffron fill-saffron' : 'text-navy-200 fill-navy-200'}`} />
            ))}
          </div>
          <p className="text-navy-400 font-medium">Based on {totalReviews} reviews</p>
        </div>
        
        <div className="flex-1 space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating as keyof typeof ratingCounts];
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={rating} className="flex items-center gap-4 text-sm font-bold text-navy-600">
                <span className="w-8 shrink-0">{rating} ★</span>
                <div className="flex-1 h-2.5 bg-navy-50 rounded-full overflow-hidden">
                  <div className="h-full bg-saffron rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
                <span className="w-12 text-right text-navy-400">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actual Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-6 rounded-2xl bg-navy-50 border border-navy-100/50 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                 <div className="flex gap-0.5">
                   {[1, 2, 3, 4, 5].map((i) => (
                     <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'text-saffron fill-saffron' : 'text-navy-200 fill-navy-200'}`} />
                   ))}
                 </div>
                 <span className="text-xs font-semibold text-navy-300">
                    {new Date(review.createdAt).toLocaleDateString()}
                 </span>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-4 flex-1">
                {review.comment}
              </p>
              <div className="flex justify-between items-center border-t border-navy-200/50 pt-4 mt-auto">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                       {review.user?.name?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-900">{review.user?.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 uppercase tracking-wider"><ShieldCheck className="w-3 h-3"/> Verified Buyer</p>
                    </div>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-navy-400 font-medium col-span-full">There are no reviews for this product yet. Be the first to share your thoughts!</p>
        )}
      </div>
      
    </div>
  );
}

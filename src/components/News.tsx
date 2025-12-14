import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  created_at: string;
};

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  // Helper function to get the full Supabase storage URL
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;

    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Otherwise, construct the full Supabase storage URL
    const { data } = supabase.storage.from('news-images').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  // Function to toggle article content expansion
  const toggleArticleContent = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select("id, title, excerpt, content, featured_image_url, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching news:", error);
      } else {
        setNewsItems(data || []);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  // Loading state (beautiful skeletons)
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
          Latest News
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (newsItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">Latest News</h2>
        <p className="text-muted-foreground text-lg">No news yet — check back soon!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Latest News
      </h2>

      {/* Responsive grid: 1 column mobile, 2 tablet, 3 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item, index) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {getImageUrl(item.featured_image_url) ? (
              <img
                src={getImageUrl(item.featured_image_url)!}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="bg-muted w-full h-48 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}

            <CardContent className="p-5">
              <h4 className="font-bold text-lg mb-2 line-clamp-2 text-foreground">
                {item.title}
              </h4>
              <p
                className="text-sm text-muted-foreground leading-relaxed line-clamp-3 cursor-pointer hover:text-primary transition-colors"
                onClick={() => toggleArticleContent(item.id)}
              >
                {item.excerpt || "No description available"}
                <span className="ml-2 text-xs text-primary">
                  {expandedArticle === item.id ? '▼' : '▶'}
                </span>
              </p>

              {expandedArticle === item.id && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(item.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default News;

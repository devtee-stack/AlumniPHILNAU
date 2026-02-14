import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

type NewsArticle = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  created_at: string;
  author_id: string | null;
  published: boolean | null;
  published_at: string | null;
};

const NewsArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError("Article ID not found");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("news_articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (fetchError) {
        console.error("Error fetching article:", fetchError);
        setError("Article not found or could not be loaded");
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [articleId]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-destructive">Article Not Found</h2>
        <p className="text-muted-foreground mt-2">
          {error || "The article you're looking for doesn't exist."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to News
        </Button>
      </Link>

      <article>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          {article.title}
        </h1>

        <p className="text-muted-foreground mb-6">
          {new Date(article.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {getImageUrl(article.featured_image_url) && (
          <img
            src={getImageUrl(article.featured_image_url)!}
            alt={article.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8"
          />
        )}

        {article.excerpt && (
          <p className="text-lg text-muted-foreground mb-6 italic">
            {article.excerpt}
          </p>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
};

export default NewsArticlePage;

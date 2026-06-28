import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus, Loader2, Reply } from "lucide-react";
import { toast } from "sonner";

type Thread = {
  id: string;
  title: string;
  body: string;
  excerpt?: string | null;
  category_id: string;
  user_id: string;
  reply_count: number | null;

  created_at: string;
  updated_at?: string;

  user_name?: string;
  avatar_url?: string | null;
  category_name?: string;
};

type Reply = {
  id: string;
  content: string;
  author_id: string; // forum_replies schema uses author_id (verified)
  created_at: string;
  thread_id: string;
  updated_at?: string;

  user_name?: string;
  avatar_url?: string | null;
};

type Category = {
  id: string;
  name: string;
  description: string | null;
};

const Forum = ({ openAuthModal }: { openAuthModal: () => void }) => {
  const { user } = useAuth();
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // New thread form
  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");

  // Reply form
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("forum_categories").select("*");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  // Fetch threads list (joined in one query)
  useEffect(() => {
    if (!threadId) {
      const fetchThreads = async () => {
        setLoading(true);

        let query = supabase
          .from("forum_threads")
          .select(`
            *,
            profiles(
              full_name,
              avatar_url
            ),
            forum_categories(
              name
            )
          `)
          .order("created_at", { ascending: false });

        if (activeCategory !== "All") {
          const category = categories.find((c) => c.name === activeCategory);
          if (category) query = query.eq("category_id", category.id);
        }

        const { data, error } = await query;

        if (error) {
          toast.error("Failed to load threads");
          setThreads([]);
          setLoading(false);
          return;
        }

        const mappedThreads: Thread[] = (data || []).map((t: any) => ({
          ...t,
          user_name: t.profiles?.full_name ?? undefined,
          avatar_url: t.profiles?.avatar_url ?? null,
          category_name: t.forum_categories?.name ?? undefined,
          // ensure preview fields exist
          excerpt: t.excerpt ?? null,
        }));

        setThreads(mappedThreads);
        setLoading(false);
      };

      fetchThreads();
    }
  }, [threadId, activeCategory, categories]);

  // Fetch single thread + replies (joined in one query for thread/profile/category)
  useEffect(() => {
    if (threadId) {
      const fetchThreadAndReplies = async () => {
        setLoading(true);
        setCurrentThread(null);

        const {
          data: threadData,
          error: threadError,
        } = await supabase
          .from("forum_threads")
          .select(`
            *,
            profiles(
              full_name,
              avatar_url
            ),
            forum_categories(
              name
            )
          `)
          .eq("id", threadId)
          .single();

        if (threadError || !threadData) {
          setCurrentThread(null);
          toast.error("Thread not found");
          setLoading(false);
          return;
        }

        setCurrentThread({
          ...threadData,
          user_name: threadData.profiles?.full_name ?? undefined,
          avatar_url: threadData.profiles?.avatar_url ?? null,
          category_name: threadData.forum_categories?.name ?? undefined,
          excerpt: threadData.excerpt ?? null,
        });

        const { data: repliesData } = await supabase
          .from("forum_replies")
          .select(`
            *,
            profiles(
              full_name,
              avatar_url
            )
          `)
          .eq("thread_id", threadId)
          .order("created_at");

        const mappedReplies: Reply[] = (repliesData || []).map((r: any) => ({
          ...r,
          user_name: r.profiles?.full_name ?? undefined,
          avatar_url: r.profiles?.avatar_url ?? null,
        }));

        setReplies(mappedReplies);
        setLoading(false);
      };

      fetchThreadAndReplies();
    }
  }, [threadId]);

  const handleCreateThread = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (!newTitle || !newBody) {
      toast.error("Title and body are required");
      return;
    }

    if (!newCategoryId) {
      toast.error("Please choose a category");
      return;
    }

    const threadData = {
      title: newTitle,
      body: newBody,
      excerpt: newBody.substring(0, 180),
      category_id: newCategoryId,
      user_id: user.id,
    } as any;

    console.log("Thread payload:", threadData);

    const { data, error } = await supabase
      .from("forum_threads")
      .insert(threadData)
      .select();

    console.log("Insert data:", data);
    console.error("Insert error:", error);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Thread created!");
    setShowNewThread(false);
    setNewTitle("");
    setNewBody("");
    setNewCategoryId("");

    // Refresh threads by fetching from database (joined)
    setLoading(true);

    let query = supabase
      .from("forum_threads")
      .select(`
        *,
        profiles(
          full_name,
          avatar_url
        ),
        forum_categories(
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (activeCategory !== "All") {
      const category = categories.find((c) => c.name === activeCategory);
      if (category) query = query.eq("category_id", category.id);
    }

    const { data: refreshedThreads, error: fetchError } = await query;

    if (fetchError) {
      toast.error("Failed to load threads");
      setThreads([]);
      setLoading(false);
      return;
    }

    const mappedThreads: Thread[] = ((refreshedThreads as any[] | null | undefined) ?? []).map(
      (t: any) => {
        const categoryName =
          categories.find((c) => c.id === t?.category_id)?.name ?? undefined;

        return {
          id: String(t?.id),
          title: String(t?.title),
          body: String(t?.body ?? ""),
          excerpt: t?.excerpt ?? t?.body?.slice?.(0, 180) ?? null,
          category_id: String(t?.category_id),
          user_id: String(t?.user_id ?? ""),
          reply_count: (t?.reply_count ?? null) as number | null,
          created_at: String(t?.created_at),
          updated_at: t?.updated_at ?? undefined,
          user_name: undefined, // loaded via joins on list view; keep safe here
          avatar_url: null,
          category_name: categoryName,
        };
      }
    );

    setThreads(mappedThreads as unknown as Thread[]);
    setLoading(false);
  };

  const handleReply = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    const { error } = await supabase.from("forum_replies").insert({
      thread_id: threadId,
      content: replyContent,
      author_id: user.id,
    } as any);

    if (error) toast.error("Failed to post reply");
    else {
      toast.success("Reply posted!");
      setReplyContent("");
      setReplyingTo(null);
      // Refresh replies
      const { data } = await supabase
        .from("forum_replies")
        .select(`
          *,
          profiles(
            full_name,
            avatar_url
          )
        `)
        .eq("thread_id", threadId)
        .order("created_at");

      const mappedReplies: Reply[] = (data || []).map((r: any) => ({
        ...r,
        user_name: r.profiles?.full_name ?? undefined,
        avatar_url: r.profiles?.avatar_url ?? null,
      }));

      setReplies(mappedReplies);
    }
  };

  // Thread List View
  if (!threadId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
          Discussion Forum
        </h2>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Categories */}
          <Card className="p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Categories</h3>
              {user && (
                <Button size="sm" onClick={() => setShowNewThread(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory("All")}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === "All"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === cat.name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Threads List */}
          <div>
            {!user && (
              <Card className="p-6 mb-6 bg-gold/10">
                <p className="text-sm">
                  Guests can read.{" "}
                  <button onClick={openAuthModal} className="text-primary underline">
                    Login/Register
                  </button>{" "}
                  to post.
                </p>
              </Card>
            )}

            <Button onClick={() => setShowNewThread(true)} className="mb-6">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start New Thread
            </Button>

            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </div>
            ) : threads.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground">
                No threads yet. Be the first to start a discussion!
              </Card>
            ) : (
              <div className="space-y-4">
                {threads.map((thread) => {
                  const category = categories.find(c => c.id === thread.category_id);
                  return (
                    <Link to={`/forum/${thread.id}`} key={thread.id}>
                      <Card className="p-6 hover:shadow-lg transition-all">
                        <h3 className="text-xl font-bold mb-2">{thread.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 mb-3">
                          {thread.excerpt || thread.body}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <span>
                            by{" "}
                            {thread.user_name ??
                              thread.user_id.slice(0, 8) + "..."}
                          </span>
                          <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                          <Badge variant="outline">
                            {thread.category_name ??
                              category?.name ??
                              "General"}
                          </Badge>
                          <span>{thread.reply_count ?? 0} replies</span>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Create Thread Modal */}
        {showNewThread && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Start New Thread</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Choose category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Textarea
                  placeholder="Write your post..."
                  rows={8}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                />
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowNewThread(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateThread}>
                    Post Thread
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Full Thread View
  if (threadId) {
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        </div>
      );
    }

    if (!currentThread) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate("/forum")} className="mb-6">
            ← Back to Forum
          </Button>
          <Card className="p-6">
            <p className="text-muted-foreground">Thread not found.</p>
          </Card>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/forum")} className="mb-6">
          ← Back to Forum
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{currentThread.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span>
                by{" "}
                {currentThread.user_name ??
                  currentThread.user_id.slice(0, 8) + "..."}
              </span>
              <span>{new Date(currentThread.created_at).toLocaleString()}</span>
              <Badge variant="outline">
                {currentThread.category_name ?? "General"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground">{currentThread.body}</p>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Replies ({replies.length})</h3>

          {!user && (
            <Card className="p-6 mb-6 bg-gold/10">
              <p>
                <button onClick={openAuthModal} className="text-primary underline">
                  Login
                </button>{" "}
                to reply.
              </p>
            </Card>
          )}

          {/* Top-level reply box */}
          {user && (
            <Card className="mb-8 p-6">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <Button className="mt-4" onClick={handleReply}>
                Post Reply
              </Button>
            </Card>
          )}

          {/* Render replies */}
          <div className="space-y-4">
            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    by{" "}
                    {reply.user_name ??
                      reply.author_id.slice(0, 8) + "..."}{" "}
                    • {new Date(reply.created_at).toLocaleString()}
                  </p>
                  <p className="whitespace-pre-wrap">{reply.content}</p>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setReplyingTo(reply.id)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  )}
                  {replyingTo === reply.id && (
                    <div className="mt-4">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleReply}>
                          Post Reply
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center text-muted-foreground py-8">
        Select a thread to view details.
      </div>
    </div>
  );
};

export default Forum;

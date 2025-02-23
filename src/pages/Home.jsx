import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";
import Tweet from "../components/Tweet";
import "../main.css";

function Home() {
    const { user } = useUser();
    const [tweets, setTweets] = useState([]);
    const [newTweet, setNewTweet] = useState("");

    const loadTweets = useCallback(async () => {
        try {
            const { data: tweetsData, error } = await supabase
                .from("tweets")
                .select("*, likes(user_id)")
                .order("created_at", { ascending: false });

            if (error) throw error;

            const tweetsWithLikes = tweetsData.map((tweet) => ({
                ...tweet,
                isLiked: tweet.likes?.some((like) => like.user_id === user.id),
                likesCount: tweet.likes?.length || 0,
            }));

            setTweets(tweetsWithLikes);
        } catch (error) {
            console.error("Error loading tweets:", error);
        }
    }, [user.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTweet.trim()) return;

        try {
            const { error } = await supabase.from("tweets").insert({
                content: newTweet,
                user_id: user.id,
                username: user.username || user.firstName,
                user_image: user.imageUrl,
            });

            if (error) throw error;

            setNewTweet("");
            loadTweets();
        } catch (error) {
            console.error("Error creating tweet:", error);
        }
    };

    useEffect(() => {
        loadTweets();
    }, [user.id, loadTweets]);

    return (
        <div className="main-content">
            <form className="tweet-input-container" onSubmit={handleSubmit}>
                <textarea
                    className="tweet-input"
                    value={newTweet}
                    onChange={(e) => setNewTweet(e.target.value)}
                    placeholder="What's happening?"
                    rows="3"
                />
                <div>
                    <button className="tweet-button" type="submit">
                        Tweet
                    </button>
                </div>
            </form>

            <div>
                {tweets.map((tweet) => (
                    <Tweet
                        className="tweet-card"
                        key={tweet.id}
                        tweet={tweet}
                        onLike={loadTweets}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "../lib/supabase";

function Tweet({ tweet, onLike }) {
    const { user } = useUser();
    const [isLiked, setIsLiked] = useState(tweet.isLiked);
    const [likesCount, setLikesCount] = useState(tweet.likesCount || 0);

    // Update state when props change
    useEffect(() => {
        setIsLiked(tweet.isLiked);
        setLikesCount(tweet.likesCount || 0);
    }, [tweet.isLiked, tweet.likesCount]);

    const handleLike = useCallback(async () => {
        try {
            if (isLiked) {
                await supabase
                    .from("likes")
                    .delete()
                    .match({ user_id: user.id, tweet_id: tweet.id });
                setLikesCount((prev) => prev - 1);
            } else {
                await supabase
                    .from("likes")
                    .insert({ user_id: user.id, tweet_id: tweet.id });
                setLikesCount((prev) => prev + 1);
            }
            setIsLiked(!isLiked);
            if (onLike) onLike();
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    }, [isLiked, user.id, tweet.id, onLike]);

    return (
        <div className="tweet-card">
            <div>
                <img
                    className="avatar"
                    src={tweet.user_image}
                    alt={tweet.username}
                />
                <div>
                    <div className="tweet-header">
                        <span className="user-name">{tweet.username}</span>
                        <span className="tweet-time">
                            {formatDistanceToNow(new Date(tweet.created_at), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                    <p className="tweet-content">{tweet.content}</p>
                    <div className="tweet-actions">
                        <button className="like-button" onClick={handleLike}>
                            <span className="heart-icon">
                                {isLiked ? <HeartSolidIcon /> : <HeartIcon />}
                            </span>
                            <span>{likesCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tweet;

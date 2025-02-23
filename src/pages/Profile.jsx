import { useState, useEffect, useCallback } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";
import Tweet from "../components/Tweet";
import "../profile.css";

function Profile() {
    const { user } = useUser();
    const [tweets, setTweets] = useState([]);

    const loadUserTweets = useCallback(async () => {
        try {
            const { data: tweetsData, error } = await supabase
                .from("tweets")
                .select("*, likes(user_id)")
                .eq("user_id", user.id)
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

    useEffect(() => {
        loadUserTweets();
    }, [user.id, loadUserTweets]);

    const userButtonAppearance = {
        elements: {
            userButtonAvatarBox: {
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--accent-color)",
            },
        },
    };

    return (
        <div className="main-content">
            <div className="profile-container">
                <div className="profile-header">
                    <UserButton
                        className="profile-image"
                        appearance={userButtonAppearance}
                    />
                    <div className="profile-info">
                        <h2>{user.username || user.firstName}</h2>
                        <p>
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="tweets-section">
                <h3>Your Tweets</h3>
                <div className="tweets-container">
                    {tweets.map((tweet) => (
                        <Tweet
                            key={tweet.id}
                            tweet={tweet}
                            onLike={() => loadUserTweets()}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;

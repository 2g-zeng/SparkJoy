import React, { useEffect, useState, useContext } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { getStories } from '../services/api';

const StoryLibrary = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();      
    useEffect(() => {
        const fetchStories = async () => {
            if (!user || !user.username) {
                setError("No user found");
                setLoading(false);
                return;
            }
            
            try {
                // If user has token, they're authenticated (non-guest)
                if (user.token) {
                    const data = await getStories(user.token, user.username);
                    setStories(data);
                } else {
                    // Guest users don't have a token, so we'll pass null for token
                    const data = await getStories(null, user.username);
                    setStories(data);
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStories();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                {error}
            </div>
        );
    }

    const handleSelectStory = (story) => {
        navigate(`/story/${story.id}`);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                    <BookOpen className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No Stories Yet</h3>
                    <p className="text-gray-500">
                        {user.token ? 
                            "You haven't created any stories yet. Try generating a new story!" :
                            "Guest users can't save stories. Log in to create and save your magical tales!"}
                    </p>
                </div>
            ) : (
                stories.map((story) => (
                    <div
                        key={story.id}
                        onClick={() => handleSelectStory(story)}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200"
                    >
                        <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <BookOpen className="w-20 h-20 text-white" />
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{story.title}</h3>
                            <p className="text-gray-600 text-sm">
                                Created on {new Date(story.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-purple-600 font-semibold mt-2">
                                {story.pages.length} pages
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StoryLibrary;
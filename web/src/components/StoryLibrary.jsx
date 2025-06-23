import React, { useEffect, useState, useContext } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { getStories, getStory } from '../services/api';
import Cookies from 'js-cookie';

const StoryLibrary = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStoryId, setSelectedStoryId] = useState(null); // Track the selected story for loading state
    const [isLoadingStory, setIsLoadingStory] = useState(false); // Loading state for story fetch
    const [storyError, setStoryError] = useState({ id: null, message: '' }); // Track errors for specific stories
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();      
    useEffect(() => {
        const fetchStories = async () => {
            // Get authentication data from cookies first
            const tokenFromCookie = Cookies.get('userToken');
            const usernameFromCookie = Cookies.get('username');
            
            // If there's no username in cookie or context, show error
            if ((!usernameFromCookie && (!user || !user.username))) {
                setError("No user found");
                setLoading(false);
                return;
            }
            
            // Use cookie values as priority, fall back to context
            const username = usernameFromCookie || user.username;
            const token = tokenFromCookie || user.token;
            const isGuest = username === 'Guest' || !token;
            
            try {
                // If user has token (not a guest), they're authenticated
                if (!isGuest) {
                    const data = await getStories(token, username);
                    setStories(data);
                } else {
                    // Guest users don't have a token, so we'll pass null for token
                    const data = await getStories(null, username);
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

    const handleSelectStory = async (story) => {
        try {
            // Clear any previous errors
            setStoryError({ id: null, message: '' });
            
            // Set loading states
            setIsLoadingStory(true);
            setSelectedStoryId(story.id);
            
            // Get authentication data from cookies first, fall back to context
            const token = Cookies.get('userToken') || user?.token;
            
            // Get the full story details by ID
            const fullStory = await getStory(token, story.id);

            // Navigate to story viewer with full story data
            navigate(`/story/${story.id}`, { state: { story: fullStory } });
        } catch (error) {
            console.error("Error loading story:", error);
            // Set error state for this specific story
            setStoryError({ 
                id: story.id, 
                message: `Failed to load: ${error.message || 'Unknown error'}` 
            });
        } finally {
            setIsLoadingStory(false);
            setSelectedStoryId(null);
        }
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                    <BookOpen className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No Stories Yet</h3>
                    <p className="text-gray-500">
                        {Cookies.get('userToken') || user.token ? 
                            "You haven't created any stories yet. Try generating a new story!" :
                            "Guest users can't save stories. Log in to create and save your magical tales!"}
                    </p>
                </div>
            ) : (
                stories.map((story) => (
                    <div key={story.id} className="relative">
                        <div
                            onClick={() => !isLoadingStory && handleSelectStory(story)}
                            className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-200 
                                ${isLoadingStory && selectedStoryId === story.id ? 'opacity-75' : 'hover:scale-105'}`}
                        >
                            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                {isLoadingStory && selectedStoryId === story.id ? (
                                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <BookOpen className="w-20 h-20 text-white" />
                                )}
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
                        
                        {/* Error message below the tile */}
                        {storyError.id === story.id && (
                            <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded text-sm text-red-600">
                                <div className="font-semibold">Error</div>
                                <div>{storyError.message}</div>
                                <button 
                                    onClick={() => setStoryError({ id: null, message: '' })}
                                    className="mt-1 text-xs text-red-500 hover:text-red-700 underline"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default StoryLibrary;
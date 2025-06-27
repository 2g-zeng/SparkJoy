import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Sparkles, ChevronLeft, ChevronRight, Home, Volume2, 
    Save, Settings, Share2, ArrowLeft, Star, Heart, 
    ThumbsUp, Music, PauseCircle, PlayCircle 
} from 'lucide-react';
import { AuthContext } from './AuthProvider';
import { saveStory } from '../services/api';

const StoryViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const story = location.state?.story;
    
    // Check if user is authenticated (has a token) or is a guest
    const isAuthenticated = user && user.token;
    
    const [currentSpread, setCurrentSpread] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setError] = useState('');
    const [flipDirection, setFlipDirection] = useState("right");

    // Create pages array with cover page
    const allPages = [
        {
            pageNumber: 0,
            text: "",
            illustration: story?.pages[0]?.illustration || "cover",
            isCover: true,
            title: story?.title
        },
        ...(story?.pages || [])
    ];

    // Number of actual page spreads (excluding cover)
    const totalSpreads = Math.ceil((allPages.length - 1) / 2);
    
    // Handle page navigation
    const goToSpread = (spread) => {
        if (spread >= 0 && spread < totalSpreads) {
            // Stop current audio when changing pages
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            setIsFlipping(true);
            setCurrentSpread(spread);
            setTimeout(() => setIsFlipping(false), 500);
        }
    };
    
    // Format page numbers for display like in SamplePage
    const getFormattedPageDisplay = () => {
        if (currentSpread === 0) {
            return 'COVER';
        }
        return `PAGE ${currentSpread} OF ${totalSpreads - 1}`;
    };

    // Handle audio playback
    const handleSpeak = () => {
        const currentPages = getCurrentSpreadPages();

        if (isReading) {
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            setIsReading(false);
            return;
        }

        // Use AI-generated audio if available, otherwise use text-to-speech
        const pageWithAudio = currentPages.find(page => page.audioUrl);
        if (pageWithAudio?.audioUrl) {
            const audio = new Audio(pageWithAudio.audioUrl);
            audio.onended = () => {
                setIsReading(false);
                setAudioPlayer(null);
            };
            audio.play();
            setAudioPlayer(audio);
            setIsReading(true);
        } else {
            // Fallback to browser's text-to-speech
            if (!window.speechSynthesis) return;

            const textToRead = currentPages
                .map(page => page.text)
                .filter(Boolean)
                .join(". ");

            if (!textToRead) return;

            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.onend = () => setIsReading(false);

            setIsReading(true);
            window.speechSynthesis.speak(utterance);
        }
    };

    // Get current spread pages
    const getCurrentSpreadPages = () => {
        if (currentSpread === 0) {
            return [allPages[0]];
        }
        const startIdx = (currentSpread * 2) - 1;
        return allPages.slice(startIdx, startIdx + 2);
    };

    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [audioPlayer]);

    // Set page background colors based on content or mood
    const getPageBackground = (pageIndex) => {
        const colors = [
            "bg-gradient-to-br from-[#FFECD2] to-[#FFCACC]", // Cover gradient
            "bg-[#F5FFE8]", // Light green
            "bg-[#E9F7FF]", // Light blue
            "bg-[#FFF5E9]", // Light orange
            "bg-[#F9EBFF]", // Light purple
            "bg-[#E9FFF2]"  // Light mint
        ];
        
        // If it's a cover page, return the cover gradient
        if (allPages[pageIndex]?.isCover) {
            return colors[0];
        }
        
        // Otherwise cycle through the other colors
        const colorIndex = (pageIndex % (colors.length - 1)) + 1;
        return colors[colorIndex];
    };

    const leftPageIndex = currentSpread * 2;
    const rightPageIndex = currentSpread * 2 + 1;
    const leftPage = allPages[leftPageIndex];
    const rightPage = allPages[rightPageIndex];

    const nextSpread = () => {
        if (rightPageIndex < allPages.length - 1) {
            setFlipDirection("left");
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentSpread(currentSpread + 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    const prevSpread = () => {
        if (currentSpread > 0) {
            setFlipDirection("right");
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentSpread(currentSpread - 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const getPageNumbers = () => {
        const visiblePages = [];
        if (leftPage && !leftPage.isCover) visiblePages.push(leftPage.pageNumber);
        if (rightPage && !rightPage.isCover) visiblePages.push(rightPage.pageNumber);
        return visiblePages;
    };

    const pageNumbers = getPageNumbers();
    const pageDisplay = pageNumbers.length > 0 ?
        (pageNumbers.length === 1 ? `Page ${pageNumbers[0]}` : `Page ${pageNumbers[0]}/${pageNumbers[1]}`) :
        'Cover';

    // Handle save story
    const handleSaveStory = async () => {
        try {
            setIsSaving(true);
            setError('');
            await saveStory(user.token, story, user.username);
            // Show success feedback
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-out';
            notification.textContent = 'Story saved successfully!';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } catch (error) {
            setError(error.message);
            // Show error feedback
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-out';
            notification.textContent = error.message;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#EDF6E5] z-50 overflow-hidden flex flex-col">
            {/* Header bar - styled exactly like the SamplePage image with bright blue background */}
            <div className="bg-[#22B8EA] flex items-center justify-between px-4 py-2 z-20 shadow-md">
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => navigate('/library')}
                        className="text-white hover:bg-blue-400 p-1 rounded-full transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-white font-bold text-xl md:text-2xl truncate">
                        {story.title}
                    </h1>
                </div>              
                <div className="flex items-center space-x-3">
                    {isAuthenticated && (
                        <button className="text-white p-1.5 hover:bg-blue-400 rounded-full transition-all">
                            <Share2 className="w-5 h-5" />
                        </button>
                    )}
                    {isAuthenticated && (
                        <button
                            onClick={handleSaveStory}
                            disabled={isSaving}
                            className={`text-white p-1.5 hover:bg-blue-400 rounded-full transition-all ${isSaving ? 'opacity-50' : ''}`}
                        >
                            <Save className={`w-5 h-5 ${isSaving ? 'animate-pulse' : ''}`} />
                        </button>
                    )}
                    <button 
                        onClick={() => navigate('/create')}
                        className="text-white p-1.5 hover:bg-blue-400 rounded-full transition-all"
                    >
                        <Home className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Main content area with book display */}
            <div className="flex-grow relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col">          
                    <div className="bg-[#FF2E6F] text-white text-xs font-bold px-4 py-1 flex items-center shadow-sm">
                       Page {currentSpread + 1} / {totalSpreads}
                    </div>
                    
                    <div className="flex-grow flex items-center justify-center px-2 overflow-hidden bg-white">
                        <div className="relative w-full h-full max-w-[95%] mx-auto">
                            {/* Left navigation button */}
                            <button
                                onClick={prevSpread}
                                disabled={currentSpread === 0}
                                className={`absolute left-1 top-1/2 transform -translate-y-1/2 z-10 ${currentSpread === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} transition-all`}
                            >
                                <div className="w-10 h-10 bg-[#22B8EA] rounded-full flex items-center justify-center shadow-md">
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </div>
                            </button>

                            {/* Right navigation button */}
                            <button
                                onClick={nextSpread}
                                disabled={rightPageIndex >= allPages.length - 1}
                                className={`absolute right-1 top-1/2 transform -translate-y-1/2 z-10 ${rightPageIndex >= allPages.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} transition-all`}
                            >
                                <div className="w-10 h-10 bg-[#22B8EA] rounded-full flex items-center justify-center shadow-md">
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </div>
                            </button>
                            
                            <div className={`h-full w-full transition-all duration-300 ${isFlipping ? `scale-95 opacity-90 ${flipDirection === 'left' ? 'translate-x-4' : 'translate-x-[-4px]'}` : 'scale-100 translate-x-0'}`}>
                                <div className="h-full w-full flex flex-col bg-white shadow-xl rounded-md overflow-hidden">
                                    {/* Extra-wide pages with images side by side - 80% height for images */}
                                    <div className="flex-grow flex" style={{ height: '80%' }}>
                                        {/* Left page */}
                                        <div className="w-1/2 relative border-r border-gray-200 overflow-hidden bg-white">
                                            {leftPage && (
                                                <>
                                                    {leftPage.isCover ? (
                                                        <div className="h-full bg-gradient-to-br from-[#FFECD2] to-[#FFCACC] p-8 flex flex-col justify-between">
                                                            <div className="text-center">
                                                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                                                    {story.title}
                                                                </h1>
                                                                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                                                                    <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-purple-500" />
                                                                </div>
                                                            </div>
                                                            <p className="text-center text-gray-700 font-medium">
                                                                A Magical Story
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center bg-white">
                                                            <img
                                                                src={leftPage.illustration}
                                                                alt={`Page ${leftPage.pageNumber}`}
                                                                className="max-w-full max-h-full object-contain p-3"
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* Right page - styled to match left page */}
                                        <div className="w-1/2 relative overflow-hidden bg-white">
                                            {rightPage && (
                                                <>
                                                    {rightPage.isCover ? (
                                                        <div className="h-full bg-gradient-to-bl from-[#FFECD2] to-[#FFCACC] flex items-center justify-center">
                                                            <p className="text-gray-600 text-lg italic">Turn the page to begin...</p>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center bg-white">
                                                            <img
                                                                src={rightPage.illustration}
                                                                alt={`Page ${rightPage.pageNumber}`}
                                                                className="max-w-full max-h-full object-contain p-3"
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Text boxes moved below pages */}
                                    <div className="flex border-t border-gray-200 bg-[#F8F9FA]" style={{ height: '20%' }}>
                                        {/* Left page text */}
                                        <div className="w-1/2 border-r border-gray-200 p-3 overflow-auto">
                                            {leftPage && !leftPage.isCover && (
                                                <div className="bg-white rounded-lg p-3 shadow-md h-full flex items-center">
                                                    <p className="text-gray-800 text-base font-medium leading-relaxed">
                                                        {leftPage.text}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Right page text */}
                                        <div className="w-1/2 p-3 overflow-auto">
                                            {rightPage && !rightPage.isCover && (
                                                <div className="bg-white rounded-lg p-3 shadow-md h-full flex items-center">
                                                    <p className="text-gray-800 text-base font-medium leading-relaxed">
                                                        {rightPage.text}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Compact audio player at the bottom with reduced height */}
            <div className="flex bg-white border-t border-gray-200 py-2">
                <div className="flex items-center px-4 gap-3 w-full">
                    <button
                        onClick={handleSpeak}
                        className={`rounded-full h-9 w-9 ${isReading ? 'bg-[#22B8EA]' : 'bg-white border-2 border-[#22B8EA]'} flex items-center justify-center transition-colors shadow-sm hover:opacity-90`}
                    >
                        <Volume2 className={`w-5 h-5 ${isReading ? 'text-white' : 'text-[#22B8EA]'}`} />
                    </button>
                    
                    <div className="flex-grow h-2 relative">
                        <div className="absolute inset-0 rounded-full bg-gray-300"></div>
                        <div 
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-[#22B8EA] to-[#5FCEFF] rounded-full transition-all duration-200 ${isReading ? 'animate-progress' : ''}`}
                            style={{ width: isReading ? '70%' : '0%' }}
                        ></div>
                        <div className="absolute h-5 w-5 bg-white border-2 border-[#22B8EA] rounded-full shadow-md" 
                            style={{ top: '-5px', left: isReading ? '70%' : '0%', transform: 'translateX(-50%)' }}></div>
                    </div>
                    
                    <div className="text-gray-600 text-xs font-bold">
                        {currentSpread + 1}/{totalSpreads}
                    </div>
                </div>
            </div>
            
            {/* Enhanced CSS animations for the audio progress and page flipping */}
            <style jsx>{`
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 20s linear;
                }
                
                @keyframes flip {
                    0% { transform: perspective(1500px) rotateY(0deg); }
                    100% { transform: perspective(1500px) rotateY(180deg); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                .flip-left {
                    animation: flip 0.6s forwards;
                }
                
                .flip-right {
                    animation: flip 0.6s forwards reverse;
                }
                
                .float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .pulse {
                    animation: pulse 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default StoryViewer;

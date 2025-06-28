import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Sparkles, ChevronLeft, ChevronRight, Home, Volume2,
    Save, Settings, Share2, ArrowLeft, Star, Heart,
    ThumbsUp, Music, PauseCircle, PlayCircle
} from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { AuthContext } from './AuthProvider';
import { saveStory } from '../services/api';

// Individual page component for the flip book
const Page = React.forwardRef((props, ref) => {
    const { 
        pageData, 
        pageNumber, 
        width, 
        height, 
        isTextPage = false,
        className = ""
    } = props;
    
    const isPageEmpty = !pageData;
    const isCover = pageData?.isCover;
    const isBackCover = pageData?.isBackCover;
    const isRightPage = pageNumber % 2 === 0; // Even page numbers are on the right side
    
    const pageStyle = {
        width,
        height,
        background: 'white',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23f0f0f0\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        backgroundSize: '300px',
        position: 'relative'
    };
    
    // For cover page, use special styling
    // if (isCover) {
    //     // Enhanced cover page gradient that works well as a standalone page
    //     pageStyle.background = 'linear-gradient(135deg, #FFECD2 0%, #FFCACC 100%)';
    //     pageStyle.backgroundSize = '100% 100%';
    //     //pageStyle.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
    // }
    
    return (
        <div className={`page-wrapper ${className}`} ref={ref}>
            <div className="page" style={pageStyle}>
                {!isPageEmpty && (
                    <div className="page-content h-full">
                        <div className="h-3/4 w-full overflow-hidden relative">
                            {isCover ? (
                                <div className="h-full p-8 flex flex-col justify-between">
                                    <div className="text-center">
                                        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                                            {pageData.title}
                                        </h1>
                                        <div className="w-36 h-36 md:w-48 md:h-48 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-20 h-20 md:w-24 md:h-24 text-purple-500" />
                                        </div>
                                    </div>
                                    <p className="text-center text-gray-700 font-medium">
                                        A Magical Story
                                    </p>
                                </div>
                            ) : isBackCover ? (
                                // Back cover with "End" text
                                <div className="h-full flex items-center justify-center bg-white relative">
                                    <div className="text-center">
                                        <h2 className="text-4xl md:text-6xl font-bold text-gray-400">The End</h2>
                                        <div className="mt-8 w-20 h-20 md:w-24 md:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center shadow-md">
                                            <Sparkles className="w-12 h-12 text-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Regular page image content
                                <div className="h-full flex items-center justify-center bg-white relative">
                                    <img
                                        src={pageData.illustration}
                                        alt={`Page ${pageData.pageNumber}`}
                                        className="max-w-full max-h-full object-contain p-px"
                                    />
                                    <div className={`absolute bottom-3 ${isRightPage ? 'right-8' : 'left-8'} text-sm text-gray-500 font-serif`}>
                                        {pageData.pageNumber}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Text Area - Bottom 25% */}
                        <div className="h-1/4 w-full  p-px flex items-center justify-center bg-[#F8F9FA]" 
                             style={{ borderTop: '1px solid #eaeaea', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f0f0f0\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                            {!isCover && !isBackCover && pageData.text && (
                                <div className="bg-white rounded-lg  p-1 shadow-md h-full w-full flex items-center book-text overflow-auto">
                                    <p className="text-gray-800 text-base md:text-lg font-medium leading-relaxed">
                                        {pageData.text}
                                    </p>
                                </div>
                            )}
                            {isCover && (
                                <div className="bg-white rounded-lg p-1 shadow-md h-full w-full flex items-center justify-center">
                                    <div className="text-center">
                                        <h2 className="text-xl md:text-3xl font-bold text-gray-800">
                                            {pageData.title}
                                        </h2>
                                        <p className="text-sm md:text-base text-gray-600 mt-2">By SparkJoy AI</p>
                                    </div>
                                </div>
                            )}
                            {isBackCover && (
                                <div className="bg-white rounded-lg  p-1 shadow-md h-full w-full flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm md:text-base italic">Thank you for reading!</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className={`absolute top-0 ${isRightPage ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} bottom-0 w-10 from-gray-200 to-transparent opacity-50 z-10 pointer-events-none`}></div>
            </div>
        </div>
    );
});

const StoryViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const story = location.state?.story;

    // Check if user is authenticated (has a token) or is a guest
    const isAuthenticated = user && user.token;

    const [currentPage, setCurrentPage] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setError] = useState('');
    const [pageWidth, setPageWidth] = useState(550); // Increased from 480
    const [pageHeight, setPageHeight] = useState(825); // Increased from 720
    const [orientation, setOrientation] = useState("landscape");
    const [isLoading, setIsLoading] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    
    const flipBookRef = useRef(null);
    const containerRef = useRef(null);
    
    // Prepare all pages with proper structure for the flip book
    const pagesData = React.useMemo(() => {
        const pages = [];
        
        // Add cover page as a single page (no "turn the page to begin" page)
        pages.push({
            pageNumber: 0,
            text: "",
            illustration: story?.pages[0]?.illustration || "cover",
            isCover: true,
            title: story?.title
        });
        
        // Add story pages - start directly with the content
        if (story?.pages) {
            story.pages.forEach(page => {
                pages.push({
                    ...page,
                    pageNumber: parseInt(page.pageNumber) // No need to adjust page numbers as much
                });
            });
        }
        
        // Always add a back cover page with "The End" text
        // This ensures we have a proper ending and makes total pages even if needed
        pages.push({
            pageNumber: pages.length,
            text: "Thank you for reading!",
            illustration: "",
            isBackCover: true
        });
        
        return pages;
    }, [story]);
    
    // Calculate total number of pages
    const totalPages = pagesData.length;
    
    // Handle page flip event
    const handlePageFlip = (e) => {
        setCurrentPage(e.data);
        
        // Stop current audio when changing pages
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            setIsReading(false);
        }
        
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsReading(false);
        }
    };
    
    // Navigation handlers
    const nextPage = () => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipNext();
        }
    };
    
    const prevPage = () => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipPrev();
        }
    };
    
    // Handle audio playback
    const handleSpeak = () => {
        // If already reading, stop playback
        if (isReading) {
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            
            setIsReading(false);
            return;
        }
        
        // Get current visible pages (usually 2 pages in the spread)
        const visiblePages = getCurrentVisiblePages();
        
        // Use AI-generated audio if available, otherwise use text-to-speech
        const pageWithAudio = visiblePages.find(page => page.audioUrl);
        
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
            
            const textToRead = visiblePages
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
    
    // Get current visible pages
    const getCurrentVisiblePages = () => {
        // In a flip book, even pages are on the right and odd pages are on the left
        // When current page is even, we're looking at pages current and current+1
        // When current page is odd, we're looking at pages current-1 and current
        
        const pages = [];
        
        if (currentPage % 2 === 0) {
            // Even page is on the right
            if (currentPage < totalPages) pages.push(pagesData[currentPage]);
            if (currentPage + 1 < totalPages) pages.push(pagesData[currentPage + 1]);
        } else {
            // Odd page is on the left
            if (currentPage - 1 >= 0) pages.push(pagesData[currentPage - 1]);
            if (currentPage < totalPages) pages.push(pagesData[currentPage]);
        }
        
        return pages;
    };
    
    // Handle loading state
    useEffect(() => {
        // Simulate loading of book resources
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);
    
    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                nextPage();
            } else if (e.key === 'ArrowLeft') {
                prevPage();
            } else if (e.key === 'm') {
                // Toggle audio with 'm' key
                handleSpeak();
            } else if (e.key === 'Home') {
                // Go to first page
                if (flipBookRef.current) {
                    flipBookRef.current.pageFlip().flip(0);
                }
            } else if (e.key === 'End') {
                // Go to last page
                if (flipBookRef.current) {
                    flipBookRef.current.pageFlip().flip(Math.max(0, totalPages - 2));
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentPage, isAuthenticated, totalPages]);
    
    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [audioPlayer]);
    
    // Adjust book size based on container and window size
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                
                // Determine orientation based on window dimensions
                const isLandscape = window.innerWidth > window.innerHeight;
                setOrientation(isLandscape ? "landscape" : "portrait");
                
                // Calculate ideal page dimensions while maintaining a book-like aspect ratio
                // Make the book bigger by using more of the available space
                const targetRatio = 1.3; // height/width ratio for a single page (slightly wider)
                
                let newWidth, newHeight;
                
                if (isLandscape) {
                    // Use 95% of available height (increased from 90%)
                    newHeight = containerHeight * 0.95;
                    // Calculate width based on the target ratio
                    newWidth = newHeight / targetRatio;
                    
                    // Ensure the total width (2 pages) isn't too wide
                    if (newWidth * 2 > containerWidth * 0.98) { // Use more width (98% vs 95%)
                        newWidth = (containerWidth * 0.98) / 2;
                        newHeight = newWidth * targetRatio;
                    }
                } else {
                    // Portrait mode - use 98% of available width for a single page
                    newWidth = containerWidth * 0.98;
                    newHeight = newWidth * targetRatio;
                    
                    // Ensure height isn't too tall
                    if (newHeight > containerHeight * 0.95) { // Use more height (95% vs 90%)
                        newHeight = containerHeight * 0.95;
                        newWidth = newHeight / targetRatio;
                    }
                }
                
                // Set dimensions, ensuring they're not smaller than minimum sizes
                // Increase minimum sizes further
                setPageWidth(Math.max(420, Math.floor(newWidth)));
                setPageHeight(Math.max(550, Math.floor(newHeight)));
            }
        };
        
        // Initial update
        updateDimensions();
        
        // Update on resize
        window.addEventListener('resize', updateDimensions);
        
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);
    
    // Generate page numbers display
    const getPageDisplay = () => {
        // Adjust for single cover page
        const adjustedCurrentPage = currentPage === 0 ? 0 : currentPage;
        const adjustedTotalPages = Math.max(1, totalPages - 1); // -1 because cover doesn't count
        
        if (currentPage === 0) {
            return 'Cover';
        }
        
        return `Page ${adjustedCurrentPage} / ${adjustedTotalPages}`;
    };
    
    // Helper function to show notifications
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 
                        type === 'error' ? 'bg-red-500' : 
                        'bg-blue-500';
                        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-out`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    };

    // Handle save story
    const handleSaveStory = async () => {
        try {
            setIsSaving(true);
            setError('');
            await saveStory(user.token, story, user.username);
            
            // Show success feedback
            showNotification('Story saved successfully!', 'success');
        } catch (error) {
            setError(error.message);
            
            // Show error feedback
            showNotification(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#EDF6E5] z-50 overflow-hidden flex flex-col">
            <div className="bg-[#22B8EA] flex items-center justify-between px-4 py-2 z-20 shadow-md">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate('/library')}
                        className="text-white hover:bg-blue-400 p-1 rounded-full transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-white font-bold text-xl md:text-2xl truncate">
                        {story?.title}
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
                        onClick={() => setShowHelp(!showHelp)}
                        className={`text-white p-1.5 hover:bg-blue-400 rounded-full transition-all ${showHelp ? 'bg-blue-400' : ''}`}
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigate('/create')}
                        className="text-white p-1.5 hover:bg-blue-400 rounded-full transition-all"
                    >
                        <Home className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-[#FF2E6F] text-white text-xs font-bold px-4 py-1 flex items-center shadow-sm">
                {getPageDisplay()}
            </div>

            <div 
                className="flex-grow relative overflow-hidden bg-white flex items-center justify-center"
                ref={containerRef}
            >
                {isLoading && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 mb-4">
                            <div className="animate-book-open w-full h-full">
                                <div className="absolute w-16 h-20 bg-gradient-to-r from-[#FFECD2] to-[#FFCACC] rounded-r-md rounded-b-md shadow-md left-4 top-2"></div>
                                <div className="absolute w-16 h-20 bg-gradient-to-r from-[#22B8EA] to-[#5FCEFF] rounded-l-md rounded-b-md shadow-md right-4 top-2 origin-right animate-page-flip"></div>
                            </div>
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-500" />
                        </div>
                        <p className="text-gray-500 text-sm animate-pulse">Loading your magical storybook...</p>
                    </div>
                )}
                {/* Left navigation button - moved further out with larger size */}
                <button
                    onClick={prevPage}
                    disabled={currentPage <= 0}
                    className={`absolute left-3 sm:left-6 md:left-10 lg:left-14 top-1/2 transform -translate-y-1/2 z-20 ${
                        currentPage <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                    } transition-all`}
                >
                    <div className="w-14 h-14 bg-[#22B8EA] rounded-full flex items-center justify-center shadow-lg">
                        <ChevronLeft className="w-8 h-8 text-white" />
                    </div>
                </button>

                {/* Right navigation button - moved further out with larger size */}
                <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    className={`absolute right-3 sm:right-6 md:right-10 lg:right-14 top-1/2 transform -translate-y-1/2 z-20 ${
                        currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                    } transition-all`}
                >
                    <div className="w-14 h-14 bg-[#22B8EA] rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                </button>

                <div className="book-container-wrapper relative w-full h-full max-w-[98%] mx-auto flex items-center justify-center">
                    {/* Book shadow underneath for 3D effect - enlarged */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[98%] h-12 bg-black opacity-20 blur-md rounded-full"></div>
                    
                    {/* Actual flipbook */}
                    <div className="relative book-container">
                        <HTMLFlipBook
                            width={pageWidth}
                            height={pageHeight}
                            size="fixed"
                            minWidth={420}
                            maxWidth={1100}
                            minHeight={550}
                            maxHeight={1500}
                            maxShadowOpacity={0.5}
                            showCover={true}
                            startZIndex={5}
                            showPageCorners={true}
                            mobileScrollSupport={true}
                            onFlip={handlePageFlip}
                            className="book-flip"
                            ref={flipBookRef}
                            usePortrait={orientation === "portrait"}
                            startPage={0}
                            drawShadow={true}
                            flippingTime={1000}
                            useMouseEvents={true}
                            swipeDistance={30}
                        >
                            {/* Generate all pages */}
                            {pagesData.map((page, index) => (
                                <Page 
                                    key={`page-${index}`}
                                    pageData={page}
                                    pageNumber={index}
                                    width={pageWidth}
                                    height={pageHeight}
                                    isTextPage={false}
                                />
                            ))}
                        </HTMLFlipBook>
                    </div>
                </div>
            </div>

            {/* Compact audio player at the bottom */}
            <div className="flex bg-white border-t border-gray-200 py-2">
                <div className="flex items-center px-4 gap-3 w-full justify-between">
                    <div className="flex items-center gap-3">
                        {/* Audio button */}
                        <button
                            onClick={handleSpeak}
                            className={`rounded-full h-9 w-9 ${isReading ? 'bg-[#22B8EA]' : 'bg-white border-2 border-[#22B8EA]'} flex items-center justify-center transition-colors shadow-sm hover:opacity-90`}
                            title="Read aloud"
                        >
                            <Volume2 className={`w-5 h-5 ${isReading ? 'text-white' : 'text-[#22B8EA]'}`} />
                        </button>
                        
                        {/* Audio progress */}
                        <div className="w-40 h-2 relative hidden sm:block">
                            <div className="absolute inset-0 rounded-full bg-gray-300"></div>
                            <div
                                className={`absolute inset-y-0 left-0 bg-gradient-to-r from-[#22B8EA] to-[#5FCEFF] rounded-full transition-all duration-200 ${isReading ? 'animate-progress' : ''}`}
                                style={{ width: isReading ? '70%' : '0%' }}
                            ></div>
                            <div className="absolute h-5 w-5 bg-white border-2 border-[#22B8EA] rounded-full shadow-md"
                                style={{ top: '-5px', left: isReading ? '70%' : '0%', transform: 'translateX(-50%)' }}></div>
                        </div>
                    </div>
                    
                    {/* Center - page display */}
                    <div className="text-gray-600 text-xs font-bold">
                        {getPageDisplay()}
                    </div>
                </div>
            </div>

            {/* Help overlay */}
            {showHelp && (
                <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowHelp(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Keyboard Shortcuts</h2>
                            <button 
                                onClick={() => setShowHelp(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Turn page forward</span>
                                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded shadow-sm">→</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Turn page backward</span>
                                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded shadow-sm">←</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Toggle read aloud</span>
                                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded shadow-sm">m</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Go to first page</span>
                                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded shadow-sm">Home</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Go to last page</span>
                                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded shadow-sm">End</kbd>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setShowHelp(false)}
                            className="mt-6 w-full py-2 bg-[#22B8EA] text-white rounded-lg hover:bg-blue-500 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryViewer;

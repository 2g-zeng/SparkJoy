import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';
import { AuthContext } from './AuthProvider';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    
    // Check if user is authenticated (has a token) or is a guest
    const isAuthenticated = user && user.token;

    return (
        <div className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <BookOpen className="w-8 h-8 text-purple-500" />
                        <span className="ml-2 text-xl font-heading font-bold text-gray-800">Magic Storybook</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/create')}
                            className="px-4 py-2 text-sm font-body font-medium text-purple-600 hover:text-purple-800"
                        >
                            Create Story
                        </button>
                        
                        {/* Only show Library button for authenticated users */}
                        {isAuthenticated && (
                            <button
                                onClick={() => navigate('/library')}
                                className="px-4 py-2 text-sm font-body font-medium text-purple-600 hover:text-purple-800"
                            >
                                Library
                            </button>
                        )}
                        
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-50">
                            <User className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-body font-medium text-purple-700">
                                {user?.username}
                                {!isAuthenticated && " (Guest)"}
                            </span>
                        </div>
                        
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="flex items-center space-x-1 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;

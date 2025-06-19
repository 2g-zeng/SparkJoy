import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Upload, Wand2 } from 'lucide-react';
import { HiOutlineSparkles } from "react-icons/hi2";
import { AuthContext } from '../components/AuthProvider'
import { generateStory } from '../services/api';

const StoryGenerator = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [instructions, setInstructions] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generationProgress, setGenerationProgress] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = uploadedImages.length + files.length;

    if (totalImages > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateStory = async () => {
    try {
      setError('');
      setIsGenerating(true);
      setGenerationProgress('Starting story generation...');
      
      const story = await generateStory(user.token, instructions, uploadedImages);
      
      // Reset form after successful generation
      setInstructions('');
      setUploadedImages([]);
      
      // Navigate to the story viewer with the generated story
      navigate(`/story/${story.id}`, { state: { story } });
    } catch (error) {
      setError(error.message || 'Failed to generate story. Please try again.');
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                {error}
              </div>
            )}
            
            {generationProgress && (
              <div className="bg-purple-50 text-purple-600 p-4 rounded-xl text-center">
                {generationProgress}
              </div>
            )}

            <button
              onClick={handleGenerateStory}
              disabled={isGenerating}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-xl text-white transform transition-all duration-200 ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:scale-105'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <Sparkles className="w-6 h-10 mr-3 animate-spin" />
                  Creating your magical story...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Sparkles className="w-6 h-10 mr-3" />
                  Generate My Story!
                </span>
              )}
            </button>

            <div className="flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-violet-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span className="text-gray-600 font-semibold text-md">No ideas? No problem! Leave the fields below blank and we'll conjure up a random magical tale for you.</span>
            </div>
            <div className="flex gap-2 items-center">
              <HiOutlineSparkles style={{ color: 'gold', fontSize: '24px' }} />
              <span className="text-xl font-semibold text-gray-600">
                  Share Your Story Ideas
              </span>
            </div>
            <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., A curious cat who discovers a hidden garden, or a little robot learning to make friends ..."
                className="w-full px-4 py-3 text-lg border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
                rows="4"
              />
            <span className="text-lg font-semibold text-gray-500">
              What adventure should we embark on? Describe a character, a place, or a magical event!
            </span>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-6 text-violet-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                <span className="text-xl font-semibold text-gray-600">
                  Spark Visual Ideas (Optional, up to 5 images)
                </span>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  multiple
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-3 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-500 transition-colors bg-purple-50"
                >
                  {uploadedImages.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto p-2 w-full">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative flex-shrink-0">
                          <img src={img} alt={`Uploaded ${index + 1}`} className="h-32 object-contain rounded-lg" />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setUploadedImages(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-purple-600">Click to upload pictures (up to 5)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;
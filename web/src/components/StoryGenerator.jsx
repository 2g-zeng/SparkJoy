import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Upload, Wand2 } from 'lucide-react';
import { HiOutlineSparkles } from "react-icons/hi2";

const StoryGenerator = () => {
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState(''); const [uploadedImages, setUploadedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateStory = async () => {
    setIsGenerating(true);
    const demoStory = {
      id: Date.now(),
      title: "Luna the Bunny's Rainbow Garden",
      pages: [
        { pageNumber: 1, text: "Once upon a time, in a cozy burrow at the edge of a meadow, lived a little white bunny named Luna. She had the softest fur and the biggest, brightest eyes.", illustration: "https://picsum.photos/seed/luna1/800/600" },
        { pageNumber: 2, text: "Luna loved to hop around her garden, but she noticed something sad. All the flowers were the same color - just green leaves everywhere!", illustration: "https://picsum.photos/seed/luna2/800/600" },
        { pageNumber: 3, text: "\"I wish my garden could be as colorful as the rainbow,\" Luna sighed, wiggling her pink nose. That night, she made a special wish upon a twinkling star.", illustration: "https://picsum.photos/seed/luna3/800/600" },
        { pageNumber: 4, text: "The next morning, Luna found a magical seed packet on her doorstep! It sparkled with all the colors of the rainbow and had a note: \"Plant with love.\"", illustration: "https://picsum.photos/seed/luna4/800/600" },
        { pageNumber: 5, text: "Luna carefully planted the seeds in seven neat rows. She watered them with her little blue watering can and sang them a happy song.", illustration: "https://picsum.photos/seed/luna5/800/600" },
        { pageNumber: 6, text: "On the first day, tiny red shoots popped up! \"How wonderful!\" Luna exclaimed, clapping her little paws together with joy.", illustration: "https://picsum.photos/seed/luna6/800/600" },
        { pageNumber: 7, text: "On the second day, orange buds appeared next to the red ones. Luna danced around them, her fluffy tail bouncing with each hop.", illustration: "https://picsum.photos/seed/luna7/800/600" },
        { pageNumber: 8, text: "By the third day, sunny yellow flowers bloomed! They smelled like honey and sunshine. Luna invited her friend Bella the Butterfly to see.", illustration: "https://picsum.photos/seed/luna8/800/600" },
        { pageNumber: 9, text: "\"Your garden is becoming magical!\" said Bella, fluttering her colorful wings. On the fourth day, green leaves unfurled like tiny umbrellas.", illustration: "https://picsum.photos/seed/luna9/800/600" },
        { pageNumber: 10, text: "The fifth day brought beautiful blue blossoms that looked like the sky. Luna's friend Oliver the Owl hooted with delight when he saw them.", illustration: "https://picsum.photos/seed/luna10/800/600" },
        { pageNumber: 11, text: "On the sixth day, purple petals opened wide. They sparkled in the sunlight like tiny amethysts. More friends came to admire Luna's garden.", illustration: "https://picsum.photos/seed/luna11/800/600" },
        { pageNumber: 12, text: "Finally, on the seventh day, violet flowers completed the rainbow! Luna's garden was now the most colorful place in the whole meadow.", illustration: "https://picsum.photos/seed/luna12/800/600" },
        { pageNumber: 13, text: "News of the rainbow garden spread quickly. Soon, animals from all around came to visit. There was Freddy the Fox, Rosie the Robin, and Sam the Squirrel.", illustration: "https://picsum.photos/seed/luna13/800/600" },
        { pageNumber: 14, text: "\"Welcome to my rainbow garden!\" Luna said proudly. \"There's enough beauty for everyone to enjoy!\" The animals gasped at the colorful sight.", illustration: "https://picsum.photos/seed/luna14/800/600" },
        { pageNumber: 15, text: "Luna decided to have a garden party. She set up tiny tables with acorn cups and clover sandwiches. Everyone was invited!", illustration: "https://picsum.photos/seed/luna15/800/600" },
        { pageNumber: 16, text: "Bella the Butterfly brought dewdrop lemonade. Oliver the Owl shared his moonberry muffins. It was the best party ever!", illustration: "https://picsum.photos/seed/luna16/800/600" },
        { pageNumber: 17, text: "As they ate, Luna noticed something special. Each friend matched a color in her garden! Freddy's fur was orange like the marigolds.", illustration: "https://picsum.photos/seed/luna17/800/600" },
        { pageNumber: 18, text: "Rosie's red breast matched the roses. Sam's brown fur looked lovely next to the tree trunks. \"We're all part of the rainbow!\" Luna realized.", illustration: "https://picsum.photos/seed/luna18/800/600" },
        { pageNumber: 19, text: "The friends decided to help Luna care for the garden. They took turns watering, weeding, and singing to the flowers.", illustration: "https://picsum.photos/seed/luna19/800/600" },
        { pageNumber: 20, text: "Every morning, Luna would hop through her garden paths. She loved how the dewdrops on the petals looked like tiny diamonds.", illustration: "https://picsum.photos/seed/luna20/800/600" },
        { pageNumber: 21, text: "One day, a sad little mouse named Milly came by. \"I'm too small and gray,\" she squeaked. \"I don't fit in anywhere.\"", illustration: "https://picsum.photos/seed/luna21/800/600" },
        { pageNumber: 22, text: "Luna hugged Milly gently. \"Every color is special, even gray! You're like the soft morning mist that makes the rainbow appear!\"", illustration: "https://picsum.photos/seed/luna22/800/600" },
        { pageNumber: 23, text: "Luna showed Milly the silver moonflowers that only bloomed at night. \"See? You're magical too!\" Milly's eyes sparkled with happiness.", illustration: "https://picsum.photos/seed/luna23/800/600" },
        { pageNumber: 24, text: "From that day on, Milly helped tend the night garden. She discovered that being different made her special, not strange.", illustration: "https://picsum.photos/seed/luna24/800/600" },
        { pageNumber: 25, text: "As the seasons changed, so did the garden. But the rainbow colors always remained, reminding everyone of the magic of diversity.", illustration: "https://picsum.photos/seed/luna25/800/600" },
        { pageNumber: 26, text: "Luna learned to save seeds from each color. She shared them with other animals who wanted to start their own rainbow gardens.", illustration: "https://picsum.photos/seed/luna26/800/600" },
        { pageNumber: 27, text: "Soon, the whole meadow was dotted with colorful gardens. Each one was unique, just like the animal who tended it.", illustration: "https://picsum.photos/seed/luna27/800/600" },
        { pageNumber: 28, text: "On quiet evenings, Luna would sit in her garden and remember her wish upon the star. She felt grateful for the magic it brought.", illustration: "https://picsum.photos/seed/luna28/800/600" },
        { pageNumber: 29, text: "\"The real magic,\" Luna thought, \"wasn't just the colorful flowers. It was bringing friends together and celebrating our differences.\"", illustration: "https://picsum.photos/seed/luna29/800/600" },
        { pageNumber: 30, text: "And so Luna's rainbow garden grew more beautiful each day, filled with laughter, friendship, and love. The end. 🌈", illustration: "https://picsum.photos/seed/luna30/800/600" }
      ],
      createdAt: new Date().toISOString()
    }; setTimeout(() => {
      let story;
      if (instructions || uploadedImages.length > 0) {
        story = {
          ...demoStory,
          id: Date.now(),
          title: "Your Custom Story",
          pages: demoStory.pages.map((page, i) => ({
            ...page,
            text: i === 0 ? `Once upon a time... ${instructions}` : page.text
          })),
          inspirationImages: uploadedImages
        };
      } else {
        story = demoStory;
      }
      setIsGenerating(false);
      setInstructions('');
      setUploadedImages([]);
      // Navigate to the story viewer with the story data
      navigate(`/story/${story.id}`, { state: { story } });
    }, 500);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="space-y-6">
            <button
              onClick={generateStory}
              disabled={isGenerating}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-xl text-white transform transition-all duration-200 ${isGenerating
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
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const crops = [
    { name: 'Tomato', icon: '🍅' },
    { name: 'Potato', icon: '🥔' },
    { name: 'Maize', icon: '🌽' },
    { name: 'Pepper', icon: '🌶️' }
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-8 md:pt-16 w-full animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mb-12">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight">
          Detect Crop Disease <br className="hidden md:block" /> Instantly with AI
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 font-medium pb-4 max-w-2xl mx-auto">
          Upload a leaf photo and get instant diagnosis and treatment advice to protect your harvest.
        </p>
        
        <button 
          onClick={() => navigate('/upload')}
          className="group inline-flex items-center gap-3 px-8 mx-auto py-5 text-xl font-bold text-white bg-accent rounded-full hover:bg-[#e69352] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
        >
          Analyze Your Crop
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Supported Crops Section */}
      <div className="w-full mt-12 pt-12 border-t border-gray-200">
        <h3 className="text-center text-xl font-bold text-gray-500 uppercase tracking-widest mb-10">We currently support</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-4xl mx-auto">
          {crops.map((crop) => (
            <div key={crop.name} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-secondary hover:shadow-md transition-all duration-300">
              <span className="text-6xl mb-4" role="img" aria-label={crop.name}>{crop.icon}</span>
              <span className="text-2xl font-semibold text-gray-800">{crop.name}</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}

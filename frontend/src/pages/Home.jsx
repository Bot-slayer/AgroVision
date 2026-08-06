import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const crops = [
    { name: 'Tomato', icon: '🍅' },
    { name: 'Potato', icon: '🥔' },
    { name: 'Maize', icon: '🌽' },
    { name: 'Pepper', icon: '🌶️' }
  ];

  return (
    <div className="flex flex-col items-center w-full pt-12 md:pt-20">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight font-heading">
          Detect Crop Disease <br className="hidden md:block" /> Instantly with AI
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
          Upload a leaf photo and get instant diagnosis and treatment advice to protect your harvest.
        </p>
      </div>

      {/* Supported Crops Section */}
      <div className="w-full px-4">
        <h3 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Select a Crop to Analyze</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {crops.filter(c => c.name !== 'Maize').map((crop) => (
            <button 
              key={crop.name} 
              onClick={() => navigate(`/upload/${crop.name.toLowerCase()}`)}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-sm transition-all duration-200"
            >
              <span className="text-5xl mb-4" role="img" aria-label={crop.name}>{crop.icon}</span>
              <span className="text-lg font-semibold text-gray-800 font-heading">
                {crop.name}
              </span>
            </button>
          ))}
        </div>
        
        {/* Maize - Coming Soon Section */}
        <div className="mt-4 max-w-4xl mx-auto">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-4xl grayscale opacity-60" role="img" aria-label="Maize">🌽</span>
              <div className="text-left">
                <h4 className="text-lg font-semibold text-gray-500 font-heading">Maize (Corn)</h4>
                <p className="text-sm text-gray-400 mt-1">AI model in development.</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

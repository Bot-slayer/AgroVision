import React from 'react';

export default function Info() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col pt-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary text-white p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-4">AgroVision Project</h2>
            <p className="text-xl opacity-90 font-medium">Cultivating Better Yields with AI</p>
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none transform -rotate-12 scale-150">
            <span className="text-9xl" role="img" aria-label="Leaf">🌿</span>
          </div>
        </div>

        {/* Notes Content */}
        <div className="p-8 space-y-8 text-gray-700">
          
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
              <span role="img" aria-label="Goal">🎯</span> Project Goal
            </h3>
            <p className="text-lg leading-relaxed">
              AgroVision is designed to empower farmers and agricultural enthusiasts by providing instant, AI-driven crop disease detection. By simply uploading a photo of a plant leaf, users can identify potential diseases and receive actionable treatment and prevention advice.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
              <span role="img" aria-label="Tech">⚙️</span> Technology Stack
            </h3>
            <ul className="list-disc list-inside text-lg leading-relaxed space-y-2 ml-2">
              <li><strong>Frontend:</strong> React + Vite with TailwindCSS for a responsive, modern UI.</li>
              <li><strong>Backend:</strong> Flask API serving predictions and connecting to the model.</li>
              <li><strong>Machine Learning:</strong> TensorFlow / Keras utilizing MobileNetV2 architecture trained on the PlantVillage dataset.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
              <span role="img" aria-label="Capabilities">✨</span> Current Capabilities
            </h3>
            <p className="text-lg leading-relaxed mb-2">
              The project currently supports disease detection for:
            </p>
            <div className="flex gap-4 font-bold text-gray-800">
              <span className="bg-red-50 text-red-700 px-4 py-2 rounded-lg">🍅 Tomato</span>
              <span className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg">🥔 Potato</span>
              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg">🌶️ Pepper</span>
            </div>
            <p className="text-lg leading-relaxed mt-4 italic text-gray-500">
              * Support for Maize (Corn) is currently in active development.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck, Droplet, Leaf, RotateCcw } from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const resultData = location.state?.resultData;
  const imagePreview = location.state?.imagePreview;

  // Protect route if no data exists
  if (!resultData) {
    return <Navigate to="/upload" replace />;
  }

  const { crop, disease, confidence, is_healthy, fertilizer, pesticide, prevention } = resultData;
  
  const getConfidenceColor = (confStr) => {
    // confidence comes like "94.5%"
    const val = parseFloat(confStr);
    if (val > 80) return "bg-green-500";
    if (val >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const confValue = parseFloat(confidence);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Banner Section */}
        {is_healthy ? (
          <div className="bg-secondary text-white p-6 flex items-center justify-center gap-4">
            <CheckCircle className="w-10 h-10" />
            <h2 className="text-3xl font-extrabold tracking-wide">✓ Your crop is healthy!</h2>
          </div>
        ) : (
          <div className="bg-red-500 text-white p-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <AlertTriangle className="w-10 h-10 shrink-0" />
            <h2 className="text-3xl font-extrabold tracking-wide">Disease Found: {disease}</h2>
          </div>
        )}

        {/* Mismatch Warning Alert */}
        {resultData.mismatch_warning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 shrink-0 mt-1" />
            <p className="text-yellow-800 text-lg font-medium leading-relaxed">
              {resultData.mismatch_warning}
            </p>
          </div>
        )}

        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-8 items-center bg-gray-50">
          {imagePreview ? (
            <div className="w-40 h-40 rounded-2xl overflow-hidden shrink-0 shadow-md border-4 border-white">
              <img src={imagePreview} alt="Crop" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-40 h-40 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
              <Leaf className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          <div className="flex-1 w-full text-center md:text-left">
            <p className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-1">{crop} Crop</p>
            <h2 className={`text-4xl font-extrabold mb-6 ${is_healthy ? 'text-primary' : 'text-red-600'}`}>
              {is_healthy ? 'Healthy' : disease}
            </h2>
            
            {/* Progress Bar for Confidence */}
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-gray-700">AI Confidence</span>
                <span className="text-xl font-extrabold text-gray-900">{confidence}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ease-out ${getConfidenceColor(confidence)}`}
                  style={{ width: `${confValue}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="p-8">
          <h3 className="text-2xl font-extrabold text-gray-800 mb-8 border-b pb-4">Treatment & Advice</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-full w-fit">
                <span className="text-2xl" role="img" aria-label="fertilizer">🌿</span>
              </div>
              <h4 className="text-xl font-bold text-blue-900">Fertilizer Recommendation</h4>
              <p className="text-lg text-blue-800 leading-relaxed font-medium">{fertilizer}</p>
            </div>

            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="bg-red-100 text-red-700 p-3 rounded-full w-fit">
                <span className="text-2xl" role="img" aria-label="pesticide">🧴</span>
              </div>
              <h4 className="text-xl font-bold text-red-900">Pesticide Suggestion</h4>
              <p className="text-lg text-red-800 leading-relaxed font-medium">{pesticide}</p>
            </div>

            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="bg-green-100 text-green-700 p-3 rounded-full w-fit">
                <span className="text-2xl" role="img" aria-label="shield">🛡️</span>
              </div>
              <h4 className="text-xl font-bold text-green-900">Prevention Tips</h4>
              <p className="text-lg text-green-800 leading-relaxed font-medium">{prevention}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => navigate('/upload')}
          className="group flex items-center gap-3 px-10 py-5 bg-text text-white rounded-full text-xl font-bold hover:bg-gray-800 hover:shadow-xl transition-all duration-300"
        >
          <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
          Analyze Another Leaf
        </button>
      </div>

    </div>
  );
}

import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck, Droplet, Leaf, RotateCcw, UserCheck, ArrowRight, ShieldOff } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  
  const resultData = location.state?.resultData;
  const imagePreview = location.state?.imagePreview;

  // Protect route if no data exists
  if (!resultData) {
    return <Navigate to="/" replace />;
  }

  const { crop, disease, confidence, is_healthy, fertilizer, pesticide, prevention } = resultData;
  
  const getConfidenceColor = (confVal) => {
    const val = typeof confVal === 'number' ? confVal : parseFloat(confVal);
    if (val > 80) return "bg-green-500";
    if (val >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const confValue = typeof confidence === 'number' ? confidence : parseFloat(confidence);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pt-8 pb-12 px-4">
      
      {/* Saved vs Default Account Notification Banner */}
      {activeProfile.isDefault ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-5 py-3 rounded-2xl mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldOff className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">
              <strong className="font-bold">Default Account Active:</strong> This diagnosis is displayed for this session, but <span className="underline">not saved to history</span>.
            </p>
          </div>
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 underline whitespace-nowrap"
          >
            Switch Profile to Save Scans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-2xl mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">
              Saved automatically to <strong className="text-emerald-950 font-bold">{activeProfile.name}'s Profile</strong> search history
            </p>
          </div>
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary underline whitespace-nowrap"
          >
            View Saved History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        
        {/* Banner Section */}
        {is_healthy ? (
          <div className="bg-green-50 text-green-800 p-6 flex flex-col items-center justify-center gap-2 border-b border-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold font-heading">Your crop is healthy!</h2>
          </div>
        ) : (
          <div className="bg-red-50 text-red-800 p-6 flex flex-col items-center justify-center gap-2 border-b border-red-100">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold font-heading">Disease Found: {disease}</h2>
          </div>
        )}

        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-8 items-center bg-gray-50">
          {imagePreview ? (
            <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-white shadow-sm">
              <img src={imagePreview} alt="Crop" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <Leaf className="w-12 h-12 text-gray-300" />
            </div>
          )}
          
          <div className="flex-1 w-full text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">{crop} Crop</p>
            <h2 className={`text-3xl font-bold mb-6 font-heading ${is_healthy ? 'text-green-700' : 'text-red-700'}`}>
              {is_healthy ? 'Healthy' : disease}
            </h2>
            
            {/* Progress Bar for Confidence */}
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-gray-700">AI Confidence</span>
                <span className="text-xl font-extrabold text-gray-900">{confValue}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ease-out ${getConfidenceColor(confValue)}`}
                  style={{ width: `${confValue}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Alert */}
        {resultData.mismatch_warning && (
          <div className="bg-yellow-50 border-b border-yellow-200 p-6 px-8 flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 shrink-0 mt-1" />
            <p className="text-yellow-800 text-lg font-medium leading-relaxed">
              {resultData.mismatch_warning}
            </p>
          </div>
        )}

        {/* Actionable Recommendations */}
        {!resultData.mismatch_warning ? (
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 font-heading">Treatment & Advice</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-blue-100 bg-blue-50/30 p-6 rounded-xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="fertilizer">🌿</span>
                  <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Fertilizer</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{fertilizer}</p>
              </div>

              <div className="border border-red-100 bg-red-50/30 p-6 rounded-xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="pesticide">🧴</span>
                  <h4 className="text-sm font-bold text-red-900 uppercase tracking-wide">Pesticide</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{pesticide}</p>
              </div>

              <div className="border border-green-100 bg-green-50/30 p-6 rounded-xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="shield">🛡️</span>
                  <h4 className="text-sm font-bold text-green-900 uppercase tracking-wide">Prevention</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{prevention}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-gray-50 flex flex-col items-center justify-center text-center border-t border-gray-100 rounded-b-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">Wrong Crop Dashboard</h3>
            <p className="text-gray-600 max-w-lg text-sm">
              To view treatment and prevention advice for {resultData.suggested_crop || 'this crop'}, please use the correct dashboard.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={() => navigate(`/upload/${crop.toLowerCase()}`)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#22503A] transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Analyze Another {crop}
        </button>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
        >
          Change Crop Category
        </button>
      </div>

    </div>
  );
}

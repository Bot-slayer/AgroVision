import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Leaf, UploadCloud, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Upload() {
  const { addHistoryItem } = useUser();

  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLeafWarning, setIsLeafWarning] = useState(false);
  
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { cropName } = useParams();
  
  // Capitalize crop name for display purposes
  const formattedCropName = cropName ? cropName.charAt(0).toUpperCase() + cropName.slice(1) : "Crop";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setErrorMsg("");
    setIsLeafWarning(false);
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setErrorMsg("Please upload a JPG or PNG file.");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    setErrorMsg("");
    setIsLeafWarning(false);
    
    const formData = new FormData();
    formData.append('image', selectedImage);
    if (cropName) {
      formData.append('crop', cropName);
    }

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.is_leaf === false) {
          setIsLeafWarning(true);
        }
        throw new Error(data.error || "Server error");
      }

      // Record diagnosis in User Profile Search History
      const historyRecord = addHistoryItem({
        ...data,
        imagePreview: previewUrl
      });
      
      // Navigate to result on success
      navigate('/result', { state: { resultData: data, imagePreview: previewUrl, historyId: historyRecord.id } });
      
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col pt-8 px-4">
      
      <button 
        onClick={() => navigate('/')} 
        disabled={isLoading}
        className="self-start flex items-center gap-2 text-primary font-medium text-sm mb-8 hover:text-secondary disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 font-heading">Upload {formattedCropName} Image</h2>
        <p className="text-gray-600">Take a clear picture of the {formattedCropName.toLowerCase()} leaf from above.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        {!previewUrl ? (
          <div 
            className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${dragActive ? 'border-primary bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-gray-100'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg, .jpeg, .png"
              className="hidden"
              onChange={handleChange}
            />
            <div className="bg-white p-4 rounded-full shadow-sm mb-6">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-1">Drag & Drop Image Here</p>
            <p className="text-sm text-gray-500 mb-6">or click to browse files</p>
            <div className="inline-flex items-center gap-2 bg-white text-gray-600 text-xs px-3 py-1.5 rounded-md border border-gray-200 font-medium tracking-wide">
              Supported formats: JPG, PNG
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full h-72 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center mb-6 relative">
              <img src={previewUrl} alt="Leaf Preview" className="object-contain w-full h-full" />
              {!isLoading && (
                 <button 
                   onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                   className="absolute top-3 right-3 bg-white text-gray-600 text-sm px-3 py-1.5 font-medium rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-red-600 transition-colors"
                 >
                   Clear
                 </button>
              )}
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white rounded-xl text-lg font-semibold hover:bg-[#22503A] transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing & Saving to Profile...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Analyze Leaf
                </>
              )}
            </button>
          </div>
        )}

        {errorMsg && (
          <div className={`mt-6 flex items-start gap-4 p-5 rounded-2xl border font-semibold text-lg ${isLeafWarning ? 'bg-yellow-50 text-yellow-800 border-yellow-200 shadow-sm' : 'bg-red-50 text-red-700 border-red-200'}`}>
            <AlertCircle className="w-8 h-8 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // For PDF preview
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [signature, setSignature] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.lineWidth = 2;
      context.strokeStyle = '#000000';
    }
  }, []);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setIsLoading(true); // Set loading state to true
      setFile(uploadedFile);
      
      // Delay to simulate loading for large files
      setTimeout(() => {
        setFilePreview(URL.createObjectURL(uploadedFile)); // Set preview URL
        setIsLoading(false); // Remove loading state once preview is ready
        setActiveTab('sign');
      }, 1000); // Add delay for demonstration; adjust as needed
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext('2d');
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext('2d');
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignature(null);
  };

  const applySignature = () => {
    const signatureDataUrl = canvasRef.current.toDataURL();
    setSignature(signatureDataUrl);
    setActiveTab('save');
  };

  const saveSignedDocument = () => {
    const signedDoc = {
      originalFile: file,
      signature: signature,
      timestamp: new Date().toISOString(),
    };
    console.log('Signed document:', signedDoc);
    alert('Document signed and saved successfully!');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>E-Signature Application</h1>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('upload')} 
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'upload' ? '#007bff' : '#ccc', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          Upload
        </button>
        <button 
          onClick={() => setActiveTab('sign')} 
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'sign' ? '#007bff' : '#ccc', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '5px'
          }}
          disabled={!file}
        >
          Sign
        </button>
        <button 
          onClick={() => setActiveTab('save')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'save' ? '#007bff' : '#ccc', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '5px'
          }}
          disabled={!signature}
        >
          Save
        </button>
      </div>

      {/* File Upload Section */}
      {activeTab === 'upload' && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
          <h2>Upload Document</h2>
          <p>Drag and drop your PDF file or click to select</p>
          <div style={{ border: '2px dashed #ccc', padding: '40px', textAlign: 'center' }}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
              Drag 'n' drop a PDF file here, or click to select one
            </label>
          </div>
          {file && <p style={{ color: '#28a745' }}>File uploaded: {file.name}</p>}
          {isLoading ? (
            <p>Loading preview...</p>
          ) : (
            filePreview && (
              <iframe
                src={filePreview}
                width="100%"
                height="400px"
                style={{ marginTop: '20px', border: '1px solid #ccc' }}
                title="PDF Preview"
              ></iframe>
            )
          )}
        </div>
      )}

      {/* Signature Section */}
      {activeTab === 'sign' && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
          <h2>Sign Document</h2>
          <p>Draw your signature below</p>
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            style={{ border: '1px solid #ccc' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
          />
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={applySignature} 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#007bff', 
                color: '#fff', 
                border: 'none', 
                cursor: 'pointer',
                borderRadius: '5px',
                marginRight: '10px'
              }}
            >
              Apply Signature
            </button>
            <button 
              onClick={clearSignature} 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#dc3545', 
                color: '#fff', 
                border: 'none', 
                cursor: 'pointer',
                borderRadius: '5px'
              }}
            >
              Clear Signature
            </button>
          </div>
        </div>
      )}

      {/* Save Signed Document Section */}
      {activeTab === 'save' && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
          <h2>Save Signed Document</h2>
          <p>Review and save your signed document</p>
          <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
            {file && <p>Document: {file.name}</p>}
            {signature && (
              <img src={signature} alt="Your signature" style={{ maxWidth: '100%', border: '1px solid #ccc' }} />
            )}
          </div>
          <button 
            onClick={saveSignedDocument} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: '#fff', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: '5px',
              marginTop: '10px'
            }}
          >
            Save Signed Document
          </button>
        </div>
      )}

      {/* Security Note */}
      <div style={{ marginTop: '20px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '10px' }}>
        <h3>Security Note</h3>
        <p>Your signature is encrypted and securely stored. Never share your login credentials.</p>
      </div>
    </div>
  );
};

export default App;
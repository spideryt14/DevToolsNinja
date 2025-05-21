// Initialize elements
const imageUpload = document.getElementById('image-upload');
const resultDiv = document.getElementById('result');
const fileInfoDiv = document.getElementById('file-info');
const imagePreviewDiv = document.getElementById('image-preview');
const dropZone = document.getElementById('drop-zone');

// Handle file selection
imageUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        showFileInfo(e.target.files[0]);
        previewImage(e.target.files[0]);
    }
});

// Show filename and size
function showFileInfo(file) {
    fileInfoDiv.innerHTML = `
        📄 <strong>${file.name}</strong> 
        <br>🗂 ${(file.size / 1024).toFixed(2)} KB
    `;
    fileInfoDiv.style.display = 'block';
}

// Preview uploaded image
function previewImage(file) {
    if (!file.type.match('image.*')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreviewDiv.innerHTML = `
            <img src="${e.target.result}" class="preview-image" alt="Preview">
        `;
    };
    reader.readAsDataURL(file);
}

// Extract text from image
async function extractText() {
    if (!imageUpload.files || !imageUpload.files[0]) {
        resultDiv.innerHTML = "⚠️ Please select an image first!";
        return;
    }

    const imageFile = imageUpload.files[0];
    resultDiv.innerHTML = `<span class="loading"></span> Processing your image...`;

    try {
        const { data: { text } } = await Tesseract.recognize(
            imageFile,
            'eng+ben', // English + Bengali support
            { logger: m => console.log(m) }
        );

        resultDiv.innerHTML = `
            <strong>✅ Extracted Text:</strong><br><br>
            ${text || "No text found."}
            <br><br>
            <small>Powered by DevToolsNinja</small>
        `;
    } catch (error) {
        resultDiv.innerHTML = "❌ Error extracting text. Please try another image.";
        console.error(error);
    }
}

// Drag and drop functionality
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#6c63ff';
    dropZone.style.transform = 'translateY(-5px)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    dropZone.style.transform = 'translateY(0)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    
    if (e.dataTransfer.files.length) {
        imageUpload.files = e.dataTransfer.files;
        showFileInfo(e.dataTransfer.files[0]);
        previewImage(e.dataTransfer.files[0]);
    }
});

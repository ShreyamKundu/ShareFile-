const fileInput = document.querySelector('#fileInput');
const fileLinkInput = document.querySelector('#fileLinkInput');
const dropzone = document.querySelector('.drop-zone');
const uploading = document.querySelector('.uploading');
const linkZone = document.querySelector('.link-zone');
const emailZone = document.querySelector('.email-section');
const uploaded = document.querySelector('.uploaded');
const uploadedtext = document.querySelector('.uploadedtext');
const browseBtn = document.querySelector('.browseBtn');
const copyicon = document.querySelector('.copy-icon');

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

fileLinkInput.addEventListener('copy', (e) => {
    // Prevent the default copy behavior
    e.preventDefault();
});

copyicon.addEventListener('click', () => {
    copyToClipboard(fileLinkInput.value);
});

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
    uploading.classList.remove('hidden');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploading.classList.remove('hidden');
    handleFiles(e.dataTransfer.files);
});

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add("dragged");
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove("dragged");
});

function handleFiles(files) {
    fileInput.files = files;
    dropzone.classList.remove("dragged");

    // Call the uploadFile function with the selected file
    if (files.length > 0) {
        uploadFile(files[0]);
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('myfile', file);

    try {
        const response = await axios.post('/api/files', formData, {
            onUploadProgress: async function (progressEvent) {
                const total = progressEvent.total;
                const loaded = progressEvent.loaded;
                const progress = Math.round((loaded / total) * 100);

                // Introduce a delay to slow down the progress update
                await sleep(100); // Adjust the delay in milliseconds as needed

                uploaded.style.width = `${progress}%`;
                uploadedtext.textContent = `${progress}%`;

                // Check if the progress is 100%
                if (progress === 100) {
                    // Show the link and email section
                    document.querySelector('.link-zone').style.display = 'block';
                    document.querySelector('.email-section').style.display = 'block';
                }
            }
        });

        fileLinkInput.value = response.data.file;
    } catch (error) {
        console.error('Error in uploadFile:', error);
    }
}

function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.select();
    document.execCommand('copy');

    // Remove the temporary textarea
    document.body.removeChild(textarea);

}

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');

    if (sendButton) {
        sendButton.addEventListener('click', async function () {
            // Get the form data
            const emailTo = document.getElementById('to-email').value;
            const uuid = fileLinkInput.value.split('/').pop(); // Extract uuid from the file link

            // Perform your desired action with the form data and uuid
            console.log('Email to:', emailTo);
            console.log('UUID:', uuid);

            try {
                // Use Axios to send data to the server
                const response = await axios.post('/api/files/send', {
                    emailTo,
                    uuid
                });

                console.log(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

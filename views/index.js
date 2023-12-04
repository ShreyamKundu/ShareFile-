const fileInput = document.querySelector('#fileInput');

const dropzone = document.querySelector('.drop-zone');

const browseBtn = 
document.querySelector('.browseBtn');

browseBtn.addEventListener("click",() =>{
    fileInput.click();
})

dropzone.addEventListener('drop',(e) => {
    e.preventDefault();
    const files = e.dataTransfer.files
    console.log(files);
    fileInput.files = files;
    dropzone.classList.remove("dragged")
})

dropzone.addEventListener('dragover',(e) => {
    e.preventDefault();
    dropzone.classList.add("dragged")
})

dropzone.addEventListener('dragleave',() => {
    dropzone.classList.remove("dragged")
})


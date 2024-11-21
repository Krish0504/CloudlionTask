import React from 'react';

const DownloadLink = ({ fileBuffer, fileName,role }) => {
    console.log("{ fileBuffer, fileName }",{ fileBuffer, fileName })
    const downloadFile = () => {
        try {
            const blob = new Blob([fileBuffer.decryptedFileBuffer.data], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; 
            document.body.appendChild(link);
            link.click();

            // Clean up the URL object
            window.URL.revokeObjectURL(url);
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className='mt-3'>
            <button className="btn btn-outline-success" onClick={downloadFile} disabled={role=="admin"?false:true}>Download {fileName}</button>
        </div>
    );
};

export default DownloadLink;

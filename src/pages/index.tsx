import React, { useState, ChangeEvent } from 'react';
import JSZip from 'jszip';

interface Image {
  download_url: string;
  // Add other properties from your data if needed
}

function App() {
  const [imageList, setImageList] = useState<Image[]>([]);
  const [downloadURL, setDownloadURL] = useState<string>('https://picsum.photos/v2/list'); // Default URL
  const [downloading, setDownloading] = useState<boolean>(false);
  const [propertyToExtract, setPropertyToExtract] = useState<string>('download_url'); // Default property
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showRawJSON, setShowRawJSON] = useState<boolean[]>([]);

  const fetchImageList = async () => {
    try {
      const response = await fetch(downloadURL);
      if (response.ok) {
        const data: Image[] = await response.json();
        setImageList(data);
        // Set all images as initially selected
        setSelectedImages(data.map((_, index) => index));
      } else {
        console.error('Failed to fetch JSON data. Status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching JSON data', error);
    }
  };

  const downloadImages = async () => {
    setDownloading(true);
    console.log('Starting image downloads...');

    const zip = new JSZip();

    const selectedImagesData = selectedImages.map((index) => imageList[index]);

    for (let index = 0; index < selectedImagesData.length; index++) {
      const item = selectedImagesData[index];
      const imageUrl = item[propertyToExtract];

      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          const blob = await response.blob();
          zip.file(`image${index + 1}.jpg`, blob);
          console.log(`Downloaded image ${index + 1}`);
        } else {
          console.error(`Error downloading image: ${imageUrl}`);
        }
      } catch (error) {
        console.error(`Error downloading image: ${imageUrl}`, error);
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const objectURL = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = objectURL;
      a.download = 'images.zip';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(objectURL);

      console.log('Image downloads completed.');
      setDownloading(false);
    });
  };

  const downloadImage = (index: number) => {
    const item = imageList[index];
    const imageUrl = item[propertyToExtract];

    try {
      const response = fetch(imageUrl);
      response.then(async (res) => {
        if (res.ok) {
          const blob = await res.blob();
          const objectURL = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectURL;
          a.download = `image${index + 1}.jpg`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(objectURL);
          console.log(`Downloaded image ${index + 1}`);
        } else {
          console.error(`Error downloading image: ${imageUrl}`);
        }
      });
    } catch (error) {
      console.error(`Error downloading image: ${imageUrl}`, error);
    }
  };

  const parseResponseData = (data: any): Image[] => {
    return data;
  };

  const toggleImageSelection = (index: number) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(index)) {
        // If the image is already selected, remove it from the selected list
        return prevSelectedImages.filter((i) => i !== index);
      } else {
        // If the image is not selected, add it to the selected list
        return [...prevSelectedImages, index];
      }
    });
  };

  const toggleRawJSON = (index: number) => {
    setShowRawJSON((prevShowRawJSON) => {
      const updatedShowRawJSON = [...prevShowRawJSON];
      updatedShowRawJSON[index] = !updatedShowRawJSON[index];
      return updatedShowRawJSON;
    });
  };

  const handleURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDownloadURL(e.target.value);
  };

  const handlePropertyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPropertyToExtract(e.target.value);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  };

  const imageStyle = {
    maxWidth: '300px',
    maxHeight: '200px',
    width: '100%',
    height: 'auto',
  };


  return (
    <div className="App">
      <h1>Image Downloader</h1>
      <div>
        <label htmlFor="downloadURL">Download URL:</label>
        <input
          type="text"
          id="downloadURL"
          value={downloadURL}
          onChange={handleURLChange}
          disabled={downloading}
        />
      </div>
      <div>
        <label htmlFor="propertyToExtract">Property to Extract:</label>
        <input
          type="text"
          id="propertyToExtract"
          value={propertyToExtract}
          onChange={handlePropertyChange}
          disabled={downloading}
        />
      </div>
      <button onClick={fetchImageList} disabled={downloading}>
        Fetch Images
      </button>
      <button onClick={downloadImages} disabled={downloading || selectedImages.length === 0}>
        Download Selected Images as ZIP
      </button>
      <div style={gridStyle}>
        {imageList.map((item, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                checked={selectedImages.includes(index)}
                onChange={() => toggleImageSelection(index)}
              />
              <img
                src={item[propertyToExtract]}
                alt={`Image ${index}`}
                style={imageStyle}
              /></label>
            <button onClick={() => toggleRawJSON(index)}>
              {showRawJSON[index] ? 'Hide JSON' : 'Show JSON'}
            </button>
            {showRawJSON[index] && (
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(item, null, 2)}
              </pre>
            )}
            <button onClick={() => downloadImage(index)}>Download</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;

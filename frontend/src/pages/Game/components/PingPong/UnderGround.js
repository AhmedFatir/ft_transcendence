import React, {useState} from "react";

const Underground = ({ hell, forest, graveyard, onBackgroundSelect }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSelectImage = (image) => {
      setSelectedImage(image);
      onBackgroundSelect(image);
    };
    return (
      <div className="areas-container">
        <div
          className={`hell underground ${selectedImage === 'hell' ? 'selectedUnderground' : ''}`}
          onClick={() => handleSelectImage('hell')}
        >
          <div className="image-container">
            <img src={hell} alt="Hell" />
            <div className="image-title">UnderGround Hell</div>
          </div>
        </div>
        <div
          className={`forest underground ${selectedImage === 'forest' ? 'selectedUnderground' : ''}`}
          onClick={() => handleSelectImage('forest')}
        >
          <div className="image-container">
            <img src={forest} alt="Forest" />
            <div className="image-title">UnderGround Forest</div>
          </div>
        </div>
        <div
          className={`graveyard underground ${selectedImage === 'graveyard' ? 'selectedUnderground' : ''}`}
          onClick={() => handleSelectImage('graveyard')}
        >
          <div className="image-container">
            <img src={graveyard} alt="Graveyard" />
            <div className="image-title">UnderGround Graveyard</div>
          </div>
        </div>
      </div>
    );
}
 
export default Underground;
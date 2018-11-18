import React from "react";

const SuitIcon = props => {
  let img;

  switch (props.chosenWeight) {
    case "spades":
      img = "https://image.freepik.com/free-icon/spades-symbol_318-40683.jpg";
      break;
    case "clubs":
      img = "http://www.clker.com/cliparts/U/3/0/g/Z/y/carte-de-trefla-md.png";
      break;
    case "diamonds":
      img =
        "https://www.spreadshirt.com/image-server/v1/designs/11631716,width=178,height=178/card-suit-diamond.png";
      break;
    case "hearts":
      img =
        "https://upload.wikimedia.org/wikipedia/commons/7/77/Heart_symbol_c00.png";
      break;
    default:
      break;
  }

  // let style = {
  //   backgroundImage: "url(" + img + ")"
  // };

  let style = {
    backgroundImage:
      "url(https://cdn1.iconfinder.com/data/icons/ui-glynh-04-of-5/100/UI_Glyph_07-07-512.png)"
  };

  return props.show ? (
    <div
      className={`info-icon ${props.show ? "modal-shown" : "modal-hidden"}`}
      style={style}
    >
      <img
            alt="Chosen weight symbol"
            className="icon-image grey-icon"
            src={img}
          />
    </div>

  ) : null;
};

export default SuitIcon;

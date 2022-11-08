import { useEffect, useRef } from "react";

function GameCover({ coverInfo, pixelation }) {
  const canvasEl = useRef(null);
  const img = new Image();

  useEffect(() => {
    firstDraw();
  }, [coverInfo]);

  useEffect(() => {
    if (coverInfo?.url) {
      firstDraw();
    }
  }, [pixelation]);

  const firstDraw = () => {
    let initialImageURL =
      "https://cors-anywhere.herokuapp.com/" +
      coverInfo?.url?.replace("thumb", "720p");
    draw(initialImageURL);
  };

  const draw = (imgURL) => {
    img.crossOrigin = "anonymous";
    img.src = imgURL;

    let ctx = canvasEl?.current?.getContext("2d");

    img.onload = () => {
      canvasEl.current.height = img.height / 4;
      canvasEl.current.width = img.width / 4;
      ctx.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);
      pixelate();
    };
  };

  const pixelate = () => {
    const canvas = canvasEl.current;

    canvas.height = img.height;
    canvas.width = img.width;
    let ctx = canvas?.getContext("2d");

    let w = canvas.width * pixelation;
    let h = canvas.height * pixelation;

    ctx.drawImage(img, 0, 0, w, h);

    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
  };

  return <canvas ref={canvasEl}></canvas>;
}

export default GameCover;

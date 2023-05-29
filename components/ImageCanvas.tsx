import { useMemo, useRef, useState } from "react";
import { IMAGE_URLS } from "../data/sample-image-urls";
import { inferenceSqueezenet } from "../utils/predict";

interface Props {
  height: number;
  width: number;
}
const handleImageUrl = (file: File) => {
  try {
    return URL.createObjectURL(file);
  } catch {
    return "";
  }
};
const ImageCanvas = (props: Props) => {
  const InputRef = useRef<HTMLInputElement>(null);
  const [topResultLabel, setLabel] = useState("");
  const [topResultConfidence, setConfidence] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitInference = async () => {
    setIsLoading(true);
    const arrayBuffer = await imgFile?.arrayBuffer();
    var [inferenceResult] = await inferenceSqueezenet(arrayBuffer ?? "");
    var topResult = inferenceResult[0];
    setIsLoading(false);
    setLabel(topResult.name.toUpperCase());
    setConfidence(topResult.probability);
  };

  const porcentage = useMemo(() => {
    return Number(topResultConfidence) * 100;
  }, [topResultConfidence]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        style={{
          outline: "none",
          background: "lightblue",
          border: "none",
          margin: "16px",
          padding: "8px 16px",
          borderRadius: "8px",
          width: "100%",
        }}
        onClick={() => {
          if (InputRef.current) InputRef.current.click();
        }}
      >
        Escolher Imagem
      </button>
      <img
        src={handleImageUrl(imgFile as File)}
        style={{
          maxWidth: "300px",
          maxHeight: "300px",
          objectFit: "contain",
          borderRadius: "16px",
        }}
      />

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const ImgFile = e.target.files[0];
            setImgFile(ImgFile);
          }
        }}
        style={{
          display: "none",
        }}
        ref={InputRef}
      />

      <button
        onClick={() => submitInference()}
        style={{
          outline: "none",
          background: "orange",
          border: "none",
          margin: "16px",
          padding: "8px 16px",
          borderRadius: "8px",
          width: "100%",
          opacity: isLoading ? 0.5 : 1,
        }}
        disabled={isLoading}
      >
        Validar
      </button>
      <span>{topResultLabel}</span>
      <span
        style={{
          color: porcentage > 50 ? "green" : "red",
        }}
      >
        Porcentagem: {porcentage.toFixed(2) + "%"}
      </span>
    </div>
  );
};

export default ImageCanvas;

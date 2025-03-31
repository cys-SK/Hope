import { useState } from "react";
import { Inflate } from "zlibjs/bin/inflate.min.js";

export default function MindustryDecoder() {
  const [code, setCode] = useState("");
  const [blocks, setBlocks] = useState(null);
  const [error, setError] = useState(null);

  function decodeBlueprint(encoded) {
    try {
      const base64 = encoded.replace(/^bXNjaA/, "");
      const compressed = atob(base64);
      const binary = new Uint8Array(compressed.length);
      for (let i = 0; i < compressed.length; i++) {
        binary[i] = compressed.charCodeAt(i);
      }
      const decompressed = new Inflate(binary).decompress();
      const text = new TextDecoder().decode(decompressed);
      return JSON.parse(text);
    } catch (err) {
      console.error(err);
      setError("디코딩 실패: 유효한 Mindustry 설계도 코드인지 확인해주세요.");
      return null;
    }
  }

  const handleDecode = () => {
    setError(null);
    const result = decodeBlueprint(code);
    if (result) setBlocks(result);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mindustry 설계도 디코더</h1>
      <input
        type="text"
        placeholder="bXN... 로 시작하는 설계도 코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleDecode}>디코드</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {blocks && (
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
          {JSON.stringify(blocks, null, 2)}
        </pre>
      )}
    </div>
  );
}

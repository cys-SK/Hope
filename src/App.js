import { useState } from "react";
import pako from "pako";

export default function MindustryDecoder() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function decodeBlueprint(input) {
    try {
      const base64 = input.replace(/^bXNjaA/, "");
      const compressed = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const decompressed = pako.inflate(compressed, { to: "string" });
      return JSON.parse(decompressed);
    } catch (e) {
      console.error(e);
      setError("디코딩 실패: 올바른 설계도 코드인지 확인해주세요.");
      return null;
    }
  }

  const handleClick = () => {
    setError(null);
    const output = decodeBlueprint(code);
    if (output) setResult(output);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mindustry 설계도 디코더</h1>
      <textarea
        rows={5}
        style={{ width: "100%", marginBottom: 10 }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="bXN... 로 시작하는 설계도 코드 입력"
      />
      <button onClick={handleClick}>디코드</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

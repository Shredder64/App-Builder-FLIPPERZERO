import { useState } from "react";
import axios from "axios";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Controlled as CodeMirror } from "react-codemirror2";

export default function Home() {
  const [code, setCode] = useState("// Write your Flipper Zero app here...");
  const [sdkUrl, setSdkUrl] = useState("https://github.com/flipperdevices/flipperzero-firmware.git");
  const [branch, setBranch] = useState("latest");
  const [buildLog, setBuildLog] = useState("Waiting for build...");
  const [isBuilding, setIsBuilding] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleBuild = async () => {
    setIsBuilding(true);
    setBuildLog("🚀 Building your app...");

    try {
      const response = await axios.post("/api/build", { code, sdkUrl, branch });
      setBuildLog(response.data.message);
      setDownloadUrl(response.data.downloadUrl);
    } catch (error) {
      setBuildLog("❌ Build failed. Check logs.");
    }

    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Flipper Zero Online App Builder</h1>
      
      <div className="w-full max-w-2xl">
        <label className="block text-gray-300">Flipper Zero SDK GitHub URL:</label>
        <input
          type="text"
          value={sdkUrl}
          onChange={(e) => setSdkUrl(e.target.value)}
          className="w-full bg-gray-800 text-white p-2 rounded"
        />

        <label className="block text-gray-300 mt-3">Branch (latest, 0.82.0, etc.):</label>
        <input
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full bg-gray-800 text-white p-2 rounded"
        />
      </div>

      <div className="w-full max-w-2xl mt-4 border border-gray-700">
        <CodeMirror
          value={code}
          options={{ mode: "c", theme: "material", lineNumbers: true }}
          onBeforeChange={(editor, data, value) => setCode(value)}
        />
      </div>

      <button
        onClick={handleBuild}
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 mt-4 rounded disabled:bg-gray-500"
        disabled={isBuilding}
      >
        {isBuilding ? "Building..." : "🚀 Build App"}
      </button>

      <pre className="w-full max-w-2xl bg-gray-800 p-4 mt-4 rounded">{buildLog}</pre>

      {downloadUrl && (
        <a href={downloadUrl} download className="text-green-400 mt-4">
          ✅ Download `.fap` file
        </a>
      )}
    </div>
  );
}

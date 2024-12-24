import { useEffect, useState } from "react";
import { compile, createFileManager } from "@noir-lang/noir_wasm";
import MonacoEditor from "@monaco-editor/react";
import "./CircuitCompiler.css";

type CircuitCompilerProps = {
  mainUrl: string;
  nargoTomlUrl: string;
  onCompile: (acir: object) => void;
};

function CircuitCompiler({ mainUrl, nargoTomlUrl, onCompile }: CircuitCompilerProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [circuitCode, setCircuitCode] = useState<string | null>(null);
  const [acir, setAcir] = useState<string | null>(null);

  useEffect(() => {
    async function loadCode() {
      setStatus(null);
      try {
        const mainResponse = await fetch(mainUrl);

        if (!mainResponse.ok) {
          throw new Error("Error al cargar el archivo del circuito.");
        }

        const mainBody = await mainResponse.text();
        setCircuitCode(mainBody);
      } catch (error) {
        setStatus(
          `Error al cargar el código: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`
        );
      }
    }

    loadCode();
  }, [mainUrl, setCircuitCode, setStatus]);

  async function handleCompile() {
    setStatus(null);
    setIsLoading(true);
    setAcir(null);

    try {
      const fm = createFileManager("/");

      if (!circuitCode) {
        throw new Error("El código del circuito no está cargado.");
      }

      const nargoResponse = await fetch(nargoTomlUrl);

      if (!nargoResponse.ok) {
        throw new Error("Error al cargar el archivo Nargo.toml.");
      }

      const nargoBody = await nargoResponse.text();

      const mainStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(circuitCode));
          controller.close();
        },
      });

      const nargoStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(nargoBody));
          controller.close();
        },
      });

      fm.writeFile("./src/main.nr", mainStream);
      fm.writeFile("./Nargo.toml", nargoStream);

      const compiledCircuit = await compile(fm);

      setAcir(JSON.stringify(compiledCircuit, null, 2));
      setStatus("¡Circuito compilado correctamente!");
      onCompile(compiledCircuit);
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="circuit-compiler-container">
      <h2 className="circuit-compiler-title">Paso 1: Compilá</h2>
      <button
        onClick={handleCompile}
        className="circuit-compiler-button"
        disabled={isLoading || !circuitCode}
      >
        {isLoading ? "Compilando..." : "Compilar Circuito"}
      </button>

      <div className="editor-wrapper">
        {circuitCode && (
          <div className="editor-container">
            <MonacoEditor
              height="100%"
              defaultLanguage="rust"
              theme="vs-dark"
              value={circuitCode}
              onChange={(value) => setCircuitCode(value || "")}
              options={{
                readOnly: false,
                folding: true,
                scrollBeyondLastLine: false,
                cursorStyle: "line",
              }}
            />
          </div>
        )}

        {acir && (
          <div className="editor-container">
            <MonacoEditor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={acir}
              options={{
                readOnly: true,
                folding: true,
                wordWrap: "wordWrapColumn",
                wordWrapColumn: 80,
              }}
            />
          </div>
        )}
      </div>
      {status && (
        <div
          className={`circuit-compiler-status ${
            status.startsWith("Error") ? "error" : "success"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}

export default CircuitCompiler;

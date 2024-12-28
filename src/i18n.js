import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Traducciones
const resources = {
  en: {
    merkle: {
      title: "Merkle Tree Builder",
      introduction: "A Merkle Tree is a binary tree data structure that efficiently verifies the integrity and consistency of large datasets. Each leaf in the tree contains a hash value, and the intermediate nodes represent combinations of the hashes of their child nodes. The root of the tree, known as the Merkle Root, summarizes all the information contained in the leaves.",
      invitation: "Below, you can create your own Merkle Tree. Try adding leaves and explore how the root and different levels of the tree are generated.",
      enterNodeValue: "Enter a value for the node",
      addNode: "Add Node",
      addingNode: "Adding...",
      nodeValues: "Node Values:",
      noNodesYet: "No nodes added yet.",
      treeRoot: "Tree Root:",
      emptyTree: "The tree is currently empty.",
      treeVisualization: "Merkle Tree Visualization",
      level: "Level",
      errorBuildingTree: "Error building Merkle Tree:",
      node: "Value"
    },
    hero: {
      title: "Noir Cookbook",
      description1: "Examples of using Noir.",
      description2: "Step by step through the example to learn the flow of creating and verifying ZK proofs.",
      circuitExplanation: "Circuit explanation:",
      circuitInputs: "Circuit inputs:",
      balance: "balance",
      balanceDescription: "Available amount (private).",
      payment: "payment",
      paymentDescription: "Amount to be paid (private).",
      limit: "limit",
      limitDescription: "Maximum allowed limit for a payment (private).",
      fee_rate: "fee_rate",
      feeRateDescription: "Commission rate in percentage (private).",
      circuitLogic: "Circuit logic:",
      feeCalculation: "Calculate the fee using the formula:",
      feeFormula: "fee = payment × fee_rate / 100",
      totalPaymentCalculation: "Calculate the total payment by adding the fee to the payment amount:",
      totalPaymentFormula: "total_payment = payment + fee",
      assertConditions: "Verify two conditions using assert (these conditions must be met for the circuit to be valid):",
      balanceCondition: "The balance must be sufficient to cover the total payment:",
      balanceFormula: "balance ≥ total_payment",
      limitCondition: "The total payment must not exceed the allowed limit:",
      limitFormula: "total_payment ≤ limit"
    },
    circuitCompiler: {
      title: "Step 1: Compile",
      compile: "Compile Circuit",
      compiling: "Compiling...",
      circuitTitle: "Circuit in Noir",
      acirTitle: "Generated ACIR",
      compileSuccess: "Circuit compiled successfully!",
      compileError: "Error compiling the circuit.",
      loadError: "Error loading circuit file.",
      missingCircuitCode: "Circuit code not loaded.",
      nargoError: "Error loading Nargo.toml.",
      errorPrefix: "Error",
      explanation: "By pressing the \"Compiler Circuit\" button, the compiler generates the ACIR file (Abstract Circuit Intermediate Representation), which is a low-level representation of the circuit used for generating and verifying zero-knowledge proofs."
    },
    proofForm: {
      title: "Step 2: Prove",
      suggestedValues: "Suggested values for the base example:",
      exampleValues: "balance: 200, payment: 100, limit: 300, fee_rate(%): 10",
      creatingProof: "Creating proof...",
      createProof: "Create Proof",
      successMessage: "Proof successfully created!",
      errorPrefix: "Error",
      unknownError: "Unknown error occurred",
      explanation: "Now that the ACIR is generated, you can create a proof using parameters that satisfy the circuit. If the parameters do not meet the circuit's constraints, the proof cannot be generated.",
      parameters: {
        balance: "Balance",
        payment: "Payment",
        limit: "Limit",
        fee_rate: "Fee Rate (%)"
      }
    },
    proofVerifier: {
      title: "Step 3: Verify",
      subtitle: "Proof",
      placeholder: "Here the proof will appear in Uint8Array format...",
      verifying: "Verifying...",
      verify: "Verify Proof",
      successMessage: "Proof verified successfully!",
      invalidProof: "Invalid proof.",
      noProof: "There is no proof to verify.",
      errorPrefix: "Verification error",
      unknownError: "Unknown error occurred",
      explanation: "Below, you can see the generated proof. The next step is to verify that it was created correctly. If the proof includes public inputs, fields for entering these inputs will appear below. By clicking 'Verify Proof', the system will validate whether the proof is correct. Note: If you manually edit the proof in the editor or modify the public inputs, the verification will fail.",
      publicInputs: "Public Inputs",
      noPublicInputs: "This proof has no public inputs.",
      parameters: {
        balance: "Balance",
        payment: "Payment",
        limit: "Limit",
        fee_rate: "Fee Rate (%)"
      }
    }
  },
  es: {
    merkle: {
      title: "Creador de Árbol Merkle",
      introduction: "Un Árbol Merkle es una estructura de datos en forma de árbol binario que permite verificar la integridad y consistencia de grandes cantidades de datos de manera eficiente. Cada hoja del árbol contiene un valor hash y los nodos intermedios representan combinaciones de los hashes de sus nodos hijos. La raíz del árbol, conocida como Merkle Root, resume toda la información contenida en las hojas.",
      invitation: "Aquí abajo podés crear tu propio Árbol Merkle. Probá añadiendo hojas y explorá cómo se genera la raíz y los diferentes niveles del árbol.",
      enterNodeValue: "Ingresá el valor de la hoja",
      addNode: "Añadir hoja",
      addingNode: "Añadiendo...",
      nodeValues: "Valor de las hojas:",
      noNodesYet: "Ingresá un valor",
      treeRoot: "Raíz del árbol:",
      emptyTree: "Añadí valores para ver el árbol.",
      treeVisualization: "Árbol generado:",
      level: "Nivel",
      errorBuildingTree: "Error al construir el Árbol Merkle:",
      node: "Valor"
    },    
    hero: {
      title: "Noir Cookbook",
      description1: "Ejemplos de uso de Noir.",
      description2: "Avanzá paso a paso el ejemplo para aprender el flujo de creación y verificación de pruebas ZK.",
      circuitExplanation: "Explicación del circuito:",
      circuitInputs: "Entradas del circuito:",
      balance: "balance",
      balanceDescription: "Monto disponible (privado).",
      payment: "payment",
      paymentDescription: "Monto que se quiere pagar (privado).",
      limit: "limit",
      limitDescription: "Límite máximo permitido para un pago (privado).",
      fee_rate: "fee_rate",
      feeRateDescription: "Tasa de comisión en porcentaje (público).",
      circuitLogic: "Lógica del circuito:",
      feeCalculation: "Calculá la comisión (fee) usando la fórmula:",
      feeFormula: "fee = payment × fee_rate / 100",
      totalPaymentCalculation: "Calculá el pago total (total_payment) sumando la comisión al monto del pago:",
      totalPaymentFormula: "total_payment = payment + fee",
      assertConditions: "Verificá dos condiciones usando assert (estas condiciones deben cumplirse para que el circuito sea válido):",
      balanceCondition: "El balance tiene que ser suficiente para cubrir el pago total:",
      balanceFormula: "balance ≥ total_payment",
      limitCondition: "El pago total no tiene que exceder el límite permitido:",
      limitFormula: "total_payment ≤ limit"
    },
    circuitCompiler: {
      title: "Paso 1: Compilá",
      compile: "Compilar Circuito",
      compiling: "Compilando...",
      circuitTitle: "Circuito en Noir",
      acirTitle: "ACIR generado",
      compileSuccess: "¡Circuito compilado correctamente!",
      compileError: "Error al compilar el circuito.",
      loadError: "Error al cargar el archivo del circuito.",
      missingCircuitCode: "El código del circuito no está cargado.",
      nargoError: "Error al cargar Nargo.toml.",
      errorPrefix: "Error",
      explanation: "Al presionar el botón \"Compilar Circuito\", el compilador genera el archivo ACIR (Representación Intermedia de Circuito Abstracto), que es una representación de bajo nivel del circuito utilizada para generar y verificar pruebas de conocimiento cero."
    },
    proofForm: {
      title: "Paso 2: Probá",
      suggestedValues: "Valores sugeridos para el ejemplo base:",
      exampleValues: "balance: 200, payment: 100, limit: 300, fee_rate(%): 10",
      creatingProof: "Creando prueba...",
      createProof: "Crear Prueba",
      successMessage: "¡Prueba creada correctamente!",
      errorPrefix: "Error",
      unknownError: "Ocurrió un error desconocido",
      explanation: "Ahora que está generado el ACIR, se puede generar una prueba usando como parámetros valores que satisfagan el circuito. En el caso de que los parámetros no cumplan con las restricciones del circuito, la prueba no se va a generar.",
      parameters: {
        balance: "Saldo",
        payment: "Pago",
        limit: "Límite",
        fee_rate: "Tasa de tarifa (%)"
      }
    },
    proofVerifier: {
      title: "Paso 3: Verificá",
      subtitle: "Prueba",
      placeholder: "Aquí aparecerá la prueba en formato Uint8Array...",
      verifying: "Verificando...",
      verify: "Verificar Prueba",
      successMessage: "¡Prueba verificada correctamente!",
      invalidProof: "Prueba inválida.",
      noProof: "No hay prueba para verificar.",
      errorPrefix: "Error de verificación",
      unknownError: "Ocurrió un error desconocido",
      explanation: "A continuación, podes ver la prueba generada. El siguiente paso es verificar que fue creada correctamente. Si la prueba incluye inputs públicos, aparecerán campos para que completes. Al presionar 'Verificar Prueba', el sistema comprobará si la prueba es válida. Nota: Si editás manualmente la prueba en el editor o modificas los inputs públicos, la verificación fallará.",
      unknownError: "Entradas publicas",
      publicInputs: "Entradas públicas",
      noPublicInputs: "Esta prueba no tiene entradas públicas.",
      parameters: {
        balance: "Saldo",
        payment: "Pago",
        limit: "Límite",
        fee_rate: "Tasa de tarifa (%)"
      }
    }
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

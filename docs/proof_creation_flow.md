# Flujo de la Prueba

Este documento describe el flujo completo para la generación y verificación de pruebas utilizando **UltraHonkBackend** a nivel más bajo.

---

## 1. Escritura del Circuito
El proceso comienza escribiendo el circuito en un lenguaje específico para pruebas (como Noir).

Aqui definimos las entradas publicos y/o privadas, operaciones a realizar con las entradas y por ultimo las condiciones a cumplir para que el circuito sea valido

#### Ejemplo de circuito 

```rust
fn main(balance: u64, payment: u64, limit: u64, fee_rate: u64) {
    let fee: u64 = (payment * fee_rate) / 100;
    let total_payment: u64 = payment + fee;
    assert(balance >= total_payment);
    assert(total_payment <= limit);
}
```


---

## 2. Compilación y Generación de ACIR
Una vez definido el circuito:
- **Compilación:** El circuito es transformado a un formato intermedio conocido como **ACIR (Abstract Circuit Intermediate Representation)**.
- Este formato abstracto estandariza el circuito y lo prepara para las siguientes etapas del flujo.

#### Ejemplo de ACIR

```json
{
  "noir_version": "1.0.0-beta.0+7311d8ca566c3b3e0744389fc5e4163741927767",
  "hash": 3823948791287999924,
  "abi": {
    "parameters": [
      {
        "name": "balance",
        "type": { "kind": "integer", "sign": "unsigned", "width": 64 },
        "visibility": "private"
      },
      {
        "name": "payment",
        "type": { "kind": "integer", "sign": "unsigned", "width": 64 },
        "visibility": "private"
      },
      {
        "name": "limit",
        "type": { "kind": "integer", "sign": "unsigned", "width": 64 },
        "visibility": "private"
      },
      {
        "name": "fee_rate",
        "type": { "kind": "integer", "sign": "unsigned", "width": 64 },
        "visibility": "private"
      }
    ],
    "return_type": null,
    "error_types": {
      "5019202896831570965": {
        "error_kind": "string",
        "string": "attempt to add with overflow"
      },
      "7233212735005103307": {
        "error_kind": "string",
        "string": "attempt to multiply with overflow"
      }
    }
  },
  "bytecode": "H4sIAAAAAAAA/+VXS07DMBCdfJo0n64QSNzCztdhBQsO0pBkzy04AHeAk7CABZfgINTCFu7EVIKMEahPiqaduC/PTzPuxIMP5LvrTH32dlegosQlynmWnG/JBSoHiEuCLQO3aZQoWVNVY1uMvORbVnS9qFlV943ggteiHgpRlqOoRNv1Xcs6XpUjn+qunBRxSKeRmRo1b6i4fZiD2iPKvVjkEnE3lenFSsUIUDHJGxcoJxfFSJRPbGIEdMUVk+niN6YPscWHwGEx/dSHcZLohhWhpxG4KXJq/zxCLkr/1uDmwNO8hw486l6Fv+ELxwnL1sm4TV8TFVOA/YMyNR6oES4TMhPmyvxvcjHExRNCXamjoqCeYhKgPfglfqOBfTjuBs5UzHVR6AbOwX0DuzJ/aQNnhLpy+B8NnAHt5BGimtGafficdEzYRvKX+9enx7vtYK7bqHj6dnV++/xwjf1Yq7j3zwTz10O2DIXmz9zwMzxdm3sxn4v9Cy2/87747qN4aC3Om7mN5Z7mPFHR1Kv38Q4hBj2HCxAAAA==",
  "debug_symbols": "ldNLCoQwDAbgu2TtoqlvrzIMUrVKoVSpOjCId58qU5DSTZZJ/i+btAcMstunVplxXqF5HaDnXmxqNq46ILtb6yLMVa2bsBs0VZ6ANAM0yNIzgVFpCU1Rne8EcmK+iOYzn0cW5EtiviLma2IeGRUgFfAYwAy9yLNQpGQRPTMWpRc1hiIni4IsSrKInpsz//44L0NRUwVnZIE04YrOKq3V1D7/omt/hFWi0/JfjrvpH9Ptu/iJ94udeznsVl6b7plb/wM=",
  "file_map": {
    "68": {
      "source": "fn main(balance: u64, payment: u64, limit: u64, fee_rate: u64) {\n    let fee: u64 = (payment * fee_rate) / 100;\n    let total_payment: u64 = payment + fee;\n    assert(balance >= total_payment);\n    assert(total_payment <= limit);\n}\n",
      "path": "/Users/francoperez/repos/zk/noir-class-01/circuit/src/main.nr"
    }
  },
  "names": ["main"],
  "brillig_names": ["directive_integer_quotient"]
}
```


- **Generación de ACIR con UltraHonkBackend:** Despues de compilar el circuito en ACIR, backend UltraHonk lo convierte en un conjunto de artefactos matemáticos necesarios para la generación de pruebas. Estos artefactos incluyen las estructuras necesarias para calcular los compromisos y las restricciones. Internamente, se construyen polinomios y se preparan los esquemas de compromiso.

---

## 3. Generación del Witness
El siguiente paso es calcular el **witness**:
- Los **inputs** del circuito se añaden como valores específicos que deben cumplir las condiciones del circuito.
``` javascript
    const { witness } = await noir.execute(params);
```

- El witness es un conjunto de valores intermedios calculados a partir de los inputs y el circuito.
- Sirve como evidencia de que los inputs cumplen las reglas definidas en el circuito.

---

## 4. Generación de la Prueba
Con el witness calculado:
- Se utiliza el **UltraHonkBackend** para generar la prueba criptográfica.
- La prueba resultante se devuelve en formato **Uint8Array** junto con los inputs proporcionados.

---

## 5. Verificación de la Prueba
Finalmente, la prueba se verifica mediante:
- El uso del circuito original y los inputs para comprobar que la prueba es válida.
- La verificación garantiza que los cálculos son correctos sin revelar los inputs confidenciales.

---

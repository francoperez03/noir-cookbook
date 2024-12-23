# Noir Cookbook

Este documento sirve como una guía práctica para trabajar con proyectos en Noir. Aquí encontrarás pasos, configuraciones y consejos útiles para sacar el máximo provecho a esta poderosa herramienta de desarrollo.

## Introducción

Este ejemplo utiliza un circuito llamado `main` que toma cuatro parámetros: `balance`, `payment`, `limit` y `fee_rate`. La función calcula el monto total del pago incluyendo el fee y verifica dos condiciones:

* Que el balance sea mayor o igual al monto total del pago;
* Que el monto total del pago sea menor o igual al límite de pago.

De esta manera, se garantiza que el pago sea válido y se cumplan las condiciones de pago.
## Código del Circuito

```rust
fn main(balance: u64, payment: u64, limit: u64, fee_rate: u64) {
    let fee: u64 = (payment * fee_rate) / 100;
    let total_payment: u64 = payment + fee;
    assert(balance >= total_payment);
    assert(total_payment <= limit);
}
```

---

## Instalación de noirup

Antes de empezar, asegurate de tener `noirup` instalado para gestionar Noir en tu entorno:

```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
```

Esto descargará e instalará noirup, el gestor recomendado para Noir.


## Crear un Proyecto Nuevo

Para inicializar un proyecto en Noir:

#### Crear un nuevo circuito:

```bash
nargo new circuit
```

#### Ingresar al directorio del proyecto:

```bash
cd circuit
```

#### Compilar el circuito:

```bash
nargo compile
```

Esto creará la carpeta target que contiene los artefactos generados.

## Configuración del Entorno de Desarrollo

Para configurar tu entorno de desarrollo en un proyecto que combine Noir con JavaScript/TypeScript, instala las siguientes dependencias:

```bash
npm install @noir-lang/noir_wasm@1.0.0-beta.0 @noir-lang/noir_js@1.0.0-beta.0 @aztec/bb.js@0.63.1
```

Estas librerías son esenciales para interactuar con Noir desde JavaScript o TypeScript y facilitan la integración con aplicaciones web.

## Configuración Inicial de una App Web

#### Instala las dependencias necesarias:

```bash
npm install
npm run dev
```
El comando npm run dev hará que comience a correr el servidor de desarrollo. Una vez que el servidor esté en funcionamiento, abrí tu navegador y dirigite a la aplicación. Luego, abrí el panel de desarrollo del navegador (Inspect o DevTools) y hacé clic en el botón que dice Crear Prueba.

Deberías ver el witness generado en la consola del navegador. A continuación, se muestra un ejemplo del resultado esperado:

```json

{
    "0": 31,
    "1": 139,
    "2": 8,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 2,
    "9": 255,
    "10": 173,
    // ...
}
```
Si no se cumplen las condiciones para generar la prueba, verás un cartel con el siguiente mensaje:

```text
Error: Cannot satisfy constraint
```

## Buenas Prácticas

- Separá el circuito de la aplicación web.
- Utilizá herramientas como `nargo` para validar y compilar los circuitos antes de integrarlos.
- Estamos usando la versión `1.0.0-beta.0`.

Con esta guía podés iniciar proyectos con Noir de manera eficiente y estructurada. Si tenés dudas o sugerencias, no dudes en compartirlas.

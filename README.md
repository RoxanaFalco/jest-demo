# 🏦 Ejemplo Jest: Cuenta Bancaria

Proyecto de ejemplo de **pruebas unitarias con Jest**.
Contiene una clase `CuentaBancaria` (depositar, extraer, consultar saldo y generar un alias)
y un archivo de tests que la prueba con los matchers más comunes.

Este material acompaña la demo de clase y queda como **referencia** para escribir tests propios.

## 🎯 Contenidos

- Organización de un archivo de tests (`describe`, `test`, `beforeEach`).
- Matchers `toBe`, `toBeTruthy`, `toBeFalsy`, `toThrow` y `toMatch`, con ejemplos.
- Lectura de un test que falla.
- Medición de cobertura.
- Un caso real en el que un test detecta un bug.

## 📁 Estructura

```
cuenta-bancaria-jest/
├── package.json
├── src/
│   └── CuentaBancaria.js        ← código a probar
└── tests/
    └── CuentaBancaria.test.js   ← tests unitarios
```

## ⚙️ Preparación

Requisito: tener [Node.js](https://nodejs.org/) instalado. Desde la carpeta del proyecto:

```bash
npm install            # instala Jest (solo la primera vez)
npm test               # ejecuta todos los tests
npm run test:watch     # vuelve a ejecutar los tests cada vez que se guarda un archivo
npm run test:coverage  # ejecuta los tests y muestra la cobertura
```

---

## 📖 Paso a paso de la demo

### Paso 1. El código a probar

El archivo `src/CuentaBancaria.js` define la clase. Cada método se prueba con un matcher distinto:

| Método         | Qué hace                                 | Matcher utilizado         |
| -------------- | ---------------------------------------- | ------------------------- |
| `depositar`    | suma al saldo y devuelve el saldo nuevo  | `toBe`, `toThrow`         |
| `extraer`      | resta del saldo, valida saldo suficiente | `toBe`, `toThrow`         |
| `tieneSaldo`   | devuelve `true` / `false`                | `toBeTruthy`, `toBeFalsy` |
| `generarAlias` | `"Juan Pérez"` → `"juan.perez.cuenta"`   | `toMatch`                 |

Antes de escribir un test conviene identificar, para cada método, qué devuelve, qué modifica y en qué casos lanza un error.

### Paso 2. Anatomía de un test

El archivo `tests/CuentaBancaria.test.js` usa estas piezas:

- `describe(...)`: agrupa tests relacionados (por clase o por método).
- `test(...)` (o su alias `it(...)`): define un caso de prueba.
- `beforeEach(...)`: se ejecuta antes de cada test. De esta forma cada test parte de una cuenta nueva y **ningún test depende de otro**.
- `expect(valor).matcher(esperado)`: la verificación.

Cada test sigue el patrón **AAA**: *Arrange* (preparar), *Act* (ejecutar) y *Assert* (verificar).

```js
test("suma el monto al saldo", () => {
  cuenta.depositar(500);                // Act   (el Arrange está en el beforeEach)
  expect(cuenta.getSaldo()).toBe(1500); // Assert
});
```

### Paso 3. Ejecución de los tests

```bash
npm test
```

En la salida:

- ✓ verde: test que pasó.
- ✎: test pendiente, declarado con `test.todo` (todavía no tiene implementación).
- Al final, un resumen con la cantidad de tests que pasaron, fallaron o quedaron pendientes.

### Paso 4. `toBe`: igualdad exacta

```js
expect(cuenta.depositar(250)).toBe(1250);
expect(cuenta.extraer(1000)).toBe(0); // caso límite: extraer todo el saldo
```

- `toBe` compara con `===`. Sirve para números, strings y booleanos.
- Para objetos o arrays se usa `toEqual`, que compara el contenido y no la referencia.
- El segundo ejemplo es un **caso límite**: extraer exactamente el saldo disponible. Los bordes son donde más errores suelen aparecer.

### Paso 5. `toBeTruthy` / `toBeFalsy`

```js
expect(cuenta.tieneSaldo()).toBeTruthy();
cuenta.extraer(1000);
expect(cuenta.tieneSaldo()).toBeFalsy();
```

- Estos matchers no exigen exactamente `true` o `false`: alcanza con que el valor sea *truthy* o *falsy*.
- Valores *falsy* en JavaScript: `false`, `0`, `""`, `null`, `undefined` y `NaN`. Todo lo demás es *truthy*.
- Si se necesita exactamente `true`, corresponde usar `toBe(true)`.

### Paso 6. `toThrow`: errores esperados

```js
expect(() => cuenta.depositar(0)).toThrow();                      // cualquier error
expect(() => cuenta.extraer(5000)).toThrow("Saldo insuficiente"); // el mensaje contiene ese texto
expect(() => cuenta.extraer(-1)).toThrow(/mayor a cero/);         // el mensaje cumple la regex
```

⚠️ **Punto clave:** la llamada va **envuelta en una función flecha** `() => ...`.
Sin la flecha, el error se lanza antes de que Jest pueda capturarlo y el test falla:

```js
expect(cuenta.depositar(0)).toThrow(); // ❌ incorrecto
```

> 🔎 **En la demo:** se quitó la flecha de uno de estos tests, se ejecutó `npm test` y el test falló con el error sin capturar. Al volver a agregar la flecha, el test pasó.

### Paso 7. `toMatch`: strings y expresiones regulares

```js
expect(cuenta.generarAlias()).toMatch(/\.cuenta$/);            // termina en ".cuenta"
expect(cuenta.generarAlias()).toMatch("juan");                 // contiene "juan"
expect(cuenta.generarAlias()).toMatch(/^[a-z]+(\.[a-z]+)*$/); // formato válido, sin tildes
```

- Con un **string**, verifica que el texto esté contenido.
- Con una **regex**, verifica que el string cumpla el patrón.

### Paso 8. Un test que falla (rojo)

Para ver cómo reporta Jest un fallo, se cambió a propósito un valor esperado:

```js
expect(cuenta.getSaldo()).toBe(9999);
```

Al ejecutar `npm test`, el mensaje de error muestra:

- **Expected**: el valor esperado según el test (`9999`).
- **Received**: el valor que realmente devolvió el código (`1500`).
- La línea exacta del test que falló.

Leer este mensaje con atención es la forma más rápida de entender qué salió mal. Luego se restauró el valor correcto y el test volvió a verde.

### Paso 9. Cobertura

```bash
npm run test:coverage
```

Se genera una tabla con el porcentaje de:

- **Stmts**: sentencias ejecutadas.
- **Branch**: ramas recorridas (cada `if` tiene al menos dos caminos).
- **Funcs**: funciones llamadas.
- **Lines**: líneas ejecutadas.

También se genera un reporte visual en `coverage/lcov-report/index.html`, que se puede abrir en el navegador: las líneas cubiertas aparecen en verde y las no cubiertas en rojo.

> 🔎 **En la demo:** se comentó el test `"lanza error si no hay saldo suficiente"` y se volvió a medir la cobertura. La columna **% Branch** bajó y quedó marcada la línea del `if` que no se estaba probando. Después se descomentó el test.

### Paso 10. Un test que encuentra un bug

En el archivo de tests hay un test pendiente:

```js
test.todo("lanza error si el saldo inicial es negativo");
```

1. Se reemplaza por un test real:

   ```js
   test("lanza error si el saldo inicial es negativo", () => {
     expect(() => new CuentaBancaria("Ana", -500)).toThrow();
   });
   ```

2. Al ejecutar `npm test`, el test **falla**: el código permite crear cuentas con saldo negativo. 🐞
3. Se corrige el constructor en `src/CuentaBancaria.js`:

   ```js
   if (saldoInicial < 0) {
     throw new Error("El saldo inicial no puede ser negativo");
   }
   ```

4. Al volver a ejecutar `npm test`, el test **pasa**. ✅

**Conclusión:** antes de este test la cobertura ya estaba en 100% y, aun así, había un bug.
**Una cobertura alta no garantiza la ausencia de errores**: también hay que pensar en casos límite y en datos no válidos.

> 📝 En este repositorio el test sigue como `test.todo` y el constructor sin corregir, para poder reproducir el paso completo.

---

## 📋 Resumen de matchers

| Matcher                 | Para qué sirve                             | Ejemplo                                    |
| ----------------------- | ------------------------------------------ | ------------------------------------------ |
| `toBe(x)`               | igualdad exacta (`===`) de primitivos      | `expect(saldo).toBe(1500)`                 |
| `toBeTruthy()`          | el valor es *truthy*                       | `expect(cuenta.tieneSaldo()).toBeTruthy()` |
| `toBeFalsy()`           | el valor es *falsy*                        | `expect(cuenta.tieneSaldo()).toBeFalsy()`  |
| `toThrow(msg \| regex)` | la función lanza un error                  | `expect(() => c.extraer(9e9)).toThrow()`   |
| `toMatch(str \| regex)` | el string contiene el texto / cumple regex | `expect(alias).toMatch(/\.cuenta$/)`       |

## 🔗 Referencias

- Jest: matchers: https://jestjs.io/docs/expect
- Jest: primeros pasos: https://jestjs.io/docs/getting-started

const CuentaBancaria = require("../src/CuentaBancaria");

/* Jest API https://jestjs.io/docs/expect */

describe("CuentaBancaria", () => {
  let cuenta;

  // Se ejecuta antes de cada test: cada uno arranca con una cuenta nueva
  beforeEach(() => {
    cuenta = new CuentaBancaria("Juan Pérez", 1000);
  });

  // ---------- toBe: igualdad exacta de valores primitivos ----------
  describe("depositar", () => {
    test("suma el monto al saldo", () => {
      cuenta.depositar(500);
      expect(cuenta.getSaldo()).toBe(1500);
    });

    test("devuelve el saldo actualizado", () => {
      expect(cuenta.depositar(250)).toBe(1250);
    });

    // ---------- toThrow: la función lanza un error ----------
    test("lanza error si el monto es cero", () => {
      expect(() => cuenta.depositar(0)).toThrow();
    });

    test("lanza error si el monto es negativo, con mensaje específico", () => {
      expect(() => cuenta.depositar(-100)).toThrow(
        "El monto debe ser mayor a cero",
      );
    });
  });

  describe("extraer", () => {
    test("resta el monto del saldo", () => {
      cuenta.extraer(300);
      expect(cuenta.getSaldo()).toBe(700);
    });

    test("permite extraer todo el saldo (caso límite)", () => {
      expect(cuenta.extraer(1000)).toBe(0);
    });

    test("lanza error si no hay saldo suficiente", () => {
      expect(() => cuenta.extraer(5000)).toThrow("Saldo insuficiente");
    });

    test("el mensaje del error puede validarse con una regex", () => {
      expect(() => cuenta.extraer(-1)).toThrow(/mayor a cero/);
    });
  });

  // ---------- toBeTruthy / toBeFalsy: valores "verdaderos" o "falsos" ----------
  describe("tieneSaldo", () => {
    test("es verdadero cuando el saldo es positivo", () => {
      expect(cuenta.tieneSaldo()).toBeTruthy();
    });

    test("es falso cuando la cuenta queda en cero", () => {
      cuenta.extraer(1000);
      expect(cuenta.tieneSaldo()).toBeFalsy();
    });

    test("es falso para una cuenta nueva sin saldo inicial", () => {
      const cuentaVacia = new CuentaBancaria("Ana");
      expect(cuentaVacia.tieneSaldo()).toBeFalsy();
    });
  });

  // ---------- toMatch: el string cumple una expresión regular o contiene un texto ----------
  describe("generarAlias", () => {
    test("termina en .cuenta", () => {
      expect(cuenta.generarAlias()).toMatch(/\.cuenta$/);
    });

    test("contiene el nombre del titular", () => {
      expect(cuenta.generarAlias()).toMatch("juan");
    });

    test("solo tiene minúsculas y puntos, sin tildes ni espacios", () => {
      expect(cuenta.generarAlias()).toMatch(/^[a-z]+(\.[a-z]+)*$/);
    });
  });

  describe("constructor", () => {
    test("lanza error si el titular está vacío", () => {
      expect(() => new CuentaBancaria("   ")).toThrow(
        "El titular es obligatorio",
      );
    });

    test("el saldo inicial por defecto es 0", () => {
      expect(new CuentaBancaria("Ana").getSaldo()).toBe(0);
    });

    test.todo("lanza error si el saldo inicial es negativo");
  });
});

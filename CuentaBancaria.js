class CuentaBancaria {
  constructor(titular, saldoInicial = 0) {
    if (!titular || titular.trim() === "") {
      throw new Error("El titular es obligatorio");
    }
    this.titular = titular.trim();
    this.saldo = saldoInicial;
  }

  depositar(monto) {
    if (monto <= 0) {
      throw new Error("El monto debe ser mayor a cero");
    }
    this.saldo += monto;
    return this.saldo;
  }

  extraer(monto) {
    if (monto <= 0) {
      throw new Error("El monto debe ser mayor a cero");
    }
    if (monto > this.saldo) {
      throw new Error("Saldo insuficiente");
    }
    this.saldo -= monto;
    return this.saldo;
  }

  getSaldo() {
    return this.saldo;
  }

  tieneSaldo() {
    return this.saldo > 0;
  }

  // "Juan Pérez" -> "juan.perez.cuenta"
  generarAlias() {
    const nombre = this.titular
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .split(/\s+/)
      .join(".");
    return `${nombre}.cuenta`;
  }
}

module.exports = CuentaBancaria;

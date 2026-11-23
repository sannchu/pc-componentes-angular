export default class Email {
  #email = '';

  get value(): string {
    return this.#email;
  }

  set value(value: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Email es requerido');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error('Formato del email no válido');
    }
    this.#email = value.trim().toLowerCase();
  }

  constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }
}

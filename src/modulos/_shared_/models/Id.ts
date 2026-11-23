export default class Id {
  #id: string;

  get id(): string {
    return this.#id;
  }

  constructor(value: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Id es requerido');
    }
    this.#id = value;
  }

  static generateObjectId(): Id {
    const randomId = globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 24);
    return new Id(randomId);
  }
}

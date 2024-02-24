export class RandomGeneratorHelper {
  private characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor(private length: number) {
    this.length = length;
  }

  generateRandomString() {
    let randomString = '';
    const timeStamp = String(new Date().getTime());
    const charactersLength = this.characters.length;
    for (let i = 0; i < this.length; i++) {
      randomString +=
        this.characters.charAt(Math.floor(Math.random() * charactersLength)) +
        Number(timeStamp.substr(i, 2)).toString(36);
    }
    return randomString;
  }
}

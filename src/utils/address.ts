import Utils from './utils';
import { Crypto } from './crypto';

export default class AddressUtils {
  /**
   * Convert bech32 address to hex string
   * @param addr Bech32 address
   * @returns Hex address
   */
  static getAddrHexFromBech32(addr: string): string {
    return Utils.ab2hexstring(Crypto.decodeAddress(addr));
  }
}

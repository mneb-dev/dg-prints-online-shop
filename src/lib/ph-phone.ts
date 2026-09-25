const PH_MOBILE_PHONE_REGEX = /^(?:\+63|63|0)9\d{9}$/

/** Same check as the server's `isValidPhMobileNumber`: 09XXXXXXXXX, 639XXXXXXXXX or +639XXXXXXXXX
 *  (spaces and dashes ignored). */
export function isValidPhMobileNumber(value: string): boolean {
  return PH_MOBILE_PHONE_REGEX.test(value.replace(/[\s-]/g, ""))
}

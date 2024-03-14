
/**
 * function to create a fake piste for testing
 * @param {string} fakeName - "number or name of the piste"
 * @param {string} fakeSkiAreaId - "id of the ski area"
 * @returns piste object
 */
export default function makeFakePiste(fakeName, fakeSkiAreaId) {
  return {
    name: fakeName,
    skiAreaId: fakeSkiAreaId,
  };
}


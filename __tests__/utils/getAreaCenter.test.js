import getAreaCenter from "../../utils/helpers/getAreaCenter";

describe('getAreaCenter', () => {
    it('should return the center of the area when bounds are within range', () => {
        const bounds1 = [1, -1, 1, -1];
        expect(getAreaCenter(bounds1)).toEqual({ lat: 1, lon: -1 });
    });

    it('should return the center of the area when bounds are equal', () => {
        const bounds3 = [2, 2, 2, 2];
        expect(getAreaCenter(bounds3)).toEqual({ lat: 2, lon: 2 });
    });

    it('should return the center of the area when bounds are negative', () => {
        const bounds4 = [-2, -4, -3, -5];
        expect(getAreaCenter(bounds4)).toEqual({ lat: -2.5, lon: -4.5 });
    });

    it('should return the center of the area when bounds are positive', () => {
        const bounds5 = [10, 6, 8, 4];
        expect(getAreaCenter(bounds5)).toEqual({ lat: 9, lon: 5 });
    });

    it('should return the center of the area when bounds are decimal numbers', () => {
        const bounds6 = [2.5, -3.5, -4.5, -4.5];
        expect(getAreaCenter(bounds6)).toEqual({ lat: -1, lon: -4 });
    });
});

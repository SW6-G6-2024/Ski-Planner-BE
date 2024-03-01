import { generateRatings } from "../../population/generateData";

describe("generate ratings", () => {
  test("should generate ratings", () => {
    const ratings = generateRatings(5);
    expect(ratings.length).toBe(5);
  });

  test("should generate ratings with correct properties", () => {
    const ratings = generateRatings(5);
    ratings.forEach((rating) => {
      expect(rating).toHaveProperty("piste");
      expect(rating).toHaveProperty("user");
      expect(rating).toHaveProperty("points");
      expect(rating).toHaveProperty("time");
      expect(rating).toHaveProperty("weather");
    });
  });
});

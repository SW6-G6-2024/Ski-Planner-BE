import checkParams from "../../../utils/validators/checkParams.js";
import { jest } from "@jest/globals";
import errorCodes from "../../../utils/errorCodes.js";

describe("checkParams", () => {
	const res = {
		status: jest.fn().mockReturnThis(),
		send: jest.fn(),
	};
	
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return an error response if the parameter is invalid", () => {
		const params = [
			{
				name: "param1",
				value: "undesired value",
				func: (value) => value !== "undesired value",
				funcErr: { code: 400, message: "Invalid parameter: param1" },
			},
		];

		checkParams(params, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({ code: 400, message: "Invalid parameter: param1" });
	});

	it("should not return an error response if all parameters are valid", () => {
		const params = [
			{
				name: "param1",
				value: "value1",
				func: (value) => value !== null,
				funcErr: { code: 400, message: "Invalid parameter: param1" },
			},
			{
				name: "param2",
				value: "value2",
				func: (value) => value !== null,
				funcErr: { code: 400, message: "Invalid parameter: param2" },
			},
		];

		checkParams(params, res);

		expect(res.status).not.toHaveBeenCalled();
		expect(res.send).not.toHaveBeenCalled();
	});

	it("should return an error response if a parameter is missing", () => {
		const params = [
			{
				name: "param1",
				value: null,
			},
		];

		checkParams(params, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith(errorCodes.general.missingParam("param1"));
	});

	it("should return an error response if an id parameter is invalid", () => {
		const params = [
			{
				name: "param1",
				value: "invalid id",
				id: true,
			},
		];

		checkParams(params, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith(errorCodes.general.invalidId("param1"));
	});
});

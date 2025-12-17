/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { beforeEach, describe, expect, test } from "bun:test";
import { CSSParser } from "../../../src/parser/css-parser";

describe("CSS Parser", () => {
	const parser = new CSSParser();

	test("should parse a simple element with text content", () => {
		const input = '.test{name: "value";}';
		const nodes = parser.parse(input);

		console.log(nodes);
	});
});

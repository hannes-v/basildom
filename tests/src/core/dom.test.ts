import { expect, test } from "bun:test";
import type { domElement } from "../../../src/core/dom";
import { HTMLParser, ParserHelper } from "../../../src/parser/html-parser";

test("ParserHelper", () => {
	expect(() => ParserHelper.assert(2 > 3)).toThrowError("assertion error");
	expect(ParserHelper.assert(2 > 1)).toBeEmpty();
	expect(() => ParserHelper.assertEq("2", "1")).toThrowError(
		"assertion error (eq)",
	);
	expect(ParserHelper.assertEq("2", "2")).toBeEmpty();
});

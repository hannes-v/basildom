import { expect, test } from "bun:test";
import { Parser, ParserHelper } from "../../../src/parser/html-parser";

test("ParserHelper", () => {
	expect(() => ParserHelper.assert(2 > 3)).toThrowError("assertion error");
	expect(ParserHelper.assert(2 > 1)).toBeEmpty();
	expect(() => ParserHelper.assertEq("2", "1")).toThrowError(
		"assertion error (eq)",
	);
	expect(ParserHelper.assertEq("2", "2")).toBeEmpty();
});

const p = new Parser();
const sampleText = `
    <html>
        <h1>Text</h1>
        <p>this is a test</p>
    </html>
    `;

test("Parser", () => {
	expect(p.parse(sampleText)).toBeArrayOfSize(3);
});

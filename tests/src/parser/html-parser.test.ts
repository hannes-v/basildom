import { describe, expect, test } from "bun:test";
import type { domElement, Node } from "../../../src/core/dom";
import {
	HTMLParser,
	type ParserInterface,
} from "../../../src/parser/html-parser";
import * as TESTFILE from "./test-fixtures";

/**
 * SETUP
 * - allows us to test private methods
 * -> use privateParser in tests
 */
interface PrivateParser {
	parse(ip: string): Node[];
	consume(): string;
	peek(): string;
	currentChar: number;
}
const parser = new HTMLParser();
const privateParser = parser as unknown as PrivateParser;

describe("HTML Parser", () => {
	test("consume removes element", () => {
		expect(privateParser.parse(TESTFILE.SIMPLE_HTML).length).toBe(1);
	});
	test("consume removes element", () => {
		true;
	});
	test("Parser", () => {
		expect(
			(privateParser.parse(TESTFILE.COMPLEX_HTML)[0]?.node_type as domElement)
				.tag_name,
		).toBe("html");
	});
});

/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { beforeEach, describe, expect, test } from "bun:test";
import type { domElement, Node } from "../../../src/core/dom";
import {
	HTMLParser,
	HTMLParser2,
	type ParserInterface,
} from "../../../src/parser/html-parser";

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

describe("HTMLParser2", () => {
	const parser: HTMLParser2 = new HTMLParser2();

	beforeEach(() => {
		const privateParser = new HTMLParser2();
		const parser = privateParser as unknown as PrivateParser;
	});

	test("should parse a simple element with text content", () => {
		const input = "<span>Hello World</span>";
		const nodes = parser.parse(input);

		expect(nodes.length).toBe(1);

		const span = nodes[0];
		expect((span!.node_type as any).tag_name).toBe("span");

		expect(span!.children.length).toBe(1);
		expect(span!.children[0]!.node_type).toBe("Hello World");
	});

	test("should parse attributes correctly", () => {
		const input = '<div id="maincontainer" class="box" datatest="123"></div>';
		const nodes = parser.parse(input);

		const div = nodes[0];
		const attrs = (div!.node_type as any).attrs as Map<string, string>;

		expect(attrs.size).toBe(3);
		expect(attrs.get("id")).toBe("maincontainer");
		expect(attrs.get("class")).toBe("box");
		expect(attrs.get("datatest")).toBe("123");
	});

	test("should handle nested structures", () => {
		const input = "<div><p>Inner Text</p></div>";
		const nodes = parser.parse(input);

		const div = nodes[0];
		expect(div!.children.length).toBe(1);

		const p = div!.children[0];
		expect((p!.node_type as any).tag_name).toBe("p");
		expect(p!.children[0]!.node_type).toBe("Inner Text");
	});

	test("should handle mixed text and elements", () => {
		const input = "<p>Das ist <b>fett</b> gedruckt.</p>";
		const nodes = parser.parse(input);

		const p = nodes[0];
		expect(p!.children.length).toBe(3);

		expect(p!.children[0]!.node_type).toBe("Das ist ");
		expect((p!.children[1]!.node_type as any).tag_name).toBe("b");
		expect(p!.children[2]!.node_type).toBe(" gedruckt.");
	});

	test("should ignore whitespace and newlines between tags", () => {
		const input = `
            <div>
                <p>Text</p>
            </div>
        `;
		const nodes = parser.parse(input);

		expect(nodes.length).toBe(1);

		const div = nodes[0];
		expect(div!.children.length).toBe(1);
		expect((div!.children[0]!.node_type as any).tag_name).toBe("p");
	});
});

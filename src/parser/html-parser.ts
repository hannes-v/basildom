import { type AttrMap, elemNode, type Node, textNode } from "../core/dom";

export const ParserHelper = {
	assert: (b: boolean): void => {
		if (!b) throw new Error("assertion error");
	},
	assertEq: (s1: string, s2: string): void => {
		if (s1 !== s2) throw new Error("assertion error (eq)");
	},
};

export interface ParserInterface {
	/**
	 * the currently observed character
	 */
	currentCharIndex: number;
	/**
	 * transforms the given input into Nodes
	 * @param input text to parse
	 * @returns a Node tree
	 */
	parse: (input: string) => Node[];
	/**
	 * consumes characters
	 * @param iterations number of characters to consume
	 * @returns all consumed characters as string
	 */
	consume: (iterations: number) => string;
	/**
	 * provides a look at the character without consuming it
	 * @param offset from the current position
	 * @default offset : 1
	 * @returns the string
	 */
	peek: (offset: number) => string;
}

export class HTMLParser {
	textAsArray: string[] = [""];
	currentCharIndex = 0;
	// TODO: performance optimization (dont calculate everytime)
	// peek = "";

	private setTextToParse = (text: string): void => {
		this.textAsArray = text.split("");
	};

	private parseAttributeValue = (): string => {
		const openQuote = this.consume();
		ParserHelper.assert(openQuote === '"');
		const value = this.consumeWhile((c) => c !== openQuote);
		const closeQuote = this.consume();
		ParserHelper.assertEq(openQuote, closeQuote);
		return value;
	};
	private parseNodes() {
		const nodes = [];
		while (true) {
			this.consumeWhitespace();
			if (this.eof()) {
				break;
			}
			// TODO: write a function for that:
			if (this.peek() === "<" && this.peek(1) === "/") {
				break; // there are no more children
			}
			nodes.push(this.parseNode());
		}
		return nodes;
	}
	private parseAttributes = (): AttrMap => {
		const attributes: AttrMap = new Map<string, string>();
		while (!this.eof() && this.peek() !== ">") {
			this.consumeWhitespace();
			if (this.peek() === ">") break; // in case of whitespace before "<"
			const name = this.parseName();

			this.expect("=");
			const value = this.parseAttributeValue();

			attributes.set(name, value);
		}

		return attributes;
	};

	private peek = (offset = 0): string => {
		const peekIndex = this.currentCharIndex + offset;
		if (peekIndex >= this.textAsArray.length) {
			throw new Error("End of input reached when peeking next character.");
		}

		return this.textAsArray[peekIndex] as string;
	};

	private consume = (iterations = 1): string => {
		const result = [];
		for (let i = 0; i < iterations; i++) {
			result.push(this.peek());
			this.currentCharIndex++;
		}
		return result.join("");
	};

	private eof = (): boolean => this.currentCharIndex >= this.textAsArray.length;

	private consumeWhile = (test: (st: string) => boolean): string => {
		const result: string[] = [];
		while (!this.eof() && test(this.peek())) {
			result.push(this.consume());
		}
		console.log(`result: ${result.join("")}`);
		return result.join("");
	};

	private consumeWhitespace = (): void => {
		this.consumeWhile(
			(c) => c === " " || c === "\n" || c === "\t" || c === "\r",
		);
	};

	private parseName = (): string => {
		return this.consumeWhile((c) => {
			return (
				(c >= "a" && c <= "z") ||
				(c >= "A" && c <= "Z") ||
				(c >= "0" && c <= "9")
			);
		});
	};

	private expect = (c: string): void => {
		for (const char of c.split("")) {
			console.log(`${char} --- ${this.textAsArray[this.currentCharIndex]}`);
			if (char !== this.textAsArray[this.currentCharIndex]) {
				throw new Error("expection failed");
			} else {
				this.currentCharIndex++;
			}
		}
	};

	private parseNode = (): Node => {
		if (this.peek() === "<") {
			return this.parseElement();
		} else {
			return this.parseText();
		}
	};

	private parseElement = (): Node => {
		// opening tag
		this.expect("<");
		const tag_name = this.parseName();
		const attrs = this.parseAttributes();
		this.expect(">");

		//children
		const children = this.parseNodes();

		// closing tag
		this.expect("</");
		this.expect(tag_name);
		this.expect(">");

		return elemNode(tag_name, attrs, children);
	};

	private parseText = (): Node => {
		const txt = this.consumeWhile((c) => c !== "<");
		return textNode(txt);
	};

	public parse(src: string): Node[] {
		this.currentCharIndex = 0;
		this.setTextToParse(src);
		const result = this.parseNodes();
		console.log(result);
		return result;
	}
}

// usage
// cont p = new Parser("<p>this is some text<p>")
// p.parse()

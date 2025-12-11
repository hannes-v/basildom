import { type AttrMap, elemNode, type Node, textNode } from "../core/dom";

export const ParserHelper = {
	assert: (b: boolean): void => {
		if (!b) throw new Error("assertion error");
	},
	assertEq: (s1: string, s2: string): void => {
		if (s1 !== s2) throw new Error("assertion error (eq)");
	},
};

export class Parser {
	textAsArray: string[] = [""];
	currentChar = 0;

	parseAttributeValue = (): string => {
		const openQuote = this.consume();
		ParserHelper.assert(openQuote === '"');
		const value = this.consumeWhile((c) => c !== openQuote);
		const closeQuote = this.consume();
		ParserHelper.assertEq(openQuote, closeQuote);
		return value;
	};
	parseNodes() {
		const nodes = [];
		while (true) {
			this.consumeWhitespace();
			if (this.eof()) {
				break;
			}
			nodes.push(this.parseNode());
		}
		return nodes;
	}
	parseAttributes = (): AttrMap => {
		const attributes: AttrMap = new Map();
		while (!this.eof() && this.peek() !== ">") {
			const name = this.parseName();
			this.expect("=");
			const value = this.parseAttributeValue();

			attributes.set(name, value);
		}

		return attributes;
	};

	private setTextToParse = (text: string): void => {
		this.textAsArray = text.split("");
	};

	peek = (): string => {
		const peekIndex = this.currentChar + 1;

		if (peekIndex >= this.textAsArray.length) {
			throw new Error("End of input reached when peeking next character.");
		}

		return this.textAsArray[peekIndex] as string;
	};

	consume = (): string => {
		const char = this.peek();
		this.currentChar++;
		return char;
	};

	eof = (): boolean => this.currentChar > this.textAsArray.length;

	consumeWhile = (test: (st: string) => boolean): string => {
		const result: string[] = [];
		while (!this.eof() && test(this.consume())) {
			result.push(this.consume());
		}
		return result.join("");
	};

	consumeWhitespace = (): void => {
		this.consumeWhile((st) => st === " ");
	};

	parseName = (): string => {
		return this.consumeWhile((c) => {
			return (
				(c >= "a" && c <= "z") ||
				(c >= "A" && c <= "Z") ||
				(c >= "0" && c <= "9")
			);
		});
	};

	private expect = (c: string): void => {
		for (const char in c.split("")) {
			if (char !== this.textAsArray[this.currentChar]) {
				throw new Error("expection failed");
			} else {
				this.currentChar++;
			}
		}
	};

	parseNode = (): Node => {
		if (this.textAsArray[this.currentChar] === "<") {
			return this.parseElement();
		} else {
			return this.parseText();
		}
	};

	parseElement = (): Node => {
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

	parseText = (): Node => {
		const txt = this.consumeWhile((c) => c !== "<");
		return textNode(txt);
	};

	parse(src: string): Node[] {
		this.setTextToParse(src);
		return this.parseNodes();
	}
}

// usage
// cont p = new Parser("<p>this is some text<p>")
// p.parse()

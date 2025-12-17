import {
	type CSSAttrMap,
	type CSSSelector,
	type Declaration,
	type Rule,
	SelectorSort,
	type Stylesheet,
} from "../core/styles";
import { BaseParser } from "./base-parser";

export class CSSParser extends BaseParser<Stylesheet> {
	override parse(input: string): Stylesheet {
		this.currentIndex = 0;
		this.setTextToParse(input);
		const result = { rules: this.parseRules() };
		return result;
	}
	private parseRules(): Rule[] {
		const rules: Rule[] = [];
		while (!this.eof()) {
			// we only support one selector right now
			const selector = this.parseSelector();
			this.consumeExpected("{");
			const declarations = this.parseDeclarations();
			this.consumeExpected("}");
			rules.push({ sel: [selector], declarations: declarations });
		}
		return rules;
	}
	private parseDeclarations(): Declaration[] {
		const declarations: Declaration[] = [];
		while (!this.eof() && this.peek() !== "}") {
			declarations.push(this.parseDeclaration());

			this.consumeExpected(";");
			this.consumeWhitespace();
		}
		return declarations;
	}

	private parseDeclaration(): Declaration {
		let attributes = {} as Declaration;
		this.consumeWhitespace();
		const name = this.parseName();

		this.consumeWhitespace();
		this.consumeExpected(":");
		this.consumeWhitespace();

		const value = this.consumeWhile((c) => c !== ";" && c !== "}");

		attributes = { name: name, value: value.trim() };

		return attributes;
	}

	private parseSelector(): CSSSelector {
		this.consumeWhitespace();
		const nextChar = this.peek();

		switch (nextChar) {
			case "#":
				this.consume();
				return { sort: SelectorSort.ID, name: this.parseName() };

			case ".":
				this.consume();
				return { sort: SelectorSort.Class, name: this.parseName() };

			case "*":
				this.consume();
				return { sort: SelectorSort.Universal, name: "*" };

			default:
				if (this.isLetter(nextChar)) {
					return { sort: SelectorSort.TagName, name: this.parseName() };
				}
				throw new Error(`Unknown selector start character: "${nextChar}"`);
		}
	}
}

import { BaseParser } from "./base-parser";

/**
 * Parser for key value pairs
 * utilizes the builder pattern
 * Future: would be nice if KVParser would be more universal (KVParser<K, V>)
 */
export enum QuotationMarks {
	DOUBLE = `"`,
	SINGLE = `'`,
}
class KVParser extends BaseParser<Map<string, string>> {
	divider: string = "";
	parseWhitespace: boolean = false;
	endingCharacters: string[] = [];
	allowedQuotes: QuotationMarks[] = [];

	public enableQuotationMarks(marks: QuotationMarks[]): this {
		this.allowedQuotes = marks;
		return this;
	}

	public setDivider(divider: string): KVParser {
		this.divider = divider;
		return this;
	}

	public setEndingCharacters(chars: string[]): KVParser {
		this.endingCharacters = chars;
		return this;
	}

	public setParseWhitespaces(setting: boolean): KVParser {
		this.parseWhitespace = setting;
		return this;
	}

	public parse(stringToParse: string): Map<string, string> {
		this.setTextToParse(stringToParse);
		const result = new Map<string, string>();

		while (!this.eof() && !this.endingCharacters.includes(this.peek())) {
			this.skipOptionalWhitespace();
			const key = this.parseName();
			this.skipOptionalWhitespace();

			this.consumeExpected(this.divider);

			this.skipOptionalWhitespace();

			const value = this.parseValueWithQuotes();

			result.set(key, value);

			if (this.endingCharacters.includes(this.peek())) {
				this.consume();
			}
		}
		return result;
	}
	private parseValueWithQuotes(): string {
		const currentQuote = this.allowedQuotes.find((q) => q === this.peek());
		if (currentQuote) {
			this.consume(); //starting quotation mark
			const content = this.consumeWhile((st) => st !== currentQuote);
			this.consume();
			return content;
		}
		return this.parseName(); // fallback for unquoted string
	}
	private skipOptionalWhitespace() {
		this.parseWhitespace && this.consumeWhitespace();
	}
}

class Director {
	public static constructCSSParser(): KVParser {
		const parser = new KVParser()
			.setDivider(":")
			.setEndingCharacters([";", "}"])
			.setParseWhitespaces(true)
			.enableQuotationMarks([QuotationMarks.DOUBLE, QuotationMarks.SINGLE]);
		return parser;
	}
}

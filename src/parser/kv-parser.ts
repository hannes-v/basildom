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
	stopCharacters: string[] = [];
	pairSeperator: string | null = null;
	allowedQuotes: QuotationMarks[] = [];

	public withDivider(divider: string): this {
		this.divider = divider;
		return this;
	}

	public withStopCharacters(chars: string[]): this {
		this.stopCharacters = chars;
		return this;
	}

	public withQuotationMarks(marks: QuotationMarks[]): this {
		this.allowedQuotes = marks;
		return this;
	}

	public withEndingCharacters(chars: string[]): this {
		this.stopCharacters = chars;
		return this;
	}

	public withWhitespaces(setting: boolean): this {
		this.parseWhitespace = setting;
		return this;
	}

	public build(): KVParser {
		return this;
	}

	public parse(stringToParse: string): Map<string, string> {
		this.setTextToParse(stringToParse);
		const result = new Map<string, string>();

		while (!this.eof() && !this.stopCharacters.includes(this.peek())) {
			this.skipOptionalWhitespace();
			const key = this.parseName();
			this.skipOptionalWhitespace();

			this.consumeExpected(this.divider);

			this.skipOptionalWhitespace();

			const value = this.parseValueWithQuotes();

			result.set(key, value);

			if (this.pairSeperator && this.peek() === this.pairSeperator) {
				this.consume();
			}

			this.skipOptionalWhitespace();
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
			.withDivider(":")
			.withEndingCharacters([";", "}"])
			.withWhitespaces(true)
			.withQuotationMarks([QuotationMarks.DOUBLE, QuotationMarks.SINGLE])
			.build();
		return parser;
	}
}

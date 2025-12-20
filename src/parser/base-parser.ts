export abstract class BaseParser<T> {
	protected currentIndex = 0;
	protected textAsArray: string[] = [];

	protected peek = (offset = 0): string => {
		const peekIndex = this.currentIndex + offset;
		if (peekIndex >= this.textAsArray.length) {
			return "";
		}

		return this.textAsArray[peekIndex] as string;
	};

	protected peekMultiple = (num: number): string => {
		const start = this.currentIndex;
		const end = start + num;

		return this.textAsArray.slice(start, end).join("");
	};

	protected consume = (iterations = 1): string => {
		const result = [];
		for (let i = 0; i < iterations; i++) {
			result.push(this.peek());
			this.currentIndex++;
		}
		return result.join("");
	};

	protected consumeWhile = (test: (st: string) => boolean): string => {
		const result: string[] = [];
		while (!this.eof() && test(this.peek())) {
			result.push(this.consume());
		}
		console.log(`result: ${result.join("")}`);
		return result.join("");
	};

	/**
	 * consumes a given character
	 * if the character peek doesn't meet the requirements,
	 * the function returns false without failing
	 * (thats the main difference in comparison to consumeExpected)
	 */
	protected consumeIfMatches = (str: string): boolean => {
		if (this.peek() === str) {
			this.consume();
			return true;
		}
		return false;
	};

	protected consumeWhitespace = (): void => {
		this.consumeWhile(
			(c) => c === " " || c === "\n" || c === "\t" || c === "\r",
		);
	};

	protected isLetter = (c: string) =>
		(c >= "a" && c <= "z") || (c >= "A" && c <= "Z");

	protected isNumber = (c: string) => c >= "0" && c <= "9";

	protected isAlphaNumerical = (c: string) =>
		this.isLetter(c) || this.isNumber(c);

	protected parseName = (): string => {
		return this.consumeWhile((c) => this.isAlphaNumerical(c));
	};

	protected consumeExpected = (c: string): void => {
		if (this.peekMultiple(c.length) !== c) {
			throw new Error("expection failed");
		} else {
			this.currentIndex += c.length;
		}
	};

	protected eof = (): boolean => this.currentIndex >= this.textAsArray.length;

	protected setTextToParse = (text: string): void => {
		this.textAsArray = text.split("");
	};

	// generic class
	abstract parse(input: string): T;
}

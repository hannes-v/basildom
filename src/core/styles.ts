export interface Stylesheet {
	rules: Rule[];
}

export interface Rule {
	sel: CSSSelector[];
	declarations: Declaration[];
}

export type CSSSelector = {
	sort: SelectorSort;
	name: string;
};

export enum SelectorSort {
	TagName,
	ID,
	Class,
	Universal,
}

export type CSSAttrMap = Map<string, string>;

type TagName = string;
type ID = string;
type Class = string;

export type Declaration = {
	name: string;
	value: Value;
};

type Value = Keyword | Size | ColorValue;
type Keyword = string;
type Size = string;
type ColorValue = {
	r: number;
	g: number;
	b: number;
	a: number;
};

interface Stylesheet {
	rules: Rule[];
}

interface Rule {
	selectors: Selector[];
	declarations: Declaration[];
}

type Selector = TagName | ID | Class;

type TagName = string;
type ID = string;
type Class = string;

type Declaration = {
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

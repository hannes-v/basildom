export interface Node {
	// common to all nodes
	children: Node[];

	// specific to each node
	node_type: NodeType;
}

type domText = string;

export type domElement = {
	tag_name: string;
	attrs: AttrMap;
};

type NodeType = domText | domElement;

export type AttrMap = Map<string, string>;

// Functions for creating Nodes
export const textNode = (txt: string): Node => {
	return {
		children: [],
		node_type: txt,
	};
};

export const elemNode = (
	tagName: string,
	attrs: AttrMap,
	children: Node[],
): Node => {
	return {
		children: children,
		node_type: {
			tag_name: tagName,
			attrs: attrs,
		},
	};
};

export const vocaloidColors = {
	初音ミク: "#39c5bb",
	鏡音リン: "#ffA500",
	鏡音レン: "#FFE211",
	巡音ルカ: "#ffc0cb",
	ＭＥＩＫＯ: "#D80000",
};

export const getVocaloidColor = (tags: string[]) => {
	const tag = tags.find((tag) => tag in vocaloidColors);
	return tag
		? (vocaloidColors[tag as keyof typeof vocaloidColors] ?? "#39c5bb")
		: "#39c5bb";
};

import convert from "cyrillic-to-latin";

export {convert};

export function osisaj(text) {
	text = text.replace(/[š]/g, 's');
	text = text.replace(/[Š]/g, 'S');
	text = text.replace(/[č]/g, 'c');
	text = text.replace(/[ć]/g, 'c');
	text = text.replace(/[Č]/g, 'C');
	text = text.replace(/[Ć]/g, 'C');
	text = text.replace(/[đ]/g, 'dj');
	text = text.replace(/[Đ]/g, 'Dj');
	text = text.replace(/[ž]/g, 'z');
	text = text.replace(/[Ž]/g, 'Z');
	return text;
}

export function crte(text) {
	return text.replace(/[\s]/g, "-")
}
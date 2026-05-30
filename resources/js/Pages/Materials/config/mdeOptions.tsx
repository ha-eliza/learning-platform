import type { Options } from "easymde";

export const defaultMdeOptions: Options = {
    autofocus: false,
    spellChecker: false,
    placeholder: "Введите текст статьи в формате Markdown...",
    minHeight: "300px",
    toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "code",
        "unordered-list",
        "ordered-list",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "undo",
        "redo",
    ],
};

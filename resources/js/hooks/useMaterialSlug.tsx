import { useCallback } from "react";
import slugify from "slugify";

export function useMaterialSlug(setData: (key: any, value?: any) => void) {
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const titleValue = e.target.value;
        const slugValue = slugify(titleValue, {
            lower: true,
            strict: true,
            locale: "ru",
        });

        setData((prev: any) => ({
            ...prev,
            title: titleValue,
            url: slugValue,
        }));
    }, [setData]);

    return { handleTitleChange };
}

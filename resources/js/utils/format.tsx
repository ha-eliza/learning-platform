export const formatShortName = (fullName: string | undefined | null): string => {
    if (!fullName) return '';

    // Разбиваем строку по пробелам на массив слов
    const parts = fullName.trim().split(/\s+/);

    // Если в базе только одно слово (например, просто фамилия), возвращаем его
    if (parts.length < 2) return fullName;

    const surname = parts[0]; // Сидоров
    const nameInitial = parts[1] ? `${parts[1][0]}.` : ''; // С.
    const patronymicInitial = parts[2] ? `${parts[2][0]}.` : ''; // А.

    return `${surname} ${nameInitial}${patronymicInitial}`;
};


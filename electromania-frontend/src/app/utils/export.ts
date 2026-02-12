export function exportToCsv<T extends object>(data: T[], filename: string, headers: {
    key: keyof T;
    label: string;
}[]): void {
    if (data.length === 0)
        return;
    const headerRow = headers.map(h => h.label).join(',');
    const rows = data.map(item => headers.map(h => {
        const value = item[h.key];
        const stringValue = value === null || value === undefined ? '' : String(value);
        return stringValue.includes(',') || stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
    }).join(','));
    const csvContent = [headerRow, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

export async function exportToXlsx<T extends object>(
    data: T[],
    filename: string,
    headers: { key: keyof T; label: string; }[],
    options?: { sheetName?: string; title?: string; exportDateLabel?: string; }
): Promise<void> {
    if (data.length === 0) {
        return;
    }
    const XLSX = await import('xlsx');
    const sheetName = options?.sheetName || 'Export';
    const title = options?.title || filename;
    const exportDateLabel = options?.exportDateLabel || 'Export date';
    const exportDate = new Date().toLocaleString();
    const headerRowIndex = 3;
    const worksheetData: (string | number)[][] = [
        [title],
        [exportDateLabel, exportDate],
        [],
        headers.map(h => h.label),
        ...data.map(item => headers.map(h => {
            const value = item[h.key];
            if (value === null || value === undefined) {
                return '';
            }
            if (typeof value === 'number') {
                return value;
            }
            if (typeof value === 'boolean') {
                return value ? 'true' : 'false';
            }
            return String(value);
        }))
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = headers.map(h => ({
        wch: Math.max(14, h.label.length + 2)
    }));
    worksheet['!merges'] = [{
        s: { r: 0, c: 0 },
        e: { r: 0, c: headers.length - 1 }
    }];
    worksheet['!autofilter'] = {
        ref: XLSX.utils.encode_range({
            s: { r: headerRowIndex, c: 0 },
            e: { r: headerRowIndex + data.length, c: headers.length - 1 }
        })
    };
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}
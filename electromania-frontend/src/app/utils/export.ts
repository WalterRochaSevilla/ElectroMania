export function exportToCsv<T extends object>(
  data: T[],
  filename: string,
  headers: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) return;

  const headerRow = headers.map(h => h.label).join(',');
  const rows = data.map(item =>
    headers.map(h => {
      const value = item[h.key];
      const stringValue = value === null || value === undefined ? '' : String(value);
      return stringValue.includes(',') || stringValue.includes('"')
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    }).join(',')
  );

  const csvContent = [headerRow, ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}

import React, { useState, useEffect } from 'react';
import { 
    X, ZoomIn, ZoomOut, Printer, Download, 
    FileText, Grid, FileCode 
} from 'lucide-react';

interface FileViewerPanelProps {
    file: any;
    onClose: () => void;
}

export default function FileViewerPanel({ file, onClose }: FileViewerPanelProps) {
    const [fileType, setFileType] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [textContent, setTextContent] = useState<string>('');
    const [parsedCsvRows, setParsedCsvRows] = useState<string[][]>([]);
    const [nativeUrl, setNativeUrl] = useState<string | null>(null);

    // Document Reader States
    const [pdfViewMode, setPdfViewMode] = useState<'preview' | 'aiText'>('preview');
    const [scale, setScale] = useState<number>(1);
    const [wordWrap, setWordWrap] = useState<boolean>(true);

    useEffect(() => {
        if (!file) return;

        setScale(1);
        setTextContent('');
        setParsedCsvRows([]);
        setNativeUrl(null);
        setPdfViewMode('preview');

        const isClientFile = file instanceof File;
        const name = isClientFile ? file.name : file.name;
        const type = isClientFile ? file.type : file.type;

        setFileName(name);
        setFileType(type);

        const fileExt = name.slice(name.lastIndexOf('.')).toLowerCase();

        if (isClientFile) {
            const objectUrl = URL.createObjectURL(file);
            setNativeUrl(objectUrl);

            if (type === 'text/plain' || fileExt === '.txt') {
                const reader = new FileReader();
                reader.onload = (e) => setTextContent(e.target?.result as string || '');
                reader.readAsText(file);
            } else if (type === 'text/csv' || fileExt === '.csv') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target?.result as string || '';
                    setTextContent(text);
                    setParsedCsvRows(parseCSV(text));
                };
                reader.readAsText(file);
            }
        } else {
            if (file.url) setNativeUrl(file.url);

            if (file.extractedText) {
                setTextContent(file.extractedText);
                if (fileExt === '.csv') setParsedCsvRows(parseCSV(file.extractedText));
            }
        }

        return () => {
            if (isClientFile && nativeUrl) URL.revokeObjectURL(nativeUrl);
        };
    }, [file]);

    const parseCSV = (csvText: string): string[][] => {
        const lines = csvText.split('\n');
        return lines.map(line => {
            const matches = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return matches.map(cell => cell.replace(/^"|"$/g, '').trim());
        }).filter(row => row.length > 0 && row.some(cell => cell !== ""));
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

    const handlePrint = () => {
        if (nativeUrl) {
            const printWindow = window.open(nativeUrl, '_blank');
            printWindow?.focus();
            printWindow?.print();
        } else {
            window.print();
        }
    };

    const getFileIcon = () => {
        if (fileType === 'application/pdf') return <FileText className="w-4 h-4 text-red-500" />;
        if (fileType === 'text/csv' || fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            return <Grid className="w-4 h-4 text-emerald-500" />;
        }
        return <FileCode className="w-4 h-4 text-slate-500 dark:text-slate-450" />;
    };

    const isTabular = fileType === 'text/csv' || fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    return (
        <div className="w-full h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-350 z-50">
            
            {/* Minimalist Header */}
            <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40 backdrop-blur-md">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">
                        {getFileIcon()}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate tracking-tight leading-tight">
                            {fileName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                            {isTabular ? 'Tabular Data' : fileType === 'application/pdf' ? 'PDF Document' : 'Text File'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {nativeUrl && (
                        <>
                            <button onClick={handlePrint} className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-md transition-colors cursor-pointer">
                                <Printer className="w-3.5 h-3.5" />
                            </button>
                            <a href={nativeUrl} download={fileName} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition-colors cursor-pointer">
                                <Download className="w-3.5 h-3.5" />
                            </a>
                        </>
                    )}
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white rounded-md transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-50/30 dark:bg-slate-950/20">
                
                {/* 1. PDF VIEWER */}
                {fileType === 'application/pdf' && (
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                            {/* Native Mac-like segmented control */}
                            <div className="flex bg-slate-100 dark:bg-slate-850 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                <button onClick={() => setPdfViewMode('preview')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${pdfViewMode === 'preview' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                                    Preview
                                </button>
                                <button onClick={() => setPdfViewMode('aiText')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${pdfViewMode === 'aiText' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                                    Raw Text
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shadow-sm">
                                <button onClick={handleZoomOut} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 transition-colors cursor-pointer"><ZoomOut className="w-3.5 h-3.5" /></button>
                                <span className="text-[10px] font-mono font-medium text-slate-500 w-8 text-center">{(scale * 100).toFixed(0)}%</span>
                                <button onClick={handleZoomIn} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 transition-colors cursor-pointer"><ZoomIn className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-slate-150/40 dark:bg-slate-950">
                            {pdfViewMode === 'preview' && nativeUrl ? (
                                <div className="w-full h-full rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                                    <iframe 
                                        src={`${nativeUrl}#zoom=${scale * 105}`}
                                        className="w-full h-full border-0 bg-white"
                                    />
                                </div>
                            ) : (
                                <div className="w-full max-w-2xl bg-white dark:bg-slate-955 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm font-mono text-[11px] leading-loose text-slate-700 dark:text-slate-350 whitespace-pre-wrap select-text h-full overflow-y-auto custom-scrollbar">
                                    {textContent || 'No analyzed text context matches are found.'}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. EXCEL & CSV TABULAR GRID VIEWER */}
                {isTabular && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Tabular Spreadsheet Matrix
                            </span>
                        </div>

                        <div className="flex-1 overflow-auto p-4">
                            {parsedCsvRows.length > 0 ? (
                                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-slate-950">
                                    <table className="w-full text-left border-collapse font-mono text-[11px]">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-bold uppercase">
                                                <th className="px-3 py-1.5 border-r border-slate-200 dark:border-slate-800 w-10 text-center sticky left-0 bg-slate-50 dark:bg-slate-900 z-20"></th>
                                                {parsedCsvRows[0].map((_, idx) => (
                                                    <th key={idx} className="px-4 py-1.5 border-r border-slate-200 dark:border-slate-800 text-slate-400 font-medium min-w-[120px]">
                                                        {String.fromCharCode(65 + (idx % 26))}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                                            {parsedCsvRows.map((row, rowIdx) => (
                                                <tr key={rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-3 py-1.5 border-r border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 font-mono text-center text-slate-400 text-[10px] select-none sticky left-0 z-10">
                                                        {rowIdx + 1}
                                                    </td>
                                                    {row.map((cell, cellIdx) => (
                                                        <td key={cellIdx} className="px-4 py-1.5 border-r border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]" title={cell}>
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <Grid className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
                                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Binary Spreadsheet</h4>
                                    <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                                        Data extracted contextually by the Copilot. To view the native grid, please convert and upload as CSV.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. PLAIN TEXT VIEWER */}
                {fileType === 'text/plain' && (
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-end shrink-0">
                            <button 
                                onClick={() => setWordWrap(!wordWrap)} 
                                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${wordWrap ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                            >
                                Wrap lines
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-white dark:bg-slate-900">
                            <div className="flex font-mono text-[12px] leading-relaxed select-text min-h-full">
                                <div className="w-10 pr-3 text-right text-slate-300 dark:text-slate-700 select-none border-r border-slate-200 dark:border-slate-800 mr-4 font-bold">
                                    {textContent.split('\n').map((_, idx) => (
                                        <div key={idx}>{idx + 1}</div>
                                    ))}
                                </div>
                                <div className={`flex-1 text-slate-700 dark:text-slate-300 ${wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'}`}>
                                    {textContent || 'No text contents available.'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
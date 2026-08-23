import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    CreditCard,
    DollarSign,
    Plus,
    Printer,
    Receipt,
    Search,
    Trash2,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import PaginationLinks from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { create, destroy } from '@/routes/pembayaran-spp';
import type { BreadcrumbItem, Kelas, PaginatedData, PembayaranSpp } from '@/types';

type Props = {
    pembayaranList: PaginatedData<PembayaranSpp>;
    kelasList: Kelas[];
    stats: {
        total_today: number;
        total_month: number;
    };
    filters: {
        search: string;
        bulan: string;
        tahun: string;
        kelas_id: string;
    };
};

const ALL_MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi SPP', href: '/pembayaran-spp' },
];

export default function PembayaranIndex({
    pembayaranList,
    kelasList,
    stats,
    filters,
}: Props) {
    useFlashToast();

    const [search, setSearch] = useState(filters.search || '');
    const [bulan, setBulan] = useState(filters.bulan || 'all');
    const [tahun, setTahun] = useState(filters.tahun || String(new Date().getFullYear()));
    const [kelasId, setKelasId] = useState(filters.kelas_id || 'all');

    const [selectedReceipt, setSelectedReceipt] = useState<PembayaranSpp | null>(null);
    const [deletingPayment, setDeletingPayment] = useState<PembayaranSpp | null>(null);

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/pembayaran-spp',
            {
                search,
                bulan: bulan === 'all' ? '' : bulan,
                tahun: tahun === 'all' ? '' : tahun,
                kelas_id: kelasId === 'all' ? '' : kelasId,
            },
            { preserveState: true, replace: true }
        );
    };

    const submitDelete = () => {
        if (!deletingPayment) return;
        router.delete(destroy.url({ pembayaran_spp: deletingPayment.id }), {
            onSuccess: () => setDeletingPayment(null),
        });
    };

    const formatRupiah = (val: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(val));
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <>
            <Head title="Riwayat Pembayaran SPP" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Riwayat Pembayaran SPP"
                        description="Data rekapitulasi pembayaran uang sekolah dan penerbitan kwitansi"
                    />
                    <Button asChild className="w-full sm:w-auto">
                        <Link href={create()}>
                            <Plus className="size-4" data-icon="inline-start" />
                            Entri Pembayaran Baru
                        </Link>
                    </Button>
                </div>

                {/* Summary Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Penerimaan Hari Ini
                            </CardTitle>
                            <DollarSign className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatRupiah(stats.total_today)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Transaksi tanggal {new Date().toLocaleDateString('id-ID')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Penerimaan Bulan Ini
                            </CardTitle>
                            <Wallet className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {formatRupiah(stats.total_month)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Periode {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="sm:col-span-2 lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Catatan Transaksi
                            </CardTitle>
                            <Receipt className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {pembayaranList.total} Data
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Berdasarkan filter yang dipilih
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Toolbar & Table Card */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <CardTitle>Data Transaksi SPP</CardTitle>
                                <CardDescription>
                                    Menampilkan {pembayaranList.total} transaksi pembayaran tercatat
                                </CardDescription>
                            </div>
                            <form onSubmit={handleFilter} className="flex flex-wrap gap-2">
                                <div className="w-32">
                                    <Select
                                        value={tahun}
                                        onValueChange={(val) => {
                                            setTahun(val);
                                            router.get(
                                                '/pembayaran-spp',
                                                {
                                                    search,
                                                    bulan: bulan === 'all' ? '' : bulan,
                                                    tahun: val === 'all' ? '' : val,
                                                    kelas_id: kelasId === 'all' ? '' : kelasId,
                                                },
                                                { preserveState: true, replace: true }
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tahun</SelectItem>
                                            {[2024, 2025, 2026, 2027].map((y) => (
                                                <SelectItem key={y} value={String(y)}>
                                                    {y}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-36">
                                    <Select
                                        value={bulan}
                                        onValueChange={(val) => {
                                            setBulan(val);
                                            router.get(
                                                '/pembayaran-spp',
                                                {
                                                    search,
                                                    bulan: val === 'all' ? '' : val,
                                                    tahun: tahun === 'all' ? '' : tahun,
                                                    kelas_id: kelasId === 'all' ? '' : kelasId,
                                                },
                                                { preserveState: true, replace: true }
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Bulan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Bulan</SelectItem>
                                            {ALL_MONTHS.map((b) => (
                                                <SelectItem key={b} value={b}>
                                                    {b}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-40">
                                    <Select
                                        value={kelasId}
                                        onValueChange={(val) => {
                                            setKelasId(val);
                                            router.get(
                                                '/pembayaran-spp',
                                                {
                                                    search,
                                                    bulan: bulan === 'all' ? '' : bulan,
                                                    tahun: tahun === 'all' ? '' : tahun,
                                                    kelas_id: val === 'all' ? '' : val,
                                                },
                                                { preserveState: true, replace: true }
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kelas</SelectItem>
                                            {kelasList.map((k) => (
                                                <SelectItem key={k.id} value={String(k.id)}>
                                                    {k.nama_kelas}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="relative w-full sm:w-56">
                                    <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari transaksi / siswa..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>

                                <Button type="submit" variant="secondary">
                                    Cari
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">No</TableHead>
                                        <TableHead>Kode Transaksi</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Bulan / Tahun</TableHead>
                                        <TableHead>Jumlah Bayar</TableHead>
                                        <TableHead>Metode</TableHead>
                                        <TableHead>Petugas TU</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pembayaranList.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <CreditCard className="size-8 text-muted-foreground/60" />
                                                    <p>Belum ada riwayat transaksi pembayaran</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pembayaranList.data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {(pembayaranList.current_page - 1) * pembayaranList.per_page + index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-mono text-xs">
                                                        {item.kode_transaksi}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {item.tanggal_bayar}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">
                                                            {item.siswa?.nama || '-'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            NISN: {item.siswa?.nisn}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {item.siswa?.kelas?.nama_kelas || '-'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-primary">
                                                        {item.bulan_dibayar} {item.tahun_dibayar}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {formatRupiah(item.jumlah_bayar)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.metode_pembayaran}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {item.user?.name || 'Petugas'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            onClick={() => setSelectedReceipt(item)}
                                                            title="Cetak Kwitansi"
                                                        >
                                                            <Printer className="size-4 text-blue-600" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive hover:text-destructive"
                                                            onClick={() => setDeletingPayment(item)}
                                                            title="Hapus Transaksi"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4">
                            <PaginationLinks links={pembayaranList.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Kwitansi / Struk Pembayaran */}
            <Dialog open={!!selectedReceipt} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
                <DialogContent className="max-w-md print:m-0 print:w-full print:border-none print:shadow-none">
                    <DialogHeader className="border-b pb-3 text-center print:border-black">
                        <DialogTitle className="text-lg font-bold">KWITANSI PEMBAYARAN SPP</DialogTitle>
                        <DialogDescription>
                            SMK / SMA INDONESIA RAYA - TATA USAHA KEUANGAN
                        </DialogDescription>
                    </DialogHeader>

                    {selectedReceipt && (
                        <div className="flex flex-col gap-4 text-sm print:text-black">
                            <div className="flex justify-between border-b pb-2 text-xs text-muted-foreground print:text-black">
                                <span>No. Transaksi: <strong>{selectedReceipt.kode_transaksi}</strong></span>
                                <span>Tgl: <strong>{selectedReceipt.tanggal_bayar}</strong></span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Nama Siswa:</span>
                                <span className="col-span-2 font-semibold">{selectedReceipt.siswa?.nama}</span>

                                <span className="text-muted-foreground">NISN / NIS:</span>
                                <span className="col-span-2 font-mono">{selectedReceipt.siswa?.nisn} / {selectedReceipt.siswa?.nis}</span>

                                <span className="text-muted-foreground">Kelas / Jurusan:</span>
                                <span className="col-span-2">{selectedReceipt.siswa?.kelas?.nama_kelas} ({selectedReceipt.siswa?.kelas?.kompetensi_keahlian})</span>

                                <span className="text-muted-foreground">Pembayaran:</span>
                                <span className="col-span-2 font-semibold text-primary">
                                    SPP Bulan {selectedReceipt.bulan_dibayar} Tahun {selectedReceipt.tahun_dibayar}
                                </span>

                                <span className="text-muted-foreground">Metode Bayar:</span>
                                <span className="col-span-2">{selectedReceipt.metode_pembayaran}</span>

                                {selectedReceipt.catatan && (
                                    <>
                                        <span className="text-muted-foreground">Catatan:</span>
                                        <span className="col-span-2 text-xs">{selectedReceipt.catatan}</span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-between rounded-md border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30 print:border-black print:bg-transparent">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-5 text-emerald-600" />
                                    <span className="font-semibold">STATUS LUNAS</span>
                                </div>
                                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300 print:text-black">
                                    {formatRupiah(selectedReceipt.jumlah_bayar)}
                                </span>
                            </div>

                            <div className="flex justify-between pt-4 text-xs">
                                <div className="text-center">
                                    <p>Siswa / Pembayar,</p>
                                    <div className="h-12" />
                                    <p className="font-semibold underline">({selectedReceipt.siswa?.nama})</p>
                                </div>
                                <div className="text-center">
                                    <p>Petugas TU / Kasir,</p>
                                    <div className="h-12" />
                                    <p className="font-semibold underline">({selectedReceipt.user?.name || 'Petugas Keuangan'})</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="print:hidden">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelectedReceipt(null)}
                        >
                            Tutup
                        </Button>
                        <Button type="button" onClick={handlePrintReceipt}>
                            <Printer className="size-4" data-icon="inline-start" />
                            Cetak Kwitansi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus Transaksi */}
            <Dialog open={!!deletingPayment} onOpenChange={(open) => !open && setDeletingPayment(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Pembatalan Pembayaran</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin membatalkan/menghapus transaksi pembayaran{' '}
                            <strong>{deletingPayment?.kode_transaksi}</strong> a.n.{' '}
                            <strong>{deletingPayment?.siswa?.nama}</strong> (Bulan {deletingPayment?.bulan_dibayar} {deletingPayment?.tahun_dibayar})?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingPayment(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={submitDelete}
                        >
                            Ya, Hapus Transaksi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PembayaranIndex.layout = {
    breadcrumbs,
};

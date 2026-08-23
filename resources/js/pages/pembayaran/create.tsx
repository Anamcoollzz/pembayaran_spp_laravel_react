import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    CreditCard,
    DollarSign,
    Info,
    Receipt,
    UserCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { index, store } from '@/routes/pembayaran-spp';
import type { BreadcrumbItem, Siswa } from '@/types';

type Props = {
    siswas: Siswa[];
    selectedSiswaId?: number | null;
};

const ALL_MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi SPP', href: '/pembayaran-spp' },
    { title: 'Entri Pembayaran', href: '/pembayaran-spp/create' },
];

export default function PembayaranCreate({ siswas, selectedSiswaId }: Props) {
    useFlashToast();

    const [selectedStudent, setSelectedStudent] = useState<Siswa | null>(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [paidMonths, setPaidMonths] = useState<string[]>([]);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split('T')[0];

    const form = useForm({
        siswa_id: selectedSiswaId ? String(selectedSiswaId) : '',
        tanggal_bayar: today,
        tahun_dibayar: currentYear,
        bulan_dibayar: [] as string[],
        jumlah_per_bulan: 0,
        metode_pembayaran: 'Tunai',
        catatan: '',
    });

    const loadPaymentStatus = async (siswaId: number, tahun: number) => {
        setStatusLoading(true);
        try {
            const res = await fetch(`/siswa/${siswaId}/payment-status?tahun=${tahun}`);
            const data = await res.json();
            setPaidMonths(data.paid_months || []);
            setSelectedMonths([]);
            form.setData('bulan_dibayar', []);
        } catch {
            setPaidMonths([]);
        } finally {
            setStatusLoading(false);
        }
    };

    useEffect(() => {
        if (form.data.siswa_id) {
            const student = siswas.find((s) => s.id === Number(form.data.siswa_id)) || null;
            setSelectedStudent(student);
            if (student) {
                const nominal = student.spp?.nominal ? Number(student.spp.nominal) : 250000;
                form.setData('jumlah_per_bulan', nominal);
                loadPaymentStatus(student.id, form.data.tahun_dibayar);
            }
        } else {
            setSelectedStudent(null);
            setPaidMonths([]);
            setSelectedMonths([]);
        }
    }, [form.data.siswa_id, form.data.tahun_dibayar]);

    const handleSelectMonth = (bulan: string) => {
        if (paidMonths.includes(bulan)) return;

        let updated: string[];
        if (selectedMonths.includes(bulan)) {
            updated = selectedMonths.filter((b) => b !== bulan);
        } else {
            updated = [...selectedMonths, bulan];
        }

        setSelectedMonths(updated);
        form.setData('bulan_dibayar', updated);
    };

    const handleSelectAllUnpaid = () => {
        const unpaid = ALL_MONTHS.filter((b) => !paidMonths.includes(b));
        if (selectedMonths.length === unpaid.length) {
            setSelectedMonths([]);
            form.setData('bulan_dibayar', []);
        } else {
            setSelectedMonths(unpaid);
            form.setData('bulan_dibayar', unpaid);
        }
    };

    const totalBayar = selectedMonths.length * Number(form.data.jumlah_per_bulan || 0);

    const formatRupiah = (val: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(val));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(store.url());
    };

    return (
        <>
            <Head title="Entri Pembayaran SPP" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href={index()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <Heading
                        title="Entri Pembayaran SPP Baru"
                        description="Pilih siswa, centang bulan yang akan dibayar, dan simpan transaksi"
                    />
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Sisi Kiri: Form Input & Pemilihan Bulan */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {/* Pilih Siswa & Tanggal */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Siswa & Pembayaran</CardTitle>
                                <CardDescription>
                                    Tentukan siswa yang akan melakukan pembayaran SPP
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="siswa_id">Pilih Siswa</Label>
                                    <Select
                                        value={form.data.siswa_id}
                                        onValueChange={(val) => form.setData('siswa_id', val)}
                                    >
                                        <SelectTrigger id="siswa_id">
                                            <SelectValue placeholder="-- Cari & Pilih Siswa --" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            {siswas.map((s) => (
                                                <SelectItem key={s.id} value={String(s.id)}>
                                                    {s.nama} ({s.nisn}) — {s.kelas?.nama_kelas}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.siswa_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tanggal_bayar">Tanggal Pembayaran</Label>
                                    <Input
                                        id="tanggal_bayar"
                                        type="date"
                                        value={form.data.tanggal_bayar}
                                        onChange={(e) => form.setData('tanggal_bayar', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.tanggal_bayar} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tahun_dibayar">Tahun SPP</Label>
                                    <Select
                                        value={String(form.data.tahun_dibayar)}
                                        onValueChange={(val) => form.setData('tahun_dibayar', Number(val))}
                                    >
                                        <SelectTrigger id="tahun_dibayar">
                                            <SelectValue placeholder="Pilih Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[currentYear - 1, currentYear, currentYear + 1].map((yr) => (
                                                <SelectItem key={yr} value={String(yr)}>
                                                    Tahun {yr}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.tahun_dibayar} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="metode_pembayaran">Metode Pembayaran</Label>
                                    <Select
                                        value={form.data.metode_pembayaran}
                                        onValueChange={(val) => form.setData('metode_pembayaran', val)}
                                    >
                                        <SelectTrigger id="metode_pembayaran">
                                            <SelectValue placeholder="Pilih Metode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Tunai">Tunai (Cash di Kasir TU)</SelectItem>
                                            <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                                            <SelectItem value="QRIS">QRIS / E-Wallet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.metode_pembayaran} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="jumlah_per_bulan">Nominal per Bulan (Rp)</Label>
                                    <Input
                                        id="jumlah_per_bulan"
                                        type="number"
                                        value={form.data.jumlah_per_bulan}
                                        onChange={(e) => form.setData('jumlah_per_bulan', Number(e.target.value))}
                                        required
                                    />
                                    <InputError message={form.errors.jumlah_per_bulan} />
                                </div>

                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="catatan">Catatan / Keterangan (Opsional)</Label>
                                    <Input
                                        id="catatan"
                                        placeholder="Contoh: Lunas kasir atau No. Referensi Transfer"
                                        value={form.data.catatan}
                                        onChange={(e) => form.setData('catatan', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pemilihan Bulan Yang Dibayar */}
                        <Card>
                            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-lg">Pilih Bulan Pembayaran</CardTitle>
                                    <CardDescription>
                                        Bulan hijau sudah lunas. Centang satu atau lebih bulan yang ingin dibayar.
                                    </CardDescription>
                                </div>
                                {selectedStudent && !statusLoading && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAllUnpaid}
                                    >
                                        Pilih Semua Yang Belum Lunas
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {!selectedStudent ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                        <Info className="mb-2 size-8 text-muted-foreground/60" />
                                        <p>Silakan pilih siswa terlebih dahulu di atas untuk melihat status bulan.</p>
                                    </div>
                                ) : statusLoading ? (
                                    <div className="flex items-center justify-center p-8">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                        {ALL_MONTHS.map((bulan) => {
                                            const isPaid = paidMonths.includes(bulan);
                                            const isSelected = selectedMonths.includes(bulan);

                                            return (
                                                <div
                                                    key={bulan}
                                                    onClick={() => !isPaid && handleSelectMonth(bulan)}
                                                    className={`relative flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all ${
                                                        isPaid
                                                            ? 'cursor-not-allowed border-emerald-200 bg-emerald-50/80 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
                                                            : isSelected
                                                            ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                                            : 'border-border bg-card hover:border-primary/50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <Checkbox
                                                            checked={isSelected || isPaid}
                                                            disabled={isPaid}
                                                            onCheckedChange={() => handleSelectMonth(bulan)}
                                                        />
                                                        <span className="text-sm font-semibold">{bulan}</span>
                                                    </div>
                                                    {isPaid && (
                                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-[10px] dark:bg-emerald-900 dark:text-emerald-200">
                                                            Lunas
                                                        </Badge>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <InputError message={form.errors.bulan_dibayar} className="mt-3" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sisi Kanan: Ringkasan Transaksi & Tombol Simpan */}
                    <div className="flex flex-col gap-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Receipt className="size-5 text-primary" />
                                    Ringkasan Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {selectedStudent ? (
                                    <div className="flex flex-col gap-2 rounded-lg bg-muted p-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="size-4 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">{selectedStudent.nama}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            NISN: {selectedStudent.nisn} | Kelas: {selectedStudent.kelas?.nama_kelas}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
                                        Belum ada siswa dipilih
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 border-t pt-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tahun Ajaran:</span>
                                        <span className="font-medium">{form.data.tahun_dibayar}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tarif per Bulan:</span>
                                        <span className="font-medium">{formatRupiah(form.data.jumlah_per_bulan)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bulan Dipilih:</span>
                                        <span className="font-semibold text-foreground">
                                            {selectedMonths.length} Bulan
                                        </span>
                                    </div>

                                    {selectedMonths.length > 0 && (
                                        <div className="flex flex-wrap gap-1 rounded bg-muted/60 p-2 text-xs">
                                            {selectedMonths.map((b) => (
                                                <Badge key={b} variant="outline" className="text-[11px]">
                                                    {b}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Metode Bayar:</span>
                                        <span className="font-medium">{form.data.metode_pembayaran}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                    <span className="text-xs font-medium text-muted-foreground">Total Tagihan Dibayar:</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatRupiah(totalBayar)}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={form.processing || selectedMonths.length === 0 || !selectedStudent}
                                >
                                    {form.processing ? (
                                        <Spinner />
                                    ) : (
                                        <DollarSign className="size-5" data-icon="inline-start" />
                                    )}
                                    Proses Pembayaran SPP
                                </Button>
                                <Button asChild variant="ghost" className="w-full">
                                    <Link href={index()}>Batal</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}

PembayaranCreate.layout = {
    breadcrumbs,
};

import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    CreditCard,
    Edit2,
    Eye,
    Plus,
    Search,
    Trash2,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { destroy, store, update } from '@/routes/siswa';
import type { BreadcrumbItem, Kelas, PaginatedData, Siswa, Spp } from '@/types';

type Props = {
    siswas: PaginatedData<Siswa>;
    kelasList: Kelas[];
    sppList: Spp[];
    filters: {
        search: string;
        kelas_id: string;
    };
};

const ALL_MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Siswa', href: '/siswa' },
];

export default function SiswaIndex({ siswas, kelasList, sppList, filters }: Props) {
    useFlashToast();

    const [search, setSearch] = useState(filters.search || '');
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas_id || 'all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
    const [deletingSiswa, setDeletingSiswa] = useState<Siswa | null>(null);

    // Detail & Payment history modal state
    const [historySiswa, setHistorySiswa] = useState<Siswa | null>(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyData, setHistoryData] = useState<{
        paid_months: string[];
        unpaid_months: string[];
        nominal_spp: number;
    } | null>(null);

    const createForm = useForm({
        nisn: '',
        nis: '',
        nama: '',
        jenis_kelamin: 'L',
        kelas_id: kelasList[0]?.id ? String(kelasList[0].id) : '',
        spp_id: sppList[0]?.id ? String(sppList[0].id) : '',
        alamat: '',
        no_telp: '',
    });

    const editForm = useForm({
        nisn: '',
        nis: '',
        nama: '',
        jenis_kelamin: 'L',
        kelas_id: '',
        spp_id: '',
        alamat: '',
        no_telp: '',
    });

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/siswa',
            {
                search,
                kelas_id: selectedKelas === 'all' ? '' : selectedKelas,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleOpenEdit = (siswa: Siswa) => {
        setEditingSiswa(siswa);
        editForm.setData({
            nisn: siswa.nisn,
            nis: siswa.nis,
            nama: siswa.nama,
            jenis_kelamin: siswa.jenis_kelamin,
            kelas_id: String(siswa.kelas_id),
            spp_id: siswa.spp_id ? String(siswa.spp_id) : '',
            alamat: siswa.alamat || '',
            no_telp: siswa.no_telp || '',
        });
    };

    const handleOpenHistory = async (siswa: Siswa) => {
        setHistorySiswa(siswa);
        setHistoryLoading(true);
        try {
            const res = await fetch(`/siswa/${siswa.id}/payment-status?tahun=${new Date().getFullYear()}`);
            const data = await res.json();
            setHistoryData(data);
        } catch {
            setHistoryData(null);
        } finally {
            setHistoryLoading(false);
        }
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSiswa) return;
        editForm.put(update.url({ siswa: editingSiswa.id }), {
            onSuccess: () => {
                setEditingSiswa(null);
            },
        });
    };

    const submitDelete = () => {
        if (!deletingSiswa) return;
        router.delete(destroy.url({ siswa: deletingSiswa.id }), {
            onSuccess: () => setDeletingSiswa(null),
        });
    };

    const formatRupiah = (val: number | string | undefined | null) => {
        if (!val) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(val));
    };

    return (
        <>
            <Head title="Master Data Siswa" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Master Data Siswa"
                        description="Kelola data induk siswa, NISN, penetapan kelas, dan tarif SPP"
                    />
                    <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
                        <Plus className="size-4" data-icon="inline-start" />
                        Tambah Siswa
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <CardTitle>Daftar Siswa</CardTitle>
                                <CardDescription>
                                    Total {siswas.total} siswa terdaftar
                                </CardDescription>
                            </div>
                            <form onSubmit={handleFilter} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="w-full sm:w-48">
                                    <Select
                                        value={selectedKelas}
                                        onValueChange={(val) => {
                                            setSelectedKelas(val);
                                            router.get(
                                                '/siswa',
                                                {
                                                    search,
                                                    kelas_id: val === 'all' ? '' : val,
                                                },
                                                { preserveState: true, replace: true }
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Kelas" />
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
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama / NISN / NIS..."
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
                                        <TableHead>NISN / NIS</TableHead>
                                        <TableHead>Nama Lengkap</TableHead>
                                        <TableHead>L/P</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Tarif SPP</TableHead>
                                        <TableHead>No. Telepon</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {siswas.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Users className="size-8 text-muted-foreground/60" />
                                                    <p>Belum ada data siswa ditemukan</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        siswas.data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {(siswas.current_page - 1) * siswas.per_page + index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-mono text-sm font-semibold">{item.nisn}</span>
                                                        <span className="text-xs text-muted-foreground">NIS: {item.nis}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground">
                                                    {item.nama}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={item.jenis_kelamin === 'L' ? 'secondary' : 'outline'}>
                                                        {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{item.kelas?.nama_kelas || '-'}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                            {formatRupiah(item.spp?.nominal)}
                                                        </span>
                                                        {item.spp && (
                                                            <span className="text-xs text-muted-foreground">
                                                                Angkatan {item.spp.tahun}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {item.no_telp || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            onClick={() => handleOpenHistory(item)}
                                                            title="Status SPP Siswa"
                                                        >
                                                            <Eye className="size-4 text-blue-600" />
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            title="Bayar SPP Langsung"
                                                        >
                                                            <Link href={`/pembayaran-spp/create?siswa_id=${item.id}`}>
                                                                <CreditCard className="size-4 text-emerald-600" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            onClick={() => handleOpenEdit(item)}
                                                            title="Edit Siswa"
                                                        >
                                                            <Edit2 className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive hover:text-destructive"
                                                            onClick={() => setDeletingSiswa(item)}
                                                            title="Hapus Siswa"
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
                            <PaginationLinks links={siswas.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Detail & Status Pembayaran Siswa */}
            <Dialog open={!!historySiswa} onOpenChange={(open) => !open && setHistorySiswa(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Status Pembayaran SPP Siswa</DialogTitle>
                        <DialogDescription>
                            Ringkasan kelulusan SPP tahun {new Date().getFullYear()} untuk siswa ini.
                        </DialogDescription>
                    </DialogHeader>

                    {historySiswa && (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Nama Siswa:</p>
                                    <p className="font-semibold">{historySiswa.nama}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Kelas:</p>
                                    <p className="font-semibold">{historySiswa.kelas?.nama_kelas}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">NISN / NIS:</p>
                                    <p className="font-mono">{historySiswa.nisn} / {historySiswa.nis}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Tarif SPP:</p>
                                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {formatRupiah(historySiswa.spp?.nominal)} / bulan
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 font-medium">Status Bulan Pembayaran (Tahun {new Date().getFullYear()}):</h4>
                                {historyLoading ? (
                                    <div className="flex items-center justify-center p-8">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                        {ALL_MONTHS.map((bulan) => {
                                            const isPaid = historyData?.paid_months.includes(bulan);
                                            return (
                                                <div
                                                    key={bulan}
                                                    className={`flex items-center justify-between rounded-md border p-2 text-xs font-medium ${
                                                        isPaid
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                                                            : 'border-muted bg-muted/40 text-muted-foreground'
                                                    }`}
                                                >
                                                    <span>{bulan}</span>
                                                    {isPaid ? (
                                                        <CheckCircle2 className="size-4 text-emerald-600" />
                                                    ) : (
                                                        <XCircle className="size-4 text-muted-foreground/50" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setHistorySiswa(null)}
                        >
                            Tutup
                        </Button>
                        {historySiswa && (
                            <Button asChild>
                                <Link href={`/pembayaran-spp/create?siswa_id=${historySiswa.id}`}>
                                    <CreditCard className="size-4" data-icon="inline-start" />
                                    Bayar SPP Sekarang
                                </Link>
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Tambah Siswa */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Tambah Data Siswa</DialogTitle>
                        <DialogDescription>
                            Lengkapi data identitas siswa baru dan tentukan kelas serta tarif SPP.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nisn">NISN (10 Digit)</Label>
                                <Input
                                    id="nisn"
                                    maxLength={10}
                                    placeholder="Contoh: 0081234567"
                                    value={createForm.data.nisn}
                                    onChange={(e) => createForm.setData('nisn', e.target.value)}
                                    required
                                />
                                <InputError message={createForm.errors.nisn} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nis">NIS</Label>
                                <Input
                                    id="nis"
                                    maxLength={10}
                                    placeholder="Contoh: 260101"
                                    value={createForm.data.nis}
                                    onChange={(e) => createForm.setData('nis', e.target.value)}
                                    required
                                />
                                <InputError message={createForm.errors.nis} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Lengkap Siswa</Label>
                            <Input
                                id="nama"
                                placeholder="Masukkan nama siswa"
                                value={createForm.data.nama}
                                onChange={(e) => createForm.setData('nama', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.nama} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                <Select
                                    value={createForm.data.jenis_kelamin}
                                    onValueChange={(val) => createForm.setData('jenis_kelamin', val as 'L' | 'P')}
                                >
                                    <SelectTrigger id="jenis_kelamin">
                                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.jenis_kelamin} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="kelas_id">Kelas</Label>
                                <Select
                                    value={createForm.data.kelas_id}
                                    onValueChange={(val) => createForm.setData('kelas_id', val)}
                                >
                                    <SelectTrigger id="kelas_id">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kelasList.map((k) => (
                                            <SelectItem key={k.id} value={String(k.id)}>
                                                {k.nama_kelas}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.kelas_id} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="spp_id">Tarif SPP (Angkatan)</Label>
                                <Select
                                    value={createForm.data.spp_id}
                                    onValueChange={(val) => createForm.setData('spp_id', val)}
                                >
                                    <SelectTrigger id="spp_id">
                                        <SelectValue placeholder="Pilih Tarif SPP" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sppList.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                Tahun {s.tahun} - {formatRupiah(s.nominal)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.spp_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="no_telp">No. Telepon / WA</Label>
                                <Input
                                    id="no_telp"
                                    placeholder="081234567890"
                                    value={createForm.data.no_telp}
                                    onChange={(e) => createForm.setData('no_telp', e.target.value)}
                                />
                                <InputError message={createForm.errors.no_telp} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alamat">Alamat Siswa</Label>
                            <Input
                                id="alamat"
                                placeholder="Alamat domisili siswa"
                                value={createForm.data.alamat}
                                onChange={(e) => createForm.setData('alamat', e.target.value)}
                            />
                            <InputError message={createForm.errors.alamat} />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing && <Spinner />}
                                Simpan Siswa
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Siswa */}
            <Dialog open={!!editingSiswa} onOpenChange={(open) => !open && setEditingSiswa(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Data Siswa</DialogTitle>
                        <DialogDescription>
                            Perbarui identitas, kelas, atau tarif SPP siswa.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_nisn">NISN</Label>
                                <Input
                                    id="edit_nisn"
                                    maxLength={10}
                                    value={editForm.data.nisn}
                                    onChange={(e) => editForm.setData('nisn', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.nisn} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_nis">NIS</Label>
                                <Input
                                    id="edit_nis"
                                    maxLength={10}
                                    value={editForm.data.nis}
                                    onChange={(e) => editForm.setData('nis', e.target.value)}
                                    required
                                />
                                <InputError message={editForm.errors.nis} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_nama">Nama Lengkap Siswa</Label>
                            <Input
                                id="edit_nama"
                                value={editForm.data.nama}
                                onChange={(e) => editForm.setData('nama', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.nama} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_jenis_kelamin">Jenis Kelamin</Label>
                                <Select
                                    value={editForm.data.jenis_kelamin}
                                    onValueChange={(val) => editForm.setData('jenis_kelamin', val as 'L' | 'P')}
                                >
                                    <SelectTrigger id="edit_jenis_kelamin">
                                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.jenis_kelamin} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_kelas_id">Kelas</Label>
                                <Select
                                    value={editForm.data.kelas_id}
                                    onValueChange={(val) => editForm.setData('kelas_id', val)}
                                >
                                    <SelectTrigger id="edit_kelas_id">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kelasList.map((k) => (
                                            <SelectItem key={k.id} value={String(k.id)}>
                                                {k.nama_kelas}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.kelas_id} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_spp_id">Tarif SPP</Label>
                                <Select
                                    value={editForm.data.spp_id}
                                    onValueChange={(val) => editForm.setData('spp_id', val)}
                                >
                                    <SelectTrigger id="edit_spp_id">
                                        <SelectValue placeholder="Pilih Tarif SPP" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sppList.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                Tahun {s.tahun} - {formatRupiah(s.nominal)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.spp_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_no_telp">No. Telepon / WA</Label>
                                <Input
                                    id="edit_no_telp"
                                    value={editForm.data.no_telp}
                                    onChange={(e) => editForm.setData('no_telp', e.target.value)}
                                />
                                <InputError message={editForm.errors.no_telp} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_alamat">Alamat Siswa</Label>
                            <Input
                                id="edit_alamat"
                                value={editForm.data.alamat}
                                onChange={(e) => editForm.setData('alamat', e.target.value)}
                            />
                            <InputError message={editForm.errors.alamat} />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingSiswa(null)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing && <Spinner />}
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus Siswa */}
            <Dialog open={!!deletingSiswa} onOpenChange={(open) => !open && setDeletingSiswa(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Siswa</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data siswa{' '}
                            <strong>{deletingSiswa?.nama}</strong> (NISN: {deletingSiswa?.nisn})?
                            Seluruh riwayat transaksi pembayaran siswa ini juga akan terhapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingSiswa(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={submitDelete}
                        >
                            Ya, Hapus Siswa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SiswaIndex.layout = {
    breadcrumbs,
};

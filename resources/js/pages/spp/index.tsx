import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Plus, Search, Tag, Trash2, Users } from 'lucide-react';
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
import { destroy, store, update } from '@/routes/spp';
import type { BreadcrumbItem, PaginatedData, Spp } from '@/types';

type Props = {
    sppList: PaginatedData<Spp>;
    filters: {
        search: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tarif SPP', href: '/spp' },
];

export default function SppIndex({ sppList, filters }: Props) {
    useFlashToast();

    const [search, setSearch] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingSpp, setEditingSpp] = useState<Spp | null>(null);
    const [deletingSpp, setDeletingSpp] = useState<Spp | null>(null);

    const createForm = useForm({
        tahun: new Date().getFullYear(),
        nominal: '',
        keterangan: '',
    });

    const editForm = useForm({
        tahun: 0,
        nominal: '',
        keterangan: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/spp', { search }, { preserveState: true, replace: true });
    };

    const handleOpenEdit = (spp: Spp) => {
        setEditingSpp(spp);
        editForm.setData({
            tahun: spp.tahun,
            nominal: String(Math.floor(Number(spp.nominal))),
            keterangan: spp.keterangan || '',
        });
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
        if (!editingSpp) return;
        editForm.put(update.url({ spp: editingSpp.id }), {
            onSuccess: () => {
                setEditingSpp(null);
            },
        });
    };

    const submitDelete = () => {
        if (!deletingSpp) return;
        router.delete(destroy.url({ spp: deletingSpp.id }), {
            onSuccess: () => setDeletingSpp(null),
        });
    };

    const formatRupiah = (val: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(val));
    };

    return (
        <>
            <Head title="Master Data Tarif SPP" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Master Tarif SPP"
                        description="Atur nominal besaran biaya SPP bulanan berdasarkan tahun ajaran / angkatan"
                    />
                    <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
                        <Plus className="size-4" data-icon="inline-start" />
                        Tambah Tarif SPP
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Daftar Tarif SPP</CardTitle>
                                <CardDescription>
                                    Total {sppList.total} tahun ajaran tarif SPP terdata
                                </CardDescription>
                            </div>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari tahun / keterangan..."
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
                                        <TableHead className="w-16">No</TableHead>
                                        <TableHead>Tahun Ajaran</TableHead>
                                        <TableHead>Nominal / Bulan</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        <TableHead>Siswa Terhubung</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sppList.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Tag className="size-8 text-muted-foreground/60" />
                                                    <p>Belum ada data tarif SPP ditemukan</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sppList.data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {(sppList.current_page - 1) * sppList.per_page + index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="font-mono text-sm">
                                                        Tahun {item.tahun}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {formatRupiah(item.nominal)}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {item.keterangan || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Users className="size-4" />
                                                        <span>{item.siswas_count ?? 0} Siswa</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            onClick={() => handleOpenEdit(item)}
                                                            title="Edit Tarif"
                                                        >
                                                            <Edit2 className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive hover:text-destructive"
                                                            onClick={() => setDeletingSpp(item)}
                                                            title="Hapus Tarif"
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
                            <PaginationLinks links={sppList.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah SPP */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Tarif SPP</DialogTitle>
                        <DialogDescription>
                            Masukkan tahun dan nominal biaya SPP per bulan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tahun">Tahun (Angkatan)</Label>
                            <Input
                                id="tahun"
                                type="number"
                                placeholder="Contoh: 2026"
                                value={createForm.data.tahun}
                                onChange={(e) => createForm.setData('tahun', parseInt(e.target.value) || 0)}
                                required
                            />
                            <InputError message={createForm.errors.tahun} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nominal">Nominal SPP (Rp / Bulan)</Label>
                            <Input
                                id="nominal"
                                type="number"
                                placeholder="Contoh: 250000"
                                value={createForm.data.nominal}
                                onChange={(e) => createForm.setData('nominal', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.nominal} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                            <Input
                                id="keterangan"
                                placeholder="Contoh: Tarif SPP TA 2025/2026"
                                value={createForm.data.keterangan}
                                onChange={(e) => createForm.setData('keterangan', e.target.value)}
                            />
                            <InputError message={createForm.errors.keterangan} />
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
                                Simpan Tarif SPP
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit SPP */}
            <Dialog open={!!editingSpp} onOpenChange={(open) => !open && setEditingSpp(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tarif SPP</DialogTitle>
                        <DialogDescription>
                            Perbarui besaran nominal atau keterangan tarif SPP.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_tahun">Tahun (Angkatan)</Label>
                            <Input
                                id="edit_tahun"
                                type="number"
                                value={editForm.data.tahun}
                                onChange={(e) => editForm.setData('tahun', parseInt(e.target.value) || 0)}
                                required
                            />
                            <InputError message={editForm.errors.tahun} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_nominal">Nominal SPP (Rp / Bulan)</Label>
                            <Input
                                id="edit_nominal"
                                type="number"
                                value={editForm.data.nominal}
                                onChange={(e) => editForm.setData('nominal', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.nominal} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_keterangan">Keterangan (Opsional)</Label>
                            <Input
                                id="edit_keterangan"
                                value={editForm.data.keterangan}
                                onChange={(e) => editForm.setData('keterangan', e.target.value)}
                            />
                            <InputError message={editForm.errors.keterangan} />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingSpp(null)}
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

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={!!deletingSpp} onOpenChange={(open) => !open && setDeletingSpp(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Tarif SPP</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus tarif SPP tahun{' '}
                            <strong>{deletingSpp?.tahun}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingSpp(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={submitDelete}
                        >
                            Ya, Hapus Tarif SPP
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SppIndex.layout = {
    breadcrumbs,
};

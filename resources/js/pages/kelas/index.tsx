import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, GraduationCap, Plus, Search, Trash2, Users } from 'lucide-react';
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
import { destroy, store, update } from '@/routes/kelas';
import type { BreadcrumbItem, Kelas, PaginatedData } from '@/types';

type Props = {
    kelasList: PaginatedData<Kelas>;
    filters: {
        search: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Kelas', href: '/kelas' },
];

export default function KelasIndex({ kelasList, filters }: Props) {
    useFlashToast();

    const [search, setSearch] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
    const [deletingKelas, setDeletingKelas] = useState<Kelas | null>(null);

    const createForm = useForm({
        nama_kelas: '',
        tingkat: 'X',
        kompetensi_keahlian: '',
    });

    const editForm = useForm({
        nama_kelas: '',
        tingkat: 'X',
        kompetensi_keahlian: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kelas', { search }, { preserveState: true, replace: true });
    };

    const handleOpenEdit = (kelas: Kelas) => {
        setEditingKelas(kelas);
        editForm.setData({
            nama_kelas: kelas.nama_kelas,
            tingkat: kelas.tingkat,
            kompetensi_keahlian: kelas.kompetensi_keahlian,
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
        if (!editingKelas) return;
        editForm.put(update.url({ kela: editingKelas.id }), {
            onSuccess: () => {
                setEditingKelas(null);
            },
        });
    };

    const submitDelete = () => {
        if (!deletingKelas) return;
        router.delete(destroy.url({ kela: deletingKelas.id }), {
            onSuccess: () => setDeletingKelas(null),
        });
    };

    return (
        <>
            <Head title="Master Data Kelas" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Master Data Kelas"
                        description="Kelola data kelas dan kompetensi keahlian/jurusan sekolah"
                    />
                    <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
                        <Plus className="size-4" data-icon="inline-start" />
                        Tambah Kelas
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Daftar Kelas</CardTitle>
                                <CardDescription>
                                    Total {kelasList.total} kelas terdaftar di sistem
                                </CardDescription>
                            </div>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari kelas / jurusan..."
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
                                        <TableHead>Tingkat</TableHead>
                                        <TableHead>Nama Kelas</TableHead>
                                        <TableHead>Kompetensi Keahlian</TableHead>
                                        <TableHead>Jumlah Siswa</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kelasList.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <GraduationCap className="size-8 text-muted-foreground/60" />
                                                    <p>Belum ada data kelas ditemukan</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        kelasList.data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {(kelasList.current_page - 1) * kelasList.per_page + index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Kelas {item.tingkat}</Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold text-foreground">
                                                    {item.nama_kelas}
                                                </TableCell>
                                                <TableCell>{item.kompetensi_keahlian}</TableCell>
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
                                                            title="Edit Kelas"
                                                        >
                                                            <Edit2 className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive hover:text-destructive"
                                                            onClick={() => setDeletingKelas(item)}
                                                            title="Hapus Kelas"
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
                            <PaginationLinks links={kelasList.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Kelas */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Data Kelas</DialogTitle>
                        <DialogDescription>
                            Masukkan rincian informasi kelas baru yang akan ditambahkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tingkat">Tingkat Kelas</Label>
                            <Select
                                value={createForm.data.tingkat}
                                onValueChange={(val) => createForm.setData('tingkat', val)}
                            >
                                <SelectTrigger id="tingkat">
                                    <SelectValue placeholder="Pilih Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="X">Kelas X (Sepuluh)</SelectItem>
                                    <SelectItem value="XI">Kelas XI (Sebelas)</SelectItem>
                                    <SelectItem value="XII">Kelas XII (Dua Belas)</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.tingkat} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nama_kelas">Nama Kelas</Label>
                            <Input
                                id="nama_kelas"
                                placeholder="Contoh: X RPL 1"
                                value={createForm.data.nama_kelas}
                                onChange={(e) => createForm.setData('nama_kelas', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.nama_kelas} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="kompetensi_keahlian">Kompetensi Keahlian / Jurusan</Label>
                            <Input
                                id="kompetensi_keahlian"
                                placeholder="Contoh: Rekayasa Perangkat Lunak"
                                value={createForm.data.kompetensi_keahlian}
                                onChange={(e) => createForm.setData('kompetensi_keahlian', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.kompetensi_keahlian} />
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
                                Simpan Kelas
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Kelas */}
            <Dialog open={!!editingKelas} onOpenChange={(open) => !open && setEditingKelas(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Data Kelas</DialogTitle>
                        <DialogDescription>
                            Perbarui rincian nama dan jurusan kelas ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_tingkat">Tingkat Kelas</Label>
                            <Select
                                value={editForm.data.tingkat}
                                onValueChange={(val) => editForm.setData('tingkat', val)}
                            >
                                <SelectTrigger id="edit_tingkat">
                                    <SelectValue placeholder="Pilih Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="X">Kelas X (Sepuluh)</SelectItem>
                                    <SelectItem value="XI">Kelas XI (Sebelas)</SelectItem>
                                    <SelectItem value="XII">Kelas XII (Dua Belas)</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.tingkat} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_nama_kelas">Nama Kelas</Label>
                            <Input
                                id="edit_nama_kelas"
                                value={editForm.data.nama_kelas}
                                onChange={(e) => editForm.setData('nama_kelas', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.nama_kelas} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_kompetensi_keahlian">Kompetensi Keahlian / Jurusan</Label>
                            <Input
                                id="edit_kompetensi_keahlian"
                                value={editForm.data.kompetensi_keahlian}
                                onChange={(e) => editForm.setData('kompetensi_keahlian', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.kompetensi_keahlian} />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingKelas(null)}
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
            <Dialog open={!!deletingKelas} onOpenChange={(open) => !open && setDeletingKelas(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Kelas</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kelas{' '}
                            <strong>{deletingKelas?.nama_kelas}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingKelas(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={submitDelete}
                        >
                            Ya, Hapus Kelas
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

KelasIndex.layout = {
    breadcrumbs,
};

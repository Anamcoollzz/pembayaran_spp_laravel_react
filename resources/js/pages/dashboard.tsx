import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    CreditCard,
    DollarSign,
    GraduationCap,
    PlusCircle,
    Receipt,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import { index as kelasIndex } from '@/routes/kelas';
import { create as pembayaranCreate, index as pembayaranIndex } from '@/routes/pembayaran-spp';
import { index as siswaIndex } from '@/routes/siswa';
import { index as sppIndex } from '@/routes/spp';
import type { BreadcrumbItem, Kelas, PembayaranSpp } from '@/types';

type Props = {
    stats: {
        total_siswa: number;
        total_kelas: number;
        total_spp: number;
        total_bulan_ini: number;
        total_tahun_ini: number;
    };
    recentTransactions: PembayaranSpp[];
    kelasList: Kelas[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard({ stats, recentTransactions = [], kelasList = [] }: Props) {
    const formatRupiah = (val: number | string | undefined | null) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(val || 0));
    };

    return (
        <>
            <Head title="Dashboard SPP" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                {/* Header & Quick Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Dashboard Sistem Pembayaran SPP"
                        description="Ringkasan rekapitulasi data master siswa, kelas, dan pemasukan SPP sekolah"
                    />
                    <div className="flex flex-wrap gap-2">
                        <Button asChild>
                            <Link href={pembayaranCreate()}>
                                <PlusCircle className="size-4" data-icon="inline-start" />
                                Bayar SPP
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 4 Statistik Utama */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Penerimaan Bulan Ini
                            </CardTitle>
                            <DollarSign className="size-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatRupiah(stats?.total_bulan_ini)}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <TrendingUp className="size-3 text-emerald-600" />
                                Bulan {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Tahun {new Date().getFullYear()}
                            </CardTitle>
                            <Wallet className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {formatRupiah(stats?.total_tahun_ini)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Akumulasi penerimaan tahun berjalan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Siswa
                            </CardTitle>
                            <Users className="size-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {stats?.total_siswa ?? 0} Siswa
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Terdaftar di seluruh kelas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Kelas
                            </CardTitle>
                            <GraduationCap className="size-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {stats?.total_kelas ?? 0} Rombel
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Tingkat X, XI, dan XII
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <Link
                        href={pembayaranIndex()}
                        className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                    >
                        <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <CreditCard className="size-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Transaksi SPP</p>
                            <p className="text-xs text-muted-foreground">Lihat riwayat pembayaran</p>
                        </div>
                    </Link>

                    <Link
                        href={siswaIndex()}
                        className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                    >
                        <div className="flex size-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Users className="size-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Master Siswa</p>
                            <p className="text-xs text-muted-foreground">Kelola data murid & NISN</p>
                        </div>
                    </Link>

                    <Link
                        href={kelasIndex()}
                        className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                    >
                        <div className="flex size-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <GraduationCap className="size-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Master Kelas</p>
                            <p className="text-xs text-muted-foreground">Kelola rombel & kejuruan</p>
                        </div>
                    </Link>

                    <Link
                        href={sppIndex()}
                        className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                    >
                        <div className="flex size-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Receipt className="size-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Tarif SPP</p>
                            <p className="text-xs text-muted-foreground">Atur biaya SPP per angkatan</p>
                        </div>
                    </Link>
                </div>

                {/* Transaksi Terkini & Distribusi Kelas */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Transaksi Terkini */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Transaksi Pembayaran Terkini</CardTitle>
                                <CardDescription>5 transaksi pembayaran SPP terakhir</CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={pembayaranIndex()} className="flex items-center gap-1">
                                    Semua Transaksi
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode / Tgl</TableHead>
                                            <TableHead>Siswa</TableHead>
                                            <TableHead>Bulan</TableHead>
                                            <TableHead>Jumlah</TableHead>
                                            <TableHead>Metode</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTransactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    Belum ada transaksi pembayaran tercatat
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            recentTransactions.map((trx) => (
                                                <TableRow key={trx.id}>
                                                    <TableCell>
                                                        <div className="flex flex-col font-mono text-xs">
                                                            <span className="font-semibold">{trx.kode_transaksi}</span>
                                                            <span className="text-muted-foreground">{trx.tanggal_bayar}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-foreground">{trx.siswa?.nama}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {trx.siswa?.kelas?.nama_kelas}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs">
                                                            {trx.bulan_dibayar} {trx.tahun_dibayar}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        {formatRupiah(trx.jumlah_bayar)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {trx.metode_pembayaran}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Distribusi Siswa per Kelas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Kelas</CardTitle>
                            <CardDescription>Jumlah siswa per rombel kelas</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {kelasList.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada data kelas</p>
                            ) : (
                                kelasList.slice(0, 6).map((k) => (
                                    <div
                                        key={k.id}
                                        className="flex items-center justify-between rounded-lg border p-3 text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{k.tingkat}</Badge>
                                            <span className="font-medium">{k.nama_kelas}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Users className="size-3.5" />
                                            <span className="font-semibold text-foreground">{k.siswas_count ?? 0}</span>
                                        </div>
                                    </div>
                                ))
                            )}

                            {kelasList.length > 6 && (
                                <Button asChild variant="outline" size="sm" className="mt-1 w-full">
                                    <Link href={kelasIndex()}>
                                        Lihat Semua ({kelasList.length}) Kelas
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs,
};

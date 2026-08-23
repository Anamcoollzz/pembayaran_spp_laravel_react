import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    CreditCard,
    GraduationCap,
    LayoutDashboard,
    Lock,
    Receipt,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Sistem Informasi Pembayaran SPP" />

            <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-emerald-500 selection:text-white">
                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
                                <AppLogoIcon className="size-6" />
                            </div>
                            <div>
                                <span className="text-base font-bold tracking-tight text-foreground">
                                    SPP Online
                                </span>
                                <span className="block text-[11px] text-muted-foreground">
                                    Sistem Keuangan Sekolah
                                </span>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>
                                        <LayoutDashboard className="size-4" data-icon="inline-start" />
                                        Buka Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={login()}>
                                            <Lock className="size-4" data-icon="inline-start" />
                                            Masuk Petugas
                                        </Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href={register()}>
                                            Daftar Akun
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1">
                    <section className="relative overflow-hidden px-6 py-16 md:py-24">
                        {/* Background subtle gradient orb */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                            <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300">
                                <ShieldCheck className="size-3.5 text-emerald-600" />
                                Portal Keuangan & Pembayaran SPP Sekolah
                            </Badge>

                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                                Kelola Pembayaran SPP Lebih <span className="text-emerald-600 dark:text-emerald-400">Cepat & Transparan</span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
                                Aplikasi manajemen pembayaran SPP terpadu untuk staf Tata Usaha, wali murid, dan siswa. Dilengkapi sistem pencatatan multi-bulan, bukti kwitansi otomatis, dan rekapitulasi real-time.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                {auth.user ? (
                                    <Button asChild size="lg" className="h-12 px-6 shadow-md shadow-primary/20">
                                        <Link href={dashboard()} className="flex items-center gap-2">
                                            Menuju Dashboard
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild size="lg" className="h-12 px-6 shadow-md shadow-primary/20">
                                            <Link href={login()} className="flex items-center gap-2">
                                                Masuk Aplikasi
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="h-12 px-6">
                                            <Link href={register()}>
                                                Registrasi Akun Baru
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="border-t border-border/40 bg-muted/30 px-6 py-16">
                        <div className="mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Fitur Unggulan Sistem SPP
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Solusi komprehensif administrasi keuangan sekolah modern
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <Card className="border-border/60 bg-card/60 backdrop-blur-xs transition-all hover:border-emerald-500/50 hover:shadow-md">
                                    <CardContent className="pt-6">
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                                            <CreditCard className="size-6" />
                                        </div>
                                        <h3 className="font-semibold text-foreground text-base">Entri Transaksi Fleksibel</h3>
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                            Mendukung pembayaran satu atau banyak bulan sekaligus dengan pilihan metode Tunai, Transfer, dan QRIS.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/60 bg-card/60 backdrop-blur-xs transition-all hover:border-emerald-500/50 hover:shadow-md">
                                    <CardContent className="pt-6">
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4">
                                            <Users className="size-6" />
                                        </div>
                                        <h3 className="font-semibold text-foreground text-base">Master Siswa & NISN</h3>
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                            Manajemen data induk siswa, penempatan rombel kelas, tarif SPP angkatan, dan riwayat kelulusan pembayaran.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/60 bg-card/60 backdrop-blur-xs transition-all hover:border-emerald-500/50 hover:shadow-md">
                                    <CardContent className="pt-6">
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
                                            <Receipt className="size-6" />
                                        </div>
                                        <h3 className="font-semibold text-foreground text-base">Cetak Kwitansi Otomatis</h3>
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                            Penerbitan bukti pembayaran resmi dan kwitansi yang siap langsung dicetak untuk arsip dan tanda terima wali murid.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/60 bg-card/60 backdrop-blur-xs transition-all hover:border-emerald-500/50 hover:shadow-md">
                                    <CardContent className="pt-6">
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
                                            <GraduationCap className="size-6" />
                                        </div>
                                        <h3 className="font-semibold text-foreground text-base">Master Kelas & Jurusan</h3>
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                            Pengelompokan tingkat kelas (X, XI, XII) dan jurusan dengan penghitungan otomatis jumlah siswa terdaftar.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p>© {new Date().getFullYear()} SPP Online — Sistem Pembayaran SPP Sekolah.</p>
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            <span>Siap Digunakan untuk Tahun Ajaran {new Date().getFullYear()}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

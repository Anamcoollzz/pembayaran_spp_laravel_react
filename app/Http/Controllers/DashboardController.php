<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\PembayaranSpp;
use App\Models\Siswa;
use App\Models\Spp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the application dashboard.
     */
    public function index(Request $request): Response
    {
        $currentMonth = (int) now()->month;
        $currentYear = (int) now()->year;

        $totalSiswa = Siswa::count();
        $totalKelas = Kelas::count();
        $totalSppTarif = Spp::count();

        $totalPenerimaanBulanIni = (float) PembayaranSpp::whereMonth('tanggal_bayar', $currentMonth)
            ->whereYear('tanggal_bayar', $currentYear)
            ->sum('jumlah_bayar');

        $totalPenerimaanTahunIni = (float) PembayaranSpp::whereYear('tanggal_bayar', $currentYear)
            ->sum('jumlah_bayar');

        $recentTransactions = PembayaranSpp::with(['siswa.kelas', 'user'])
            ->orderByDesc('tanggal_bayar')
            ->orderByDesc('id')
            ->limit(5)
            ->get();

        $kelasList = Kelas::withCount('siswas')
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_siswa' => $totalSiswa,
                'total_kelas' => $totalKelas,
                'total_spp' => $totalSppTarif,
                'total_bulan_ini' => $totalPenerimaanBulanIni,
                'total_tahun_ini' => $totalPenerimaanTahunIni,
            ],
            'recentTransactions' => $recentTransactions,
            'kelasList' => $kelasList,
        ]);
    }
}

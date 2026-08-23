<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\PembayaranSpp;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PembayaranSppController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $bulan = $request->query('bulan');
        $tahun = $request->query('tahun') ?: (string) date('Y');
        $kelasId = $request->query('kelas_id');

        $pembayaran = PembayaranSpp::query()
            ->with(['siswa.kelas', 'siswa.spp', 'user'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kode_transaksi', 'like', "%{$search}%")
                        ->orWhereHas('siswa', function ($sq) use ($search) {
                            $sq->where('nama', 'like', "%{$search}%")
                                ->orWhere('nisn', 'like', "%{$search}%")
                                ->orWhere('nis', 'like', "%{$search}%");
                        });
                });
            })
            ->when($bulan, function ($query, $bulan) {
                $query->where('bulan_dibayar', $bulan);
            })
            ->when($tahun, function ($query, $tahun) {
                $query->where('tahun_dibayar', (int) $tahun);
            })
            ->when($kelasId, function ($query, $kelasId) {
                $query->whereHas('siswa', function ($sq) use ($kelasId) {
                    $sq->where('kelas_id', $kelasId);
                });
            })
            ->orderByDesc('tanggal_bayar')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        $kelasList = Kelas::orderBy('tingkat')->orderBy('nama_kelas')->get();

        $totalToday = PembayaranSpp::whereDate('tanggal_bayar', now()->toDateString())->sum('jumlah_bayar');
        $totalMonth = PembayaranSpp::whereMonth('tanggal_bayar', now()->month)
            ->whereYear('tanggal_bayar', now()->year)
            ->sum('jumlah_bayar');

        return Inertia::render('pembayaran/index', [
            'pembayaranList' => $pembayaran,
            'kelasList' => $kelasList,
            'stats' => [
                'total_today' => (float) $totalToday,
                'total_month' => (float) $totalMonth,
            ],
            'filters' => [
                'search' => $search ?? '',
                'bulan' => $bulan ?? '',
                'tahun' => (string) $tahun,
                'kelas_id' => $kelasId ?? '',
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $siswas = Siswa::with(['kelas', 'spp'])
            ->orderBy('nama')
            ->get();

        $selectedSiswaId = $request->query('siswa_id');

        return Inertia::render('pembayaran/create', [
            'siswas' => $siswas,
            'selectedSiswaId' => $selectedSiswaId ? (int) $selectedSiswaId : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'siswa_id' => ['required', 'exists:siswas,id'],
            'tanggal_bayar' => ['required', 'date'],
            'tahun_dibayar' => ['required', 'integer', 'min:2000', 'max:2100'],
            'bulan_dibayar' => ['required', 'array', 'min:1'],
            'bulan_dibayar.*' => ['required', 'string'],
            'jumlah_per_bulan' => ['required', 'numeric', 'min:1'],
            'metode_pembayaran' => ['required', 'string', 'in:Tunai,Transfer Bank,QRIS'],
            'catatan' => ['nullable', 'string'],
        ]);

        $siswa = Siswa::with('spp')->findOrFail($request->siswa_id);
        $userId = $request->user()->id;
        $tahun = (int) $request->tahun_dibayar;
        $tanggal = $request->tanggal_bayar;
        $metode = $request->metode_pembayaran;
        $catatan = $request->catatan;
        $jumlahPerBulan = (float) $request->jumlah_per_bulan;

        // Check if any selected month has already been paid
        $alreadyPaid = PembayaranSpp::where('siswa_id', $siswa->id)
            ->where('tahun_dibayar', $tahun)
            ->whereIn('bulan_dibayar', $request->bulan_dibayar)
            ->pluck('bulan_dibayar')
            ->toArray();

        if (! empty($alreadyPaid)) {
            return back()->with('error', 'Bulan '.implode(', ', $alreadyPaid).' sudah pernah dibayar untuk tahun '.$tahun.'.');
        }

        DB::transaction(function () use ($siswa, $userId, $tanggal, $tahun, $request, $jumlahPerBulan, $metode, $catatan) {
            $batchCode = 'SPP-'.date('Ym').'-'.str_pad((string) mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);

            foreach ($request->bulan_dibayar as $index => $bulan) {
                $kodeTransaksi = count($request->bulan_dibayar) > 1
                    ? "{$batchCode}-".($index + 1)
                    : $batchCode;

                PembayaranSpp::create([
                    'kode_transaksi' => $kodeTransaksi,
                    'user_id' => $userId,
                    'siswa_id' => $siswa->id,
                    'tanggal_bayar' => $tanggal,
                    'bulan_dibayar' => $bulan,
                    'tahun_dibayar' => $tahun,
                    'jumlah_bayar' => $jumlahPerBulan,
                    'metode_pembayaran' => $metode,
                    'catatan' => $catatan,
                ]);
            }
        });

        $totalBayar = count($request->bulan_dibayar) * $jumlahPerBulan;

        return redirect()->route('pembayaran-spp.index')->with(
            'success',
            'Pembayaran SPP a.n. '.$siswa->nama.' ('.count($request->bulan_dibayar).' bulan - Rp '.number_format($totalBayar, 0, ',', '.').') berhasil dicatat.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PembayaranSpp $pembayaranSpp): RedirectResponse
    {
        $pembayaranSpp->delete();

        return redirect()->route('pembayaran-spp.index')->with('success', 'Transaksi pembayaran berhasil dihapus.');
    }
}

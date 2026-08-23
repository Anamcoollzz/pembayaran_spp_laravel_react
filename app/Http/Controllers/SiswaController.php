<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Spp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $kelasId = $request->query('kelas_id');

        $siswas = Siswa::query()
            ->with(['kelas', 'spp'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($kelasId, function ($query, $kelasId) {
                $query->where('kelas_id', $kelasId);
            })
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        $kelasList = Kelas::orderBy('tingkat')->orderBy('nama_kelas')->get();
        $sppList = Spp::orderByDesc('tahun')->get();

        return Inertia::render('siswa/index', [
            'siswas' => $siswas,
            'kelasList' => $kelasList,
            'sppList' => $sppList,
            'filters' => [
                'search' => $search ?? '',
                'kelas_id' => $kelasId ?? '',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nisn' => ['required', 'string', 'size:10', 'unique:siswas,nisn'],
            'nis' => ['required', 'string', 'max:10', 'unique:siswas,nis'],
            'nama' => ['required', 'string', 'max:100'],
            'jenis_kelamin' => ['required', 'in:L,P'],
            'kelas_id' => ['required', 'exists:kelas,id'],
            'spp_id' => ['nullable', 'exists:spp,id'],
            'alamat' => ['nullable', 'string'],
            'no_telp' => ['nullable', 'string', 'max:20'],
        ]);

        Siswa::create($validated);

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Siswa $siswa): RedirectResponse
    {
        $validated = $request->validate([
            'nisn' => ['required', 'string', 'size:10', 'unique:siswas,nisn,'.$siswa->id],
            'nis' => ['required', 'string', 'max:10', 'unique:siswas,nis,'.$siswa->id],
            'nama' => ['required', 'string', 'max:100'],
            'jenis_kelamin' => ['required', 'in:L,P'],
            'kelas_id' => ['required', 'exists:kelas,id'],
            'spp_id' => ['nullable', 'exists:spp,id'],
            'alamat' => ['nullable', 'string'],
            'no_telp' => ['nullable', 'string', 'max:20'],
        ]);

        $siswa->update($validated);

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa): RedirectResponse
    {
        $siswa->delete();

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil dihapus.');
    }

    /**
     * Get payment history and unpaid months for the given student.
     */
    public function paymentStatus(Request $request, Siswa $siswa): JsonResponse
    {
        $tahun = (int) ($request->query('tahun') ?: date('Y'));

        $payments = $siswa->pembayaranSpps()
            ->with('user')
            ->where('tahun_dibayar', $tahun)
            ->get();

        $allMonths = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
        ];

        $paidMonths = $payments->pluck('bulan_dibayar')->toArray();
        $unpaidMonths = array_values(array_diff($allMonths, $paidMonths));

        return response()->json([
            'siswa' => $siswa->load(['kelas', 'spp']),
            'tahun' => $tahun,
            'nominal_spp' => $siswa->spp?->nominal ?? 0,
            'paid_months' => $paidMonths,
            'unpaid_months' => $unpaidMonths,
            'payments' => $payments,
        ]);
    }
}

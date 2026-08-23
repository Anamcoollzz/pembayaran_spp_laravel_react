<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $kelas = Kelas::query()
            ->withCount('siswas')
            ->when($search, function ($query, $search) {
                $query->where('nama_kelas', 'like', "%{$search}%")
                    ->orWhere('kompetensi_keahlian', 'like', "%{$search}%")
                    ->orWhere('tingkat', 'like', "%{$search}%");
            })
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('kelas/index', [
            'kelasList' => $kelas,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kelas' => ['required', 'string', 'max:50', 'unique:kelas,nama_kelas'],
            'kompetensi_keahlian' => ['required', 'string', 'max:100'],
            'tingkat' => ['required', 'string', 'max:10'],
        ]);

        Kelas::create($validated);

        return redirect()->route('kelas.index')->with('success', 'Data kelas berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kelas $kela): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kelas' => ['required', 'string', 'max:50', 'unique:kelas,nama_kelas,'.$kela->id],
            'kompetensi_keahlian' => ['required', 'string', 'max:100'],
            'tingkat' => ['required', 'string', 'max:10'],
        ]);

        $kela->update($validated);

        return redirect()->route('kelas.index')->with('success', 'Data kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelas $kela): RedirectResponse
    {
        if ($kela->siswas()->exists()) {
            return redirect()->route('kelas.index')->with('error', 'Kelas tidak dapat dihapus karena masih memiliki data siswa.');
        }

        $kela->delete();

        return redirect()->route('kelas.index')->with('success', 'Data kelas berhasil dihapus.');
    }
}

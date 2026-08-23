<?php

namespace App\Http\Controllers;

use App\Models\Spp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SppController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $spp = Spp::query()
            ->withCount('siswas')
            ->when($search, function ($query, $search) {
                $query->where('tahun', 'like', "%{$search}%")
                    ->orWhere('nominal', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%");
            })
            ->orderByDesc('tahun')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('spp/index', [
            'sppList' => $spp,
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
            'tahun' => ['required', 'integer', 'min:2000', 'max:2100', 'unique:spp,tahun'],
            'nominal' => ['required', 'numeric', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        Spp::create($validated);

        return redirect()->route('spp.index')->with('success', 'Tarif SPP berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Spp $spp): RedirectResponse
    {
        $validated = $request->validate([
            'tahun' => ['required', 'integer', 'min:2000', 'max:2100', 'unique:spp,tahun,'.$spp->id],
            'nominal' => ['required', 'numeric', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        $spp->update($validated);

        return redirect()->route('spp.index')->with('success', 'Tarif SPP berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Spp $spp): RedirectResponse
    {
        if ($spp->siswas()->exists()) {
            return redirect()->route('spp.index')->with('error', 'Tarif SPP tidak dapat dihapus karena masih digunakan oleh data siswa.');
        }

        $spp->delete();

        return redirect()->route('spp.index')->with('success', 'Tarif SPP berhasil dihapus.');
    }
}

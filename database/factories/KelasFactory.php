<?php

namespace Database\Factories;

use App\Models\Kelas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kelas>
 */
class KelasFactory extends Factory
{
    protected $model = Kelas::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tingkat = fake()->randomElement(['X', 'XI', 'XII']);
        $jurusan = fake()->randomElement([
            'Rekayasa Perangkat Lunak',
            'Teknik Komputer & Jaringan',
            'Desain Komunikasi Visual',
            'Akuntansi',
        ]);
        $nomor = fake()->numberBetween(1, 3);

        return [
            'nama_kelas' => "{$tingkat} {$jurusan} {$nomor}",
            'kompetensi_keahlian' => $jurusan,
            'tingkat' => $tingkat,
        ];
    }
}

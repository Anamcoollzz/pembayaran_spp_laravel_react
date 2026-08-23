<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Spp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Siswa>
 */
class SiswaFactory extends Factory
{
    protected $model = Siswa::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nisn' => fake()->unique()->numerify('00########'),
            'nis' => fake()->unique()->numerify('2026####'),
            'nama' => fake()->name(),
            'jenis_kelamin' => fake()->randomElement(['L', 'P']),
            'kelas_id' => Kelas::factory(),
            'spp_id' => Spp::factory(),
            'alamat' => fake()->address(),
            'no_telp' => fake()->phoneNumber(),
        ];
    }
}

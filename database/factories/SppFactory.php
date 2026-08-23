<?php

namespace Database\Factories;

use App\Models\Spp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Spp>
 */
class SppFactory extends Factory
{
    protected $model = Spp::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tahun = fake()->numberBetween(2024, 2027);

        return [
            'tahun' => $tahun,
            'nominal' => fake()->randomElement([200000, 250000, 300000, 350000]),
            'keterangan' => "Tarif SPP Tahun Ajaran {$tahun}",
        ];
    }
}

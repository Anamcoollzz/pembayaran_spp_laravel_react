<?php

namespace Database\Factories;

use App\Models\PembayaranSpp;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PembayaranSpp>
 */
class PembayaranSppFactory extends Factory
{
    protected $model = PembayaranSpp::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $bulan = fake()->randomElement([
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
        ]);

        return [
            'kode_transaksi' => 'SPP-'.fake()->unique()->numerify('######'),
            'user_id' => User::factory(),
            'siswa_id' => Siswa::factory(),
            'tanggal_bayar' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'bulan_dibayar' => $bulan,
            'tahun_dibayar' => (int) date('Y'),
            'jumlah_bayar' => 250000,
            'metode_pembayaran' => fake()->randomElement(['Tunai', 'Transfer Bank', 'QRIS']),
            'catatan' => fake()->optional()->sentence(),
        ];
    }
}

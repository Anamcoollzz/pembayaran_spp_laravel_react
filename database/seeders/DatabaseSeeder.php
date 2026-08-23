<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\PembayaranSpp;
use App\Models\Siswa;
use App\Models\Spp;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@spp.com'],
            [
                'name' => 'Petugas TU Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Seed SPP Rates
        $spp2024 = Spp::firstOrCreate(['tahun' => 2024], ['nominal' => 200000, 'keterangan' => 'Tarif SPP TA 2023/2024']);
        $spp2025 = Spp::firstOrCreate(['tahun' => 2025], ['nominal' => 250000, 'keterangan' => 'Tarif SPP TA 2024/2025']);
        $spp2026 = Spp::firstOrCreate(['tahun' => 2026], ['nominal' => 300000, 'keterangan' => 'Tarif SPP TA 2025/2026']);

        // Seed Kelas
        $kelasList = [
            ['nama_kelas' => 'X RPL 1', 'kompetensi_keahlian' => 'Rekayasa Perangkat Lunak', 'tingkat' => 'X'],
            ['nama_kelas' => 'X TKJ 1', 'kompetensi_keahlian' => 'Teknik Komputer & Jaringan', 'tingkat' => 'X'],
            ['nama_kelas' => 'XI RPL 1', 'kompetensi_keahlian' => 'Rekayasa Perangkat Lunak', 'tingkat' => 'XI'],
            ['nama_kelas' => 'XI DKV 1', 'kompetensi_keahlian' => 'Desain Komunikasi Visual', 'tingkat' => 'XI'],
            ['nama_kelas' => 'XII RPL 1', 'kompetensi_keahlian' => 'Rekayasa Perangkat Lunak', 'tingkat' => 'XII'],
            ['nama_kelas' => 'XII AK 1', 'kompetensi_keahlian' => 'Akuntansi Keuangan Lembaga', 'tingkat' => 'XII'],
        ];

        $createdKelas = [];
        foreach ($kelasList as $item) {
            $createdKelas[] = Kelas::firstOrCreate(
                ['nama_kelas' => $item['nama_kelas']],
                $item
            );
        }

        // Seed Siswa
        $siswaData = [
            [
                'nisn' => '0081234561',
                'nis' => '260101',
                'nama' => 'Ahmad Fajar Prasetyo',
                'jenis_kelamin' => 'L',
                'kelas_id' => $createdKelas[0]->id,
                'spp_id' => $spp2026->id,
                'alamat' => 'Jl. Merdeka No. 12, Jakarta Timur',
                'no_telp' => '081234567890',
            ],
            [
                'nisn' => '0081234562',
                'nis' => '260102',
                'nama' => 'Siti Nurhaliza',
                'jenis_kelamin' => 'P',
                'kelas_id' => $createdKelas[0]->id,
                'spp_id' => $spp2026->id,
                'alamat' => 'Jl. Sudirman No. 45, Jakarta Pusat',
                'no_telp' => '081298765432',
            ],
            [
                'nisn' => '0071234563',
                'nis' => '250201',
                'nama' => 'Budi Santoso',
                'jenis_kelamin' => 'L',
                'kelas_id' => $createdKelas[2]->id,
                'spp_id' => $spp2025->id,
                'alamat' => 'Jl. Pahlawan No. 8, Bekasi',
                'no_telp' => '085712345678',
            ],
            [
                'nisn' => '0071234564',
                'nis' => '250202',
                'nama' => 'Dwi Lestari',
                'jenis_kelamin' => 'P',
                'kelas_id' => $createdKelas[3]->id,
                'spp_id' => $spp2025->id,
                'alamat' => 'Jl. Kenanga No. 19, Depok',
                'no_telp' => '087812345678',
            ],
            [
                'nisn' => '0061234565',
                'nis' => '240301',
                'nama' => 'Rizky Pratama',
                'jenis_kelamin' => 'L',
                'kelas_id' => $createdKelas[4]->id,
                'spp_id' => $spp2024->id,
                'alamat' => 'Jl. Melati No. 55, Bogor',
                'no_telp' => '089612345678',
            ],
        ];

        $createdSiswa = [];
        foreach ($siswaData as $item) {
            $createdSiswa[] = Siswa::firstOrCreate(
                ['nisn' => $item['nisn']],
                $item
            );
        }

        // Seed Sample Payments
        $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus'];
        $currentYear = (int) date('Y');

        // Ahmad pays Jan, Feb, Mar
        foreach (['Januari', 'Februari', 'Maret'] as $index => $month) {
            PembayaranSpp::firstOrCreate(
                [
                    'siswa_id' => $createdSiswa[0]->id,
                    'bulan_dibayar' => $month,
                    'tahun_dibayar' => $currentYear,
                ],
                [
                    'kode_transaksi' => 'SPP-'.date('Ym').'-000'.($index + 1),
                    'user_id' => $admin->id,
                    'tanggal_bayar' => now()->subMonths(3 - $index)->format('Y-m-d'),
                    'jumlah_bayar' => $spp2026->nominal,
                    'metode_pembayaran' => 'Tunai',
                    'catatan' => 'Lunas kasir TU',
                ]
            );
        }

        // Siti pays Jan, Feb
        foreach (['Januari', 'Februari'] as $index => $month) {
            PembayaranSpp::firstOrCreate(
                [
                    'siswa_id' => $createdSiswa[1]->id,
                    'bulan_dibayar' => $month,
                    'tahun_dibayar' => $currentYear,
                ],
                [
                    'kode_transaksi' => 'SPP-'.date('Ym').'-001'.($index + 1),
                    'user_id' => $admin->id,
                    'tanggal_bayar' => now()->subMonths(2 - $index)->format('Y-m-d'),
                    'jumlah_bayar' => $spp2026->nominal,
                    'metode_pembayaran' => 'Transfer Bank',
                    'catatan' => 'Transfer via BCA',
                ]
            );
        }
    }
}

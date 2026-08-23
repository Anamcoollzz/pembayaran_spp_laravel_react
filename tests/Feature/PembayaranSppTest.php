<?php

use App\Models\PembayaranSpp;
use App\Models\Siswa;
use App\Models\User;

test('authenticated user can view pembayaran spp index', function () {
    $user = User::factory()->create();
    PembayaranSpp::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('pembayaran-spp.index'));

    $response->assertOk();
});

test('authenticated user can view create payment page', function () {
    $user = User::factory()->create();
    Siswa::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('pembayaran-spp.create'));

    $response->assertOk();
});

test('user can store a single month payment', function () {
    $user = User::factory()->create();
    $siswa = Siswa::factory()->create();

    $response = $this->actingAs($user)->post(route('pembayaran-spp.store'), [
        'siswa_id' => $siswa->id,
        'tanggal_bayar' => now()->toDateString(),
        'tahun_dibayar' => 2026,
        'bulan_dibayar' => ['Januari'],
        'jumlah_per_bulan' => 250000,
        'metode_pembayaran' => 'Tunai',
        'catatan' => 'Pembayaran kasir',
    ]);

    $response->assertRedirect(route('pembayaran-spp.index'));
    $this->assertDatabaseHas('pembayaran_spp', [
        'siswa_id' => $siswa->id,
        'bulan_dibayar' => 'Januari',
        'tahun_dibayar' => 2026,
        'jumlah_bayar' => 250000,
    ]);
});

test('user can store multiple months payment in one transaction', function () {
    $user = User::factory()->create();
    $siswa = Siswa::factory()->create();

    $response = $this->actingAs($user)->post(route('pembayaran-spp.store'), [
        'siswa_id' => $siswa->id,
        'tanggal_bayar' => now()->toDateString(),
        'tahun_dibayar' => 2026,
        'bulan_dibayar' => ['Januari', 'Februari', 'Maret'],
        'jumlah_per_bulan' => 300000,
        'metode_pembayaran' => 'Transfer Bank',
        'catatan' => 'Lunas 3 bulan',
    ]);

    $response->assertRedirect(route('pembayaran-spp.index'));
    $this->assertDatabaseCount('pembayaran_spp', 3);
    $this->assertDatabaseHas('pembayaran_spp', [
        'siswa_id' => $siswa->id,
        'bulan_dibayar' => 'Februari',
        'jumlah_bayar' => 300000,
    ]);
});

test('cannot pay the same month twice for the same year', function () {
    $user = User::factory()->create();
    $siswa = Siswa::factory()->create();

    PembayaranSpp::factory()->create([
        'siswa_id' => $siswa->id,
        'bulan_dibayar' => 'Januari',
        'tahun_dibayar' => 2026,
    ]);

    $response = $this->actingAs($user)->post(route('pembayaran-spp.store'), [
        'siswa_id' => $siswa->id,
        'tanggal_bayar' => now()->toDateString(),
        'tahun_dibayar' => 2026,
        'bulan_dibayar' => ['Januari'],
        'jumlah_per_bulan' => 250000,
        'metode_pembayaran' => 'Tunai',
    ]);

    $response->assertSessionHas('error');
    $this->assertDatabaseCount('pembayaran_spp', 1);
});

test('user can delete a payment transaction', function () {
    $user = User::factory()->create();
    $pembayaran = PembayaranSpp::factory()->create();

    $response = $this->actingAs($user)->delete(route('pembayaran-spp.destroy', $pembayaran));

    $response->assertRedirect(route('pembayaran-spp.index'));
    $this->assertDatabaseMissing('pembayaran_spp', ['id' => $pembayaran->id]);
});

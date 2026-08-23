<?php

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Spp;
use App\Models\User;

test('authenticated user can view siswa index', function () {
    $user = User::factory()->create();
    Siswa::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('siswa.index'));

    $response->assertOk();
});

test('user can create a new siswa', function () {
    $user = User::factory()->create();
    $kelas = Kelas::factory()->create();
    $spp = Spp::factory()->create();

    $response = $this->actingAs($user)->post(route('siswa.store'), [
        'nisn' => '0098765432',
        'nis' => '260999',
        'nama' => 'Muhammad Rizki',
        'jenis_kelamin' => 'L',
        'kelas_id' => $kelas->id,
        'spp_id' => $spp->id,
        'alamat' => 'Jl. Kebon Jeruk No. 10',
        'no_telp' => '081234567890',
    ]);

    $response->assertRedirect(route('siswa.index'));
    $this->assertDatabaseHas('siswas', [
        'nisn' => '0098765432',
        'nama' => 'Muhammad Rizki',
    ]);
});

test('user can update an existing siswa', function () {
    $user = User::factory()->create();
    $siswa = Siswa::factory()->create();

    $response = $this->actingAs($user)->put(route('siswa.update', $siswa), [
        'nisn' => $siswa->nisn,
        'nis' => $siswa->nis,
        'nama' => 'Nama Siswa Update',
        'jenis_kelamin' => 'P',
        'kelas_id' => $siswa->kelas_id,
        'spp_id' => $siswa->spp_id,
        'alamat' => 'Alamat baru',
        'no_telp' => '0899999999',
    ]);

    $response->assertRedirect(route('siswa.index'));
    $this->assertDatabaseHas('siswas', [
        'id' => $siswa->id,
        'nama' => 'Nama Siswa Update',
        'jenis_kelamin' => 'P',
    ]);
});

test('user can delete a siswa', function () {
    $user = User::factory()->create();
    $siswa = Siswa::factory()->create();

    $response = $this->actingAs($user)->delete(route('siswa.destroy', $siswa));

    $response->assertRedirect(route('siswa.index'));
    $this->assertDatabaseMissing('siswas', ['id' => $siswa->id]);
});

test('can retrieve payment status json for a student', function () {
    $user = User::factory()->create();
    $siswa = Siswa::factory()->create();

    $response = $this->actingAs($user)->get(route('siswa.payment-status', $siswa));

    $response->assertOk()
        ->assertJsonStructure([
            'siswa',
            'tahun',
            'nominal_spp',
            'paid_months',
            'unpaid_months',
            'payments',
        ]);
});

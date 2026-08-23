<?php

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;

test('authenticated user can view kelas index', function () {
    $user = User::factory()->create();
    Kelas::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('kelas.index'));

    $response->assertOk();
});

test('user can create a new kelas', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('kelas.store'), [
        'nama_kelas' => 'X RPL 99',
        'kompetensi_keahlian' => 'Rekayasa Perangkat Lunak',
        'tingkat' => 'X',
    ]);

    $response->assertRedirect(route('kelas.index'));
    $this->assertDatabaseHas('kelas', [
        'nama_kelas' => 'X RPL 99',
    ]);
});

test('user can update an existing kelas', function () {
    $user = User::factory()->create();
    $kelas = Kelas::factory()->create();

    $response = $this->actingAs($user)->put(route('kelas.update', $kelas), [
        'nama_kelas' => 'XI RPL Update',
        'kompetensi_keahlian' => 'RPL',
        'tingkat' => 'XI',
    ]);

    $response->assertRedirect(route('kelas.index'));
    $this->assertDatabaseHas('kelas', [
        'id' => $kelas->id,
        'nama_kelas' => 'XI RPL Update',
    ]);
});

test('user can delete kelas without students', function () {
    $user = User::factory()->create();
    $kelas = Kelas::factory()->create();

    $response = $this->actingAs($user)->delete(route('kelas.destroy', $kelas));

    $response->assertRedirect(route('kelas.index'));
    $this->assertDatabaseMissing('kelas', ['id' => $kelas->id]);
});

test('kelas with students cannot be deleted', function () {
    $user = User::factory()->create();
    $kelas = Kelas::factory()->create();
    Siswa::factory()->create(['kelas_id' => $kelas->id]);

    $response = $this->actingAs($user)->delete(route('kelas.destroy', $kelas));

    $response->assertRedirect(route('kelas.index'));
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('kelas', ['id' => $kelas->id]);
});

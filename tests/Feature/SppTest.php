<?php

use App\Models\Siswa;
use App\Models\Spp;
use App\Models\User;

test('authenticated user can view spp index', function () {
    $user = User::factory()->create();
    Spp::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('spp.index'));

    $response->assertOk();
});

test('user can create a new spp rate', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('spp.store'), [
        'tahun' => 2030,
        'nominal' => 350000,
        'keterangan' => 'Tarif SPP 2030',
    ]);

    $response->assertRedirect(route('spp.index'));
    $this->assertDatabaseHas('spp', [
        'tahun' => 2030,
        'nominal' => 350000,
    ]);
});

test('user can update an existing spp rate', function () {
    $user = User::factory()->create();
    $spp = Spp::factory()->create(['tahun' => 2031, 'nominal' => 200000]);

    $response = $this->actingAs($user)->put(route('spp.update', $spp), [
        'tahun' => 2031,
        'nominal' => 275000,
        'keterangan' => 'Tarif Revisi 2031',
    ]);

    $response->assertRedirect(route('spp.index'));
    $this->assertDatabaseHas('spp', [
        'id' => $spp->id,
        'nominal' => 275000,
    ]);
});

test('user can delete spp without students', function () {
    $user = User::factory()->create();
    $spp = Spp::factory()->create();

    $response = $this->actingAs($user)->delete(route('spp.destroy', $spp));

    $response->assertRedirect(route('spp.index'));
    $this->assertDatabaseMissing('spp', ['id' => $spp->id]);
});

test('spp with students cannot be deleted', function () {
    $user = User::factory()->create();
    $spp = Spp::factory()->create();
    Siswa::factory()->create(['spp_id' => $spp->id]);

    $response = $this->actingAs($user)->delete(route('spp.destroy', $spp));

    $response->assertRedirect(route('spp.index'));
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('spp', ['id' => $spp->id]);
});

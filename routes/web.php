<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\PembayaranSppController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\SppController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('kelas', KelasController::class)->except(['create', 'show', 'edit']);
    Route::resource('spp', SppController::class)->except(['create', 'show', 'edit']);
    Route::resource('siswa', SiswaController::class)->except(['create', 'show', 'edit']);
    Route::get('siswa/{siswa}/payment-status', [SiswaController::class, 'paymentStatus'])->name('siswa.payment-status');

    Route::resource('pembayaran-spp', PembayaranSppController::class)->except(['show', 'edit', 'update']);
});

require __DIR__.'/settings.php';

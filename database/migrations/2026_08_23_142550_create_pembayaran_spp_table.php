<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pembayaran_spp', function (Blueprint $table) {
            $table->id();
            $table->string('kode_transaksi', 30)->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('siswa_id')->constrained('siswas')->cascadeOnUpdate()->cascadeOnDelete();
            $table->date('tanggal_bayar');
            $table->string('bulan_dibayar', 20);
            $table->unsignedSmallInteger('tahun_dibayar');
            $table->decimal('jumlah_bayar', 12, 2);
            $table->string('metode_pembayaran', 30)->default('Tunai');
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Prevent duplicate payment for same student, month, and year
            $table->unique(['siswa_id', 'bulan_dibayar', 'tahun_dibayar']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran_spp');
    }
};

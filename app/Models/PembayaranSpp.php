<?php

namespace App\Models;

use Database\Factories\PembayaranSppFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PembayaranSpp extends Model
{
    /** @use HasFactory<PembayaranSppFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'pembayaran_spp';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'kode_transaksi',
        'user_id',
        'siswa_id',
        'tanggal_bayar',
        'bulan_dibayar',
        'tahun_dibayar',
        'jumlah_bayar',
        'metode_pembayaran',
        'catatan',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_bayar' => 'date:Y-m-d',
            'tahun_dibayar' => 'integer',
            'jumlah_bayar' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Siswa, $this>
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }
}
